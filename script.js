const debug = false

// = To Do =
/*
[ ] search/filter projects
    [x] create and show pubs deck
    [ ] show/hide project detail cards
[ ] cache data for pubs in the html here
[ ] troubleshoot NIH research 2 image
[ ] work on making more images square
    [ ] sample image colors and add that background color to image area?
[ ] mobile friendly view - remove margins to the sides
[ ] quick list view for search results
[ ] configure project-list to show multiple columns?
[ ] UI mockups
[ ] bubble view?
    [ ] color coding/grouping by phase perhaps? 
    [ ] radius by priority
[ ] card creation - don't even add text at this point, move that to the update function and then just call it in the creation function
[ ] card updates
    [x] make project titles <H3>s
    [x] hyperlinks -> apply to column title text
[ ] edit mode cards - show all possible columns and allows penciling things in
[ ] x button to close in top right
[x] show list of projects
[x] save to local storage
    [x] add button to do this
    [ ] don't save raw data
[x] load from spreadsheet
    [ ] add button to do this
    [ ] have the apps script sort it by priority first?
    [ ] show the loading cursor when loading from sheet
          document.documentElement.setAttribute("class", "busy");
[ ] function to update spreadsheet rows
    [ ] add button to do this on a per-project basis

*/

// brief: https://docs.google.com/document/d/1uxysHEv3eSdz5yqzKvzuZETz9t0QuvajEYdsATAOpTc/edit#
// apps script: https://script.google.com/home/projects/1LOGC9FVeLE6rWkBitDSibhlL1NMmGTsDJGnnWL1PZajWQC5JXgp-NQwS/edit

