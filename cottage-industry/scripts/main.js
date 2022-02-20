/* To Do
- merge spreadsheet data into one sheet's worth by matching namespaces
- import bongo data
- get the data manager working as properly async/refactor that
// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function


// where to find last modified date for whole pack?
// later: support for viewing previous release versions
// pull in details from the spreadsheet also, a la https://codepen.io/eahartmann/pen/MWOEEyO
// tag for open source
// convert dates to a nice format
// tag for new in this version
// stretch goal: include config file locations
// grab advancement, item, and entity stats from bongo dump

// todo: add recent changes from changelog
// todo: load in readme contents from` - https://raw.githubusercontent.com/FreshAlacrity/cottage-industry/main/README.md

*/

var reloadAllData = false

gatherData(reloadAllData).then(data => display(data))