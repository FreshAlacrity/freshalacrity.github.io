/* jshint esversion: 6 */
/* jshint undef: true */
/* globals window, document */

// #maybe add possibility of questions

function tokiIpsum(sentences = 50) {
  let contentWords = ["pan","pana","pali","palisa","anpa","ante","pipi","pini","pimeja","pilin","akesi","poki","pu","alasa","ali","nasa","nasin","nena","esun","nimi","soweli","noka","supa","suwi","suno","suli","ma","jan","mani","mama","jaki","insa","jelo","ijo","jo","monsi","moku","moli","mun","musi","ilo","open","kasi","kala","kalama","tenpo","kiwen","kili","ko","kon","tomo","oko","toki","olin","kute","kulupu","lawa","lape","laso","len","lete","lipu","lili","loje","lupa","luka"]
  // Why this selection of words? See https://www.reddit.com/r/tokipona/comments/df0zbi/toki_pona_analysis_parts_of_speech/


  function sentence(){    
    let index = 0
    function words(num = randBetween(1, 3)){
      index += num;
      if (index >= contentWords.length){ index = 0 }
      let words = contentWords.slice(index - num, index);
      return words.join(' ');
    }

    function shuffle(array) {
      /** Uses the Fisher-Yates shuffle to shuffle an array (walk the array in the reverse order and swap each element with a random one before it)
       * {@link https://javascript.info/task/shuffle source}
       */
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        /* swap elements array[i] and array[j]
            could also be written as:
            let t = array[i]; array[i] = array[j]; array[j] = t
        */
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    function randBetween(lower, upper){
      return Math.floor(lower + (upper - lower + 1) * Math.random())
    }

    function pickOne(arr) { return arr[Math.floor(arr.length * Math.random())] }

    shuffle(contentWords) // commenting this out leads to hilarity
    return [
      pickOne(['','', words() + ' la ']),
      pickOne(['mi ','sina ', words() + ' li ']),
      words(),
      pickOne(['', ' e ' + words(), ' e ' + words() + ' ' + pickOne(['mi','sina'])]),
      pickOne(['.','.','.',' a!',' kin!'])
    ].join('')
  }
  return Array.from(Array(sentences).keys()).map(sentence).join(" ");
}
