// STL draw functions

// = GENERAL =
{
function fillHtml(idString,htmlString) {
   document.getElementById(idString).innerHTML = htmlString;
}
function makeElement(elementTemplateObject) {
  // given an object with _element name and various properties, assemble and return HTML string
  let elementType = elementTemplateObject["_element"];
  if (elementType == undefined){
    alert("error! an invalid object was passed to " + getFuncName() + ":\n" + JSON.stringify(elementTemplateObject));
    return;
  }
  let htmlString = "<" + elementType;
  let contents = "";
  let allKeys = Object.keys(elementTemplateObject);
  for (aspect = 0; aspect < allKeys.length; aspect++){
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
function breakIntoCols(array, colNum) {
  let tempArr = array;
  let newArr = [];
  while (tempArr.length > 0){
    newArr.push(tempArr.slice(0, colNum));
    tempArr = tempArr.slice(colNum);
  }
  return newArr;
}
}

// = SVG/MAPPING =
{
function offsetCoords(coords, offset) {
  // for each element in coords, add the corresponding value in the offset
  if (typeof offset == "number") { offset = this; } // for map evaluations
  //console.log("using offset: " + JSON.stringify(offset));
  return coords.map((e,i) => e + offset[i]);
}
function offsetCoordArray(coordArray, offset) {
  // given an array of points, add an offset to each coordinate
  if (typeof offset == "number") { offset = this; } // for map evaluations
  return coordArray.map(offsetCoords, offset);
}
function offsetPoints(mutiArray, offset) {
  // given an array of arrays of points, add an offset to each coordinate
  // currently unused?
  return mutiArray.map(offsetCoordArray, offset);
}
function makePaths(multiArray, styleDict) {
  const pathDefaults = {
    _print_order: 1,
    _element:"path",
    _offset:[0,0],
    fill:"none",
    stroke:"currentColor",
    "stroke-width":".07em",
    "stroke-linecap":"square",
    "stroke-linejoin":"miter"
  }
  let properties = defaults;
  if (styleDict != undefined){ properties = smooshObjects(defaults, styleDict); }

  let tempString = "";
  for (pathArr of multiArray){
    properties.d = makeSimplePath(offsetCoordArray(pathArr, properties._offset));
    tempString += makeElement(properties);
  }
  return tempString;
}
function makeSimplePath(multiArray, tail) {
  result = JSON.stringify(multiArray);
  result = result.replace(/[\]]\,[\[]/g, " L ");
  result = "M " + result.slice(2,-2);
  if (tail != undefined){
    result += tail;
  }
  return result;
}
}

// = PARSING for SITELEN TELO & STL =
{
function splitAnteNimi(inputWord){
  // returns an array of leko-compatible fragments
  //unused, todo update and add test
  let remWord = inputWord;
  let prettyFragments = [];
  while (remWord.length > 0){
    if (lekoLineDict[remWord.slice(0, 2)]){
      prettyFragments.push(remWord.slice(0, 2));
      remWord = remWord.slice(2);
    } else {
      prettyFragments.push(remWord.charAt(0));
      remWord = remWord.slice(1);
    }
  }
  return prettyFragments;
}
function forceLekoCompat(input) {
  let inputArr = input;
  if (typeof input == "string"){
    inputArr = input.split(/\s+/gi)
  } else if (typeof input != "object") {
    alert("error, unknown input type in " + getFuncName() + ": " + JSON.stringify(input));
  }
  //unused, todo update and add test
  let resultArr = [];
  for (word = 0; word < inputArr.length; word++){
    if(lekoLineDict[inputArr[word]]){
      resultArr.push(inputArr[word]);
    } else {
      resultArr = resultArr.concat(splitAnteNimi(inputArr[word]));
    }
  }
  return resultArr;
}
}

// = CALIGRAPHY STYLES =
const defaultGroup = {
        _element:"g",
        _content:"",
        id: "characters",
        _function: makeSimplePath,
        _paths: "//todo function returning an array of pre-offset path objects with unique ids"
      };
var lekoLekoCaligraphyStyle = {
      //content becomes the _title
      _desc:"a three by three layout in angular caligraphy of a toki pona 'nimi musi leko pi nasin tu' animated as if it were being drawn on the screen by an invisible marker",
      // todo append title to the description and set as "aria-label":
      class: "leko-poem",
      _convert_with: forceLekoCompat,
      _columns: 3,
      _direction: "vertical",
      _draw_order:  [1,5,9,2,3,4,7,6,8,0],
                    // anything not included is drawn after this in numerical order; a "" entry pauses briefly
      _draw_offset: [[0,0],[1,1],[2,2],
                     [1,0],[2,0],
                     [0,1],[0,2],
                     [2,1],[1,2],[3.5,0]],
                     //1 = 1em or 100 in viewbox, plus _spacing between characters
                     //anything after this follows the _direction and standard _spacing
      _spacing:((100/8)*2), //where 100 is the width of a standard character
      //viewBox: "0 0 100 100", //to prevent it from being calculated
      _groups: [{
                    id: "characters",
                    tabindex: 1,
                    //_function: // default: makeSimplePath
                    //_paths is by default the lekoLineDict data for the whole input array
                  },{
                    id: "border",
                    "pointer-events": "none", //unclickable, makes it easy to interact with things underneath
                    //function: // default: makeSimplePath
                    _paths: "todo placeholder",//function(){ return { [[[0,0],[300,0],[300,300],[0,300],[0,0]]] }},
                      // square outline path
                      // todo have this expand to the right and down to accommodate optional attribution?
                      // path functions are executed by passing in the whole object as input? or just content and style block?
                      // do I need to add (content, this) as parameters?
                  }],
      }
var simpleCaligraphyStyle = {
      _element: "svg",
      class: "leko-char",
      _desc: "a character from the sitelen telo leko style of writing for the toki pona conlang",
      role: "figure", //alternatively, "img",
        // see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles
      _convert_with: forceLekoCompat,
      _columns: 1,
      _direction: "vertical",
      _include: "",
      //onclick: "alert('beep boop')",
      //_draw_order:  [1,2,3], // anything not included is drawn after this in numerical order; a "" entry pauses briefly
      //_draw_offset: [[]],
                     //1 = 1em or 100 in viewbox, plus _spacing between characters
                     //anything after this follows the _direction and standard _spacing
      _spacing:((100/8)*2), //where 100 is the width of a standard character
      //viewBox: "0 0 100 100", //to prevent it from being calculated
      _groups: [defaultGroup],
      _contents: "<defs></defs>", //all other contents will be appended
      }
var lekoCaligraphyDict = {
  simple: simpleCaligraphyStyle,
  leko_leko: lekoLekoCaligraphyStyle,
}

// = SANDBOX =

function assembleSVG(input, calligraphyStyleObj) {
   // take text input and a style object to convert the text input into html for a complex SVG image

  // todo: update default to a simpler object and include the declaration here
  let resultObj = simpleCaligraphyStyle; // default style object
  if (calligraphyStyleObj != undefined) {
     // apply defaults from a default style object:
     resultObj = smooshObjects(resultObj, calligraphyStyleObj);
  }

  // todo set the _title to the content
  resultObj._title = input;

  // use the style._convert_with to convert the input
  let inputArray = resultObj._convert_with(input);

  resultObj["aria-label"] = resultObj._title + " \n(" + resultObj._desc + ")",

  // todo _content: start by adding <title> + _title + </title><desc> + _desc + </desc> and _include
  resultObj._contents += "<title>" + resultObj._title + "</title>";
  resultObj._contents += "<desc>"  + resultObj._desc  + "</desc>";
  resultObj._contents += resultObj._include;

  // todo for each group in _groups:
  for (group of resultObj._groups){
     // todo change to actual thing:
    let groupObj = defaultGroup;

    console.log(groupObj);

     // set d using path function;


        // path functions are executed by passing in the whole object
     // make the <g> element with it's content


     resultObj._contents += makeElement(groupObj);
  }

  // calculate viewBox, a la viewBox: "0 0 100 100",


  // pass to makeElement() and return
  return makeElement(resultObj);
}

function assembleExistingChar(char, inputObj){
  // fetches coordinate array from dictionary and returns paths with inputObj styling
  return makePaths(lekoLineDict[char]);
}

var content = "mi wile taso\nsina o tawa\nala lon mi\n- akesi kon [NALASUNI]";
var style = lekoLekoCaligraphyStyle;
let htmlSnip = assembleSVG(content, style);
fillHtml("preview", htmlSnip);
fillHtml("text-data", htmlSnip);

// = INIT =
let newKey = "namako";
var currentStyle = lekoCaligraphyDict["standard"];



//loadChar(newKey);
