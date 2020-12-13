# STLeko

## Todo
   * get both _lekoLekoCaligraphyStyle_ and _simpleCaligraphyStyle_ working
      * add to style objects/defaults:
         * Space between characters
         * Vertical or horizontal writing
         * Color
         * calculated/modified based on position:
            * Character offset in x and y
            * Character number in phrase/animation
   * make mockups of stretch goals in Gravit

### Later
   * figure out how to round corners (like say, making two points X% of a point-to-point distance away from the corner before and after the corner point and then lerping the corner point towards the point between those for various curves)
   * clicking on dictionary word below loads it into preview
      * only show the dictionary when drawing a single character
   * update the preview when the textbox changes, offer to load old code on startup if available
   * pre-animation:
      * Make a simple straight line segment that I can set to any % drawn
      * get that animating
      * draw multiples and have them animate sequentially
      * get the animation length relative to path length

## Animations
   * make sure all elements have unique IDs for animating
   * how to handle time offset:
      * give each path and animation a unique id="char-1-line-1", id="char-1-line-2" etc until "char-1-last-line"; that way it's possible to link together animations between characters as well as within characters (to say, draw an entire poem starting with the down right diagonal and ending with the box)
      * also give animations unique, predictable names so those can be synchronized/joined together, so "char-1-line-1-anim"
      * see: https://css-tricks.com/guide-svg-animations-smil/#naming-animations-and-synchronizing-them
   * animate stroke drawing with stroke dash size stroke-dasharray, and also offset the stroke position with stroke-dashoffset
      * see: https://css-tricks.com/svg-line-animation-works/
   * misc/specifics:
      * twinkle animation:
         * '<animate attributeType="CSS" attributeName="opacity" begin="0s" dur="'+duration+'" values="0; 1; 0" keyTimes="0; .5; 1" repeatCount="indefinite" />';
         * see: https://codepen.io/WanderingEnby/pen/qBBLZXO
      * What’s even more interesting about begin is that you can define values like click + 1s to start an animation one second after the element is clicked!
      * see: https://css-tricks.com/guide-svg-animations-smil/

## Maybe later
   * Ask efofexs for source images/svgs for sitelen telo?
   * Also offer support for making kamea sigils in the same format/1em squares
   * Make it so it's possible to pass emojis into the function and have them come out in tidy boxes/potentially alias to svgs for things like string and green circle (basically like, passing a string in that's not in the leko dict)

## Goal
   Make it so it's possible to draw multiple things in one character, for things like drop shadows, neon, and constellation styles
   (in a way, calligraphy *is* datavis, just really elaborate)

## Stretch goals:
   * use multiple calls to draw a large fancy character, a horizontal line, and then three vertical 'sentences' below inside a div
   * draw an entire leko style poem starting with the down right diagonal and ending with the box (and then optionally an attribution vertically on the right?)
   * draw a character in constellation mode in a large/full-page svg and display the definition to the side (including the sitelen telo character?)
      * sparkles for each point and then lines between, maybe some extra small sparkles
   * large neon sentence with glow and flicker, (toggle for horizontal/vertical)
   * click to translate: cycle through displaying word in roman letters/display english personal definition word/Sitilen telo character/emoji/draw character in stroke order
   * display a paragraph of Toki Pona dynamically in a single SVG block with support for (vertical) line wrapping, bold, and italics
   * dynamic animated tea timer with a STL countdown phrase where the colors change as it gets closer to 0
   * pencil effect
      * https://heredragonsabound.blogspot.com/2020/02/creating-pencil-effect-in-svg.html
   * a handwriting/sharpie version that squidges the line ends around and adds a bit of a random arc
