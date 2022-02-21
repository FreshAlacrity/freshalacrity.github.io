// add priority sort order function for keys - name first
function display(data) {
  // #todo dynamically generate page elements
  let changesElement = document.getElementById("recent-changes")
  let listElement = document.getElementById("featured-list")
  let headerElement = document.getElementById("page-header")

  let featured = '<h3>Featured Mods & Datapacks</h3>'
  let by = 'Status'
  for (const [ list, entries ] of Object.entries(data)) {
    if (list !== 'Featured'){
      let details = entries;
      if (typeof entries === 'string') {
        featured += `<h4>${list}: ${entries}</h4>`
      } else if (typeof entries === 'array') {
        featured += `<h4>${list} (${entries.length})</h4>`
      } else {
        featured += `<h4>${list} (${Object.entries(entries).length})</h4>`

      }
      /*
      featured += `<ul>`
      for (const [ item, details ] of Object.entries(entries)) {
        featured += `<li>${item} - ${details.Filename}</li>`
        //featured += `<pre>${JSON.stringify(entries, null, 2)}</pre>`
      }
      featured += `</ul>`
      */
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
          let detail = ''
          if (a.adds) {
            detail = `(${Object.keys(a.adds.Items)})`
          }
          featured += `<li>${a.Name} ${detail}</li>`
        })
        featured += `</ul>`
        
      }
    }
  }
  //listElement.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`// `<br>${featured}<br>`
  listElement.innerHTML = featured

}

