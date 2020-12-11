# Personal Javascript Library/Code Practices

## Sub-Projects
   [Sandbox](https://codepen.io/WanderingEnby/pen/QWKGBYQ?editors=1010)
   [Generating Notes and Sounds](https://codepen.io/WanderingEnby/pen/BaLQLpx)

## To Do
   Find better font for Atom (again)
   Sort misc notes (see bottom of document)
   [Install a linter](https://github.com/AtomLinter/linter-jshint)
   [Install Less](http://lesscss.org/)
   check the compatible syntax themes for language-markdown package
      via (https://atom.io/packages/language-markdown)
      minimal-syntax-dark (dark, high-contrast)
      pubster-syntax (dark, high-contrast)
      one-o-eight-syntax (various, medium-contrast)
   Get a Rasperry Pi 400 from Adafruit
      Out of stock; motification set

## Using
   [Atom](https://atom.io/)
      ALT + SPACE to maximize
      CTRL + COMMA to open settings
      CTRL + SHIFT + P to search commands
      CTRL + K, 1+ to collapse to a given level
      UI Theme: Atom Material
      Syntax Theme: One Dark
      Packages:
         language-markdown (:star:)
         local-history (:star:)
         sync-settings
            use CTRL + SHIFT + P and search backup to get commands
      Settings:
         - title bar hidden
         - show invisibles
         - turn off auto indent on paste
         - disable all autocomplete packages
         - turn off bracket-matcher in package "Autocomplete Brackets"
   [CodePen](https://codepen.io/)
   Windows
      Hard Refresh
         Windows + Chrome: hold down Ctrl and then press F5 on your keyboard
   [Linux Mint](https://linuxmint.com/)
   [Gravit Designer](https://designer.gravit.io/)

## Syntax and Style
   ### Overall Style Goals
      Concentrate on making the code easy to understand
      Format for folding neatly
         Ideally, the entire document should fit on one page when fully folded and so should each major section when unfolded
   ### General Tips & Tricks
      There should never be a comma after the last entry in a list of object keys, and the ending } should be at the same indent level as the declaration
            ```
            var object = {
               foo: "Hello",
               bar: "World"
            }
            ```
      Config objects example[^1]
         If you have this as a part of a module pattern and make it public you even allow implementers to only override what they need before initializing your module.
         ```
         /*
           This is the configuration of the player. Most likely you will
           never have to change anything here, but it is good to be able
           to, isn't it?
         */
         config = {
           CSS:{
             /*
               IDs used in the document. The script will get access to
               the different elements of the player with these IDs, so
               if you change them in the HTML below, make sure to also
               change the name here!
             */
             IDs:{
               container:'eytp-maincontainer',
               canvas:'eytp-playercanvas',
               player:'eytp-player',
               controls:'eytp-controls',

               volumeField:'eytp-volume',
               volumeBar:'eytp-volumebar',

               playerForm:'eytp-playerform',
               urlField:'eytp-url',

               sizeControl:'eytp-sizecontrol',

               searchField:'eytp-searchfield',
               searchForm:'eytp-search',
               searchOutput:'eytp-searchoutput'
               /*
                 Notice there should never be a comma after the last
                 entry in the list as otherwise MSIE will throw  a fit!
               */
             },
             /*
               These are the names of the CSS classes, the player adds
               dynamically to the volume bar in certain
               situations.
             */
             classes:{
               maxvolume:'maxed',
               disabled:'disabled'
               /*
                 Notice there should never be a comma after the last
                 entry in the list as otherwise MSIE will throw  a fit!
               */
             }
             ...
             ```
      DO NOT DO doWeDoIt = doWeDoIt || true
         this will always return true if doWeDoIt is a bool
         If the first value is falsey, it returns the second value.
         If the first value is truthy, it returns the first value.
         instead do this:
            `flagA = typeof flagA !== "undefined" ? flagA : true;`
         or this (ES6):
            ```
            function multiply(a, b = 1) {
               return a * b;
            }
            ```
   ### Functions
      Favor named functions and avoid anonymous ones for anything more than one line.[^2]
         Benefits:
            * The error messages and call stacks show more detailed information when using the function names
            * More comfortable debugging by reducing the number of anonymous stack names
            * The function name says what the function does
            * You can access the function inside its scope for recursive calls or detaching event listeners
      Test the type of parameters sent to your functions (using the typeof keyword)[^1]
         Arrays are tricky as they tell you they are objects. To ensure that they are arrays, check one of the methods only arrays have.
         Another very insecure practice is to read information from the DOM and use it without comparison. \[For example, using string which might inlcude\] quotation marks and single quotes. These would end any string and the remaining part would be erroneous data. In addition, any user changing the HTML using a tool like Firebug or Opera DragonFly could change the user name to anything and inject this data into your functions.
      Shorthand for creating functions as object methods:[^2]
         Advantages:
            Creates a named function, contrary to a function expression
            Syntax is easy to understand
         Example:
            ```
            const collection = {
              items: [],
              add(...items) {
                this.items.push(...items);
              },
              get(index) {
                return this.items[index];
              }
            };
            collection.add('C', 'Java', 'PHP');
            collection.get(1) // => 'Java'
            ```
         With computed property names (ES6):
            ```
            const addMethod = 'add',
              getMethod = 'get';
            const collection = {
              items: [],
              [addMethod](...items) {
                this.items.push(...items);
              },
              [getMethod](index) {
                return this.items[index];
              }
            };
            collection[addMethod]('C', 'Java', 'PHP');
            collection[getMethod](1) // => 'Java'
            ```
         Note: this is how the class syntax requires functions to be declared
            Example:
               ```
               class Star {
                  constructor(name) {
                     this.name = name;
                     }
                  getMessage(message) {
                     return this.name + message;
                     }
               }
               const sun = new Star('Sun');
               sun.getMessage(' is shining') // => 'Sun is shining'
               ```
      Short Callbacks
         ```
         const numbers = [1, 5, 10, 0];
         numbers.some(item => item === 0); // => true
         ```
      Functions can also be constructed:[^2]
         When Function is invoked as a constructor new Function(arg1, arg2, ..., argN, bodyString), a new function is created. The arguments arg1, args2, ..., argN passed to constructor become the parameter names for the new function and the last argument bodyString is used as the function body code.
         The functions created this way don’t have access to the current scope, thus closures cannot be created. They are always created in the global scope.
         One possible application of new Function is a better way to access the global object in a browser or NodeJS script:
            ```
            (function() {
               'use strict';
               const global = new Function('return this')();
               console.log(global === window); // => true
               console.log(this === window);   // => false
            })();
            ```
         Because the function body is evaluated on runtime, this approach inherits many eval() usage problems: security risks, harder debugging, no way to apply engine optimizations, no editor auto-complete.
      #### Generators
         Named example [^2]
            ```
            function* indexGenerator(){
              var index = 0;
              while(true) {
                yield index++;
              }
            }
            const g = indexGenerator();
            console.log(g.next().value); // => 0
            console.log(g.next().value); // => 1
            ```
         As variable [^2]
            ```
            const indexGenerator = function* () {
              let index = 0;
              while(true) {
                yield index++;
              }
            };
            const g = indexGenerator();
            console.log(g.next().value); // => 0
            console.log(g.next().value); // => 1
            ```
         As property/shorthand [^2]
            const obj = {
              *indexGenerator() {
                var index = 0;
                while(true) {
                  yield index++;
                }
              }
            }
            const g = obj.indexGenerator();
            console.log(g.next().value); // => 0
            console.log(g.next().value); // => 1
   ### This
         Arrow functions take the context lexically/use 'this' from the immediate outer scope). [^2]
            This is nice because you don’t have to use .bind(this) or store the context var self = this when a function needs the enclosing context.
            Example:
               ```
               class Numbers {
                 constructor(array) {
                   this.array = array;
                 }
                 addNumber(number) {
                   if (number !== undefined) {
                      this.array.push(number);
                   }
                   return (number) => {
                     console.log(this === numbersObject); // => true
                     this.array.push(number);
                   };
                 }
               }
               const numbersObject = new Numbers([]);
               const addMethod = numbersObject.addNumber();

               addMethod(1);
               addMethod(5);
               console.log(numbersObject.array); // => [1, 5]
               ```
         See also [^3]
   ### Wrapping/Libraries
      If you don’t need any of your variables or functions to be available to the outside, simply wrap the whole construct in another set of parentheses to execute it without assigning any name to it:[^1]
         ```
         (function(){
           var current = null;
           function init(){...}
           function change(){...}
           function verify(){...}
         })();
         ```
      Alternatively, you can use this method to wrap and reveal functions:[^1]
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
   ### Loops
      Through an array:
         Method 1: [^1]
            ```
            var names = ['George','Ringo','Paul','John'];
            for(var i = 0, j = names.length; i < j; i++){
              doSomeThingWith(names[i]);
            }
            ```
            Advantages: easy to read, relatively elegant, doesn't compute .length every iteration
   ### Minifying
      If statements[^1]
            ```
            var direction;
         if(x > 100){
           direction = 1;
         } else {
           direction = -1;
         }
         ```
         can be shortened to a single line:
         ```
         var direction = (x > 100) ? 1 : -1;
         ```
      `var x = v || 10;` will automatically give x a value of 10 if v is not defined — simple as that.[^1]
      create a configuration object that contains all the things that are likely to change over time. These include any text used in elements you create (including button values and alternative text for images), CSS class and ID names and general parameters of the interface you build.
   ### Comments
      Comment when there is an important thing to say, and if you do comment use the /* */ notation. Single line comments using // can be problematic if people minify your code without stripping comments and in general are less versatile.[^1]
      If you comment out parts of your code to be used at a later stage or to debug code there is a pretty sweet trick you can do:[^1]
         Adding a double slash before the closing star-slash sets your code up so that you can comment and uncomment the whole block by simply adding or removing a slash before the opening slash-star:
            ```
            module = function(){
              var current = null;
              function init(){
              };
            /*
              function show(){
                current = 1;
              };
              function hide(){
                show();
              };
            // */
              return{init:init,show:show,current:current}
            }();
            ```

## References
   [^1]: [Javascript Best Practices - W3C Wiki](https://www.w3.org/wiki/JavaScript_best_practices)
   [^2]: [6 Ways to Declare JavaScript Functions](https://dmitripavlutin.com/6-ways-to-declare-javascript-functions/)
   [^3]: [Gentle Explanation of "this" in JavaScript](https://dmitripavlutin.com/gentle-explanation-of-this-in-javascript/)

## Future Reading List
   [HTML DOM DragEvent](https://www.w3schools.com/jsref/obj_dragevent.asp)
   [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
   [Iterators and Generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Iterables)
   [Gentle Explanation of "this" in JavaScript](https://dmitripavlutin.com/gentle-explanation-of-this-in-javascript/)
      footnote registered as [^3]
   [What can we do with ES6 Generator that we cannot with for loop?](https://stackoverflow.com/questions/23613612/what-can-we-do-with-es6-generator-that-we-cannot-with-for-loop?rq=1)
   [Graceful degradation versus progressive enhancement - W3C](https://www.w3.org/wiki/Graceful_degradation_versus_progressive_enhancement)

## TO SORT...

this:
  In a method, this refers to the owner object.
  Alone, this refers to the global object.
  In a function, this refers to the global object.
  In a function, in strict mode, this is undefined.
  In an event, this refers to the element that received the event.
  Methods like call(), and apply() can refer this to any object.

_name -> don't edit this unless you're part of the object that has it

comma operator
(i => (f(i), i + 1))
is just a succinct way of writing
(i => { f(i); return i + 1 })

looping 10 times: (note that for many of these 'i' is a string, not an integer
const res = [...Array(10)].map((_, i) => {
  return i * 10;
});
// vs
const res = [...Array(10)].map((_, i) => i * 10);
// or
const res = Array.from(Array(10)).map((_, i) => i * 10);

if you don't need the result:
[...Array(10)].forEach((_, i) => {
  console.log(i);
});
// vs
[...Array(10)].forEach((_, i) => console.log(i));


// looping through objects:
for (let value of sampleArr) -> values
for (let index in sampleArr) -> indices and methods
   if (iterable.hasOwnProperty(index)) will filter out methods
// Because for...in loops loop over all enumerable properties, this means if you add any additional properties to the array's prototype, then those properties will also appear in the loop.

arrays only: sampleArr.forEach() - returns nothing;
    syntax: array.every(function(currentValue, index, arr), thisValue)
    see also:
      Array.prototype.every() - tests elements and returns true if all return true
      Array.prototype.some()
      Array.prototype.find()
      Array.prototype.findIndex()

for (keys in sampleObj) -> keys
for (const [key, value] of Object.entries(sampleObj)) {
  console.log(`Key ${key} and Value ${value}`)
}
// Object.entries() method returns an array of a given object's own enumerable string-keyed property [key, value] pairs, in the same order as that provided by a for...in


while (index < array.length) {
    console.log(array[index]);
    index++;
    }

myArray.map(myFunction, thisToUse);
function myFunction(item, index, arr) {
  // this == thisToUse
  // arr == myArray
  }


// checks if all elements in an array pass a test (provided as a function):
const under_five = x => x < 5;
if (array.every(under_five)) {
    console.log('All are less than 5');
}


// arrow function declaration:
let plusOne = a => a + 1;

printMe(((a) => (a + "World!"))("Hello "));
  or even
    let a = "Hello "
    let b = "World!"
    printMe((() => a + b)());
  when using => and returning an object, wrap with ()
  ex: const recur = (...args) => ({ type: recur, args })

const dict = {  key: function(){ return actualValue }},  }
return coords.map((value, index) => value + offset[index]);


// unpacking:

let a, b, rest;
[a, b] = [10, 20];
[a, b, ...rest] = [10, 20, 30, 40, 50];
// and now rest = [30,40,50]

// also unpacking:

function A(input1, input2){
  console.log(input1 + " and " + input2)
}
function B(){ return ["foo", "bar"] }
console.log(A(...B()))

regex fanciness:
return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string


// example vibrations for mobile devices
navigator.vibrate(200), a short buzz indicating the action went fine
navigator.vibrate(2000), a long buzz indicating there was some sort of error
navigator.vibrate([300, 300, 300]), 3 short buzzes indicating a task is completed

*/

// wishlist
/*
- function that will do for Javascript what 'for key in dict' does in Python?
*/

// todo
// - add unit tests for all functions where possible, using diagnostics section
// - have the unit tests run only when the library is loaded as it's own page and output to the visible page below, if possible (be aware that any code executing here will also execute when the .js file is loaded)
// maybe have a button in the html that displays test results?
// add one line comments just inside function summarizing what they do
// later, add documentation of this type (above each function declaration):
 /**
 * Take a list of names seperated by spaces as input and return initials.
 * @function functionName
 * @param  {[type]} foo [description]
 * @param  {String} name  Space Delimited sequence of names.
 * @return {String}       Properly formatted initials.
 */
