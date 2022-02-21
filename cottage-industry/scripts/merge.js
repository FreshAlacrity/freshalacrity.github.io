function byKey(arrayOfObj, key) {
  let newObj = {}
  arrayOfObj.forEach(entry => {
    if (newObj.hasOwnProperty([entry[key]])){
      log(`Key colision: ${key} for ${JSON.stringify(entry)} already taken`)
    }
    newObj[entry[key]] = entry
  })
  return newObj
}

function matchFileDataToSheetData(sheet, files) {
  // make a dictionary of pending file info by namespace guess
  let fileInfoDict = byKey(files, '_namespace_guess')

  // combine  instance file data and spreadsheet data
  function matchEntry(entry) {
    if (!entry.Datapack && entry.Status !== 'Base') {

      // find the simplest version of the namespace to check for
      let minName = entry.Filename ?? entry.Namespace
      minName = minName ?? entry["Mod/Datapack Name"]
      minName = guessNamespace(minName)
      if (minName === '') {
        log(`no namespace guess available from ${entry.Filename} ?? ${entry.Namespace} ?? ${entry["Mod/Datapack Name"]}`) 
      } else {
        entry._namespace_guess = minName
      }

      // make sure every entry has a namespace set
      entry.Namespace = entry.Namespace ?? minName

      // if a match is found, merge in the data
      if (fileInfoDict.hasOwnProperty(minName)) {
        let newEntry = Object.assign(entry, fileInfoDict[minName])
        delete fileInfoDict[minName]
        newEntry.Status = "Included"
        return newEntry
      }
        
      // it's not a datapack and it should be in the files
      if (entry.Status === "Included") { entry.Status = "NOT FOUND" }

    } else {
      //log(`Found datapack: ${entry["Mod/Datapack Name"]}`)
    }
    return entry
  }
  sheet = sheet.map(matchEntry)

  // list any files that couldn't find associated entries
  if (JSON.stringify(fileInfoDict) != "{}") {
    log(`Files that couldn't be located in the sheet data: ${JSON.stringify(fileInfoDict)}`)
  }
  return sheet
}




function merge(allData) {
  let mList = allData._possible_addon_list

  // merge file information into Featured sheet entries
  mList = matchFileDataToSheetData(mList, allData._mod_list)

  // make sure each entry has all the correct properties
  mList = mList.map(entry => {
    let template = { Adds: {} }
    bongoTypes.forEach(a => { template.Adds[a] = [] })
    return Object.assign(template, entry)
  })

  // make a dictionary of entries by namespace
  let byNamespace = byKey(mList, 'Namespace')

  // associate each item etc. with the mod that it comes from by id
  // #todo put this in a function
  let unknownNamespaces = {}
  bongoTypes.forEach(type => {
    log (`_featured_${type.toLowerCase()}_list`)
    allData[`_featured_${type.toLowerCase()}_list`].forEach(entry => {
      let id = entry.id ?? entry[type.toLowerCase()]      
      let namespace = id.split(':')[0]
      if (byNamespace.hasOwnProperty(namespace)) {
        // #todo transfer mod's included etc. status to item dataset also
        // #later decide how to handle multiple items with the same ID
        byNamespace[namespace].Adds[type][id] = { id: id }
      } else {
        unknownNamespaces[namespace] = true
      }
    })
  })
  if (Object.keys(unknownNamespaces).length > 0) {
    log(`Namespaces not found: ${Object.keys(unknownNamespaces).join(', ')}`)
  }

  // #later here - merge bongo item data into sheet data
  // make sure each item in the bongo list has an entry

  // filter out the addons present in this version
  allData.Featured = mList.filter(a => (a.Status === "Included"))
  return allData
}