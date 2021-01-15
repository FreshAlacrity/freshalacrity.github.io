/* jshint esversion: 6 */
/* jshint undef: true */
/* globals $, alacrity, window, document */

// later: add possibility of questions?
function tokiIpsum(sentences = 50) {
  let contentWords = ["pan","pana","pali","palisa","anpa","ante","pipi","pini","pimeja","pilin","akesi","poki","pu","alasa","ali","nasa","nasin","nena","esun","nimi","soweli","noka","supa","suwi","suno","suli","ma","jan","mani","mama","jaki","insa","jelo","ijo","jo","monsi","moku","moli","mun","musi","ilo","open","kasi","kala","kalama","tenpo","kiwen","kili","ko","kon","tomo","oko","toki","olin","kute","kulupu","lawa","lape","laso","len","lete","lipu","lili","loje","lupa","luka"];
  let index = 0;
  const grab = alacrity.getRandFrom;
  function words(num = alacrity.randBetween(1, 3)){
    index += num;
    if (index >= contentWords.length){ index = 0; }
    let words = contentWords.slice(index - num, index);
    return words.join(' ');
  }
  function sentence(){
    alacrity.shuffle(contentWords);
    let foo = [
      grab(['','', words() + ' la ']),
      grab(['mi ','sina ', words() + ' li ']),
      words(),
      grab(['', ' e ' + words(), ' e ' + words() + ' ' + grab(['mi','sina'])]),
    ];
    return foo.join('') + grab(['.','.','.',' a!',' kin!']);
  }
  return alacrity.range(1, sentences, 1).map(sentence).join(" ");
}
