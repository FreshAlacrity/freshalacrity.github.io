/* jshint esversion: 6 */
/* jshint undef: true, unused: false */
/* globals document, lekoLineDict, alert, console, makeElement */
/* globals componentsDict, makeSimplePath */

function runTest(rawTestResult, rawExpectedResult, funcName, alertFlag) {
  // convert to strings and compare (so multi-layered arrays and objects behave nicely)
  let testResult = JSON.stringify(rawTestResult);
  let expectedResult = JSON.stringify(rawExpectedResult);
  let result = (testResult == expectedResult);
  let readout = "Actual result: " + testResult + "\n\nExpected result: " + expectedResult + "";
  if (alertFlag != undefined){
    alert("Quick result for " + funcName + ": " + result + '\n\n' + readout);
  }
  if (result != true){
    console.log(readout);
  }
  return result;
}
function runAllTests(functionsList) {
  let numTests = functionsList.length;
  let successNum = 0;
  for (let testNum = 0; testNum < numTests; testNum++){
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

// unit tests
function testMakeElement(alertFlag) {
  let testResult = makeElement(componentsDict["start_triangle"]());
  let expectedResult = '<marker id="start-symbol" viewBox="0 0 10 10" refX="4" refY="5" ' +
    'markerUnits="strokeWidth" markerWidth="2" markerHeight="2" ' +
    'orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="black"/>' +
    '</marker>';
  return runTest(testResult, expectedResult, getFuncName(), alertFlag);
}
function testGetFuncName(alertFlag) {
  let testResult = getFuncName();
  let expectedResult = 'testGetFuncName';
  return runTest(testResult, expectedResult, getFuncName(), alertFlag);
}
function testMakeSimplePath(alertFlag) {
  let testResult = makeSimplePath([[150,0],[75,200],[225,200]]," Z");
  let expectedResult = "M 150,0 L 75,200 L 225,200 Z";
  return runTest(testResult, expectedResult, getFuncName(), alertFlag);
}
function testOffsetCoordArray(alertFlag) {
  let testResult = offsetCoordArray([[150,0],[75,200],[225,200]],[100,100]);
  let expectedResult = [[250,100],[175,300],[325,300]];
  return runTest(testResult, expectedResult, getFuncName(), alertFlag);
}
function testOffsetPoints(alertFlag) {
  let testResult = offsetPoints([[[150,0],[75,200]],[[225,200]]],[100,100]);
  let expectedResult = [[[250,100],[175,300]],[[325,300]]];
  return runTest(testResult, expectedResult, getFuncName(), alertFlag);
}

let testList = [
  testMakeElement,
  testGetFuncName,
  testMakeSimplePath,
  testOffsetCoordArray,
  testOffsetPoints,

];
