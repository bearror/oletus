export const Pass = (timestamp, passed, failed, pending, payload) => ({
  type: 'Pass', timestamp, passed, failed, pending, payload
})

export const Fail = (timestamp, passed, failed, pending, payload) => ({
  type: 'Fail', timestamp, passed, failed, pending, payload
})

export const File = (timestamp, passed, failed, pending, payload) => ({
  type: 'File', timestamp, passed, failed, pending, payload
})

export const Crash = (timestamp, passed, failed, pending, payload) => ({
  type: 'Crash', timestamp, passed, failed, pending, payload
})

export const Completion = (timestamp, passed, failed, pending, payload) => ({
  type: 'Completion', timestamp, passed, failed, pending, payload
})
