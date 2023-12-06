import { buildNameVariations } from "../../Modeling/index.js";
import { FieldEnums, Generator, IMethodType, IParamsType, IReturnType, Schema } from "../../Modeling/meta-models.js";

const generateReturnType = (returnType: IReturnType, isAsync: boolean) => {
	const { type, optional } = returnType;
	const typeString = `${type}${optional ? ' | undefined' : ''}`;
	if (isAsync) {
		return `Promise<${typeString}>`;
	}
	return typeString;
};

const parseDefaultValue = (df: string, type: FieldEnums) => {
	if (type === FieldEnums.string) {
		return `'${df}'`
	}
	if (type === FieldEnums.boolean) {
		return df === 'true' ? 'true' : 'false'
	}
	if (type === FieldEnums.number) {
		return df
	}
	return df
}

const generateArgs = (_arg: IParamsType) => {
	const { name, type, optional, default: df } = _arg;
	const { ref } = buildNameVariations({
		model: name,
		modelPlural: name,
	});
	return `
		${ref}${optional ? '?' : ''}: ${type}${df ? ` = ${parseDefaultValue(df, type)}` : ''}`;
};

const generateMethod = (method: IMethodType) => {
	const {
		name: _name,// string;
		private: _private,// boolean;
		static: _static,// boolean;
		returnType: _returnType,// IReturnType;
		async: _async,// boolean;
		args: _args,// IParamsType[];
	} = method;
	const { ref } = buildNameVariations({ model: _name, modelPlural: _name });
	return `
	${_private ? 'private ' : ''}${_static ? 'static ' : ''}${_async ? 'async ' : ''}${ref}(${_args.map(generateArgs)}
	): ${generateReturnType(_returnType, _async)} {
		throw new Error('Method Not Implemented');
	}
	`
};

const generate = (schema: Schema, methods: IMethodType[]) => {
	const { model, models } = buildNameVariations(schema);
	const template = `
export class ${model}Repository {${methods.map(generateMethod).join('')}
}
`;
	return {
		template,
		title: `${models} Repository`,
		fileName: `src/core/Repositories/${model}Repository.ts`,
	};
};

export const RepositoryGenerator: Generator = {
	generate,
};
