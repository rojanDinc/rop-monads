import test from 'ava';

import { Optional } from './optional';

// Test get() function
[
  {
    value: 5,
    expected: 5,
  },
  {
    value: 'Eiffel tower',
    expected: 'Eiffel tower',
  },
  {
    value: undefined,
    expected: null,
  },
  {
    value: null,
    expected: null,
  },
].forEach(({ value, expected }) => {
  test(`get() - value: ${value}, expected: ${expected}`, (t) => {
    const actual = Optional.of(value).get();
    t.is(actual, expected);
  });
});

// Test map() function
[
  {
    value: 5,
    fn: (v: number) => v ** 2,
    expected: 25,
  },
  {
    value: 423,
    fn: (v: number) => String(v),
    expected: '423',
  },
  {
    value: {
      name: 'John Doe',
      age: 42,
    },
    fn: (v: { name: string; age: number }) => v.age,
    expected: 42,
  },
].forEach(({ value, fn, expected }) => {
  test(`map(${fn}) - value: ${value}, expected: ${expected}`, (t) => {
    const actual = Optional.of(value)
      .map(fn as never)
      .get();
    t.is(actual, expected);
  });
});

function storeEvenNumber(n: number): Optional<number> {
  return n % 2 === 0 ? Optional.some(n) : Optional.none();
}

// Test flatMap() function
[
  {
    value: 2,
    fn: (v: number) => storeEvenNumber(v),
    expected: 2,
  },
  {
    value: 45,
    fn: (v: number) => storeEvenNumber(v),
    expected: null,
  },
  {
    value: 'Stockholm',
    fn: (v: string) => Optional.of(v),
    expected: 'Stockholm',
  },
  {
    value: 'Oslo',
    fn: (v: string) => Optional.some(v),
    expected: 'Oslo',
  },
].forEach(({ value, fn, expected }) => {
  test(`flatMap(${fn}) - value: ${value}, expected: ${expected}`, (t) => {
    const actual = Optional.of(value)
      .flatMap(fn as never)
      .get();
    t.is(actual, expected);
  });
});

// Test apply() function
[
  {
    value: 4924,
    expected: 4924,
  },
  {
    value: 'Berlin',
    expected: 'Berlin',
  },
  {
    value: false,
    expected: false,
  },
].forEach(({ value, expected }) => {
  test(`apply() - value: ${value}, expected: ${expected}`, (t) => {
    Optional.of(value).apply((actual) => t.is(actual, expected));
  });
});

// Test filter() function
[
  {
    value: 5,
    fn: (v: number) => v % 2 === 0,
    expected: null,
  },
  {
    value: 'John Doe',
    fn: (v: string) => v.includes('Doe'),
    expected: 'John Doe',
  },
  {
    value: 'Bob Lane',
    fn: (v: string) => v.toLowerCase().includes('doe'),
    expected: null,
  },
].forEach(({ value, fn, expected }) => {
  test(`filter(${fn}) - value: ${value}, expected: ${expected}`, (t) => {
    const actual = Optional.of(value)
      .filter(fn as never)
      .get();
    t.is(actual, expected);
  });
});

// Test apply().get()
[
  {
    value: 'Bob Lane',
    fn: (v: string) => v.toLowerCase().includes('doe'),
    expected: 'Bob Lane',
  },
  {
    value: null,
    fn: (v: string) => v.toLowerCase().includes('doe'),
    expected: null,
  },
  {
    value: 423,
    fn: (v: number) => v + 7,
    expected: 423,
  },
].forEach(({ value, fn, expected }) => {
  test(`apply(${fn}).get() - value: ${value}, expected: ${expected}`, (t) => {
    const actual = Optional.of(value)
      .apply(fn as never)
      .get();
    t.is(actual, expected);
  });
});
