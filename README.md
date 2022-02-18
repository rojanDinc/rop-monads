# rop-monads
[![Build Status](https://app.travis-ci.com/rojanDinc/rop-monads.svg?branch=master)](https://app.travis-ci.com/rojanDinc/rop-monads)
[![codecov](https://codecov.io/gh/rojanDinc/rop-monads/branch/master/graph/badge.svg?token=M431CWJG35)](https://codecov.io/gh/rojanDinc/rop-monads)
## Getting started
```
npm install rop-monads

or

yarn add rop-monads
```

## Using rop-monads


#### Optional
```typescript
import { Optional } from 'rop-monads';

const age: Optional<number> = Optional.of(getPerson()) // getPerson() returns an optional object that contains an age
  .map(person => person.age);
```
#### Result

```typescript
import { Result } from 'rop-monads';

const todos: Result<Todo[], CustomError> = apiCall()// returns a result
  .flatMap(json => transformJson(json)) // the transform function can return a result as the json decoding can fail

todos.match({
  ok: todos => handleTodos(todos),
  err: failure => handleFailure(failure)
});
```

Using `Result` in HTTP controllers for example with `express.js`

Error.ts
```typescript
// Discriminated unions which is a recommended way to create failure types
// to be used with this library

type NotFoundError = {
  kind: "NOT_FOUND";
  reason: string;
};

type InternalError = {
  kind: "INTERNAL";
  reason: Error;
};

type PersonError = NotFoundError | InternalError
```

PersonController.ts
```typescript
const personService = getPersonService();

function httpHandleFailure(res: express.Response, failure: PersonError) {
  switch (failure.kind) {
    case "NOT_FOUND":
      log("failed to find person it does not exist", failure.reason);
      return res.status(404).send({ status: 404, message: "person does not exist" });
    case "INTERNAL":
      log("failed to find person", failure.reason.message);
      return res.status(500).send({ status: 500, message: "something went wrong" });
  }
}

// assumed that all functions used are not async
app.get('/person/:id', (req, res) => {
  getIdFromParams(req) // returns a Result
  .flatMap(id => personService.findPerson(id))
  .map(person => encodePerson(person))
  .match({
    ok: personJson => res.status(200).send(personJson),
    err: failure => httpHandleFailure(res, failure)
  });
});
```

For more on how to use this library checkout our [API documentation](https://rojandinc.github.io/rop-monads).
## Contribute
We welcome pull requests. Learn how to [contribute](https://github.com/rojanDinc/rop-monads/blob/master/.github/CONTRIBUTING.md).

## License
rop-monads is [MIT licensed](https://github.com/rojanDinc/rop-monads/blob/master/LICENSE).
