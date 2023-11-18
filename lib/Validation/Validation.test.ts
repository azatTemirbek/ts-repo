import { Validation } from '.';
import { describe, expect, test } from '@jest/globals';

describe('Validation module', () => {
	describe('Validation module: static methods', () => {
		test('crete Validation:Success', () => {
			const s1 = Validation.Success('hello');
			expect(s1.caseOf({
				Success: (value) => value,
				Failure: (errors) => errors
			})).toBe('hello');
		});
		test('crete Validation:Failure', () => {
			const payload = new Map([['foo', ['bar1']]]);
			const s1 = Validation.Failure(payload);
			expect(s1.caseOf({
				Success: (value) => value,
				Failure: (errors) => errors
			})).toBe(payload);
		});
		test('crete Validation:Success:of', () => {
			const s1 = Validation.of('hello');
			expect(s1.caseOf({
				Success: (value) => value,
				Failure: (errors) => errors
			})).toBe('hello');
		});
		test('crete Validation:fromNullable', () => {
			const s1 = Validation.fromNullable('hello', 'name');
			expect(s1.caseOf({
				Success: (value) => value,
				Failure: (errors) => errors
			})).toBe('hello');
			const f1 = Validation.fromNullable(null, 'name');
			expect(f1.caseOf({
				Success: (value) => value,
				Failure: (errors) => errors
			})).toEqual(new Map([['name', ['must not be null']]]));
		});
		test('crete Validation:fromPredicate', () => {
			const s1 = Validation.fromPredicate((value) => value === 'hello', 'hello', 'name');
			expect(s1.caseOf({
				Success: (value) => value,
				Failure: (errors) => errors
			})).toBe('hello');
			const f1 = Validation.fromPredicate((value) => value === 'hello', 'world', 'name');
			expect(f1.caseOf({
				Success: (value) => value,
				Failure: (errors) => errors
			})).toEqual(new Map([['name', ['predicate is not satisfied']]]));

			const f2 = Validation.fromPredicate((value) => value === 'hello', 'world', 'name', 'custom error message');
			expect(f2.caseOf({
				Success: (value) => value,
				Failure: (errors) => errors
			})).toEqual(new Map([['name', ['custom error message']]]));
		});
	});
	describe('Validation module: method: concat', () => {
		const s1 = Validation.Success('hello');
		const s2 = Validation.Success('world');
		const f1 = Validation.Failure(new Map([['foo', ['bar']]]));
		const f2 = Validation.Failure(new Map([['foo', ['bar1']]]));
		test('concat success with success', () => {
			expect(s1.concat(s2).caseOf({
				Success: (value) => value,
				Failure: (errors) => errors
			})).toBe('world');
		});
		test('concat success with failure', () => {
			expect(s1.concat(f1).caseOf({
				Success: (value) => value,
				Failure: (errors) => errors
			})).toEqual(new Map([['foo', ['bar']]]));
		});
		test('concat failure with failure', () => {
			expect(f1.concat(f2).caseOf({
				Success: (value) => value,
				Failure: (errors) => errors
			})).toEqual(new Map([['foo', ['bar', 'bar1']]]));
		});
		test('concat success failure success', () => {
			expect(s1.concat(f1).concat(s1).caseOf({
				Success: (value) => value,
				Failure: (errors) => errors
			})).toEqual(new Map([['foo', ['bar']]]));
		});
		test('concat success failure ', () => {
			expect(s1.concat(f2).caseOf({
				Success: (value) => value,
				Failure: (errors) => errors
			})).toEqual(new Map([['foo', ['bar1']]]));
		});
	});
	describe('Validation module: method: map', () => {
		const s1 = Validation.Success('hello');
		const f1 = Validation.Failure(new Map([['foo', ['bar']]]));
		test('map success', () => {
			expect(s1.map((value) => value + ' world').caseOf({
				Success: (value) => value,
				Failure: (errors) => errors
			})).toBe('hello world');
		});
		test('map success is immutable', () => {
			expect(s1.map((value) => value + ' world').caseOf({
				Success: (value) => value,
				Failure: (errors) => errors
			})).toBe('hello world');
		});
		test('map failure', () => {
			expect(f1.map((value) => value + ' world').caseOf({
				Success: (value) => value,
				Failure: (errors) => errors
			})).toEqual(new Map([['foo', ['bar']]]));
		});
		test('map failure is immutable', () => {
			expect(f1.map((value) => value + ' world').caseOf({
				Success: (value) => value,
				Failure: (errors) => errors
			})).toEqual(new Map([['foo', ['bar']]]));
		});
	});
	describe('Validation module: method: chain', () => {
		const s1 = Validation.Success('hello');
		const f1 = Validation.Failure(new Map([['foo', ['bar']]]));
		test('chain success should return value', () => {
			expect(s1.chain((value) => value)).toBe('hello');
		});
		test('chain failure should return Validation type ', () => {
			expect(f1.chain((value) => value)).toEqual(f1);
		});
	});
	describe('Validation module: method: getOrElse', () => {
		const s1 = Validation.Success('hello');
		const f1 = Validation.Failure(new Map([['foo', ['bar']]]));
		test('getOrElse on success should give value', () => {
			expect(s1.getOrElse('world')).toBe('hello');
		});
		test('getOrElse on failure should return provided value', () => {
			expect(f1.getOrElse('world')).toBe('world');
		});
	});
	describe('Validation module: method: orElse', () => {
		const s1 = Validation.Success('hello');
		const f1Payload = new Map([['foo', ['bar']]]);
		const f1 = Validation.Failure(f1Payload);
		test('orElse on success should return success', () => {
			expect(s1.orElse((errors) => errors)).toEqual(s1);
		});
		test('orElse on success callback function should not be invoked', () => {
			const callback = jest.fn();
			s1.orElse(callback);
			expect(callback).not.toBeCalled();
		});
		test('orElse on failure should extract', () => {
			expect(f1.orElse((errors) => errors)).toEqual(f1Payload);
		});
		test('orElse on failure callback function should not be invoked', () => {
			const callback = jest.fn();
			f1.orElse(callback);
			expect(callback).toBeCalledTimes(1);
		});
	});
	describe('Validation module: method: fold', () => {
		const s1 = Validation.Success('hello');
		const f1Payload = new Map([['foo', ['bar']]]);
		const f1 = Validation.Failure(f1Payload);
		test('fold on success should invoke success callback one time', () => {
			const successCallback = jest.fn();
			const failureCallback = jest.fn();
			s1.fold(failureCallback, successCallback);
			expect(successCallback).toBeCalledTimes(1);
			expect(failureCallback).not.toBeCalled();
		});
		test('fold on failure should invoke fail callback one time', () => {
			const successCallback = jest.fn();
			const failureCallback = jest.fn();
			f1.fold(failureCallback, successCallback);
			expect(successCallback).not.toBeCalled();
			expect(failureCallback).toBeCalledTimes(1);
		});
		test('fold on success success callback default is identity and should extract values', () => {
			const successCallback = jest.fn();
			const failureCallback = jest.fn();
			const result = s1.fold(failureCallback);
			expect(result).toBe('hello');
			expect(successCallback).not.toBeCalled();
			expect(failureCallback).not.toBeCalled();
		});

	});
	describe('Validation module: method: caseOf', () => {
		const s1 = Validation.Success('hello');
		const f1Payload = new Map([['foo', ['bar']]]);
		const f1 = Validation.Failure(f1Payload);
		test('case also has default handler "_"', () => {
			const defaultCallback = jest.fn();
			s1.caseOf({
				_: defaultCallback
			});
			f1.caseOf({
				_: defaultCallback
			});
			expect(defaultCallback).toBeCalledTimes(2);
		});
		test('case can have success and failure pattern match', () => {
			const successCallback = jest.fn();
			const failureCallback = jest.fn();
			s1.caseOf({
				Success: successCallback,
				Failure: failureCallback
			});
			f1.caseOf({
				Success: successCallback,
				Failure: failureCallback
			});
			expect(successCallback).toBeCalledTimes(1);
			expect(failureCallback).toBeCalledTimes(1);
		});
	});
	describe('Validation module: method: toString', () => {
		const s1 = Validation.Success('hello');
		const f1Payload = new Map([['foo', ['bar']]]);
		const f1 = Validation.Failure(f1Payload);
		test('toString should return variant and data field', () => {
			expect(s1.toString()).toBe('Success(hello)');
			expect(f1.toString()).toBe('Failure({"foo":["bar"]}');
		});
	});
});