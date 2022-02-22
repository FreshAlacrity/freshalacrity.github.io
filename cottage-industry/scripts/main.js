// #next figure out how to get this list into a usable/useful/publishable state
//    1. fold in formatting from codepen
//    2. sort order - alphabetical within the category
//    3. sort the categories

/*
// tag for new in this version
// tag for open source
// convert dates to a nice format
// #later figure out where to find last modified date for whole pack (last push?)
// #later add recent changes from changelog
// #later load in readme contents from` - https://raw.githubusercontent.com/FreshAlacrity/cottage-industry/main/README.md
// #later add support for pushing updates back to the sheet
// #later set the data fetch and merge function to run each time the repo gets a push + after changelog is made
// #later support for viewing previous release versions
// support for spreadsheet columns with _internal property values
// cute brackety images/decorative webdings for before and after the link images? (maybe an MC style chain attached to a vertical bar?)
// include license info in general and shiny emoji/comment for open source licenses
// stretch goal: include config file locations
// stretch goal: pull in issues and append related issues to the appropriate mod listings
// stretch goal: some way to update the exported data when the spreadsheet changes

    Notes
// jump-to links don't appear to be supported in CurseForge descriptions - sad
*/

var links = {
  Planning_Spreadsheet: 'https://docs.google.com/spreadsheets/d/1MNArZYOw71WiJqb6-LdFV4QfBXVaWCjCc2xgWQWzSKI/edit#gid=1088147862',
  Github_Repository: 'https://github.com/FreshAlacrity/cottage-industry',
  CurseForge: 'https://www.curseforge.com/minecraft/modpacks/cottage-industry'
}

var reloadAllData = false
var bongoTypes = ['Advancement','Item','Entity']
gatherData(reloadAllData).then(data => display(data))

