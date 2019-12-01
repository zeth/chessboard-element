// chessboard.js v@VERSION
// https://github.com/oakmac/chessboardjs/
//
// Copyright (c) 2019, Chris Oakman
// Released under the MIT license
// https://github.com/oakmac/chessboardjs/blob/master/LICENSE.md

import {styles} from './chessboard-styles.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const COLUMNS = 'abcdefgh'.split('');
const DEFAULT_DRAG_THROTTLE_RATE = 20;
const RUN_ASSERTS = true;
const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
const START_POSITION = fenToObj(START_FEN);

// default animation speeds
const DEFAULT_APPEAR_SPEED = 200;
const DEFAULT_MOVE_SPEED = 200;
const DEFAULT_SNAPBACK_SPEED = 60;
const DEFAULT_SNAP_SPEED = 30;
const DEFAULT_TRASH_SPEED = 100;

const CSS = {
  alpha: 'alpha',
  black: 'black',
  board: 'board',
  chessboard: 'chessboard',
  clearfix: 'clearfix',
  highlight1: 'highlight1',
  highlight2: 'highlight2',
  notation: 'notation',
  numeric: 'numeric',
  piece: 'piece',
  row: 'row',
  sparePieces: 'spare-pieces',
  sparePiecesBottom: 'spare-pieces-bottom',
  sparePiecesTop: 'spare-pieces-top',
  square: 'square',
  white: 'white',
};

// ---------------------------------------------------------------------------
// Misc Util Functions
// ---------------------------------------------------------------------------

function throttle(f, interval, scope) {
  let timeout = 0;
  let shouldFire = false;
  let args = [];

  const fire = function() {
    timeout = window.setTimeout(handleTimeout, interval);
    f.apply(scope, args);
  };

  const handleTimeout = function() {
    timeout = 0;
    if (shouldFire) {
      shouldFire = false;
      fire();
    }
  };

  return function(..._args) {
    args = _args;
    if (!timeout) {
      fire();
    } else {
      shouldFire = true;
    }
  };
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

function uuid() {
  return 'xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function() {
    const r = (Math.random() * 16) | 0;
    return r.toString(16);
  });
}

function deepCopy(thing) {
  return JSON.parse(JSON.stringify(thing));
}

function interpolateTemplate(str, obj) {
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    const keyTemplateStr = '{' + key + '}';
    const value = obj[key];
    while (str.indexOf(keyTemplateStr) !== -1) {
      str = str.replace(keyTemplateStr, value);
    }
  }
  return str;
}

if (RUN_ASSERTS) {
  console.assert(interpolateTemplate('abc', {a: 'x'}) === 'abc');
  console.assert(interpolateTemplate('{a}bc', {}) === '{a}bc');
  console.assert(interpolateTemplate('{a}bc', {p: 'q'}) === '{a}bc');
  console.assert(interpolateTemplate('{a}bc', {a: 'x'}) === 'xbc');
  console.assert(interpolateTemplate('{a}bc{a}bc', {a: 'x'}) === 'xbcxbc');
  console.assert(interpolateTemplate('{a}{a}{b}', {a: 'x', b: 'y'}) === 'xxy');
}

// ---------------------------------------------------------------------------
// Predicates
// ---------------------------------------------------------------------------

function isString(s) {
  return typeof s === 'string';
}

function isFunction(f) {
  return typeof f === 'function';
}

function isInteger(n) {
  return typeof n === 'number' && isFinite(n) && Math.floor(n) === n;
}

function validAnimationSpeed(speed) {
  if (speed === 'fast' || speed === 'slow') return true;
  if (!isInteger(speed)) return false;
  return speed >= 0;
}

function validThrottleRate(rate) {
  return isInteger(rate) && rate >= 1;
}

function validMove(move) {
  // move should be a string
  if (!isString(move)) return false;

  // move should be in the form of "e2-e4", "f6-d5"
  const squares = move.split('-');
  if (squares.length !== 2) return false;

  return validSquare(squares[0]) && validSquare(squares[1]);
}

function validSquare(square) {
  return isString(square) && square.search(/^[a-h][1-8]$/) !== -1;
}

if (RUN_ASSERTS) {
  console.assert(validSquare('a1'));
  console.assert(validSquare('e2'));
  console.assert(!validSquare('D2'));
  console.assert(!validSquare('g9'));
  console.assert(!validSquare('a'));
  console.assert(!validSquare(true));
  console.assert(!validSquare(null));
  console.assert(!validSquare({}));
}

function validPieceCode(code) {
  return isString(code) && code.search(/^[bw][KQRNBP]$/) !== -1;
}

if (RUN_ASSERTS) {
  console.assert(validPieceCode('bP'));
  console.assert(validPieceCode('bK'));
  console.assert(validPieceCode('wK'));
  console.assert(validPieceCode('wR'));
  console.assert(!validPieceCode('WR'));
  console.assert(!validPieceCode('Wr'));
  console.assert(!validPieceCode('a'));
  console.assert(!validPieceCode(true));
  console.assert(!validPieceCode(null));
  console.assert(!validPieceCode({}));
}

function validFen(fen) {
  if (!isString(fen)) return false;

  // cut off any move, castling, etc info from the end
  // we're only interested in position information
  fen = fen.replace(/ .+$/, '');

  // expand the empty square numbers to just 1s
  fen = expandFenEmptySquares(fen);

  // FEN should be 8 sections separated by slashes
  const chunks = fen.split('/');
  if (chunks.length !== 8) return false;

  // check each section
  for (let i = 0; i < 8; i++) {
    if (chunks[i].length !== 8 || chunks[i].search(/[^kqrnbpKQRNBP1]/) !== -1) {
      return false;
    }
  }

  return true;
}

