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

function merge(allData) {
  // goal: merge mod_list and featured_list into included_list

  // make a dictionary of pending file info by namespace guess
  let fileInfoDict = byKey(allData._mod_list, '_namespace_guess')

  // combine  instance file data and spreadsheet data
  // #todo put this in its own function
  allData._possible_addon_list = allData._possible_addon_list.map(entry => {
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
        // remove the key from the list of files to identify
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
  })
  
  // list any files that couldn't find associated entries
  allData._to_identify = fileInfoDict
  if (JSON.stringify(allData._to_identify) != "{}") {
    log(`Files that couldn't be located in the sheet data: ${JSON.stringify(allData._to_identify)}`)
  }

  // make a dictionary of entries by namespace
  let byNamespace = byKey(allData._possible_addon_list, 'Namespace')

  // associate each item with the mod that it comes from
  allData._featured_item_list.forEach(entry => {
    let namespace = entry.id.split(':')[0]
    if (byNamespace.hasOwnProperty(namespace)) {
      // transfer mod's included etc. status to item dataset also
      if (!byNamespace[namespace].adds) {
        byNamespace[namespace].adds = {}
      }
      if (!byNamespace[namespace].adds.Items) {
        byNamespace[namespace].adds.Items = {}
      }
      // #later decide how to handle multiple items with the same ID
      byNamespace[namespace].adds.Items[entry.id] = { id: entry.id }
    } else {
      log(`Mod found with the same namespace as ${entry.id}`)
    }

  })


  allData.Featured = allData._possible_addon_list.filter(a => (a.Status === "Included"))
  
  // make a dictionary of entries by ID to identify + fill in dependency descriptions (supports x etc)
  return allData
}