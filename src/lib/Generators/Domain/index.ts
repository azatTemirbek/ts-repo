import { buildNameVariations } from "../../Modeling/index.js";
import { Generator, IField, Schema } from "../../Modeling/meta-models.js";

const generateField = (field: IField) => {
	const { name, private: pr, readonly, type } = field;
	const { ref } = buildNameVariations({
		model: name,
		modelPlural: name,
	});
	return `
		${pr ? 'private ' : 'public '}${readonly ? 'readonly ' : ''}${ref}: ${type},`
};

const generate = (schema: Schema, fields: IField[]) => {
	const { model, models, ref, refs, selector } = buildNameVariations(schema);
	console.log({ model, models, ref, refs, selector });

	const template = `
import { randomUUID } from 'crypto';

export class ${model} {
  constructor(${fields.map((element) => generateField(element))}
  ) { }
}
`;
	return {
		fileName: `src/core/domain/${model}.ts`,
		template,
		title: `${models} Domain`,
	};
};

export const DomainGenerator: Generator = {
	generate,
};
