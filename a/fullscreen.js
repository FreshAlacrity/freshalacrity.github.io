/*
  function rangeMap2D (sourceMin, sourceMax, destMin, destMax, input, mode = 'stretch') {
    // stretch: rangeMap both ways
    // slice: keep scale, fill
    // meet: keep scale, shrink to fit
    let sourceRange = diff(sourceMax, sourceMin)
    let destRange = diff(destMax, destMin)
    let scale = 

  }
*/

const fullscreen = (function () {
  // @later start the mouse indicator offscreen
  // @todo figure out why mouse position isn't being correctly recalculated when the screen is zoomed
  // @todo troubleshoot view edges not working correctly when w < h
  const _internal = {
    debug: true, 
    indicator: false,
    // w and h are in svg units, vw and vh are in pixels - @later rename for clarity?
    window: { initialWidth: 100, initialHeight: 100, w: 100, h: 100, vw: 100, vh: 100, ratio: 1, center: [0, 0] },
    // @todo update center point when using the mouse to drag the viewBox around
    mouse: { clientX: 0, clientY: 0, x: 0, y: 0, down: false }
  }

  function log (...args) {
    if (storage.debug) {
      console.log(alacrity.tidy(...args))
    }
  }
  function peep(data) {
    log('no update function specified; data has ' + data.length + ' rows')
  }
  function getWindowSize() {
    // #later check and see if I can do this better
    return new Promise((resolve, reject) => {
      let tries = 10;
      let w = alacrity.getPageWidth()
      let h = alacrity.getPageHeight()
      if (!w || !h) {
        var trying = window.setInterval(() => {
          tries--
          console.log('Reattempting to get page width and height, ' + tries + ' tries left.') 
          // case when this doesn't work - when the window is loading/refreshed in the background
          w = alacrity.getPageWidth()
          h = alacrity.getPageHeight()
          if (tries <= 0 || (w && h)) {
            window.clearInterval(trying)
            if (w && h) { 
              resolve({ width: w, height: h }) 
            } else { 
              reject("Ack - page width and height could not be found.") 
            }
          }
        }, 1000 / 20) // increase denominator to run at a higher framerate
      } else {
        resolve({ width: w, height: h })
      }
    })
  }
  function updateWindow() {
    function doUpdate(current){
      let w = current.width
      let h = current.height
      let vw = w
      let vh = h
      if (_internal.window.initialWidth > 0) {
        /* zoom in and out when the zoom level changes */
        vw = (100 * w) / _internal.window.initialWidth
        vh = (100 * h) / _internal.window.initialHeight
      } else {
        /* catch instances where initialWidth/Height haven't already been set and fix */
        _internal.window.initialWidth = w
        _internal.window.initialHeight = h
      }

      $(_internal.window.svgId).setAttribute(
          "viewBox", `-${vw / 2} -${vh / 2} ${vw} ${vh}`  
      )

      /* track the relationship between screen size and svg coordinates */
      let ratio = 1;
      let padding = 10;
      if (w < h) {
        ratio = vw / w;
        padding = w * ratio * 0.1;
      } else {
        ratio = vh / h;
        padding = h * ratio * 0.1;
      }
      _internal.window.ratio = ratio;
      _internal.window.w = w * ratio - padding;
      _internal.window.h = h * ratio - padding;
      _internal.window.vw = w;
      _internal.window.vh = h;

      if (_internal.indicator) {
        // @todo get this working
        svg.setAtts($("view-edges"), {
          x: _internal.window.w * -0.5,
          y: _internal.window.h * -0.5,
          width: _internal.window.w,
          height: _internal.window.h
        })
      }
      mousePos() // @todo figure out why this isn't applying accurately to preserve mouse position when zooming
      _internal.update() // #findme
    }
    
    getWindowSize().then(doUpdate)
  }
  function changeView() {
    updateWindow()
    mousePos()
    /* check again just in case; sometimes the first one misses window resizing */
    alacrity.delay(0.2).then(updateWindow)
  }
  function mouseDown (event) {
    mouseMove(event)
    _internal.mouse.down = true
    if (_internal.indicator) { svg.setAtts($('click-indicator'), { 'fill-opacity': 1 }) }
    _internal.update()
  }
  function mouseUp (event) {
    mouseMove(event)
    _internal.mouse.down = false
    if (_internal.indicator) { svg.setAtts($('click-indicator'), { 'fill-opacity': 0.2 }) }
    _internal.update()
  }
  function mousePos () {
    const x = (_internal.mouse.clientX - _internal.window.vw / 2) * _internal.window.ratio;
    const y = (_internal.mouse.clientY - _internal.window.vh / 2) * _internal.window.ratio;
    _internal.mouse.x = x
    _internal.mouse.y = y
    if (_internal.indicator) { svg.setAtts($('click-indicator'), { cx: x, cy: y }) }
  }
  function mouseMove(event) {
    _internal.mouse.clientX = event.clientX
    _internal.mouse.clientY = event.clientY
    mousePos()
  }
  function setup (svgId, updateFunction, showIndicators = true) {
    _internal.window.svgId = svgId

    getWindowSize().then(current => {
      _internal.window.initialWidth = current.width
      _internal.window.initialHeight = current.height
    })

    document.addEventListener('mousedown', mouseDown)
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseUp)
    alacrity.onWindowResize(changeView)
    if (updateFunction) {
      _internal.update = updateFunction
    } else {
      _internal.update = peep
    }
    if (showIndicators) { 
      _internal.indicator = true 
      $(svgId).appendChild(svg.new('circle', { id: 'click-indicator', cx: 0, cy: 0, r: 2, fill: 'currentColor', 'fill-opacity': 0.2, 'stroke-opacity': 0 }))
      $(svgId).appendChild(svg.new('rect', { 
        id: 'view-edges', x: 5, y: 5, width: 95, height: 95, 
        stroke: 'currentColor', 'stroke-width': 1, 'stroke-dasharray': '20,10,5,5,5,10', 
        'fill': 'none', 'fill-opacity':0, 'stroke-opacity': 0.2 
      }))
    }
    updateWindow()
  }
  return {
    setup: setup,
    window: _internal.window,
    mouse: _internal.mouse
  }
}())
