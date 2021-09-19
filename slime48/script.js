// current version on https://codepen.io/eahartmann/pen/qBrLQzq
// @todo replace with using the alacrity svg library
const svg = function(){
  function getSvgAttributes(element) {
    let obj = {};
    let atts = element.attributes;
    for (let i = 0; i < atts.length; i++){
        let att = atts[i];
        obj[att.nodeName] = att.nodeValue;
    }
    return obj;
  }
  function setSvgAttributes(element, object) {
    Object.keys(object).forEach(key => {
      if (key[0] !== "_"){
        let ns = null;
        if (key.slice(0, 6) === "xlink:") { ns = 'http://www.w3.org/1999/xlink'; }
        element.setAttributeNS(ns, key, object[key]);
      }
    });
    return element;
  }
  function newSvgElement(type, object) {
    let newElement = document.createElementNS('http://www.w3.org/2000/svg', type);
    //if (contents){ newElement.innerHTML = contents; }
    if (object){ setSvgAttributes(newElement, object); }
    return newElement;
  }
  return {
    getAtts: getSvgAttributes, // svg.getAtts
    setAtts: setSvgAttributes, // svg.setAtts
    new: newSvgElement         // svg.new
  };
}();

var game = { board: document.getElementById("game-board") };
function newGame() {
  console.log("New Game");
  // only changes values that are updated by play so settings stay consistant
  game.score = 1; // highest value yet achieved
  game.board_size = 3;
  game.scale = 2;
  game.spacing = 25;
  game.moves = [];
  game.retiring = [];
  game.retired = [];
  game.seed = 1; // currently unused
  game.slimes = {};
  game.total_slimes = 0; // keeps ids unique
  
  // remove all slimes from the board
  while (game.board.firstChild) {
    game.board.removeChild(game.board.firstChild);
  }
  
  // todo have this actually get the right measurements
  let defs = svg.new("defs", {});
  game.board.appendChild(defs);
  // goo effect filter source: https://css-tricks.com/gooey-effect/
  // stdDeviation="2" is related to minumum blob size
  defs.innerHTML = '<filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" /><feBlend in2="SourceGraphic" in="goo" /></filter>';
  let goo_layer = svg.new("g", { class: "goo" });
  game.board.appendChild(goo_layer);
  game.goo_layer = goo_layer;
  let pip_layer = svg.new("g", { class: "pips" });
  game.board.appendChild(pip_layer);
  game.pip_layer = pip_layer;
  game.board.appendChild(svg.new("rect", { id: "border", x:-20, y:-20, width:40, height:40 }));
  
  // build the initial game board by adding two slimes
  addSlime();
  addSlime();
  update();
}