const pubEntries = {
"2D6DE5F9": {"index":72,"project-title":"Alacrity Mini Library","concept":"","note":"","priority":6,"other":"","brief":"https://docs.google.com/document/d/14Q_oP0j21j15fU_9dAAfEQ1agJMyNyIz7dMuxSVF3vg/edit#","github":"https://github.com/FreshAlacrity/freshalacrity.github.io/tree/main/a","codepen":"","mockup":"","live":"https://freshalacrity.github.io/a/","image":"alacrity_mini_library.png","see-also":"","tech":"","license":"","year":"","subject":"Codebase","group":"Assets","phase":"Holding","published":true,"_aliases":"","_project-id":"2D6DE5F9","_merged-project-ids":"","_see-also-ids":"","_test":""},
"7E6010C5": {"index":73,"project-title":"Dynamic Nested Circles","concept":"functions to use with inline SVG to make nested circular designs","note":"Add settings menu (reference settings pen), Animate drawing the sigils","priority":6,"other":"","brief":"https://docs.google.com/document/d/1DB6QujFpbcIckq7KiYpGwIQwfMRG8OyzGFDWt1Kw8ng/edit","github":"https://github.com/FreshAlacrity/freshalacrity.github.io/tree/main/circles","codepen":"","mockup":"","live":"https://freshalacrity.github.io/circles/","image":"nested_circles.png","see-also":"Circular Rope Demo","tech":"","license":"","year":2020,"subject":"Codebase","group":"Assets","phase":"Holding","published":true,"_aliases":"Circular Pattern Builder SVG","_project-id":"7E6010C5","_merged-project-ids":"","_see-also-ids":"","_test":""},
"3D93B925": {"index":92,"project-title":"Conceptions by the Numbers Diagram","concept":"","note":"","priority":8,"other":"","brief":"","github":"","codepen":"","mockup":"","live":"","image":"conception_diagram.png","see-also":"","tech":"Vector Graphics","license":"","year":"","subject":"Graphic Design","group":"","phase":"Holding","published":true,"_aliases":"","_project-id":"3D93B925","_merged-project-ids":"","_see-also-ids":"","_test":""},
"3E26411D": {"index":93,"project-title":"The Future of Science Without Funding","concept":"","note":"","priority":9,"other":"","brief":"","github":"","codepen":"","mockup":"","live":"","image":"science_funding.png","see-also":"","tech":"Vector Graphics","license":"","year":"","subject":"Graphic Design","group":"","phase":"Holding","published":true,"_aliases":"","_project-id":"3E26411D","_merged-project-ids":"","_see-also-ids":"","_test":""},
"4E5F311E": {"index":94,"project-title":"Training Programs Timeline","concept":"","note":"","priority":8,"other":"","brief":"","github":"","codepen":"","mockup":"","live":"","image":"training_programs_illustration.bmp","see-also":"","tech":"Vector Graphics","license":"","year":"","subject":"Graphic Design","group":"","phase":"Holding","published":true,"_aliases":"","_project-id":"4E5F311E","_merged-project-ids":"","_see-also-ids":"","_test":""},
"94B98603": {"index":100,"project-title":"Alcohol and Reproduction Diagram","concept":"","note":"","priority":9,"other":"","brief":"","github":"","codepen":"","mockup":"","live":"","image":"alcohol_and_reproduction.png","see-also":"","tech":"Vector Graphics","license":"","year":"","subject":"Graphic Design","group":"","phase":"Holding","published":true,"_aliases":"","_project-id":"94B98603","_merged-project-ids":"","_see-also-ids":"","_test":""},
"A0F05952": {"index":102,"project-title":"Multivote Poster Design","concept":"helps explain the multivote ranked vote prioritization process (here using red stickers to be distributed between choices) to the uninitiated","note":"","priority":9,"other":"","brief":"","github":"","codepen":"","mockup":"","live":"","image":"multivote.png","see-also":"","tech":"Vector Graphics","license":"","year":"","subject":"Graphic Design","group":"","phase":"Holding","published":true,"_aliases":"","_project-id":"A0F05952","_merged-project-ids":"","_see-also-ids":"","_test":""},
"D404EC90": {"index":147,"project-title":"Calligraphy for Magic Square Poetry in Toki Pona","concept":"aka musi ilo kalama uoaei pi toki pona","note":"","priority":9,"other":"","brief":"","github":"","codepen":"https://codepen.io/WanderingEnby/full/NWRPRda","mockup":"","live":"","image":"toki_pona_magic_square.png","see-also":"","tech":"Toki Pona, Inline SVG, Javascript, CodePen, Gravit Designer","license":"MIT","year":2020,"subject":"Toki Pona","group":"Assets","phase":"Holding","published":true,"_aliases":"","_project-id":"D404EC90","_merged-project-ids":"","_see-also-ids":"","_test":""},
"82991F88": {"index":174,"project-title":"Slime48","concept":"a fluid effect inspired 2048 clone","note":"","priority":5,"other":"https://codepen.io/WanderingEnby/pen/xxxpNNZ","brief":"https://docs.google.com/document/d/1yORzPVeInoQBmoWpkmO-Yz2mgpp9cQZSPzUzexTt50g/edit","github":"","codepen":"https://codepen.io/WanderingEnby/full/qBrLQzq","mockup":"","live":"","image":"slime48.png","see-also":"Circular Pips","tech":"","license":"MIT","year":2021,"subject":"Games","group":"","phase":"Implementation","published":true,"_aliases":"","_project-id":"82991F88","_merged-project-ids":"","_see-also-ids":"","_test":""},
"65525053": {"index":180,"project-title":"Dynamic Inline SVG Music Notation","concept":"","note":"tidy up note spacing","priority":5,"other":"","brief":"","github":"","codepen":"https://codepen.io/WanderingEnby/pen/QWpmKrP","mockup":"","live":"","image":"music_notation.png","see-also":"","tech":"Javascript, CSS, Inline SVG","license":"MIT","year":2021,"subject":"Music","group":"Assets","phase":"Implementation","published":true,"_aliases":"","_project-id":"65525053","_merged-project-ids":"","_see-also-ids":"","_test":""},
"494522BC": {"index":298,"project-title":"Round Pong Game Concept","concept":"in Pico-8 (Collaboration with NMcCoy)","note":"","priority":8,"other":"","brief":"","github":"","codepen":"","mockup":"","live":"https://wanderingenby.itch.io/round-pong","image":"round_pong.png","see-also":"","tech":"Pico-8, Lua, Itch.io, Collaboration","license":"","year":2020,"subject":"Games","group":"","phase":"Review","published":true,"_aliases":"","_project-id":"494522BC","_merged-project-ids":"","_see-also-ids":"","_test":""},
"37BD1E2F": {"index":301,"project-title":"Multi-Format Mockup Preview","concept":"vector illustration of various devices at their native aspect ratios, for showing previews of website/layout scaling between devices","note":"","priority":7,"other":"","brief":"","github":"","codepen":"","mockup":"","live":"https://designer.gravit.io/?token=4LPDUa1c3gBc8t-5bA37f7ABsKOcD_Eu","image":"mockups_preview.png","see-also":"Logo Design Preview Materials","tech":"SVG, Gravit Designer","license":"","year":"","subject":"Graphic Design","group":"","phase":"Review","published":true,"_aliases":"","_project-id":"37BD1E2F","_merged-project-ids":"","_see-also-ids":"","_test":""},
"A27B4173": {"index":304,"project-title":"Alchemical Chocolate Chip Cookie Recipe","concept":"","note":"","priority":9,"other":"","brief":"","github":"","codepen":"","mockup":"","live":"https://designer.gravit.io/?token=aX9TTBMPodGjcR4_HUIJPxeIImV-qROh","image":"alchemy_circle.png","see-also":"","tech":"SVG, Gravit Designer","license":"Copyright","year":2020,"subject":"Illustration","group":"","phase":"Review","published":true,"_aliases":"","_project-id":"A27B4173","_merged-project-ids":"","_see-also-ids":"","_test":""},
"DEFFC8B5": {"index":316,"project-title":"Pomodoro Timer","concept":"","note":"check/revise brief","priority":9,"other":"https://codepen.io/WanderingEnby/pen/KKWeZVZ","brief":"https://docs.google.com/document/d/1cb9N2plS-0oWVLSRinHQqJ9jIKQMYYzYuShcUzKY4qg/edit#","github":"","codepen":"https://codepen.io/WanderingEnby/pen/PopXqoo","mockup":"","live":"https://freshalacrity.github.io/timer/","image":"pomodoro_timer.png","see-also":"","tech":"Javascript, CSS, Inline SVG","license":"MIT","year":2021,"subject":"Time","group":"Process","phase":"Review","published":true,"_aliases":"Meditation Timer","_project-id":"DEFFC8B5","_merged-project-ids":"A80C513F","_see-also-ids":"","_test":""}}

