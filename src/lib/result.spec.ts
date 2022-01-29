import test from 'ava';

import {
  divide,
  divideResult,
  Person,
  PersonError,
  PersonNameInvalidError,
} from './mock';
import { Result } from './result';

test('transforming string into result', t => {
  // Arrange
  const expected = 'John Doe';
  // Act
  const actual = Result.ok('John Doe').get();
  // Assert
  t.is(actual, expected);
});

test('transforming number into result', t => {
  // Arrange
  const expected = 45;
  // Act
  const actual = Result.ok(45).get();
  // Assert
  t.is(actual, expected);
});

test('transforming Person instance into result', t => {
  // Arrange
  const expected = new Person('John', 34);
  // Act
  const actual = Result.ok(new Person('John', 34)).get();
  // Assert
  t.deepEqual(actual, expected);
});

test('get() should throw if Result is of failure type', t => {
  // Arrange
  const expected = 'some failure';
  // Act
  try {
    Result.err('some failure').get();
    t.fail('should throw error when calling get() on Result of failure type');
  } catch (actual) {
    t.is(actual, expected);
  }
});

test('transforming failure of type string into result', t => {
  // Arrange
  const expected = 'this is an failure of type string';
  // Act
  Result.err('this is an failure of type string')
    // Assert
    .match({
      ok: () => t.fail('should not match on ok case'),
      err: actual => t.is(actual, expected),
    });
});

test('transforming failure of type Error into result', t => {
  // Arrange
  const expected = new Error('oops');
  // Act
  Result.err(new Error('oops'))
    // Assert
    .match({
      ok: () => t.fail('should not match on ok case'),
      err: actual => t.deepEqual(actual, expected),
    });
});

test('transforming failure of type PersonError into result', t => {
  // Arrange
  const expected = 'person name must only contain english letters';
  // Act
  Result.err(new Person('J0hn', 45).validate().get() as PersonError)
    // Assert
    .match({
      ok: () => t.fail('should not match on ok case'),
      err: failure => {
        switch (failure.kind) {
          case 'PERSON_NAME_INVALID':
            t.is(failure.reason, expected);
            break;
          case 'PERSON_AGE_INVALID':
            t.fail('failure kind is not the expected one');
            break;
        }
      },
    });
});

test('transform successful function into result', t => {
  // Arrange
  const expected = 'Madrid';
  // Act
  const actual = Result.of(() => 'Madrid').get();
  // Assert
  t.is(actual, expected);
});

test('transform throwing function into result', t => {
  // Arrange
  const expected = 'cannot divide with zero';
  // Act
  Result.of(() => divide(12, 0))
    // Assert
    .match({
      ok: v => t.fail(`should not match ok case. got ok value: ${v}`),
      err: actual => t.is(actual, expected),
    });
});

test('map to number', t => {
  // Arrange
  const expected = 44;
  // Act
  const actual = Result.ok('44')
    // prettier-ignore
    .map(Number)
    .get();
  // Assert
  t.is(actual, expected);
});

test('map error to PersonError', t => {
  // Arrange
  const expected: PersonNameInvalidError = {
    kind: 'PERSON_NAME_INVALID',
    reason: 'some reason',
  };
  // Act
  Result.err('some reason')
    // prettier-ignore
    .mapError(str => ({
      kind: 'PERSON_NAME_INVALID',
      reason: str,
    }))
    // Assert
    .match({
      ok: v => t.fail(`should not match ok case. got ok value: ${v}`),
      err: actual => t.deepEqual(actual, expected),
    });
});

test('transform wrapped value', t => {
  // Arrange
  const expected = '2';
  // Act
  Result.of(() => divide(4, 2))
    .mapError(() => {
      t.fail('mapError should not run');
      return 'failure';
    })
    .map(String)
    // Assert
    .match({
      ok: actual => t.is(actual, expected),
      err: () => t.fail('should not match err case'),
    });
});

test('transform wrapped failure', t => {
  // Arrange
  const expected = 'some failure';
  // Act
  Result.of(() => divide(4, 0))
    .map(() => {
      t.fail('map should not run');
      return 'value';
    })
    .mapError(() => 'some failure')
    // Assert
    .match({
      ok: () => t.fail('should not match ok case'),
      err: actual => t.is(actual, expected),
    });
});

test('transform result ok value to new ok value', t => {
  // Arrange
  const expected = 2;
  // Act
  Result.ok(4)
    .flatMap(n => divideResult(n, 2))
    // Assert
    .match({
      ok: actual => t.is(actual, expected),
      err: () => t.fail('should not match err case'),
    });
});

test('flatMap callback should not run if wrapped value is of failure', t => {
  // Arrange
  const expected = 'some failure';
  // Act
  Result.err('some failure')
    .flatMap(() => Result.ok(2))
    // Assert
    .match({
      ok: () => t.fail('should not match ok case'),
      err: actual => t.is(actual, expected),
    });
});

test('transform failing result to a new successful result', t => {
  // Arrange
  const expected = 4;
  // Act
  Result.of(() => divide(4, 0))
    .flatMapError(() => divideResult(4, 1))
    // Assert
    .match({
      ok: actual => t.is(actual, expected),
      err: () => t.fail('should not match err case'),
    });
});

test('flatMap a function that returns a new result', t => {
  Result.ok(20)
    .flatMap(n => divideResult(n, 0))
    .match({
      ok: () => t.fail('should not match ok case'),
      err: actual => t.is(actual, 'y cannot be zero'),
    });
});

test('flatMapError transforming callback should not run when wrapped value is ok', t => {
  // Arrange
  const expected = 2;
  // Act
  Result.ok(2)
    .flatMapError(() => Result.err('some failure'))
    // Assert
    .match({
      ok: actual => t.is(actual, expected),
      err: () => t.fail('should not match err case'),
    });
});

test('apply function wrapped value', t => {
  // Arrange
  const expected = 'Madrid';
  // Act
  Result.ok('Madrid')
    // prettier-ignore
    // Assert
    .apply(actual => t.is(actual, expected));
});

test('apply error function wrapped failure', t => {
  // Arrange
  const expected = 'some string failure';
  // Act
  Result.err('some string failure')
    //prettier-ignore
    // Assert
    .applyError(actual => t.is(actual, expected));
});
