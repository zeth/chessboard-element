// chessboard.js v@VERSION
// https://github.com/oakmac/chessboardjs/
//
// Copyright (c) 2019, Chris Oakman
// Released under the MIT license
// https://github.com/oakmac/chessboardjs/blob/master/LICENSE.md

import {UpdatingElement, customElement, property, PropertyValues} from 'lit-element';

import {
  throttle,
  uuid,
  deepCopy,
  interpolateTemplate,
  isString,
  isFunction,
  isInteger,
} from './utils.js';
import {styles} from './chessboard-styles.js';
import {
  objToFen,
  findClosestPiece,
  calculatePositionFromMoves,
  validMove,
  validSquare,
  validPositionObject,
  PositionObject,
  Position,
  Piece,
  COLUMNS,
  normalizePozition,
} from './chess-utils.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_DRAG_THROTTLE_RATE = 20;

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
// Type Definitions
// ---------------------------------------------------------------------------

export type AnimationSpeed = 'fast' | 'slow' | number;

export type SquareColor = 'black' | 'white';
export type Offset = {top: number; left: number};
export type Location = string;
export type Action = OffBoardAction | 'drop';
export type OffBoardAction = 'trash' | 'snapback';

export type Animation =
  | {
      type: 'move';
      source: string;
      destination: string;
      piece: string;
      square?: undefined;
    }
  | {
      type: 'add';
      square: string;
      piece: string;
    }
  | {
      type: 'clear';
      square: string;
      piece: string;
    };

export interface Config {
  sparePieces: boolean;
  pieceTheme: string | ((p: string) => string);
  appearSpeed: AnimationSpeed;
  moveSpeed: AnimationSpeed;
  snapbackSpeed: AnimationSpeed;
  snapSpeed: AnimationSpeed;
  trashSpeed: AnimationSpeed;
  dragThrottleRate: number;
  showErrors:
    | boolean
    | 'console'
    | 'alert'
    | ((code: number, msg: string, obj?: unknown) => void);
}

// ---------------------------------------------------------------------------
// Predicates
// ---------------------------------------------------------------------------

function validAnimationSpeed(speed: unknown): speed is AnimationSpeed {
  if (speed === 'fast' || speed === 'slow') return true;
  if (!isInteger(speed)) return false;
  return speed >= 0;
}

function validThrottleRate(rate: unknown): rate is number {
  return isInteger(rate) && rate >= 1;
}

function isTouchDevice() {
  return 'ontouchstart' in document.documentElement;
}

// ---------------------------------------------------------------------------
// HTML
// ---------------------------------------------------------------------------