if (RUN_ASSERTS) {
  console.assert(validFen(START_FEN));
  console.assert(validFen('8/8/8/8/8/8/8/8'));
  console.assert(
    validFen('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R')
  );
  console.assert(
    validFen('3r3r/1p4pp/2nb1k2/pP3p2/8/PB2PN2/p4PPP/R4RK1 b - - 0 1')
  );
  console.assert(
    !validFen('3r3z/1p4pp/2nb1k2/pP3p2/8/PB2PN2/p4PPP/R4RK1 b - - 0 1')
  );
  console.assert(!validFen('anbqkbnr/8/8/8/8/8/PPPPPPPP/8'));
  console.assert(!validFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/'));
  console.assert(!validFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBN'));
  console.assert(!validFen('888888/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'));
  console.assert(!validFen('888888/pppppppp/74/8/8/8/PPPPPPPP/RNBQKBNR'));
  console.assert(!validFen({}));
}

function validPositionObject(pos) {
  if (typeof pos !== 'object' || pos === null) {
    return false;
  }

  for (const i in pos) {
    if (!pos.hasOwnProperty(i)) continue;

    if (!validSquare(i) || !validPieceCode(pos[i])) {
      return false;
    }
  }

  return true;
}

if (RUN_ASSERTS) {
  console.assert(validPositionObject(START_POSITION));
  console.assert(validPositionObject({}));
  console.assert(validPositionObject({e2: 'wP'}));
  console.assert(validPositionObject({e2: 'wP', d2: 'wP'}));
  console.assert(!validPositionObject({e2: 'BP'}));
  console.assert(!validPositionObject({y2: 'wP'}));
  console.assert(!validPositionObject(null));
  console.assert(!validPositionObject(undefined));
  console.assert(!validPositionObject(1));
  console.assert(!validPositionObject('start'));
  console.assert(!validPositionObject(START_FEN));
}

function isTouchDevice() {
  return 'ontouchstart' in document.documentElement;
}

// ---------------------------------------------------------------------------
// Chess Util Functions
// ---------------------------------------------------------------------------

// convert FEN piece code to bP, wK, etc
function fenToPieceCode(piece) {
  // black piece
  if (piece.toLowerCase() === piece) {
    return 'b' + piece.toUpperCase();
  }

  // white piece
  return 'w' + piece.toUpperCase();
}

// convert bP, wK, etc code to FEN structure
function pieceCodeToFen(piece) {
  const pieceCodeLetters = piece.split('');

  // white piece
  if (pieceCodeLetters[0] === 'w') {
    return pieceCodeLetters[1].toUpperCase();
  }

  // black piece
  return pieceCodeLetters[1].toLowerCase();
}

// convert FEN string to position object
// returns false if the FEN string is invalid
function fenToObj(fen) {
  if (!validFen(fen)) return false;

  // cut off any move, castling, etc info from the end
  // we're only interested in position information
  fen = fen.replace(/ .+$/, '');

  const rows = fen.split('/');
  const position = {};

  let currentRow = 8;
  for (let i = 0; i < 8; i++) {
    const row = rows[i].split('');
    let colIdx = 0;

    // loop through each character in the FEN section
    for (let j = 0; j < row.length; j++) {
      // number / empty squares
      if (row[j].search(/[1-8]/) !== -1) {
        const numEmptySquares = parseInt(row[j], 10);
        colIdx = colIdx + numEmptySquares;
      } else {
        // piece
        const square = COLUMNS[colIdx] + currentRow;
        position[square] = fenToPieceCode(row[j]);
        colIdx = colIdx + 1;
      }
    }

    currentRow = currentRow - 1;
  }

  return position;
}

// position object to FEN string
// returns false if the obj is not a valid position object
function objToFen(obj) {
  if (!validPositionObject(obj)) return false;

  let fen = '';

  let currentRow = 8;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const square = COLUMNS[j] + currentRow;

      // piece exists
      if (obj.hasOwnProperty(square)) {
        fen = fen + pieceCodeToFen(obj[square]);
      } else {
        // empty space
        fen = fen + '1';
      }
    }

    if (i !== 7) {
      fen = fen + '/';
    }

    currentRow = currentRow - 1;
  }

  // squeeze the empty numbers together
  fen = squeezeFenEmptySquares(fen);

  return fen;
}

if (RUN_ASSERTS) {
  console.assert(objToFen(START_POSITION) === START_FEN);
  console.assert(objToFen({}) === '8/8/8/8/8/8/8/8');
  console.assert(objToFen({a2: 'wP', b2: 'bP'}) === '8/8/8/8/8/8/Pp6/8');
}

function squeezeFenEmptySquares(fen) {
  return fen
    .replace(/11111111/g, '8')
    .replace(/1111111/g, '7')
    .replace(/111111/g, '6')
    .replace(/11111/g, '5')
    .replace(/1111/g, '4')
    .replace(/111/g, '3')
    .replace(/11/g, '2');
}

function expandFenEmptySquares(fen) {
  return fen
    .replace(/8/g, '11111111')
    .replace(/7/g, '1111111')
    .replace(/6/g, '111111')
    .replace(/5/g, '11111')
    .replace(/4/g, '1111')
    .replace(/3/g, '111')
    .replace(/2/g, '11');
}

// returns the distance between two squares
function squareDistance(squareA, squareB) {
  const squareAArray = squareA.split('');
  const squareAx = COLUMNS.indexOf(squareAArray[0]) + 1;
  const squareAy = parseInt(squareAArray[1], 10);

  const squareBArray = squareB.split('');
  const squareBx = COLUMNS.indexOf(squareBArray[0]) + 1;
  const squareBy = parseInt(squareBArray[1], 10);

  const xDelta = Math.abs(squareAx - squareBx);
  const yDelta = Math.abs(squareAy - squareBy);

  if (xDelta >= yDelta) return xDelta;
  return yDelta;
}

// returns the square of the closest instance of piece
// returns false if no instance of piece is found in position
function findClosestPiece(position, piece, square) {
  // create array of closest squares from square
  const closestSquares = createRadius(square);

  // search through the position in order of distance for the piece
  for (let i = 0; i < closestSquares.length; i++) {
    const s = closestSquares[i];

    if (position.hasOwnProperty(s) && position[s] === piece) {
      return s;
    }
  }

  return false;
}

// returns an array of closest squares from square
function createRadius(square) {
  const squares = [];

  // calculate distance of all squares
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const s = COLUMNS[i] + (j + 1);

      // skip the square we're starting from
      if (square === s) continue;

      squares.push({
        square: s,
        distance: squareDistance(square, s),
      });
    }
  }

  // sort by distance
  squares.sort(function(a, b) {
    return a.distance - b.distance;
  });

  // just return the square code
  const surroundingSquares = [];
  for (let i = 0; i < squares.length; i++) {
    surroundingSquares.push(squares[i].square);
  }

  return surroundingSquares;
}

// given a position and a set of moves, return a new position
// with the moves executed
function calculatePositionFromMoves(position, moves) {
  const newPosition = deepCopy(position);

  for (const i in moves) {
    if (!moves.hasOwnProperty(i)) continue;

    // skip the move if the position doesn't have a piece on the source square
    if (!newPosition.hasOwnProperty(i)) continue;

    const piece = newPosition[i];
    delete newPosition[i];
    newPosition[moves[i]] = piece;
  }

  return newPosition;
}

// TODO: add some asserts here for calculatePositionFromMoves

// ---------------------------------------------------------------------------
// HTML
// ---------------------------------------------------------------------------

