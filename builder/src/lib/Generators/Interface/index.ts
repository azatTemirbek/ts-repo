import { buildNameVariations } from "../../Modeling/index.js";
import { Generator, IField, Schema } from "../../Modeling/meta-models.js";

const generateField = (field: IField) => {
	const { name, type, readonly, private: pr } = field;
	const { ref } = buildNameVariations({
		model: name,
		modelPlural: name,
	});
	return `
		${pr ? 'private ' : 'public '}${readonly ? 'readonly ' : ''}${ref}${field.optional&&'?'}: ${type};`
};

const generate = (schema: Schema, fields: IField[]) => {
	const { model, models } = buildNameVariations(schema);
	const template = `

export interface ${model} {
	${fields.map(generateField)
}
`;
	return {
		template,
		title: `${models} Interfaces`,
		fileName: `src/core/interfaces/${model}.ts`,
	};
};

export const InterfaceGenerator: Generator = {
	generate,
};
