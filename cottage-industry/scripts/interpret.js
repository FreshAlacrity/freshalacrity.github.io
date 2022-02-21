function checkSpreadsheetImport (data) {
  if (data.length > 0 && data[0].length > 0) {
    log('Successfully loaded spreadsheet data. First row:')
    log(JSON.stringify(data[0]));
    return true;
  } else {
    throw 'Attempted to load current project data but got an invalid response:' + JSON.stringify(data)
    return false
  }
}

// to convert from Google Sheets to a handy object
function tableToJSON(tableData) {
  let arr = []
  let headers = tableData[0]
  tableData = tableData.slice(2) // to remove the header and the row of analytics
  tableData.forEach(row => {
    let name = row[0]
    let newObj = {}
    newObj = {}
    headers.forEach((header, index) => {
      if (header !== '' && row[index] !== '') {
        newObj[header] = row[index]
      }
    })
    arr.push(newObj)
  })
  return arr
}

function getSheetData(sheetData, key) {
  let newObj = {}
  newObj[key] = tableToJSON(sheetData)
  return newObj
}

// convert JSON from the instance.json file into something more handy
// same functions as Google Apps Script for the Cottage Industry Planning Spreadsheet
// https://docs.google.com/spreadsheets/d/1MNArZYOw71WiJqb6-LdFV4QfBXVaWCjCc2xgWQWzSKI/edit?usp=sharing

function simpleDate(utcString) {
  var dateOnly = utcString.split("T")[0]
  return(dateOnly)
}

// #later update these in apps script also
function guessNamespace(str) {
  let split = str.search(/[0-9]/)
  if (split > 0){
    if ( str.charAt(split - 1) === "v" ){ split -= 1 }
    str = str.substring(0, split)
  }
  // #todo prevent taking the forge out of words like reforged
  let regs = [/\W|_/ig, /forge/ig]
  regs.forEach(a => str = str.replace(a, ''))
  return str.toLowerCase()
}

function guessVersion(str) {
  let split = str.search(/[0-9]/)
  str = str.substring(split, str.length - 4)
  let regs = [/1\.18\.1/, /1\.18/, /forge/i, /^[-_\s~(v)\.]+/i,/[-_\s~\.)]+$/]
  regs.forEach(a => str = str.replace(a, ''))
  return str
}

function getAddonObject(mod) {
  let fileName = mod.installedFile.fileName
  let modData = {
    "ID":              mod.addonID,
    "Filename":        fileName,
    "Release Date":    simpleDate(mod.installedFile.fileDate),
    "Date Installed":  simpleDate(mod.dateInstalled),
    "Last Updated":    simpleDate(mod.dateUpdated),
    "_namespace_guess": guessNamespace(fileName),
    "Version":         guessVersion(fileName),
    "Dependency IDs":  mod.latestFile.dependencies.map(a => a.addonId)
  }
  return modData
}

function getInstanceDetails(instanceObj) {
  return { 
      Name: instanceObj.name,
      "Forge Version": instanceObj.baseModLoader.forgeVersion,
      "Minecraft Version": instanceObj.gameVersion,
      _mod_list: instanceObj.installedAddons.map(getAddonObject) 
    }
}

function getBongoData(bongoObj, type) {
  // try with Computed property names (ES2015)
  /*
  let prop = 'foo';
  let o = {
    [prop]: 'hey',
    ['b' + 'ar']: 'there'
  }
  */
  let obj = {}
  obj[type] = bongoObj.tasks
  return obj
}