const script_url = "https://script.google.com/macros/s/AKfycbwKryEU-Vhr-1m18QsRSc6CMjiNRcSbSCgNO5hOalOC6vtwtyLVme_kPvqZV_2FMmGc/exec";
var imageFilePrefix = "https://freshalacrity.github.io/project-images/";

const storage = { 
  rawData: [[]], 
  entriesDict: pubEntries, 
  headersDict: {}, 
  visibleDeck: [], 
  decks: { pubs: ["2D6DE5F9", "7E6010C5", "3D93B925", "3E26411D", "4E5F311E", "94B98603", "A0F05952", "D404EC90", "82991F88", "65525053", "494522BC", "37BD1E2F", "A27B4173", "DEFFC8B5"] }
}
const hasLocal = alacrity.hasLocal()

function log (...args) {
  if (debug) {
    alacrity.log(...args)
  }
}
function loadSpreadsheetData () {
  function digestData (data) {
    storage.rawData = data
    if (data !== [[]] && data !== []) {
      log(JSON.stringify(data[0]));
      unpackRawData(data)
      log('Loaded spreadsheet data, now updating project list')
      updateProjectList()
    } else {
      log("Attempted to load current project data but got an invalid response:")
      log(data)
    }
  }
  fetch(script_url + "?month=" + "Projects", { credentials: "omit" })
    .then((response) => response.json())
    .then((data) => digestData(data));
}
function saveLocalData () {
  log('Saving data to localStorage')
  localStorage.setItem("storage", JSON.stringify(storage)) 
}
function loadLocalData () {
  log('Loading data from localStorage')
  let unparsed = localStorage.getItem("storage")
  if (unparsed) { // later do more to test if it's accurate?
    let loaded = JSON.parse(unparsed)
    Object.assign(storage, loaded)
    //log('Storage object after loading localStorage data: ', storage)
    log('Loaded localStorage data; updating project list')
    updateProjectList()
    return true
  } else {
    log('Could not load from localStorage - no such key exists.')
    return false
  }
}
function unpackRawData (data = storage.rawData) {
  log('Unpacking data: received ' + data.length + ' rows')
  storage.decks.allProjects = [] // this may cause issues if we're loading sheets with only some of the project data later on
  function writeEntry(row, index) {
    if (index !== 0){ // skip the header row
      // unpack each column into an object property
      // headers are data[0]
      let id = 'unknown'
      let obj = { index: index }
      row.forEach((str, col) => {
        let propertyName = headers[col]
        if (storage.headersDict['_project-id'].index === col) {
          id = str
          storage.decks.allProjects.push(str)
        }
        if (propertyName) {
          obj[headers[col]] = str
        } else {
          log('No column title for content:', str, 'in column', col)
        }
      })
      storage.entriesDict[id] = obj
    }
    
  }
  
  /* to make it easy to get header strings/names */
  let headers = []
  data[0].forEach((a, i) => {
    let propertyName = a.replace(/\s+/gi, '-').toLowerCase();
    storage.headersDict[propertyName] = {index: i, string: a}
    headers.push([propertyName])
  })
  log('Headers:', headers.join(', '))
  /* decant the raw data into a dictionary keyed by project ID */
  data.forEach((a, i) => writeEntry(a, i))
  log('Unpacked data:', storage.entriesDict)
}

