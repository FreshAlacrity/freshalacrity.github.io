/**
 * @returns {number} the edit distance - the minimum number of single-character edits (insertions, deletions or substitutions) required to change string a into string b
 * {@link https://gist.github.com/andrei-m/982927 source}
 * {@link https://en.wikipedia.org/wiki/Levenshtein_automaton more info}
 * {@link https://julesjacobs.com/2015/06/17/disqus-levenshtein-simple-and-fast.html implementation of this (in Python)}
 */
function levenshteinDistance (a, b) {
  /*
  Copyright (c) 2011 Andrei Mackenzie
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  */
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix = []

  /* Increment along the first column of each row */
  let i
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  /* Increment each column in the first row. */
  let j
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  /* Fill in the rest of the matrix. */
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, /* substitution */
          Math.min(matrix[i][j - 1] + 1, /* insertion */
            matrix[i - 1][j] + 1)) /* deletion */
      }
    }
  }
  return matrix[b.length][a.length]
}