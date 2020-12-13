# FreshAlacrity Mini Library

### Known Issues:
   - not all functions have been moved to alacrity namespace
      - currently WIP as of Dec 12, 2020
    - recursion functions may break, need rewrite
    - copypasta from Stack Overflow could use source links

## Recent Changes:
  Dec 12, 2020
    - rewrite for test() function
    - documentation added for test() function
    - simple tests added for test() and getFuncName()
  Dec 11, 2020
    - added absValue to {math}
    - coding notes seperated into notes.md
    - backed up from CodePen
    - process.md created, changelog moved to process.md
    - added to {html}: $(x), $html
    - notes.md created
    - begin changelog
  Notes:
    {short section names} are used to save space

## To Do
  v1.js
    - move to name space 'alacrity'
    - add function descriptions
      - in the style of [JSDoc](https://jsdoc.app/tags-param.html#examples)
        - include:
          - {@link namepathOrURL|link text} to source
          - what it returns if something unexpected happens
          - make note of functions that could use input validation/expected upcoming changes with @todo
    - **add unit tests**
        - add a display of test results at the bottom of the page when the a/index.html page is loaded
          - have the unit tests run only when the library is loaded as it's own page and output to the visible page below, if possible (be aware that any code executing here will also execute when the .js file is loaded)
    - work on rewriting functions according to personal style and goals
      - clarity, best practices
      - all dates should be Month, Day Year
    - work on getting line lengths more reasonable, <500 chars
  v1.html
    - add copypasta html for loading the library at top of webpage
      - inc alias to 'a' for my personal projects?
    - include process.md and put both in collapsing sections
    - also give copypasta for including the library at the top of the page
      - both lastest unstable version + current stable version when applicable

  ### Wishlist
    - stringMatchQuality(){
        // to complement LevenshteinMatchQuality
      }
    - listByKeys()
      - take an array of objects and a key and turn it into an dictionary of arrays with the keys of the new dictionary being all the values of that key in the original array of objects and their values being arrays of all the original objects which have that value
        - option to put things with multiple entries at the ends of their respective lists?
        - will this work well to give me search results sorted by type?
          - make it so that if foo has arrays as values, it sorts them into the new key arrays in multiple places
            - example input: `[{foo:"a","bar:"b"},{foo:["a","b"],"bar:"c"},{foo:"b",bar:"c"}],"foo"`
            - expected output:
              `{"a":[{foo:"a","bar:"b"},{foo:["a","b"],"bar:"c"}],"b":[{foo:"a","bar:"b"},{foo:"b",bar:"c"}]}` or perhaps `{"a":[{foo:"a","bar:"b"},{foo:["a","b"],"bar:"c"}],"b":[{foo:"b",bar:"c"},{foo:"a","bar:"b"}]}`
    - addArrayHeader()
      - uses unshift()
      - makes a header element template object to be inserted when grouping each key group back together with the title as the text for the header
      - input a template object and the property name to insert the key name as
    - unlistByKeys()
      - some way to take a listByKeys object and then map back to an array but sorted in a specific way/with duplicates intact
      - bool to drop or group items that aren't in the key sort order
      - seperator to be inserted between groups with addArrayHeader
      - or just do this by .join and map?
      - case 1
        - example input: `{"a":[{foo:"a","bar:"b"},{foo:["a","b"],"bar:"c"}],"b":[{foo:"a","bar:"b"},{foo:"b",bar:"c"}]}, ["a"], true`
        - expected output: `[{foo:"a","bar:"b"},{foo:["a","b"],"bar:"c"}]`
      - case 2
        - example input: `{"a":[{foo:"a","bar:"b"},{foo:["a","b"],"bar:"c"}],"b":[{foo:"a","bar:"b"},{foo:"b",bar:"c"}]}, ["a"]`
        - expected output: `[{foo:"a","bar:"b"},{foo:["a","b"],"bar:"c"},{foo:"a","bar:"b"},{foo:["a","b"],"bar:"c"}]`
    - sortByKey()
      - uses listByKeys() and unlistByKeys() and just does it by default sort order, so alphabetical and/or numeric
      - can take a header object and property name for addArrayHeader()
    - smoosh() update
      - from here: [python dict.update() equivalent in javascript](https://stackoverflow.com/questions/48747589/python-dict-update-equivalent-in-javascript)
        - `Object.assign(target, source);` seems like the best choice
    - sort() input function that attempts to convert strings to numbers
      - see https://www.w3schools.com/jsref/jsref_sort.asp

  ### Goals
    Search Functions:
      - search results as an array of objects with the dictionary name, key name, plus a dictionary with all the keys of the searched object and how well they matched
      - Store all past search *terms* and store locally *results* for most common and most recent searches
      - Allow limiting and ordering search results by specific keys and values
        - so like only get materials that are botanical and from the wandering library
        - a la `~by Category` `~by Category [botanical, mineral, other]` (but not metal or organic)
      - work on functions that allow me to get search results organized neatly by how well they match the search term or by a property (say, part of speech) in neat groups
        - for word-cloud type results where the X best matches go on the first line and the second Y matches go on the second line etc
          - ideally of a size where the line width is the same when using a monospace font like STL...some way to track line width?
          - maybe work on a function I can use to just put in an array of tokipona words/phrases and have them formatted this way
        - for search results grouped by part of speech or type of resource (say, botanical vs mineral or video vs article)
    Formatting + Style
       Use this method to wrap and reveal functions:[^1]
          ```
          myNameSpace = function(){
            var current = null;
            function init(){...}
            function change(){...}
            function verify(){...}
            return{
              init:init,
              set:change
            }
          }();
          ```
          myNameSpace.set() invokes the change() method
          this will allow me to track dependencies and easily alias functions for backwards compatibility
       Comment when there is an important thing to say, and if you do comment use the /* */ notation. Single line comments using // can be problematic if people minify your code without stripping comments and in general are less versatile.[^1]
    Stretch Goals
      make it easy to load this library and the STL draw functions etc at the same time by making mini versions of the library to go in those repos for when other people download them...can I generate those with Python?
        like, input a comma delimited list of function names and have it make a little mini library with those and their dependencies

## References
  [^1]: [Javascript Best Practices - W3C Wiki](https://www.w3.org/wiki/JavaScript_best_practices)
  ### Sub-Projects
    [JSDoc style documentation](https://jsdoc.app/tags-version.html)
