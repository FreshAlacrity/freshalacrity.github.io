/* globals $ alacrity */

// = KNOWN ISSUES =
/*
- troubleshoot radio button input
  - remember radio buttons will need to get checked=true from if they == their settings[section][this.name]
- no 'x' to close the panel (right now you have to click the settings icon again to close)
- '_hide':true not working for inputs
  - sort out/test being able to hide cards and individual values
*/

// = TO DO =
// load settings variable/cards every time the settings menu is opened/closed since other things can change them
// test importing this script file as a library and using with other scripts
//   add a wrapper
//   move settings example variables to htwml
// auto saving/loading

// = LATER =
/*
// open + close settings panel: click outside, tap settings icon, or 'done/confirm/save' button to close
// special handling for buttons
//   change <input> buttons to just <button>
//   make the 'reset' button actually do a reset to defaults/what it was when the settings window was opened
// password input encryption when saving/autosaving - for now just don't save passwords?

// = Formatting & Input types =
// add these in but not as standard settings
    Reset: {
      type: "reset",
      value: "clear",
      title: "Defines a reset button" // should this reset the whole form, or just that section? make options for each?
    },
    Close: {
      type: "button",
      title: "Close the settings window.",
      value: "close",
      _click: toggleSettingsPanel
    }
// for number ranges
//   support min/max
//   show current value of slider beside it
//   allow setting a default min/max for values?
//   custom formatting for things like $ and % in value indicator for sliders and as added text in text inputs (so like, 5 min)
// option for document text color
//   automatically change the body text color black or white to compliment the chosen background color
// for now just do radio, later add dropdowns:
//   make 3-4 choices into radio buttons
//   make 5+ choices into a dropdown
//   make smaller inline SVG for the settings icon
// support for inputs that are arrays of strings with a flexible length, ex. [Monday, Tuesday, Friday]
//   formatting + custom update functions
// support for dropdown lists
// save and load to *named* localstorage cache to keep different sets of settings (and url variable to load specific ones automatically!)
// some way to set the order of cards/input sections
// validation/special checkfunctions
// way to disable settings/show that they aren't currently available
// allow clicking on sliders to open a text box and just type in a value instead
// special input for rebinding hotkeys
//  include/make a control remappiung setting for games and such (as buttons?)
//  see codepen: https://codepen.io/WanderingEnby/pen/GRWMOxB

// = STYLING =
// turn checkboxes into sliders - https://www.w3schools.com/howto/howto_css_switch.asp
// figure out the spacing under the headers
// better/animated buttons
// styling: change focused text box outline
// styling: check/make a way that buttons can be made double tall and still look good
// styling: add space at the bottom
// styling: work on the Choose File button
// styling: alternate color schemes
// add animated slide-in and slide-out

// = Low Priority =
// redo the settings icon
//   so it can be rounded or angular based on CSS values, also to make it shorter
// sort sample inputs by theme (like date type things together etc)
// demo mode: all input types in random order + a number of inputs on different cards
// add way to make multiple save files/export settings to JSON formatted text file (and re-import the files as settings)
// allow immediately applying settings vs only appling on save/apply button push
/*

// = REFS =
/*
// mockup: https://designer.gravit.io/?d=MHoUw1boy
// inspiration - https://dribbble.com/tags/settings
// possible inspiration: https://codepen.io/jonvadillo/pen/oxRGQo
// flex box guide: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
// for range input: https://css-tricks.com/sliding-nightmare-understanding-range-input/
// https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css/
// input types from https://www.w3schools.com/tags/att_input_type.asp
*/

// @todo move these to html document so they don't overwrite settings when this file is added to other projects
const settings = {
  General: {
    'Background Color': {
      /* color picker uses hex code strings */
      value: '#303842',
      _update: function () { document.body.style.backgroundColor = this.value }
    },
    'Zoom and Font Size': {
      value: 1,
      step: 0.1,
      min: 0.2,
      max: 3,
      type: 'range',
      _update: function () { document.body.style.fontSize = this.value + 'em' }
    },
    Nickname: { value: 'Bean' }
  },
  'Supported Input Types': {
    Search: {
      type: 'search',
      title: 'Defines a text field for entering a search string',
      value: 'search'
    },
    Checkbox: {
      type: 'checkbox',
      title: 'Defines a checkbox',
      checked: true
    },
    Date: {
      type: 'date',
      title: 'Defines a date control (year, month, day (no time))'
    },
    'Datetime (local)': {
      type: 'datetime-local',
      title: 'Defines a date and time control (year, month, day, time (no timezone)'
    },
    Email: {
      type: 'email',
      title: 'Defines a field for an e-mail address'
    },
    File: {
      type: 'file',
      title: 'Defines a file-select field and a "Browse" button (for file uploads)'
    },
    Month: {
      type: 'month',
      title: 'Defines a month and year control (no timezone)'
    },
    Password: {
      type: 'password',
      title: 'Defines a password field'
    },
    /*
    'Radio Button 1': {
      type: 'radio',
      title: 'Defines a radio button',
      name: 'example_radio_input',
      value: 'Radio Button 1'
    },
    'Radio Button 2': {
      type: 'radio',
      title: 'Defines a radio button',
      name: 'example_radio_input',
      value: 'Radio Button 2',
      checked: true
    },
    'Radio Button 3': {
      type: 'radio',
      title: 'Defines a radio button',
      name: 'example_radio_input',
      value: 'Radio Button 3'
    },
    example_radio_input: {
      _hide: true,
      value: 'Radio Button 2'
    },
    */
    Range: {
      type: 'range',
      title: 'Defines a range control (like a slider control)'
    },
    Telephone: {
      type: 'tel',
      title: 'Defines a field for entering a telephone number'
    },
    Text: {
      type: 'text',
      title: 'Default. Defines a single-line text field'
    },
    Time: {
      type: 'time',
      title: 'Defines a control for entering a time (no timezone)'
    },
    Url: {
      type: 'url',
      title: 'Defines a field for entering a URL'
    },
    Week: {
      type: 'week',
      title: 'Defines a week and year control (no timezone)'
    }
  }
}

