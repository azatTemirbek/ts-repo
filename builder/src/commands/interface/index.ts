import { Args, Command, Flags, ux } from '@oclif/core'
import { FieldEnums, IField, Schema } from '../../lib/Modeling/meta-models.js'
import inquirer from 'inquirer'
import { isExists, exportToFile } from '../../lib/utils/file.js'
import { confirm } from '../../utils/index.js'
import { InterfaceGenerator } from '../../lib/Generators/Interface/index.js'

export default class CreateInterface extends Command {
  static description = 'describe the command here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({char: 'n', description: 'Model name'}),
    // flag with no value (-v, --verbose)
    verbose: Flags.boolean({char: 'v'}),
  }

  static args = {
    file: Args.string({description: 'file to read'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(CreateInterface)

    const model = flags.name ?? await ux.prompt('Provide Model Name');
    const modelPlural = await ux.prompt('Provide Plural Model Name', { default: model + 's' });
    const schema: Schema = { model, modelPlural };

    const fields: IField[] = []
    let add = false
    do {
      const name = await ux.prompt('Provide Field Name');
      const { type, readonly, optional, addAnotherField } = await inquirer.prompt([
        {
          name: 'type',
          message: 'select a type',
          type: 'list',
          choices: Object.values(FieldEnums).map(name => ({ name })),
        },
        {
          name: 'readonly',
          message: 'is readonly',
          type: 'confirm',
        },
        {
          name: 'optional',
          message: 'is optional',
          type: 'confirm',
        },
        {
          name: 'addAnotherField',
          message: 'Add another field?',
          type: 'confirm',
        }
      ])
      fields.push({ name, type, readonly, private: false, optional })
      add = addAnotherField
    } while (add);
  
    const { template, fileName: fname , title = ''} = InterfaceGenerator.generate(schema, fields)
    
    const fileName = args.file ?? fname

    const overwrite = await isExists(fileName) ? await confirm(`File already exists. Overwrite?`): await confirm(`Will write to ${fileName}?`);
    if(overwrite){
      await exportToFile(fileName, template)
      this.log(`${title} Done writing to ${fileName}`)
    }
    const jsonPath = `data/interfaces/${model}.json`
    await exportToFile(jsonPath, JSON.stringify({schema, fields}, null, 2))
    this.log(`${title} Done writing to json ${fileName}`)
    
    if(flags.verbose){
      this.log(template);
    }
  }
}