const buildContainerHTML = (hasSparePieces: boolean) => `
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
function expandConfig(config: Partial<Config>): Config {
  // default for sparePieces is false
  if (config.sparePieces !== true) config.sparePieces = false;

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

  return config as Config;
}

const speedToMS = (speed: AnimationSpeed) => {
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

const squareId = (square: Location) => `square-${square}`;
const sparePieceId = (piece: Piece) => `spare-piece-${piece}`;

@customElement('chess-board')
export class ChessBoardElement extends UpdatingElement {

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'piece-theme',
      'move-speed',
      'snapback-speed',
      'snap-speed',
      'trash-speed',
      'appear-speed',
      'spare-pieces',
    ];
  }

  /**
   * The current position of the board, as a `PositionObject`. This property may
   * be set externally, but only to valid `PositionObject`s. The value is copied
   * before being applied to the board. Changes to the position object are not
   * reflected in th rendering.
   * 
   * To set the position using FEN, or a keyword like `'start'`, or to use
   * animations, use the `setPosition` method.
   */
  @property({
    converter: (value: string) => normalizePozition(value),
  })
  get position(): PositionObject {
    return this._currentPosition;
  }

  set position(v: PositionObject) {
    const oldValue = this._currentPosition;
    this._setCurrentPosition(v);
    this.requestUpdate('position', oldValue);
  }

  @property({
    attribute: 'hide-notation',
    type: Boolean
  })
  hideNotation = false;

  get showNotation() {
    return !this.hideNotation;
  }

  set showNotation(v: boolean) {
    this.hideNotation = !v;
  }

  @property()
  orientation: SquareColor = 'white';

  @property({
    attribute: 'draggable-pieces',
    type: Boolean,
  })
  draggablePieces = false;

  @property({attribute: 'drop-off-board'})
  dropOffBoard: OffBoardAction = 'snapback';

  private config: Config;

  // DOM elements
  private _board!: HTMLElement;
  private _draggedPieceElement!: HTMLElement;
  private _sparePiecesTop!: HTMLElement | null;
  private _sparePiecesBottom!: HTMLElement | null;
  private _container: HTMLElement;

  private _currentPosition: PositionObject = {};
  private _draggedPiece: string | null = null;
  private _draggedPieceLocation: Location | 'offboard' | 'spare' | null = null;
  private _draggedPieceSource: string | null = null;
  private _isDragging = false;

  private get _squareSize() {
    // Note: this isn't cached, but is called during user interactions, so we
    // have a bit of time to use under RAIL guidelines.
    return this._container.offsetWidth / 8;
  }

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
        }
        ${styles}
      </style>
      <div id="container"></div>
    `;

    this._container = this.shadowRoot!.querySelector(
      '#container'
    ) as HTMLElement;

    // ensure the config object is what we expect
    const config = (this.config = expandConfig({}));

    // draggable must be true if sparePieces is enabled
    if (config.sparePieces) this.draggablePieces = true;


    // -------------------------------------------------------------------------
    // Browser Events
    // -------------------------------------------------------------------------

    const mousedownSquare = (e: MouseEvent) => {
      // do nothing if we're not draggable
      if (!this.draggablePieces) {
        return;
      }

      // do nothing if there is no piece on this square
      const squareEl = (e.target as HTMLElement).closest('[data-square]');
      const square = squareEl!.getAttribute('data-square');
      if (!validSquare(square)) {
        return;
      }
      if (!this._currentPosition.hasOwnProperty(square)) {
        return;
      }
      this._beginDraggingPiece(
        square,
        this._currentPosition[square],
        e.pageX,
        e.pageY
      );
    };

    const touchstartSquare = (e: TouchEvent) => {
      // do nothing if we're not draggable
      if (!this.draggablePieces) {
        return;
      }

      // do nothing if there is no piece on this square
      const squareEl = (e.target as HTMLElement).closest('[data-square]');
      const square = squareEl!.getAttribute('data-square');
      if (!validSquare(square)) {
        return;
      }
      if (!this._currentPosition.hasOwnProperty(square)) {
        return;
      }

      e = (e as any).originalEvent;
      this._beginDraggingPiece(
        square,
        this._currentPosition[square],
        e.changedTouches[0].pageX,
        e.changedTouches[0].pageY
      );
    };

    const mousedownSparePiece = (e: MouseEvent) => {
      // do nothing if sparePieces is not enabled
      if (!config.sparePieces) {
        return;
      }
      const pieceEl = (e.target as HTMLElement).closest('[data-piece]');
      const piece = pieceEl!.getAttribute('data-piece');

      this._beginDraggingPiece('spare', piece, e.pageX, e.pageY);
    };

    const touchstartSparePiece = (e: TouchEvent) => {
      // do nothing if sparePieces is not enabled
      if (!config.sparePieces) return;

      const pieceEl = (e.target as HTMLElement).closest('[data-piece]');
      const piece = pieceEl!.getAttribute('data-piece');

      e = (e as any).originalEvent;
      this._beginDraggingPiece(
        'spare',
        piece,
        e.changedTouches[0].pageX,
        e.changedTouches[0].pageY
      );
    };

    const mousemoveWindow = (e: MouseEvent) => {
      if (this._isDragging) {
        this._updateDraggedPiece(e.pageX, e.pageY);
      }
    };

    const throttledMousemoveWindow = throttle(
      mousemoveWindow,
      this.config.dragThrottleRate
    );

    const touchmoveWindow = (e: TouchEvent) => {
      // do nothing if we are not dragging a piece
      if (!this._isDragging) {
        return;
      }

      // prevent screen from scrolling
      e.preventDefault();

      this._updateDraggedPiece(
        (e as any).originalEvent.changedTouches[0].pageX,
        (e as any).originalEvent.changedTouches[0].pageY
      );
    };

    const throttledTouchmoveWindow = throttle(
      touchmoveWindow,
      this.config.dragThrottleRate
    );

    const mouseupWindow = (e: MouseEvent) => {
      // do nothing if we are not dragging a piece
      if (!this._isDragging) {
        return;
      }

      // get the location
      const location = this._isXYOnSquare(e.pageX, e.pageY);

      this._stopDraggedPiece(location);
    };

    const touchendWindow = (e: TouchEvent) => {
      // do nothing if we are not dragging a piece
      if (!this._isDragging) {
        return;
      }

      // get the location
      const location = this._isXYOnSquare(
        (e as any).originalEvent.changedTouches[0].pageX,
        (e as any).originalEvent.changedTouches[0].pageY
      );

      this._stopDraggedPiece(location);
    };

    const mouseenterSquare = (e: Event) => {
      // do not fire this event if we are dragging a piece
      // NOTE: this should never happen, but it's a safeguard
      if (this._isDragging) {
        return;
      }

      // get the square
      const square = (e.currentTarget as HTMLElement).getAttribute(
        'data-square'
      );

      // NOTE: this should never happen; defensive
      if (!validSquare(square)) {
        return;
      }

      // get the piece on this square
      let piece: string | false = false;

      if (this._currentPosition.hasOwnProperty(square)) {
        piece = this._currentPosition[square];
      }

      this.dispatchEvent(
        new CustomEvent('mouseover-square', {
          bubbles: true,
          detail: {
            square,
            piece,
            position: deepCopy(this._currentPosition),
            orientation: this.orientation,
          },
        })
      );
    };

    const mouseleaveSquare = (e: Event) => {
      // do not fire this event if we are dragging a piece
      // NOTE: this should never happen, but it's a safeguard
      if (this._isDragging) {
        return;
      }

      // get the square
      const square = (e.currentTarget as HTMLElement).getAttribute(
        'data-square'
      );

      // NOTE: this should never happen; defensive
      if (!validSquare(square)) {
        return;
      }

      // get the piece on this square
      let piece: string | false = false;

      if (this._currentPosition.hasOwnProperty(square)) {
        piece = this._currentPosition[square];
      }

      // execute their function
      this.dispatchEvent(
        new CustomEvent('mouseout-square', {
          bubbles: true,
          detail: {
            square,
            piece,
            position: deepCopy(this._currentPosition),
            orientation: this.orientation,
          },
        })
      );
    };

    // -------------------------------------------------------------------------
    // Initialization
    // -------------------------------------------------------------------------

    const addEvents = () => {
      // prevent "image drag"
      this.shadowRoot!.addEventListener('mousedown', (e) => {
        if ((e.target as HTMLElement).matches('.' + CSS.piece)) {
          e.preventDefault();
        }
      });
      this.shadowRoot!.addEventListener('mousemove', (e) => {
        if ((e.target as HTMLElement).matches('.' + CSS.piece)) {
          e.preventDefault();
        }
      });

      // mouse drag pieces
      this.shadowRoot!.addEventListener('mousedown', (e) => {
        if ((e.target as HTMLElement).closest('.' + CSS.square)) {
          mousedownSquare(e as MouseEvent);
        }
      });
      this.shadowRoot!.addEventListener('mousedown', (e) => {
        if (
          (e.target as HTMLElement).closest(
            '.' + CSS.sparePieces + ' .' + CSS.piece
          )
        ) {
          mousedownSparePiece(e as MouseEvent);
        }
      });

      // mouse enter / leave square
      const squares = this.shadowRoot!.querySelectorAll('.' + CSS.square);
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
          if ((e.target as HTMLElement).closest('.' + CSS.square)) {
            touchstartSquare(e);
          }
        });
        this._container.addEventListener('touchstart', (e) => {
          if (
            (e.target as HTMLElement).closest(
              '.' + CSS.sparePieces + ' .' + CSS.piece
            )
          ) {
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

    this._initDOM();
    addEvents();
  }

  private _getSquareElement(square: Location): HTMLElement {
    return this.shadowRoot!.getElementById(squareId(square))!;
  }

  private _getSparePieceElement(piece: Piece): HTMLElement {
    return this.shadowRoot!.getElementById(sparePieceId(piece))!;
  }

  // -------------------------------------------------------------------------
  // Markup Building
  // -------------------------------------------------------------------------

  private _initDOM() {
    // create unique IDs for all the elements we will create
    // this._createElIds();

    // build board and save it in memory
    this._container.innerHTML = buildContainerHTML(this.config.sparePieces);

    this._board = this._container.querySelector('.' + CSS.board) as HTMLElement;

    this._sparePiecesTop = this._container.querySelector(
      '.' + CSS.sparePiecesTop
    );
    this._sparePiecesBottom = this._container.querySelector(
      '.' + CSS.sparePiecesBottom
    );

    // set the size and draw the board
    this.resize();
  }

  private _buildPieceImgSrc(piece: string) {
    if (isFunction(this.config.pieceTheme)) {
      return this.config.pieceTheme(piece);
    }

    if (isString(this.config.pieceTheme)) {
      return interpolateTemplate(this.config.pieceTheme, {piece: piece});
    }

    // NOTE: this should never happen
    this._error(8272, 'Unable to build image source for config.pieceTheme.');
    return '';
  }

  private _buildPieceHTML(piece: string, hidden?: boolean, id?: string) {
    return `
      <img
        src="${this._buildPieceImgSrc(piece)}"
        ${isString(id) && id !== '' ? `id="${id}"` : ``}
        alt=""
        class="${CSS.piece}"
        data-piece="${piece}"
        style="${hidden ? `display:none;` : ``}"
      >`;
  }

  private _buildBoardHTML(orientation: SquareColor) {
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

    let squareColor: SquareColor = 'white';
    for (let i = 0; i < 8; i++) {
      // html += `<div class="${CSS.row}">`;
      for (let j = 0; j < 8; j++) {
        const square = alpha[j] + row;

        html +=
          `<div class="${CSS.square} ${CSS[squareColor]} square-${square}" ` +
          `id="${squareId(square)}" ` +
          `data-square="${square}" ` +
          `part="${square} ${squareColor}" ` +
          '>';

        if (this.showNotation) {
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

      squareColor = squareColor === 'white' ? 'black' : 'white';

      if (orientation === 'white') {
        row = row - 1;
      } else {
        row = row + 1;
      }
    }

    return html;
  }

  private _buildSparePiecesHTML(color: SquareColor) {
    let pieces = ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP'];
    if (color === 'black') {
      pieces = ['bK', 'bQ', 'bR', 'bB', 'bN', 'bP'];
    }

    let html = '<div></div>';
    for (let i = 0; i < pieces.length; i++) {
      html += `<div>${this._buildPieceHTML(
        pieces[i],
        false,
        sparePieceId(pieces[i])
      )}</div>`;
    }
    html += '<div></div>';

    return html;
  }

  // -------------------------------------------------------------------------
  // Public Methods
  // -------------------------------------------------------------------------

  setPosition(position: Position, useAnimation?: boolean) {
    position = normalizePozition(position);

    // validate position object
    if (!validPositionObject(position)) {
      throw this._error(
        6482,
        'Invalid value passed to the position method.',
        position
      );
    }

    // default for useAnimations is true
    if (useAnimation !== false) {
      useAnimation = true;
    }

    if (useAnimation) {
      // start the animations
      const animations = this._calculateAnimations(
        this._currentPosition,
        position
      );
      this._doAnimations(animations, this._currentPosition, position);

      // set the new position
      this._setCurrentPosition(position);
    } else {
      // instant update
      this._setCurrentPosition(position);
      this._drawPositionInstant();
    }
  }

  // shorthand method to get the current FEN
  fen() {
    return objToFen(this._currentPosition);
  }

  // set the starting position
  start(useAnimation?: boolean) {
    this.setPosition('start', useAnimation);
  }

  // clear the board
  clear(useAnimation?: boolean) {
    this.setPosition({}, useAnimation);
  }

  // move pieces
  move(...args: Array<string | false>) {
    let useAnimation = true;

    // collect the moves into an object
    const moves: {[from: string]: string} = {};
    for (const arg of args) {
      // any "false" to this function means no animations
      if (arg === false) {
        useAnimation = false;
        continue;
      }

      // skip invalid arguments
      if (!validMove(arg)) {
        this._error(2826, 'Invalid move passed to the move method.', arg);
        continue;
      }

      const [from, to] = arg.split('-');
      moves[from] = to;
    }

    // calculate position from moves
    const newPos = calculatePositionFromMoves(this._currentPosition, moves);

    // update the board
    this.setPosition(newPos, useAnimation);

    // return the new position object
    return newPos;
  }

  /**
   * Flip the orientation.
   */ 
  flip() {
    this.orientation = this.orientation === 'white' ? 'black' : 'white';
  }

  resize() {
    // set board size
    this._board.style.width = this._squareSize * 8 + 'px';
    this._board.style.height = this._squareSize * 8 + 'px';

    // set drag piece size
    if (this._draggedPieceElement) {
      this._draggedPieceElement.style.height = `${this._squareSize}px`;
      this._draggedPieceElement.style.width = `${this._squareSize}px`;
    }

    // redraw the board
    this._drawBoard();
  }

  // TODO: reflect to attribute?
  get pieceTheme() {
    return this.config.pieceTheme;
  }

  set pieceTheme(v) {
    this.config.pieceTheme = v;
    this._drawPositionInstant();
  }

  // -------------------------------------------------------------------------
  // Lifecycle Callbacks
  // -------------------------------------------------------------------------

  update(changedProperties: PropertyValues) {
    super.update(changedProperties);
    // TODO: call this._drawPositionInstant() most of the time so we don't
    // redraw the board unnecessarily.
    this._drawBoard();
  }

  connectedCallback() {
    super.connectedCallback();
    // create the drag piece
    const draggedPieceId = uuid();

    this._container.insertAdjacentHTML(
      'beforeend',
      this._buildPieceHTML('wP', true, draggedPieceId)
    );
    this._draggedPieceElement = this.shadowRoot!.getElementById(draggedPieceId)!;

    this.resize();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // remove the drag piece from the page
    this._draggedPieceElement.remove();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    switch (name) {
      case 'piece-theme':
        this.config.pieceTheme = newValue as any;
        this._drawBoard();
        break;
      case 'move-speed':
        this.config.moveSpeed = newValue as any;
        this._drawBoard();
        break;
      case 'snapback-speed':
        this.config.snapbackSpeed = newValue as any;
        this._drawBoard();
        break;
      case 'snap-speed':
        this.config.snapSpeed = newValue as any;
        this._drawBoard();
        break;
      case 'trash-speed':
        this.config.trashSpeed = newValue as any;
        this._drawBoard();
        break;
      case 'appear-speed':
        this.config.appearSpeed = newValue as any;
        this._drawBoard();
        break;
      case 'spare-pieces':
        this.config.sparePieces = newValue !== null;
        this._initDOM();
        this._drawBoard();
        break;
      default:
        super.attributeChangedCallback(name, oldValue, newValue);
    }
  }

  // -------------------------------------------------------------------------
  // Control Flow
  // -------------------------------------------------------------------------

  private _drawBoard() {
    this._board.innerHTML = this._buildBoardHTML(this.orientation);
    this._drawPositionInstant();

    if (this.config.sparePieces) {
      if (this.orientation === 'white') {
        this._sparePiecesTop!.innerHTML = this._buildSparePiecesHTML('black');
        this._sparePiecesBottom!.innerHTML = this._buildSparePiecesHTML('white');
      } else {
        this._sparePiecesTop!.innerHTML = this._buildSparePiecesHTML('white');
        this._sparePiecesBottom!.innerHTML = this._buildSparePiecesHTML('black');
      }
    }
  }

  private _setCurrentPosition(position: PositionObject) {
    const oldPos = deepCopy(this._currentPosition);
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
    this._currentPosition = position;
  }

  private _drawPositionInstant() {
    // clear the board
    const pieces = this._board.querySelectorAll('.' + CSS.piece);
    for (const piece of Array.from(pieces)) {
      piece.remove();
    }

    // add the pieces
    for (const i in this._currentPosition) {
      if (!this._currentPosition.hasOwnProperty(i)) {
        continue;
      }
      const pieceHTML = this._buildPieceHTML(this._currentPosition[i]);
      const square = this._getSquareElement(i);
      square.insertAdjacentHTML('beforeend', pieceHTML);
    }
  }

  private _isXYOnSquare(x: number, y: number): Location | 'offboard' {
    // TODO: test that this works with the polyfill
    const elements = this.shadowRoot!.elementsFromPoint(x, y);
    const square = elements.find((e) => e.classList.contains('square'));
    return square === undefined ? 'offboard' : (square.getAttribute('data-square') as Location);
  }

  private _removeSquareHighlights() {
    const squares = this.shadowRoot!.querySelectorAll('.' + CSS.square);
    for (const square of Array.from(squares)) {
      square.classList.remove(CSS.highlight1);
      square.classList.remove(CSS.highlight2);
    }
  }

  private _snapbackDraggedPiece() {
    // there is no "snapback" for spare pieces
    if (this._draggedPieceSource === 'spare') {
      this._trashDraggedPiece();
      return;
    }

    this._removeSquareHighlights();

    // animation complete
    const complete = () => {
      this._draggedPieceElement.removeEventListener('transitionend', complete);

      this._drawPositionInstant();
      this._draggedPieceElement.style.display = 'none';

      this.dispatchEvent(
        new CustomEvent('snapback-end', {
          bubbles: true,
          detail: {
            piece: this._draggedPiece,
            square: this._draggedPieceSource,
            position: deepCopy(this._currentPosition),
            orientation: this.orientation,
          },
        })
      );
    };

    // get source square position
    const square = this._getSquareElement(this._draggedPieceSource!);
    const rect = square.getBoundingClientRect();

    // animate the piece to the target square
    this._draggedPieceElement.style.transitionProperty = 'top, left';
    this._draggedPieceElement.style.transitionDuration = `${this.config.snapbackSpeed}ms`;
    this._draggedPieceElement.style.top = `${rect.top + document.body.scrollTop}px`;
    this._draggedPieceElement.style.left = `${rect.left + document.body.scrollLeft}px`;
    this._draggedPieceElement.addEventListener('transitionend', complete);

    // set state
    this._isDragging = false;
  }

  private _trashDraggedPiece() {
    this._removeSquareHighlights();

    // remove the source piece
    const newPosition = deepCopy(this._currentPosition);
    delete newPosition[this._draggedPieceSource!];
    this._setCurrentPosition(newPosition);

    // redraw the position
    this._drawPositionInstant();

    // hide the dragged piece
    this._draggedPieceElement.style.transitionProperty = 'opacity';
    this._draggedPieceElement.style.transitionDuration = `${speedToMS(
      this.config.trashSpeed
    )}ms`;
    this._draggedPieceElement.style.opacity = '0';

    // set state
    this._isDragging = false;
  }

  private _dropDraggedPieceOnSquare(square: string) {
    this._removeSquareHighlights();

    // update position
    const newPosition = deepCopy(this._currentPosition);
    delete newPosition[this._draggedPieceSource!];
    newPosition[square] = this._draggedPiece;
    this._setCurrentPosition(newPosition);

    // get target square information
    const targetSquare = this._getSquareElement(square);
    const rect = targetSquare.getBoundingClientRect();

    // animation complete
    const onAnimationComplete = () => {
      this._draggedPieceElement.removeEventListener(
        'transitionend',
        onAnimationComplete
      );

      this._drawPositionInstant();
      this._draggedPieceElement.style.display = 'none';

      // Fire the snap-end event
      this.dispatchEvent(
        new CustomEvent('snap-end', {
          bubbles: true,
          detail: {
            source: this._draggedPieceSource,
            square,
            piece: this._draggedPiece,
          },
        })
      );
    };

    // snap the piece to the target square
    this._draggedPieceElement.style.transitionProperty = 'top, left';
    this._draggedPieceElement.style.transitionDuration = `${this.config.snapbackSpeed}ms`;
    this._draggedPieceElement.style.top = `${rect.top + document.body.scrollTop}px`;
    this._draggedPieceElement.style.left = `${rect.left + document.body.scrollLeft}px`;
    this._draggedPieceElement.addEventListener('transitionend', onAnimationComplete);

    // set state
    this._isDragging = false;
  }

  private _beginDraggingPiece(
    source: string,
    piece: string | null,
    x: number,
    y: number
  ) {
    // Fire cancalable drag-start event
    const event = new CustomEvent('drag-start', {
      bubbles: true,
      cancelable: true,
      detail: {
        source,
        piece,
        position: deepCopy(this._currentPosition),
        orientation: this.orientation,
      },
    });
    this.dispatchEvent(event);
    if (event.defaultPrevented) {
      return;
    }

    // set state
    this._isDragging = true;
    this._draggedPiece = piece;
    this._draggedPieceSource = source;

    // if the piece came from spare pieces, location is offboard
    if (source === 'spare') {
      this._draggedPieceLocation = 'offboard';
    } else {
      this._draggedPieceLocation = source;
    }

    // create the dragged piece
    this._draggedPieceElement.setAttribute('src', this._buildPieceImgSrc(piece!));
    this._draggedPieceElement.style.opacity = '1';
    this._draggedPieceElement.style.display = '';
    this._draggedPieceElement.style.position = 'absolute';
    this._draggedPieceElement.style.left = `${x - this._squareSize / 2}px`;
    this._draggedPieceElement.style.top = `${y - this._squareSize / 2}px`;

    if (source !== 'spare') {
      // highlight the source square and hide the piece
      const sourceSquare = this._getSquareElement(source);
      sourceSquare.classList.add(CSS.highlight1);
      // TODO: there can only be one piece per square, why is the qSA()?
      const pieces = sourceSquare.querySelectorAll('.' + CSS.piece);
      (pieces as NodeListOf<HTMLElement>).forEach((piece) => {
        piece.style.display = 'none';
      });
    }
  }

  private _updateDraggedPiece(x: number, y: number) {
    // put the dragged piece over the mouse cursor
    this._draggedPieceElement.style.left = `${x - this._squareSize / 2}px`;
    this._draggedPieceElement.style.top = `${y - this._squareSize / 2}px`;

    // get location
    const location = this._isXYOnSquare(x, y);

    // do nothing if the location has not changed
    if (location === this._draggedPieceLocation) {
      return;
    }

    // remove highlight from previous square
    if (validSquare(this._draggedPieceLocation)) {
      const previousSquare = this._getSquareElement(this._draggedPieceLocation);
      previousSquare.classList.remove(CSS.highlight2);
    }

    // add highlight to new square
    if (validSquare(location)) {
      const locationSquare = this._getSquareElement(location);
      locationSquare.classList.add(CSS.highlight2);
    }

    this.dispatchEvent(
      new CustomEvent('drag-move', {
        bubbles: true,
        detail: {
          newLocation: location,
          oldLocation: this._draggedPieceLocation,
          source: this._draggedPieceSource,
          piece: this._draggedPiece,
          position: deepCopy(this._currentPosition),
          orientation: this.orientation,
        },
      })
    );

    // update state
    this._draggedPieceLocation = location;
  }

  private _stopDraggedPiece(location: Location | 'offboard') {
    // determine what the action should be
    let action: Action = 'drop';
    if (location === 'offboard') {
      action = this.dropOffBoard === 'trash' ? 'trash' : 'snapback';
    }
    
    // run their onDrop function, which can potentially change the drop action
    const newPosition = deepCopy(this._currentPosition);

    // source piece is a spare piece and position is off the board
    // if (draggedPieceSource === 'spare' && location === 'offboard') {...}
    // position has not changed; do nothing

    // source piece is a spare piece and position is on the board
    if (this._draggedPieceSource === 'spare' && validSquare(location)) {
      // add the piece to the board
      newPosition[location] = this._draggedPiece;
    }

    // source piece was on the board and position is off the board
    if (validSquare(this._draggedPieceSource) && location === 'offboard') {
      // remove the piece from the board
      delete newPosition[this._draggedPieceSource];
    }

    // source piece was on the board and position is on the board
    if (validSquare(this._draggedPieceSource) && validSquare(location)) {
      // move the piece
      delete newPosition[this._draggedPieceSource];
      newPosition[location] = this._draggedPiece;
    }

    const oldPosition = deepCopy(this._currentPosition);

    const dropEvent = new CustomEvent('drop', {
      bubbles: true,
      detail: {
        source: this._draggedPieceSource,
        target: location,
        piece: this._draggedPiece,
        newPosition,
        oldPosition,
        orientation: this.orientation,
        setAction(a: Action) {
          action = a;
        },
      },
    });
    this.dispatchEvent(dropEvent);

    // do it!
    if (action === 'snapback') {
      this._snapbackDraggedPiece();
    } else if (action === 'trash') {
      this._trashDraggedPiece();
    } else if (action === 'drop') {
      this._dropDraggedPieceOnSquare(location);
    }
  }

  // -------------------------------------------------------------------------
  // Animations
  // -------------------------------------------------------------------------

  // calculate an array of animations that need to happen in order to get
  // from pos1 to pos2
  private _calculateAnimations(pos1: PositionObject, pos2: PositionObject): Animation[] {
    // make copies of both
    pos1 = deepCopy(pos1);
    pos2 = deepCopy(pos2);

    const animations: Animation[] = [];
    const squaresMovedTo: {[square: string]: boolean} = {};

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
  private _doAnimations(
    animations: Animation[],
    oldPos: PositionObject,
    newPos: PositionObject
  ) {
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

      this._drawPositionInstant();

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
        const square = this._getSquareElement(animation.square);
        const piece = square.querySelector(` .${CSS.piece}`) as HTMLElement;
        piece.style.transitionProperty = 'opacity';
        piece.style.transitionDuration = `${speedToMS(
          this.config.trashSpeed
        )}ms`;
        piece.style.opacity = '0';
        const transitionEndListener = () => {
          piece.removeEventListener('transitionend', transitionEndListener);
          onFinishAnimation3();
        };
        piece.addEventListener('transitionend', transitionEndListener);

        // add a piece with no spare pieces - fade the piece onto the square
      } else if (animation.type === 'add' && !this.config.sparePieces) {
        const square = this._getSquareElement(animation.square);
        square.insertAdjacentHTML(
          'beforeend',
          this._buildPieceHTML(animation.piece)
        );
        const piece = square.querySelector('.' + CSS.piece) as HTMLElement;

        piece.style.opacity = '0';
        setTimeout(() => {
          piece.style.transitionProperty = 'opacity';
          piece.style.transitionDuration = `${speedToMS(
            this.config.appearSpeed
          )}ms`;
          piece.style.opacity = '1';
          const transitionEndListener = () => {
            piece.removeEventListener('transitionend', transitionEndListener);
            onFinishAnimation3();
          };
          piece.addEventListener('transitionend', transitionEndListener);
        }, 0);

        // add a piece with spare pieces - animate from the spares
      } else if (animation.type === 'add' && this.config.sparePieces) {
        this._animateSparePieceToSquare(
          animation.piece,
          animation.square,
          onFinishAnimation3
        );

        // move a piece from squareA to squareB
      } else if (animation.type === 'move') {
        this._animateSquareToSquare(
          animation.source,
          animation.destination,
          animation.piece,
          onFinishAnimation3
        );
      }
    }
  }

  private _animateSparePieceToSquare(
    piece: Piece,
    dest: Location,
    completeFn: Function
  ) {
    const srcSquare = this._getSparePieceElement(piece);
    const srcRect = srcSquare.getBoundingClientRect();
    const destSquare = this._getSquareElement(dest);
    const destRect = destSquare.getBoundingClientRect();

    // create the animate piece
    const pieceId = uuid();
    this._container.insertAdjacentHTML(
      'beforeend',
      this._buildPieceHTML(piece, true, pieceId)
    );
    const animatedPiece = this.shadowRoot!.getElementById(
      pieceId
    ) as HTMLElement;
    animatedPiece.style.display = '';
    animatedPiece.style.position = 'absolute';
    animatedPiece.style.left = `${srcRect.left}px`;
    animatedPiece.style.top = `${srcRect.top}px`;
    animatedPiece.style.width = `${this._squareSize}px`;
    animatedPiece.style.height = `${this._squareSize}px`;

    // on complete
    const onFinishAnimation2 = () => {
      animatedPiece.removeEventListener('transitionend', onFinishAnimation2);

      // add the "real" piece to the destination square
      const destPiece = destSquare.querySelector('.' + CSS.piece);
      if (destPiece) {
        destPiece.remove();
      }
      destSquare.insertAdjacentHTML('beforeend', this._buildPieceHTML(piece));

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

  private _animateSquareToSquare(
    src: Location,
    dest: Location,
    piece: Piece,
    completeFn: Function
  ) {
    // get information about the source and destination squares
    const srcSquare = this._getSquareElement(src);
    const srcSquareRect = srcSquare.getBoundingClientRect();
    const destSquare = this._getSquareElement(dest);
    const destSquareRect = destSquare.getBoundingClientRect();

    // create the animated piece and absolutely position it
    // over the source square
    const animatedPieceId = uuid();
    this._container.insertAdjacentHTML(
      'beforeend',
      this._buildPieceHTML(piece, true, animatedPieceId)
    );
    const animatedPiece = this.shadowRoot!.getElementById(
      animatedPieceId
    ) as HTMLElement;
    animatedPiece.style.display = '';
    animatedPiece.style.position = 'absolute';
    animatedPiece.style.left = `${srcSquareRect.left}px`;
    animatedPiece.style.top = `${srcSquareRect.top}px`;
    animatedPiece.style.width = `${this._squareSize}px`;
    animatedPiece.style.height = `${this._squareSize}px`;

    // remove original piece from source square
    const srcPiece = srcSquare.querySelector('.' + CSS.piece);
    if (srcPiece) {
      srcPiece.remove();
    }

    const onFinishAnimation1 = () => {
      animatedPiece.removeEventListener('transitionend', onFinishAnimation1);

      // add the "real" piece to the destination square
      destSquare.insertAdjacentHTML('beforeend', this._buildPieceHTML(piece));

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

  private _error(code: number, msg: string, _obj?: unknown) {
    const errorText = `Chessboard Error ${code} : ${msg}`;
    this.dispatchEvent(new ErrorEvent('error', {
      message: errorText,
    }));
    return new Error(errorText);
  }
}
