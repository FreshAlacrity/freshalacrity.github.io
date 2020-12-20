# FreshAlacrity Mini Library

### Known Issues
  - copypasta from Stack Overflow etc. could use source links
  - a lot of the svg functions were made with positive-y-is-up in mind, so they may have odd behavior (but after a quick review they should work fine as long as I remember circles will 'start' at the bottom

## Recent Changes
  Dec 17, 2020
    - removed getFuncName()
    - added typeCheck() and subordinate functions
    - sideReduceToSum() removed due to misleading name and only one use case
      - replace with mapReduce() and getEachPair()
    - fixed issue with lengthFromPoints() that was causing unit test failure
    - added add()
    - archived addDays()
    - typeCheck() now throws errors to make tracking back issues easier
  Dec 16, 2020
    - refactored all angle and circle drawing functions
    - added runUnitTests() and condensed all unit testing into one block
    - various other small refactors
    - added pairwise() and getEachPair()
  Dec 14, 2020
    - all functions moved to alacrity namespace
    - rewrite for smooshObjects() and fix()
    - documentation added for several functions
    - tests added for fix()
  Dec 12, 2020
    - rewrite for test() function
    - documentation added for test() function
    - simple tests added for test() and getFuncName()
    - documentation for getFreqFromNote() and a console log if an invalid input for @param a4 is received
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
  make a more informative 'loaded' message that includes a version number
  check for @todo in code
  add support when mapping through tests to make section headers that are just strings
  replace where I check if parameters are undefined with = in params
  for svgs: For reliable results cross-browser, use numbers with no more than 2 digits after the decimal and four digits before it.
  v1.js
    - do the actual JSDoc thing/generate the reference website
    - add function descriptions
      - in the style of [JSDoc](https://jsdoc.app/tags-param.html#examples)
        - include:
          - {@link namepathOrURL link text} to source
          - what it returns if something unexpected happens
          - make note of functions that could use input validation/expected upcoming changes with @todo
    - **add unit tests**
        - add a display of test results at the bottom of the page when the a/index.html page is loaded
          - have the unit tests run only when the library is loaded as it's own page and output to the visible page below, if possible (be aware that any code executing here will also execute when the .js file is loaded)
        -  write a function to test the random functions by generating a bunch of them and seeing if the distrobution is decent? hmmm...
    - **add input validation**
      - make a seperate function for this to keep it tidy
        - pass in complicated stuff as strings with spaces?
          - so like, 'array of array of number'
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
  read through suggested reading from [Principles of Writing Consistent, Idiomatic JavaScript](https://github.com/rwaldron/idiomatic.js):
    - [Baseline For Front End Developers: 2015](http://rmurphey.com/blog/2015/03/23/a-baseline-for-front-end-developers-2015/)
    - [Eloquent JavaScript](http://eloquentjavascript.net/)
    - [JavaScript, JavaScript](http://javascriptweblog.wordpress.com/)
    - [Adventures in JavaScript Development](http://rmurphey.com/)
    - [Perfection Kills](http://perfectionkills.com/)
    - [Douglas Crockford's Wrrrld Wide Web](http://www.crockford.com/)
    - [JS Assessment](https://github.com/rmurphey/js-assessment)
  later
    check for @later in code
    offer a minified version?
      try https://javascript-minifier.com/
  ### Wishlist
    - stringMatchQuality()
      to complement LevenshteinMatchQuality()
      returns a value between 0 and 1 where 1 is the strings are identical and 0 is the string does not contain the search term and .5 is the search term accounts for half the character length of the string
    - listByKey()
      - take an array of objects and a key and turn it into an dictionary of arrays with the keys of the new dictionary being all the values of that key in the original array of objects and their values being arrays of all the original objects which have that value
        - default to puting things with multiple entries at the ends of their respective lists?
        - will this work well to give me search results sorted by type?
          - make it so that if foo has arrays as values, it sorts them into the new key arrays in multiple places
          - make sure that value is first converted into a string so there aren't issues down the road with numbers and such
        - example input: `[{foo:["a","b"],"bar:"c"},{foo:"a","bar:"b"},{foo:"b",bar:"c"}],"foo"`
        - expected output:
          `{"a":[{foo:"a","bar:"b"},{foo:["a","b"],"bar:"c"}],"b":[{foo:"b",bar:"c"},{foo:["a","b"],"bar:"c"}]}`
    - margeDown() takes listByKey() object plus a list of values to merge, keeps the arrays largely intact but merged elements, merges them and gives them
    - makeEntry() takes listByKey() objects and turns them into something makeElement() can work with...or just straight up html?
      - will need as input:
        - what order to put the things in,
        - ex `makeEntry(dictionary, word, ["Word",["Part of Speech","Origin","Meaning"],"Etymology","Note","Source","Source Link"])`
          - grab the keys lowercased?
        - another function to add html around these? maybe a template of some sort? what about using the `${varhere}` kinda strings?
        - how can I make this play nicely with makeElement?
        - if the template isn't specified, grab that from the dictionary itself?
          - seems like a good way to do it/have default or even several named entry templates/output formats
    - Search Functions:
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

  ### Goals
    Formatting + Style
      Whitespace
        No end of line whitespace
        No blank line whitespace
      Comments
        Comment when there is an important thing to say, and if you do comment use the /* */ notation, above the line of code it refers to.
          Single line comments using // can be problematic if people minify your code without stripping comments and in general are less versatile.[^1]
        No end-line comments in final code. `//shit like this`
        Document each function with /** */ or multiline JSDoc-compliant comments.
        When possible, use descriptive variable/function names instead.
        **Explain why, not how.**
      Quotation Marks
        Single quotation marks wherever possible in js, double inside HTML
      Type Checking
        typeof variable === 'type'
        Array.isArray( arrayLikeObject )
        Properties
          object.prop === undefined
            or
          "prop" in object
        Type Conversion
          Prefer `===` over `==` (unless the case requires loose type evaluation)
          string to number
            `+"1" === 1 // true`
            unary + operator will convert its right side operand to a number
              ```
              let string = "1"
              +string === 1
              +string++ === 1
              string === 2

              let bool = false;
              +bool === 0

              (bool + "") === "false"
              ```
          convert boolean binary digit as string back to bool
            `true === !!"1"; // true`
            ...but this is a little bit too clever
          float to int
            `~~num;`
            `num >> 0;`
            - both work for negative and positive, essentially shaving off the decimal value
          Array + String Length
            `if ( array.length ) //instead of if ( array.length > 0 )`
            `if ( !array.length ) //instead of if ( array.length === 0 )`
            `if ( string ) // instead of if ( string !== "" )`
            `if ( !string ) // instead of if ( string === "" )`
            `if ( foo == null ) //instead of if ( foo === null || foo === undefined )`
      Naming
        ```
        functionNamesLikeThis;
        variableNamesLikeThis;
        ConstructorNamesLikeThis;
        EnumNamesLikeThis;
        methodNamesLikeThis;
        SYMBOLIC_CONSTANTS_LIKE_THIS;
        ```


      Other
        Document what functions other functions require
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
          This will allow me to track dependencies and easily alias functions for backwards compatibility
      Distribution
        Make it easy to load/download the library from my GitHub site
          Offer minified version?

## References
  [^1]: [Javascript Best Practices - W3C Wiki](https://www.w3.org/wiki/JavaScript_best_practices)
  ### Sub-Projects
    [JSDoc style documentation](https://jsdoc.app/tags-version.html)
