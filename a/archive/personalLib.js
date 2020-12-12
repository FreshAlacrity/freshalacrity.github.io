// backed up from codepen on 11/30/2020

{
  function fillHtml(idString,htmlString) { document.getElementById(idString).innerHTML = htmlString;
  }
  function addHtml(idString,htmlString) {
    let existingHtml = document.getElementById(idString).innerHTML;
    document.getElementById(idString).innerHTML = existingHtml+htmlString;
  }
  function fix(input,maxN) {
    let result = input+0; //make sure it's a number?
    while(result < 0){
      result += maxN;
    }
    while(result > maxN){
      result -= maxN;
    }
    return result;
  } // wraps numbers around a range
  function smooshObjects(mainObject, overrideObject) {
    // overrides the properties of one object with any properties that exist on another
    // not super deep, not super shallow
    let tempJSON = JSON.stringify(mainObject);
    let newObject = JSON.parse(tempJSON);
    for (let key of Object.keys(overrideObject)) {
      newObject[key] = overrideObject[key];
    }
    return newObject;
  }

  function editValueAt(position, stringOrArray, newChar) {
    if (position >= stringOrArray.length) { alert("the position specified is past the end of the string") }
    if (newChar == undefined){
      return stringOrArray.slice(0, position).concat(stringOrArray.slice(position+1, stringOrArray.length));
    } else {
      return stringOrArray.slice(0, position).concat(newChar).concat(stringOrArray.slice(position+1, stringOrArray.length));
    }
  }
} // general
{
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
let width  = window.innerWidth || document.documentElement.clientWidth ||
document.body.clientWidth;
  return width;
}
  function getPageHeight(){
let height = window.innerHeight|| document.documentElement.clientHeight||
document.body.clientHeight;
  //if(height == undefined){alert("Ack!");}
  return height;
}
  function getBodyHeight(){
 let body = document.body,
    html = document.documentElement;

 return Math.max( body.scrollHeight, body.offsetHeight,
                       html.clientHeight, html.scrollHeight, html.offsetHeight  );
} //currently unused
  function getBodyWidth(){
 let body = document.body,
    html = document.documentElement;

 return Math.max( body.scrollWidth, body.offsetWidth,
                       html.clientWidth, html.scrollWidth, html.offsetWidth  );
} //currently unused
  function setElementWidth(elementId, width){
    document.getElementById(elementId).style.width = width;
  }
  function setElementHeight(elementId, height){
    document.getElementById(elementId).style.height = height;
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
  } //not working unless copied and pasted into pens
  */
} // layout
{
  function getUnitCoordinatesByPercent(percent) {
    let x = Math.cos(2 * Math.PI * percent - Math.PI / 2);
    let y = Math.sin(2 * Math.PI * percent - Math.PI / 2);
    return {x:x, y:y};
  }
  function getPointOnCircle(centerX,centerY,radius,percent){
    let unitCoords = getUnitCoordinatesByPercent(percent/100);
    let finalX = unitCoords.x*radius+centerX;
    let finalY = unitCoords.y*radius+centerY;
    return {x:finalX, y:finalY};
  }
  function getPieWedgeElement(centerX,centerY,radius,startPercent,endPercent,style){
    let unitCoords1 = getUnitCoordinatesByPercent(startPercent/100);
    let startX = unitCoords1.x*radius+centerX;
    let startY = unitCoords1.y*radius+centerY;
    let unitCoords2 = getUnitCoordinatesByPercent(endPercent/100);
    let finalX = unitCoords2.x*radius+centerX;
    let finalY = unitCoords2.y*radius+centerY;
    let longwayFlag = Math.round((endPercent-startPercent)/100);
    if(longwayFlag < 0){ longwayFlag = 0; } // for things that overlap the 0 point
    //svg a [rx] [ry] [1 for circles] [go the long way?] [1 for pies] [end x] [end y]
    return ('<path d="M '+centerX+' '+centerY+' L '+startX+' '+startY+' A '+radius+' '+radius+' 1 '+longwayFlag+' 1 '+finalX+' '+finalY+' Z" style="'+style+'" />');
  }
  function getArcElement(centerX,centerY,radius,startPercent,endPercent,style){
    let unitCoords1 = getUnitCoordinatesByPercent(startPercent/100);
    let startX = unitCoords1.x*radius+centerX;
    let startY = unitCoords1.y*radius+centerY;
    let unitCoords2 = getUnitCoordinatesByPercent(endPercent/100);
    let finalX = unitCoords2.x*radius+centerX;
    let finalY = unitCoords2.y*radius+centerY;
    let longwayFlag = Math.round((endPercent-startPercent)/100);
    //svg a [rx] [ry] [1 for circles] [go the long way?] [1 for pies] [end x] [end y]
    return ('<path d="M '+startX+' '+startY+' A '+radius+' '+radius+' 1 '+longwayFlag+' 1 '+finalX+' '+finalY+' " style="'+style+'" />');
  }
  function findOffset(firstCoordObject,secondCoordObject,offsetDistance,rotate){
    let xMagnitude = firstCoordObject.x-secondCoordObject.x;
    let yMagnitude = firstCoordObject.y-secondCoordObject.y;
    let unitVector = normalizeVector([xMagnitude,yMagnitude]);
    let xOffset = Math.round(unitVector[0]*offsetDistance*1000)/1000;
    let yOffset = Math.round(unitVector[1]*offsetDistance*1000)/1000;
    if(rotate == undefined || rotate == false){
      return {x:xOffset,y:yOffset};
    } else {
      return {x:yOffset,y:(xOffset*-1)};
    }
  }
  function offsetTowards(firstCoordObject,secondCoordObject,offsetDistance){
    let offset = findOffset(firstCoordObject,secondCoordObject,offsetDistance);
    let newX = firstCoordObject.x-offset.x;
    let newY = firstCoordObject.y-offset.y;
    return {x:newX,y:newY};
  }
  function getAngle(A,B,C){
    // where B is the center point, returns radians
    point1 = {x:(A.x-B.x),y:(A.y-B.y)};
    point2 = {x:(C.x-B.x),y:(C.y-B.y)};
    let tempAngle = Math.atan2(point2.y,point2.x)-Math.atan2(point1.y,point1.x);
    let twoPi = Math.PI*2
    while(tempAngle < 0){
      tempAngle += twoPi;
    }
    while(tempAngle > twoPi){
      tempAngle -= twoPi;
    }
    return tempAngle;
  }
  function isSamePoint(pointA, pointB){
    if (pointA.length != pointB.length){ return false; }
    for (tCoord = 0; tCoord < pointA.length; tCoord++){
      if (pointA[tCoord] != pointB[tCoord]){ return false; }
    }
  return true;
}
} // graphing
{
  function addDays(days, date) {
    //see https://stackoverflow.com/questions/563406/add-days-to-javascript-date
    if(date == undefined){
      date = new Date();
    }
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
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
}; // returns week of the month starting with 0

} // dates
{
  function lerp(left,right,amount) {
    var result = ((right*amount)+(left*(1-amount)));
    return result;
  }
  function randBetween(l,h){
    //gives a random whole number between the numbers given or a number between one number and 0, inclusive of the top and bottom numbers
    var ln = parseFloat(l);
    var hn = parseFloat(h);

    if(isNaN(ln) && isNaN(hn)){return undefined;}
    if(isNaN(ln)){ln = 0;}
    if(isNaN(hn)){hn = 0;}

    if(hn > ln){
        hn = hn+1;
        return Math.floor(hn + (ln - hn)*Math.random());
    } else if(hn < ln){
        ln = ln+1;
        return Math.floor(ln + (hn - ln)*Math.random());
    } else if(hn == ln){
        return hn;
    } else {
        return undefined;
    }
  }
  function normalizeVector(vectorArray){
    let magnitude = findVectorMagnitude(vectorArray);
    let newVectorArray = [];
    for(thisInput=0;thisInput<vectorArray.length;thisInput++){
      let thisValue = vectorArray[thisInput];
      newVectorArray.push(thisValue/magnitude);
    }
    return newVectorArray
  } // aka find unit vector
  function findVectorMagnitude(vectorArray){
    let isZero = true; // to add special case for 0
    let sumOfSquares = 0;
    for(thisInput=0;thisInput<vectorArray.length;thisInput++){
      let thisValue = vectorArray[thisInput];
      if(thisValue != 0){
        isZero = false;
      }
      sumOfSquares += thisValue*thisValue;
    }
    if(isZero == true){
      return 0;
    } else {
      return Math.sqrt(sumOfSquares);
    }
  }
  function testVectorNormalizingFunction(){
    let testResult = normalizeVector([1,2,3]);
    alert(testResult);
  }
} // math
{
  function shuffle(array) {
  /*Fisher-Yates shuffle. The idea is to walk the array in the reverse order and swap each element with a random one before it:
https://javascript.info/task/shuffle
*/
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    // swap elements array[i] and array[j]
    // we use "destructuring assignment" syntax to achieve that
    // you'll find more details about that syntax in later chapters
    // same can be written as:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    [array[i], array[j]] = [array[j], array[i]];
  }
}
} // misc
{
// v1 as of Nov 30, 2020:
function runTest(testResult, expectedResult, alertFlag) {
  let result = (testResult == expectedResult);
  let readout = "Actual result: " + testResult + "\n\nExpected result: " + expectedResult + "";
  if (alertFlag != undefined){
    alert(result + readout);
  }
  if (result != true){
    console.log(readout);
  }
  return result;
}
function runAllTests(functionsList) {
  let numTests = functionsList.length;
  let successNum = 0;
  for (testNum = 0; testNum < numTests; testNum++){
    let thisFunc = functionsList[testNum];
    try {
      console.log("Running test " + testNum + ": " + thisFunc.name + "()");
      let result = thisFunc();
      console.log("   Test success: " + result);
      if (result == true){
        successNum++;
      }
    } catch(error) {
      console.log("   Test resulted in error - " + error);
    }
  }
  console.log(successNum + " of " + numTests + " passed");
}
function getFuncName() {
    return getFuncName.caller.name;
}
} // diagnostics

// code snippets
/*

for (const property in object) {
  console.log(`${property}: ${object[property]}`);
}

// clever lambdas:

const dict = {  key: function(){ return actualValue }},  }
return coords.map((value, index) => value + offset[index]);


// unpacking:

let a, b, rest;
[a, b] = [10, 20];
[a, b, ...rest] = [10, 20, 30, 40, 50];
// and now rest = [30,40,50]

// also unpacking:

function A(input1, input2){
  console.log(input1 + " and " + input2)
}
function B(){ return ["foo", "bar"] }
console.log(A(...B()))


*/

// wishlist
/*
- function that will do for Javascript what 'for key in dict' does in Python?
*/

// todo
// - add unit tests for all functions where possible, using diagnostics section
// - have the unit tests run only when the library is loaded as it's own page and output to the visible page below, if possible (be aware that any code executing here will also execute when the .js file is loaded)
// maybe have a button in the html that displays test results?
// add one line comments just inside function summarizing what they do
// later, add documentation of this type (above each function declaration):
 /**
 * Take a list of names seperated by spaces as input and return initials.
 * @function functionName
 * @param  {[type]} foo [description]
 * @param  {String} name  Space Delimited sequence of names.
 * @return {String}       Properly formatted initials.
 */
