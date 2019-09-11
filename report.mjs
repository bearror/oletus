export const Pass = (timestamp, passed, failed, payload) => ({
  type: 'Pass', timestamp, passed, failed, payload
})

export const Fail = (timestamp, passed, failed, payload) => ({
  type: 'Fail', timestamp, passed, failed, payload
})

export const File = (timestamp, passed, failed, payload) => ({
  type: 'File', timestamp, passed, failed, payload
})

export const Crash = (timestamp, passed, failed, payload) => ({
  type: 'Crash', timestamp, passed, failed, payload
})

export const Completion = (timestamp, passed, failed, payload) => ({
  type: 'Completion', timestamp, passed, failed, payload
})
