function setWipFlag(){
  let wipStyle = `
    /* requires a sensible .bg-color */
    .wip-flag {
      position: absolute;
      top: 0;
      right: 0;
      margin-top: 1em;
      padding: 0em 0.5em;
      height: 1.2em;
      background: currentColor;
      z-index: 1000;
      font-size: 1.5rem;
    }
    .wip-flag:before {
      display: block;
      border-style: solid;
      content: "";
      border-width: 0.6em;
      border-style: solid;
      opacity: 0.5;
      z-index: -1;
      border-color: currentColor currentColor currentColor transparent;
      right: 2.5em;
      top: 0.1em;
      position: absolute;
      width: 0;
      height: 0;
    }
    .wip-note {
      width: 3em;
      height: 1em;
      z-index: 1;
    }
  `
  alacrity.addStyle(wipStyle)
  
  // try invert as a color
  // credit to http://www.coding-dude.com/wp/css/highlight-text-css/ for ribbons
  let wipFlag = document.createElement('div');
  wipFlag.classList.add('wip-flag')
  let wipRibbon = document.createElement('div');
  wipRibbon.classList.add('wip-ribbon')
  let wipNote = document.createElement('span');
  wipNote.classList.add('wip-note')
  wipNote.classList.add('bg-color')
  wipNote.innerText = 'WIP'
  wipNote.title = 'This project is a work in progress - expect changes'
  wipFlag.appendChild(wipNote)
  document.body.appendChild(wipFlag)
}
setWipFlag()