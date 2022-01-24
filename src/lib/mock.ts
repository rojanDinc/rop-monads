import { Optional } from './optional';
import { Result } from './result';

export function divide(x: number, y: number): number {
  if (y === 0) throw 'cannot divide with zero';
  return x / y;
}

export function divideResult(x: number, y: number): Result<number, string> {
  if (y === 0) return Result.err('y cannot be zero');

  return Result.ok(x / y);
}

export class Person {
  constructor(public readonly name: string, public readonly age: number) {
    this.name = name;
    this.age = age;
  }

  public validate(): Optional<PersonError> {
    if (/^[a-zA-Z]+$/.test(this.name) === false)
      return Optional.of({
        kind: 'PERSON_NAME_INVALID',
        reason: 'person name must only contain english letters',
      });
    if (this.age < 0)
      return Optional.of({
        kind: 'PERSON_AGE_INVALID',
        reason: new RangeError('person age cannot be a negative number'),
      });

    return Optional.none();
  }
}

export type PersonNameInvalidError = {
  kind: 'PERSON_NAME_INVALID';
  reason: string;
};
export type PersonAgeInvalidError = {
  kind: 'PERSON_AGE_INVALID';
  reason: Error;
};
export type PersonError = PersonNameInvalidError | PersonAgeInvalidError;