const buildContainerHTML = (hasSparePieces) => `
    <div class="${CSS.chessboard}">
    ${
      hasSparePieces
        ? `<div class="${CSS.sparePieces} ${CSS.sparePiecesTop}"></div>`
        : ``
    }
    <div class="${CSS.board}"></div>
    ${
      hasSparePieces
        ? `<div class="${CSS.sparePieces} ${CSS.sparePiecesBottom}"></div>`
        : ``
    }
    </div>`;

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

// validate config / set default options
function expandConfig(config) {
  // default for orientation is white
  if (config.orientation !== 'black') config.orientation = 'white';

  // default for showNotation is true
  if (config.showNotation !== false) config.showNotation = true;

  // default for draggable is false
  if (config.draggable !== true) config.draggable = false;

  // default for dropOffBoard is 'snapback'
  if (config.dropOffBoard !== 'trash') config.dropOffBoard = 'snapback';

  // default for sparePieces is false
  if (config.sparePieces !== true) config.sparePieces = false;

  // draggable must be true if sparePieces is enabled
  if (config.sparePieces) config.draggable = true;

  // default piece theme is wikipedia
  if (
    !config.hasOwnProperty('pieceTheme') ||
    (!isString(config.pieceTheme) && !isFunction(config.pieceTheme))
  ) {
    config.pieceTheme = 'img/chesspieces/wikipedia/{piece}.png';
  }

  // animation speeds
  if (!validAnimationSpeed(config.appearSpeed))
    config.appearSpeed = DEFAULT_APPEAR_SPEED;
  if (!validAnimationSpeed(config.moveSpeed))
    config.moveSpeed = DEFAULT_MOVE_SPEED;
  if (!validAnimationSpeed(config.snapbackSpeed))
    config.snapbackSpeed = DEFAULT_SNAPBACK_SPEED;
  if (!validAnimationSpeed(config.snapSpeed))
    config.snapSpeed = DEFAULT_SNAP_SPEED;
  if (!validAnimationSpeed(config.trashSpeed))
    config.trashSpeed = DEFAULT_TRASH_SPEED;

  // throttle rate
  if (!validThrottleRate(config.dragThrottleRate))
    config.dragThrottleRate = DEFAULT_DRAG_THROTTLE_RATE;

  return config;
}

const speedToMS = (speed) => {
  if (typeof speed === 'number') {
    return speed;
  }
  if (speed === 'fast') {
    return 200;
  }
  if (speed === 'slow') {
    return 600;
  }
  return parseInt(speed, 10);
};

export class ChessBoardElement extends HTMLElement {
  static get observedAttributes() {
    return [
      'position',
      'hide-notation',
      'orientation',
      'draggable-pieces',
      'drop-off-board',
      'piece-theme',
      'move-speed',
      'snapback-speed',
      'snap-speed',
      'trash-speed',
      'appear-speed',
      'spare-pieces',
    ];
  }

  // TODO: enable class fields

  // config = {};

