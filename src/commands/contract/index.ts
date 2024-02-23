import {Args, Command, Flags, ux} from '@oclif/core'

import { DomainGenerator } from '../../lib/Generators/Domain/index.js'
import { IField, Schema } from '../../lib/Modeling/meta-models.js'
import { exportToFile, isExists} from '../../lib/utils/file.js'
import { confirm } from '../../utils/index.js'

export default class CreateDomain extends Command {
  static args = {
    file: Args.string({description: 'file to read'}),
  }

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

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(CreateDomain)

    const model = flags.name ?? await ux.prompt('Provide Model Name');
    const modelPlural = await ux.prompt('Provide Plural Model Name', { default: model + 's' });
    const schema: Schema = { model, modelPlural };

    const fields: IField[] = []

    // do {
    //   const name = await ux.prompt('Provide Field Name');
    //   const { type } = await inquirer.prompt([{
    //     choices: Object.values(FieldEnums).map(name=>({name})),
    //     message: 'select a type',
    //     name: 'type',
    //     type: 'list',
    //   }])
    //   const readonly = await confirm('readonly');
    //   const pr = await confirm('private');
    //   const optional = await confirm('optional');
    //   fields.push({ name, optional, private: pr, readonly, type })
    // } while (await confirm('Add another field?'));
  
    const { fileName: fname, template , title = ''} = DomainGenerator.generate(schema, fields)
    
    const fileName = args.file ?? fname

    const overwrite = await isExists(fileName) ? await confirm(`File already exists. Overwrite?`): await confirm(`Will write to ${fileName}?`);
    if(overwrite){
      await exportToFile(fileName, template)
      this.log(`${title} Done writing to ${fileName}`)
    }

    const jsonPath = `data/models/${model}.json`
    await exportToFile(jsonPath, JSON.stringify({fields, schema}, null, 2))
    this.log(`${title} Done writing to json ${fileName}`)
    
    if(flags.verbose){
      this.log(template);
    }
  }
}
