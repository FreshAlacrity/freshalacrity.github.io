/* jshint esversion: 6 */
/*
sitelen telo font: https://www.reddit.com/r/tokipona/comments/jax1x2/sitelen_telo_v101_a_japaneseinspired_logographic/
sitelen telo leko by akesi kon Nalasuni

source code pro font from Google Fonts: https://fonts.google.com/specimen/Source+Code+Pro
*/

function fillHtml(idString, htmlString){ document.getElementById(idString).innerHTML = htmlString; }

var lekoDict = {
"a": ["0000100","0000100","0000100","0000000","0011100","0000000","0011100"],
"akesi": ["0010100","0010100","1111111","0010101","0010101","0000001","1111111"],
"ala": ["0000100","0000100","1111111","0000100","0000100","0000100","0000100"],
"alasa": ["1011111","1000001","1111101","1000101","1000101","1000100","1111111"],
"ali": ["1111111","0000000","1111111","0000001","1111111","0000100","1111100"],
"anpa": ["1111111","0010000","0011100","0010100","0010100","0010100","0010100"],
"ante": ["0000100","0000100","1111111","0000100","1111111","0000100","0011100"],
"anu": ["1000111","1000100","1111100","1000100","1000100","1000100","1000111"],
"awen": ["0010100","0010100","0010100","0010100","0010100","0010100","1110111"],
"e": ["0000000","0000000","1111111","0000001","0000001","0000000","0000000"],
"en": ["0000000","0000000","1111111","0000100","1111111","0000000","0000000"],
"esun": ["0010000","0010000","1111111","0010000","0010111","0010000","0010111"],
"ijo": ["0000100","0000100","1111111","1000100","1000100","1000100","1111100"],
"ike": ["0010000","0010000","1111111","0010001","0010111","0000100","0000100"],
"ilo": ["1000100","1000100","1111111","0000101","1111111","0000100","0000100"],
"insa": ["1110001","0010001","0010101","0010101","0010101","0010001","0011111"],
"jaki": ["0010100","0010100","1110111","1000101","1111101","0000100","1111100"],
"jan": ["0000111","0000101","1111111","0000100","0000100","0000100","0000100"],
"jelo": ["1000000","1000000","1111100","1000100","1111111","0000000","1111111"],
"jo": ["1000000","1000000","1111111","0000001","0011111","0010100","0011100"],
"kala": ["0010100","0010100","0011100","0000100","1011101","1010101","1011101"],
"kalama": ["1111111","0000101","0000101","0000101","1110101","0000001","1110001"],
"kama": ["0010100","0010100","1111111","0010100","0010100","0000100","0011100"],
"kasi": ["0000100","0000100","0011100","0010100","0011100","0000100","1111111"],
"ken": ["1000000","1000000","1111111","1000100","1000100","1000100","1000111"],
"kepeken": ["1000111","1000000","1010111","1010000","1111111","0010001","1111111"],
"kili": ["0011100","0010100","0011100","0000100","1111111","1000100","1111100"],
"kin": ["0000100","0000100","0000100","0000100","0000100","0000000","0011100"],
"kiwen": ["0010101","0010101","0011111","0000100","1111111","1000100","1111100"],
"ko": ["0010101","0010101","0011111","0000100","1000101","1000101","1011101"],
"kon": ["1000000","1000000","1111111","0000001","0011101","0000100","0000100"],
"kule": ["0011111","0000001","1000111","1000100","1110100","1010000","1111100"],
"kulupu": ["1111111","0000001","1111111","0000100","0011111","0010100","0011100"],
"kute": ["1111111","0010001","0010001","0010001","0010001","0000001","0000001"],
"la": ["0000000","0000000","1000000","1000000","1111111","0000000","0000000"],
"lape": ["0011100","0010100","1111100","0010000","0011101","0010101","0010111"],
"laso": ["0010000","0010000","0011100","0010100","1011111","1000001","1000001"],
"lawa": ["1110111","0000101","1111111","0000100","0000100","0000100","0000100"],
"len": ["1110100","0010100","0011100","0000100","1111111","0000100","0000100"],
"lete": ["1000000","1000000","1111100","0000100","1000101","1000101","1011101"],
"li": ["0010000","0010000","1111111","0010001","0010001","0010000","0010000"],
"lili": ["0010000","0010000","0011111","0010001","0010101","0010101","1110101"],
"linja": ["1111101","1000101","1000101","1000101","1000101","1000101","1000111"],
"lipu": ["1000000","1000000","1011111","1000001","1000001","1000001","1000001"],
"loje": ["1010001","1010001","1011101","0010100","0010100","0010100","0011111"],
"lon": ["0010000","0010000","0011100","0010000","1111111","1000001","1000001"],
"luka": ["1000000","1000000","1111111","0000001","0000001","0000001","1111111"],
"lukin": ["1000000","1000000","1110111","1010000","1010111","1010000","1111111"],
"lupa": ["1111111","0000000","1111111","0010000","0010000","0010000","0011111"],
"ma": ["0010000","0010000","0010000","0010000","1111111","1000001","1000001"],
"mama": ["0011100","0010100","1111100","0010000","0010111","0010001","0010111"],
"mani": ["1111111","0000100","1111111","0000100","1111111","1000101","1111101"],
"meli": ["0000111","0000101","1111111","0000100","1000101","1000101","1011101"],
"mi": ["0000111","0000101","1111111","0000100","0000100","0000000","1111111"],
"mije": ["1011101","1010101","1010101","0010100","1111100","0010000","0010000"],
"moku": ["1000000","1000000","1111111","0000001","1111111","0010000","0011111"],
"moli": ["1111111","0010000","0010100","0010100","1111111","1010100","1110100"],
"monsi": ["0010000","0010000","1111111","1010001","1110001","0000001","0000001"],
"mu": ["0010100","0010100","1111111","0010000","1110000","1000000","1111111"],
"mun": ["1111111","0000001","0000101","0000101","1111111","0000100","1111111"],
"musi": ["1000111","1000101","1111111","0000100","0000100","0000100","0011100"],
"mute": ["1111111","0000001","1111111","0000100","0000100","0000100","1111100"],
"nanpa": ["1111111","0010000","1111111","0010000","0010000","0010000","0011100"],
"nasa": ["0010000","0010000","1111100","1010100","1110111","0000001","0000001"],
"nasin": ["1000000","1000000","1011111","1000000","1011111","1000000","1000000"],
"nena": ["0011111","0000001","1111101","0000001","0000001","0000001","0000001"],
"ni": ["1000001","1000001","1111111","0000001","0000001","0000000","1111111"],
"nimi": ["0011100","0000000","1111111","0010000","0011100","0010100","0010100"],
"noka": ["1111111","0010000","0010000","0010000","0010001","0010001","0011111"],
"o": ["0000000","0000000","1110111","0010000","0010111","0000000","0000000"],
"oko": ["0000100","0000100","1111111","0000101","1111111","0000100","0000100"],
"olin": ["1111111","0000001","1110001","0000001","1110111","0000100","0000100"],
"ona": ["0010111","0010101","1111111","0010100","0010100","0010100","0010100"],
"open": ["1110111","0010100","0010100","0010100","0010100","0010100","0011100"],
"pakala": ["0000100","0000100","1110111","0000001","0000001","0000001","0000001"],
"pali": ["1000000","1000000","1111111","0000001","0010111","0010000","0011100"],
"palisa": ["0010100","0010100","0010100","0010100","0010100","0000100","0000100"],
"pan": ["0000100","0000100","0011100","0000100","1111111","1000000","1111111"],
"pana": ["1000111","1000000","1000111","1000000","1111111","0000001","1111111"],
"pi": ["0000000","0000000","1111111","1000101","1000111","0000000","0000000"],
"pilin": ["1111111","0000001","0000001","0000001","0011111","0010000","0010000"],
"pimeja": ["1000000","1000000","1110100","1010100","1111111","0000100","0000100"],
"pini": ["1111111","0000100","1110100","0000100","0010100","0010100","0011100"],
"pipi": ["1110100","1010100","1111111","0010100","1111111","0010100","0010100"],
"poka": ["0010000","0010000","1111111","0010100","0010100","0010100","1110111"],
"poki": ["1110001","0010001","0010001","0010001","0010001","0010001","0011111"],
"pona": ["0011111","0000001","1110001","0000001","1110001","0000001","0011111"],
"pu": ["1011100","1000000","1011111","1000001","1011101","1000001","1000001"],
"sama": ["0000000","0000000","1111111","0000000","1111111","0000000","0000000"],
"seli": ["1010001","1010001","1011101","0000100","0000100","0000100","0000100"],
"selo": ["0010000","0010000","1111111","0010000","0010111","0010101","0010111"],
"seme": ["0011100","0010000","0011100","0000100","0011100","0000000","0011100"],
"sewi": ["0000100","0000100","0010100","0010100","1111111","0000100","0000100"],
"sijelo": ["0010100","0010100","0010100","0010100","0010111","0000101","1111101"],
"sike": ["1111111","1000001","1011101","1010101","1011101","1000001","1111111"],
"sin": ["1111111","0010000","0010111","0010000","0010000","0010000","0011111"],
"sina": ["0000111","0000101","1111111","0000100","1111111","0000100","0000100"],
"sinpin": ["1000100","1000100","1011111","1010100","1010100","1010100","1011100"],
"sitelen": ["1000000","1000000","1011111","1000001","1011101","1000001","1000001"],
"sona": ["1110100","0000100","0010100","0010100","1111111","1010100","1110111"],
"soweli": ["0010100","0010100","1111111","0010100","0010100","0010100","0010100"],
"suli": ["0000100","0000100","1111111","0000100","0000111","0000101","1111101"],
"suno": ["1010001","1010001","1010001","0010000","1111111","1010000","1110000"],
"supa": ["1111111","0000100","0000100","0000100","0000111","0000101","1111101"],
"suwi": ["0011111","0010000","0010000","0010000","1010001","1010001","1011101"],
"tan": ["0010000","0010000","1111111","0010000","1111111","0010001","0010001"],
"taso": ["0000001","0000001","1011101","1000001","1111111","0000001","0000001"],
"tawa": ["0010100","0010100","1111111","0010100","0010111","0010000","0011111"],
"telo": ["0000100","0000100","0000100","0000100","1000101","1000101","1011101"],
"tenpo": ["1000000","1000000","1011111","1000001","1111101","0000001","0000001"],
"toki": ["1110111","0000100","1110100","0000100","0000100","0000100","0000111"],
"tomo": ["0010000","0010000","1111111","0010000","0010111","0000001","0000001"],
"tu": ["1111100","0000100","0000100","0000100","1111100","1000000","1111111"],
"unpa": ["0000111","0000101","1111111","0000100","1111111","1000100","1111100"],
"uta": ["1111100","1000000","1000000","1000000","1000000","1000000","1111111"],
"utala": ["1011111","1010001","1110101","0000101","1111111","0000100","0000100"],
"walo": ["1011100","1000000","1111100","1000100","1000100","1000100","1111111"],
"wan": ["0000000","0000000","1111111","0000000","0000000","0000000","0000000"],
"waso": ["1111100","0010000","0011111","0000001","1111101","0000001","0011111"],
"wawa": ["0010101","0010101","0011111","0000100","0000111","0000101","1111101"],
"weka": ["0010000","0010000","1111111","0010001","0010101","0000101","0000111"],
"wile": ["0011100","0000000","1111111","0000001","0011111","0010100","0010111"],
"apeja": ["1010111","1010101","1111111","1010100","1010100","1000100","1000100"],
"kipisi": ["0000100","0000100","0011111","0010100","1111111","0010100","0011100"],
"leko": ["1111111","0000000","1111111","0000100","0000111","0000101","1111101"],
"majuna": ["0000111","0000101","1111111","0000100","0000101","0000101","0000101"],
"monsuta": ["0010000","0010000","1110111","0010100","0011111","0000100","0011100"],
"namako": ["1111111","1000000","1000101","1000101","1000101","1000000","1111100"],
"pake": ["1111100","0000100","0000100","0000100","1111111","0000100","0000100"],
"pata": ["1110111","1010101","1111111","0010100","0010100","0010100","0010100"],
"powe": ["1111111","0010001","0010111","0000100","0010101","0010101","0010101"],
"tonsi": ["1110111","0010101","1110101","1000101","1111111","0000100","0000100"],
"KA": ["1110000","0010000","0010000","0010000","0010111","0010001","0010001"],
"KE": ["1110000","0010000","0010000","0010000","0010111","0010100","0010111"],
"KI": ["1110000","0010000","0010000","0010000","0010001","0010001","0010001"],
"KO": ["1110000","0010000","0010000","0010000","0010111","0010101","0010111"],
"KU": ["1110000","0010000","0010000","0010000","0010100","0010100","0010111"],
"LA": ["1111111","0010000","0010000","0010000","0010111","0010001","0010001"],
"LE": ["1111111","0010000","0010000","0010000","0010111","0010100","0010111"],
"LI": ["1111111","0010000","0010000","0010000","0010001","0010001","0010001"],
"LO": ["1111111","0010000","0010000","0010000","0010111","0010101","0010111"],
"LU": ["1111111","0010000","0010000","0010000","0010100","0010100","0010111"],
"MA": ["1111111","1000001","1000001","1000001","1011101","1000101","1000101"],
"ME": ["1111111","1000001","1000001","1000001","1011101","1010001","1011101"],
"MI": ["1111111","1000001","1000001","1000001","1000101","1000101","1000101"],
"MO": ["1111111","1000001","1000001","1000001","1011101","1010101","1011101"],
"MU": ["1111111","1000001","1000001","1000001","1010001","1010001","1011101"],
"NA": ["1111100","0010000","1111111","0000000","0011100","0000100","0000100"],
"NE": ["1111100","0010000","1111111","0000000","0011100","0010000","0011100"],
"NI": ["1111100","0010000","1111111","0000000","0000100","0000100","0000100"],
"NO": ["1111100","0010000","1111111","0000000","0011100","0010100","0011100"],
"NU": ["1111100","0010000","1111111","0000000","0010000","0010000","0011100"],
"PA": ["1000000","1000000","1111111","1000001","1011101","1000100","1000100"],
"PE": ["1000000","1000000","1111111","1000001","1011101","1010000","1011100"],
"PI": ["1000000","1000000","1111111","1000001","1000101","1000100","1000100"],
"PO": ["1000000","1000000","1111111","1000001","1011101","1010100","1011100"],
"PU": ["1000000","1000000","1111111","1000001","1010001","1010000","1011100"],
"SA": ["1111111","0000000","1111111","0000000","0011100","0000100","0000100"],
"SE": ["1111111","0000000","1111111","0000000","0011100","0010000","0011100"],
"SI": ["1111111","0000000","1111111","0000000","0000100","0000100","0000100"],
"SO": ["1111111","0000000","1111111","0000000","0011100","0010100","0011100"],
"SU": ["1111111","0000000","1111111","0000000","0010000","0010000","0011100"],
"TA": ["1111100","0010000","0011111","0010000","0010111","0010001","0010001"],
"TE": ["1111100","0010000","0011111","0010000","0010111","0010100","0010111"],
"TI": ["1111100","0010000","0011111","0010000","0010001","0010001","0010001"],
"TO": ["1111100","0010000","0011111","0010000","0010111","0010101","0010111"],
"TU": ["1111100","0010000","0011111","0010000","0010100","0010100","0010111"],
"JA": ["1111100","1000100","1111100","1000000","1000111","1000001","1000001"],
"JE": ["1111100","1000100","1111100","1000000","1000111","1000100","1000111"],
"JI": ["1111100","1000100","1111100","1000000","1000001","1000001","1000001"],
"JO": ["1111100","1000100","1111100","1000000","1000111","1000101","1000111"],
"JU": ["1111100","1000100","1111100","1000000","1000100","1000100","1000111"],
"WA": ["1111111","0000000","0000000","0000000","0011100","0000100","0000100"],
"WE": ["1111111","0000000","0000000","0000000","0011100","0010000","0011100"],
"WI": ["1111111","0000000","0000000","0000000","0000100","0000100","0000100"],
"WO": ["1111111","0000000","0000000","0000000","0011100","0010100","0011100"],
"WU": ["1111111","0000000","0000000","0000000","0010000","0010000","0011100"],
"A": ["0000000","0000000","0011111","0000001","0000001","0000001","0000001"],
"E": ["0000000","0000000","0011111","0010000","0010000","0010000","0011111"],
"I": ["0000000","0000000","0000100","0000100","0000100","0000100","0000100"],
"O": ["0000000","0000000","0011111","0010001","0010001","0010001","0011111"],
"U": ["0000000","0000000","0010000","0010000","0010000","0010000","0011111"],
"N": ["0010000","0010000","0010100","0010100","0010100","0010000","0010000"],
"[": ["0011111","0010000","0010000","0010000","0010000","0000000","0000000"],
"]": ["0000000","0000000","0000100","0000100","0000100","0000100","1111100"],
",": ["0000000","0000000","0011100","0010100","0011100","0000000","0000000"],
".": ["1110111","1000001","1000001","0000000","1000001","1000001","1110111"],
";": ["0010100","0010100","1110111","0000000","1110111","0010100","0010100"],
"(": ["0000111","0000100","0011100","0010000","0011100","0000100","0000111"],
")": ["1110000","0010000","0011100","0000100","0011100","0010000","1110000"],
"_": ["1111111","0000000","1111111","0000000","1111111","0000000","1111111"],
};

