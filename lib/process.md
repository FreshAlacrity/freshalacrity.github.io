# FreshAlacrity on Github

## To Do Next
   - work on rewriting functions according to personal style and goals

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

## Known Issues:
   - short description
      - details

## Sub-Projects

## To Do

## Goals
### Formatting + Style
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
   Comment when there is an important thing to say, and if you do comment use the /* */ notation. Single line comments using // can be problematic if people minify your code without stripping comments and in general are less versatile.[^1]



### Stretch Goals


## References
   [^1]: [Javascript Best Practices - W3C Wiki](https://www.w3.org/wiki/JavaScript_best_practices)
