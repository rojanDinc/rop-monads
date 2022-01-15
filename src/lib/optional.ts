type None = null;

export class Optional<T> {
  private readonly value: T | None;
  private constructor(value: T | None) {
    this.value = value;
  }

  public static none<T>(): Optional<T> {
    return new Optional<T>(null);
  }

  public static some<T>(value: T): Optional<T> {
    return new Optional<T>(value);
  }

  public static of<T>(value: T | None): Optional<T> {
    if (value === undefined || value === null) {
      return Optional.none();
    }
    return Optional.some(value);
  }

  private isNone(): boolean {
    return this.value === undefined || this.value === null;
  }

  public get(): T | None {
    return this.value;
  }

  public map<U>(fn: (value: T) => U): Optional<U> {
    if (this.isNone()) {
      return Optional.none();
    }
    return Optional.some(fn(this.value as T));
  }

  public flatMap<U>(fn: (value: T) => Optional<U>): Optional<U> {
    if (this.isNone()) {
      return Optional.none();
    }
    return fn(this.value as T);
  }

  public apply(fn: (value: T) => void): Optional<T> {
    if (!this.isNone()) {
      fn(this.value as T);
    }

    return this;
  }

  public filter(predicate: (value: T) => boolean): Optional<T> {
    switch (this.isNone()) {
      case true:
        return this;
      case false:
        return predicate(this.value as T) ? this : Optional.none();
    }
  }

  public orElse(fn: () => T): T {
    if (this.isNone()) {
      return fn();
    }

    return this.value as T;
  }

  public get hasValue(): boolean {
    return this.isNone() === false;
  }
}
