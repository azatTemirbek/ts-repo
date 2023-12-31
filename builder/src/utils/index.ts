import inquirer from "inquirer";
export const confirm = async (message: string = 'select a type', defaultValue = true): Promise<boolean> => {
    const { type } = await inquirer.prompt([{
        name: 'type',
        message,
        type: 'confirm',
    }])
    return type
}