  // currentPosition = {};

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        ${styles}
      </style>
      <div id="container"></div>
    `;

    this._container = this.shadowRoot.querySelector('#container');

    // ensure the config object is what we expect
    const config = (this.config = expandConfig({}));

    // DOM elements
    this._board = null;
    this._draggedPiece = null;
    this._sparePiecesTop = null;
    this._sparePiecesBottom = null;

    // -------------------------------------------------------------------------
    // Stateful
    // -------------------------------------------------------------------------

    this.boardBorderSize = 2;
    this.currentOrientation = 'white';
    this.currentPosition = {};
    this.draggedPiece = null;
    this.draggedPieceLocation = null;
    this.draggedPieceSource = null;
    this.isDragging = false;
    this.sparePiecesElsIds = {};
    this.squareElsIds = {};
    this.squareElsOffsets = {};
    this.squareSize = 16;

    const setInitialState = () => {
      this.currentOrientation = this.config.orientation;

      // make sure position is valid
      if (this.config.hasOwnProperty('position')) {
        if (this.config.position === 'start') {
          this.currentPosition = deepCopy(START_POSITION);
        } else if (validFen(this.config.position)) {
          this.currentPosition = fenToObj(this.config.position);
        } else if (validPositionObject(this.config.position)) {
          this.currentPosition = deepCopy(this.config.position);
        } else {
          this.error(
            7263,
            'Invalid value passed to config.position.',
            this.config.position
          );
        }
      }
    };

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
      this.beginDraggingPiece(
        square,
        this.currentPosition[square],
        e.pageX,
        e.pageY
      );
    };

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
      this.beginDraggingPiece(
        square,
        this.currentPosition[square],
        e.changedTouches[0].pageX,
        e.changedTouches[0].pageY
      );
    };

    const mousedownSparePiece = (e) => {
      // do nothing if sparePieces is not enabled
      if (!config.sparePieces) {
        return;
      }
      const pieceEl = e.target.closest('[data-piece]');
      const piece = pieceEl.getAttribute('data-piece');

      this.beginDraggingPiece('spare', piece, e.pageX, e.pageY);
    };

    const touchstartSparePiece = (e) => {
      // do nothing if sparePieces is not enabled
      if (!config.sparePieces) return;

      const pieceEl = e.target.closest('[data-piece]');
      const piece = pieceEl.getAttribute('data-piece');

      e = e.originalEvent;
      this.beginDraggingPiece(
        'spare',
        piece,
        e.changedTouches[0].pageX,
        e.changedTouches[0].pageY
      );
    };

    const mousemoveWindow = (e) => {
      if (this.isDragging) {
        this.updateDraggedPiece(e.pageX, e.pageY);
      }
    };

    const throttledMousemoveWindow = throttle(
      mousemoveWindow,
      this.config.dragThrottleRate
    );

    const touchmoveWindow = (e) => {
      // do nothing if we are not dragging a piece
      if (!this.isDragging) {
        return;
      }

      // prevent screen from scrolling
      e.preventDefault();

      this.updateDraggedPiece(
        e.originalEvent.changedTouches[0].pageX,
        e.originalEvent.changedTouches[0].pageY
      );
    };

    const throttledTouchmoveWindow = throttle(
      touchmoveWindow,
      this.config.dragThrottleRate
    );

    const mouseupWindow = (e) => {
      // do nothing if we are not dragging a piece
      if (!this.isDragging) {
        return;
      }

      // get the location
      const location = this.isXYOnSquare(e.pageX, e.pageY);

      this.stopDraggedPiece(location);
    };

    const touchendWindow = (e) => {
      // do nothing if we are not dragging a piece
      if (!this.isDragging) {
        return;
      }

      // get the location
      const location = this.isXYOnSquare(
        e.originalEvent.changedTouches[0].pageX,
        e.originalEvent.changedTouches[0].pageY
      );

      this.stopDraggedPiece(location);
    };

    const mouseenterSquare = (e) => {
      // do not fire this event if we are dragging a piece
      // NOTE: this should never happen, but it's a safeguard
      if (this.isDragging) {
        return;
      }

      // get the square
      const square = e.currentTarget.getAttribute('data-square');

      // NOTE: this should never happen; defensive
      if (!validSquare(square)) {
        return;
      }

      // get the piece on this square
      let piece = false;

      if (this.currentPosition.hasOwnProperty(square)) {
        piece = this.currentPosition[square];
      }

      this.dispatchEvent(
        new CustomEvent('mouseover-square', {
          bubbles: true,
          detail: {
            square,
            piece,
            position: deepCopy(this.currentPosition),
            orientation: this.currentOrientation,
          },
        })
      );
    };

    const mouseleaveSquare = (e) => {
      // do not fire this event if we are dragging a piece
      // NOTE: this should never happen, but it's a safeguard
      if (this.isDragging) {
        return;
      }

      // get the square
      const square = e.currentTarget.getAttribute('data-square');

      // NOTE: this should never happen; defensive
      if (!validSquare(square)) {
        return;
      }

      // get the piece on this square
      let piece = false;
      if (this.currentPosition.hasOwnProperty(square)) {
        piece = this.currentPosition[square];
      }

      // execute their function
      this.dispatchEvent(
        new CustomEvent('mouseout-square', {
          bubbles: true,
          detail: {
            square,
            piece,
            position: deepCopy(this.currentPosition),
            orientation: this.currentOrientation,
          },
        })
      );
    };

    // -------------------------------------------------------------------------
    // Initialization
    // -------------------------------------------------------------------------

    const addEvents = () => {
      // prevent "image drag"
      this.shadowRoot.addEventListener('mousedown', (e) => {
        if (e.target.matches('.' + CSS.piece)) {
          e.preventDefault();
        }
      });
      this.shadowRoot.addEventListener('mousemove', (e) => {
        if (e.target.matches('.' + CSS.piece)) {
          e.preventDefault();
        }
      });

      // mouse drag pieces
      this.shadowRoot.addEventListener('mousedown', (e) => {
        if (e.target.closest('.' + CSS.square)) {
          mousedownSquare(e);
        }
      });
      this.shadowRoot.addEventListener('mousedown', (e) => {
        if (e.target.closest('.' + CSS.sparePieces + ' .' + CSS.piece)) {
          mousedownSparePiece(e);
        }
      });

      // mouse enter / leave square
      const squares = this.shadowRoot.querySelectorAll('.' + CSS.square);
      for (const square of Array.from(squares)) {
        square.addEventListener('mouseenter', mouseenterSquare);
        square.addEventListener('mouseleave', mouseleaveSquare);
      }

      // piece drag
      window.addEventListener('mousemove', throttledMousemoveWindow);
      window.addEventListener('mouseup', mouseupWindow);

      // touch drag pieces
      if (isTouchDevice()) {
        this._board.addEventListener('touchstart', (e) => {
          if (e.target.closest('.' + CSS.square)) {
            touchstartSquare(e);
          }
        });
        this._container.addEventListener('touchstart', (e) => {
          if (e.target.closest('.' + CSS.sparePieces + ' .' + CSS.piece)) {
            touchstartSparePiece(e);
          }
        });

        window.addEventListener('touchmove', throttledTouchmoveWindow);
        window.addEventListener('touchend', touchendWindow);
      }
    };

    // -------------------------------------------------------------------------
    // Initialization
    // -------------------------------------------------------------------------

    setInitialState();
    this._initDOM();
    addEvents();
  } // end constructor

  // -------------------------------------------------------------------------
  // Markup Building
  // -------------------------------------------------------------------------

  // create random IDs for elements
  _createElIds() {
    // squares on the board
    for (let i = 0; i < COLUMNS.length; i++) {
      for (let j = 1; j <= 8; j++) {
        const square = COLUMNS[i] + j;
        this.squareElsIds[square] = square + '-' + uuid();
      }
    }

    // spare pieces
    const pieces = 'KQRNBP'.split('');
    for (let i = 0; i < pieces.length; i++) {
      const whitePiece = 'w' + pieces[i];
      const blackPiece = 'b' + pieces[i];
      this.sparePiecesElsIds[whitePiece] = whitePiece + '-' + uuid();
      this.sparePiecesElsIds[blackPiece] = blackPiece + '-' + uuid();
    }
  }

  _initDOM() {
    // create unique IDs for all the elements we will create
    this._createElIds();

    // build board and save it in memory
    this._container.innerHTML = buildContainerHTML(this.config.sparePieces);

    this._board = this._container.querySelector('.' + CSS.board);

    this._sparePiecesTop = this._container.querySelector(
      '.' + CSS.sparePiecesTop
    );
    this._sparePiecesBottom = this._container.querySelector(
      '.' + CSS.sparePiecesBottom
    );

    // get the border size
    this.boardBorderSize = parseInt(
      getComputedStyle(this._board)['borderLeftWidth'],
      10
    );

    // set the size and draw the board
    this.resize();
  }

  buildPieceImgSrc(piece) {
    if (isFunction(this.config.pieceTheme)) {
      return this.config.pieceTheme(piece);
    }

    if (isString(this.config.pieceTheme)) {
      return interpolateTemplate(this.config.pieceTheme, {piece: piece});
    }

    // NOTE: this should never happen
    this.error(8272, 'Unable to build image source for config.pieceTheme.');
    return '';
  }

  buildPieceHTML(piece, hidden, id) {
    return `
      <img
        src="${this.buildPieceImgSrc(piece)}"
        ${isString(id) && id !== '' ? `id="${id}"` : ``}
        alt=""
        class="${CSS.piece}"
        data-piece="${piece}"
        style="width:${this.squareSize}px; height: ${this.squareSize}px; ${
      hidden ? `display:none;` : ``
    }"
      >`;
  }

  buildBoardHTML(orientation) {
    if (orientation !== 'black') {
      orientation = 'white';
    }

    let html = '';

    // algebraic notation / orientation
    const alpha = deepCopy(COLUMNS);
    let row = 8;
    if (orientation === 'black') {
      alpha.reverse();
      row = 1;
    }

    let squareColor = 'white';
    for (let i = 0; i < 8; i++) {
      html += `<div class="${CSS.row}">`;
      for (let j = 0; j < 8; j++) {
        const square = alpha[j] + row;

        html +=
          `<div class="${CSS.square} ${CSS[squareColor]} square-${square}" ` +
          `style="width:${this.squareSize}px; height:${this.squareSize}px;" ` +
          `id="${this.squareElsIds[square]}" ` +
          `data-square="${square}" ` +
          `part="${square} ${squareColor}" ` +
          '>';

        if (this.config.showNotation) {
          // alpha notation
          if (
            (orientation === 'white' && row === 1) ||
            (orientation === 'black' && row === 8)
          ) {
            html += `<div class="${CSS.notation} ${CSS.alpha}">${alpha[j]}</div>`;
          }

          // numeric notation
          if (j === 0) {
            html += `<div class="${CSS.notation} ${CSS.numeric}">${row}</div>`;
          }
        }

        html += '</div>'; // end .square

        squareColor = squareColor === 'white' ? 'black' : 'white';
      }
      html += `<div class="${CSS.clearfix}"></div></div>`;

      squareColor = squareColor === 'white' ? 'black' : 'white';

      if (orientation === 'white') {
        row = row - 1;
      } else {
        row = row + 1;
      }
    }

    return html;
  }

  buildSparePiecesHTML(color) {
    let pieces = ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP'];
    if (color === 'black') {
      pieces = ['bK', 'bQ', 'bR', 'bB', 'bN', 'bP'];
    }

    let html = '';
    for (let i = 0; i < pieces.length; i++) {
      html += this.buildPieceHTML(
        pieces[i],
        false,
        this.sparePiecesElsIds[pieces[i]]
      );
    }

    return html;
  }

  // -------------------------------------------------------------------------
  // Public Methods
  // -------------------------------------------------------------------------

  position(position, useAnimation) {
    // no arguments, return the current position
    if (position === undefined) {
      return deepCopy(this.currentPosition);
    }

    // get position as FEN
    if (isString(position) && position.toLowerCase() === 'fen') {
      return objToFen(this.currentPosition);
    }

    // start position
    if (isString(position) && position.toLowerCase() === 'start') {
      position = deepCopy(START_POSITION);
    }

    // convert FEN to position object
    if (validFen(position)) {
      position = fenToObj(position);
    }

    // validate position object
    if (!validPositionObject(position)) {
      this.error(
        6482,
        'Invalid value passed to the position method.',
        position
      );
      return;
    }

    // default for useAnimations is true
    if (useAnimation !== false) {
      useAnimation = true;
    }

    if (useAnimation) {
      // start the animations
      const animations = this.calculateAnimations(
        this.currentPosition,
        position
      );
      this.doAnimations(animations, this.currentPosition, position);

      // set the new position
      this.setCurrentPosition(position);
    } else {
      // instant update
      this.setCurrentPosition(position);
      this.drawPositionInstant();
    }
  }

  // shorthand method to get the current FEN
  fen() {
    return this.position('fen');
  }

  // set the starting position
  start(useAnimation) {
    this.position('start', useAnimation);
  }

  // clear the board
  clear(useAnimation) {
    this.position({}, useAnimation);
  }

  // move pieces
  move(...args) {
    let useAnimation = true;

    // collect the moves into an object
    const moves = {};
    for (const arg of args) {
      // any "false" to this function means no animations
      if (arg === false) {
        useAnimation = false;
        continue;
      }

      // skip invalid arguments
      if (!validMove(arg)) {
        this.error(2826, 'Invalid move passed to the move method.', arg);
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
      this.currentOrientation =
        this.currentOrientation === 'white' ? 'black' : 'white';
      this.drawBoard();
      return this.currentOrientation;
    }

    this.error(5482, 'Invalid value passed to the orientation method.', arg);
  }

  resize() {
    // calulate the new square size
    this.squareSize = this.calculateSquareSize();

    // set board width
    this._board.style.width = this.squareSize * 8 + 'px';

    // set drag piece size
    if (this._draggedPiece) {
      this._draggedPiece.style.height = `${this.squareSize}px`;
      this._draggedPiece.style.width = `${this.squareSize}px`;
    }

    // spare pieces
    if (this.config.sparePieces) {
      const sparePieces = this.shadowRoot.querySelectorAll(
        '.' + CSS.sparePieces
      );
      for (const piece of Array.from(sparePieces)) {
        piece.style.paddingLeft = this.squareSize + this.boardBorderSize + 'px';
      }
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

  // -------------------------------------------------------------------------
  // Lifecycle Callbacks
  // -------------------------------------------------------------------------

  connectedCallback() {
    // create the drag piece
    const draggedPieceId = uuid();
    document.body.insertAdjacentHTML(
      'beforeend',
      this.buildPieceHTML('wP', true, draggedPieceId)
    );
    this._draggedPiece = document.getElementById(draggedPieceId);

    this.resize();
  }

  disconnectedCallback() {
    // remove the drag piece from the page
    this._draggedPiece.remove();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'position':
        this.position(newValue, false);
        break;
      case 'hide-notation':
        this.config.showNotation = newValue === null;
        this.drawBoard();
        break;
      case 'orientation':
        this.orientation(newValue);
        // this.drawBoard();
        break;
      case 'draggable-pieces':
        this.config.draggable = newValue !== null;
        this.drawBoard();
        break;
      case 'drop-off-board':
        this.config.dropOffBoard = newValue;
        this.drawBoard();
        break;
      case 'piece-theme':
        this.config.pieceTheme = newValue;
        this.drawBoard();
        break;
      case 'move-speed':
        this.config.moveSpeed = newValue;
        this.drawBoard();
        break;
      case 'snapback-speed':
        this.config.snapbackSpeed = newValue;
        this.drawBoard();
        break;
      case 'snap-speed':
        this.config.snapSpeed = newValue;
        this.drawBoard();
        break;
      case 'trash-speed':
        this.config.trashSpeed = newValue;
        this.drawBoard();
        break;
      case 'appear-speed':
        this.config.appearSpeed = newValue;
        this.drawBoard();
        break;
      case 'spare-pieces':
        this.config.sparePieces = newValue !== null;
        this._initDOM();
        this.drawBoard();
        break;
    }
  }

  // -------------------------------------------------------------------------
  // Control Flow
  // -------------------------------------------------------------------------

  drawBoard() {
    this._board.innerHTML = this.buildBoardHTML(
      this.currentOrientation,
      this.squareSize,
      this.config.showNotation
    );
    this.drawPositionInstant();

    if (this.config.sparePieces) {
      if (this.currentOrientation === 'white') {
        this._sparePiecesTop.innerHTML = this.buildSparePiecesHTML('black');
        this._sparePiecesBottom.innerHTML = this.buildSparePiecesHTML('white');
      } else {
        this._sparePiecesTop.innerHTML = this.buildSparePiecesHTML('white');
        this._sparePiecesBottom.innerHTML = this.buildSparePiecesHTML('black');
      }
    }
  }

  setCurrentPosition(position) {
    const oldPos = deepCopy(this.currentPosition);
    const newPos = deepCopy(position);
    const oldFen = objToFen(oldPos);
    const newFen = objToFen(newPos);

    // do nothing if no change in position
    if (oldFen === newFen) return;

    // Fire change event
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        detail: {
          value: newPos,
          oldValue: oldPos,
        },
      })
    );

    // update state
    this.currentPosition = position;
  }

  drawPositionInstant() {
    // clear the board
    const pieces = this._board.querySelectorAll('.' + CSS.piece);
    for (const piece of Array.from(pieces)) {
      piece.remove();
    }

    // add the pieces
    for (const i in this.currentPosition) {
      if (!this.currentPosition.hasOwnProperty(i)) {
        continue;
      }
      const pieceHTML = this.buildPieceHTML(this.currentPosition[i]);
      const square = this.shadowRoot.querySelector('#' + this.squareElsIds[i]);
      square.insertAdjacentHTML('beforeend', pieceHTML);
    }
  }

  isXYOnSquare(x, y) {
    for (const i in this.squareElsOffsets) {
      if (!this.squareElsOffsets.hasOwnProperty(i)) {
        continue;
      }

      const s = this.squareElsOffsets[i];
      if (
        x >= s.left &&
        x < s.left + this.squareSize &&
        y >= s.top &&
        y < s.top + this.squareSize
      ) {
        return i;
      }
    }

    return 'offboard';
  }

  // records the XY coords of every square into memory
  captureSquareOffsets() {
    this.squareElsOffsets = {};

    for (const i in this.squareElsIds) {
      if (!this.squareElsIds.hasOwnProperty(i)) {
        continue;
      }

      const square = this.shadowRoot.querySelector(`#${this.squareElsIds[i]}`);
      const rect = square.getBoundingClientRect();
      // emulates jQuery's offset()
      this.squareElsOffsets[i] = {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft,
      };
    }
  }

  removeSquareHighlights() {
    const squares = this.shadowRoot.querySelectorAll('.' + CSS.square);
    for (const square of Array.from(squares)) {
      square.classList.remove(CSS.highlight1);
      square.classList.remove(CSS.highlight2);
    }
  }

  snapbackDraggedPiece() {
    // there is no "snapback" for spare pieces
    if (this.draggedPieceSource === 'spare') {
      this.trashDraggedPiece();
      return;
    }

    this.removeSquareHighlights();

    // animation complete
    const complete = () => {
      this._draggedPiece.removeEventListener('transitionend', complete);

      this.drawPositionInstant();
      this._draggedPiece.style.display = 'none';

      this.dispatchEvent(
        new CustomEvent('snapback-end', {
          bubbles: true,
          detail: {
            piece: this.draggedPiece,
            square: this.draggedPieceSource,
            position: deepCopy(this.currentPosition),
            orientation: this.currentOrientation,
          },
        })
      );
    };

    // get source square position
    const square = this.shadowRoot.querySelector(
      `#${this.squareElsIds[this.draggedPieceSource]}`
    );
    const rect = square.getBoundingClientRect();

    // animate the piece to the target square
    this._draggedPiece.style.transitionProperty = 'top, left';
    this._draggedPiece.style.transitionDuration = `${this.config.snapbackSpeed}ms`;
    this._draggedPiece.style.top = `${rect.top + document.body.scrollTop}px`;
    this._draggedPiece.style.left = `${rect.left + document.body.scrollLeft}px`;
    this._draggedPiece.addEventListener('transitionend', complete);

    // set state
    this.isDragging = false;
  }

  trashDraggedPiece() {
    this.removeSquareHighlights();

    // remove the source piece
    const newPosition = deepCopy(this.currentPosition);
    delete newPosition[this.draggedPieceSource];
    this.setCurrentPosition(newPosition);

    // redraw the position
    this.drawPositionInstant();

    // hide the dragged piece
    this._draggedPiece.style.transitionProperty = 'opacity';
    this._draggedPiece.style.transitionDuration = `${speedToMS(
      this.config.trashSpeed
    )}ms`;
    this._draggedPiece.style.opacity = 0;

    // set state
    this.isDragging = false;
  }

  dropDraggedPieceOnSquare(square) {
    this.removeSquareHighlights();

    // update position
    const newPosition = deepCopy(this.currentPosition);
    delete newPosition[this.draggedPieceSource];
    newPosition[square] = this.draggedPiece;
    this.setCurrentPosition(newPosition);

    // get target square information
    const targetSquare = this.shadowRoot.querySelector(
      `#${this.squareElsIds[square]}`
    );
    const rect = targetSquare.getBoundingClientRect();

    // animation complete
    const onAnimationComplete = () => {
      this._draggedPiece.removeEventListener(
        'transitionend',
        onAnimationComplete
      );

      this.drawPositionInstant();
      this._draggedPiece.style.display = 'none';

      // Fire the snap-end event
      this.dispatchEvent(
        new CustomEvent('snap-end', {
          bubbles: true,
          detail: {
            source: this.draggedPieceSource,
            square,
            piece: this.draggedPiece,
          },
        })
      );
    };

    // snap the piece to the target square
    this._draggedPiece.style.transitionProperty = 'top, left';
    this._draggedPiece.style.transitionDuration = `${this.config.snapbackSpeed}ms`;
    this._draggedPiece.style.top = `${rect.top + document.body.scrollTop}px`;
    this._draggedPiece.style.left = `${rect.left + document.body.scrollLeft}px`;
    this._draggedPiece.addEventListener('transitionend', onAnimationComplete);

    // set state
    this.isDragging = false;
  }

  beginDraggingPiece(source, piece, x, y) {
    // Fire cancalable drag-start event
    const event = new CustomEvent('drag-start', {
      bubbles: true,
      cancelable: true,
      detail: {
        source,
        piece,
        position: deepCopy(this.currentPosition),
        orientation: this.currentOrientation,
      },
    });
    this.dispatchEvent(event);
    if (event.defaultPrevented) {
      return;
    }

    // set state
    this.isDragging = true;
    this.draggedPiece = piece;
    this.draggedPieceSource = source;

    // if the piece came from spare pieces, location is offboard
    if (source === 'spare') {
      this.draggedPieceLocation = 'offboard';
    } else {
      this.draggedPieceLocation = source;
    }

    // capture the x, y coords of all squares in memory
    this.captureSquareOffsets();

    // create the dragged piece
    this._draggedPiece.setAttribute('src', this.buildPieceImgSrc(piece));
    this._draggedPiece.style.opacity = 1;
    this._draggedPiece.style.display = '';
    this._draggedPiece.style.position = 'absolute';
    this._draggedPiece.style.left = `${x - this.squareSize / 2}px`;
    this._draggedPiece.style.top = `${y - this.squareSize / 2}px`;

    if (source !== 'spare') {
      // highlight the source square and hide the piece
      const sourceSquare = this.shadowRoot.querySelector(
        `#${this.squareElsIds[source]}`
      );
      sourceSquare.classList.add(CSS.highlight1);
      const pieces = sourceSquare.querySelectorAll('.' + CSS.piece);
      pieces.forEach((piece) => {
        piece.style.display = 'none';
      });
    }
  }

  updateDraggedPiece(x, y) {
    // put the dragged piece over the mouse cursor
    this._draggedPiece.style.left = `${x - this.squareSize / 2}px`;
    this._draggedPiece.style.top = `${y - this.squareSize / 2}px`;

    // get location
    const location = this.isXYOnSquare(x, y);

    // do nothing if the location has not changed
    if (location === this.draggedPieceLocation) {
      return;
    }

    // remove highlight from previous square
    if (validSquare(this.draggedPieceLocation)) {
      const previousSquare = this.shadowRoot.querySelector(
        '#' + this.squareElsIds[this.draggedPieceLocation]
      );
      previousSquare.classList.remove(CSS.highlight2);
    }

    // add highlight to new square
    if (validSquare(location)) {
      const locationSquare = this.shadowRoot.querySelector(
        '#' + this.squareElsIds[location]
      );
      locationSquare.classList.add(CSS.highlight2);
    }

    this.dispatchEvent(
      new CustomEvent('drag-move', {
        bubbles: true,
        detail: {
          newLocation: location,
          oldLocation: this.draggedPieceLocation,
          source: this.draggedPieceSource,
          piece: this.draggedPiece,
          position: deepCopy(this.currentPosition),
          orientation: this.currentOrientation,
        },
      })
    );

    // update state
    this.draggedPieceLocation = location;
  }

  stopDraggedPiece(location) {
    // determine what the action should be
    let action = 'drop';
    if (location === 'offboard' && this.config.dropOffBoard === 'snapback') {
      action = 'snapback';
    }
    if (location === 'offboard' && this.config.dropOffBoard === 'trash') {
      action = 'trash';
    }

    // run their onDrop function, which can potentially change the drop action
    const newPosition = deepCopy(this.currentPosition);

    // source piece is a spare piece and position is off the board
    // if (draggedPieceSource === 'spare' && location === 'offboard') {...}
    // position has not changed; do nothing

    // source piece is a spare piece and position is on the board
    if (this.draggedPieceSource === 'spare' && validSquare(location)) {
      // add the piece to the board
      newPosition[location] = this.draggedPiece;
    }

    // source piece was on the board and position is off the board
    if (validSquare(this.draggedPieceSource) && location === 'offboard') {
      // remove the piece from the board
      delete newPosition[this.draggedPieceSource];
    }

    // source piece was on the board and position is on the board
    if (validSquare(this.draggedPieceSource) && validSquare(location)) {
      // move the piece
      delete newPosition[this.draggedPieceSource];
      newPosition[location] = this.draggedPiece;
    }

    const oldPosition = deepCopy(this.currentPosition);

    const dropEvent = new CustomEvent('drop', {
      bubbles: true,
      detail: {
        source: this.draggedPieceSource,
        target: location,
        piece: this.draggedPiece,
        newPosition,
        oldPosition,
        orientation: this.currentOrientation,
        setAction(a) {
          action = a;
        },
      },
    });
    this.dispatchEvent(dropEvent);

    // do it!
    if (action === 'snapback') {
      this.snapbackDraggedPiece();
    } else if (action === 'trash') {
      this.trashDraggedPiece();
    } else if (action === 'drop') {
      this.dropDraggedPieceOnSquare(location);
    }
  }

  // -------------------------------------------------------------------------
  // DOM Misc
  // -------------------------------------------------------------------------

  // calculates square size based on the width of the container
  // got a little CSS black magic here, so let me explain:
  // get the width of the container element (could be anything), reduce by 1 for
  // fudge factor, and then keep reducing until we find an exact mod 8 for
  // our square size
  calculateSquareSize() {
    const containerWidth = this._container.offsetWidth;

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

  // -------------------------------------------------------------------------
  // Animations
  // -------------------------------------------------------------------------

  // calculate an array of animations that need to happen in order to get
  // from pos1 to pos2
  calculateAnimations(pos1, pos2) {
    // make copies of both
    pos1 = deepCopy(pos1);
    pos2 = deepCopy(pos2);

    const animations = [];
    const squaresMovedTo = {};

    // remove pieces that are the same in both positions
    for (const i in pos2) {
      if (!pos2.hasOwnProperty(i)) continue;

      if (pos1.hasOwnProperty(i) && pos1[i] === pos2[i]) {
        delete pos1[i];
        delete pos2[i];
      }
    }

    // find all the "move" animations
    for (const i in pos2) {
      if (!pos2.hasOwnProperty(i)) continue;

      const closestPiece = findClosestPiece(pos1, pos2[i], i);
      if (closestPiece) {
        animations.push({
          type: 'move',
          source: closestPiece,
          destination: i,
          piece: pos2[i],
        });

        delete pos1[closestPiece];
        delete pos2[i];
        squaresMovedTo[i] = true;
      }
    }

    // "add" animations
    for (const i in pos2) {
      if (!pos2.hasOwnProperty(i)) {
        continue;
      }

      animations.push({
        type: 'add',
        square: i,
        piece: pos2[i],
      });

      delete pos2[i];
    }

    // "clear" animations
    for (const i in pos1) {
      if (!pos1.hasOwnProperty(i)) continue;

      // do not clear a piece if it is on a square that is the result
      // of a "move", ie: a piece capture
      if (squaresMovedTo.hasOwnProperty(i)) continue;

      animations.push({
        type: 'clear',
        square: i,
        piece: pos1[i],
      });

      delete pos1[i];
    }

    return animations;
  }

  // execute an array of animations
  doAnimations(animations, oldPos, newPos) {
    if (animations.length === 0) {
      return;
    }

    let numFinished = 0;
    const onFinishAnimation3 = () => {
      // exit if all the animations aren't finished
      numFinished = numFinished + 1;
      if (numFinished !== animations.length) {
        return;
      }

      this.drawPositionInstant();

      this.dispatchEvent(
        new CustomEvent('move-end', {
          bubbles: true,
          detail: {
            oldPosition: deepCopy(oldPos),
            newPosition: deepCopy(newPos),
          },
        })
      );
    };

    for (const animation of animations) {
      // clear a piece
      if (animation.type === 'clear') {
        const piece = this.shadowRoot.querySelector(
          '#' + this.squareElsIds[animation.square] + ' .' + CSS.piece
        );
        piece.style.transitionProperty = 'opacity';
        piece.style.transitionDuration = `${speedToMS(
          this.config.trashSpeed
        )}ms`;
        piece.style.opacity = 0;
        const transitionEndListener = () => {
          piece.removeEventListener('transitionend', transitionEndListener);
          onFinishAnimation3();
        };
        piece.addEventListener('transitionend', transitionEndListener);

        // add a piece with no spare pieces - fade the piece onto the square
      } else if (animation.type === 'add' && !this.config.sparePieces) {
        const square = this.shadowRoot.querySelector(
          '#' + this.squareElsIds[animation.square]
        );
        square.insertAdjacentHTML(
          'beforeend',
          this.buildPieceHTML(animation.piece)
        );
        const piece = square.querySelector('.' + CSS.piece);

        piece.style.opacity = 0;
        setTimeout(() => {
          piece.style.transitionProperty = 'opacity';
          piece.style.transitionDuration = `${speedToMS(
            this.config.appearSpeed
          )}ms`;
          piece.style.opacity = 1;
          const transitionEndListener = () => {
            piece.removeEventListener('transitionend', transitionEndListener);
            onFinishAnimation3();
          };
          piece.addEventListener('transitionend', transitionEndListener);
        }, 0);

        // add a piece with spare pieces - animate from the spares
      } else if (animation.type === 'add' && this.config.sparePieces) {
        this.animateSparePieceToSquare(
          animation.piece,
          animation.square,
          onFinishAnimation3
        );

        // move a piece from squareA to squareB
      } else if (animation.type === 'move') {
        this.animateSquareToSquare(
          animation.source,
          animation.destination,
          animation.piece,
          onFinishAnimation3
        );
      }
    }
  }

  animateSparePieceToSquare(piece, dest, completeFn) {
    const srcSquare = this.shadowRoot.querySelector(
      '#' + this.sparePiecesElsIds[piece]
    );
    const srcRect = srcSquare.getBoundingClientRect();
    const destSquare = this.shadowRoot.querySelector(
      '#' + this.squareElsIds[dest]
    );
    const destRect = destSquare.getBoundingClientRect();

    // create the animate piece
    const pieceId = uuid();
    document.body.insertAdjacentHTML(
      'beforeend',
      this.buildPieceHTML(piece, true, pieceId)
    );
    const animatedPiece = document.getElementById(pieceId);
    animatedPiece.style.display = '';
    animatedPiece.style.position = 'absolute';
    animatedPiece.style.left = `${srcRect.left}px`;
    animatedPiece.style.top = `${srcRect.top}px`;

    // on complete
    const onFinishAnimation2 = () => {
      animatedPiece.removeEventListener('transitionend', onFinishAnimation2);

      // add the "real" piece to the destination square
      const destPiece = destSquare.querySelector('.' + CSS.piece);
      if (destPiece) {
        destPiece.remove();
      }
      destSquare.insertAdjacentHTML('beforeend', this.buildPieceHTML(piece));

      // remove the animated piece
      animatedPiece.remove();

      // run complete function
      if (isFunction(completeFn)) {
        completeFn();
      }
    };

    // animate the piece to the destination square
    animatedPiece.style.transitionProperty = 'top, left';
    animatedPiece.style.transitionDuration = `${speedToMS(
      this.config.moveSpeed
    )}ms`;
    animatedPiece.style.top = `${destRect.top + document.body.scrollTop}px`;
    animatedPiece.style.left = `${destRect.left + document.body.scrollLeft}px`;
    animatedPiece.addEventListener('transitionend', onFinishAnimation2);
  }

  animateSquareToSquare(src, dest, piece, completeFn) {
    // get information about the source and destination squares
    const srcSquare = this.shadowRoot.querySelector(
      '#' + this.squareElsIds[src]
    );
    const srcSquareRect = srcSquare.getBoundingClientRect();
    const destSquare = this.shadowRoot.querySelector(
      '#' + this.squareElsIds[dest]
    );
    const destSquareRect = destSquare.getBoundingClientRect();

    // create the animated piece and absolutely position it
    // over the source square
    const animatedPieceId = uuid();
    document.body.insertAdjacentHTML(
      'beforeend',
      this.buildPieceHTML(piece, true, animatedPieceId)
    );
    const animatedPiece = document.getElementById(animatedPieceId);
    animatedPiece.style.display = '';
    animatedPiece.style.position = 'absolute';
    animatedPiece.style.left = `${srcSquareRect.left}px`;
    animatedPiece.style.top = `${srcSquareRect.top}px`;

    // remove original piece from source square
    const srcPiece = srcSquare.querySelector('.' + CSS.piece);
    if (srcPiece) {
      srcPiece.remove();
    }

    const onFinishAnimation1 = () => {
      animatedPiece.removeEventListener('transitionend', onFinishAnimation1);

      // add the "real" piece to the destination square
      destSquare.insertAdjacentHTML('beforeend', this.buildPieceHTML(piece));

      // remove the animated piece
      animatedPiece.remove();

      // run complete function
      if (isFunction(completeFn)) {
        completeFn();
      }
    };

    // animate the piece to the destination square
    animatedPiece.style.transitionProperty = 'top, left';
    animatedPiece.style.transitionDuration = `${speedToMS(
      this.config.moveSpeed
    )}ms`;
    animatedPiece.style.top = `${destSquareRect.top +
      document.body.scrollTop}px`;
    animatedPiece.style.left = `${destSquareRect.left +
      document.body.scrollLeft}px`;
    animatedPiece.addEventListener('transitionend', onFinishAnimation1);
  }

  // -------------------------------------------------------------------------
  // Validation / Errors
  // -------------------------------------------------------------------------

  error(code, msg, obj) {
    // do nothing if showErrors is not set
    if (
      this.config.hasOwnProperty('showErrors') !== true ||
      this.config.showErrors === false
    ) {
      return;
    }

    let errorText = 'Chessboard Error ' + code + ': ' + msg;

    // print to console
    if (
      this.config.showErrors === 'console' &&
      typeof console === 'object' &&
      typeof console.log === 'function'
    ) {
      console.log(errorText);
      if (arguments.length >= 2) {
        console.log(obj);
      }
      return;
    }

    // alert errors
    if (this.config.showErrors === 'alert') {
      if (obj) {
        errorText += '\n\n' + JSON.stringify(obj);
      }
      window.alert(errorText);
      return;
    }

    // custom function
    if (isFunction(this.config.showErrors)) {
      this.config.showErrors(code, msg, obj);
    }
  }
}
customElements.define('chess-board', ChessBoardElement);
