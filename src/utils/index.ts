import inquirer from "inquirer";
export const confirm = async (message: string = 'select a type', _defaultValue = true): Promise<boolean> => {
    const { type } = await inquirer.prompt([{
        message,
        name: 'type',
        type: 'confirm',
    }])
    return type
}