/* DOM element handlers */
function updateEntry (id) {
  // alacrity.setAttributes(el, {})
  // contenteditable="true"
  // @todo
}
function createProjectEntry (id) {
  let order = 0
  let obj = storage.entriesDict[id]
  let el = alacrity.create('div', '', {
    id: 'container-' + id,
    class: 'card'
  })

  let add = (type, property, prefix = '', parent = el) => {
    //if (obj[property]) { // because I want to be able to click and fill in these fields
    if (prefix) { parent.appendChild(alacrity.create('b', prefix)) }
    let text = obj[property]
    parent.appendChild(alacrity.create(type, text, { 
      id: property + '-' + id, 
      contenteditable: true,
      class: 'input'
    }))
    //}
  }
  function br (parent = el) { 
    parent.appendChild(document.createElement('br')) 
  }

  // @todo link image to: live > codepen > mockup > github > brief > image url
  if (obj.image) {
    el.appendChild(alacrity.create('img', undefined, { 
      src: imageFilePrefix + obj.image,
      // @later better image descriptions
      alt: `preview image for ${obj['project-title']} project`,
      class: 'project-image'
    }))
    order -= 10
  }
  
  add('h3', 'project-title')

  // @todo figure out a cute format for this, like flags on the side
  function link (property) {
    if (obj[property]){
      el.appendChild(alacrity.create('a', property, { 
        href: obj[property],
        class: 'project-link'
      }))
    }
  }
  let links = ['live', 'codepen', 'mockup', 'github', 'brief', 'other']
  let linked = false
  links.forEach(l => { 
    if (obj[l]) { order -= 1 }
    link(l) 
  })
  
  if (obj.concept.length > 10) { 
    order -= 2 
    add('p', 'concept')
  }
  
  // details below - expand/collapse these?
  /*
  br()
  if (obj['task-1'] || obj['task-2'] || obj['task-3'] || obj['task-4']) {
    // @later do tasks as an array instead of separate columns
    el.appendChild(alacrity.create('b', 'Tasks'))
    let taskList = alacrity.create('ol', '')
    // @later show checkboxes here - <input type="checkbox"> (would also need listening for clicks etc)
    // also blank spot for adding new tasks?
    add('li', 'task-1', '', taskList)
    add('li', 'task-2', '', taskList)
    add('li', 'task-3', '', taskList)
    add('li', 'task-4', '', taskList)
    el.appendChild(taskList)
  }
  */
  
  function tag (property) {
    if (obj[property]){
      el.appendChild(alacrity.create('span', '#' + obj[property].toLowerCase() + ' ', { class: 'project-tag' }))
    }
  }
  let tags = ['phase', 'subject', 'group']
  tags.forEach(t => {
    // @later include these and link them together for non-pub views
    //tag(t) 
  })

  //add('span', 'see-also', 'Tech: ', tags)
  //add('span', 'see-also', 'See Also: ', tags)

  /*
  // @later redo this bit cleaner
  let licenseData = []
  let lStr = 'contenteditable=true class="input"'
  licenseData.push(`<span title='License' id='license-${id}' ${lStr}>${obj.license}</span>`) 
  licenseData.push(`<span title='Most Recent Update in (Year)' id='year-${id}' ${lStr}>${obj.year}</span>`) 
  el.appendChild(alacrity.create('p', licenseData.join(' ')))
  */
  if (obj.year >= 2020) { order -= 2 }
  
  el.style.order = order
  return el
}
function createProjectList (deck = storage.decks.allProjects) {
  var documentFragment = document.createDocumentFragment()
  deck.forEach(id => {
    let el = createProjectEntry(id)
    documentFragment.appendChild(el)
  })
  $('project-list').appendChild(documentFragment)
}
function updateProjectList () {
  log('Updating all project elements')
  storage.decks.allProjects.forEach(a => updateEntry(a))
}

