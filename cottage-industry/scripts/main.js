// #todo figure out where to find last modified date for whole pack (last push?)
// #later add recent changes from changelog
// #later load in readme contents from` - https://raw.githubusercontent.com/FreshAlacrity/cottage-industry/main/README.md
// #later add support for pushing updates back to the sheet
// convert dates to a nice format
// #later set the data fetch and merge function to run each time the repo gets a push + after changelog is made
// #later support for viewing previous release versions
// add index number so addon entries can be sorted the same anywhere
// support for making columns from the spreadsheet _internal properties
// fold in formatting from 
// tag for new in this version
// tag for open source
// stretch goal: include config file locations
// stretch goal: pull in issues and append related issues to the appropriate mod listings
// stretch goal: some way to update the exported data when the spreadsheet changes

var reloadAllData = false

gatherData(reloadAllData).then(data => display(data))

