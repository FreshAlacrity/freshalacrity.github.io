/* GENERAL */
{

   /* modifications */
   function getFancyString(obj, nameStr) {
   let beginStr = "";
   if (nameStr != undefined){
      beginStr = "var " + nameStr + " = ";
   }
   return beginStr + JSON.stringify(obj, null, 2);
   }
   function fix(input,maxN) {
    /* wraps numbers around a range */
    let result = input+0; //make sure it's a number?
    while(result < 0){
      result += maxN;
    }
    while(result > maxN){
      result -= maxN;
    }
    return result;
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
   function editValueAt(position, stringOrArray, newChar) {
    if (position >= stringOrArray.length) { alert("the position specified is past the end of the string") }
    if (newChar == undefined){
      return stringOrArray.slice(0, position).concat(stringOrArray.slice(position+1, stringOrArray.length));
    } else {
      return stringOrArray.slice(0, position).concat(newChar).concat(stringOrArray.slice(position+1, stringOrArray.length));
    }
   }
   function spliceIntoString(str, index, value) {
    return str.slice(0, index) + value + str.slice(index + value.length);
   }
   function getRandomArrayElement(arr) {
     return arr[Math.floor(arr.length*Math.random)];
   }
   function sortByKey(key, obj1, obj2) {
   if (obj2 == undefined){
       return obj1.sort(function(a, b)
       {
        var x = a[key].toLowerCase(); var y = b[key].toLowerCase();
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
       });
   } else {
       return obj1.sort(function(a, b)
       {
        var x = obj2[a][key].toLowerCase(); var y = obj2[b][key].toLowerCase();
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
       });
   }
   }
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

/* looping and recursion */
  //see https://stackoverflow.com/questions/30452263/is-there-a-mechanism-to-loop-x-times-in-es6-ecmascript-6-without-mutable-varia
  const recur = (...args) =>
  ({ type: recur, args })

const loop = f =>
  {
    let acc = f ()
    while (acc.type === recur)
      acc = f (...acc.args)
    return acc
  }

const repeat = $n => f => x =>
  loop ((n = $n, acc = x) =>
    n === 0
      ? acc
      : recur (n - 1, f (acc)))

const inc = x =>
  x + 1

const fibonacci = $n =>
  loop ((n = $n, a = 0, b = 1) =>
    n === 0
      ? a
      : recur (n - 1, b, a + b))

//console.log (repeat (1e7) (inc) (0)) // 10000000
//console.log (fibonacci (100))        // 354224848179262000000
}

/* LAYOUT */
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
   function setElementWidth(elementId, width){
      $(elementId).style.width = width;
   }
   function setElementHeight(elementId, height){
      $(elementId).style.height = height;
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
}

/* HTML */
{
   function $(x) { return document.getElementById(x); }
   function $html(idString, htmlString) {
     if (htmlString != undefined){ $(idString).innerHTML = htmlString; }
     return $(idString).innerHTML;
   }
   const fillHtml = $html; /* alias for backwards compatibility */
   function addHtml(idString,htmlString) {
    let existingHtml = document.getElementById(idString).innerHTML;
    document.getElementById(idString).innerHTML = existingHtml + htmlString;
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
   function printMe(inputText){
   addElement("p", `<pre>${inputText}</pre>`);
   }
   function addElement(type, innerHtml){
    // todo have this play nicely with makeElement
     let newElement = document.createElement(type);
     document.body.appendChild(newElement);
     if (innerHtml != undefined){
       newElement.innerHTML = innerHtml;
    }
   }
}

/* STORAGE */
{
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
         console.log(error);
      }
      return false;
   }
   function saveLocalValue(key, IdForValue, alertBool) {
     // local storage persists after browser is closed
     let inputString = document.getElementById(IdForValue).value;
     localStorage.setItem(key, inputString);
     if (alertBool == true){
       alert("Input '"+inputString+"' saved locally with key '"+key+"'");
     }
   }
   function loadLocalString(key, IdForDisplay, alertBool) {
     let outputString = localStorage.getItem(key);
     if (IdForDisplay != undefined){
       document.getElementById(IdForDisplay).innerHTML = outputString;
     }
     if (alertBool == true){
       alert("String loaded: '"+outputString+"' from key: '"+key+"' - updating id '"+IdForDisplay+"'");
     }
   }
   function saveSessionValue(key, IdForValue, alertBool) {
     // session storage is deleted when the browser is closed
     let inputString = document.getElementById(IdForValue).value;
     sessionStorage.setItem(key, inputString);
     if (alertBool == true){
       alert("Input '"+inputString+"' saved for session with key '"+key+"'");
     }
   }
   function loadSessionString(key, IdForDisplay, alertBool) {
     let outputString = sessionStorage.getItem(key);
     if (IdForDisplay != undefined){
       document.getElementById(IdForDisplay).innerHTML = outputString;
     }
     if (alertBool == true){
     alert("String loaded: '"+outputString+"' from key: '"+key+"' - updating id '"+IdForDisplay+"'");
     }
   }

/* files */
   function newFile(elementId) {
     console.log("Attempting to load file from element " + elementId);
     let x = document.getElementById(elementId);

     if ('files' in x) {
       console.log("File object detected.");
       thisFile = x.files[0];
       settings.fileName = thisFile.name.split(".")[0];
       settings.dateSaved = thisFile.lastModified;
       // lastModified is in Number of milliseconds since midnight January 1, 1970
       // Files without a known last modified date return the current date

       console.log("Loading file...");
       var fileReader = new FileReader();
       fileReader.onload = function(fileLoadedEvent) {
           // update the global variable that holds the document's plain text version
           plainText = fileLoadedEvent.target.result;
           console.log("plainText loaded from file: " + JSON.stringify(plainText).slice(0, maxPreviewLength) + '...');
           updateDocumentView();

           console.log("Checking to see if this file has been loaded before...");
           if (!(settings.fileName in settings.filesList)){
             // todo load last modified time and check against new version
             console.log("No version of this document saved locally, saving now...");
             saveCurrentDocument();
           }
       };
       fileReader.readAsText(thisFile, "UTF-8");

     } else if (x[0].value == "") {
       console.log("No file selected");

     } else {
       console.log("The files property is not supported by your browser!");
       console.log("The path of the selected file: " + x.value);
       // If the browser does not support the files property,
       // it will return the path of the selected file instead.
     }
   }
   function destroyClickedElement(event) {
       document.body.removeChild(event.target);
   }
   function saveTextAsFile(textToSave, fileName) {
       /* Saves the string input as a text file with a given filename and extension. */
       if (autosave != undefined){
         autosave();
       }
       if (fileName == undefined){
         fileName = "exported.txt";
       }
       // todo check to see if it has an extension
       // todo see what happens if no extension is given
       var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
       var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
       var fileNameToSaveAs = fileName;
       var downloadLink = document.createElement("a");
       downloadLink.download = fileNameToSaveAs;
       downloadLink.innerHTML = "Download File";
       downloadLink.href = textToSaveAsURL;
       downloadLink.onclick = destroyClickedElement;
       downloadLink.style.display = "none";
       document.body.appendChild(downloadLink);

       downloadLink.click();
   }
}

