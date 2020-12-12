# Personal Python Code Practices/Notes
  When otherwise not indicated, notes come from IT 140: Introduction to Scripting v3 at SNHU 20EW2 textbook module in zyBooks:
    Fundamental Programming Concepts and
    Programming in Python 3
    Authors
      Frank Vahid / Professor of Computer Science and Engineering / Univ. of California, Riverside
      Roman Lysecky / Professor of Electrical and Computer Engineering / Univ. of Arizona
    Contributors
      Alex Edgcomb / Senior Software Developer / zyBooks
      Arián Jiménez / Software Developer / zyBooks
      Susan Lysecky / Senior Content Developer / zyBooks
      Evan Olds/ Content Developer / zyBooks
      Nkenge Wheatland / Content Developer / zyBooks

## Todo
  * ZyBooks
  * Assignments
     * 6-4 Milestone: Moving Between Rooms
  * No Discussion
  * Organize this document
  ### Project One + Project Two
    * You will develop all of your code in one Python (PY) file, titled “TextBasedGame.py.”
       * include a comment at the top with your full name.
    * The directions include sample code from the dragon-themed game. Be sure to modify any sample code so that it fits the theme of your game.
       * The human is the villain and you’re a dragon trying to collect your treasure
    * Your function or functions should do the following:
       * Show the player the different commands they can enter (such as “go North”, “go West”, and “get [item Name]”).
       * Show the player’s status by identifying the room they are currently in, showing a list of their inventory of items, and displaying the item in their current room.
    * https://learn.snhu.edu/d2l/le/content/567313/viewContent/11054275/View

## Pseudocode
  * “good” pseudocode:
     * uses natural language
     * starts at the beginning
     * clarifies what input, processing, and output are expected
     * capitalizes keywords
     * nested portions are indented
     * clear and complete
     * establishes the logic of the code
     * shows how the requirements are met
     * includes variable names
     * can later be used as comments
## Flowcharts
  https://www.lucidchart.com/pages/what-is-a-flowchart-tutorial#section_3
## PyCharm
  * Getting started with PyCharm: https://learn.snhu.edu/content/enforced/567313-IT-140-T2178-OL-TRAD-UG.20EW2/course_documents/IT%20140%20Getting%20Started%20With%20PyCharm.pdf
     * (installation instructions - completed)
  * Tutorial video: Pycharm Tutorial #1 - Setup & Basics
  * Transcript (downloaded, word document): https://learn.snhu.edu/content/enforced/567313-IT-140-T2178-OL-TRAD-UG.20EW2/course_documents/IT%20140%20Pycharm%20Tutorial%201%20Setup%20and%20Basics%20Transcript.docx?_&d2lSessionVal=7BTNYkV9P4UMrWNN6toginLm0&ou=567313
  * Using PyCharm is straightforward if you understand that you need to create a project and then create a PY file. After that, you can type the Python code in the PY file and click the green arrow to run it. The command line output will be displayed in the IDE.
  * Setup and Basics: https://www.youtube.com/watch?v=56bPIGf4us0
  * Create and Run your first Python project: https://www.jetbrains.com/help/pycharm/creating-and-running-your-first-python-project.html
