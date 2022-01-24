type None = null;

export class Optional<T> {
  private constructor(private readonly value: T | None) {}

  /**
   * Create an `Optional` instance with a wrapped none value.
   * @returns Optional with none wrapped value.
   */
  public static none<T>(): Optional<T> {
    return new Optional<T>(null);
  }

  /**
   * Create an `Optional` instance with a provided value.
   * @param value
   * @returns Optional with some wrapped value.
   */
  public static some<T>(value: T): Optional<T> {
    return new Optional<T>(value);
  }

  /**
   * Create an `Optional` instance from provided value.
   * This method will determine if the provided value is some or none.
   * @param value
   * @returns Optional with either some or none wrapped value.
   */
  public static of<T>(value: T | None): Optional<T> {
    if (value === undefined || value === null) {
      return Optional.none();
    }
    return Optional.some(value);
  }

  /**
   * Get the wrapped optional value.
   * @returns Wrapped value.
   */
  public get(): T | None {
    return this.value;
  }

  /**
   * Transform wrapped value.
   * @param fn Transforming function.
   * @returns Optional with new wrapped value type.
   */
  public map<U>(fn: (value: T) => U): Optional<U> {
    if (this.isNone()) {
      return Optional.none();
    }
    return Optional.some(fn(this.value as T));
  }

  /**
   * Flatten a nested `Optional`.
   * @param fn Flattening function that returns a new `Optional`.
   * @returns New `Optional<U>` value.
   */
  public flatMap<U>(fn: (value: T) => Optional<U>): Optional<U> {
    if (this.isNone()) {
      return Optional.none();
    }
    return fn(this.value as T);
  }

  /**
   * Apply a function if the wrapped value is not none.
   * @param fn Callback function.
   * @returns Same `Optional` instance.
   */
  public apply(fn: (value: T) => void): Optional<T> {
    if (!this.isNone()) {
      fn(this.value as T);
    }

    return this;
  }

  /**
   * Filter on an `Optional`.
   * @param predicate Predicate function which determines if returned value should return `this` or none.
   * @returns Same instance or none.
   */
  public filter(predicate: (value: T) => boolean): Optional<T> {
    if (this.isNone()) {
      return this;
    }

    return predicate(this.value as T) ? this : Optional.none();
  }

  /**
   * Run a callback function if wrapped value is none to give back a non none value.
   * @typeParam T A non nullable type.
   * @param fn Callback function.
   * @returns Same instance.
   */
  public getOrElse(fn: () => NonNullable<T>): T {
    if (this.isNone()) {
      return fn();
    }

    return this.value as T;
  }

  /**
   * A property to determine if the wrapped value has a value.
   */
  public get hasValue(): boolean {
    return this.isNone() === false;
  }

  private isNone(): boolean {
    return this.value === undefined || this.value === null;
  }
}
