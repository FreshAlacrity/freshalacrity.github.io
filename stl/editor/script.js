/* jshint esversion: 6 */
/* jshint undef: true, unused: false */
/* globals localStorage, document, console, alert, lekoLineDict */

// = TO DO =
/*
// clicking on a dictionary entry doesn't load in the simple point values
// use sensibleSort from alacrity on the dictionary
// known issue: typing in a new character and using the "get" button saves in the wrong slot!
// known issue: more than one instance of a letter (like in looping paths)
// known issue: when pasting in array data, preview updates but pretty points doesn't
// seems to be related to end of input issue with the JSON
// reverse order on circular paths doesn't seem to do anything
// known issue: character navigated *to* with Next and Prev is saving, not just the one I was editing
// ctrl + s to save?
// make consonants and numbers

// clicking on dictionary word below loads it into preview
// streamline generation with a style dictionary with objects to put through drawLeko with the arraysOfPoints
// should next and previous auto-save the character you're moving away from?

// = Maybe Later =
// autosave? keep in temptempLekoLineDict and store that locally as well
// ...when to fetch? over-write with Get calls?
// clicking on a letter adds that letter to the last stroke
// clicking between letters adds a stroke between those letters on a new line
// allow adding new paths with click and drag!
// button to join any existing compatible segments + regenerate preview
// highlight the text lines with the appropriate color (using CSS?)
// click between letters to quick-add a lineSegment
// add option to show lines between lines like neon?
// a way to save characters (so like telo2)
// a way to export/import the whole dictionary
// show all button that displays the whole dictionary in a given stylesheet
// button to delete a segment?
*/

// updated with my preferred stroke order on 11/30/2020
var tempLekoLineDict = lekoLineDict;

let storedDict = localStorage.getItem("lekoLineDict");
if (storedDict != undefined){
  //alert("Locally stored character configurations loaded!");
  tempLekoLineDict = JSON.parse(storedDict);
}

function doubleJoin(nestedArray, sepA, sepB, convertToLetter){
  if (sepA == undefined){ sepA = " "; }
  if (sepB == undefined){ sepB = ","; }
  let resultArr = [];
  for (let subArr = 0; subArr < nestedArray.length; subArr++){
    let tSubArr = nestedArray[subArr];
    if (convertToLetter){
      resultArr.push(coordsToLetter(tSubArr));
    } else {
      resultArr.push(tSubArr.join(sepB));
    }
  }
  return resultArr.join(sepA);
}
function doubleJoin2(tripNestArray, sep1, sep2, sep3, convertToLetter){
  let result = [];
  for (let arr = 0; arr < tripNestArray.length; arr++){
    result.push(doubleJoin(tripNestArray[arr], sep2, sep3, convertToLetter));
  }
  return result.join(sep1);
}

function drawLeko(arraysOfPoints, word, drawFunction, color, insert){
  if (drawFunction == undefined){ drawFunction = lekoLines; }
  let canvasHtml = '<svg class="leko-char" viewBox="0 0 100 100" onclick=\'loadChar("'+word+'")\'><title>' + word + '</title>';
  let lineWidth = 5; // where 100 = 1em
  if (color == undefined){ color = "currentColor"; }
  canvasHtml += drawFunction(arraysOfPoints, 0, 0, lineWidth, color);
  if (insert){ canvasHtml+= insert; }
  canvasHtml += '</svg>';
  return canvasHtml;
}

