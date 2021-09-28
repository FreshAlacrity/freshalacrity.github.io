// WIP at https://codepen.io/eahartmann/pen/vYZQqgE

const dataManager = (function () {
  /* wrapped for modular inclusion in other code using an immediately invoked function expression (IIFE) to keep the namespace clear */
  
  let storage = { 
    debug: true, 
    update: peep,
    dataset: 'demo',
    scriptUrl: 'https://script.google.com/macros/s/AKfycbwKryEU-Vhr-1m18QsRSc6CMjiNRcSbSCgNO5hOalOC6vtwtyLVme_kPvqZV_2FMmGc/exec'
    // apps script: https://script.google.com/home/projects/1LOGC9FVeLE6rWkBitDSibhlL1NMmGTsDJGnnWL1PZajWQC5JXgp-NQwS/edit
    
    // Example apps script code:
    /*
    // Setting up new deployments: 
    //   Deploy > Web App > Execute as Me > Allow Access by Anyone
    //   then copy the Wep App URL to the scriptUrl property in the client-side JavaScript
    
    // Remember to redeploy when changed; 
    //   Deploy > Manage Deployments > [Pencil Icon] > New Version

    var locations = { keyword : { sheet: 'Sheet Name Here', doc : 'Document ID String from URL Here' } }

    function doGet(request) {
      var loc = request.parameters.loc;
      var sheet = SpreadsheetApp.openById(locations[loc].doc).getSheetByName(locations[loc].sheet);
      if (sheet)  var table = sheet.getDataRange().getValues(); else var table=[[]];
      return ContentService.createTextOutput(JSON.stringify(table)).setMimeType(ContentService.MimeType.JSON);
    }
    */
  }

  function log (...args) {
    if (storage.debug) {
      console.log(alacrity.tidy(...args))
    }
  }
  function peep(data) {
    log('no update function specified; data has ' + data.length + ' rows')
  }
  
  function loadSpreadsheetData () {
    function digestData (data) {
      if (data.length > 0 && data[0].length > 0) {
        storage.data = data;
        saveLocalData();
        log('Successfully loaded and saved spreadsheet data. First row:')
        log(JSON.stringify(data[0]));
        storage.update(storage.data)
        return true;
      } else {
        log('Attempted to load current project data but got an invalid response:')
        log(data)
        return false;
      }
    }
    fetch(storage.scriptUrl + "?loc=" + storage.dataset, { credentials: "omit" })
      .then((response) => response.json())
      .then((data) => digestData(data));
  }
  
  function saveLocalData () {
    log('Saving data to localStorage')
    localStorage.setItem("storage", JSON.stringify(storage)) 
  }
  function loadLocalData (config) {
    log('Loading data from localStorage')
    let unparsed = localStorage.getItem("storage")
    if (unparsed) { // later do more to test if it's accurate?
      let loaded = JSON.parse(unparsed)
      Object.assign(storage, loaded, config)
      //log('Storage object after loading localStorage data: ', storage)
      log('Loaded localStorage data')
      return true
    } else {
      log('Could not load from localStorage - no such key exists.')
      return false
    }
  }

  function init(config) {
    Object.assign(storage, config)
    if (alacrity.hasLocal() && loadLocalData(config)) {
      /* loads data from storage just to speed things up */
      log("Previously stored data loaded from local storage")
      storage.update(storage.data)
    }
    loadSpreadsheetData()
  }
  
  return {
    init: init,
    storage: storage,
    update: storage.update
  }
}())