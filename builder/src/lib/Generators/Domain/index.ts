import { buildNameVariations } from "../../Modeling/index.js";
import { Generator, IField, Schema } from "../../Modeling/meta-models.js";

const generateField = (field: IField) => {
	const { name, type, readonly, private: pr } = field;
	const { ref } = buildNameVariations({
		model: name,
		modelPlural: name,
	});
	return `
		${pr ? 'private ' : 'public '}${readonly ? 'readonly ' : ''}${ref}: ${type},`
};

const generate = (schema: Schema, fields: IField[]) => {
	const { ref, refs, model, models, selector } = buildNameVariations(schema);
	console.log({ ref, refs, model, models, selector });

	const template = `
import { randomUUID } from 'crypto';

export class ${model} {
  constructor(${fields.map(generateField)}
  ) { }
}
`;
	return {
		template,
		title: `${models} Domain`,
		fileName: `src/core/domain/${model}.ts`,
	};
};

export const DomainGenerator: Generator = {
	generate,
};
