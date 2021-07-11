export type AssertPredicate =
  | RegExp
  | (new () => object)
  | ((thrown: unknown) => boolean)
  | {
      readonly name?: string | RegExp
      readonly message?: string | RegExp
      readonly [k: string]: unknown
    }
  | Error

export interface StrictAssertModule {
  fail(message?: string | Error): never

  ok(value: unknown, message?: string | Error): void

  equal<T>(actual: unknown, expected: T, message?: string | Error): void

  notEqual(actual: unknown, expected: unknown, message?: string | Error): void

  deepEqual<T>(actual: unknown, expected: T, message?: string | Error): void

  notDeepEqual(
    actual: unknown,
    expected: unknown,
    message?: string | Error
  ): void

  throws(block: () => unknown, message?: string | Error): void
  throws(
    block: () => unknown,
    error: AssertPredicate,
    message?: string | Error
  ): void

  doesNotThrow(block: () => unknown, message?: string | Error): void
  doesNotThrow(
    block: () => unknown,
    error: AssertPredicate,
    message?: string | Error
  ): void

  ifError(value: unknown): void

  rejects(
    block: (() => Promise<unknown>) | Promise<unknown>,
    message?: string | Error
  ): Promise<void>
  rejects(
    block: (() => Promise<unknown>) | Promise<unknown>,
    error: AssertPredicate,
    message?: string | Error
  ): Promise<void>

  doesNotReject(
    block: (() => Promise<unknown>) | Promise<unknown>,
    message?: string | Error
  ): Promise<void>
  doesNotReject(
    block: (() => Promise<unknown>) | Promise<unknown>,
    error: AssertPredicate,
    message?: string | Error
  ): Promise<void>

  match(value: string, regExp: RegExp, message?: string | Error): void

  doesNotMatch(value: string, regExp: RegExp, message?: string | Error): void
}
