import SumType from 'sums-up';
import { fieldsError, mergeFieldsError, identity } from './utils';
import { mapToObject } from './utils';
import { curryN } from 'ramda';

export type FieldsError = Map<string, string[]>

enum ValidationTypes {
	Success = 'Success',
	Failure = 'Failure'
}

export class Validation extends SumType<{ [ValidationTypes.Success]: [unknown]; [ValidationTypes.Failure]: [FieldsError]; }> {
	/** overrides */
	public static Success(value: unknown) {
		return new Validation(ValidationTypes.Success, value);
	}
	public static Failure(errors: FieldsError) {
		return new Validation(ValidationTypes.Failure, errors);
	}
	/**
	 * use this method to create a Success Validation
	 * @param value any value
	 * @returns 
	 */
	public static of(value: unknown) {
		return Validation.Success(value);
	}
	/**
	 * a method to create a Validation fom a nullable value
	 * @param value nullable value
	 * @param name 
	 * @returns 
	 */
	public static fromNullable(value: unknown, name: string, customMessage: string = 'Missing required field') {
		return value ? Validation.Success(value) : Validation.Failure(fieldsError(name, customMessage));
	}
	/**
	 * a method to create a Validation from a predicate
	 * @param predicate a function that takes a value and returns a boolean
	 * @param value any value
	 * @param name name of the field
	 * @param message custom error message
	 * @returns 
	 */
	public static fromPredicate(predicate: (value: unknown) => boolean, value: unknown, name: string, message: string = 'predicate is not satisfied') {
		return predicate(value) ? Validation.Success(value) : Validation.Failure(fieldsError(name, message));
	}
	/**
	 * a method to concat two Validation
	 * @param other 
	 * @returns Validation
	 */
	public concat(other: Validation): Validation {
		return this.caseOf({
			Success: (value) => other.caseOf({
				Success: () => Validation.Success(value),
				Failure: (errors) => Validation.Failure(errors)
			}),
			Failure: (errors1: FieldsError) => other.caseOf({
				Success: () => Validation.Failure(errors1),
				Failure: (errors2) => Validation.Failure(mergeFieldsError(errors1, errors2))
			})
		});
	}
	/**
	 * a method to map a Validation
	 * @param fn a function that takes a value and returns a Validation
	 * @returns Validation type
	 */
	public map(fn: (value: unknown) => unknown): Validation {
		return this.caseOf({
			Success: (value) => Validation.Success(fn(value)),
			Failure: Validation.Failure
		});
	}
	/**
	 * a method to extract value if the Validation is Success
	 * @param fn a function that takes a value
	 * @returns Validation type or any
	 */
	public chain(fn: (value: unknown) => unknown): Validation | unknown {
		return this.caseOf({
			Success: fn,
			Failure: Validation.Failure
		});
	}
	/**
	 * method to provide a default value if the Validation is Failure
	 * @param _default a default value
	 * @returns any
	 */
	public getOrElse(_default: unknown): unknown {
		return this.caseOf({
			Success: identity,
			Failure: () => _default
		});
	}
	/**
	 * method map flatMap of a Validation
	 * @param fn a function that takes a FieldsError and returns any
	 * @returns 
	 */
	public orElse(fn: (errors: FieldsError) => unknown): unknown | Validation {
		return this.caseOf({
			Success: Validation.Success,
			Failure: (errors) => fn(errors)
		});
	}
	/**
	 * method to extract value from a Validation context
	 * @param failure callback function to handle Failure
	 * @param success callback function to handle Success
	 * @returns 
	 */
	public fold(failure: (errors: FieldsError) => unknown, success: (value: unknown) => unknown = identity,): unknown {
		return this.caseOf({
			Success: success,
			Failure: failure
		});
	}
	public toString(): string {
		return this.caseOf({
			Success: (value) => `Success(${value})`,
			Failure: (errors) => `Failure(${JSON.stringify(mapToObject(errors))}`
		});	
	}
	// VALIDATION METHODS
	public static createType(params: Tuple2<Func, string>): ValidateFunction {
		const [predicate, message] = params;
		return ([field, value, index]: Tuple3<string, unknown, unknown>): Validation => {
			const msg = message || 'Field {index}{field} is invalid';
			return Validation.fromPredicate(predicate, value, field, formatUnicorn(msg, {
				field: field,
				index: `${index && index + '.'}`,
				value: `${value}`
			}));
		};
	}
	public static string([field, value, index]: Tuple3<string, unknown, unknown>): Validation {
		return Validation.createType([
			(value: unknown) => typeof value === 'string',
			'Field {index}{field} should be a type string',
		])([field, value, index]);
	}

	public static number([field, value, index]: Tuple3<string, unknown, unknown>): Validation {
		return Validation.createType([
			(value: unknown) => typeof value === 'number',
			'Field {index}{field} should be a type number',
		])([field, value, index]);
	}

