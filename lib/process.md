# FreshAlacrity on Github

## To Do Next
   - work on rewriting functions according to personal style and goals
   - write unit tests
### Known Issues:
   - short description
      - details

## Recent Changes:
   Notes:
      {short section names} are used to save space

   12/11/2020
      - added absValue to {math}
      - coding notes seperated into notes.md
      - backed up from CodePen
      - process.md created, changelog moved to process.md
      - added to {html}: $(x), $html
      - notes.md created
      - begin changelog

## To Do
  name space: alacrity
    can alias to 'a' in my personal projects
  ### Goals
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
