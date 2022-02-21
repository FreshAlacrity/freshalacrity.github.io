// add priority sort order function for keys - name first
function display(data) {
  // #todo dynamically generate page elements
  let changesElement = document.getElementById("recent-changes")
  let listElement = document.getElementById("featured-list")
  let headerElement = document.getElementById("page-header")

  let featured = '<h3>Featured Mods & Datapacks</h3>'
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

    } else {

      let by = 'Subcategory'
      let categories = {}
      featured += `<h4>${list} (${entries.length})</h4>`
      
      entries.forEach(modData => {
        modData.Name = modData["Mod/Datapack Name"] ?? modData["Filename"]
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
          let detail = []
          for (const [ type, added ] of Object.entries(a.Adds)) {
            let count = Object.keys(added).length
            if (count > 0) {
              let name = type
              if (count !== 1 && name.slice(-1) !== 'y') {
                name += 's'
              } else if (count !== 1) {
                name = name.slice(0, -1) + 'ies'
              }
              detail.push(`${count} ${name}`)
            }
          }
          // #later for mods that add 1-3 things, list the names of those things
          if (detail.length > 0) {
            featured += `<li>${a.Name} (Adds ${detail.join(", ")})</li>`
          } else {
            featured += `<li>${a.Name}</li>`
          }
        })
        featured += `</ul>`
        
      }
    }
  }
  listElement.innerHTML = featured
}