function drawLeko(word){
  if (lekoDict[word]){
    let canvasHtml = '<svg class="leko-char" viewBox="0 0 70 70">';
    let previewPixelSize = 10;
    canvasHtml += singleChar(word, 0, 0, previewPixelSize)
    canvasHtml += '</svg>';
    return canvasHtml;
  } else {
    return word;
  }
}
function singleChar(word, xOffset, yOffset, previewPixelSize, color){
  if (color == undefined){ color = "currentColor"; }
  canvasHtml = '';
  for (y=0; y<7; y++){
    for (x=0; x<7; x++){
      let tempArray = lekoDict[word];
      if (tempArray[y].charAt(x) == "1"){
        let xPos = (x*(previewPixelSize));
        let yPos = ((y)*(previewPixelSize));
        canvasHtml=canvasHtml+"<rect x='"+(xPos+xOffset)+"' y='"+(yPos+yOffset)+"' width='"+(previewPixelSize*1.09)+"' height='"+(previewPixelSize*1.09)+"' fill='"+color+"'/>";
      }
    }
  }
  return canvasHtml;
}
function splitAnteNimi(inputWord){
  let remWord = inputWord;
  let prettyFragments = [];
  while (remWord.length > 0){
    if (lekoDict[remWord.slice(0, 2)]){
      prettyFragments.push(remWord.slice(0, 2));
      remWord = remWord.slice(2);
    } else {
      prettyFragments.push(remWord.charAt(0));
      remWord = remWord.slice(1);
    }
  }
  return prettyFragments;
}
function getLekoHtml(phrase){
  let htmlString = '';//'<span class="leko">';
  let phraseBits = [];
  let words = phrase.replace(/\[/g," [ ").replace(/\]/g," ] ").split(" ");
  let tidyWords = words;
  let tidyWordBits = [];
  for (word = 0; word < tidyWords.length; word++){
    if (tidyWords[word] == tidyWords[word].toUpperCase()){
      //catch capital letters and find a tidy way to group them
      let prettyFragments = splitAnteNimi(tidyWords[word]);
      tidyWordBits = tidyWordBits.concat(prettyFragments);
    } else {
      tidyWordBits.push(tidyWords[word]);
    }
  }
  for (word = 0; word < tidyWordBits.length; word++){
    phraseBits.push(drawLeko(tidyWordBits[word]) + ' ');
  }
  htmlString += phraseBits.join(" ");
  return htmlString;
}
function replaceLeko(){
  //for all elements with the class "leko" replace the inner text with SVGs where possible
  var allElements = document.getElementsByClassName("leko");
  for (tSpan = 0; tSpan < allElements.length; tSpan++){
    var tempText = allElements[tSpan].innerHTML;
    allElements[tSpan].title = tempText.replace(/(<([^>]+)>)/gi, "");
    allElements[tSpan].innerHTML = getLekoHtml(tempText);
  }
}
replaceLeko();