//drawFunctions
function drawPreview(arraysOfPoints){
  let canvasHtml = "";
  canvasHtml += '<marker id="start-symbol" viewBox="0 0 10 10" refX="4" refY="5" ' +
    'markerUnits="strokeWidth" markerWidth="2" markerHeight="2" ' +
    'orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="black"/>' +
    '</marker>';
  canvasHtml += '<marker id="mid-symbol" viewBox="0 0 10 10"' +
    'refX="5" refY="5" markerUnits="strokeWidth" orient="auto" >' +
    '<circle fill="black" cx="5" cy="5" r="1" /></marker>';
  canvasHtml += '<marker id="end-symbol" viewBox="0 0 10 10" refX="5" refY="5" ' +
    'markerUnits="strokeWidth" orient="auto" >' +
    '<circle fill="black" cx="5" cy="5" r="2" /></marker>';
  for (let letterCode = 0; letterCode < 16; letterCode++){
    let tLetter = String.fromCharCode(letterCode + 65);
    let tCoord = letterToCoords(tLetter);
    canvasHtml += '<text text-anchor="middle" x="' + tCoord[0] + '" y="' + (tCoord[1] + 5) + '" style="opacity:.3;font-size:.09em">' + tLetter + '</text>';
    //todo add here click and drag elements?
  }
  return drawLeko(arraysOfPoints, "preview", lekoLines, "rainbow", canvasHtml);
}
function lekoLines(arraysOfPoints, xOffset, yOffset, lineWidth = 5, color = "currentColor"){
  //let basePixelSize = 100/8;
  let thisColor = color;

  let canvasHtml = '';
  let lineSegments = arraysOfPoints;
  for (let thisSeg = 0; thisSeg < lineSegments.length; thisSeg++){
    var tLine = lineSegments[thisSeg];
    if (color == "rainbow"){
      //thisColor = "hsla("+((tLine[0][0]*10)+(tLine[0][1]*35))+",100%,50%,50%)";
      thisColor = "hsla("+(((thisSeg)*260/3)+100)+",70%,50%,100%)";
    }
    //todo add offset here?
    //findme
    canvasHtml += '<polyline points="' + doubleJoin(tLine) +
    '" style="fill:none;stroke:' + thisColor +
    ';stroke-width:' + lineWidth +
    ';stroke-linecap:round;" marker-start="url(#start-symbol)" marker-end="url(#end-symbol)" marker-mid="url(#mid-symbol)" ' +
    '/>'; //square, round;
  }
  return canvasHtml;
}

function letterToCoords(letter){
  //A B C D
  //E F G H
  //I J K L
  //M N O P
  letter = letter.toUpperCase();
  let num = letter.charCodeAt(0) - 65;
  if (num > 15){ alert("invalid letter entered"); }
  let basePixelSize = 100/8;
  let simpleX = (num % 4) * 2;
  let simpleY = (Math.floor(num/4)) * 2;
  let thisX = (simpleX+1) * basePixelSize;
  let thisY = (simpleY+1) * basePixelSize;
  return [thisX, thisY];
}
function coordsToLetter(coordArray){
  let basePixelSize = 100/8;
  let simpleX = (coordArray[0] / basePixelSize) - 1;
  let simpleY = (coordArray[1] / basePixelSize) - 1;
  let newNum = simpleX/2 + (simpleY*4)/2;
  let newChar = String.fromCharCode(newNum + 65);
  return newChar;
}
//alert("37.5,87.5 should be N: " + coordsToLetter([37.5, 87.5]) + "\nN should be 37.5,87.5: " + letterToCoords("N"));

function makePretty(input){
  return doubleJoin2(input,"\n"," - ",", ", true);
}
function decodePretty(input){
  let decoded = input;
  for (let letterCode = 0; letterCode < 16; letterCode++){
    let tLetter = String.fromCharCode(letterCode + 65);
    console.log("looking for " + tLetter);
    if (decoded.indexOf(tLetter) >= 0){
      let coords = letterToCoords(tLetter);
      console.log(tLetter + " found, replacing with " + coords);
      decoded = decoded.replaceAll(tLetter, coords.join(","));
    }
  }
  decoded = "[[[" + decoded.replace(/\n/g,"]], [[") + "]]]";
  decoded = decoded.replace(/\s-\s/g,"],[");
  decoded = JSON.parse(decoded);
  console.log("decoded: " + decoded);
  return decoded;
}
function testMakeAndDecodePretty(){
  let testWord = "waso";
  let deUnEncoded = decodePretty(makePretty(tempLekoLineDict[testWord]));
  alert("Original:\n" + JSON.stringify(tempLekoLineDict[testWord]) +
        "\n\nPretty:\n" + makePretty(tempLekoLineDict[testWord]) +
        "\n\nDeUnEncoded:\n" + JSON.stringify(deUnEncoded));
}
//testMakeAndDecodePretty();

function moveDown(segmentNum){
  let thisElement = document.getElementById("pretty-points");
  let input = thisElement.value.split("\n");
  let temp = input[segmentNum];
  input[segmentNum] = input[segmentNum + 1];
  input[segmentNum + 1] = temp;
  thisElement.innerHTML = input.join("\n");
  updateFromPretty("pretty-points");
}
function flipOrder(segmentNum){
  let thisElement = document.getElementById("pretty-points");
  let input = thisElement.value.split("\n");
  input[segmentNum] = input[segmentNum].split(" - ").reverse().join(" - ");
  thisElement.innerHTML = input.join("\n");
  updateFromPretty("pretty-points");
}

function selectStyle(){
  var selected = document.getElementById("styles").value;
  alert("You selected " + selected + "! Hopefully this will work soon...");
}
function resizeDict(input){
  let val = parseFloat(document.getElementById("dictionary-print").style.fontSize.slice(0,-2));
  document.getElementById("dictionary-print").style.fontSize = (val + input) + 'em';
}