// board updates
function drawBoard() {
  function screenCord(num) {
    // todo here account for centering the game board
    return ((num + 0.5) * game.spacing) - ((game.spacing * game.board_size) / 2);
  }
  function drawBorder() {
    let borderElement = document.getElementById("border");
    svg.setAtts(borderElement, { 
      // start at x and y = -0.5 to put the border between slime coordinates
      x: screenCord(-0.5),
      y: screenCord(-0.5),
      width:  game.spacing * game.board_size,
      height: game.spacing * game.board_size
    });
  }
  function drawSlimes() {
    function makePips(element, r, stroke, pips, flag) {
      // flag centers pip 1
      let circumference = r * 2 * Math.PI;
      if (pips < 1) {
        element.style.strokeWidth = 0;
        return;
      } else if (pips === 1 && !flag){
        element.style.strokeWidth = stroke;
        element.setAttributeNS(null, 'r', r);
      } else if (pips === 1 && flag){
        element.style.strokeWidth = stroke;
        element.setAttributeNS(null, 'r', 0.0001);
      } else {
        element.style.strokeWidth = stroke;
        element.setAttributeNS(null, 'r', r);
      }
      element.style.strokeDasharray = `0.001 ${circumference/pips}`;
      return;
    }
    function makeFancyPips(el1, el2, r, stroke, pips, flag) {
      let innerPips = pips % 6;
      if (innerPips === 0 && pips > 0){ innerPips = 6; }
      makePips(el1, r, r/2, innerPips);
      makePips(el2, r/3, r/3, Math.floor((pips - 1) / 6), true);
    }
    function drawOneSlime(slimeObj) {
      let slimeElement = document.getElementById(slimeObj.id);
      let circle1 = document.getElementById(slimeObj.id + "-pip-circle-1");
      let circle2 = document.getElementById(slimeObj.id + "-pip-circle-2");
      let state = slimeObj.state[0];
      let x = screenCord(state.at[0]);
      let y = screenCord(state.at[1]);
      let v = state.value;
      let template = {
        cx: x, cy: y, r: game.spacing * ((v + 5) / 40), //todo adjust
        title: x + "," + y + ":" + v,
      }
      
      if (slimeElement === null) {
        // add slime and also pip circles
        template.id = slimeObj.id;
        game.goo_layer.appendChild(svg.new("circle", template));
        template.id = slimeObj.id + "-pip-circle-1";
        circle1 = svg.new("circle", template);
        template.id = slimeObj.id + "-pip-circle-2";
        circle2 = svg.new("circle", template)
        game.pip_layer.appendChild(circle1);
        game.pip_layer.appendChild(circle2);
      } else {
        svg.setAtts(slimeElement, template);
        svg.setAtts(circle1, template);
        svg.setAtts(circle2, template);
      }
      let r = template.r * 0.5;
      makeFancyPips(circle1, circle2, r, 1, v - 1);
    }
    // for existing and retiring slimes, create or move appropriate element
    for (let id of Object.keys(game.slimes)) {
      drawOneSlime(game.slimes[id]);
    }
    
    game.retiring.forEach(a => {
      let mergedInto = document.getElementById(a.merged_into);
      let retiringSlime = document.getElementById(a.id);
      let template = svg.getAtts(mergedInto);
      delete template.id;
      svg.setAtts(retiringSlime, template);
    });
    
    // retire slimes
    let retirees = game.retiring;
    game.retiring = [];
    while (retirees.length > 0){
      let a = retirees.pop();
      a.age++;
      if (a.age === 1){
        let c1 = document.getElementById(a.id + "-pip-circle-1");
        game.pip_layer.removeChild(c1);
        let c2 = document.getElementById(a.id + "-pip-circle-2");
        game.pip_layer.removeChild(c2);
        game.retiring.push(a);
      } else if (a.age > 1){
        let slimeElement = document.getElementById(a.id);
        game.goo_layer.removeChild(slimeElement);
        game.retired.push(a);
      } else {
        game.retiring.push(a);
      }
    }
  }
  drawSlimes();
  drawBorder();
}
alacrity.onWindowResize(update);
const initialWidth = alacrity.getPageWidth();
function update() {
  let z = 100 * alacrity.getPageWidth() / initialWidth;
  game.board.setAttribute("viewBox", `-${z/2} -${z/2} ${z} ${z}`);
}

// slime management
function slimeId(coords) {
  // todo rename to slimeKey
  return "at" + coords[0] + "_" + coords[1];
}
function newSlime(coords) {
  let value = 1;
  if (Math.random() > .5){ value = 2; }
  game.slimes[slimeId(coords)] = { 
    id: "slime" + game.total_slimes,
    state: [{ 
      at: coords, 
      value: value
    }]
  };
  game.total_slimes++;
  return true;
}
function getSlime(coords) {
  let id = slimeId(coords);
  if (id in game.slimes) {
    return game.slimes[id];
  } else {
    console.log("slime at " + coords + " not found");
  }
}
function addSlime() {
  function getGrid() {
    let bv = [];
    let x;
    let y;
    for (x = 0; x < game.board_size; x++) {
      for (y = 0; y < game.board_size; y++) {
        bv.push([x, y]);
      }
    }
    return bv;
  }
  function getEmpties() {
    return getGrid().filter(a => {
      let id = slimeId(a);
      return !(id in game.slimes);
    });
  }
  let openSlots = getEmpties();
  if (openSlots.length < 1){
    // expand border
    game.board_size++;
    // todo here reduce scale to keep the border on the screen
    console.log("no slots left! expanding the border");
  } else {
    newSlime(alacrity.getRandFrom(openSlots));
  }
}

