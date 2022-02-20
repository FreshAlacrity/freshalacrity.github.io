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

function getFeaturedDetails(sheetData) {
  return { featured_list: tableToJSON(sheetData) }
}

// convert JSON from the instance.json file into something more handy
// same functions as Google Apps Script for the Cottage Industry Planning Spreadsheet
// https://docs.google.com/spreadsheets/d/1MNArZYOw71WiJqb6-LdFV4QfBXVaWCjCc2xgWQWzSKI/edit?usp=sharing

function simpleDate(utcString) {
  var dateOnly = utcString.split("T")[0]
  return(dateOnly)
}

function getAddonObject(mod) {
  let fileName = mod.installedFile.fileName
  let endName = fileName.search(/[0-9]/)
  let startVersion = endName

  // detect version prefix
  if ( fileName.charAt(endName - 1) === "v" ){
    endName -= 1
  }

  let namespaceGuess = fileName.substring(0, endName)
  let versionGuess = fileName.substring(startVersion, fileName.length - 4)

  // clean up the namespace guesses
  let cleanForgeRemove = /forge/ig
  namespaceGuess = namespaceGuess.replace(/\W|_/ig, '').replace(cleanForgeRemove, '').toLowerCase()
  // todo prevent taking the forge out of words like reforged

  // clean up the version numbers
  let regs = [/1\.18\.1/, /1\.18/, /forge/i, /^[-_\s~(v)\.]+/i,/[-_\s~\.)]+$/]
  regs.forEach(a => versionGuess = versionGuess.replace(a, ''))

  let modData = {
    "ID": mod.addonID,
    "Filename": fileName,
    "Release Date":   simpleDate(mod.installedFile.fileDate),
    "Date Installed": simpleDate(mod.dateInstalled),
    "Last Updated":   simpleDate(mod.dateUpdated),
    "Namespace Guess": namespaceGuess,
    "Version": versionGuess,
    "Dependency IDs": mod.latestFile.dependencies.map(a => a.addonId)
  }
  return modData
}

function getInstanceDetails(instanceObj) {
  return { 
      pack_name: instanceObj.name,
      forge_version: instanceObj.baseModLoader.forgeVersion,
      game_version: instanceObj.gameVersion,
      mod_list: instanceObj.installedAddons.map(getAddonObject) 
    }
}