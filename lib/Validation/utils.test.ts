import { describe, expect, test } from '@jest/globals';
import { fieldsError, identity, mapToObject, mergeFieldsError } from './utils';

describe('Validation module', () => {
	describe('Validation module: utils', () => {
		test('fieldsError should return Map key is name and value is [error1 error2]', () => {
			expect(fieldsError('name', 'error1', 'error2')).toEqual(new Map([['name', ['error1', 'error2']]]));
		});

		test('fieldsError with one arg should return map with name key and [] as a value', () => {
			expect(fieldsError('name')).toEqual(new Map([['name', []]]));
		});

		test('fieldsError should return type Map', () => {
			expect(fieldsError('name', 'error1', 'error2')).toBeInstanceOf(Map);
		});
	});

	describe('Validation module: identity', () => {
		test('identity function should return provided argument regardless of type', () => {
			expect(identity('name')).toBe('name');
			expect(identity(1)).toBe(1);
			expect(identity(true)).toBe(true);
			expect(identity({})).toEqual({});
			expect(identity([])).toEqual([]);
		});
	});
	
	describe('Validation module: mergeFieldsError', () => {
		test('mergeFieldsError should return merged map', () => {
			expect(mergeFieldsError(new Map([['name', ['error1']]]), new Map([['name', ['error2']]]))).toEqual(new Map([['name', ['error1', 'error2']]]));
		});
		test('mergeFieldsError can merge more than 3 maps', () => {
			expect(mergeFieldsError(new Map([['name', ['error1']]]), new Map([['name', ['error2']]]), new Map([['name', ['error3']]]))).toEqual(new Map([['name', ['error1', 'error2', 'error3']]]));
		});
		test('mergeFieldsError if names do not collide should map with two keys', () => {
			expect(mergeFieldsError(new Map([['name', ['error1']]]), new Map([['name2', ['error2']]]))).toEqual(new Map([['name', ['error1']], ['name2', ['error2']]]));
		});
		test('mergeFieldsError if names do not collide should map with two keys and can be called with map arguments', () => {
			expect(mergeFieldsError(
				new Map([['name', ['error1']]]), new Map([['name2', ['error2']]]), new Map([['name3', ['error3']]])
			)).toEqual(
				new Map([['name', ['error1']], ['name2', ['error2']], ['name3', ['error3']]])
			);
		});
	});
	describe('Validation module: mapToObject', () => {
		test('mapToObject should object from provided map', () => {
			expect(mapToObject(new Map([['name', ['error1']]]))).toEqual({ name: ['error1'] });
		});
	});
});