import type { StrictAssertModule } from "./assert.js"

export interface TestResult {
  readonly id: number
  readonly status: "passed" | "pending" | "failed"
  readonly title: string
  readonly location: string
  readonly message: string
}

export default function test(
  title: string,
  implementation: (t: StrictAssertModule) => void
): Promise<TestResult>