function init () {
  if (debug) {
    let localLoaded = loadLocalData() // returns a bool
  }
  
  function getDeck (search, deck) {
    let results = []
    // @later make sure to wipe/rebuild decks when changing data
    if ( storage.decks[search] ) { return storage.decks[search] }
    if (search === 'pubs') {
      results = deck.filter(a => storage.entriesDict[a].published === true)
      
      if (false) {
        let json = []
        results.map(a => json.push('"' + a + '": ' + JSON.stringify(storage.entriesDict[a])))
        log('let pubs = ["' + results.join('", "') + '"];\nconst pubEntries = {\n' + json.join(',\n') + '}\n')
      }
      
    } else {
      alacrity.log('search not fully implemented yet; check back later please') 
    }
    storage.decks[search] = results
    return results
  }
  let showThisDeck = getDeck('pubs', storage.decks.allProjects)
  createProjectList(showThisDeck)
  
  // @todo load from the spreadsheet regardless and check against localData?
  
  /* set up basic button functions */
  if (debug) {
    
    document.body.appendChild(alacrity.create('div', `<button id='test'>Test</button> 
<button id='load-from-sheet'>Load from Sheet</button> 
<button id='save-to-local'>Save to LocalStorage</button>
<button id='load-from-local'>Load from LocalStorage</button>`))
    $('test').addEventListener('click', a => alert('foo'))
    $('load-from-sheet').addEventListener('click', a => loadSpreadsheetData())
    $('save-to-local').addEventListener('click', a => saveLocalData())
    $('load-from-local').addEventListener('click', a => loadLocalData())
  }
}
init()