// game moves
function makeMove(offset, input) {
  game.moves.unshift(offset);
  
  function doOffset(coords1, coords2) { return [coords1[0] + coords2[0], coords1[1] + coords2[1]]; }
  function rebuildSlimesDict() {
    let allSlimes = Object.values(game.slimes);
    game.slimes = {};
    allSlimes.forEach(a => {
      let newId = slimeId(a.state[0].at);
      if (newId in game.slimes) {
        console.log("error - duplicate slime found");
      } else {
        game.slimes[newId] = a;
      }
    });
  }
  
  // for each slime, move until it can't move
  function moveAll() {
    function condense() {
      let moved = false;
      function canMove(slime) {
        let newCoords = doOffset(slime.state[0].at, offset);
        let valid = true;
        newCoords.forEach(a => {
          if (a < 0 || a >= game.board_size) { valid = false; }
        });
        if (slimeId(newCoords) in game.slimes){ 
          valid = false;
        }
        return valid; 
      }
      function moveSlime(slimeObj, offset) {
        let newState = slimeObj.state[0];
        newState.at = doOffset(newState.at, offset);
        //slimeObj.state.push(newState); // for remembering past turns
        slimeObj.state[0] = newState;
        return slimeObj;
      }
      for (let id of Object.keys(game.slimes)) {
        let slime = game.slimes[id];
        if (canMove(slime)) {
          slime = moveSlime(slime, offset);
          moved = true;
        }
      }
      return moved;
    }
    let keepMoving = true;
    while (keepMoving) {
      keepMoving = condense();
      rebuildSlimesDict();
    }
  }
  moveAll();
  
  // find first merges/nearest the wall
  function mergeSlimes(){
    let allSlimes = Object.values(game.slimes);
    let axis = 0;
    if (offset[1] == 0) { axis = 1 }
    let someMerged = false;
    for (let row = 0; row < game.board_size; row++){
      // find all slimes in this row
      let thisRow = allSlimes.filter(a => {
        let loc = a.state[0].at;
        return loc[axis] === row;
      });

      // sort by nearest the wall
      thisRow.sort((a, b) => { 
        let check = 0;
        if (axis === 0) { check = 1 };
        let locA = a.state[0].at[check];
        let locB = b.state[0].at[check];
        let flip = 1;
        if (offset[check] > 0) {
          flip = -1;
        }
        if (locA > locB) {
          return 1 * flip;
        } else {
          return -1 * flip;
        }
      });

      // merge the ones that can be merged
      for (let i = 0; i < thisRow.length - 1; i++) {
        let val = thisRow[i].state[0].value;
        if (val === thisRow[i + 1].state[0].value){
          let mergingSlimeId = slimeId(thisRow[i + 1].state[0].at);
          
          // move the merging slime into the retiring slimes list
          thisRow[i + 1].age = 0;
          thisRow[i + 1].merged_into = thisRow[i].id;
          game.retiring.push(thisRow[i + 1]);
          delete game.slimes[mergingSlimeId];
          
          // increase value
          let mergedIntoId = slimeId(thisRow[i].state[0].at);
          game.slimes[mergedIntoId].state[0].value++;
          if (val + 1 > game.score){
            game.score = val + 1;
          }
          
          i++; // skip the next one since it's already been merged
          someMerged = true;
        }
      }
    }
    return someMerged;
  }
  if (mergeSlimes()){ 
    rebuildSlimesDict();
    moveAll(); 
  }

  rebuildSlimesDict();
  addSlime();
  drawBoard();
}

function init() {
  document.addEventListener('keydown', function(event) {
    // later get keyCodes from variables/allow remapping keys
    if (event.keyCode == 37) {
      makeMove([-1, 0], 'left');
    } else if (event.keyCode == 39) {
      makeMove([1, 0], 'right');
    } else if (event.keyCode == 38) {
      makeMove([0, -1], 'up');
    } else if (event.keyCode == 40) {
      makeMove([0, 1], 'down');
    } else if (event.keyCode == 32) {
      //makeMove([0, 0], 'space');
    } else if(event.keyCode == 27) { // esc
      newGame();
    }
  });
  newGame();
  drawBoard();
}
init();
