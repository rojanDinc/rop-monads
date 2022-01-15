type Ok<T> = {
  kind: 'OK';
  value: T;
};

type Failure<F> = {
  kind: 'FAILURE';
  failure: F;
};

export class Result<T, F> {
  private constructor(private readonly wrapped: Ok<T> | Failure<F>) {}

  /**
   * This method creates an `Result` from an "ok" value.
   * @param value
   * @returns `Result` object
   */
  public static ok<T, F>(value: T): Result<T, F> {
    return new Result({
      kind: 'OK',
      value,
    });
  }

  /**
   * This method creates an `Result` from an `Error` value.
   * @param err Must be an `Error` or a child object of `Error`
   * @returns `Result` object
   */
  public static err<T, F>(failure: F): Result<T, F> {
    return new Result({
      kind: 'FAILURE',
      failure,
    });
  }

  /**
   * Transform a function to `Result`.
   * ```typescript
   * Result.of(() => {
   *  return myFunction();
   * });
   * ```
   * @param throwableFn Throwable function which can throw or give an value
   * @returns `Result` object
   */
  public static of<T, F>(throwableFn: () => T | never): Result<T, F> {
    try {
      return Result.ok(throwableFn());
    } catch (error) {
      return Result.err(error as never);
    }
  }

  /**
   * Get the wrapped value in the `Result`.
   * ```typescript
   * try {
   *  const value = result.get();
   * } catch (e) {
   *  // handle Failure
   * }
   * ```
   * @typeParam `T`
   * @typeParam `F`
   * @throws `F` if it is an instance of `Error`
   * @returns the wrapped value
   */
  public get(): T {
    switch (this.wrapped.kind) {
      case 'OK':
        return this.wrapped.value;
      case 'FAILURE':
        throw this.wrapped.failure;
    }
  }

  /**
   * Transform the wrapped `Result` value to a new value.
   * @typeParam `U` the type of the new transformed value
   * @param fn Function transforming the wrapped value to a new one
   * @returns A new `Result` with a new wrapped value
   */
  public map<U>(fn: (wrapped: T) => U): Result<U, F> {
    switch (this.wrapped.kind) {
      case 'OK':
        return Result.ok(fn(this.wrapped.value));
      case 'FAILURE':
        return Result.err(this.wrapped.failure);
    }
  }

  /**
   * Transform the wrapped `Result` error to a new error.
   * @typeParam `E` should be of type `Error`
   * @param fn Function transforming the wrapped error to a new one
   * @returns A new `Result` with a new wrapped error
   */
  public mapError<E>(fn: (wrapped: F) => E): Result<T, E> {
    switch (this.wrapped.kind) {
      case 'OK':
        return Result.ok(this.wrapped.value);
      case 'FAILURE':
        return Result.err(fn(this.wrapped.failure));
    }
  }

  /**
   * Transform `Result<T, Failure>` success type to a new one e.g. `Result<U, F>`.
   * @typeParam
   * @param fn
   * @returns
   */
  public flatMap<U>(fn: (wrapped: T) => Result<U, F>): Result<U, F> {
    switch (this.wrapped.kind) {
      case 'OK':
        return fn(this.wrapped.value);
      case 'FAILURE':
        return Result.err(this.wrapped.failure);
    }
  }

  public flatMapError<E>(fn: (wrapped: F) => Result<T, E>): Result<T, E> {
    switch (this.wrapped.kind) {
      case 'OK':
        return Result.ok(this.wrapped.value);
      case 'FAILURE':
        return fn(this.wrapped.failure);
    }
  }

  public apply(fn: (wrapped: T) => void): Result<T, F> {
    if (this.wrapped.kind === 'OK') fn(this.wrapped.value);
    return this;
  }

  public applyError(fn: (wrapped: F) => void): Result<T, F> {
    if (this.wrapped.kind === 'FAILURE') fn(this.wrapped.failure);
    return this;
  }

  public match(cases: {
    ok: (value: T) => void;
    err: (failure: F) => void;
  }): Result<T, F> {
    switch (this.wrapped.kind) {
      case 'OK':
        cases.ok(this.wrapped.value);
        break;
      case 'FAILURE':
        cases.err(this.wrapped.failure);
        break;
    }
    return this;
  }
}
