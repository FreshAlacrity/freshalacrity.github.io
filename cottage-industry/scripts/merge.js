function merge(rawData) {
  // goal: merge mod_list and featured_list into included_list


  // make a dictionary of pending file info by namespace guess
  let fileInfoDict = {}
  rawData._mod_list.forEach(entry => {
    fileInfoDict[entry._namespace_guess] = entry
  })

  // #todo special handling for Forge entry
  // #later loop through the files instead, it's a shorter list
  let activeEntries = rawData._possible_addon_list.map(entry => {
    if (!entry.Datapack) {
      // find the simplest version of the namespace to check for
      let minName = entry.Filename ?? entry.Namespace
      minName = minName ?? entry["Mod/Datapack Name"]
      minName = guessNamespace(minName)
      if (minName === '') {
        log(`no namespace guess available from ${entry.Filename} ?? ${entry.Namespace} ?? ${entry["Mod/Datapack Name"]}`) 
      } else {
        entry._namespace_guess = minName
      }

      if (fileInfoDict.hasOwnProperty(minName)) {
        // merge the data and remove the key from the list of files to identify
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
  })

  rawData.Featured = activeEntries.filter(a => (a.Status === "Included"))
  rawData['_to_identify'] = fileInfoDict
  // make a dictionary of entries by ID to identify + fill in dependency descriptions (supports x etc)
  return rawData
}