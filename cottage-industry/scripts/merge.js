function merge(rawData) {
  // goal: merge mod_list and featured_list into included_list

  let activeEntries = rawData.featured_list //.filter(entry => entry.Status === 'Included')

  // make a dictionary of pending file info by namespace guess
  let fileInfoDict = {}
  rawData.mod_list.forEach(entry => {
    fileInfoDict[entry["Namespace Guess"]] = entry
  })

  activeEntries = activeEntries.map(entry => {
    if (!entry.Datapack) {
      // find the simplest version of the namespace to check for
      let minName = entry.Namespace ?? entry["Mod/Datapack Name"].toLowerCase()
      minName = minName.replace(/\W|_/ig, '')
      entry["Namespace Guess"] = minName

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
  // if (entry.Namespace === fileInfo["Namespace Guess"]) {
  // Object.assign(entry, fileInfo)
  // remove file from pendingFileList

  // make a dictionary of entries by ID to identify + fill in dependency descriptions (supports x etc)
  return { Included: activeEntries, To_Identify: Object.keys(fileInfoDict) }
}