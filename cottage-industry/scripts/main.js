// #next figure out how to get this list into a usable/useful/publishable state
//    fold in formatting from codepen
//    sort order - alphabetical within the category
// #todo figure out where to find last modified date for whole pack (last push?)
// #later add recent changes from changelog
// #later load in readme contents from` - https://raw.githubusercontent.com/FreshAlacrity/cottage-industry/main/README.md
// #later add support for pushing updates back to the sheet
// convert dates to a nice format
// #later set the data fetch and merge function to run each time the repo gets a push + after changelog is made
// #later support for viewing previous release versions
// support for spreadsheet columns with _internal property values
// tag for new in this version
// tag for open source
// stretch goal: include config file locations
// stretch goal: pull in issues and append related issues to the appropriate mod listings
// stretch goal: some way to update the exported data when the spreadsheet changes

var reloadAllData = false
let bongoTypes = ['Advancement','Item','Entity']
gatherData(reloadAllData).then(data => display(data))

