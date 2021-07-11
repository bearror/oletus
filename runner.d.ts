import type { Report } from "./report"

export interface RunnerResult {
  readonly passed: number
  readonly failed: number
  readonly crashed: number
  readonly pending: number
}

export default function run(
  files: readonly string[],
  reportConsumer: (report: Report) => void
): Promise<RunnerResult>