function getSaved(direction){
  let newKey = document.getElementById("fname").value;
  if (direction != undefined){
    let keys = Object.keys(tempLekoLineDict);
    let tempNum = keys.indexOf(newKey);
    newKey = keys[tempNum + direction];
    document.getElementById("fname").value = newKey;
  }
  if (tempLekoLineDict[newKey]){
    console.log("updating preview and points to match stored value for " + newKey);
    updatePreview(tempLekoLineDict[newKey]);
  } else {
    alert("Character not found: " + newKey);
  }
}
function loadChar(newKey){
  document.getElementById("fname").value = newKey;
  updatePreview(tempLekoLineDict[newKey]);
}
function saveAs(){
  let newKey = document.getElementById("fname").value;
  console.log("updating preview and points to match stored value for " + newKey);
  tempLekoLineDict[newKey] = JSON.parse(document.getElementById("arrays-of-points").innerHTML);
  localStorage.setItem("lekoLineDict", JSON.stringify(tempLekoLineDict));
  updatePreview(tempLekoLineDict[newKey]);
}

function updateFromPretty(elementId){
  try {
    let newArrayOfPoints = decodePretty(document.getElementById(elementId).value);
    updatePreview(newArrayOfPoints, elementId);
    document.getElementById("pretty-error-msg").innerHTML = "";
  } catch(e){
    console.log("error updating preview: " + e.message);
    document.getElementById("pretty-error-msg").innerHTML = "  (" + elementId + " input not valid)";
  }
}
function updateFromJSON(elementId){
  try {
    let newArrayOfPoints = JSON.parse(document.getElementById(elementId).value);
    updatePreview(newArrayOfPoints, elementId);
    document.getElementById("array-error-msg").innerHTML = "";
  } catch(e){
    console.log("error updating preview: " + e.message);
    document.getElementById("array-error-msg").innerHTML = "  (" + elementId + " input not valid)";
  }
}
function updateDictionaryPrintout(){
  let allChars = Object.keys(tempLekoLineDict);
  let htmlString = "";
  for (let thisChar = 0; thisChar < allChars.length; thisChar++){
    let word = allChars[thisChar];
    //htmlString += word + " ";
    htmlString += drawLeko(tempLekoLineDict[word], word, lekoLines, "rainbow");
  }
  document.getElementById("dictionary-print").innerHTML = htmlString;
  htmlString = "tempLekoLineDict = {\n";
  for (let thisChar = 0; thisChar < allChars.length; thisChar++){
    let word = allChars[thisChar];
    //htmlString += word + " ";
    htmlString += '"' + word + '":' + JSON.stringify(tempLekoLineDict[word]) + ',\n';
  }
  htmlString += '}';
  document.getElementById("dictionary-code").innerHTML = htmlString;
}
function updatePreview(newArrayOfPoints, elementId){
  console.log("updating preview with point array: " + JSON.stringify(newArrayOfPoints));
  try {
    let newHtml = drawPreview(newArrayOfPoints);
    document.getElementById("preview").innerHTML = newHtml;
    let newPrettyPoints = makePretty(newArrayOfPoints);
    document.getElementById("pretty-points").innerHTML = newPrettyPoints;
    document.getElementById("pretty-points").style.height = (1.3 * newArrayOfPoints.length) + "em";
    let newJSON = JSON.stringify(newArrayOfPoints);
    document.getElementById("arrays-of-points").innerHTML = newJSON;
    let buttonsHtml = "";
    for (let segment = 0; segment < newArrayOfPoints.length; segment++){
      buttonsHtml += '<button class="small" title="move down" onclick="moveDown('+segment+')">V</button><button class="small" title="flip stroke order" onclick="flipOrder('+segment+')">></button><br>';
    }
    document.getElementById("sort-order-buttons").innerHTML = buttonsHtml;
    updateDictionaryPrintout();
  } catch(e){
    console.log("error updating preview: " + e.message);
    document.getElementById("error-msg").innerHTML = elementId + " input not valid";
    return;
  }
}
function clearStorageAndReload(){
 localStorage.clear();
 alert("All local storage values cleared.");
 updatePreview(tempLekoLineDict.namako);
}

//init
let newKey = "namako";
if (tempLekoLineDict[newKey]){
  document.getElementById("fname").value = newKey;
  console.log("updating preview and points to match stored value for " + newKey);
  updatePreview(tempLekoLineDict[newKey]);
} else {
  alert("Character not found: " + newKey);
}
