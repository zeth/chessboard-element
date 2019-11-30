// chessboard.js v@VERSION
// https://github.com/oakmac/chessboardjs/
//
// Copyright (c) 2019, Chris Oakman
// Released under the MIT license
// https://github.com/oakmac/chessboardjs/blob/master/LICENSE.md

// start anonymous scope
;(function () {
  'use strict'

  var $ = window['jQuery']

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  var COLUMNS = 'abcdefgh'.split('')
  var DEFAULT_DRAG_THROTTLE_RATE = 20
  var ELLIPSIS = '…'
  var MINIMUM_JQUERY_VERSION = '1.8.3'
  var RUN_ASSERTS = true
  var START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
  var START_POSITION = fenToObj(START_FEN)

  // default animation speeds
  var DEFAULT_APPEAR_SPEED = 200
  var DEFAULT_MOVE_SPEED = 200
  var DEFAULT_SNAPBACK_SPEED = 60
  var DEFAULT_SNAP_SPEED = 30
  var DEFAULT_TRASH_SPEED = 100

  // use unique class names to prevent clashing with anything else on the page
  // and simplify selectors
  // NOTE: these should never change
  var CSS = {}
  CSS['alpha'] = 'alpha-d2270'
  CSS['black'] = 'black-3c85d'
  CSS['board'] = 'board-b72b1'
  CSS['chessboard'] = 'chessboard-63f37'
  CSS['clearfix'] = 'clearfix-7da63'
  CSS['highlight1'] = 'highlight1-32417'
  CSS['highlight2'] = 'highlight2-9c5d2'
  CSS['notation'] = 'notation-322f9'
  CSS['numeric'] = 'numeric-fc462'
  CSS['piece'] = 'piece-417db'
  CSS['row'] = 'row-5277c'
  CSS['sparePieces'] = 'spare-pieces-7492f'
  CSS['sparePiecesBottom'] = 'spare-pieces-bottom-ae20f'
  CSS['sparePiecesTop'] = 'spare-pieces-top-4028b'
  CSS['square'] = 'square-55d63'
  CSS['white'] = 'white-1e1d7'

  // ---------------------------------------------------------------------------
  // Misc Util Functions
  // ---------------------------------------------------------------------------

  function throttle (f, interval, scope) {
    var timeout = 0
    var shouldFire = false
    var args = []

    var handleTimeout = function () {
      timeout = 0
      if (shouldFire) {
        shouldFire = false
        fire()
      }
    }

    var fire = function () {
      timeout = window.setTimeout(handleTimeout, interval)
      f.apply(scope, args)
    }

    return function (_args) {
      args = arguments
      if (!timeout) {
        fire()
      } else {
        shouldFire = true
      }
    }
  }

  // function debounce (f, interval, scope) {
  //   var timeout = 0
  //   return function (_args) {
  //     window.clearTimeout(timeout)
  //     var args = arguments
  //     timeout = window.setTimeout(function () {
  //       f.apply(scope, args)
  //     }, interval)
  //   }
  // }

  function uuid () {
    return 'xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function (c) {
      var r = (Math.random() * 16) | 0
      return r.toString(16)
    })
  }

  function deepCopy (thing) {
    return JSON.parse(JSON.stringify(thing))
  }

  function parseSemVer (version) {
    var tmp = version.split('.')
    return {
      major: parseInt(tmp[0], 10),
      minor: parseInt(tmp[1], 10),
      patch: parseInt(tmp[2], 10)
    }
  }

  // returns true if version is >= minimum
  function validSemanticVersion (version, minimum) {
    version = parseSemVer(version)
    minimum = parseSemVer(minimum)

    var versionNum = (version.major * 100000 * 100000) +
                     (version.minor * 100000) +
                     version.patch
    var minimumNum = (minimum.major * 100000 * 100000) +
                     (minimum.minor * 100000) +
                     minimum.patch

    return versionNum >= minimumNum
  }

  function interpolateTemplate (str, obj) {
    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) continue
      var keyTemplateStr = '{' + key + '}'
      var value = obj[key]
      while (str.indexOf(keyTemplateStr) !== -1) {
        str = str.replace(keyTemplateStr, value)
      }
    }
    return str
  }

  if (RUN_ASSERTS) {
    console.assert(interpolateTemplate('abc', {a: 'x'}) === 'abc')
    console.assert(interpolateTemplate('{a}bc', {}) === '{a}bc')
    console.assert(interpolateTemplate('{a}bc', {p: 'q'}) === '{a}bc')
    console.assert(interpolateTemplate('{a}bc', {a: 'x'}) === 'xbc')
    console.assert(interpolateTemplate('{a}bc{a}bc', {a: 'x'}) === 'xbcxbc')
    console.assert(interpolateTemplate('{a}{a}{b}', {a: 'x', b: 'y'}) === 'xxy')
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  function isString (s) {
    return typeof s === 'string'
  }

  function isFunction (f) {
    return typeof f === 'function'
  }

  function isInteger (n) {
    return typeof n === 'number' &&
           isFinite(n) &&
           Math.floor(n) === n
  }

  function validAnimationSpeed (speed) {
    if (speed === 'fast' || speed === 'slow') return true
    if (!isInteger(speed)) return false
    return speed >= 0
  }

  function validThrottleRate (rate) {
    return isInteger(rate) &&
           rate >= 1
  }

  function validMove (move) {
    // move should be a string
    if (!isString(move)) return false

    // move should be in the form of "e2-e4", "f6-d5"
    var squares = move.split('-')
    if (squares.length !== 2) return false

    return validSquare(squares[0]) && validSquare(squares[1])
  }

  function validSquare (square) {
    return isString(square) && square.search(/^[a-h][1-8]$/) !== -1
  }

  if (RUN_ASSERTS) {
    console.assert(validSquare('a1'))
    console.assert(validSquare('e2'))
    console.assert(!validSquare('D2'))
    console.assert(!validSquare('g9'))
    console.assert(!validSquare('a'))
    console.assert(!validSquare(true))
    console.assert(!validSquare(null))
    console.assert(!validSquare({}))
  }

  function validPieceCode (code) {
    return isString(code) && code.search(/^[bw][KQRNBP]$/) !== -1
  }

  if (RUN_ASSERTS) {
    console.assert(validPieceCode('bP'))
    console.assert(validPieceCode('bK'))
    console.assert(validPieceCode('wK'))
    console.assert(validPieceCode('wR'))
    console.assert(!validPieceCode('WR'))
    console.assert(!validPieceCode('Wr'))
    console.assert(!validPieceCode('a'))
    console.assert(!validPieceCode(true))
    console.assert(!validPieceCode(null))
    console.assert(!validPieceCode({}))
  }

  function validFen (fen) {
    if (!isString(fen)) return false

    // cut off any move, castling, etc info from the end
    // we're only interested in position information
    fen = fen.replace(/ .+$/, '')

    // expand the empty square numbers to just 1s
    fen = expandFenEmptySquares(fen)

    // FEN should be 8 sections separated by slashes
    var chunks = fen.split('/')
    if (chunks.length !== 8) return false

    // check each section
    for (var i = 0; i < 8; i++) {
      if (chunks[i].length !== 8 ||
          chunks[i].search(/[^kqrnbpKQRNBP1]/) !== -1) {
        return false
      }
    }

    return true
  }

  if (RUN_ASSERTS) {
    console.assert(validFen(START_FEN))
    console.assert(validFen('8/8/8/8/8/8/8/8'))
    console.assert(validFen('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R'))
    console.assert(validFen('3r3r/1p4pp/2nb1k2/pP3p2/8/PB2PN2/p4PPP/R4RK1 b - - 0 1'))
    console.assert(!validFen('3r3z/1p4pp/2nb1k2/pP3p2/8/PB2PN2/p4PPP/R4RK1 b - - 0 1'))
    console.assert(!validFen('anbqkbnr/8/8/8/8/8/PPPPPPPP/8'))
    console.assert(!validFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/'))
    console.assert(!validFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBN'))
    console.assert(!validFen('888888/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'))
    console.assert(!validFen('888888/pppppppp/74/8/8/8/PPPPPPPP/RNBQKBNR'))
    console.assert(!validFen({}))
  }

  function validPositionObject (pos) {
    if (!$.isPlainObject(pos)) return false

    for (var i in pos) {
      if (!pos.hasOwnProperty(i)) continue

      if (!validSquare(i) || !validPieceCode(pos[i])) {
        return false
      }
    }

    return true
  }

  if (RUN_ASSERTS) {
    console.assert(validPositionObject(START_POSITION))
    console.assert(validPositionObject({}))
    console.assert(validPositionObject({e2: 'wP'}))
    console.assert(validPositionObject({e2: 'wP', d2: 'wP'}))
    console.assert(!validPositionObject({e2: 'BP'}))
    console.assert(!validPositionObject({y2: 'wP'}))
    console.assert(!validPositionObject(null))
    console.assert(!validPositionObject('start'))
    console.assert(!validPositionObject(START_FEN))
  }

  function isTouchDevice () {
    return 'ontouchstart' in document.documentElement
  }

  function validJQueryVersion () {
    return typeof window.$ &&
           $.fn &&
           $.fn.jquery &&
           validSemanticVersion($.fn.jquery, MINIMUM_JQUERY_VERSION)
  }

  // ---------------------------------------------------------------------------
  // Chess Util Functions
  // ---------------------------------------------------------------------------

  // convert FEN piece code to bP, wK, etc
  function fenToPieceCode (piece) {
    // black piece
    if (piece.toLowerCase() === piece) {
      return 'b' + piece.toUpperCase()
    }

    // white piece
    return 'w' + piece.toUpperCase()
  }

  // convert bP, wK, etc code to FEN structure
  function pieceCodeToFen (piece) {
    var pieceCodeLetters = piece.split('')

    // white piece
    if (pieceCodeLetters[0] === 'w') {
      return pieceCodeLetters[1].toUpperCase()
    }

    // black piece
    return pieceCodeLetters[1].toLowerCase()
  }

  // convert FEN string to position object
  // returns false if the FEN string is invalid
  function fenToObj (fen) {
    if (!validFen(fen)) return false

    // cut off any move, castling, etc info from the end
    // we're only interested in position information
    fen = fen.replace(/ .+$/, '')

    var rows = fen.split('/')
    var position = {}

    var currentRow = 8
    for (var i = 0; i < 8; i++) {
      var row = rows[i].split('')
      var colIdx = 0

      // loop through each character in the FEN section
      for (var j = 0; j < row.length; j++) {
        // number / empty squares
        if (row[j].search(/[1-8]/) !== -1) {
          var numEmptySquares = parseInt(row[j], 10)
          colIdx = colIdx + numEmptySquares
        } else {
          // piece
          var square = COLUMNS[colIdx] + currentRow
          position[square] = fenToPieceCode(row[j])
          colIdx = colIdx + 1
        }
      }

      currentRow = currentRow - 1
    }

    return position
  }

  // position object to FEN string
  // returns false if the obj is not a valid position object
  function objToFen (obj) {
    if (!validPositionObject(obj)) return false

    var fen = ''

    var currentRow = 8
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        var square = COLUMNS[j] + currentRow

        // piece exists
        if (obj.hasOwnProperty(square)) {
          fen = fen + pieceCodeToFen(obj[square])
        } else {
          // empty space
          fen = fen + '1'
        }
      }

      if (i !== 7) {
        fen = fen + '/'
      }

      currentRow = currentRow - 1
    }

    // squeeze the empty numbers together
    fen = squeezeFenEmptySquares(fen)

    return fen
  }

  if (RUN_ASSERTS) {
    console.assert(objToFen(START_POSITION) === START_FEN)
    console.assert(objToFen({}) === '8/8/8/8/8/8/8/8')
    console.assert(objToFen({a2: 'wP', 'b2': 'bP'}) === '8/8/8/8/8/8/Pp6/8')
  }

  function squeezeFenEmptySquares (fen) {
    return fen.replace(/11111111/g, '8')
      .replace(/1111111/g, '7')
      .replace(/111111/g, '6')
      .replace(/11111/g, '5')
      .replace(/1111/g, '4')
      .replace(/111/g, '3')
      .replace(/11/g, '2')
  }

  function expandFenEmptySquares (fen) {
    return fen.replace(/8/g, '11111111')
      .replace(/7/g, '1111111')
      .replace(/6/g, '111111')
      .replace(/5/g, '11111')
      .replace(/4/g, '1111')
      .replace(/3/g, '111')
      .replace(/2/g, '11')
  }

  // returns the distance between two squares
  function squareDistance (squareA, squareB) {
    var squareAArray = squareA.split('')
    var squareAx = COLUMNS.indexOf(squareAArray[0]) + 1
    var squareAy = parseInt(squareAArray[1], 10)

    var squareBArray = squareB.split('')
    var squareBx = COLUMNS.indexOf(squareBArray[0]) + 1
    var squareBy = parseInt(squareBArray[1], 10)

    var xDelta = Math.abs(squareAx - squareBx)
    var yDelta = Math.abs(squareAy - squareBy)

    if (xDelta >= yDelta) return xDelta
    return yDelta
  }

  // returns the square of the closest instance of piece
  // returns false if no instance of piece is found in position
  function findClosestPiece (position, piece, square) {
    // create array of closest squares from square
    var closestSquares = createRadius(square)

    // search through the position in order of distance for the piece
    for (var i = 0; i < closestSquares.length; i++) {
      var s = closestSquares[i]

      if (position.hasOwnProperty(s) && position[s] === piece) {
        return s
      }
    }

    return false
  }

  // returns an array of closest squares from square
  function createRadius (square) {
    var squares = []

    // calculate distance of all squares
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        var s = COLUMNS[i] + (j + 1)

        // skip the square we're starting from
        if (square === s) continue

        squares.push({
          square: s,
          distance: squareDistance(square, s)
        })
      }
    }

    // sort by distance
    squares.sort(function (a, b) {
      return a.distance - b.distance
    })

    // just return the square code
    var surroundingSquares = []
    for (i = 0; i < squares.length; i++) {
      surroundingSquares.push(squares[i].square)
    }

    return surroundingSquares
  }

  // given a position and a set of moves, return a new position
  // with the moves executed
  function calculatePositionFromMoves (position, moves) {
    var newPosition = deepCopy(position)

    for (var i in moves) {
      if (!moves.hasOwnProperty(i)) continue

      // skip the move if the position doesn't have a piece on the source square
      if (!newPosition.hasOwnProperty(i)) continue

      var piece = newPosition[i]
      delete newPosition[i]
      newPosition[moves[i]] = piece
    }

    return newPosition
  }

  // TODO: add some asserts here for calculatePositionFromMoves

  // ---------------------------------------------------------------------------
  // HTML
  // ---------------------------------------------------------------------------

  function buildContainerHTML (hasSparePieces) {
    var html = '<div class="{chessboard}">'

    if (hasSparePieces) {
      html += '<div class="{sparePieces} {sparePiecesTop}"></div>'
    }

    html += '<div class="{board}"></div>'

    if (hasSparePieces) {
      html += '<div class="{sparePieces} {sparePiecesBottom}"></div>'
    }

    html += '</div>'

    return interpolateTemplate(html, CSS)
  }

  // ---------------------------------------------------------------------------
  // Config
  // ---------------------------------------------------------------------------

  // validate config / set default options
  function expandConfig (config) {
    // default for orientation is white
    if (config.orientation !== 'black') config.orientation = 'white'

    // default for showNotation is true
    if (config.showNotation !== false) config.showNotation = true

    // default for draggable is false
    if (config.draggable !== true) config.draggable = false

    // default for dropOffBoard is 'snapback'
    if (config.dropOffBoard !== 'trash') config.dropOffBoard = 'snapback'

    // default for sparePieces is false
    if (config.sparePieces !== true) config.sparePieces = false

    // draggable must be true if sparePieces is enabled
    if (config.sparePieces) config.draggable = true

    // default piece theme is wikipedia
    if (!config.hasOwnProperty('pieceTheme') ||
        (!isString(config.pieceTheme) && !isFunction(config.pieceTheme))) {
      config.pieceTheme = 'img/chesspieces/wikipedia/{piece}.png'
    }

    // animation speeds
    if (!validAnimationSpeed(config.appearSpeed)) config.appearSpeed = DEFAULT_APPEAR_SPEED
    if (!validAnimationSpeed(config.moveSpeed)) config.moveSpeed = DEFAULT_MOVE_SPEED
    if (!validAnimationSpeed(config.snapbackSpeed)) config.snapbackSpeed = DEFAULT_SNAPBACK_SPEED
    if (!validAnimationSpeed(config.snapSpeed)) config.snapSpeed = DEFAULT_SNAP_SPEED
    if (!validAnimationSpeed(config.trashSpeed)) config.trashSpeed = DEFAULT_TRASH_SPEED

    // throttle rate
    if (!validThrottleRate(config.dragThrottleRate)) config.dragThrottleRate = DEFAULT_DRAG_THROTTLE_RATE

    return config
  }

  // ---------------------------------------------------------------------------
  // Dependencies
  // ---------------------------------------------------------------------------

  // check for a compatible version of jQuery
  function checkJQuery () {
    if (!validJQueryVersion()) {
      var errorMsg = 'Chessboard Error 1005: Unable to find a valid version of jQuery. ' +
        'Please include jQuery ' + MINIMUM_JQUERY_VERSION + ' or higher on the page' +
        '\n\n' +
        'Exiting' + ELLIPSIS
      window.alert(errorMsg)
      return false
    }

    return true
  }

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  class ChessBoardElement extends HTMLElement {

    // TODO: enable class fields
    // TODO: fold this into the element class itself
    // widget = {};

    // config = {};

    // currentPosition = {};

    constructor () {
      super()
      this.attachShadow({mode: 'open'});
      const shadowRoot = this.shadowRoot;
      shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
          }
        </style>
        <link rel="stylesheet" href="css/chessboard.css">
        <div id="container"></div>
      `;

      // first things first: check basic dependencies
      if (!checkJQuery()) {
        throw new Error('no jQuery');
      }

      const $container = this.$container = $(shadowRoot.querySelector('#container'));

      // ensure the config object is what we expect
      const config = this.config = expandConfig({});

      const positionAttribute = this.getAttribute('position');
      if (positionAttribute !== null) {
        config.position = positionAttribute;
      }

      if (this.hasAttribute('hide-notation')) {
        config.showNotation = false;
      }

      const orientationAttribute = this.getAttribute('orientation');
      if (orientationAttribute !== null) {
        config.orientation = orientationAttribute;
      }

      if (this.hasAttribute('draggable-pieces')) {
        config.draggable = true;
      }

      const dropOffBoardAttribute = this.getAttribute('drop-off-board');
      if (dropOffBoardAttribute !== null) {
        config.dropOffBoard = dropOffBoardAttribute;
      }

      const pieceThemeAttribute = this.getAttribute('piece-theme');
      if (pieceThemeAttribute !== null) {
        config.pieceTheme = pieceThemeAttribute;
      }

      const moveSpeedAttribute = this.getAttribute('move-speed');
      if (moveSpeedAttribute !== null) {
        config.moveSpeed = moveSpeedAttribute;
      }

      const snapbackSpeedAttribute = this.getAttribute('snapback-speed');
      if (snapbackSpeedAttribute !== null) {
        config.snapbackSpeed = snapbackSpeedAttribute;
      }

      const snapSpeedAttribute = this.getAttribute('snap-speed');
      if (snapSpeedAttribute !== null) {
        config.snapSpeed = snapSpeedAttribute;
      }

      const trashSpeedAttribute = this.getAttribute('trash-speed');
      if (trashSpeedAttribute !== null) {
        config.trashSpeed = trashSpeedAttribute;
      }

      const appearSpeedAttribute = this.getAttribute('appear-speed');
      if (appearSpeedAttribute !== null) {
        config.appearSpeed = appearSpeedAttribute;
      }

      if (this.hasAttribute('spare-pieces')) {
        config.sparePieces = true;
      }
      
      // DOM elements
      this.$board = null;
      var $draggedPiece = null
      var $sparePiecesTop = null
      var $sparePiecesBottom = null

      // constructor return object
      const widget = this.widget = {};

      // -------------------------------------------------------------------------
      // Stateful
      // -------------------------------------------------------------------------

      this.boardBorderSize = 2;
      this.currentOrientation = 'white';
      this.currentPosition = {};
      var draggedPiece = null
      var draggedPieceLocation = null
      var draggedPieceSource = null
      var isDragging = false
      var sparePiecesElsIds = {}
      var squareElsIds = {}
      var squareElsOffsets = {}
      this.squareSize = 16;

      // -------------------------------------------------------------------------
      // Validation / Errors
      // -------------------------------------------------------------------------

      const error = (code, msg, obj) => {
        // do nothing if showErrors is not set
        if (
          config.hasOwnProperty('showErrors') !== true ||
            config.showErrors === false
        ) {
          return
        }

        var errorText = 'Chessboard Error ' + code + ': ' + msg

        // print to console
        if (
          config.showErrors === 'console' &&
            typeof console === 'object' &&
            typeof console.log === 'function'
        ) {
          console.log(errorText)
          if (arguments.length >= 2) {
            console.log(obj)
          }
          return
        }

        // alert errors
        if (config.showErrors === 'alert') {
          if (obj) {
            errorText += '\n\n' + JSON.stringify(obj)
          }
          window.alert(errorText)
          return
        }

        // custom function
        if (isFunction(config.showErrors)) {
          config.showErrors(code, msg, obj)
        }
      }

      const setInitialState = () => {
        this.currentOrientation = config.orientation;

        // make sure position is valid
        if (config.hasOwnProperty('position')) {
          if (config.position === 'start') {
            this.currentPosition = deepCopy(START_POSITION)
          } else if (validFen(config.position)) {
            this.currentPosition = fenToObj(config.position)
          } else if (validPositionObject(config.position)) {
            this.currentPosition = deepCopy(config.position)
          } else {
            error(
              7263,
              'Invalid value passed to config.position.',
              config.position
            )
          }
        }
      }

      // -------------------------------------------------------------------------
      // DOM Misc
      // -------------------------------------------------------------------------

      // create random IDs for elements
      const createElIds = () => {
        // squares on the board
        for (var i = 0; i < COLUMNS.length; i++) {
          for (var j = 1; j <= 8; j++) {
            var square = COLUMNS[i] + j
            squareElsIds[square] = square + '-' + uuid()
          }
        }

        // spare pieces
        var pieces = 'KQRNBP'.split('')
        for (i = 0; i < pieces.length; i++) {
          var whitePiece = 'w' + pieces[i]
          var blackPiece = 'b' + pieces[i]
          sparePiecesElsIds[whitePiece] = whitePiece + '-' + uuid()
          sparePiecesElsIds[blackPiece] = blackPiece + '-' + uuid()
        }
      }

      // -------------------------------------------------------------------------
      // Markup Building
      // -------------------------------------------------------------------------

      const buildBoardHTML = (orientation) => {
        if (orientation !== 'black') {
          orientation = 'white'
        }

        var html = ''

        // algebraic notation / orientation
        var alpha = deepCopy(COLUMNS)
        var row = 8
        if (orientation === 'black') {
          alpha.reverse()
          row = 1
        }

        var squareColor = 'white'
        for (var i = 0; i < 8; i++) {
          html += '<div class="{row}">'
          for (var j = 0; j < 8; j++) {
            var square = alpha[j] + row

            html += '<div class="{square} ' + CSS[squareColor] + ' ' +
              'square-' + square + '" ' +
              'style="width:' + this.squareSize + 'px;height:' + this.squareSize + 'px;" ' +
              'id="' + squareElsIds[square] + '" ' +
              'data-square="' + square + '">'

            if (config.showNotation) {
              // alpha notation
              if ((orientation === 'white' && row === 1) ||
                  (orientation === 'black' && row === 8)) {
                html += '<div class="{notation} {alpha}">' + alpha[j] + '</div>'
              }

              // numeric notation
              if (j === 0) {
                html += '<div class="{notation} {numeric}">' + row + '</div>'
              }
            }

            html += '</div>' // end .square

            squareColor = (squareColor === 'white') ? 'black' : 'white'
          }
          html += '<div class="{clearfix}"></div></div>'

          squareColor = (squareColor === 'white') ? 'black' : 'white'

          if (orientation === 'white') {
            row = row - 1
          } else {
            row = row + 1
          }
        }

        return interpolateTemplate(html, CSS)
      }

      const buildPieceImgSrc = (piece) => {
        if (isFunction(config.pieceTheme)) {
          return config.pieceTheme(piece)
        }

        if (isString(config.pieceTheme)) {
          return interpolateTemplate(config.pieceTheme, {piece: piece})
        }

        // NOTE: this should never happen
        error(8272, 'Unable to build image source for config.pieceTheme.')
        return ''
      };

      const buildPieceHTML = (piece, hidden, id) => {
        var html = '<img src="' + buildPieceImgSrc(piece) + '" '
        if (isString(id) && id !== '') {
          html += 'id="' + id + '" '
        }
        html += 'alt="" ' +
          'class="{piece}" ' +
          'data-piece="' + piece + '" ' +
          'style="width:' + this.squareSize + 'px;' + 'height:' + this.squareSize + 'px;'

        if (hidden) {
          html += 'display:none;'
        }

        html += '" />'

        return interpolateTemplate(html, CSS)
      };

      const buildSparePiecesHTML = (color) => {
        var pieces = ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP']
        if (color === 'black') {
          pieces = ['bK', 'bQ', 'bR', 'bB', 'bN', 'bP']
        }

        var html = ''
        for (var i = 0; i < pieces.length; i++) {
          html += buildPieceHTML(pieces[i], false, sparePiecesElsIds[pieces[i]])
        }

        return html;
      };

      // -------------------------------------------------------------------------
      // Animations
      // -------------------------------------------------------------------------

      const animateSquareToSquare = (src, dest, piece, completeFn) => {
        // get information about the source and destination squares
        var $srcSquare = $('#' + squareElsIds[src], shadowRoot);
        var srcSquarePosition = $srcSquare.offset();
        var $destSquare = $('#' + squareElsIds[dest], shadowRoot);
        var destSquarePosition = $destSquare.offset();

        // create the animated piece and absolutely position it
        // over the source square
        var animatedPieceId = uuid()
        $('body').append(buildPieceHTML(piece, true, animatedPieceId))
        var $animatedPiece = $('#' + animatedPieceId)
        $animatedPiece.css({
          display: '',
          position: 'absolute',
          top: srcSquarePosition.top,
          left: srcSquarePosition.left
        })

        // remove original piece from source square
        $srcSquare.find('.' + CSS.piece).remove()

        const onFinishAnimation1 = () => {
          // add the "real" piece to the destination square
          $destSquare.append(buildPieceHTML(piece))

          // remove the animated piece
          $animatedPiece.remove()

          // run complete function
          if (isFunction(completeFn)) {
            completeFn()
          }
        }

        // animate the piece to the destination square
        var opts = {
          duration: config.moveSpeed,
          complete: onFinishAnimation1
        }
        $animatedPiece.animate(destSquarePosition, opts)
      }

      const animateSparePieceToSquare = (piece, dest, completeFn) => {
        var srcOffset = $('#' + sparePiecesElsIds[piece], shadowRoot).offset()
        var $destSquare = $('#' + squareElsIds[dest], shadowRoot)
        var destOffset = $destSquare.offset()

        // create the animate piece
        var pieceId = uuid()
        $('body').append(buildPieceHTML(piece, true, pieceId))
        var $animatedPiece = $('#' + pieceId, shadowRoot)
        $animatedPiece.css({
          display: '',
          position: 'absolute',
          left: srcOffset.left,
          top: srcOffset.top
        })

        // on complete
        const onFinishAnimation2 = () => {
          // add the "real" piece to the destination square
          $destSquare.find('.' + CSS.piece).remove()
          $destSquare.append(buildPieceHTML(piece))

          // remove the animated piece
          $animatedPiece.remove()

          // run complete function
          if (isFunction(completeFn)) {
            completeFn()
          }
        }

        // animate the piece to the destination square
        var opts = {
          duration: config.moveSpeed,
          complete: onFinishAnimation2
        }
        $animatedPiece.animate(destOffset, opts)
      }

      // execute an array of animations
      const doAnimations = (animations, oldPos, newPos) => {
        if (animations.length === 0) return

        var numFinished = 0
        const onFinishAnimation3 = () => {
          // exit if all the animations aren't finished
          numFinished = numFinished + 1
          if (numFinished !== animations.length) return

          drawPositionInstant()

          // run their onMoveEnd function
          if (isFunction(config.onMoveEnd)) {
            config.onMoveEnd(deepCopy(oldPos), deepCopy(newPos))
          }
        }

        for (const animation of animations) {
          // clear a piece
          if (animation.type === 'clear') {
            $('#' + squareElsIds[animation.square] + ' .' + CSS.piece, shadowRoot)
              .fadeOut(config.trashSpeed, onFinishAnimation3)

          // add a piece with no spare pieces - fade the piece onto the square
          } else if (animation.type === 'add' && !config.sparePieces) {
            $('#' + squareElsIds[animation.square], shadowRoot)
              .append(buildPieceHTML(animation.piece, true))
              .find('.' + CSS.piece)
              .fadeIn(config.appearSpeed, onFinishAnimation3)

          // add a piece with spare pieces - animate from the spares
          } else if (animation.type === 'add' && config.sparePieces) {
            animateSparePieceToSquare(animation.piece, animation.square, onFinishAnimation3)

          // move a piece from squareA to squareB
          } else if (animation.type === 'move') {
            animateSquareToSquare(animation.source, animation.destination, animation.piece, onFinishAnimation3)
          }
        }
      }

      // calculate an array of animations that need to happen in order to get
      // from pos1 to pos2
      const calculateAnimations = (pos1, pos2) => {
        // make copies of both
        pos1 = deepCopy(pos1)
        pos2 = deepCopy(pos2)

        var animations = []
        var squaresMovedTo = {}

        // remove pieces that are the same in both positions
        for (var i in pos2) {
          if (!pos2.hasOwnProperty(i)) continue

          if (pos1.hasOwnProperty(i) && pos1[i] === pos2[i]) {
            delete pos1[i]
            delete pos2[i]
          }
        }

        // find all the "move" animations
        for (i in pos2) {
          if (!pos2.hasOwnProperty(i)) continue

          var closestPiece = findClosestPiece(pos1, pos2[i], i)
          if (closestPiece) {
            animations.push({
              type: 'move',
              source: closestPiece,
              destination: i,
              piece: pos2[i]
            })

            delete pos1[closestPiece]
            delete pos2[i]
            squaresMovedTo[i] = true
          }
        }

        // "add" animations
        for (i in pos2) {
          if (!pos2.hasOwnProperty(i)) continue

          animations.push({
            type: 'add',
            square: i,
            piece: pos2[i]
          })

          delete pos2[i]
        }

        // "clear" animations
        for (i in pos1) {
          if (!pos1.hasOwnProperty(i)) continue

          // do not clear a piece if it is on a square that is the result
          // of a "move", ie: a piece capture
          if (squaresMovedTo.hasOwnProperty(i)) continue

          animations.push({
            type: 'clear',
            square: i,
            piece: pos1[i]
          })

          delete pos1[i]
        }

        return animations
      }

      // -------------------------------------------------------------------------
      // Control Flow
      // -------------------------------------------------------------------------

      const drawPositionInstant = () => {
        // clear the board
        this.$board.find('.' + CSS.piece).remove()

        // add the pieces
        for (const i in this.currentPosition) {
          if (!this.currentPosition.hasOwnProperty(i)) {
            continue;
          }
          const pieceHTML = buildPieceHTML(this.currentPosition[i]);
          const square = shadowRoot.querySelector('#' + squareElsIds[i]);
          square.insertAdjacentHTML('beforeend', pieceHTML);
        }
      }
      this.drawPositionInstant = drawPositionInstant;

      // TODO: convert to method
      const drawBoard = () => {
        this.$board.html(buildBoardHTML(this.currentOrientation, this.squareSize, config.showNotation))
        drawPositionInstant()

        if (config.sparePieces) {
          if (this.currentOrientation === 'white') {
            $sparePiecesTop.html(buildSparePiecesHTML('black'))
            $sparePiecesBottom.html(buildSparePiecesHTML('white'))
          } else {
            $sparePiecesTop.html(buildSparePiecesHTML('white'))
            $sparePiecesBottom.html(buildSparePiecesHTML('black'))
          }
        }
      }
      this.drawBoard = drawBoard;

      const setCurrentPosition = (position) => {
        var oldPos = deepCopy(this.currentPosition)
        var newPos = deepCopy(position)
        var oldFen = objToFen(oldPos)
        var newFen = objToFen(newPos)

        // do nothing if no change in position
        if (oldFen === newFen) return

        // Fire change event
        this.dispatchEvent(new CustomEvent('change', {
          bubbles: true,
          detail: {
            value: newPos,
            oldValue: oldPos,
          },
        }));

        // update state
        this.currentPosition = position
      }

      const isXYOnSquare = (x, y) => {
        for (var i in squareElsOffsets) {
          if (!squareElsOffsets.hasOwnProperty(i)) continue

          var s = squareElsOffsets[i]
          if (x >= s.left &&
              x < s.left + this.squareSize &&
              y >= s.top &&
              y < s.top + this.squareSize) {
            return i
          }
        }

        return 'offboard'
      };

      // records the XY coords of every square into memory
      const captureSquareOffsets = () => {
        squareElsOffsets = {}

        for (var i in squareElsIds) {
          if (!squareElsIds.hasOwnProperty(i)) continue

          const square = shadowRoot.querySelector(`#${squareElsIds[i]}`);
          const rect = square.getBoundingClientRect();
          // emulates jQuery's offset()
          squareElsOffsets[i] = {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft
          };
        }
      }

      const removeSquareHighlights = () => {
        this.$board
          .find('.' + CSS.square)
          .removeClass(CSS.highlight1 + ' ' + CSS.highlight2)
      }

      const snapbackDraggedPiece = () => {
        // there is no "snapback" for spare pieces
        if (draggedPieceSource === 'spare') {
          trashDraggedPiece()
          return
        }

        removeSquareHighlights();

        // animation complete
        const complete = () => {
          drawPositionInstant()
          $draggedPiece.css('display', 'none')

          this.dispatchEvent(new CustomEvent('snapback-end', {
            bubbles: true,
            detail: {
              piece: draggedPiece,
              square: draggedPieceSource,
              position: deepCopy(this.currentPosition),
              orientation: this.currentOrientation,
            },
          }));
        }

        // get source square position
        const square = shadowRoot.querySelector(`#${squareElsIds[draggedPieceSource]}`);
        const rect = square.getBoundingClientRect();
        const sourceSquarePosition = {
          top: rect.top + document.body.scrollTop,
          left: rect.left + document.body.scrollLeft
        };

        // animate the piece to the target square
        var opts = {
          duration: config.snapbackSpeed,
          complete: complete
        }
        $draggedPiece.animate(sourceSquarePosition, opts)

        // set state
        isDragging = false
      }

      const trashDraggedPiece = () => {
        removeSquareHighlights()

        // remove the source piece
        var newPosition = deepCopy(this.currentPosition)
        delete newPosition[draggedPieceSource]
        setCurrentPosition(newPosition)

        // redraw the position
        drawPositionInstant()

        // hide the dragged piece
        $draggedPiece.fadeOut(config.trashSpeed)

        // set state
        isDragging = false
      }

      const dropDraggedPieceOnSquare = (square) => {
        removeSquareHighlights()

        // update position
        var newPosition = deepCopy(this.currentPosition)
        delete newPosition[draggedPieceSource]
        newPosition[square] = draggedPiece
        setCurrentPosition(newPosition)

        // get target square information
        const targetSquare = shadowRoot.querySelector(`#${squareElsIds[square]}`);
        const rect = targetSquare.getBoundingClientRect();
        const targetSquarePosition = {
          top: rect.top + document.body.scrollTop,
          left: rect.left + document.body.scrollLeft
        };

        // animation complete
        const onAnimationComplete = () => {
          drawPositionInstant()
          $draggedPiece.css('display', 'none')

          // execute their onSnapEnd function
          if (isFunction(config.onSnapEnd)) {
            config.onSnapEnd(draggedPieceSource, square, draggedPiece)
          }
        }

        // snap the piece to the target square
        var opts = {
          duration: config.snapSpeed,
          complete: onAnimationComplete
        }
        $draggedPiece.animate(targetSquarePosition, opts)

        // set state
        isDragging = false
      }

      const beginDraggingPiece = (source, piece, x, y) => {
        // Fire cancalable drag-start event
        const event = new CustomEvent('drag-start', {
          bubbles: true,
          cancelable: true,
          detail: {
            source,
            piece,
            position: deepCopy(this.currentPosition),
            orientation: this.currentOrientation,
          }
        });
        this.dispatchEvent(event);
        if (event.defaultPrevented) {
          return;
        }

        // set state
        isDragging = true
        draggedPiece = piece
        draggedPieceSource = source

        // if the piece came from spare pieces, location is offboard
        if (source === 'spare') {
          draggedPieceLocation = 'offboard'
        } else {
          draggedPieceLocation = source
        }

        // capture the x, y coords of all squares in memory
        captureSquareOffsets()

        // create the dragged piece
        $draggedPiece.attr('src', buildPieceImgSrc(piece)).css({
          display: '',
          position: 'absolute',
          left: x - this.squareSize / 2,
          top: y - this.squareSize / 2
        })

        if (source !== 'spare') {
          // highlight the source square and hide the piece
          const sourceSquare = shadowRoot.querySelector(`#${squareElsIds[source]}`);
          sourceSquare.classList.add(CSS.highlight1);
          const pieces = sourceSquare.querySelectorAll('.' + CSS.piece);
          pieces.forEach((piece) => {
            piece.style.display = 'none';
          });
        }
      }

      const updateDraggedPiece = (x, y) => {
        // put the dragged piece over the mouse cursor
        const draggedPieceElement = $draggedPiece.get()[0];
        draggedPieceElement.style.left = `${x - this.squareSize / 2}px`;
        draggedPieceElement.style.top = `${y - this.squareSize / 2}px`;

        // get location
        const location = isXYOnSquare(x, y);

        // do nothing if the location has not changed
        if (location === draggedPieceLocation) {
          return;
        }

        // remove highlight from previous square
        if (validSquare(draggedPieceLocation)) {
          const previousSquare = shadowRoot.querySelector('#' + squareElsIds[draggedPieceLocation]);
          previousSquare.classList.remove(CSS.highlight2);
        }

        // add highlight to new square
        if (validSquare(location)) {
          const locationSquare = shadowRoot.querySelector('#' + squareElsIds[location]);
          locationSquare.classList.add(CSS.highlight2);
        }

        this.dispatchEvent(new CustomEvent('drag-move', {
          bubbles: true,
          detail: {
            newLocation: location,
            oldLocation: draggedPieceLocation,
            source: draggedPieceSource,
            piece: draggedPiece,
            position: deepCopy(this.currentPosition),
            orientation: this.currentOrientation,
          },
        }));

        // update state
        draggedPieceLocation = location;
      }

      const stopDraggedPiece = (location) => {
        // determine what the action should be
        let action = 'drop'
        if (location === 'offboard' && config.dropOffBoard === 'snapback') {
          action = 'snapback';
        }
        if (location === 'offboard' && config.dropOffBoard === 'trash') {
          action = 'trash';
        }

        // run their onDrop function, which can potentially change the drop action
        const newPosition = deepCopy(this.currentPosition);

        // source piece is a spare piece and position is off the board
        // if (draggedPieceSource === 'spare' && location === 'offboard') {...}
        // position has not changed; do nothing

        // source piece is a spare piece and position is on the board
        if (draggedPieceSource === 'spare' && validSquare(location)) {
          // add the piece to the board
          newPosition[location] = draggedPiece
        }

        // source piece was on the board and position is off the board
        if (validSquare(draggedPieceSource) && location === 'offboard') {
          // remove the piece from the board
          delete newPosition[draggedPieceSource]
        }

        // source piece was on the board and position is on the board
        if (validSquare(draggedPieceSource) && validSquare(location)) {
          // move the piece
          delete newPosition[draggedPieceSource]
          newPosition[location] = draggedPiece
        }

        const oldPosition = deepCopy(this.currentPosition)

        const dropEvent = new CustomEvent('drop', {
          bubbles: true,
          detail: {
            source: draggedPieceSource,
            target: location,
            piece: draggedPiece,
            newPosition,
            oldPosition,
            orientation: this.currentOrientation,
            setAction(a) {
              action = a;
            }
          },
        });
        this.dispatchEvent(dropEvent);

        // do it!
        if (action === 'snapback') {
          snapbackDraggedPiece()
        } else if (action === 'trash') {
          trashDraggedPiece()
        } else if (action === 'drop') {
          dropDraggedPieceOnSquare(location)
        }
      }

      // -------------------------------------------------------------------------
      // Public Methods
      // -------------------------------------------------------------------------

      widget.position = (position, useAnimation) => {
        // no arguments, return the current position
        if (position === undefined) {
          return deepCopy(this.currentPosition)
        }

        // get position as FEN
        if (isString(position) && position.toLowerCase() === 'fen') {
          return objToFen(this.currentPosition)
        }

        // start position
        if (isString(position) && position.toLowerCase() === 'start') {
          position = deepCopy(START_POSITION)
        }

        // convert FEN to position object
        if (validFen(position)) {
          position = fenToObj(position)
        }

        // validate position object
        if (!validPositionObject(position)) {
          error(6482, 'Invalid value passed to the position method.', position)
          return
        }

        // default for useAnimations is true
        if (useAnimation !== false) useAnimation = true

        if (useAnimation) {
          // start the animations
          var animations = calculateAnimations(this.currentPosition, position)
          doAnimations(animations, this.currentPosition, position)

          // set the new position
          setCurrentPosition(position)
        } else {
          // instant update
          setCurrentPosition(position)
          drawPositionInstant()
        }
      }

      // -------------------------------------------------------------------------
      // Browser Events
      // -------------------------------------------------------------------------

      const mousedownSquare = (e) => {
        // do nothing if we're not draggable
        if (!config.draggable) {
          return;
        }

        // do nothing if there is no piece on this square
        const squareEl = e.target.closest('[data-square]');
        const square = squareEl.getAttribute('data-square');
        if (!validSquare(square)) {
          return;
        }
        if (!this.currentPosition.hasOwnProperty(square)) {
          return;
        }
        beginDraggingPiece(square, this.currentPosition[square], e.pageX, e.pageY)
      }

      const touchstartSquare = (e) => {
        // do nothing if we're not draggable
        if (!config.draggable) {
          return;
        }

        // do nothing if there is no piece on this square
        const squareEl = e.target.closest('[data-square]');
        const square = squareEl.getAttribute('data-square');
        if (!validSquare(square)) {
          return;
        }
        if (!this.currentPosition.hasOwnProperty(square)) {
          return;
        }

        e = e.originalEvent;
        beginDraggingPiece(
          square,
          this.currentPosition[square],
          e.changedTouches[0].pageX,
          e.changedTouches[0].pageY
        );
      }

      function mousedownSparePiece (evt) {
        // do nothing if sparePieces is not enabled
        if (!config.sparePieces) return

        var piece = $(this).attr('data-piece')

        beginDraggingPiece('spare', piece, evt.pageX, evt.pageY)
      }

      function touchstartSparePiece (e) {
        // do nothing if sparePieces is not enabled
        if (!config.sparePieces) return

        var piece = $(this).attr('data-piece')

        e = e.originalEvent
        beginDraggingPiece(
          'spare',
          piece,
          e.changedTouches[0].pageX,
          e.changedTouches[0].pageY
        )
      }

      function mousemoveWindow (evt) {
        if (isDragging) {
          updateDraggedPiece(evt.pageX, evt.pageY)
        }
      }

      var throttledMousemoveWindow = throttle(mousemoveWindow, config.dragThrottleRate)

      function touchmoveWindow (evt) {
        // do nothing if we are not dragging a piece
        if (!isDragging) return

        // prevent screen from scrolling
        evt.preventDefault()

        updateDraggedPiece(evt.originalEvent.changedTouches[0].pageX,
          evt.originalEvent.changedTouches[0].pageY)
      }

      var throttledTouchmoveWindow = throttle(touchmoveWindow, config.dragThrottleRate)

      function mouseupWindow (evt) {
        // do nothing if we are not dragging a piece
        if (!isDragging) return

        // get the location
        var location = isXYOnSquare(evt.pageX, evt.pageY)

        stopDraggedPiece(location)
      }

      function touchendWindow (evt) {
        // do nothing if we are not dragging a piece
        if (!isDragging) return

        // get the location
        var location = isXYOnSquare(evt.originalEvent.changedTouches[0].pageX,
          evt.originalEvent.changedTouches[0].pageY)

        stopDraggedPiece(location)
      }

      const mouseenterSquare = (evt) => {
        // do not fire this event if we are dragging a piece
        // NOTE: this should never happen, but it's a safeguard
        if (isDragging) return

        // exit if they did not provide a onMouseoverSquare function
        if (!isFunction(config.onMouseoverSquare)) return

        // get the square
        var square = $(evt.currentTarget).attr('data-square')

        // NOTE: this should never happen; defensive
        if (!validSquare(square)) return

        // get the piece on this square
        var piece = false
        if (this.currentPosition.hasOwnProperty(square)) {
          piece = this.currentPosition[square]
        }

        // execute their function
        config.onMouseoverSquare(square, piece, deepCopy(this.currentPosition), this.currentOrientation)
      }

      const mouseleaveSquare = (evt) => {
        // do not fire this event if we are dragging a piece
        // NOTE: this should never happen, but it's a safeguard
        if (isDragging) return

        // exit if they did not provide an onMouseoutSquare function
        if (!isFunction(config.onMouseoutSquare)) return

        // get the square
        var square = $(evt.currentTarget).attr('data-square')

        // NOTE: this should never happen; defensive
        if (!validSquare(square)) return

        // get the piece on this square
        var piece = false
        if (this.currentPosition.hasOwnProperty(square)) {
          piece = this.currentPosition[square]
        }

        // execute their function
        config.onMouseoutSquare(square, piece, deepCopy(this.currentPosition), this.currentOrientation)
      }

      // -------------------------------------------------------------------------
      // Initialization
      // -------------------------------------------------------------------------

      const addEvents = () => {
        // prevent "image drag"
        document.body.addEventListener('mousedown', (e) => {
          if (e.target.matches('.' + CSS.piece)) {
            e.preventDefault();
          }
        })
        document.body.addEventListener('mousemove', (e) => {
          if (e.target.matches('.' + CSS.piece)) {
            e.preventDefault();
          }
        })
        // $('body').on('mousedown mousemove', '.' + CSS.piece, stopDefault)

        // mouse drag pieces
        this.$board.on('mousedown', '.' + CSS.square, mousedownSquare)
        $container.on('mousedown', '.' + CSS.sparePieces + ' .' + CSS.piece, mousedownSparePiece)

        // mouse enter / leave square
        this.$board
          .on('mouseenter', '.' + CSS.square, mouseenterSquare)
          .on('mouseleave', '.' + CSS.square, mouseleaveSquare)

        // piece drag
        var $window = $(window)
        $window
          .on('mousemove', throttledMousemoveWindow)
          .on('mouseup', mouseupWindow)

        // touch drag pieces
        if (isTouchDevice()) {
          this.$board.on('touchstart', '.' + CSS.square, touchstartSquare)
          $container.on('touchstart', '.' + CSS.sparePieces + ' .' + CSS.piece, touchstartSparePiece)
          $window
            .on('touchmove', throttledTouchmoveWindow)
            .on('touchend', touchendWindow)
        }
      }

      const initDOM = () => {
        // create unique IDs for all the elements we will create
        createElIds()

        // build board and save it in memory
        $container.html(buildContainerHTML(config.sparePieces))
        this.$board = $container.find('.' + CSS.board)

        if (config.sparePieces) {
          $sparePiecesTop = $container.find('.' + CSS.sparePiecesTop)
          $sparePiecesBottom = $container.find('.' + CSS.sparePiecesBottom)
        }

        // create the drag piece
        var draggedPieceId = uuid()
        $('body').append(buildPieceHTML('wP', true, draggedPieceId))
        $draggedPiece = this.$draggedPiece = $('#' + draggedPieceId)

        // TODO: need to remove this dragged piece element if the board is no
        // longer in the DOM

        // get the border size
        this.boardBorderSize = parseInt(this.$board.css('borderLeftWidth'), 10)

        // set the size and draw the board
        this.resize();
      };

      // -------------------------------------------------------------------------
      // Initialization
      // -------------------------------------------------------------------------

      setInitialState();
      initDOM();
      addEvents();

      // return the widget object
      // return widget
    } // end constructor

    disconnectedCallback() {
      // remove the widget from the page
      // TODO: recreate in connectedCallback
      this.$draggedPiece.remove();
    }

    position(position, useAnimation) {
      // TODO: remove this indirection
      return this.widget.position(position, useAnimation);
    }

    // shorthand method to get the current FEN
    fen() {
      return this.widget.position('fen');
    }

    // set the starting position
    start(useAnimation) {
      this.widget.position('start', useAnimation);
    }

    // clear the board
    clear(useAnimation) {
      this.widget.position({}, useAnimation);
    }

    // move pieces
    move(...args) {
      let useAnimation = true;

      // collect the moves into an object
      const moves = {}
      for (const arg of args) {
        // any "false" to this function means no animations
        if (arg === false) {
          useAnimation = false;
          continue;
        }

        // skip invalid arguments
        if (!validMove(arg)) {
          error(2826, 'Invalid move passed to the move method.', arg);
          continue;
        }

        const [from, to] = arg.split('-');
        moves[from] = to;
      }

      // calculate position from moves
      const newPos = calculatePositionFromMoves(this.currentPosition, moves);

      // update the board
      this.position(newPos, useAnimation);

      // return the new position object
      return newPos;
    }

    // flip orientation
    flip() {
      return this.orientation('flip');
    }

    orientation(arg) {
      // no arguments, return the current orientation
      if (arg === undefined) {
        return this.currentOrientation;
      }

      // set to white or black
      if (arg === 'white' || arg === 'black') {
        this.currentOrientation = arg;
        this.drawBoard();
        return this.currentOrientation;
      }

      // flip orientation
      if (arg === 'flip') {
        this.currentOrientation = this.currentOrientation === 'white' ? 'black' : 'white';
        this.drawBoard();
        return this.currentOrientation;
      }

      error(5482, 'Invalid value passed to the orientation method.', arg);
    }

    // calculates square size based on the width of the container
    // got a little CSS black magic here, so let me explain:
    // get the width of the container element (could be anything), reduce by 1 for
    // fudge factor, and then keep reducing until we find an exact mod 8 for
    // our square size
    calculateSquareSize() {
      const containerWidth = parseInt(this.$container.width(), 10);

      // defensive, prevent infinite loop
      if (!containerWidth || containerWidth <= 0) {
        return 0;
      }

      // pad one pixel
      let boardWidth = containerWidth - 1;

      while (boardWidth % 8 !== 0 && boardWidth > 0) {
        boardWidth = boardWidth - 1;
      }

      return boardWidth / 8;
    }

    resize() {
      // calulate the new square size
      this.squareSize = this.calculateSquareSize();

      // set board width
      this.$board.css('width', this.squareSize * 8 + 'px');

      // set drag piece size
      this.$draggedPiece.css({
        height: this.squareSize,
        width: this.squareSize
      });

      // spare pieces
      if (this.config.sparePieces) {
        this.$container
          .find('.' + CSS.sparePieces)
          .css('paddingLeft', this.squareSize + this.boardBorderSize + 'px');
      }

      // redraw the board
      this.drawBoard();
    }

    // TODO: reflect to attribute?
    get pieceTheme() {
      return this.config.pieceTheme;
    }

    set pieceTheme(v) {
      this.config.pieceTheme = v;
      this.drawPositionInstant();
    }
  }
  customElements.define('chess-board', ChessBoardElement);

  // TODO: do module exports here
  window['Chessboard'] = constructor

  // support legacy ChessBoard name
  window['ChessBoard'] = window['Chessboard']

  // expose util functions
  window['Chessboard']['fenToObj'] = fenToObj
  window['Chessboard']['objToFen'] = objToFen
})() // end anonymous wrapper

/* export Chessboard object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') {
  exports.Chessboard = window.Chessboard
}