	public static optional(fn: ValidateFunction): ValidateFunction {
		return ([field, value, index]: Tuple3<string, unknown, unknown>): Validation => value ? fn([field, value, index]) : Validation.Success(value);
	}

	public static bool([field, value, index]: Tuple3<string, unknown, unknown>): Validation {
		return Validation.createType([
			(value: unknown) => typeof value === 'boolean',
			'Field {index}{field} should be a type boolean',
		])([field, value, index]);
	}

	public static shape(shape: Record<string, ValidateFunction>) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (params: Tuple3<string, any, unknown> | Record<string, unknown>): Validation => {
			const value = Array.isArray(params) ? params[1] : params;
			return Object.keys(shape).reduce((acc, key, index) => acc.concat(shape[key]([key, value[key], index])), Validation.of(value));
		};
	}

}

export const { Success, Failure } = Validation;
export default Validation;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const base1 = curryN(1, (value: any): Validation => Validation.Success(value));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const base2 = curryN(2, (field: string, value: any): Validation => Validation.Success(value));
// type ValidateFunction = typeof base1
type ValidateFunction2 = typeof base2


export const requiredField = curryN(2, (field: string, value: string): Validation => Validation.fromNullable(value, field, `Missing required field: ${field}`));
export const notEmptyString = curryN(2, (field: string, value: string = ''): Validation => Validation.fromPredicate(() => value?.length > 0, value, field, `Field ${field} should be a non-empty string`));
export const isNumber = curryN(2, (field: string, value?: never): Validation => Validation.fromPredicate(() => !isNaN(Number(value)), value, field, `Field ${field} should be a number`));
export const notEmptyObject = curryN(2, (field: string, value = {}): Validation => Validation.fromPredicate(() => Object.keys(value).length > 0, value, field, `Field ${field} should be a non-empty object`));
export const reduce = curryN(2, (validator: (x: never, xi: number) => Validation, xs: never[] = []) => xs.reduce((acc, x, xi) => acc.concat(validator(x, xi)), Validation.of('')));
export const notEmptyList = curryN(2, (field: string, value: never[] = []): Validation => Validation.fromPredicate(() => !!value.length, value, field, `Field ${field} should be a non-empty list`));
export const isBoolean = curryN(2, (field: string, value?: never): Validation => Validation.fromPredicate(() => typeof value === 'boolean', value, field, `Field ${field} should be a boolean`));
export const number = curryN(2, (field: string, value?: never): Validation => Validation.fromPredicate(() => typeof value === 'number', value, field, `Field ${field} should be a type number`));

export const optional = curryN(2, (check: boolean, other: Validation): Validation => check ? other : Validation.Success(check));
// export function composeFieldsErrors(...fns:Array<(field: string, value?: never) => Validation>){
// 	return (field: string, value?: never) => fns.reduce((acc, fn) => acc.concat(fn(field, value)), Validation.Success(value));
// }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const shape = curryN(2, (shape: Record<string, ValidateFunction2>, value: Record<string, unknown>): Validation => {
	return Object.keys(shape).reduce((acc, key) => acc.concat(shape[key](key, value[key])), Validation.of(value));
});
// An object with errors on extra properties
export const exact = curryN(2, (shape: Record<string, ValidateFunction2>, value: Record<string, unknown>): Validation => {
	const keys = Object.keys(value);
	const errors = keys.reduce((acc, key) => {
		if (shape[key]) {
			return acc.concat(shape[key](key, value[key]));
		}
		return acc.concat(Validation.Failure(fieldsError(key, `Unexpected field ${key}`)));
	}, Validation.of(value));
	return errors;
});
export const optional1 = curryN(3, (fn : ValidateFunction2, field: string, value: unknown): Validation => value ? fn(field, value) : Validation.Success(value));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const array = (validate: ValidateFunction2, values: any[]): Validation =>values.reduce((acc, value) =>  acc.concat(validate(value)), Validation.of(values));


type Func<Params = unknown , ReturnType = boolean> = (value: Params) => ReturnType
type Tuple3<FIELD_NAME, FIELD_VALUE, FIELD_INDEX = number | undefined> = [FIELD_NAME, FIELD_VALUE, FIELD_INDEX]
type Tuple2<PredicateFunction = Func, CustomErrorMessage = string> = [PredicateFunction, CustomErrorMessage]

function formatUnicorn(str: string, args: Record<string, string> = {}) {
	for (const arg in args) str = str.replace(new RegExp(`\\{${arg}\\}`, 'gi'), args[arg]);
	return str;
}
const base1 = ([, value,]: Tuple3<string, unknown, unknown>): Validation => Validation.Success(value);
type ValidateFunction = typeof base1
