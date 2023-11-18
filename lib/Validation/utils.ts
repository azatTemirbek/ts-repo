import { FieldsError } from '.';

/**
 * a function to create a FieldsError
 * @param name field name
 * @param rest error messages
 * @returns Map<string, string[]>
 */
export function fieldsError(name: string, ...rest: string[]): FieldsError {
	return new Map([[name, rest]]);
}
/**
 * identity function should return provided arguments
 * @param a any value
 * @returns 
 */
export function identity(a: unknown) {
	return a;
}
/**
 * a deep merge of two FieldsError
 * @param map1 instance of FieldsError
 * @returns FieldsError
 */
export function mergeFieldsError(map1: FieldsError, ...list: FieldsError[]): FieldsError {
	const result = new Map<string, string[]>();
	map1.forEach((value, key) => {
		result.set(key, value);
	});
	list.forEach((map) => {
		map.forEach((value, key) => {
			if (result.has(key)) {
				result.set(key, [...result.get(key)!, ...value]);
			} else {
				result.set(key, value);
			}
		});
	});
	return result;
}
export const mapToObject = Object.fromEntries;

