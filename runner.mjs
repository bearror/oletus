import childProcess from 'child_process'
import perfHooks from 'perf_hooks'
import os from 'os'
import batchPromise from './batch-promise.mjs'

export default function run (files, report = () => {}) {
  const timestamp = perfHooks.performance.now()
  let passed = 0
  let failed = 0

  return batchPromise(files, os.cpus().length, file => {
    return new Promise(resolve => {
      const forked = childProcess.fork(file)

      forked.on('message', ({ didPass, title, location, message }) => {
        didPass ? passed++ : failed++
        report({ didPass, title, location, message, timestamp, file, passed, failed, isComplete: false })
      })

      forked.on('close', () => resolve())
    })
  })
    .then(() => {
      report({ timestamp, passed, failed, isComplete: true })
      return { passed, failed }
    })
}
