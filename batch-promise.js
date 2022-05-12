export default function batchPromise (items, batchSize, fn) {
  let index = batchSize - 1

  function getNextItem () {
    index++

    if (items.length > index) {
      const nextItem = items[index]

      return getCurrentItem(nextItem)
    }
  }

  function getCurrentItem (item) {
    return fn(item)
      .then(() => getNextItem())
  }

  const promises = items.slice(0, batchSize).map(item => {
    return getCurrentItem(item)
  })

  return Promise.all(promises)
}
