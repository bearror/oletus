import fs from 'fs'
import childProcess from 'child_process'
import perfHooks from 'perf_hooks'

export default function run (testDirectory, report = () => {}) {
  const timestamp = perfHooks.performance.now()

  return new Promise((resolve, reject) => {
    fs.readdir(testDirectory, (err, files) => {
      if (err) reject(err)

      let passed = 0
      let failed = 0

      Promise.all(files.map(file => {
        return new Promise(resolve => {
          const forked = childProcess.fork(`${testDirectory}${file}`)

          forked.on('message', ({ didPass, title, location, message }) => {
            didPass ? passed++ : failed++
            report({ didPass, title, location, message, timestamp, file, passed, failed, isComplete: false })
          })

          forked.on('close', () => resolve())
        })
      }))
        .then(() => {
          report({ timestamp, passed, failed, isComplete: true })
          resolve({ passed, failed })
        })
        .catch(err => reject(err))
    })
  })
}
