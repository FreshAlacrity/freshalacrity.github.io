const gitHubURL = 'https://raw.githubusercontent.com/FreshAlacrity/cottage-industry/main/'
const sheetsURL = 'https://script.google.com/macros/s/AKfycbzzugBv5jR2zfsLlG2QY1ipj1aUzZid6Xw4jQkXHn8e0nIPXjHaUXSWZtV-rB8KzfI/exec'


function log (...args) { console.log(alacrity.tidy(...args)) }

// localForage automatically does JSON.parse() and JSON.stringify() when getting/setting values

// #todo fetch item sheet (will need to update and deploy apps script first)
async function gatherData(fresh = false) {
  let dataObj = {}
  let dataSources = [
    {
      key: '_possible_addon_list',
      url: sheetsURL + '?loc=' + 'Featuring',
      parse: getSheetData,
      always_fetch: true
    },
    {
      key: '_item_list',
      url: sheetsURL + '?loc=' + 'Items',
      parse: getSheetData,
      always_fetch: true
    },
    {
      key: '_instance_file',
      url: gitHubURL + 'minecraftinstance.json',
      parse: getInstanceDetails,
      always_fetch: false
    }
  ]
  let bongoTypes = ['advancement','item','entity']
  bongoTypes.forEach(type => {
    dataSources.push({
      key: `_featured_${type}_list`,
      url: `${gitHubURL}/bongo-dump/bingo_tasks/bongo-${type}.json`,
      parse: getBongoData,
      always_fetch: false
    })
  })

  // check what keys localForage has saved (later maybe avoid if fresh is set?)
  let localTest = await localforage.keys().then(keys => {
    if (fresh) {
      log(`Loading fresh data, clearing local keys: ${keys.join(", ")}`)
      keys.forEach(a => { localforage.removeItem(a) })
      return {}
    } else {
      log(`Saved locally: ${keys.join(", ")}`)
      return Object.fromEntries(keys.map(key => [key, true]))
    }
  }).catch(log)


  function stored(key) { return localTest.hasOwnProperty(key) }
  function store(key, obj) { localforage.setItem(key, obj).catch(log) }

  // todo check that data is getting loaded properly
  function load(source) {
    if (!fresh && !source.always_fetch && stored(source.key)) {

      // load from localforage
      log(`loading ${source.key} data from local storage`)
      return localforage.getItem(source.key).then(data => {
        dataObj[source.key] = data
        log(`${source.key} data loaded`)
        return data
      }).catch(log)

    } else {

      // fetch and then store
      log(`fetching ${source.key} data from source`)
      return fetch(source.url, { credentials: "omit" })
        .then((response) => response.json())
        .then((data) => {
          if (typeof source.parse === 'function') {
            //log(`running ${source.key} parse function`)
            data = source.parse(data, source.key)
          }
          //log(`${source.key} data aquired`)
          dataObj[source.key] = data
          store(source.key, data)
          return data
        }).catch(log)

    }
  }

  // later - is there a way to do this more neatly?
  let tests = await Promise.all(dataSources.map(load))
  return merge(Object.assign(...tests))
}