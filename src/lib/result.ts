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
   * Create an `Result` from an "ok" value.
   * @param value
   * @returns
   */
  public static ok<T, F>(value: T): Result<T, F> {
    return new Result({
      kind: 'OK',
      value,
    });
  }

  /**
   * Create an `Result` from a failure value.
   * @param err
   * @returns
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
   *  return throwableFn();
   * });
   * ```
   * @param throwableFn Throwable function which can throw or return an value
   * @returns
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
   * @throws `F`
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
   * Transform the wrapped "ok" value to a new value.
   * @typeParam `U` the type of the new transformed value
   * @param fn Transforming the wrapped value
   * @returns
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
   * Transform the wrapped "err" to a new error.
   * @typeParam `E`
   * @param fn Transforming the wrapped error
   * @returns
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
   * Transform the current `Result<T, F>` to a new `Result<U, F>`.
   * @typeParam `U`
   * @param fn Transforming the wrapped value to a new `Result`
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

  /**
   * Transform the current `Result<T, F>` to a new `Result<T, E>`.
   * @typeParam `E`
   * @param fn Transforming the wrapped value to a new `Result`
   * @returns
   */
  public flatMapError<E>(fn: (wrapped: F) => Result<T, E>): Result<T, E> {
    switch (this.wrapped.kind) {
      case 'OK':
        return Result.ok(this.wrapped.value);
      case 'FAILURE':
        return fn(this.wrapped.failure);
    }
  }

  /**
   * Apply the provided callback function for successful result.
   * @param fn Callback function
   * @returns
   */
  public apply(fn: (wrapped: T) => void): Result<T, F> {
    if (this.wrapped.kind === 'OK') fn(this.wrapped.value);
    return this;
  }

  /**
   * Apply the provided callback function for unsuccessful result.
   * @param fn Callback function
   * @returns
   */
  public applyError(fn: (wrapped: F) => void): Result<T, F> {
    if (this.wrapped.kind === 'FAILURE') fn(this.wrapped.failure);
    return this;
  }

  /**
   * Pattern match on successful case or failure case.
   * @param cases Object containing callback function for when result is ok or err
   * @returns
   */
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
