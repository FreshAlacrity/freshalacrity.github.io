/* jshint esversion: 6 */
/* jshint undef: true */
/* globals alacrity, luxon, window, document, $, setInterval, setTimeout */

// key: type 1 is no physical contact, type 2 is some and type 3 is intimate
// pull out identifying information - have spreadsheet generate the anonymized data in the future?
// shrink the graph on large screens? size relative to default em?
// try color coding the bubbles with unique hues (how to make colorblind friendly?)

const spacing    = 22;
const bubbleSize = 4;
const scaling    = 1.6;
const fontScale  = 1;
const groupCode  = '&';
const suffix = '-node';
let root     = "2123";
let focus;
var nodes = {
  "2123": {
    "coords": [ -0.5 * spacing, -4 ],
    "label": "",
    "to": [
      {
        "2473": 1
      },
      {
        "2904": 3
      },
      {
        "2181": 1
      },
      {
        "2677": 2
      },
      {
        "2120": 1
      },
      {
        "2507": 1
      },
      {
        "2503": 2
      },
      {
        "2487": 2
      },
      {
        "2670": 1
      }
    ],
    "class": "bubble"
  },
  "1409": {
    "label": "&",
    "to": [],
    "class": "bubble",
  },
  "1412": {
    "label": "&",
    "to": [],
    "class": "bubble",
  },
  "2120": {
    "label": "",
    "to": [],
    "class": "bubble",
  },
  "2125": {
    "label": "",
    "to": [],
    "class": "bubble"
  },
  "2130": {
    "label": "",
    "to": [],
    "class": "bubble"
  },
  "2132": {
    "label": "",
    "to": [],
    "class": "bubble"
  },
  "2181": {
    "label": "",
    "to": [
      {
        "2904": 1
      }
    ],
    "class": "bubble",
  },
  "2373": {
    "label": "",
    "to": [],
    "class": "bubble"
  },
  "2405": {
    "label": "",
    "to": [],
    "class": "bubble"
  },
  "2473": {
    "label": "",
    "to": [
      {
        "2904": 1
      }
    ],
    "class": "bubble",
  },
  "2487": {
    "label": "",
    "to": [],
    "class": "bubble",
  },
  "2488": {
    "label": "",
    "to": [],
    "class": "bubble"
  },
  "2501": {
    "label": "",
    "to": [],
    "class": "bubble",
  },
  "2503": {
    "label": "",
    "to": [
      {
        "2488": 2
      },
      {
        "2125": 3
      }
    ],
    "class": "bubble",
  },
  "2507": {
    "label": "",
    "to": [
      {
        "2120": 3
      }
    ],
    "class": "bubble",
  },
  "2647": {
    "label": "",
    "to": [],
    "class": "bubble"
  },
  "2670": {
    "label": "",
    "to": [
      {
        "2373": 1
      },
      {
        "2130": 1
      },
      {
        "2501": 1
      },
      {
        "1412": 3
      }
    ],
    "class": "bubble",
  },
  "2677": {
    "label": "",
    "to": [
      {
        "2680": 2
      },
      {
        "2647": 2
      },
      {
        "2132": 2
      },
      {
        "2701": 2
      }
    ],
    "class": "bubble",
  },
  "2680": {
    "label": "",
    "to": [],
    "class": "bubble"
  },
  "2701": {
    "label": "",
    "to": [],
    "class": "bubble"
  },
  "2904": {
    "label": "",
    "to": [
      {
        "1409": 1
      },
      {
        "2405": 2
      }
    ],
    "class": "bubble",
  }
};

function keysFromObjArr(arr){
  return arr.map(a => Object.keys(a)[0]);
}
function assign(obj){
  let tos = keysFromObjArr(obj[root].to);
  alacrity.log(tos);
  let angles = tos.length;
  obj[root].class += " center";
  obj[root].size = bubbleSize * scaling;

  /* spread the root node's connections in a circle */
  tos.forEach((a, i) => {
    obj[a].coords = alacrity.circPoint(obj[root].coords, spacing, i / angles);
    obj[a].class += " inner";
    obj[a].size = bubbleSize;
  });

  /* find the secondary nodes and splay them outwards */
  tos.forEach((a, i) => {
    let a1 = i / angles;
    let newTos = keysFromObjArr(obj[a].to);
    newTos = newTos.filter(b => obj[b].coords == undefined);
    let numNew = newTos.length;
    newTos.forEach((c, d) => {
      let a2 = a1 + d / angles - ((numNew - 1) / angles) / 2;
      obj[c].coords = alacrity.circPoint(obj[a].coords, spacing / scaling, a2);
      obj[c].class += " outer";
      obj[c].size = bubbleSize / scaling;
    });
  });
  return obj;
}
nodes = assign(nodes);
alacrity.log("assigned nodes:",nodes);

