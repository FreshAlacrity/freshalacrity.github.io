function display(data) {
  let changesElement = document.getElementById("recent-changes")
  let listElement = document.getElementById("featured-list")
  let headerElement = document.getElementById("page-header")

  /*
  let header = ''
  header += `<h1>${data.name} Modpack</h1>`
  // modloader & version
  header += `<h2>For Minecraft ${data.gameVersion} and Forge ${data.baseModLoader.forgeVersion}</h2>`
  headerElement.innerHTML = header
  */

  let featured = '<h3>Featured Mods & Datapacks</h3>'
  let by = 'Status'
  for (const [ list, entries ] of Object.entries(data)) {
    if (list === 'To_Identify'){
      featured += `<h4>${list} (${entries.length})</h4>`
      featured += `<ul><li>${entries.join('</li><li>')}</li></ul>`
      //featured += `<pre>${JSON.stringify(entries, null, 2)}</pre>`
    } else {
      let categories = {}
      featured += `<h4>${list} (${entries.length})</h4>`
      
      entries.forEach(modData => {
        modData.Name = modData["Mod/Datapack Name"] ?? modData["Filename"]
        modData.Namespace = modData.Namespace ?? modData["Namespace Guess"]
        if (!categories.hasOwnProperty(modData[by])) {
          categories[modData[by]] = [modData]
        } else {
          categories[modData[by]].push(modData)
        }
      })
      for (const [ category, entryData ] of Object.entries(categories)) {
        featured += `<h5>${category} (${entryData.length})</h4>`
        
        featured += `<ul>`
        entryData.forEach(a => {
          featured += `<li>${a.Name} (${a.Namespace} - ${a.ID})</li>`
        })
        featured += `</ul>`
        
      }
    }
  }
  //listElement.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`// `<br>${featured}<br>`
  listElement.innerHTML = featured

}

