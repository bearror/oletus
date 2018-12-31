import assert from 'assert'

export default async function test (title, implementation) {
  Error.prepareStackTrace = (e, stack) => stack

  let location = ''
  let lines = []
  let message = ''
  let teardownCalled = true

  let teardownCb = async () => {teardownCalled = false};

  const teardown = cb => {teardownCb = cb}


  try {
    await implementation(assert.strict, teardown)
  } catch (e) {
    location = `${/[^/]*$/.exec(e.stack[0].getFileName())[0]}:${e.stack[0].getLineNumber()}`
    lines = e.toString().split('\n')

    if (lines[0].startsWith('AssertionError [ERR_ASSERTION]: Input A expected to ')) lines.splice(0, 3)

    message = lines.join('\n')
  }

  await teardownCb()

  const didPass = lines.length === 0

  if (process.send) process.send({ didPass, title, location, message, teardownCalled })

  return { didPass, title, location, message, teardownCalled }
}