function circle(center, r = bubbleSize, classes = "") {
  return `<circle cx="${center[0]}" cy="${center[1]}" r="${r}" class="${classes}" />`;
}
function nodeString(item, index = 0) {
  let abbr = item[0];
  let coords = item[1].coords;
  if (item[1].label === groupCode){
    item[1].class += " group";
  }
  let label = alacrity.makeElement({
      _element: 'text',
      x: coords[0],
      y: coords[1] + item[1].size * 0.1,
      'dominant-baseline': 'middle',
      'text-anchor': 'middle',
      'font-size': (item[1].size * fontScale),
      class: item[1].class,
      _contents: item[1].label//abbr
    });
  return `<g id="${abbr + '-node'}" onclick="setFocus('${abbr}')"class="node ${item[1].class}">` + circle(coords, item[1].size, item[1].class) + label + '</g>';
}
function line(start, end, classes = ""){
  return `<path d="M ${start} ${end}" class="${classes}"/>`;
}
function valOne(obj){
  return obj[Object.keys(obj)[0]];
}
function findVal(obj, b){
  return valOne(obj.filter(a => Object.keys(a)[0] == b)[0]);
}
function allLines(obj){
  let initial = Object.entries(obj);
  initial = initial.filter(a => a[1].hasOwnProperty('to'));
  let lines = initial.map(a => keysFromObjArr(a[1].to).map(b => {
    return line(a[1].coords, obj[b].coords, "line-" + findVal(a[1].to, b));
  }).join('')).join('');
  return lines;
}
function labelFriend(text, x, y, size = 2) {
  return alacrity.makeElement({
        _element: 'text',
        x: x,
        y: y,
        'dominant-baseline': 'middle',
        'text-anchor': 'middle',
        'font-size': size * fontScale,
        class: "key-label",
        _contents: text
      });
}
function lineSample(x, y, classes){
  let start = [x - 5, y];
  let end =   [x + 5, y];
  let html = line(start, end, classes);
  html += nodeString(["key",{
    coords:[x - 5, y],
    size: 0.3,
    class: 'bubble key-node',
    label: ''
  }]);
  html += nodeString(["key",{
    coords:[x + 5, y],
    size: 0.3,
    class: 'bubble key-node',
    label: ''
  }]);
  return html;
}
function keyCode(){
  let x = spacing * 1.72;
  let y = -1.25;
  let htmlString = labelFriend("key", x, y * spacing, 4);

  y += 0.55;
  htmlString += nodeString(["key",{
    coords:[x, y * spacing],
    size: 3,
    class: 'bubble key-node',
    label: '&'
  }]);
  y += 0.27;
  htmlString += labelFriend("group", x, y * spacing);
  y += 0.12;
  htmlString += labelFriend("/open", x, y * spacing);

  y += 0.4;
  htmlString += lineSample(x, y * spacing, 'line-3');
  y += 0.15;
  htmlString += labelFriend("irl sex", x, y * spacing);
  y += 0.35;
  htmlString += lineSample(x, y * spacing,'line-2');
  y += 0.15;
  htmlString += labelFriend("irl snugs", x, y * spacing);
  y += 0.35;
  htmlString += lineSample(x, y * spacing,'line-1');
  y += 0.15;
  htmlString += labelFriend("no irl", x, y * spacing);
  return htmlString;
}
function draw(obj){
  let list = Object.entries(obj);
  let lines = allLines(obj);
  let bubbles = list.map(nodeString).join('');
  let key = keyCode();
  return lines + bubbles + key;
}

$('polycule').innerHTML = draw(nodes);

function getURLVariable(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i=0; i<vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return undefined;
}

function setFocus(abbr, init = false){
  let id = abbr + suffix;
  if (!init && focus !== undefined){ $(focus + suffix).classList.toggle("focused"); }
  $(id).classList.toggle("focused");
  const stateObj = { focus: abbr };
  window.history.pushState(stateObj, '', 'index.html?focus=' + abbr);
  focus = abbr;
}

Object.defineProperty(String.prototype, 'hashCode', {
  value: function() {
    var hash = 0, i, chr;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
});

focus = getURLVariable('focus');
if (focus !== undefined){
  if (isNaN(+focus)){
    focus = focus.hashCode();
  }
  if (nodes.hasOwnProperty(focus)){
    setFocus(focus, true);
  } else {
    focus = undefined;
    const stateObj = { focus: undefined };
    window.history.pushState(stateObj, '', 'index.html');
  }
}
