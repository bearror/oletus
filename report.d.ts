export interface ReportPayload {
  readonly file: string
  readonly title: string
  readonly running: Map<unknown, unknown>
}

export interface BaseReport {
  readonly timestamp: number
  readonly passed: number
  readonly failed: number
  readonly pending: number
  readonly payload: ReportPayload
}

export interface Report extends BaseReport {
  readonly type: "Pass" | "Fail" | "File" | "Crash" | "Completion"
}

export interface ReportFactory {
  (br: BaseReport): ReportFactory
}

export const Pass: ReportFactory
export const Fail: ReportFactory
export const File: ReportFactory
export const Crash: ReportFactory
export const Completion: ReportFactory
