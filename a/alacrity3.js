/* last major update Oct 10, 2021 */
/* globals document, window, console, alert, sessionStorage, localStorage */
/* globals Blob */

/* Common shortcuts: */
function $ (x) { return document.getElementById(x) }
const TAU = Math.PI * 2

const alacrity = (function () { // eslint-disable-line no-unused-vars
  function sayHello () { log("'alacrity' library loaded - current version: 3.0 (unstable)") }
  

/* UNIT TESTING */
  const unitTests = (function () {
    const allTests = []
    
    // #todo test
    function add (...tests) {
      allTests.push(tests)
    }

    /**
    * Quick, simple unit testing function.
    * @version 1.2, as of Dec 12, 2020
    * @param {*} actualResult - The actual output, to be tested for equality.
    * @param {*} expectedResult - The expected output to be tested against.
    * @param {string} [testName] - The name of the test (providing a name returns a readout instead of a boolean value).
    * @param {boolean} [suppressLog=false] - Truthy values suppress logging for false tests.
    * @returns {boolean|string} - If given a testName returns a detailed test result readout, else returns a boolean value representing whether the test passed.
    */
    function doTest (testName, actualResult, expectedResult) {
      /* convert to strings so object comparisons work well */
      actualResult = JSON.stringify(actualResult)
      expectedResult = JSON.stringify(expectedResult)

      const result = (actualResult === expectedResult)

      const readout = `${testName} - ${result} 

      Actual result: ${actualResult}

      Expected result: ${expectedResult}
      `

      return {
        pass: result,
        log: readout
      }
    }
    add('alacrity.unitTests.test() aka alacrity.check()',
      [doTest('True Test', 1, 1, 1).pass, true],
      [doTest('False Test', 1, 0, 1).log, 'False Test - false \n\n      Actual result: 1\n\n      Expected result: 0\n      ']
    )

    /** Run a sequence of tests from an array through test() */
    function tests (name, ...testArrays) {
      let failed = []
      testArrays.forEach((a, i) => {
        let result = doTest('', a[0], a[1]) // #todo turn off log suppression and just show passes?
        if (!result.pass) {
          // redo failed tests to get verbose logs
          failed.push(`${name} Test ${i + 1}${result.log}`)
        }
      })
      
      let message = name + ' - PASSED ' + testArrays.length
      if (failed.length > 0) {
        message = `----\n${failed.join('\n')}\n----`
      }
      return message
    }

    /** Run all the tests in the unitTests array. */
    function runUnitTests () {
      const testResults = allTests.map(a => tests(...a))
      log('Unit Test Results:\n-------------------------\n\n' + testResults.join('\n'))
    }

    return {
      add: add,
      do: runUnitTests,
      test: doTest
    }
  }())


/* TYPE CHECKING */
  /**
   * @param {string} typesString - a string of types seperated by spaces that may or may not contain the keywords test, of, with, any
   * @param {...values} - a list of one or more values to check against the typesString with testFunction(), ex 'array of number'
   * #later implement x[digits] keyword
   * #later extend to three layers deep? ex. 'array of dict with name'
   * @note Keywords:
   * test as first word: suppresses logging/error throws
   * of: checks the contents of an array
   * with: checks for specific dictionary keys
   *       (except 'any' which checks for the presence of any keys at all)
   * any: matches any type or key
   * x[digits]: matches only that number of things
   */
  function typeCheck (typesString, ...toCheck) {
    /* individual functions to check for specific types */
    const testDict = {
      string: a => typeof a === 'string',
      number: a => typeof a === 'number',
      object: a => typeof a === 'object',
      function: a => typeof a === 'function',
      dict: a => { return (typeof a === 'object' && !Array.isArray(a)) },
      array: a => Array.isArray(a),
      any: () => true
    }

    /** Fetches functions for checkType() to use. */
    function testFunction (key) {
      if (typeof testDict[key] === 'function') {
        return testDict[key]
      } else {
        log('No test found for type: ' + key)
        return () => false
      }
    }

    /** Handles individual value type checking for typeCheck() */
    function checkType (types, value) {
      const typeArray = copy(types)
      /* @later have this allow multiple nested layers */
      const key = typeArray.shift()
      if (!testFunction(key)(value)) {
        /* One or more of the first round failed. */
        return false
      } else {
        const next = typeArray.shift()
        if (!next) {
          /* The previous checks succeeded and there is no next check. */
          return true
        } else {
          if (next === 'with') {
            if (JSON.stringify(value) === '{}') {
              return false
            } else if (typeArray[0] === 'any' || Object.prototype.hasOwnProperty.call(value, typeArray[0])) {
              return true
            } else {
              return false
            }
          } else if (value.length === 0) {
            /* We're checking for content type, but there are no contents. */
            return false
          } else {
            return value.every(a => testFunction(typeArray[0])(a))
          }
        }
      }
    }

    const typeArray = typesString.split(' ')
    let makeLog = true
    if (typeArray[0] === 'test') { makeLog = false; typeArray.shift() }
    const results = toCheck.map(a => checkType(typeArray, a))
    if (results.every(Boolean)) {
      return true
    } else {
      if (makeLog) {
        throw new Error(`typeCheck failed for type: '${typesString}' on value:`, toCheck)
      }
      return false
    }
  }
  unitTests.add('alacrity.typeCheck()',
    [typeCheck('number', 1), true],
    [typeCheck('test number', 'foo'), false],
    [typeCheck('string', ''), true],
    [typeCheck('array of number', [1, -2, 3]), true],
    [typeCheck('array of number', [1, 2, 4], [4, -10, 3]), true],
    [typeCheck('test array of number', [1, 2, 'taco']), false],
    [typeCheck('array of number x2', [1, 2]), true],
    // [typeCheck('array of number x2', [1, 2, 3]), false],
    [typeCheck('dict with any', { foo: 1 }), true],
    [typeCheck('dict with name', { name: 'Maple' }), true],
    [typeCheck('test dict with name', { tree: 'Maple' }), false],
    [typeCheck('test object with any', {}), false],
    [typeCheck('array of any', [1]), true],
    [typeCheck('test array of any', []), false]
  )


/* GENERAL */
  /** Makes a deep copy of objects with simple properties
   * @note see https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
   * @note Strips out properties whose values are functions or undefined, converts NaN and Infinity to null, stringifies dates, and converts regex to empty objects and otherwise messes up 'Maps, Sets, Blobs, FileLists, ImageDatas, sparse Arrays, Typed Arrays or other complex types'
   */
  function copy (inputObj) { return JSON.parse(JSON.stringify(inputObj)) }
  // #todo include in unit test a date, a regex, infinity, and a map
  unitTests.add('alacrity.copy()',
    [copy({ foo: 2, beep: 'A', bop: 1000, bip: undefined }), { foo: 2, beep: 'A', bop: 1000 }]
  )

  /** A 'safe' wrapper for Object.assign() that won't mutate the target object
    * @note has the same issues copy() does
    * @param {object} targetObject
    * @param {...object} overrideObjects - any number of objects to smoosh into the targetObject
    */
  function smooshObjects (targetObject, ...overrideObjects) {
    typeCheck('object', targetObject, ...overrideObjects)
    return Object.assign(copy(targetObject), ...overrideObjects)
    /* old version:
    let tempJSON = JSON.stringify(mainObject);
    let newObject = JSON.parse(tempJSON);
    for (let key of Object.keys(overrideObject)) {
      newObject[key] = overrideObject[key];
    }
    return newObject;
    */
  }
  unitTests.add('alacrity.smooshObjects() aka alacrity.smoosh()',
    [smooshObjects({ foo: 1, bar: 'Q' }, { foo: 2, beep: 'A', bop: 1000 }), { foo: 2, bar: 'Q', beep: 'A', bop: 1000 }]
  )

  /** Gives each sub-object an entry for its own key */
  // #later make a way to test object equivalency that works even if they properties are listed in different orders
  function storeKeys (obj) {
    for (let key in obj) {
      obj[key].key = key
    }
    return obj
  }
  unitTests.add('alacrity.storeKeys()',
    [storeKeys({ a: { value: 'foo'}, b: { value: 'bar' } }), { a: { value: 'foo', key: 'a' }, b: { value: 'bar', key: 'b' } }]
  )

  /** Makes an array with the values of each property in the object (keys are lost in this process) */
  function unpackObj (obj) {
    // #later if the object's contents are objects also, store the keys (use type check function to see if it's an object of objects?)
    return Object.keys(obj).map(a => obj[a])
  }
  unitTests.add('alacrity.unpackObj() aka alacrity.unpack()',
    [unpackObj({ a: 'foo', b: 'bar' }), ['foo', 'bar']]
  )

  /** Does simple global replacements of strings using an object's keys as things to be replaced with their respective values. */
  function dictReplace (string, dictionary) {
    const regex = RegExp(Object.keys(dictionary).join('|'), 'gi')
    return string.replace(regex, k => dictionary[k])
  }
  unitTests.add('alacrity.dictReplace()',
    [dictReplace('I never eat soggy worms. #truefacts', { ' #truefacts': '', I: 'You', never: 'shouldn\'t' }), 'You shouldn\'t eat soggy worms.']
  )


/* MATH */

  function roundToPlaces (places, number) {
    const precision = Math.pow(10, (+places))
    return Math.round(number * precision) / precision
  }
  unitTests.add('alacrity.round()',
    [roundToPlaces(3, 3.18273481), 3.183]
  )

  /**
   * Wraps numbers around a range, end bound inclusive.
   * @param {number} input - the number to wrap into the specified range
   * @param {number} boundA - one end of the range
   * @param {number} [boundB=0] - the other end of the range
   */
  function fix (input, boundA, boundB = 0) {
    boundA = parseFloat(boundA)
    boundB = parseFloat(boundB)
    const maxN = Math.max(boundA, boundB)
    const minN = Math.min(boundA, boundB)
    let result = parseFloat(input)

    if (isNaN(result) || isNaN(maxN) || isNaN(minN)) {
      log(`Invalid input to fix(): ${prettyPrint(arguments)} - arguments need to be numbers or strings that can be converted to numbers; the third parameter is optional, default 0.`)
      return
    }

    if (minN === maxN) { return minN }
    const step = maxN - minN
    while (result < minN) { result += step }
    while (result > maxN) { result -= step }
    return result
  }
  unitTests.add('alacrity.fix()',
    [fix('20', 0, 10), 10],
    [fix(12.4, -20, 10), -17.6],
    [fix(5, 40, 10), 35],
    [fix(11005, 40), 5]
  )

  /* Maps inputs between different ranges. */
  function rangeMap (sourceMin, sourceMax, destMin, destMax, input) { 
    // find what proportion of the distance and then lerp
    let totalDistance = sourceMax - sourceMin
    let travel = (input - sourceMin) / totalDistance
    return lerp(destMin, destMax, travel)
  }
  unitTests.add('alacrity.rangeMap()',
    [rangeMap(0, 10, 20, 2000, 5), 1010],
    [rangeMap(0, 10, 20, 2000, 2), 416],
    [rangeMap(0, 10, -2000, 2000, 2), -1200]
  )

  /**
   * @param {number} boundA - one bound of the result
   * @param {number} [boundB = 0] - the other bound of the result
   * @returns {integer} an integer between boundA and boundB, inclusive of boundA and boundB if they are integers. No serious effort is made to ensure ideal distribution.
   */
  function randBetween (boundA, boundB = 0) {
    boundA = parseFloat(boundA)
    boundB = parseFloat(boundB)
    if (isNaN(boundA) || isNaN(boundB)) {
      log(`Invalid inputs given to randBetween() - ${prettyPrint(arguments)} - arguments need to be numbers (or strings that can be converted to numbers); the second parameter is optional, default 0.`)
      return
    }
    const lower = Math.ceil(Math.min(boundA, boundB))
    const upper = Math.floor(Math.max(boundA, boundB))
    return Math.floor(lower + (upper - lower + 1) * Math.random())
  }
  unitTests.add('alacrity.randBetween()',
    [randBetween('20', 0) >= 0, true],
    [randBetween(0, -20) <= 0, true],
    [randBetween(5, 5), 5],
    [randBetween(11005) <= 11005, true]
  )

  /** Quick/temporary solution for making unique IDs when testing projects
   * @note see https://github.com/davidbau/seedrandom for a seeded RNG library
   */
  function newId () {
    /* uses the maximum value for a 32-bit unsigned integer; 2^32 - could possibly give repeat ids but very unlikely to */
    return Math.ceil(Math.random() * 4294967295).toString(16)
  }
  unitTests.add('alacrity.newId()',
    [newId() === newId(), false]
    //[t2, true]
  )

  /** Performs linear interpolation between two known points, returning a number between v1 and v2 t% the way across and which returns v1 when t = 1. If t is not specified, returns the halfway point. */
  function lerp (v1, v2, t = 0.5) {
    /* Arrow function used here to keep in scope for t: */
    const lr = a => ((1 - t) * a[0] + t * a[1])
    if (typeof v1 === 'number') {
      return lr([v1, v2])
    } else {
      return transpose([v1, v2]).map(lr)
    }
  }
  unitTests.add('alacrity.lerp()',
    [lerp(0, 10), 5],
    [lerp(10, 20, 0.1), 11],
    [lerp([0, 4, 2], [20, 0, -10], 0.5), [10, 2, -4]]
  )

  /**
  * Offsets one point towards another by a specifc distance; see also lerp() to offset one point towards another by proportion of the distance.
  * @later refactor this to find the unit vector and then multiply?
  */
  function offsetTowards (firstCoordArr, secondCoordArr, offsetDistance = 1) {
    const totalDist = distanceBetweenTwoPoints(firstCoordArr, secondCoordArr)
    const relDist = offsetDistance / totalDist
    return lerp(firstCoordArr, secondCoordArr, relDist)
  }

  /** Finds the offset in positive or negative distance travelled on each axis between two coordinates in N dimensional space. */
  // see also diff()
  function findOffset (...args) {
    /* if our array ended up with too many layers, unwrap it */
    if (args.length === 1) { args = args[0] }
    const subtract = (a, b) => a - b
    if (typeof args[0] === 'number') {
      return subtract(...args)
    } else {
      /* subtract the values of the second array from the first */
      // findme
      // return mapReduce(subtract, transpose(args));
      return pairwise((a, b) => a - b, args)
    }
  }
  unitTests.add('alacrity.findOffset()',
    [findOffset(0, 4), -4],
    [findOffset([0, 4]), -4],
    [findOffset([0, 1], [0, 2]), [0, -1]],
    [findOffset([-5, 1, 0], [1, 0, 6]), [-6, 1, -6]]
  )


  /* VECTORS */

  /** Normalize/find unit vector from vector array/array of magnitudes by axis.
   * @param {number[]} vectorArray - an array of N numbers
   * @returns {number[]} a vector array/array of N magnitudes that covers a unit distance/distance of 1 unit
   */
  function normalizeVector (vectorArray) {
    const magnitude = findVectorMagnitude(vectorArray)
    return vectorArray.map(a => a / magnitude)
  }

  /**
   * Finds the magnitude of a vector by returning the square root of the sum
   * of the squares of each number in the array.
   * @param {number[]} vectorArray - an array of numbers comprising a vector
   */
  function findVectorMagnitude (vectorArray) {
    typeCheck('array', vectorArray)
    return Math.hypot(...vectorArray)
    // return Math.sqrt(vectorArray.map(a => a * a).reduce((a, b) => a + b));
  }
  unitTests.add('alacrity.findVectorMagnitude() and alacrity.normalizeVector()',
    [findVectorMagnitude(normalizeVector([1, 2, 3])), 1],
    [findVectorMagnitude([3, 4]), 5]
  )

  /**
   * Calculates distance in N-dimensional space.
    * @note See also lengthFromPoints() for the length of a path that has 3+ points.
   */
  function distanceBetweenTwoPoints (pointA, pointB) {
    const vector = findOffset(pointA, pointB)
    if (typeof vector === 'number') {
      return Math.abs(vector)
    } else {
      return findVectorMagnitude(vector)
    }
  }
  unitTests.add('alacrity.dist()',
    [distanceBetweenTwoPoints(0, 4), 4],
    [distanceBetweenTwoPoints([0, 1], [0, 2]), 1],
    [Math.floor(distanceBetweenTwoPoints([-5, 1, 0], [1, 0, 6])), 8]
  )

  function lengthFromPoints (...args) {
    const list = mapReduce(distanceBetweenTwoPoints, getEachPair(args))
    return list.reduce((a, b) => a + b)
  }
  unitTests.add('alacrity.length()',
    [lengthFromPoints(-5, 1), 6],
    [lengthFromPoints([-5, 1], [0, 1], [0, 6]), 10],
    [lengthFromPoints([-5, 1, 0], [0, 1, 0], [0, 1, 10]), 15]
  )



  /* ARRAYS */

  /* Given a range begin, end, and step value return an array of values in that range (not end bound inclusive) */
  // rounding to keep from getting weird repeating numbers and unexpected behavior with fraction + decimal steps
  function range (...args) {
    /** from https://github.com/gebrkn/bits/blob/master/range.js */
    function * rangeMaker (a, b, step) {
      switch (arguments.length) {
        case 0:
          return
        case 1:
          b = Number(a)
          a = 0
          step = 1
          break
        case 2:
          a = Number(a)
          b = Number(b)
          step = a < b ? +1 : -1
          break
        case 3:
          a = Number(a)
          b = Number(b)
          step = Number(step)
          break
      }

      if (Number.isNaN(a) || Number.isNaN(b) || Number.isNaN(step)) { return }

      if (a === b || !step) { return }

      if (a < b) {
        if (step < 0) { return }
        while (a < b) {
          yield a
          a = roundToPlaces(15, a + step)
        }
      }

      if (a > b) {
        if (step > 0) { return }
        while (a > b) {
          yield a
          a = roundToPlaces(15, a + step)
        }
      }
    }

    return [...rangeMaker(...args)]
  }
  unitTests.add('alacrity.range()',
    [range(6), [0, 1, 2, 3, 4, 5]],
    [range(1, 10), [1, 2, 3, 4, 5, 6, 7, 8, 9]],
    [range(-50, 20, 10), [-50, -40, -30, -20, -10, 0, 10]],
    [range(0, 1, 0.1), [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]],
  )

  /**
   * Adds a value into the input string or array at a given index, replacing the original contents to do so proportionately to the length of the new value. Will return a string or array that is shorter than the original if given an empty string as input.
   * @note if the value has a length, the whole thing will be inserted (replacing the existing entries at the corresponding indeces)
   */
  function editValueAt (stringOrArray, index, value = null) {
    if (index >= stringOrArray.length) {
      log(`The position given to editValueAt(), ${index}, is past the end of ${prettyPrint(stringOrArray)}`)
      return stringOrArray
    } else if (value === null) {
      log(`Invalid insert argument passed to editValueAt: ${value} with args ${stringOrArray} and ${index}`)
      return stringOrArray
    } else {
      let length = value.length
      if (typeof stringOrArray === 'object' && typeof value === 'string') {
        length = 1
      }
      return stringOrArray.slice(0, index).concat(value).concat(stringOrArray.slice(index + length))
    }
  }
  unitTests.add('alacrity.editValueAt()',
    [editValueAt('beep bop', 0, 'boop '), 'boop bop'],
    [editValueAt([1, 3, 4, 5], 1, [2, 3]), [1, 2, 3, 5]],
    [editValueAt([1, 3, 4, 5], 2, 'foo'), [1, 3, 'foo', 5]],
    //[editValueAt([1, 3, 4, 5], 1), [1, 3, 4, 5]] // logs issue
    //[editValueAt([1, 3, 4, 5], 10, 4), [1, 3, 4, 5]] // logs issue
  )

  /** Adds the value into the input string or array at a given index, displacing the original contents. */
  function spliceInto (stringOrArray, index, value) {
    return stringOrArray.slice(0, index).concat(value).concat(stringOrArray.slice(index))
  }
  unitTests.add('alacrity.spliceInto()',
    [spliceInto('ac', 1, 'b'), 'abc'],
    [spliceInto([1, 4, 5], 1, [2, 3]), [1, 2, 3, 4, 5]]
  )

  function removeFromArray(thing, array, noisy = true) {
    // #todo move this to alacrity mini library
    // #todo test that this is working - if not it may cause issues later
    // via https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array
    const index = array.indexOf(thing)
    if (index > -1) {
      array.splice(index, 1); // remove the item
    } else if (noisy) {
      console.log('Didn\'t find ' + thing + ' in ' + array) 
    }
    return array
  }
  unitTests.add('alacrity.remove()',
    [removeFromArray(1, ['ac', 1, 'b']), ['ac', 'b']],
    [removeFromArray('b', ['ac', 1, 'b']), ['ac', 1]],
    [removeFromArray(1, [1, 4, 5]), [4, 5]]
  )

  /** Returns an element of the input array at random. */
  function getRandomArrayElement (arr) {
    return arr[Math.floor(arr.length * Math.random())]
  }
  unitTests.add('getRandomArrayElement()',
    [getRandomArrayElement([1]), 1],
    [getRandomArrayElement([0, 1, 2, 3]) in [5, 6, 7, 8], true]
  )

  /** Uses the Fisher-Yates shuffle to shuffle an array (walk the array in the reverse order and swap each element with a random one before it)
   * {@link https://javascript.info/task/shuffle source}
   */
  function shuffle (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      /* swap elements array[i] and array[j]
         could also be written as:
         let t = array[i]; array[i] = array[j]; array[j] = t
      */
      [array[i], array[j]] = [array[j], array[i]]
    }
  }

  /**
   * Transposes a multidimensional array; using twice will return to original array.
   * {@link https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript source}
   */
  function transpose (m) {
    return m[0].map((x, i) => m.map(x => x[i]))
  }
  unitTests.add('alacrity.transpose()',
    [transpose([[0, 2], [1, 0], [3, 5]]), [[0, 1, 3], [2, 0, 5]]]
  )

  /** Rotates a matrix in 90 degree increments, clockwise */
  function rotate (matrix, turns = 1, columns = false) {
    let turn = a => transpose(a.reverse())
    if ((turns < 0 && !columns) || (turns > 0 && columns)) {
      turn = a => transpose(a).reverse()
    }
    turns = Math.abs(turns)
    for (let i = 0; i < turns; i++) {
      matrix = turn(matrix)
    }
    return matrix
  }
  unitTests.add('alacrity.rotate()',
    [rotate([[0, 2], [1, 0], [3, 5]]), [[3, 1, 0], [5, 0, 2]]],
    [rotate([[0, 2], [1, 0], [3, 5]], 1, true), [[2, 0, 5], [0, 1, 3]]],
    [rotate([[0, 2], [1, 0], [3, 5]], 1), [[3, 1, 0], [5, 0, 2]]],
    [rotate([[0, 2], [1, 0], [3, 5]], -1), [[2, 0, 5], [0, 1, 3]]],
    [rotate([[0, 1, 3], [2, 0, 5]], -2), [[5, 0, 2], [3, 1, 0]]]
  )

  /** Applies a given function to reduce all the arrays within a multidimensional array. */
  function mapReduce (reduceWith, mArr) {
    typeCheck('array of array', mArr)
    return mArr.map(a => a.reduce(reduceWith))
  }

  function getEachPair (array) {
    typeCheck('array', array)
    const copy1 = copy(array)
    const copy2 = copy(array)
    copy1.pop()
    copy2.shift()
    return transpose([copy1, copy2])
  }
  unitTests.add('getEachPair()',
    [getEachPair([1, 2, 4, 5, 7]), [[1, 2], [2, 4], [4, 5], [5, 7]]],
    [getEachPair([[-5, 1, 0], [0, 1, 0], [0, 1, 10]]), [[[-5, 1, 0], [0, 1, 0]], [[0, 1, 0], [0, 1, 10]]]]
  )

  function zip (...args) {
    let first = args.shift()
    return first.map((a, i) => {
      let innerArray = [a]
      args.forEach(b => { 
        innerArray.push( b[i] ) 
      })
      return innerArray
    })
  }
  unitTests.add('alacrity.zip()',
    [zip([1, 2, 4, 5, 7], [1, 2, 100, 5, 7]), [[1, 1], [2, 2], [4, 100], [5, 5], [7, 7]]],
  )

  /** @later start replacing places where I do transpose and mapreduce anyway? */
  function pairwise (func, vectors) {
    typeCheck('function', func)
    typeCheck('array', vectors)
    return mapReduce(func, transpose(vectors))
  }
  unitTests.add('alacrity.pairwise()',
    [pairwise((a, b) => a + b, [[0, 2], [2, 6]]), [2, 8]]
  )

  /** Sorts mixed arrays of letters and numbers and capitalized/uncapitalized strings neatly; by default it sorts letters before numbers and capital letters before the same letter in lowercase. */
  function sensibleSort (a, b, numsFirst) {
    let x = a
    let y = b
    if (typeof x === 'string') {
      if (typeof y !== 'string') {
        if (numsFirst) { return 1 } else { return -1 }
      }
      x = x.toLowerCase()
    }
    if (typeof y === 'string') {
      if (typeof x !== 'string') {
        if (numsFirst) { return -1 } else { return 1 }
      }
      y = y.toLowerCase()

      // put capital letters first:
      if (typeof x === 'string' && x.charAt(0) === y.charAt(0) && a.charAt(0) !== b.charAt(0)) {
        if (x !== a) { return -1 }
        if (y !== b) { return 1 }
      }
    }
    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
  }
  unitTests.add('alacrity.sensibleSort()',
    [['C', 'b', 20, 'c', 'a', 'A', 'B', 500, 1, 2, 3].sort(sensibleSort),
      ['A', 'a', 'B', 'b', 'C', 'c', 1, 2, 3, 20, 500]]
  )

  /**
   * Sorts an array of objects by the contents of a particular key in those objects using sensibleSort().
   * @note Recent Change: added numsFirst to pass into sensibleSort, rearranged parameters
   */
  function sortByKey (objectToSort, key, numsFirst) {
    if (!Array.isArray(objectToSort)) {
      objectToSort = unpackObj(objectToSort)
    }
    return objectToSort.sort((a, b) => {
      return sensibleSort(a[key], b[key], numsFirst)
    })
  }
  unitTests.add('alacrity.sortByKey()',
    [sortByKey([{ foo: 3, bar: 'c' }, { foo: 1, bar: 'a' }, { foo: 2, bar: 'B' }], 'bar'),
    [{ foo: 1, bar: 'a' }, { foo: 2, bar: 'B' }, { foo: 3, bar: 'c' }]],
    [sortByKey([{ foo: 2, bar: 'c' }, { foo: 1, bar: 'a' }, { foo: 3, bar: 'B' }], 'foo'),
    [{ foo: 1, bar: 'a' }, { foo: 2, bar: 'c' }, { foo: 3, bar: 'B' }]],
    [sortByKey({ q: { foo: 2, bar: 'c' }, r: { foo: 1, bar: 'a' }, s: { foo: 3, bar: 'B' } }, 'foo'),
    [{ foo: 1, bar: 'a' }, { foo: 2, bar: 'c' }, { foo: 3, bar: 'B' }]]
  )

  /**
   * Sorts a map object and returns a sorted version.
   * Currently unused/here in case it's handy.
   * @note Recent Change: added numsFirst to pass into sensibleSort
   * {@link https://stackoverflow.com/questions/31158902/is-it-possible-to-sort-a-es6-map-object source}
   */
  function sortMap (mapObj, numsFirst) {
    return new Map([...mapObj.entries()].sort((a, b) => { sensibleSort(a, b, numsFirst) }))
  }

  /* HTML & CSS */
  function reflow () {
    // see https://gist.github.com/paulirish/5d52fb081b3570c81e3a
    let foo = window.scrollX;
  }

  function addStyle(styleString) {
    // via https://stackoverflow.com/questions/15505225/inject-css-stylesheet-as-string-using-javascript
    const css = document.createElement('style');
    css.textContent = styleString;
    css.type = 'text/css';
    if (css.styleSheet) css.styleSheet.cssText = styleString; // for IE? untested
    document.head.append(css);
  }

  /* sets the attributes of a DOM object */
  function setAttributes (element, object) {
    Object.keys(object).forEach(key => {
      if (key[0] !== '_') {
        element.setAttribute(key, object[key])
      }
    })
    return element
  }

  /* NEEDS REFACTOR */
  
  /** given an object with _element name and various properties, assemble and return a DOM object
   * will not work as expected to add inline SVG elements; use svg.js for inline SVG
   */
  function create (type, contents, object) {
    const newElement = document.createElement(type)
    if (contents) { newElement.innerHTML = contents }
    if (object) { setAttributes(newElement, object) }
    return newElement
  }

  /** DEPRECIATED: use create() instead wherever possible
   * given an object with _element name and various properties, assemble and return HTML string
   */
  function makeElement (elementTemplateObject) {
    const elementType = elementTemplateObject._element
    if (!elementType) {
      log('error! invalid object passed to makeElement():\n' + prettyPrint(elementTemplateObject))
      return
    }
    let htmlString = '<' + elementType
    let contents = ''
    const allKeys = Object.keys(elementTemplateObject)
    for (let aspect = 0; aspect < allKeys.length; aspect++) {
      const name = allKeys[aspect]
      if (name.charAt(0) === '_') {
        if (name === '_contents') {
          contents += elementTemplateObject[name]
        }
      } else {
        htmlString += ' ' + name + '="'
        htmlString += elementTemplateObject[name]
        htmlString += '"'
      }
    }
    if (contents !== '') {
      htmlString += '>' + contents
      htmlString += '</' + elementType + '>'
    } else {
      htmlString += '/>'
    }
    return htmlString
  }

  /** Returns a neatly formatted string given most input; may butcher short objects containing strings with spaces. */
  function prettyPrint (x) {
    if (typeof x === 'string') {
      return x
    } else {
      if (x === undefined) { return 'undefined' }
      if (typeof x === 'number' && isNaN(x)) { x = 'NaN' }
      let longString = JSON.stringify(x, null, 2)
      if (longString.replace(/\s/g, '').length < 120) {
        /* So short arrays etc can fit on one line */
        // may butcher short objects containing strings with spaces. Look into this @later
        longString = JSON.stringify(x)
      }
      return longString
    }
  }

  /**
   * Logs things in the standard format for this library so it's clear where the error came from.
   * @param {...*} - any number of inputs to be logged as a single entry
   * @returns {*} the first parameter, to be used for inline debugging
   */
  function log (input) {
    const logString = [...arguments].map(prettyPrint).join(' ')
    console.log(`~alacrity.log~\n\n${logString}\n\n`)
    return input
  }

  // #todo consider if I want to use this or not, may just remove:
  /** Creates a new paragraph element in the page body containing the specified text in a preformatted block.
   * @param {...*} - any number of inputs to print neatly inside the preformatted block
   * @returns {*} the first input so it can be easily used for debugging.
   */
  function printMe (input) {
    /**
    * Creates an element of a given type in the page body.
    * @todo make this work better with/alongside makeElement()
    */
    function quickAddElement (type, innerHtml = '', newId = '') {
      typeCheck('string', type, innerHtml, newId)
      const newElement = document.createElement(type)
      document.body.appendChild(newElement)
      newElement.innerHTML = innerHtml
      if (newId) { newElement.id = newId }
    }
    const logString = [...arguments].map(prettyPrint).join(' ')
    quickAddElement('p', `<pre>${logString}</pre>`)
    return input
  }


  /* FILES */
  /**
   * Generates and exports a text file. File is automatically downloaded; in older browsers users may need to click the "Download File" link, otherwise it happens automatically when the function is called.
   * #todo add date+time stamp to exported files
   * @param {string} textToSave - the text so save as the file contents
   * @param {string} [fileName] - the name of the file; if no extension is included, .txt will be used
   */
  function saveTextAsFile (textToSave, fileName = 'exported.txt') {
    const textToSaveAsBlob = new Blob([textToSave], { type: 'text/plain' })
    const textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob)
    const downloadLink = document.createElement('a')
    downloadLink.download = fileName
    downloadLink.innerHTML = 'Download File'
    downloadLink.href = textToSaveAsURL
    downloadLink.onclick = event => document.body.removeChild(event.target)
    downloadLink.style.display = 'none'
    document.body.appendChild(downloadLink)
    downloadLink.click()
  }

  

  /* vectors, trig and circles */
  /**
    * Gets the angle of a line based on its endpoints.
   * @note used by radiansFromThreePoints()
   */
  function radiansFromTwoPoints (pointA, pointB) {
    return Math.atan2(pointB[1] - pointA[1], pointB[0] - pointA[0])
  }

  /**
    * Gets radians from a decimal value between 0 and 1 where 0 represents the beginning of the arc and 1 represents a full circle from that point.
    */
  function radiansFromDecimal (decimal) {
    decimal = decimal % 1
    return decimal * 2 * Math.PI
  }
  unitTests.add('radiansFromDecimal()',
    [radiansFromDecimal(0), 0],
    [radiansFromDecimal(1), 0],
    [radiansFromDecimal(-1), 0],
    [Math.floor(radiansFromDecimal(0.25) * 100), 157]
  )

  /**
   * Get the coordinates on a circle centered at 0, 0 with a radius of 1 (a unit circle) from a decimal value 0-1 where 0 and 1 are both in the positive Y direction at X = 0.
   * @param {number} places - the number of digits after the decimal point to return in the result
   * recent edit: changed default value for places from 2 to 9 on Sep 8 2021
   */
  function unitCircleCoordsFromDecimal (decimal, places) {
    let x = Math.sin(radiansFromDecimal(decimal))
    let y = Math.cos(radiansFromDecimal(decimal))
    if (places) {
      x = roundToPlaces(places, x)
      y = roundToPlaces(places, y)
    }
    return [x, y]
  }
  unitTests.add('unitCircleCoordsFromDecimal()',
    [unitCircleCoordsFromDecimal(0, 100), [0, 1]],
    [unitCircleCoordsFromDecimal(0.25, 5), [1, 0]],
    [unitCircleCoordsFromDecimal(0.75, 1), [-1, 0]],
    [unitCircleCoordsFromDecimal(0.7, 3), [-0.951, -0.309]]
  )

  /**
   * alias - alacrity.circPoint()
   * @param {number} decimal - a number between 0 and 1 where 0 is the point at 0,1 on a unit circle and 1 represents a full circle back to that point (starts from bottom and runs counter-clockwise in SVG)
   */
  function getPointOnCircle (center, radius, decimal) {
    const unitCoords = unitCircleCoordsFromDecimal(decimal, 15)
    const x = unitCoords[0] * radius + center[0]
    const y = unitCoords[1] * radius + center[1]
    return [x, y]
    // #later use pairwise instead?
  }
  unitTests.add('getPointOnCircle()',
    [getPointOnCircle([0, 0], 2, 0), [0, 2]],
    [getPointOnCircle([-10, 0], 2, 0), [-10, 2]],
    [getPointOnCircle([-10, 0], 2, 0.5), [-10, -2]],
    [getPointOnCircle([-10, 0], 2, 0.25), [-8, 0]]
  )

  /**
   * alias - alacrity.clockPoint()
   * @param {number} decimal - a number between 0 and 1 where 0 is the point at 0,-1 on a unit circle and 1 represents a full circle back to that point (starts from top and runs clockwise in SVG)
   */
  function getClockPointOnCircle (center, radius, decimal) {
    const circPoint = getPointOnCircle(center, radius, decimal)
    return [circPoint[0], circPoint[1] * -1]
  }
  unitTests.add('getClockPointOnCircle() aka alacrity.clockPoint()',
    [getClockPointOnCircle([0, 0], 2, 0), [0, -2]],
    [getClockPointOnCircle([-10, 0], 2, 0), [-10, -2]],
    [getClockPointOnCircle([-10, 0], 2, 0.5), [-10, 2]],
    [getClockPointOnCircle([-10, 0], 2, 0.25), [-8, 0]]
  )

  /** Rotate a point around another point by an angle 0-1 where 1 is a full circle */
  function swingPoint (center, coord, decimalAngle) {
    let radians = decimalAngle * Math.PI * 2
    let x1 = coord[0] - center[0]
    let y1 = coord[1] - center[1]
    let x2 = x1 * Math.cos(radians) - y1 * Math.sin(radians)
    let y2 = x1 * Math.sin(radians) + y1 * Math.cos(radians)
    return [x2 + center[0], y2 + center[1]]
  }

  /** Adds vectors only, not bare numbers. */
  function add (...vectors) {
    typeCheck('array of number', ...vectors)
    return pairwise((a, b) => a + b, vectors)
    /* alternatively, for only two inputs:
     * (a, b) => a.map((v, i) => v+b[i])
     */
  }
  unitTests.add('alacrity.add()',
    [add([1, 2, 4], [4, 1, -10]), [5, 3, -6]]
  )

  /** Subtracts vectors only, not bare numbers. */
  function diff (...vectors) {
    typeCheck('array of number', ...vectors)
    return pairwise((a, b) => a - b, vectors)
    /* alternatively, for only two inputs:
     * (a, b) => a.map((v, i) => v-b[i])
     */
  }
  unitTests.add('alacrity.diff()',
    [diff([10, 2, 40], [4, 1, -10]), [6, 1, 50]]
  )

  /** Converts radians to degrees. */
  function degreesFromRadians (radians) {
    return radians * 180 / Math.PI
  }

  /**
   * Gets angle in radians from a set of three points; the second point must be the center point.
   * @later check that this is working in context
   */
  function radiansFromThreePoints (firstPoint, centerPoint, thirdPoint) {
    return radiansFromTwoPoints(centerPoint, thirdPoint) -
           radiansFromTwoPoints(centerPoint, firstPoint)
  }

  /* DATES & TIME */
  function delay(seconds) {
    // via https://javascript.info/task/delay-promise
    /* usage example: delay(3000).then(() => alert('runs after 3 seconds')) */
    return new Promise((resolve) => setTimeout(resolve, seconds / 1000));
  }

  // #todo add stopwatch() here

  /**
    * Returns week of the month from index 0
    * #later rewrite this as not a Date method and check that it works */
  /*
  Date.prototype.getWeekOfMonth = function () {
    const dayOfMonth = this.getDay()
    const month = this.getMonth()
    const year = this.getFullYear()
    const checkDate = new Date(year, month, this.getDate())
    const checkDateTime = checkDate.getTime()
    let currentWeek = 0
    for (let i = 1; i < 32; i++) {
      const loopDate = new Date(year, month, i)

      if (loopDate.getDay() == dayOfMonth) {
        currentWeek++
      }

      if (loopDate.getTime() == checkDateTime) {
        return currentWeek
      }
    }
  }
  */

  /* SOUND */
  /**
   * Note that the harmonic frequencies are just multiples, so to find a note that sounds good with another just multiply it by 2, 3, 4...N
   * This is an easier and more accurate way of building a palette of truly harmonic notes than using western style notes as given by this formula
  * @param {string} noteString - a string consisting of a capital letter A-G plus an optional #, b or ♭ to indicate a flat or sharp and a number for the octave
  * @param {integer|float} [a4=440] - a frequency in Hertz between 400 and 500 to use as A4
  * Possible Values:
  *    Concert:     440 Hz
  *    Baroque:     415 Hz
  *    Classical:   427–430 Hz
  *    Chorton:     466 Hz
  *    European:    444 Hz
  *    Alternative: 432 Hz
  * @returns {float} frequency in Hertz
  */
  function getFreqFromNote (noteString, a4 = 440) {
    const arr = noteString.split('')
    const notes = { C: 9, D: 7, E: 5, F: 4, G: 2, A: 0, B: -2 }
    let nn = notes[arr.shift().toUpperCase()]
    if (arr[0] === 'b' || arr[0] === '♭') { nn += 1; arr.shift() }
    if (arr[0] === '#') { nn -= 1; arr.shift() }
    const num = parseInt(arr.join(''))
    nn = ((num - 4) * 12) - nn
    a4 = +a4
    if (a4 < 400 || a4 > 500) {
      log('getFreqFromNote received suspicious frequency for a4: ', a4)
    }
    return a4 * Math.pow(2, nn / 12)
    /* alternative: a4 * Math.pow(1.059463094359, nn); */
  }
  unitTests.add('getFreqFromNote()',
    [Math.floor(getFreqFromNote('B#3')), 261]
  )

  /* MISC */
  /**
   * @returns {number} the edit distance, minimum number of single-character edits (insertions, deletions or substitutions) required to change string a into string b
   * {@link https://gist.github.com/andrei-m/982927 source}
   * {@link https://en.wikipedia.org/wiki/Levenshtein_automaton more info}
   * {@link https://julesjacobs.com/2015/06/17/disqus-levenshtein-simple-and-fast.html implementation of this (in Python)}
   */
  function levenshteinDistance (a, b) {
    /*
    Copyright (c) 2011 Andrei Mackenzie
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    */
    if (a.length === 0) return b.length
    if (b.length === 0) return a.length

    const matrix = []

    /* Increment along the first column of each row */
    let i
    for (i = 0; i <= b.length; i++) {
      matrix[i] = [i]
    }

    /* Increment each column in the first row. */
    let j
    for (j = 0; j <= a.length; j++) {
      matrix[0][j] = j
    }

    /* Fill in the rest of the matrix. */
    for (i = 1; i <= b.length; i++) {
      for (j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, /* substitution */
            Math.min(matrix[i][j - 1] + 1, /* insertion */
              matrix[i - 1][j] + 1)) /* deletion */
        }
      }
    }
    return matrix[b.length][a.length]
  }
  unitTests.add('levenshteinDistance()',
    [levenshteinDistance('alacadabra', 'aardvark'), 6],
    [levenshteinDistance('Toby', 'toby'), 1],
    [levenshteinDistance('toby', 'toby'), 0]
  )

  // todo add a sneaky function that if applied to alacrity itself will give the nested property names in a neat list (so for the object and every object in the object, tabbed to show heirarchy)

  /* Reveal functions and set aliases visible to outside scopes. */
  // organized by theme instead of how they're organized in the document at large
  return {
    /* UNIT TESTING */
    unitTests: unitTests,
    check: unitTests.test,
    runUnitTests: unitTests.do,

    /* GENERAL */
    hello: sayHello,
    tidy: prettyPrint,
    prettyPrint: prettyPrint,
    log: log,
    typeCheck: typeCheck,
    copy: copy,
    smoosh: smooshObjects,
    smooshObjects: smooshObjects,
    storeKeys: storeKeys,
    unpackObj: unpackObj,
    unpack: unpackObj,
    dictReplace: dictReplace,

    /* MATH */
    roundTo: roundToPlaces,
    round: roundToPlaces,
    fix: fix,
    rangeMap: rangeMap,
    randBetween: randBetween,
    lerp: lerp,
    offsetTowards: offsetTowards,
    findOffset: findOffset, // diff but with flexible inputs
    swingPoint: swingPoint,
    length: lengthFromPoints, // can do arrays or numbers flexibly
    dist: distanceBetweenTwoPoints, // can do arrays or numbers flexibly

    /* ARRAYS  */
    range: range,
    editValueAt: editValueAt,
    spliceInto: spliceInto,
    remove: removeFromArray,
    removeFromArray: removeFromArray,
    removeMatch: removeFromArray,
    shuffle: shuffle,
    getRandFrom: getRandomArrayElement,
    getEachPair: getEachPair,
    zip: zip,
    pairwise: pairwise,

    /* VECTORS */
    vector: {
      add: add,
      sum: add,
      mag: findVectorMagnitude,
      magnitude: findVectorMagnitude,
      diff: diff,
      normalize: normalizeVector,
    },
    normalize: normalizeVector,
    findMagnitude: findVectorMagnitude,
    add: add,
    diff: diff,
    
    
    /* MATRICES */
    transpose: transpose,
    rotate: rotate,

    /* ANGLES & ROTATION */
    degreesFromRadians: degreesFromRadians,
    radiansFromTwoPoints: radiansFromTwoPoints,
    radiansFromThreePoints: radiansFromThreePoints,
    circPoint: getPointOnCircle,
    clockPoint: getClockPointOnCircle,

    /* SEARCH */
    lev: levenshteinDistance,
    sensibleSort: sensibleSort,
    sortMap: sortMap,

    /* TIME AND DATE */
    delay: delay,

    /* SOUND */
    hzFromNote: getFreqFromNote,

    /* HTML */
    reflow: reflow,
    addStyle: addStyle,
    print: printMe,
    newId: newId,
    make: makeElement,
    create: create,
    setAttributes: setAttributes,

    /* MISC */
    saveFile: saveTextAsFile,
  }
}())
