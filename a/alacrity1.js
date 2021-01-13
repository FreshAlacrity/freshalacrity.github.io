/* last updated Dec 29, 2020 */
/* jshint esversion: 6 */
/* jshint undef: true, unused: true */
/* globals document, window, console, alert, sessionStorage, localStorage */
/* globals Blob */
/* see https://jshint.com/docs/ */


/* Common shortcuts: */
function $(x) { return document.getElementById(x); }


const alacrity = function(){

/* TESTING */
  /* Setup for runUnitTests() */
  let unitTests = [];

  /**
  * Quick, simple unit testing function.
  * @version 1.2, as of Dec 12, 2020
  * @param {*} actualResult - The actual output, to be tested for equality.
  * @param {*} expectedResult - The expected output to be tested against.
  * @param {string} [testName] - The name of the test (providing a name returns a readout instead of a boolean value).
  * @param {boolean} [suppressLog=false] - Truthy values suppress logging for false tests.
  * @returns {boolean|string} - If given a testName returns a detailed test result readout, else returns a boolean value representing whether the test passed.
  */
  function test(testName, actualResult, expectedResult, suppressLog) {
    /* convert to strings so object comparisons work well */
    actualResult = JSON.stringify(actualResult);
    expectedResult = JSON.stringify(expectedResult);

    let result = (actualResult === expectedResult);

    let readout = `${result} ${testName}` +
    `\n\nActual result: ${actualResult}` +
    `\n\nExpected result: ${expectedResult}\n`;

    if (!suppressLog){
      /* Any time a test fails, log it unless logs are supressed. */
      log(readout);
    }
    if (result){
      return result;
    } else {
      return readout;
    }
  }
  unitTests.push(["test()",
    [test("True Test", 1, 1, 1), true],
    [test("False Test", 1, 0, 1), "false False Test\n\nActual result: 1\n\nExpected result: 0\n"]
  ]);

  /** Run a sequence of tests from an array through test() */
  function tests(name, ...testArrays){
    let runTest = (a, i) => {
      return `${name} Test ${i + 1}: ` + test("", a[0], a[1], 1);
    };
    let results = testArrays.map(runTest).join('\n');
    return results;
  }

  /** Run all the tests in the unitTests array. */
  function runUnitTests(){
    let testResults = unitTests.map(a => tests(...a));
    log("Unit Test Results:\n-------------------------\n" + testResults.join('\n'));
 }

  /* Setup for testFunction() */
  const testDict = {
    string: (a => typeof a === 'string'),
    number: (a => typeof a === 'number'),
    object: (a => typeof a === 'object'),
    function: (a => typeof a === 'function'),
    dict: (a => { return (typeof a === 'object' && !Array.isArray(a)); }),
    array:  (a => Array.isArray(a)),
    any: (() => true)
  };

  /** Fetches functions for checkType() to use. */
  function testFunction(key){
    if (typeof testDict[key] === 'function'){
      return testDict[key];
    } else {
      log("No test found for type: " + key);
      return () => false;
    }
  }

  /** Handles individual value type checking for typeCheck() */
  function checkType(types, value){
    let typeArray = copy(types);
    /* @later have this allow multiple nested layers */
    let key = typeArray.shift();
    if (!testFunction(key)(value)) {
      /* One or more of the first round failed. */
      return false;
    } else {
      let next = typeArray.shift();
      if (!next){
        /* The previous checks succeeded and there is no next check. */
        return true;
      } else {
        if (next === 'with'){
          if (JSON.stringify(value) === "{}"){
            return false;
          } else if (typeArray[0] === 'any' ||
                     value.hasOwnProperty(typeArray[0])){
            return true;
          } else {
            return false;
          }
        } else if (value.length === 0){
          /* We're checking for content type, but there are no contents. */
          return false;
        } else {
          return value.every(a => testFunction(typeArray[0])(a));
        }
      }
    }
  }

  /**
   * @param {string} typesString - a string of types seperated by spaces that may or may not contain the keywords test, of, with, any
   * @param {...values} - a list of one or more values to check against the typesString with testFunction(), ex 'array of number'
   * @todo implement x[digits] keyword
   * @later extend to three layers deep? ex. 'array of dict with name'
   * @note Keywords:
   * test as first word: suppresses logging/error throws
   * of: checks the contents of an array
   * with: checks for specific dictionary keys
   *       (except 'any' which checks for the presence of any keys at all)
   * any: matches any type or key
   * x[digits]: matches only that number of things
   */
  function typeCheck(typesString, ...toCheck){
    let typeArray = typesString.split(' ');
    let makeLog = true;
    if (typeArray[0] === 'test'){ makeLog = false; typeArray.shift(); }
    let results = toCheck.map(a => checkType(typeArray, a));
    if (results.every(Boolean)){
      return true;
    } else {
      if (makeLog){
        throw new Error(`typeCheck failed for type: '${typesString}' on value:`, toCheck);
      }
      return false;
    }
  }
  unitTests.push(["typeCheck()",
    [typeCheck('number', 1), true],
    [typeCheck('test number', "foo"), false],
    [typeCheck('string', ""), true],
    [typeCheck('array of number', [1, -2, 3]), true],
    [typeCheck('array of number', [1, 2, 4], [4, -10, 3]), true],
    [typeCheck('test array of number', [1, 2, "taco"]), false],
    [typeCheck('array of number x2', [1, 2]), true],
    //[typeCheck('array of number x2', [1, 2, 3]), false],
    [typeCheck('dict with any', {foo:1}), true],
    [typeCheck('dict with name', {name:"Maple"}), true],
    [typeCheck('test dict with name', {tree:"Maple"}), false],
    [typeCheck('test object with any', {}), false],
    [typeCheck('array of any', [1]), true],
    [typeCheck('test array of any', []), false]
  ]);

/* GENERAL */
/* modifications */
  /** @note Strips out properties whose values are functions or undefined and converts NaN and Infinity to null.
   */
  function copy(inputObj) {
    return JSON.parse(JSON.stringify(inputObj));
  }
  unitTests.push(["copy()",
    [copy({foo:2,beep:"A",bop:1000,bip:undefined}),{"foo":2,"beep":"A","bop":1000}],
  ]);

  /** A 'safe' wrapper for Object.assign() that won't mutate the target object.
    * @param {object} targetObject
    * @param {...object} overrideObjects - any number of objects to smoosh into the targetObject
    */
  function smooshObjects(targetObject, ...overrideObjects) {
    typeCheck('object with any', targetObject, ...overrideObjects);
    return Object.assign(copy(targetObject), ...overrideObjects);
    /* old version:
    let tempJSON = JSON.stringify(mainObject);
    let newObject = JSON.parse(tempJSON);
    for (let key of Object.keys(overrideObject)) {
      newObject[key] = overrideObject[key];
    }
    return newObject;
    */
  }
  unitTests.push(["smooshObjects()",
    [smooshObjects({foo:1,bar:"Q"},{foo:2,beep:"A",bop:1000}),{"foo":2,"bar":"Q","beep":"A","bop":1000}],
  ]);

  /**
   * Adds a value into the input string or array at a given index, replacing the original contents to do so proportionately to the length of the new value. Will return a string or array that is shorter than the original if given an empty string as input.
    */
  function editValueAt(stringOrArray, index, value = "") {
    if (index >= stringOrArray.length) {
      log(`The position given to editValueAt(), ${index}, is past the end of ${prettyPrint(stringOrArray)}`);
    }
    if (value === ""){
      return stringOrArray.slice(0, index).concat(stringOrArray.slice(index + 1));
    } else {
      let length = value.length;
      if (typeof stringOrArray === 'object' && typeof value === 'string'){
        length = 1;
      }
      return stringOrArray.slice(0, index).concat(value).concat(stringOrArray.slice(index + length));
    }
  }
  unitTests.push(["editValueAt()",
    [editValueAt("beep bop", 0, "boop "),"boop bop"],
    [editValueAt([1,3,4,5], 1, [2,3]),[1,2,3,5]],
    [editValueAt([1,3,4,5], 2, "foo"),[1,3,"foo",5]],
    [editValueAt([1,3,4,5], 1),[1,4,5]]
  ]);

  /** Adds the value into the input string or array at a given index, displacing the original contents. */
  function spliceInto(stringOrArray, index, value) {
    return stringOrArray.slice(0, index).concat(value).concat(stringOrArray.slice(index));
  }
  unitTests.push(["spliceInto()",
    [spliceInto("ac", 1, "b"),"abc"],
    [spliceInto([1,4,5], 1, [2, 3]),[1,2,3,4,5]]
  ]);

  /** Returns an element of the input array at random. */
  function getRandomArrayElement(arr) {
    return arr[Math.floor(arr.length * Math.random())];
  }
  unitTests.push(["getRandomArrayElement()",
    [getRandomArrayElement([1]), 1],
    [getRandomArrayElement([0, 1, 2, 3]) in [5, 6, 7, 8], true]
  ]);

  /** Uses the Fisher-Yates shuffle to shuffle an array (walk the array in the reverse order and swap each element with a random one before it)
   * {@link https://javascript.info/task/shuffle source}
   */
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      /* swap elements array[i] and array[j]
         could also be written as:
         let t = array[i]; array[i] = array[j]; array[j] = t
      */
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * Transposes a multidimensional array; using twice will return to original array.
   * {@link https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript source}
   */
  function transpose(m){
    return m[0].map((x, i) => m.map(x => x[i]));
  }

  /** Applies a given function to reduce all the arrays within a multidimensional array. */
  function mapReduce(reduceWith, mArr) {
    typeCheck('array of array', mArr);
    return mArr.map(a => a.reduce(reduceWith));
  }

  function getEachPair(array){
    typeCheck('array', array);
    let copy1 = copy(array);
    let copy2 = copy(array);
    copy1.pop();
    copy2.shift();
    return transpose([copy1,copy2]);
  }
  unitTests.push(["getEachPair()",
    [getEachPair([1,2,4,5,7]),[[1,2],[2,4],[4,5],[5,7]]],
    [getEachPair([[-5,1,0],[0,1,0],[0,1,10]]),[[[-5,1,0],[0,1,0]],[[0,1,0],[0,1,10]]]]
  ]);

  /** @todo add tests, start replacing places where I do transpose and mapreduce anyway */
  function pairwise(func, vectors) {
    typeCheck('function', func);
    typeCheck('array', vectors);
    return mapReduce(func, transpose(vectors));
  }
  unitTests.push(["pairwise",
    [pairwise(((a, b) => a + b), [[0,2], [2,6]]), [2,8]]
  ]);

  /** Sorts mixed arrays of letters and numbers and capitalized/uncapitalized strings neatly; by default it sorts letters before numbers and capital letters before the same letter in lowercase. */
  function sensibleSort(a, b, numsFirst) {
    let x = a;
    let y = b;
    if (typeof x == 'string'){
      if (typeof y != 'string'){
        if (numsFirst){ return 1; } else { return -1; }
      }
      x = x.toLowerCase();
    }
    if (typeof y == 'string'){
      if (typeof x != 'string'){
        if (numsFirst){ return -1; } else { return 1; }
      }
      y = y.toLowerCase();

      // put capital letters first:
      if (typeof x == 'string' && x.charAt(0) == y.charAt(0) && a.charAt(0) != b.charAt(0)){
        if (x != a){ return -1; }
        if (y != b){ return 1; }
      }
    }
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  }
  unitTests.push(["sensibleSort()",
    [["C","b",20,"c","a","A","B",500,1,2,3].sort(sensibleSort),
    ["A","a","B","b","C","c",1,2,3,20,500]]
  ]);

  /**
   * Sorts an array of objects by the contents of a particular key in those objects using sensibleSort().
   * @todo figure out why I had a third parameter for this before/where it came from
   */
  function sortByKey(key, objectToSort) {
     if (!Array.isArray(objectToSort)){
       objectToSort = dictToArray(objectToSort);
     }
     return objectToSort.sort((a, b) => {
       return sensibleSort(a[key],b[key]);
     });
  }
  unitTests.push(["sortByKey()",
    [sortByKey("bar",
    [{foo: 3, bar: "c"}, {foo: 1, bar: "a"}, {foo: 2, bar: "B"}]),
    [{foo: 1, bar: "a"}, {foo: 2, bar: "B"}, {foo: 3, bar: "c"}]],
    [sortByKey("foo",
    [{foo: 2, bar: "c"}, {foo: 1, bar: "a"}, {foo: 3, bar: "B"}]),
    [{foo: 1, bar: "a"}, {foo: 2, bar: "c"}, {foo: 3, bar: "B"}]],
    [sortByKey("foo",
    {q:{foo: 2, bar: "c"}, r:{foo: 1, bar: "a"}, s:{foo: 3, bar: "B"}}),
    [{foo: 1, bar: "a"}, {foo: 2, bar: "c"}, {foo: 3, bar: "B"}]]
  ]);

  /**
   * Sorts a map object and returns a sorted version.
   * Currently unused/here in case it's handy.
   * {@link https://stackoverflow.com/questions/31158902/is-it-possible-to-sort-a-es6-map-object source}
   */
  function sortMap(mapObj) {
    return new Map([...mapObj.entries()].sort(sensibleSort));
  }

  function dictToArray(dictObj){
    return Object.keys(dictObj).map(a => dictObj[a]);
  }
  unitTests.push(["dictToArray()",
    [dictToArray({a:"foo", b:"bar"}),["foo","bar"]]
  ]);

/* HTML */
  function $html(idString, htmlString) {
   typeCheck('string', idString, htmlString);
   if (htmlString != undefined){
     $(idString).innerHTML = htmlString;
   }
   return $(idString).innerHTML;
  }
  function addHtml(idString, htmlString) {
    let element = $(idString);
    element.innerHTML = element.innerHTML + htmlString;
  }

  /** given an object with _element name and various properties, assemble and return HTML string */
  function makeElement(elementTemplateObject) {
    let elementType = elementTemplateObject._element;
    if (!elementType){
      log("error! invalid object passed to makeElement():\n" + prettyPrint(elementTemplateObject));
      return;
    }
    let htmlString = "<" + elementType;
    let contents = "";
    let allKeys = Object.keys(elementTemplateObject);
    for (let aspect = 0; aspect < allKeys.length; aspect++){
      let name = allKeys[aspect];
      if (name.charAt(0) == "_"){
        if (name == "_contents"){
          contents += elementTemplateObject[name];
        }
      } else {
        htmlString += " " + name + "=\"";
        htmlString += elementTemplateObject[name];
        htmlString += "\"";
      }
    }
    if (contents != ""){
      htmlString += ">" + contents;
      htmlString += "</" + elementType + ">";
    } else {
      htmlString += "/>";
    }
    return htmlString;
  }

  /**
   * @source {@link https://gist.github.com/mathiasbynens/428626 | source}
   */
  function changeFavicon(src) {
   let head = document.head = document.head || document.getElementsByTagName('head')[0];
   var link = document.createElement('link'),
       oldLink = document.getElementById('dynamic-favicon');
     link.id = 'dynamic-favicon';
     link.rel = 'shortcut icon';
     link.href = src;
     if (oldLink) {
      head.removeChild(oldLink);
     }
     head.appendChild(link);
  }

  /** Returns a neatly formatted string given any input. */
  function prettyPrint(x) {
    if (typeof x === 'string'){
      return x;
    } else {
      if (x === undefined){ return "undefined"; }
      if (typeof x === 'number' && isNaN(x)){ x = "NaN"; }
      let longString = JSON.stringify(x, null, 2);
      if (longString.replace(/\s/g,"").length < 120){
        /* So short arrays etc can fit on one line; may butcher short objects containing strings with spaces. Account for that @later */
        longString = JSON.stringify(x);
      }
      return longString;
    }
  }

  /**
   * Logs things in the standard format for this library so it's clear where the error came from.
   * @param {...*} - any number of inputs to be logged as a single entry
   * @returns {*} the first parameter, to be used for inline debugging
   */
  function log(input) {
    let logString = [...arguments].map(prettyPrint).join(' ');
    console.log(`~alacrity.log~\n\n${logString}\n\n`);
    return input;
  }

  /**
  * Creates an element of a given type in the page body.
  * @todo make this work better with/alongside makeElement()?
  */
  function quickAddElement(type, innerHtml = "", newId = "") {
    typeCheck('string', type, innerHtml, newId);
    let newElement = document.createElement(type);
    document.body.appendChild(newElement);
    newElement.innerHTML = innerHtml;
    if (newId){ newElement.id = newId; }
  }

  /** Creates a new paragraph element in the page body containing the specified text in a preformatted block.
   * @param {...*} - any number of inputs to print neatly inside the preformatted block
   * @returns {*} the first input so it can be easily used for debugging.
   */
  function printMe(input) {
     let logString = [...arguments].map(prettyPrint).join(' ');
     quickAddElement("p", `<pre>${logString}</pre>`);
     return input;
  }

  function dictReplace(string, dictionary){
    let regex = RegExp(Object.keys(dictionary).join("|"),"gi");
    return string.replace(regex, k => dictionary[k]);
  }

/* layout */
  function onWindowResize(functionName) {
  if (window.attachEvent) {
      window.attachEvent('onresize', function() {
        functionName();
      });
  } else if (window.addEventListener) {
      window.addEventListener('resize', function() {
          functionName();
      }, true);
  } else {
      return false;
  }
}
  function stopOnWindowResize(functionName) {
    if(window.detachEvent) {
      window.detachEvent('onresize', functionName);
    }
    else if(window.removeEventListener) {
        window.removeEventListener('resize', functionName);
    }
    else {
        return false;
    }
  }
  function getPageWidth() {
    let width  = window.innerWidth ||
       document.documentElement.clientWidth ||
       document.body.clientWidth;
    return width;
  }
  function getPageHeight(){
    let height = window.innerHeight ||
       document.documentElement.clientHeight ||
       document.body.clientHeight;
    return height;
  }
  function getBodyWidth(){
    let body = document.body;
    let html = document.documentElement;
    return Math.max(
       body.scrollWidth,
       body.offsetWidth,
       html.clientWidth,
       html.scrollWidth,
       html.offsetWidth
    );
  }
  function getBodyHeight(){
    let body = document.body;
    let html = document.documentElement;
    return Math.max(
       body.scrollHeight,
       body.offsetHeight,
       html.clientHeight,
       html.scrollHeight,
       html.offsetHeight
    );
  }
  /*
  function makeFullscreenById(elementId,margin){
    if(margin == undefined){margin = 0;}
    let element = document.getElementById(elementId);
    let offset = parseInt(window.getComputedStyle(element, null).getPropertyValue("border-width"));
    if(isNaN(offset)){offset = 0;}
    element.style.position = "absolute";
    element.style.top = margin+"px";
    element.style.left = margin+"px";
    element.style.width = (getPageWidth()-(margin+offset)*2)+"px";
    element.style.height = (getPageHeight()-(margin+offset)*2)+"px";
  } //currently not working, may not be needed anyway?
  */

/* STORAGE */
  /** Tests if local storage is available and working.
   * @returns {boolean} true if localStorage is available, false if not
   */
  function hasLocal() {
    try {
       if (typeof localStorage !== 'undefined') {
          localStorage.setItem('feature_test', 'yes');
          if (localStorage.getItem('feature_test') === 'yes') {
             localStorage.removeItem('feature_test');
             // localStorage is enabled'
             return true;
          }
       }
    } catch(error) {
       log(error);
    }
    return false;
  }
  /** Saves a value directly to localStorage from an input element.
   * Local storage persists after the browser is closed.
   * @todo list elements for which this works well
   * @todo add documentation for othet storage functions, below
   */
  function saveLocalValueFromInput(key, inputId, alertBool) {
   localStorage.setItem(key, $(inputId).value);
   if (alertBool == true){
     alert(`Input from '${inputId}' saved locally with key '${key}'`);
   }
  }
  function loadLocalString(key, IdForDisplay, alertBool) {
   let outputString = localStorage.getItem(key);
   if (IdForDisplay != undefined){
     $html(IdForDisplay, outputString);
   }
   if (alertBool == true){
     alert("String loaded: '"+outputString+"' from key: '"+key+"' - updating id '"+IdForDisplay+"'");
   }
  }
  function saveSessionValueFromInput(key, inputId, alertBool) {
   // session storage is deleted when the browser is closed
   sessionStorage.setItem(key, $(inputId).value);
   if (alertBool == true){
     alert(`Input from '${inputId}' saved for session with key '${key}'`);
   }
  }
  function loadSessionString(key, displayId, alertBool) {
   let outputString = sessionStorage.getItem(key);
   if (displayId != undefined){
     $html(displayId, outputString);
   }
   if (alertBool == true){
   alert(`String loaded: '${outputString}' from key: '${key}' - updating id '${displayId}`);
   }
  }

/* files */
  /**
   * Generates and exports a text file. File is automatically downloaded; in older browsers users may need to click the "Download File" link, otherwise it happens automatically when the function is called.
   * @param {string} textToSave - the text so save as the file contents
   * @param {string} [fileName] - the name of the file; if no extension is included, .txt will be used
   */
  function saveTextAsFile(textToSave, fileName = "exported.txt") {
    let textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
    let textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    let downloadLink = document.createElement("a");
    downloadLink.download = fileName;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = event => document.body.removeChild(event.target);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

/* MATH */
  /**
   * Wraps numbers around a range, end bound inclusive.
   * @param {number} input - the number to wrap into the specified range
   * @param {number} boundA - one end of the range
   * @param {number} [boundB=0] - the other end of the range
   */
  function fix(input, boundA, boundB = 0) {
    boundA = parseFloat(boundA);
    boundB = parseFloat(boundB);
    let maxN   = Math.max(boundA, boundB);
    let minN   = Math.min(boundA, boundB);
    let result = parseFloat(input);

    if (isNaN(result) || isNaN(maxN) || isNaN(minN)){
      log(`Invalid input to fix(): ${prettyPrint(arguments)} - arguments need to be numbers or strings that can be converted to numbers; the third parameter is optional, default 0.`);
      return;
    }

    if (minN == maxN){ return minN; }
    let step = maxN - minN;
    while (result < minN){ result += step; }
    while (result > maxN){ result -= step; }
    return result;
  }
  unitTests.push(["fix()",
    [fix("20", 0, 10), 10],
    [fix(12.4, -20, 10), -17.6],
    [fix(5, 40, 10), 35],
    [fix(11005, 40), 5]
  ]);

  /**
   * @param {number} boundA - one bound of the result
   * @param {number} [boundB = 0] - the other bound of the result
   * @returns {integer} an integer between boundA and boundB, inclusive of boundA and boundB if they are integers. No serious effort is made to ensure ideal distribution.
   */
  function randBetween(boundA, boundB = 0){
    boundA = +boundA;
    boundB = +boundB;
    if (isNaN(boundA) || isNaN(boundB)){
      log(`Invalid inputs given to randBetween() - ${prettyPrint(arguments)} - arguments need to be numbers (or strings that can be converted to numbers); the second parameter is optional, default 0.`);
      return;
    }
    let lower = Math.ceil(Math.min(boundA, boundB));
    let upper = Math.floor(Math.max(boundA, boundB));
    return Math.floor(lower + (upper - lower + 1) * Math.random());
  }
  unitTests.push(["randBetween()",
    [randBetween("20", 0) >= 0, true],
    [randBetween(0, -20) <= 0, true],
    [randBetween(5, 5), 5],
    [randBetween(11005) <= 11005, true]
  ]);

  /** Performs linear interpolation between two known points, returning a number between v1 and v2 t% the way across and which returns v1 when t = 1. If t is not specified, returns the halfway point. */
  function lerp(v1, v2, t = 0.5) {
    /* Arrow function used here to keep in scope for t: */
    let lr = a => ((1 - t) * a[0] + t * a[1]);
    if (typeof v1 == 'number'){
      return lr([v1, v2]);
    } else {
      return transpose([v1, v2]).map(lr);
    }
  }
  unitTests.push(["lerp()",
    [lerp(0, 10), 5],
    [lerp(10, 20, 0.1), 11],
    [lerp([0, 4, 2], [20, 0, -10], 0.5), [10, 2, -4]]
  ]);

  /**
  * Offsets one point towards another by a specifc distance; see also lerp() to offset one point towards another by proportion of the distance.
  * @todo refactor this to find the unit vector and then multiply?
  */
  function offsetTowards(firstCoordArr, secondCoordArr, offsetDistance = 1) {
    let totalDist = distanceBetweenTwoPoints(firstCoordArr, secondCoordArr);
    let relDist = offsetDistance / totalDist;
    return lerp(firstCoordArr, secondCoordArr, relDist);
  }

  /** Finds the offset in positive or negative distance travelled on each axis between two coordinates in N dimensional space. */
  function findOffset(...args) {
    /* if our array ended up with too many layers, unwrap it */
    if (args.length === 1){ args = args[0]; }
    let subtract = (a, b) => a - b;
    if (typeof args[0] === 'number'){
      return subtract(...args);
    } else {
      /* subtract the values of the second array from the first */
      //findme
      //return mapReduce(subtract, transpose(args));
      return pairwise(((a, b) => a - b), args);
    }
  }
  unitTests.push(["findOffset()",
    [findOffset(0,4), -4],
    [findOffset([0,4]), -4],
    [findOffset([0,1],[0,2]), [0,-1]],
    [findOffset([-5,1,0],[1,0,6]), [-6,1,-6]]
  ]);

/* vectors */
  /** @todo implement */

  /** Normalize/find unit vector from vector array/array of magnitudes by axis.
   * @param {number[]} vectorArray - an array of N numbers
   * @returns {number[]} a vector array/array of N magnitudes that covers a unit distance/distance of 1 unit
   */
  function normalizeVector(vectorArray){
    let magnitude = findVectorMagnitude(vectorArray);
    let newVectorArray = [];
    /* @todo rewrite this for loop */
    for (let thisInput = 0; thisInput < vectorArray.length; thisInput++){
       let thisValue = vectorArray[thisInput];
       newVectorArray.push(thisValue/magnitude);
     }
    return newVectorArray;
  }

  /**
   * Finds the magnitude of a vector by returning the square root of the sum
   * of the squares of each number in the array.
   * @param {number[]} vectorArray - an array of numbers comprising a vector
   */
  function findVectorMagnitude(vectorArray){
    typeCheck('array', vectorArray);
    return Math.hypot(...vectorArray);
    //return Math.sqrt(vectorArray.map(a => a * a).reduce((a, b) => a + b));
  }
  unitTests.push(["Vector Operations",
    [findVectorMagnitude(normalizeVector([1,2,3])),1],
    [findVectorMagnitude([3,4]), 5]
  ]);

  /**
   * Calculates distance in N-dimensional space.
    * @note See also lengthFromPoints() for the length of a path that has 3+ points.
   */
  function distanceBetweenTwoPoints(pointA, pointB){
    let vector = findOffset(pointA, pointB);
    if (typeof vector === 'number'){
      return Math.abs(vector);
    } else {
      return findVectorMagnitude(vector);
    }
  }
  unitTests.push(["distanceBetweenPoints()",
    [distanceBetweenTwoPoints(0, 4), 4],
    [distanceBetweenTwoPoints([0,1],[0,2]), 1],
    [Math.floor(distanceBetweenTwoPoints([-5,1,0],[1,0,6])), 8]
  ]);

  function lengthFromPoints(...args) {
    let list = mapReduce(distanceBetweenTwoPoints, getEachPair(args));
    return list.reduce((a, b) => a + b);
  }
  unitTests.push(["lengthFromPoints()",
    [lengthFromPoints(-5,1), 6],
    [lengthFromPoints([-5,1],[0,1],[0,6]), 10],
    [lengthFromPoints([-5,1,0],[0,1,0],[0,1,10]), 15]
  ]);

  /* @todo import functions from stl/myScript.js here */

/* vectors, trig and circles */
  /**
    * Gets the angle of a line based on its endpoints.
   * @note used by radiansFromThreePoints()
   */
  function radiansFromTwoPoints(pointA, pointB) {
    return Math.atan2(pointB[1] - pointA[1], pointB[0] - pointA[0]);
  }

  /**
    * Gets radians from a decimal value between 0 and 1 where 0 represents the beginning of the arc and 1 represents a full circle from that point.
    */
  function radiansFromDecimal(decimal){
    decimal = decimal % 1;
    return decimal * 2 * Math.PI;
  }
  unitTests.push(["radiansFromDecimal()",
    [radiansFromDecimal(0), 0],
    [radiansFromDecimal(1), 0],
    [radiansFromDecimal(-1), 0],
    [Math.floor(radiansFromDecimal(0.25) * 100), 157]
  ]);

  function roundToPlaces(places, number){
    let precision = Math.pow(10, (+places));
    return Math.round(number * precision) / precision;
  }
  unitTests.push(["roundToPlaces()",
    [roundToPlaces(3, 3.18273481), 3.183]
  ]);

  /**
   * Get the coordinates on a circle centered at 0, 0 with a radius of 1 (a unit circle) from a decimal value 0-1 where 0 and 1 are both in the positive Y direction at X = 0.
   * @param {number} places - the number of digits after the decimal point to return in the result
   */
  function unitCircleCoordsFromDecimal(decimal, places = 2) {
    let x = Math.sin(radiansFromDecimal(decimal));
    let y = Math.cos(radiansFromDecimal(decimal));
    x = roundToPlaces(places, x);
    y = roundToPlaces(places, y);
    return [x, y];
  }
  unitTests.push(["unitCircleCoordsFromDecimal()",
    [unitCircleCoordsFromDecimal(0, 100),[0,1]],
    [unitCircleCoordsFromDecimal(0.25, 5),[1,0]],
    [unitCircleCoordsFromDecimal(0.75, 1),[-1, 0]],
    [unitCircleCoordsFromDecimal(0.7, 3),[-0.951, -0.309]]
  ]);

  /**
   * @param {number} decimal - a number between 0 and 1 where 0 is the point at 0,1 on a unit circle and 1 represents a full circle back to that point
   */
  function getPointOnCircle(center, radius, decimal) {
    let unitCoords = unitCircleCoordsFromDecimal(decimal);
    let finalX = unitCoords[0] * radius + center[0];
    let finalY = unitCoords[1] * radius + center[1];
    return [finalX, finalY];
  }
  unitTests.push(["getPointOnCircle()",
    [getPointOnCircle([0, 0], 10, 0),[0,10]],
    [getPointOnCircle([-10, 0], 10, 0),[-10,10]]
  ]);

  /** @later rewrite so it just makes the d value to use makeElement()? */
  function getSvgPieWedgeElement(centerCoords, radius, startDecimal, endDecimal, longwayFlag = 1, style = "") {
    let startCoords = getPointOnCircle(centerCoords, radius, startDecimal);
    let endCoords   = getPointOnCircle(centerCoords, radius, endDecimal  );

    /* If the arc overlaps the 0 point, switch the flag:
     * @later check that this is actually what is needed/happening
     * see also getSvgArcElement() */
    if ((startDecimal - endDecimal) < 0){ longwayFlag = +!longwayFlag; }

    return `<path d="M ${startCoords} A ${radius} ${radius} 1 ${longwayFlag} 1 ${endCoords} Z" ${style} />`;
  }
  unitTests.push(["getSvgPieWedgeElement()",
    [getSvgPieWedgeElement([100,100],50,0.25,0.5,0,'stroke="red"'),'<path d="M 150,100 A 50 50 1 1 1 100,50 Z" stroke="red" />']
  ]);

  /** Adds vectors only, not bare numbers. */
  function add(...vectors) {
    typeCheck('array of number', ...vectors);
    return pairwise((a, b) => a + b, vectors);
    /* alternatively, for only two inputs:
     * (a, b) => a.map((v, i) => v+b[i])
     */
  }
  unitTests.push(["add()",
    [add([1,2,4],[4,1,-10]),[5,3,-6]],
  ]);

  /** @later rewrite so it just makes the d value to use makeElement()? */
  function getSvgArcElement(center, radius, startDecimal, endDecimal, longwayFlag = 1, style = "") {
    let startCoords = getPointOnCircle(center, radius, startDecimal);
    let endCoords   = getPointOnCircle(center, radius, endDecimal  );

    /* If the arc overlaps the 0 point, switch the flag:
     * @later check that this is actually what is needed/happening
     * see also getSvgPieWedgeElement() */
    if ((startDecimal - endDecimal) < 0){ longwayFlag = +!longwayFlag; }
    //let longwayFlag = Math.round(startDecimal-endDecimal);

    /* svg a [rx] [ry] [1 for circles] [go the long way?] [1 for pies] [end x] [end y] */
    return `<path d="M ${startCoords} A ${radius} ${radius} 1 ${longwayFlag} 1 ${endCoords}" ${style} />`;
  }
  unitTests.push(["getSvgArcElement()",
    [getSvgArcElement([100,200],55,0.25,0.75,0,`fill="none"`),"<path d=\"M 155,200 A 55 55 1 1 1 45,200\" fill=\"none\" />"],
  ]);

  /** Converts radians to degrees. */
  function degreesFromRadians(radians){
    return radians * 180 / Math.PI;
  }

  /**
   * Gets angle in radians from a set of three points; the second point must be the center point.
   * @later check that this is working in context
   */
  function radiansFromThreePoints(firstPoint, centerPoint, thirdPoint) {
    return radiansFromTwoPoints(centerPoint, thirdPoint) -
           radiansFromTwoPoints(centerPoint, firstPoint);
  }

/* dates */
   /**
    * Returns week of the month starting with 0
    * @later rewrite this as not a Date method and check that it works */
   Date.prototype.getWeekOfMonth = function () {
      let dayOfMonth = this.getDay();
      let month = this.getMonth();
      let year = this.getFullYear();
      let checkDate = new Date(year, month, this.getDate());
      let checkDateTime = checkDate.getTime();
      let currentWeek = 0;
      for (var i = 1; i < 32; i++) {
           var loopDate = new Date(year, month, i);

           if (loopDate.getDay() == dayOfMonth) {
               currentWeek++;
           }

           if (loopDate.getTime() == checkDateTime) {
                  return currentWeek;
           }
         }
   };

/* sound */
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
  function getFreqFromNote(noteString, a4 = 440) {
    let arr = noteString.split("");
    let notes = { "C":9, "D":7, "E":5, "F":4, "G":2, "A":0, "B":-2 };
    let nn = notes[arr.shift().toUpperCase()];
    if (arr[0] == "b" || arr[0] == "♭"){ nn += 1; arr.shift(); }
    if (arr[0] == "#"                 ){ nn -= 1; arr.shift(); }
    let num = parseInt(arr.join(""));
    nn = ((num - 4) * 12) - nn;
    a4 = +a4;
    if (a4 < 400 || a4 > 500){
        log("getFreqFromNote received suspicious frequency for a4: ", a4);
    }
    return a4 * Math.pow(2, nn/12);
    /* alternative: a4 * Math.pow(1.059463094359, nn); */
  }
  unitTests.push(["getFreqFromNote()",
    [Math.floor(getFreqFromNote("B#3")), 261]
  ]);

/* MISC */
  /**
   * @returns {number} the edit distance, minimum number of single-character edits (insertions, deletions or substitutions) required to change string a into string b
   * {@link https://gist.github.com/andrei-m/982927 source}
   */
  function levenshteinDistance(a, b){
    /*
    Copyright (c) 2011 Andrei Mackenzie
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    */
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    var matrix = [];

    /* Increment along the first column of each row */
    var i;
    for(i = 0; i <= b.length; i++){
      matrix[i] = [i];
    }

    /* Increment each column in the first row. */
    var j;
    for(j = 0; j <= a.length; j++){
      matrix[0][j] = j;
    }

    /* Fill in the rest of the matrix. */
    for(i = 1; i <= b.length; i++){
      for(j = 1; j <= a.length; j++){
        if(b.charAt(i-1) == a.charAt(j-1)){
          matrix[i][j] = matrix[i-1][j-1];
        } else {
          matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, /* substitution */
                         Math.min(matrix[i][j-1] + 1, /* insertion */
                         matrix[i-1][j] + 1)); /* deletion */
        }
      }
    }
    return matrix[b.length][a.length];
  }
  unitTests.push(["levenshteinDistance()",
    [levenshteinDistance("alacadabra","aardvark"), 6],
    [levenshteinDistance("Toby","toby"), 1],
    [levenshteinDistance("toby","toby"), 0]
  ]);

  /**
   * Checks edit distance but gives up if the distance is higher than the maximum value.
   * {@link https://en.wikipedia.org/wiki/Levenshtein_automaton more info}
   * {@link https://julesjacobs.com/2015/06/17/disqus-levenshtein-simple-and-fast.html implementation of this (in Python)}
   */
  function cappedLevenshtein(a, b, max){
    /*
    Copyright (c) 2011 Andrei Mackenzie
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    */
    if (a.length === 0) return Math.max(b.length, max);
    if (b.length === 0) return Math.max(a.length, max);

    var matrix = [];

    /* Increment along the first column of each row */
    var i;
    for(i = 0; i <= b.length; i++){
      matrix[i] = [i];
    }

    /* Increment each column in the first row. */
    var j;
    for(j = 0; j <= a.length; j++){
      matrix[0][j] = j;
    }

    /* Fill in the rest of the matrix. */
    for(i = 1; i <= b.length; i++){
      for(j = 1; j <= a.length; j++){
        if(b.charAt(i-1) == a.charAt(j-1)){
          matrix[i][j] = matrix[i-1][j-1];
        } else {
          matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, /* substitution */
                         Math.min(matrix[i][j-1] + 1, /* insertion */
                         matrix[i-1][j] + 1)); /* deletion */
        }
      }
      // insert check against max here?
    }
    return matrix[b.length][a.length];
  }
  unitTests.push(["cappedLevenshtein()",
    [cappedLevenshtein("alacadabra","aardvark", 5), 5],
  ]);

  /* Reveal functions and set aliases visible to outside scopes. */
  return {
  /* GENERAL */
    typeCheck: typeCheck,
    l: log, log: log,
    test: test,
    runUnitTests: runUnitTests,
    tidy: prettyPrint,
    dictReplace: dictReplace,
    copy: copy,
    smoosh: smooshObjects,
    editValueAt: editValueAt,
    randBetween: randBetween,
    shuffle: shuffle,
    getRandFrom: getRandomArrayElement,
    sensibleSort: sensibleSort,
    sortMap: sortMap,
  /* HTML */
    $html: $html,
    addHtml: addHtml,
    print: printMe,
    makeElement: makeElement,
    onWindowResize: onWindowResize,
    stopOnWindowResize: stopOnWindowResize,
    getPageWidth: getPageWidth,
    getPageHeight: getPageHeight,
    getBodyWidth: getBodyWidth,
    getBodyHeight: getBodyHeight,
    favicon: changeFavicon,
  /* MATH */
    fix: fix,
    lerp: lerp,
    offsetTowards: offsetTowards,
    length: lengthFromPoints,
    roundTo: roundToPlaces,
  /* vectors */
    pairwise: pairwise,
  /* angles, circles and trig */
    degreesFromRadians: degreesFromRadians,
    radiansFromThreePoints: radiansFromThreePoints,
    circPoint: getPointOnCircle,
    wedge: getSvgPieWedgeElement,
    arc: getSvgArcElement,
  /* misc */
    hzFromNote: getFreqFromNote,
    lev: levenshteinDistance,
    saveFile: saveTextAsFile,
    hasLocal: hasLocal,
    saveLocalValueFromInput: saveLocalValueFromInput,
    loadLocalString: loadLocalString,
    saveSessionValueFromInput: saveSessionValueFromInput,
    loadSessionString: loadSessionString,
  };
 }();

alacrity.l("'alacrity' library loaded!");
