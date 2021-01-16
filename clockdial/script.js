/* jshint esversion: 6 */
/* jshint undef: true */
/* globals alacrity, luxon, window, document, $, setInterval, setTimeout */
/* globals alert, nested */
/*
- import all the wheel of the year data and functions
- get all those working together neatly and taking an array of bound functions to draw consecutive patterns
- go all the way from the year wheel to two-minute and three-minute timers with little progress circles

- for year show location + travel information
- for month show lunar cycle, therapy + shot days/all-day calendar events
- for day show calendar appointments inc. wake/sleep
- for 12 hours show current time, rotate others to match
- 6 hour timer
- 1 hour timer
- 20 minute timer
- center: click to change number of minutes for custom timer
*/

let DateTime = luxon.DateTime;

$("test").innerHTML = nested();
