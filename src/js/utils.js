//const deepmerge = require('deepmerge')

export function randomItem(vals, weights) {
  weights = weights || []

  if (weights.length != vals.length) {
    return vals[Math.floor(Math.random() * vals.length)]
  } else {
    // https://stackoverflow.com/questions/43566019/how-to-choose-a-weighted-random-array-element-in-javascript
    const sum = weights.reduce((acc, el) => acc + el, 0)
    let acc = 0
    weights = weights.map(el => (acc = el + acc))
    let rand = Math.random() * sum
    return vals[weights.filter(el => el <= rand).length]
  }
}

// https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
export function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr
}

export function range(from, to) {
  return [...Array(to - from).keys()].map(i => i + from)
}

/*export function merge(a, b) {
  const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray
  return deepmerge(a, b, { arrayMerge: overwriteMerge })
}*/
