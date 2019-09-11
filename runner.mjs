import childProcess from 'child_process'
import perfHooks from 'perf_hooks'
import os from 'os'
import batchPromise from './batch-promise.mjs'
import { Pass, Fail, File, Crash, Completion } from './report.mjs'

export default function run (files, report = () => {}) {
  const timestamp = perfHooks.performance.now()
  let passed = 0
  let failed = 0
  let crashed = 0

  return batchPromise(files, os.cpus().length, file => {
    return new Promise((resolve, reject) => {
      const stderr = []
      const forked = childProcess.fork(file, {
        stdio: ['ignore', 'inherit', 'pipe', 'ipc']
      })

      forked.stderr.once('error', reject)
      forked.once('error', reject)

      forked.stderr.on('data', data => {
        stderr.push(data)
      })

      forked.on('message', ({ didPass, title, location, message }) => {
        if (didPass) {
          passed++
          report(Pass(timestamp, passed, failed, { file, title }))
        } else {
          failed++
          report(Fail(timestamp, passed, failed, { file, title, location, message }))
        }
      })

      forked.on('close', code => {
        if (code === 0) {
          report(File(timestamp, passed, failed, { file, stderr }))
        } else {
          crashed++
          report(Crash(timestamp, passed, failed, { file, code, stderr }))
        }
        resolve()
      })
    })
  })
    .then(() => {
      report(Completion(timestamp, passed, failed))
      return { passed, failed, crashed }
    })
}
