
function no(mod, thing) { 
  if (!mod[thing]) { issues += `${mod.name} has no ${thing}<br>` }
}

// add priority sort order function for keys here - always put name first if it's a property

function makeId(str) {
  return str.replace(/\W+/gi, '')
}

function display(data) {
  let divider = ' · '
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
      
      // sort each entry into categories
      entries.forEach(modData => {
        modData.Name = modData["Mod/Datapack Name"] ?? modData["Filename"]
        if (!categories.hasOwnProperty(modData[by])) {
          categories[modData[by]] = [modData]
        } else {
          categories[modData[by]].push(modData)
        }
      })

      // make a 'jump-to' list
      let categoryLinks = []
      for (const [ category, entryData ] of Object.entries(categories)) {
        categoryLinks.push(`<a href='#${makeId(category)}'>${category} (${entryData.length})</a>`)
      }
      featured += `Jump To: ${categoryLinks.join(divider)}`

      function listAdded(a) {
        // #later for mods that add 1-3 things, list the names of those things
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
        return detail
      }
      function makeAddonEntry(a) {
        let str = a.Name
        let added = listAdded(a)
        if (added.length > 0) { str += ` (Adds ${added.join(", ")})` }
        return str
      }

      // display entries subdivided into categories
      for (const [ category, entryData ] of Object.entries(categories)) {
        featured += `<h5 id='${makeId(category)}'>${category}</h5>`
        featured += `<ul><li>${entryData.map(makeAddonEntry).join('</li><li>')}</li></ul>`
      }

    }
  }
  listElement.innerHTML = featured
}