## Styling/Code Format
  ### Basic Formatting
     * Variable names: like_so
     * Many editors consider a tab to be equivalent to either 3 or 4 spaces, while in Python a tab is equivalent only to another tab. A program that mixes tabs and space to indent code blocks will automatically generate an IndentationError from the interpreter in Python 3
     * Good practice is to restrict usage of conditional expressions to an assignment statement, as in: y = 5 if (x == 2) else 9*x. Some Python programmers denounce conditional expressions as difficult to read and comprehend, since the middle operand is actually the first evaluated, and left-to-right syntax is preferred. However, simple assignments such as the statement above are acceptable.
  ### Order of operations:
     * ( )
     * * / % + -
     * <   <=   >   >=   ==   != in
     * not
     * and
     * or
  ### Comparisons
     * The in and not in operators, known as membership operators, yield True or False if the left operand matches the value of some element in the right operand, which is always a container.
        * Membership operators can be used to check whether a string is a substring, or matching subset of characters, of a larger string. For example, 'abc' in '123abcd' returns True because the substring abc exists in the larger string.
        * Membership in a dictionary implies that a specific key exists in the dictionary. A common error is to assume that a membership operator checks the values of each dictionary key as well.
     * Comparisons that make no sense, such as 1 < 'abc' result in a TypeError
     * Lists and tuples are compared via an ordered comparison of every element in the sequence.
     * Dictionaries are compared by sorting the keys and values of each dictionary and then comparing them as lists.
     * True and False are keywords in Python and must be capitalized
  ### Sequences (lists + strings):
     * len(list)        Find the length of the list.
     * list1 + list2        Produce a new list by concatenating list2 to the end of list1
     * min(list)        Find the element in list with the smallest value
     * max(list)        Find the element in list with the largest value
     * sum(list)        Find the sum of all elements of a list (numbers only)
     * list.index(val)        Find the index of the first element in list whose value matches val
     * list.count(val)        Count the number of occurrences of the value val in list
     * lists are basically arrays
     * can do print(array) and it puts it like a variable declaration
     * must be fetched and assigned using an integer, not a float (not even a whole number float)
     * Adding elements to a list:
        * list.append(value): Adds value to the end of list. Ex: my_list.append('abc')
     * Removing elements from a list:
        * list.pop(i): Removes the element at index i from list. Ex: my_list.pop(1)
        * list.remove(v): Removes the first element whose value is v. Ex: my_list.remove('abc')
  ### Tuples
     * A tuple, usually pronounced "tuhple" or "toople", behaves similar to a list but is immutable – once created the tuple's elements cannot be changed
     * Named tuples
        * A program commonly captures collections of data; for example, a car could be described using a series of variables describing the make, model, retail price, horsepower, and number of seats. A named tuple allows the programmer to define a new simple data type that consists of named attributes. A Car named tuple with fields like Car.price and Car.horsepower would more clearly represent a car object than a list with index positions correlating to some attributes.
        * The namedtuple package must be imported to create a new named tuple.
          ```
          from collections import namedtuple

          Car = namedtuple('Car', ['make','model','price','horsepower','seats'])  # Create the named tuple

          chevy_blazer = Car('Chevrolet', 'Blazer', 32000, 275, 8)  # Use the named tuple to describe a car
          chevy_impala = Car('Chevrolet', 'Impala', 37495, 305, 5)  # Use the named tuple to describe a different car

          print(chevy_blazer)
          print(chevy_impala)

          Car(make='Chevrolet', model='Blazer', price=32000, horsepower=275, seats=8)
          Car(make='Chevrolet', model='Impala', price=37495, horsepower=305, seats=5)
          ```
        * Once the package is imported, the named tuple should be created like in the example below, where the name and attribute names of the named tuple are provided as arguments to the namedtuple constructor. Note that the fields to include in the named tuple are found in a list, but may also be a single string with space or comma separated values.
  ### Strings + Lists
     * len() built-in function can be used to find the length of a string (and any other sequence type).
     * see also list comprehension snippet below; prefer this to map() using lambdas
        * Note that list comprehension is not an exact replacement of for loops, because list comprehensions create a new list object, whereas the typical for loop is able to modify an existing list.
     * A common error when modifying a list during iteration is to update the loop variable instead of the list object
     * list('abc') creates a new list with the elements ['a', 'b', 'c'].
     * A programmer can access a character at a specific index by appending brackets [ ] containing the index (so like variable_name[2]); negative indices can be used to access characters starting from the rightmost character of the string, instead of the leftmost
     * A string literal is a string value specified in the source code of a program
     * Quick ref:
        * a1s = a4.count("today") => print ("There are " + str(a1s) + " occurrences of the word 'today'.")
        * a3s = a3.capitalize() => print ("The string of '" + a3 + "' with the first letter capitalized is '" + a3s + "'.")
        * a1n = a1.isalnum() => bool
        * my_list1 + my_list2 => new list containing both lists in order
        * my_list[len(my_list):] = [x] => appends all elements in X to the list; generally use append() instead
        * del my_list[i] => delete an element
     * List methods:
        * Adding elements
           * list.append(x)        Add an item to the end of list.
           * list.extend([x])        Add all items in [x] to list.
           * list.insert(i, x)        Insert x into list before position i.
        * Removing elements
           * list.remove(x)        Remove first item from list with value x.
              * doesn’t seem to throw an error of a value of x is not found?
           * list.pop()        Remove and return last item in list.
           * list.pop(i)        Remove and return item at position i in list.
        * Modifying elements
           * list.sort()        Sort the items of list in-place.
              * The sort() method performs in-place modification of a list. Following execution of the statement my_list.sort(), the contents of my_list are rearranged. The sorted() built-in function provides the same sorting functionality as the list.sort() method, however, sorted() creates and returns a new list instead of modifying an existing list.
              * Both the list.sort() method and the built-in sorted() function have an optional key argument. The key specifies a function to be applied to each element prior to being compared. Examples of key functions are the string methods str.lower, str.upper, or str.capitalize.
              * Sorting also supports the reverse argument. The reverse argument can be set to a Boolean value, either True or False. Setting reverse=True flips the sorting from lower-to-highest to highest-to-lowest. Thus, the statement sorted([15, 20, 25], reverse=True) produces a list with the elements [25, 20, 15].
           * list.reverse()        Reverse the elements of list in-place.
        * Miscellaneous
           * list.index(x)        Return index of first item in list with value x.
           * list.count(x)        Count the number of times value x is in list.
     * Built-in Functions
        * all(list)                True if every element in list is True (!= 0), or if the list is empty.
        * any(list)        True if any element in the list is True.
        * max(list)        Get the maximum element in the list.
        * min(list)        Get the minimum element in the list.
        * sum(list)        Get the sum of all elements in the list.
     * Good practice is to use single quotes for shorter strings and double quotes for more complicated text or text that contains single quotes (such as print("Don't eat that!")).
     * the string format() function allows a programmer to create a string with placeholders that are replaced by values or variable values at execution. A placeholder surrounded by curly braces { } is called a replacement field. Values inside the format() parentheses are inserted into the replacement fields in the string.
        * to unpack a tuple for use in the string, like if it’s the output of a function, use ‘str’.format(*tuple_name)
        * print('  burritos cost $  '.format(      ,       ))
        * Table 2.7.1: Three ways to format strings.
        * Positional replacement
           * 'The {1} in the {0} is {2}.'.format('hat', 'cat', 'fat')
           * The cat in the hat is fat.
        * Inferred positional replacement
           * 'The {} in the {} is {}.'.format('cat', 'hat', 'fat')
           * The cat in the hat is fat.
        * Named replacement
           * 'The {animal} in the {headwear} is {shape}.'.format(animal='cat', headwear='hat', shape='fat')
           * The cat in the hat is fat.
        * Double braces {{ }} can be used to place an actual curly brace into a string. Ex: '{0} {{Bezos}}'.format('Amazon') produces the string "Amazon {Bezos}".
        * Good practice is to use named replacement when formatting strings with many replacement fields to make the code more readable.
        * Slice notation has the form my_str[start:end], which creates a new string whose value mirrors the characters of my_str from indices start to end - 1. If my_str is 'Boggle', then my_str[0:3] yields string 'Bog'. Other sequence types like lists and tuples also support slice notation.
           * The last character of the slice is one location before the specified end.
           * To retrieve the last character, an end index greater than the length of the string can be used.
           * Negative numbers can be used to specify an index relative to the end of the string. Ex: If the variable my_str is 'Jane Doe!?', then my_str[0:-2] yields 'Jane Doe' because the -2 refers to the second-to-last character '!' (and the character at the end index is not included in the result string).
           * The Python interpreter creates a new string object for the slice. Thus, creating a slice of the string variable my_str, and then changing the value of my_str, does not also change the value of the slice.
           * A programmer often wants to read all characters that occur before or after some index in the string. Omitting a start index, such as in my_str[:end] yields the characters from indices 0 to end-1
           * Similarly, omitting the end index yields the characters from the start index to the end of the string. Ex: my_str[5:] yields all characters at and after index 5.
           * Specifying a start index beyond the end of the string, or beyond the end index (like 3:2), yields an empty string. Ex: my_str[2:1] is ' '. Specifying an end index beyond the end of the string is equivalent to specifying the end of the string, so if a string's end is 5, then 1:7 or 1:99 are the same as 1:6.
              ```
              my_str = 'http://reddit.com/r/python'
              protocol = 'http://'
              print(my_str[len(protocol):])
              ```
           * Slice notation also provides for a third argument, known as the stride. The stride determines how much to increment the index after reading each element. For example, my_str[0:10:2] reads every other element between 0 and 10. The stride defaults to 1 if not specified.
         ## String formatting
            Table
              Type | Description |
              Example |  Output
              --
              s |  String (default presentation type - can be omitted)
              '{:s}'.format('Aiden')
              --
              Aiden |  d
              Decimal (integer values only)
              '{:d}'.format(4)
              --
              4 | b
              Binary (integer values only)
              '{:b}'.format(4)
              --
              100 |  x, X
              Hexadecimal in lowercase (x) and uppercase (X) (integer values only)
              '{:x}'.format(15)
              --
              f  | e
              Exponent notation
              '{:e}'.format(44)
              --
              4.400000e+0  | f
              Fixed-point notation (6 places of precision)
              '{:f}'.format(4)
              --
              4.000000 | .[precision]f
              Fixed-point notation (programmer-defined precision)
              '{:.2f}'.format(4) | 4.00
       * A field width is defined in a format specification by including an integer after the colon, as in {name:16} to specify a width of 16 characters. Numbers will be right-aligned within the width by default, whereas most other types like strings will be left-aligned.
     * Alignment is set in a format specification by adding a special character before the field width integer. The basic set of possible alignment options include left-aligned '<', right-aligned '>' and centered '^'.
     * The fill character is used to pad a replacement field when the string being inserted is smaller than the field width. The default fill character is an empty space ' '. A programmer may define a different fill character in a format specification by placing the different fill character before the alignment character. Ex: {score:0>4} generates "0009" if score is 9 or "0250" if score is 250.
     * The precision follows the field width component in the format specification, if a width is specified at all, and starts with a period character. Ex:  '{:.1f}'.format(1.725) indicates a precision of 1, thus the resulting string would be '1.7'.
     * If the specified precision is greater than the number of digits available, trailing 0s are appended. Ex: '{:.3f}'.format(1.5) results in the string '1.500'. If the specified precision is less than the existing precision in the given number, then the number is rounded. Ex: '{:.2f}'.format(1.666) results in the string '1.67'.
     * replace(old, new) -- Returns a copy of the string with all occurrences of the substring old replaced by the string new. The old and new arguments may be string variables or string literals.
     * replace(old, new, count) -- Same as above, except only replaces the first count occurrences of old.
     * find(x) -- Returns the index of the first occurrence of item x in the string, else returns -1. x may be a string variable or string literal. Recall that in a string, the index of the first character is 0, not 1. If my_str is 'Boo Hoo!':
     * my_str.find('!')  # Returns 7
     * my_str.find('Boo')  # Returns 0
     * my_str.find('oo')  # Returns 1 (first occurrence only)
     * find(x, start) -- Same as find(x), but begins the search at index start:
     * my_str.find('oo', 2)  # Returns 5
     * find(x, start, end) -- Same as find(x, start), but stops the search at index end-1
     * my_str.find('oo', 2, 4)  # Returns -1 (not found)
     * rfind(x) -- Same as find(x) but searches the string in reverse, returning the last occurrence in the string.
     * count(x) -- Returns the number of times x occurs in the string.
     * my_str.count('oo')  # Returns 2
     * Note that methods such as find() and rfind() are useful only for cases where a programmer needs to know the exact location of the character or substring in the string. If the exact position is not important, then the in membership operator should be used to check if a character or substring is contained in the string:
     * if 'batman' in superhero_name:
     * String objects may be compared using relational operators (<, <=, >, >=), equality operators (==, !=), membership operators (in, not in), and identity operators (is, is not).
     * For an equality (==) comparison, the two strings must have the same length and every corresponding character pair must be the same. For a relational comparison (<, >, etc.), the result will be the result of comparing the ASCII/Unicode values of the first differing character pair.
     * Good practice is to always use the equality operator== when comparing values.
     * Methods to check a string value that returns a True or False Boolean value:
     * isalnum() -- Returns True if all characters in the string are lowercase or uppercase letters, or the numbers 0-9.
     * isdigit() -- Returns True if all characters are the numbers 0-9.
     * islower() -- Returns True if all cased characters are lowercase letters.
     * isupper() -- Return True if all cased characters are uppercase letters.
     * isspace() -- Return True if all characters are whitespace.
     * startswith(x) -- Return True if the string starts with x.
     * endswith(x) -- Return True if the string ends with x.
     * Note that the methods islower() and isupper() ignore non-cased characters. Ex: 'abc?'.islower() returns True, ignoring the question mark.
     * Methods to create new strings:
     * capitalize() -- Returns a copy of the string with the first character capitalized and the rest lowercased.
     * lower() -- Returns a copy of the string with all characters lowercased.
     * upper() -- Returns a copy of the string with all characters uppercased.
     * strip() -- Returns a copy of the string with leading and trailing whitespace removed.
     * title() -- Returns a copy of the string as a title, with first letters of words capitalized.
     * ex: name = input().strip().lower()
     * The string method split() splits a string into a list of tokens. Each token is a substring that forms a part of a larger string. A separator is a character or sequence of characters that indicates where to split the string into tokens.
     * Ex: 'Martin Luther King Jr.'.split() splits the string literal "Martin Luther King Jr." using any whitespace character as the default separator and returns the list of tokens ['Martin', 'Luther', 'King', 'Jr.'].
     * The separator can be changed by calling split() with a string argument. Ex: 'a#b#c'.split('#') uses the "#" separator to split the string "a#b#c" into the three tokens ['a', 'b', 'c'].
     * my_str = '@'.join(['billgates', 'microsoft']) assigns the string 'billgates@microsoft' to my_str. The separator '@' provides a join() method that accepts a single list argument THAT ONLY CONTAINS STRINGS
     * else use “sep”.join(map(str, list))
     * dictionaries:
     * A dictionary is represented by the dict object type. A dictionary associates (or "maps") keys with values.
     * A key can be any immutable type, such as a number, string, or tuple; a value can be any type.
     * A dict object is created using curly braces { } to surround the key:value pairs that comprise the dictionary contents. Ex: players = {'Lionel Messi': 10, 'Cristiano Ronaldo': 7}
     * No comma after the last entry
     * If no entry with a matching key exists in the dictionary, then a KeyError runtime error occurs and the program is terminated.
     * A dictionary key is unique – attempting to create a new entry with a key that already exists in the dictionary replaces the existing entry. The del keyword is used to remove entries from a dictionary: del prices['papaya'] removes the entry whose key is 'papaya'. If the requested key to delete does not exist then a KeyError occurs.
     * Loops
     * Good practice is to include greater than or less than along with equality in a loop expression to help avoid infinite loops.
     * ‘sentinel’ - the != that ends the loop
     * In a for loop, use reversed() to iterate backwards through a sequence/list/string/dictionary keys etc
     * The range() function can take up to three arguments to indicate the starting value of the sequence, the ending value of the sequence minus 1, and the interval between numbers.
     * A loop may optionally include an else clause that executes only if the loop terminates normally, not using a break statement.
     * enumerate() like so: (using Unpacking, gives things like (i, r))
     * origins = [4, 8, 10]
     * for (index, value) in enumerate(origins):
     *     print('Element {}: {}'.format(index, value))
    ### Functions
     * If execution reaches the end of a function's statements without encountering a return statement, then the function returns a value of None. If the function is expected to return an actual value, then such an assignment can cause confusion.
     * A parameter is a function input specified in a function definition. Ex: A pizza area function might have diameter as an input.
     * An argument is a value provided to a function's parameter during a function call. Ex: A pizza area function might be called as print_pizza_area(12.0) or as print_pizza_area(16.0).
     * When using keyword arguments, the argument list does not need to follow a specific ordering.
     * def print_book_description(title, author, publisher, year, version, num_chapters, num_pages):
     *     # Format and print description of a book...
     *    * print_book_description(title='The Lord of the Rings', publisher='George Allen & Unwin',
     *                        year=1954, author='J. R. R. Tolkien', version=1.0,
     *                        num_pages=456, num_chapters=22)
     *    * Good practice is to use keyword arguments for any function containing more than approximately 4 arguments.
     * A common error is to place keyword arguments before all position arguments, which generates an exception.
     * Parameter with a default value.
     * def print_date(day, month, year, style=0):
     * If a parameter does not have a default value, then failing to provide an argument (either keyword or positional) generates an error.
     * Mutable default objects remain changed over multiple function calls.
     * Sometimes a programmer doesn't know how many arguments a function requires. A function definition can include a *args parameter that collects optional positional parameters into an arbitrary argument list tuple.
     * **kwargs creates a dictionary containing "extra" arguments not defined in the function definition; kwargs is short for keyword arguments. The keys of the dictionary are the parameter names specified in the function call.
     * The * and ** characters in *args and **kwargs are the important symbols. Using "args" and "kwargs" is standard practice, but any valid identifier is acceptable (like perhaps using *condiments in the sandwich example).
        ```
         * 0 def gen_command(application, **kwargs):
         * 2            command = application
         * 3
         * 4            for argument in kwargs:
         * 5                command += ' --{}={}'.format(argument, kwargs[argument])
         * 6            return command
         * 7
         * 8        print(gen_command('notepad.exe'))  # No options
         * 9        print(gen_command('Powerpoint.exe', file='pres.ppt', start=True, slide=3))
         ```
     * Occasionally a function should produce multiple output values. However, function return statements are limited to returning only one value. A workaround is to package the multiple outputs into a single container, commonly a tuple, and to then return that container.
     * Recall that a tuple doesn't require parentheses around the contents, as the comma indicates a tuple should be created. An equivalent statement would have been return (mean, std_dev). The outputs could also have been returned in a list, as in return [mean, std_dev].
     * docstrings
     * A large program can contain many functions with a wide variety of uses. A programmer should document each function, giving a high-level description of the purpose of the function, so that later readers of the code can more easily understand. A docstring is a string literal placed in the first line of a function body.
     * Good practice is to keep the docstring of a simple function as a single line, including the quotes. Furthermore, there should be no blank lines before or after the docstring.
     * Multi-line docstrings can be used for more complicated functions to describe the function arguments. Multi-line docstrings should use consistent indentation for each line, separating the ending triple-quotes by a blank line.
        ```
        “”Start
        End
        “””
        ```
        * The help() function can aid a programmer by providing them with all the documentation associated with an object. A statement such as help(ticket_price) would print out the docstring for the ticket_price() function, providing the programmer with information about how to call that function.
        * help(__name__) is handy
  ### Modules
      * a module is a file containing Python code that can be used by other modules or scripts. A module is made available for use via the import statement. Once a module is imported, any object defined in that module can be accessed using dot notation. Ex: A variable speed_of_light defined in universe.py is accessed via universe.speed_of_light.
      * some standard modules:
        * import math
        * Function        Description                Function        Description
        * ceil        Round up value                fabs        Absolute value
        * factorial        factorial (3! = 3 * 2 * 1)                floor        Round down value
        * fmod        Remainder of division                fsum        Floating-point sum
        * exp        Exponential function ex                log        Natural logarithm
        * pow        Raise to power                sqrt        Square root
        * acos        Arc cosine                asin        Arc sine
        * atan        Arc tangent                atan2        Arc tangent with two parameters
        * cos        Cosine                sin        Sine
        * hypot        Length of vector from origin                degrees        Convert from radians to degrees
        * radians        Convert degrees to radians                tan        Tangent
        * cosh        Hyperbolic cosine                sinh        Hyperbolic sine
        * gamma        Gamma function                erf        Error function
        * pi (constant)        Mathematical constant 3.141592...
        * e (constant)        Mathematical constant 2.718281...
      * When a module is imported, all code in the module is immediately executed. Python programs often use the built-in special name __name__ to determine if the file was executed as a script by the programmer, or if the file was imported by another module. If the value of __name__ is the string '__main__', then the file was executed as a script.
      *  i.e. if __name__ == '__main__' # Executes only if file run as a script
  ### Scope
      * to declare a global variable use keyword global
      * ex:    global employee_name
      *     name = input('Enter employee name:')
      *     employee_name = name
      * all global values including functions can be listed with globals()
      * alternatively, locals() returns variables with local scope
      *  level between the local function scope and global scope for clarity. It is possible to define a function within another function – in such a case the scope of the outer function is checked before the global scope is checked.
      * Each scope, such as global scope or a local function scope, has its own namespace.
      * When a name is referenced in code, the local scope's namespace is the first checked, followed by the global scope, and finally the built-in scope. If the name cannot be found in any namespace, the interpreter generates a NameError. The process of searching for a name in the available namespaces is called scope resolution.
      * The semantics of passing object references as arguments is important because modifying an argument that is referenced elsewhere in the program may cause side effects outside of the function scope. When a function modifies a parameter, whether or not that modification is seen outside the scope of the function depends on the mutability of the argument object.
      * If the object is immutable, such as a string or integer, then the modification is limited to inside the function. Any modification to an immutable object results in the creation of a new object in the function's local scope, thus leaving the original argument object unchanged.
      * If the object is mutable, then in-place modification of the object can be seen outside the scope of the function. Any operation like adding elements to a container or sorting a list that is performed within a function will also affect any other variables in the program that reference the same object.
      * One method to avoid unwanted changes is to pass a copy of the object as the argument instead, like in the statement my_func(my_list[:]).
  ### Other
      * Unpacking is a process that performs multiple assignments at once, binding comma-separated names on the left to the elements of a sequence on the right. Ex: num1, num2 = [350, 400] is equivalent to the statements num1 = 350 and num2 = 400.
      * comments: # or ‘’’ comment ‘’’
      * compound operators: += 1, -=, *=, /=, and %=.
      * {:.2f}'.format() with a variable name inside the parentheses. This line of code is using a built-in formatting function in Python to print the variable with two decimal places.
      * Command Line
      * To run a Python program named "myprog.py" with an argument specifying the location of a file named "myfile1.txt", the user would enter the following at the command prompt:
      * > python myprog.py myfile1.txt
      * The contents of this command line are automatically stored in the list sys.argv, which is stored in the standard library sys module. sys.argv consists of one string element for each argument typed on the command line.
      * When executing a program, the interpreter parses the entire command line to find all sequences of characters separated by whitespace, storing each as a string within list variable argv. As the entire command line is passed to the program, the name of the program executable is always added as the first element of the list.
      * Ex: For a command line of python myprog.py myfile1.txt, argv has the contents ['myprog.py', 'myfile1.txt'].
      * # Example:
      *       * import sys
      *       * name = sys.argv[1]
      * age = int(sys.argv[2])
      *       * print('Hello {}. '.format(name))
      * print('{} is a great age.\n'.format(age))
      *       * A common error is to access elements within argv without first checking the length of argv to ensure that the user entered enough arguments, resulting in an IndexError being generated.
      * If the number of arguments is incorrect, the program prints an error message, referred to as a usage message, that provides the user with an example of the correct command-line argument format. A good practice is to always output a usage message when the user enters incorrect command-line arguments.
      * Note that all command-line arguments in argv are strings. If an argument represents a different type like a number, then the argument needs to be converted using one of the built-in functions such as int() or float().
      * When a single argument needs to contain a space, the user can enclose the argument within quotes "" on the command line, such as the following, which will result in only 3 command-line arguments, where sys.argv has the contents ['myprog.py', 'Mary Jane', '65'].
      * > python myprog.py "Mary Jane" 65
      * Command-line arguments can become quite complicated for large programs with many options. There are entire modules of the standard library dedicated to aiding a programmer develop sophisticated argument parsing strategies. The reader is encouraged to explore modules such as argparse and getopt.
      * argparse: Parser for command-line options, arguments, and sub-commands
      * getopt: C-style parser for command-line options
      * Operators
      * Exponents: **
      * print('2.0 to the power of 1024 = ', 2.0**1024)
      * The modulo operator (%) evaluates the remainder of the division of two integer operands. Ex: 23 % 10 is 3.
      * Examples:
      * 24 % 10 is 4. Reason: 24 / 10 is 2 with remainder 4.
      * 50 % 50 is 0. Reason: 50 / 50 is 1 with remainder 0.
      * 1 % 2 is 1. Reason: 1 / 2 is 0 with remainder 1.
      * Given a non-negative number x, which yields a number in the range 5 - 10?
      * (x % 6) + 5
      * Minus (-) used as negative is known as unary minus
      * ++ to increment is not supported
      * Escape sequences:
      * \\        Backslash (\)
      * \'        Single quote (')
      * \"        Double quote (")
      * \n        Newline        (also char 10)
      * \t        Tab (indent)
      * Escape sequences can be ignored using a raw string. A raw string is created by adding an 'r' before a string literal, as in r'this is a raw string\'', which would output as this is a raw string\'.
      * Unicode character codes: The built-in function ord() returns an encoded integer value for a string of length one. The built-in function chr() returns a string of one character for an encoded integer.
      * to execute a python file: $ python constants.py where ‘constants’ is the file name
      * division returns a floating point number/float value, flooring with // returns an integer if BOTH inputs are integers, else it is a float value (and obvs you can’t divide by 0)
      * Float-type objects have a limited range of values that can be represented. For a standard 32-bit installation of Python, the maximum floating-point value is approximately 1.8x10308, and the minimum floating-point value is 2.3x10-308.
      * Assigning a floating-point value outside of this range generates an OverflowError
      * int() - Converting a float to an int will truncate the floating-point number's fraction. For example, the variable temperature might have a value of 18.75232, but can be converted to an integer expression int(temperature). The result would have the value 18, with the fractional part removed.
      * New line/newline: \n
      * useful functions:
      * input(‘prompt here’)
      * int() converts a string to an integer
      * float() converts to a floating point value (0.0 etc)
      * Error type        Description
      * SyntaxError        The program contains invalid code that cannot be understood.
      * IndentationError        The lines of the program are not properly indented.
      * ValueError        An invalid value is used – can occur if giving letters to int().
      * NameError        The program tries to use a variable that does not exist.
      * TypeError        An operation uses incorrect types – can occur if adding an integer to a string.
      * Logic error - the program is logically flawed -> aka a ‘bug’ - n could be 0 in sum/n
      * Python uses duck typing, a form of dynamic typing based on the maxim "If a bird walks, swims, and quacks like a duck, then call it a duck." For example, if an object can be concatenated, sliced, indexed, and converted to ASCII, doing everything that a string can do, then treat the object like a string.
      * A programmer writing a function stub should consider whether or not calling the unwritten function is a valid operation. Simply doing nothing and returning nothing may be acceptable early in the development of a larger program. One approach is to use the pass keyword, which performs no operation except to act as a placeholder for a required statement.
      * a NotImplementedError can be generated with the statement raise NotImplementedError
      * Another useful approach is to print a message when a function stub is called, thus alerting the user to the missing function statements. Good practice is for a stub to return -1 for a function that will have a return value. The following function stub could be used to replace the steps_to_calories() stub in the program above:
      * def steps_to_calories(steps):
    print('FIXME: finish steps_to_calories')
    return -1
         * the '\' character is actually displayed by printing the two character sequence '\\'
         * An identifier, also called a name, is a sequence of letters (a-z, A-Z), underscores (_), and digits (0–9), and must start with a letter or an underscore.
         * Names that start and end with double underscores (for example, __init__) are allowed but should be avoided because Python has special usages for double underscore names, explained elsewhere. A good variable name should describe the purpose of the variable, such as "temperature" or "age," rather than just "t" or "A."
         * Certain words like "and" or "True" cannot be used as names. Reserved words, or keywords, are words that are part of the language, and thus, cannot be used as a programmer-defined name. Many language editors will automatically color a program's reserved words.
         * False      await      else       import     pass
         * None       break      except     in         raise
         * True       class      finally    is         return
         * and        continue   for        lambda     try
         * as         def        from       nonlocal   while
         * assert     del        global     not        with
         * async      elif       if         or         yield
         * [Style Guide:](https://www.python.org/dev/peps/pep-0008/)
            ```
            if (a < b):
              x = 25
              y = x + 1
                     * indents/tabs are THREE SPACES
                     * C = 25
            F = ((9 * C) / 5) + 32
            F = F / 2
            ```
          ### For loops:
            * for occurrence in range(num_occurrences):
## Snippets
  ### General
    checking input type:
      ```
      age = -1
      str_age = input(“What is your age? “)
      while !str_age.isdigit(): # This loop will run if the input is NOT a digit.
           print(“You didn’t enter an integer.”)
           str_age = input(“What is your age? “)
      age = int(str_age)
      ```
  ### Lamdas:
    def myfunc(n):
      return lambda a : a * n

    mydoubler = myfunc(2)
    mytripler = myfunc(3)

    print(mydoubler(11))
    print(mytripler(11))
  ### Other one-liners:
    shallow copies
      `b=a[:] (shallow copy of a)`
    input a list if integers:
      `list(map(int, user_input.split()))`
    unpack and print with a custom separator:
      `print(*primes, sep='\n')`
    cute slow endless loop:
      `while(not sleep(5)):`
    sort with keys:
      Sort as if capitalized:
        `key_sort = sorted(names, key=str.lower)`
      Sort by max value in sub-lists:
        `sorted_list = sorted(my_list, key=max)`
    list comprehension
      `list_plus_5 = [(i + 5) for i in my_list]`
    filter out elements from a list
      `new_list = [expression for name in iterable if condition]`
      Ex: Filter out odd numbers
        `even_numbers = [i for i in numbers if (i % 2) == 0]`
    Get a list of integers from the user
      `numbers = [int(i) for i in input('Enter numbers:').split()]`
  ### Unpacking dictionaries (keys, values, and items)
    ```
    >>> my_dict = {'one': 1, 'two':2, 'three': 3}
    >>> a, b, c = my_dict  # Unpack keys
    >>> a
    'one'
    >>> b
    'two'
    >>> c
    'three'
    >>> a, b, c = my_dict.values()  # Unpack values
    >>> a
    1
    >>> b
    2
    >>> c
    3
    >>> a, b, c = my_dict.items()  # Unpacking key-value pairs
    >>> a
    ('one', 1)
    >>> b
    ('two', 2)
    >>> c
    ('three', 3)
    ```
  ### Comamnd Line
    ```
    Testing how long it takes to execute:
    $ python -m timeit -s 'import inspect, sys' 'inspect.stack()[0][0].f_code.co_name'
    1000 loops, best of 3: 499 usec per loop
    $ python -m timeit -s 'import inspect, sys' 'inspect.stack()[0][3]'
    1000 loops, best of 3: 497 usec per loop
    $ python -m timeit -s 'import inspect, sys' 'inspect.currentframe().f_code.co_name'
    10000000 loops, best of 3: 0.1 usec per loop
    $ python -m timeit -s 'import inspect, sys' 'sys._getframe().f_code.co_name'
    10000000 loops, best of 3: 0.135 usec per loop
    ```
