import childProcess from 'child_process'
import perfHooks from 'perf_hooks'
import os from 'os'
import batchPromise from './batch-promise.js'
import { Pass, Fail, File, Crash, Completion } from './report.js'

export default function run (files, report = () => {}) {
  const timestamp = perfHooks.performance.now()
  let passed = 0
  let failed = 0
  let crashed = 0
  let pending = 0

  return batchPromise(files, os.cpus().length, file => {
    return new Promise((resolve, reject) => {
      let running = new Map
      const stderr = []
      const forked = childProcess.fork(file, {
        stdio: ['ignore', 'inherit', 'pipe', 'ipc']
      })

      forked.stderr.once('error', reject)
      forked.once('error', reject)

      forked.stderr.on('data', data => {
        stderr.push(data)
      })

      forked.on('message', ({ id, status, title, location, message }) => {
        if (status === 'pending') {
          running.set(id, title)
          pending++
        } else if (status === 'passed') {
          running.delete(id)
          pending--
          passed++
          report(Pass(timestamp, passed, failed, pending, { file, title, running }))
        } else {
          running.delete(id)
          pending--
          failed++
          report(Fail(timestamp, passed, failed, pending, { file, title, running, location, message }))
        }
      })

      forked.on('close', code => {
        if (code === 0) {
          report(File(timestamp, passed, failed, pending, { file, running, stderr }))
        } else {
          pending -= running.size
          crashed++
          report(Crash(timestamp, passed, failed, pending, { file, code, stderr }))
        }
        resolve()
      })
    })
  })
    .then(() => {
      report(Completion(timestamp, passed, failed, pending))
      return { passed, failed, crashed, pending }
    })
}
