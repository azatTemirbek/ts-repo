import { Args, Command, Flags, ux } from '@oclif/core'
import { FieldEnums, IMethodType, ReturnEnums, Schema } from '../../lib/Modeling/meta-models.js'
import inquirer from 'inquirer'
import { isExists, exportToFile } from '../../lib/utils/file.js'
import { confirm } from '../../utils/index.js'
import { RepositoryGenerator } from '../../lib/Generators/Repository/index.js'

export default class CreateRepository extends Command {
  static description = 'describe the command here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({ char: 'n', description: 'Repository name' }),
    // flag with no value (-v, --verbose)
    verbose: Flags.boolean({ char: 'v' }),
  }

  static args = {
    file: Args.string({ description: 'file to read' }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(CreateRepository)

    const model = flags.name ?? await ux.prompt('Provide Repository Name');
    const schema: Schema = { model, modelPlural: `${model}s` };

    const methods: IMethodType[] = []

    while (await confirm('Shall we add method?')){
      const _async = await confirm('async');
      const _static = await confirm('static');
      const _private = _static ? false : await confirm('private');
      const methodItem: IMethodType = {
        async: _async,
        static: _static,
        private: _private,
        name: await ux.prompt('Provide method Name'),
        args: [],
        returnType: { type: ReturnEnums.void, optional: false },
      }
      const { returnType } = await inquirer.prompt([{
        name: 'returnType',
        message: 'select a returnType',
        type: 'list',
        choices: Object.values(ReturnEnums).map(name => ({ name })),
      }])
      const optional = _static ? false : await confirm('is return type optional');
      methodItem.returnType = { type: returnType, optional }
      while (await confirm('shall we add argument?')) {
        const name = await ux.prompt('Provide Argument Name');
        const {type} = await inquirer.prompt([{
          name: 'type',
          message: `select a type for ${name}`,
          type: 'list',
          choices: Object.values(FieldEnums).map(name => ({ name })),
        }])
        const optional = await confirm(`is ${name} optional argument?`);
        const def = optional ? undefined : await confirm(`does ${name}:${type} has default value`) ? await ux.prompt('default value') : undefined;
        methodItem.args.push({ name, type, optional, default: def })
      } ;
      methods.push(methodItem);
    }

    const { template, fileName: fname, title = '' } = RepositoryGenerator.generate(schema, methods)

    const fileName = args.file ?? fname

    const overwrite = await isExists(fileName) ? await confirm(`File already exists. Overwrite?`) : await confirm(`Will write to ${fileName}?`);
    if (overwrite) {
      await exportToFile(fileName, template)
      this.log(`${title} Done writing to ${fileName}`)
    }
    const jsonPath = `data/repository/${model}.json`
    await exportToFile(jsonPath, JSON.stringify({ schema, fields: methods }, null, 2))
    this.log(`${title} Done writing to json ${fileName}`)

    if (flags.verbose) {
      this.log(template);
    }
  }
}
