import test from 'ava';
import { Person, PersonError } from './mock';

import { Optional } from './optional';

test('create an Optional with some string value', t => {
  // Arrange
  const expected = 'John';
  // Act
  const actual = Optional.some('John').get();
  // Assert
  t.is(actual, expected);
});

test('create an Optional with none value', t => {
  // Arrange
  const expected = null;
  // Act
  const actual = Optional.none().get();
  // Assert
  t.is(actual, expected);
});

test('create an Optional from a value that is not nullable', t => {
  // Arrange
  const expected = 245;
  // Act
  const actual = Optional.of(245).get();
  // Assert
  t.is(actual, expected);
});

test('create an Optional from a value that is nullable', t => {
  // Arrange
  const expected = null;
  // Act
  const actual = Optional.of(null).get();
  // Assert
  t.is(actual, expected);
});

test('transform an Optionals wrapped value type', t => {
  // Arrange
  const expected = 2341;
  // Act
  const actual = Optional.of('2341').map(Number).get();
  // Assert
  t.is(actual, expected);
});

test('map function should not run if wrapped value is none', t => {
  // Arrange
  // Act
  // Assert
  Optional.none().map(() =>
    t.fail('map should not run if wrapped value is none')
  );
  t.pass();
});

test('flatten a nested optional', t => {
  // Arrange
  const expected = 23;
  // Act
  const actual = Optional.of(Optional.some(23))
    .flatMap(opt => opt)
    .get();
  // Assert
  t.is(actual, expected);
});

test('flatMap should not run callback when wrapped value is none', t => {
  // Arrange
  const expected = null;
  // Act
  const actual = Optional.none().flatMap(() => Optional.some(1)).get()
  t.log(`actual: ${actual}`);
  // Assert
  t.is(actual, expected);
});

test('apply given callback', t => {
  // Arrange
  const expected = 23;
  // Act
  // Assert
  Optional.some(23).apply(actual => t.is(actual, expected));
});

test('applied function should not run when Optional is none', t => {
  // Arrange
  // Act
  // Assert
  Optional.none().apply(() =>
    t.fail('apply should not run is wrapped value is none')
  );
  t.pass();
});

test('filter should make optional none', t => {
  // Arrange
  const expected = null;
  // Act
  const actual = Optional.some(10)
    .filter(wrapped => wrapped > 20)
    .get();
  // Assert
  t.is(actual, expected);
});

test('filter should not run if none', t => {
  // Arrange
  const expected = null;
  // Act
  const actual = Optional.none()
    .filter(() => true)
    .get();
  // Assert
  t.is(actual, expected);
});

test('getOrElse should return a value when Optional is none', t => {
  // Arrange
  const expected = 45;
  // Act
  const actual = Optional.none().getOrElse(() => 45);
  // Assert
  t.is(actual, expected);
});

test('getOrElse should return the wrapped some value', t => {
  // Arrange
  const expected = 34;
  // Act
  const actual = Optional.some(34).getOrElse(() => 45);
  // Assert
  t.is(actual, expected);
});

test('hasValue should return true if Optional is some value', t => {
  // Arrange, Act, Assert
  t.is(Optional.some(4).hasValue, true);
});

test('hasValue should return false if Optional is none', t => {
  // Arrange, Act, Assert
  t.is(Optional.none().hasValue, false);
});

test('fail when validating an negative number Person age', t => {
  // Arrange
  const expected: PersonError = {
    kind: "PERSON_AGE_INVALID",
    reason: new RangeError('person age cannot be a negative number')
  };
  const person: Person = new Person("John", -1);
  // Act
  const actual = person.validate().get();
  // Assert
  t.deepEqual(actual, expected);
});

test('return none when Person validation is correct', t => {
  // Arrange
  const expected = null;
  const person: Person = new Person("John", 32);
  // Act
  const actual = person.validate().get();
  // Assert
  t.is(actual, expected);
});
