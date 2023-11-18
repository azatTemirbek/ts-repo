import SumType from 'sums-up';
import { fieldsError, mergeFieldsError, identity } from './utils';
import { mapToObject } from './utils';

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
	public static fromNullable(value: unknown, name: string) {
		return value ? Validation.Success(value) : Validation.Failure(fieldsError(name, 'must not be null'));
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
			Success: () => other,
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
	public orElse(fn: (errors: FieldsError) => unknown): unknown {
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
}

export const { Success, Failure } = Validation;
export default Validation;