function makeInputId (cardName, name) {
  return cardName.replaceAll(' ', '_') + '-' + name.replaceAll(' ', '_') + '-input'
  // todo validate - spec states that ID tokens must begin with a letter ( [A-Za-z] ) and may be followed by any number of letters, digits ( [0-9] ), hyphens ( - ), underscores ( _ ), colons ( : ), and periods ( . )
  // so for example, no '/' allowed I think? can substitute with 'BACKSLASH'
}
function updateValueOnInput (section, key, val) {
  try {
    const setting = settings[section][key]
    alacrity.log(`Updating settings[${section}][${key}] from ${setting.value} (type: ${(typeof setting.value)}) to ${val} (type: ${(typeof val)})`)
    setting.value = val
    if (setting._update) {
      setting._update(section, key, val) // this may need updates
    }
  } catch (error) {
    alacrity.log(error)
  }
}

function setType (contents) {
  if (typeof contents.value === 'string') {
    if (contents.value[0] === '#' && contents.value.length === 7) {
      contents.type = 'color'
    } else {
      contents.type = 'text'
    }
  } else if (typeof contents.value === 'boolean') {
    contents.type = 'checkbox'
    contents.checked = contents.value
  } else if (typeof contents.value === 'number') {
    // todo make sliders instead if there's a min and max
    contents.type = 'number'
  } else {
    console.log(`type of '${contents.type}' : '${contents.value}' unknown`)
    contents.type = 'text'
  }
  return contents
}
function settingsCard (key, index, container) {
  if (settings[key]._hide) {
    // todo test this
    return ''
  } else {
    const settingsCard = document.createElement('div')
    settingsCard.innerHTML = `<p class="settings-header">${key}</p>`
    const inputsList = Object.keys(settings[key])
    function addInput (inputKey) {
      settingsCard.appendChild(document.createElement('br'))

      let inputTemp = settings[key][inputKey]
      if (!inputTemp.title) { inputTemp.title = key + ' settings: ' + inputKey }
      // todo later make sure this is a valid id
      inputTemp.id = makeInputId(key, inputKey)

      // create the label
      const labelTemplate = { class: 'settings-label', for: inputTemp.id, title: inputTemp.title }
      settingsCard.appendChild(alacrity.create('label', inputKey, labelTemplate))

      // create the input
      if (!inputTemp.type) { inputTemp = setType(inputTemp) }
      const classes = 'settings-input settings-' + inputTemp.type
      if (inputTemp.class) { inputTemp.class += ' ' + classes } else { inputTemp.class = classes }
      const inputElement = alacrity.create('input', undefined, inputTemp)
      settingsCard.appendChild(inputElement)

      // set event listeners on all input fields
      // settings[key][inputKey]._element = inputElement;
      inputElement.addEventListener('change', function (e) {
        let value = e.target.value
        if (e.target.type === 'checkbox') {
          console.log('checkbox detected')
          value = e.target.checked
        } else if (e.target.type === 'radio') {
          console.log('radio button detected')
          inputKey = e.target.name
        }
        updateValueOnInput(key, inputKey, value)
      })

      settingsCard.appendChild(document.createElement('br'))
    }
    inputsList.forEach(addInput)

    container.appendChild(settingsCard)
  }
}

function makeSettingsWindow (onEditFunction = console.log) {
  // make the container
  const settingsContainer = document.createElement('div')
  settingsContainer.id = 'settings-container'
  document.body.appendChild(settingsContainer)

  // make the visible panel
  const settingsPanel = document.createElement('div')
  settingsPanel.className = 'settings-panel'
  settingsPanel.innerHTML = '<p class="settings-title">Settings</p>'
  settingsContainer.appendChild(settingsPanel)

  /*
  // @todo using this method should be faster & closer to best practice
  var documentFragment = document.createDocumentFragment();
  documentFragment.appendChild(listItem);
  listItem.appendChild(listItemCheckbox);
  */

  Object.keys(settings).forEach((key, index) => settingsCard(key, index, settingsPanel))
}

function updateSettingsWindow () {
  // @todo check and update the value for each setting when the settings window is opened

}

function toggleSettingsPanel () {
  const x = document.getElementById('settings-container')
  if (x.style.display === 'none') {
    updateSettingsWindow()
    x.style.display = 'flex'
  } else {
    x.style.display = 'none'
  }
}

function setup (updateFunctionName) {
  settings['Save Options'] = {
    Autosave: {
      value: true,
      checked: alacrity.hasLocal(),
      title: "Automatically save settings from this window to your browser's local storage"
    }
  }
  // todo hide save/autosave buttons when local storage isn't available (and maybe add a note)

  // todo check what happens if a settings icon isn't present
  $('settings-icon').addEventListener('click', toggleSettingsPanel)
  makeSettingsWindow(updateFunctionName)
}

function testUpdateFunction () {
  console.log('updating now')
}
// initialize the settings window
setup(testUpdateFunction)

/*
function saveLocalValueFromInput(key, inputId, alertBool) {
   localStorage.setItem(key, $(inputId).value);
   if (alertBool == true){
     alert(`'${inputId}' saved locally with key '${key}'`);
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
*/