/* MATH */
{
   const absValue = (number) => {
      if (number < 0) {
         return -number;
      }
      return number;
   }
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
    /* aka find unit vector */
      let magnitude = findVectorMagnitude(vectorArray);
      let newVectorArray = [];
      for(thisInput=0;thisInput<vectorArray.length;thisInput++){
         let thisValue = vectorArray[thisInput];
         newVectorArray.push(thisValue/magnitude);
       }
      return newVectorArray
   }
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

/* graphing */
  function getUnitCoordinatesByPercent(percent) {
    let x = Math.cos(2 * Math.PI * percent - Math.PI / 2);
    let y = Math.sin(2 * Math.PI * percent - Math.PI / 2);
    return {x:x, y:y};
  }
  function getPointOnCircle(centerX,centerY,radius,percent) {
    let unitCoords = getUnitCoordinatesByPercent(percent/100);
    let finalX = unitCoords.x*radius+centerX;
    let finalY = unitCoords.y*radius+centerY;
    return {x:finalX, y:finalY};
  }
  function getPieWedgeElement(centerX,centerY,radius,startPercent,endPercent,style) {
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
   function getArcElement(centerX, centerY, radius, startPercent, endPercent, style) {
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
   function findOffset(firstCoordObject, secondCoordObject, offsetDistance, rotate) {
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
   function offsetTowards(firstCoordObject, secondCoordObject, offsetDistance) {
    let offset = findOffset(firstCoordObject,secondCoordObject,offsetDistance);
    let newX = firstCoordObject.x-offset.x;
    let newY = firstCoordObject.y-offset.y;
    return {x:newX,y:newY};
   }
   function getAngle(A, B, C) {
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
   function isSamePoint(pointA, pointB) {
    if (pointA.length != pointB.length){ return false; }
    for (tCoord = 0; tCoord < pointA.length; tCoord++){
      if (pointA[tCoord] != pointB[tCoord]){ return false; }
    }
   return true;
   }

/* dates */
   function addDays(days, date) {
      /* see https://stackoverflow.com/questions/563406/add-days-to-javascript-date */
      if(date == undefined){
         date = new Date();
      }
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
   }
   Date.prototype.getWeekOfMonth = function () {
      // returns week of the month starting with 0
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
   function getFreqFromNote(noteString, a4) {
     let arr = noteString.split("");
     let notes = {
        "C":9, "D":7, "E":5, "F":4, "G":2, "A":0, "B":-2
     }
     let nn = notes[arr.shift().toUpperCase()];
     if (arr[0] == "b" || arr[0] == "♭"){ nn += 1; arr.shift(); }
     if (arr[0] == "#"                 ){ nn -= 1; arr.shift(); }
     let num = parseInt(arr.join(""));
     nn = ((num - 4) * 12) - nn;

     /*
     Concert:     440 Hz
     Baroque:     415 Hz
     Classical:   427–430 Hz
     Chorton:     466 Hz
     European:    444 Hz
     Alternative: 432 Hz
     */
     let startA = 440;
     if (a4 && a4 > 400 && a4 < 500){
       startA = a4;
     }

     return startA * Math.pow(2, nn/12);
     /* alternative: startA * Math.pow(1.059463094359, nn); */
   }

}


/* MISC */
{
  function LevenshteinDistance(a, b){
  if(a.length == 0) return b.length;
  if(b.length == 0) return a.length;

  var matrix = [];

  // increment along the first column of each row
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
}
}

/* TESTS */
{
   /* v1, as of Nov 30, 2020 */
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
      /* will return '' for anonymous functions */
      return getFuncName.caller.name;
   }
}
