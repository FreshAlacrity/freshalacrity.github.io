
const gitHubURL = 'https://raw.githubusercontent.com/FreshAlacrity/cottage-industry/main/'
const sheetsURL = 'https://script.google.com/macros/s/AKfycbzzugBv5jR2zfsLlG2QY1ipj1aUzZid6Xw4jQkXHn8e0nIPXjHaUXSWZtV-rB8KzfI/exec'


function log (...args) { console.log(alacrity.tidy(...args)) }

// localForage automatically does JSON.parse() and JSON.stringify() when getting/setting values

async function gatherData(fresh = false) {
  let dataObj = {}
  let dataSources = [
    {
      key: 'featured_sheet',
      url: sheetsURL + '?loc=' + 'featuring',
      parse: getFeaturedDetails,
      perishable: false
    },{
      key: 'instance_file',
      url: gitHubURL + 'minecraftinstance.json',
      parse: getInstanceDetails,
      perishable: true
    }
  ]

  // check what keys localForage has saved (later maybe avoid if fresh is set?)
  let localTest = await localforage.keys().then(function(keys) {
      log(`Saved locally: ${keys}`)
      return Object.fromEntries(keys.map(key => [key, true]))
  }).catch(log)

  function stored(key) { return localTest.hasOwnProperty(key) && !fresh }
  function store(key, obj) { localforage.setItem(key, obj).catch(log) }

  // todo check that data is getting loaded properly
  function load(source) {
    if (!source.perishable && stored(source.key)) {

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
      log(source.url)
      return fetch(source.url, { credentials: "omit" })
        .then((response) => response.json())
        .then((data) => {
          if (typeof source.parse === 'function') {
            log(`running ${source.key} parse function`)
            data = source.parse(data)
          }
          log(`${source.key} data aquired`)
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