import { Validation, array, exact, isNumber, notEmptyString, number, optional, optional1, requiredField, shape } from '.';
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
			})).toEqual(new Map([['name', ['Missing required field']]]));
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
			})).toBe('hello');
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
	describe('Validation module: helper: requiredField', () => {
		const s1 = requiredField('field_name', 'field_value');
		const f1 = requiredField('field_name', '');
		test('requiredField should return Success if value is not null', () => {
			expect(s1).toEqual(Validation.Success('field_value'));
		});
		test('requiredField should return Failure if value is null', () => {
			expect(f1).toEqual(Validation.Failure(new Map([['field_name', ['Missing required field: field_name']]])));
		});
	});
	describe('Validation module: helper: notEmptyString', () => {
		const s1 = notEmptyString('field_name', 'field_value');
		const f1 = notEmptyString('field_name', '');
		const f2 = notEmptyString('field_name', undefined);
		test('notEmptyString should return Success if value is not null', () => {
			expect(s1).toEqual(Validation.Success('field_value'));
		});
		test('notEmptyString should return Failure if value is empty string', () => {
			expect(f1).toEqual(Validation.Failure(new Map([['field_name', ['Field field_name should be a non-empty string']]])));
			expect(f2).toEqual(Validation.Failure(new Map([['field_name', ['Field field_name should be a non-empty string']]])));
		});
	});
	describe('Validation module: helper: optional', () => {
		const s1 = notEmptyString('field_name', 'field_value');
		const f1 = notEmptyString('field_name', '');
		test('optional first arg is true should run validation', () => {
			expect(optional(true, s1)).toEqual(Validation.Success('field_value'));
			expect(optional(true, f1)).toEqual(Validation.Failure(new Map([['field_name', ['Field field_name should be a non-empty string']]])));
		});
		test('optional first arg is true should not run validation', () => {
			expect(optional(false, s1)).toEqual(Validation.Success(false));
			expect(optional(false, f1)).toEqual(Validation.Success(false));
		});
	});
	describe('Validation module: helper: shape', () => {
		test('shape should validate values of the object and return validated data inside', () => {
			const successPayload = { name: 'field_value1', age: 5 };
			const sh = shape({
				name: notEmptyString,
				age: isNumber
			}, successPayload);
			expect(sh).toEqual(Validation.Success(successPayload));
		});
		test('shape should validate values of the object and return success but should not validate optional', () => {
			const optionalPayload = { name: 'valid name', age: '' };
			const sh = shape({
				name: notEmptyString,
				age: optional1(isNumber)
			}, optionalPayload);
			expect(sh).toEqual(Validation.Success(optionalPayload));
		});
		test('shape should validate values of the object and return errors', () => {
			const failurePayload = { name: false, age: 's' };
			const sh = shape({
				name: notEmptyString,
				age: isNumber
			}, failurePayload);
			expect(sh).toEqual(Validation.Failure(
				new Map([['name', ['Field name should be a non-empty string']], ['age', ['Field age should be a number']]])
			));
		});
		test('shape should validate values of the object and return errors only if optional value exists', () => {
			const optionalPayload = { name: false, age: 's' };
			const sh = shape({
				name: notEmptyString,
				age: optional1(isNumber),
			}, optionalPayload);
			expect(sh).toEqual(Validation.Failure(
				new Map([['name', ['Field name should be a non-empty string']], ['age', ['Field age should be a number']]])
			));
		});
	});
	describe('Validation module: helper: exact', () => {
		test('exact should validate values of the object and return validated data inside', () => {
			const successPayload = { name: 'field_value1', age: 5 };
			const sh = exact({
				name: notEmptyString,
				age: isNumber
			}, successPayload);
			expect(sh).toEqual(Validation.Success(successPayload));
		});
		test('exact should validate values of the object and return success but should not validate optional', () => {
			const optionalPayload = { name: 'valid name', age: '' };
			const sh = exact({
				name: notEmptyString,
				age: optional1(isNumber)
			}, optionalPayload);
			expect(sh).toEqual(Validation.Success(optionalPayload));
		});
		test('exact should validate values of the object and return errors', () => {
			const failurePayload = { name: false, age: 's' };
			const sh = exact({
				name: notEmptyString,
				age: isNumber
			}, failurePayload);
			expect(sh).toEqual(Validation.Failure(
				new Map([['name', ['Field name should be a non-empty string']], ['age', ['Field age should be a number']]])
			));
		});
		test('exact should validate values of the object and return errors only if optional value exists', () => {
			const optionalPayload = { name: false, age: 's' };
			const sh = exact({
				name: notEmptyString,
				age: optional1(isNumber),
			}, optionalPayload);
			expect(sh).toEqual(Validation.Failure(
				new Map([['name', ['Field name should be a non-empty string']], ['age', ['Field age should be a number']]])
			));
		});
		test('exact should validate values of the object and return errors only if optional value exists', () => {
			const optionalPayload = { name: 'name', age: '1', extra: 'extra' };
			const sh = exact({
				name: notEmptyString,
				age: optional1(isNumber),
			}, optionalPayload);
			expect(sh).toEqual(Validation.Failure(
				new Map([['extra', ['Unexpected field extra']]])
			));
		});
		test('exact should validate values of the object and return errors only if optional value exists', () => {
			const optionalPayload = { name: 1, age: 'ssss', extra: 'extra' };
			const sh = exact({
				name: notEmptyString,
				age: optional1(isNumber),
			}, optionalPayload);
			expect(sh).toEqual(Validation.Failure(
				new Map([['name', ['Field name should be a non-empty string']], ['age', ['Field age should be a number']], ['extra', ['Unexpected field extra']]])
			));
		});
	});
	describe('Validation module: helper: array', () => {
		test('array should validate values of every item and return validated data inside', () => {
			const successPayload = ['string', '5'];
			const arr = array(
				notEmptyString('stringArray'),
				successPayload
			);
			expect(arr).toEqual(Validation.Success(successPayload));
		});
		test('array should validate values of every item and return failure data inside', () => {
			const failurePayload = ['string', 5];
			const arr = array(
				notEmptyString('stringArray'),
				failurePayload
			);
			expect(arr).toEqual(Validation.Failure(
				new Map([['stringArray', ['Field stringArray should be a non-empty string']]])
			));
		});
		test('array should validate values of every item and return failure data inside', () => {
			const successPayload = [{ name: 'valid name', age: '' }];
			const arr = array(
				shape({
					name: notEmptyString,
					age: isNumber
				}),
				successPayload
			);
			expect(arr).toEqual(Validation.Success(successPayload));
		});
		test('array should validate values of every item and return failure data inside', () => {
			const successPayload = [{ name: 'valid name', age: 3 }];
			const arr = array(
				shape({
					name: notEmptyString,
					age: number
				}),
				successPayload
			);
			expect(arr).toEqual(Validation.Success(successPayload));
		});
	});
});