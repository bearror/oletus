import assert from 'assert'

export default async function test (title, implementation) {
  Error.prepareStackTrace = (e, stack) => stack

  let location = ''
  let lines = []
  let message = ''

  try {
    await implementation(assert.strict)
  } catch (e) {
    location = `${/[^/]*$/.exec(e.stack[0].getFileName())[0]}:${e.stack[0].getLineNumber()}`
    lines = e.toString().split('\n')

    if (lines[0].startsWith('AssertionError [ERR_ASSERTION]: Input A expected to ')) lines.splice(0, 3)

    message = lines.join('\n')
  }

  const didPass = lines.length === 0

  if (process.send) process.send({ didPass, title, location, message })

  return { didPass, title, location, message }
}
