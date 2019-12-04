// chessboard.js v@VERSION
// https://github.com/oakmac/chessboardjs/
//
// Copyright (c) 2019, Chris Oakman
// Released under the MIT license
// https://github.com/oakmac/chessboardjs/blob/master/LICENSE.md

import {
  customElement,
  property,
  PropertyValues,
  LitElement,
  html,
  query,
} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map.js';
import {styleMap, StyleInfo} from 'lit-html/directives/style-map.js';
import {ifDefined} from 'lit-html/directives/if-defined.js';
import {nothing} from 'lit-html';

import {
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
  getSquareColor,
} from './chess-utils.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// default animation speeds
const DEFAULT_APPEAR_SPEED = 600; // 200;
const DEFAULT_MOVE_SPEED = 600; //200;
const DEFAULT_SNAPBACK_SPEED = 60;
const DEFAULT_SNAP_SPEED = 30;
const DEFAULT_TRASH_SPEED = 600; //100;

const CSS = {
  alpha: 'alpha',
  black: 'black',
  board: 'board',
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
    type: 'move-start';
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
    }
  | {
    type: 'add-start',
    square: string;
    piece: string;
  };

// ---------------------------------------------------------------------------
// Predicates
// ---------------------------------------------------------------------------

function validAnimationSpeed(speed: unknown): speed is AnimationSpeed {
  if (speed === 'fast' || speed === 'slow') return true;
  if (!isInteger(speed)) return false;
  return speed >= 0;
}

function isTouchDevice() {
  return 'ontouchstart' in document.documentElement;
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
const wikipediaPiece = (p: string) => `img/chesspieces/wikipedia/${p}.png`;

@customElement('chess-board')
export class ChessBoardElement extends LitElement {
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
    type: Boolean,
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

  @property({attribute: 'piece-theme'})
  pieceTheme: string | ((piece: string) => string) = wikipediaPiece;

  @property({
    attribute: 'move-speed',
  })
  moveSpeed: AnimationSpeed = DEFAULT_MOVE_SPEED;

  @property({
    attribute: 'snapback-speed',
  })
  snapbackSpeed: AnimationSpeed = DEFAULT_SNAPBACK_SPEED;

  @property({
    attribute: 'snap-speed',
  })
  snapSpeed: AnimationSpeed = DEFAULT_SNAP_SPEED;

  @property({
    attribute: 'trash-speed',
  })
  trashSpeed: AnimationSpeed = DEFAULT_TRASH_SPEED;

  @property({
    attribute: 'appear-speed',
  })
  appearSpeed: AnimationSpeed = DEFAULT_APPEAR_SPEED;

  @property({
    attribute: 'spare-pieces',
    type: Boolean,
  })
  sparePieces = false;

  @query('.' + CSS.board)
  private _board!: HTMLElement;

  @query('.' + CSS.sparePiecesTop)
  private _sparePiecesTop!: HTMLElement | null;

  @query('.' + CSS.sparePiecesBottom)
  private _sparePiecesBottom!: HTMLElement | null;

  @query('#animated-pieces')
  private _animatedPieces!: HTMLElement;


  private _highlightedSquares = new Set();
  private _draggedPieceElement!: HTMLElement;

  private _animations = new Map<Location, Animation>();

  private _currentPosition: PositionObject = {};
  private _draggedPiece: string | null = null;
  private _draggedPieceLocation: Location | 'offboard' | 'spare' | null = null;
  private _draggedPieceSource: string | null = null;
  private _isDragging = false;

  private get _squareSize() {
    // Note: this isn't cached, but is called during user interactions, so we
    // have a bit of time to use under RAIL guidelines.
    return this.offsetWidth / 8;
  }

  constructor() {
    super();

    // -------------------------------------------------------------------------
    // Browser Events
    // -------------------------------------------------------------------------

    const mousedownSquare = (e: MouseEvent) => {
      // do nothing if we're not draggable. sparePieces implies draggable
      if (!this.draggablePieces && !this.sparePieces) {
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
        this._currentPosition[square]!,
        e.pageX,
        e.pageY
      );
    };

    const touchstartSquare = (e: TouchEvent) => {
      // do nothing if we're not draggable. sparePieces implies draggable
      if (!this.draggablePieces && !this.sparePieces) {
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
        this._currentPosition[square]!,
        e.changedTouches[0].pageX,
        e.changedTouches[0].pageY
      );
    };

    const mousedownSparePiece = (e: MouseEvent) => {
      // do nothing if sparePieces is not enabled
      if (!this.sparePieces) {
        return;
      }
      const pieceEl = (e.target as HTMLElement).closest('[data-piece]');
      const piece = pieceEl!.getAttribute('data-piece');

      this._beginDraggingPiece('spare', piece, e.pageX, e.pageY);
    };

    const touchstartSparePiece = (e: TouchEvent) => {
      // do nothing if sparePieces is not enabled
      if (!this.sparePieces) return;

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
        piece = this._currentPosition[square]!;
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
        piece = this._currentPosition[square]!;
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
      window.addEventListener('mousemove', mousemoveWindow);
      window.addEventListener('mouseup', mouseupWindow);

      // touch drag pieces
      if (isTouchDevice()) {
        this._board.addEventListener('touchstart', (e) => {
          if ((e.target as HTMLElement).closest('.' + CSS.square)) {
            touchstartSquare(e);
          }
        });
        this.shadowRoot!.addEventListener('touchstart', (e) => {
          if (
            (e.target as HTMLElement).closest(
              '.' + CSS.sparePieces + ' .' + CSS.piece
            )
          ) {
            touchstartSparePiece(e as TouchEvent);
          }
        });

        window.addEventListener('touchmove', touchmoveWindow);
        window.addEventListener('touchend', touchendWindow);
      }
    };

    // -------------------------------------------------------------------------
    // Initialization
    // -------------------------------------------------------------------------

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

  render() {
    return html`
      <style>
        ${styles}
      </style>
      <div class="${CSS.sparePieces} ${CSS.sparePiecesTop}"></div>
      <div class="${CSS.board}">${this._renderBoard()}</div>
      <div class="${CSS.sparePieces} ${CSS.sparePiecesBottom}"></div>
      <div id="animated-pieces"></div>
    `;
  }

  private _renderBoard() {
    const results = [];
    const isFlipped = this.orientation === 'black';
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const file = COLUMNS[isFlipped ? 7 - col : col];
        const rank = isFlipped ? row + 1 : 8 - row;
        const square = `${file}${rank}`;
        const squareColor = getSquareColor(square);
        const piece = this._currentPosition[square];
        const isDragSource = square === this._draggedPieceSource;
        const animation = this._animations.get(square);
        const classes = {
          [squareColor]: true,
          [`square-${square}`]: true,
          [CSS.highlight1]: isDragSource,
          [CSS.highlight2]: this._highlightedSquares.has(square),
        };
        results.push(html`
          <div
              class="square ${classMap(classes)}"
              id="${squareId(square)}"
              data-square="${square}"
              part="${square} ${squareColor}">
            ${this.showNotation && row === 7 ? 
              html`<div class="notation alpha">${file}</div>`: nothing}
            ${this.showNotation && col === 0 ? 
              html`<div class="notation numeric">${rank}</div>`: nothing}
            ${this._renderPiece(piece, animation, isDragSource)}
          </div>
        `);
      }
    }
    return results;
  }

  _renderPiece(piece: Piece|undefined, animation: Animation|undefined, isDragSource: boolean) {
    if (isDragSource) {
      return nothing;
    }

    const style: Partial<CSSStyleDeclaration> = {
      opacity: '1',
      transitionProperty: '',
      transitionDuration: '0ms',
    };

    if (animation) {
      if (piece && (animation.type === 'move-start' || (animation.type === 'add-start' && this.draggablePieces))) {
        // Position the moved piece absolutely at the source
        const srcSquare = animation.type === 'move-start'
            ? this._getSquareElement(animation.source)
            : this._getSparePieceElement(piece);
        const destSquare = animation.type === 'move-start'
            ? this._getSquareElement(animation.destination)
            : this._getSquareElement(animation.square);

        const srcSquareRect = srcSquare.getBoundingClientRect();
        const destSquareRect = destSquare.getBoundingClientRect();

        style.position = 'absolute';
        style.left = `${srcSquareRect.left - destSquareRect.left}px`;
        style.top = `${srcSquareRect.top - destSquareRect.top}px`;
        style.width = `${this._squareSize}px`;
        style.height = `${this._squareSize}px`;
      } else if (piece && (animation.type === 'move' || (animation.type === 'add' && this.draggablePieces))) {
        // Transition the moved piece to the destination
        style.position = 'absolute';
        style.transitionProperty = 'top, left';
        style.transitionDuration = `${speedToMS(this.moveSpeed)}ms`;
        // style.top = `${destSquareRect.top}px`;
        // style.left = `${destSquareRect.left}px`;
        style.top = `0`;
        style.left = `0`;
        style.width = `${this._squareSize}px`;
        style.height = `${this._squareSize}px`;
      } else if (!piece && animation.type === 'clear') {
        // Preserve and transition a removed piece to opacity 0
        piece = animation.piece;
        style.transitionProperty = 'opacity';
        style.transitionDuration = `${speedToMS(this.trashSpeed)}ms`;
        style.opacity = '0';
      } else if (piece && animation.type === 'add-start') {
        // Initialize an added piece to opacity 0
        style.opacity = '0';
      } else if (piece && animation.type === 'add') {
        // Transition an added piece to opacity 1
        style.transitionProperty = 'opacity';
        style.transitionDuration = `${speedToMS(this.appearSpeed)}ms`;
      }
    }

    if (piece === undefined) {
      return nothing;
    }

    return html`
      <img
        src="${this._buildPieceImgSrc(piece)}"
        class="${CSS.piece}"
        data-piece="${piece}"
        style="${styleMap(style as StyleInfo)}"
      >`;
  }

  private _buildPieceImgSrc(piece: string) {
    if (isFunction(this.pieceTheme)) {
      return this.pieceTheme(piece);
    }

    if (isString(this.pieceTheme)) {
      return interpolateTemplate(this.pieceTheme, {piece: piece});
    }

    // NOTE: this should never happen
    this._error(8272, 'Unable to build image source for config.pieceTheme.');
    return '';
  }

  private _buildPieceHTML(piece: string, hidden?: boolean, id?: string) {
    const fadingIng = false;

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
      this.requestUpdate();
    } else {
      // instant update
      this._setCurrentPosition(position);
      this.requestUpdate();
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

  // -------------------------------------------------------------------------
  // Lifecycle Callbacks
  // -------------------------------------------------------------------------

  firstUpdated() {
    // create the drag piece
    const draggedPieceId = uuid();

    this._animatedPieces.insertAdjacentHTML(
      'beforeend',
      this._buildPieceHTML('wP', true, draggedPieceId)
    );
    this._draggedPieceElement = this.shadowRoot!.getElementById(
      draggedPieceId
    )!;    
    this.resize();
  }

  update(changedProperties: PropertyValues) {
    super.update(changedProperties);
    // TODO: call this._drawPositionInstant() most of the time so we don't
    // redraw the board unnecessarily.
    this._drawBoard();
  }

  // -------------------------------------------------------------------------
  // Control Flow
  // -------------------------------------------------------------------------

  private _drawBoard() {
    if (this.sparePieces) {
      if (this.orientation === 'white') {
        this._sparePiecesTop!.innerHTML = this._buildSparePiecesHTML('black');
        this._sparePiecesBottom!.innerHTML = this._buildSparePiecesHTML(
          'white'
        );
      } else {
        this._sparePiecesTop!.innerHTML = this._buildSparePiecesHTML('white');
        this._sparePiecesBottom!.innerHTML = this._buildSparePiecesHTML(
          'black'
        );
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

  private _isXYOnSquare(x: number, y: number): Location | 'offboard' {
    // TODO: test that this works with the polyfill
    const elements = this.shadowRoot!.elementsFromPoint(x, y);
    const square = elements.find((e) => e.classList.contains('square'));
    return square === undefined
      ? 'offboard'
      : (square.getAttribute('data-square') as Location);
  }

  private _highlightSquare(square: Location, value = true) {
    if (value) {
      this._highlightedSquares.add(square);
    } else {
      this._highlightedSquares.delete(square);
    }
    this.requestUpdate('_highlightedSquares');
  }

  private _removeSquareHighlights() {
    this._highlightedSquares.clear();
    this.requestUpdate('_highlightedSquares');
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

      this.requestUpdate();
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
    this._draggedPieceElement.style.transitionDuration = `${this.snapbackSpeed}ms`;
    this._draggedPieceElement.style.top = `${rect.top +
      document.body.scrollTop}px`;
    this._draggedPieceElement.style.left = `${rect.left +
      document.body.scrollLeft}px`;
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
    this.requestUpdate();

    // hide the dragged piece
    this._draggedPieceElement.style.transitionProperty = 'opacity';
    this._draggedPieceElement.style.transitionDuration = `${speedToMS(
      this.trashSpeed
    )}ms`;
    this._draggedPieceElement.style.opacity = '0';

    // set state
    this._isDragging = false;
  }

  private _dropDraggedPieceOnSquare(square: string) {
    console.log('_dropDraggedPieceOnSquare', square)
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

      this.requestUpdate();
      this._draggedPieceElement.style.display = 'none';
      this._draggedPieceElement.style.transitionProperty = '';
      this._draggedPieceElement.style.transitionDuration = '0ms';

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
    this._draggedPieceElement.style.transitionDuration = `${this.snapSpeed}ms`;
    this._draggedPieceElement.style.top = `${rect.top +
      document.body.scrollTop}px`;
    this._draggedPieceElement.style.left = `${rect.left +
      document.body.scrollLeft}px`;
    this._draggedPieceElement.addEventListener(
      'transitionend',
      onAnimationComplete
    );

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
    this._draggedPieceElement.setAttribute(
      'src',
      this._buildPieceImgSrc(piece!)
    );
    this._draggedPieceElement.style.opacity = '1';
    this._draggedPieceElement.style.display = '';
    this._draggedPieceElement.style.position = 'absolute';
    this._draggedPieceElement.style.left = `${x - this._squareSize / 2}px`;
    this._draggedPieceElement.style.top = `${y - this._squareSize / 2}px`;

    this.requestUpdate();
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
      this._highlightSquare(this._draggedPieceLocation, false);
    }

    // add highlight to new square
    if (validSquare(location)) {
      this._highlightSquare(location);
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

    // clear state
    this._isDragging = false;
    this._draggedPiece = null;
    this._draggedPieceSource = null;
  }

  // -------------------------------------------------------------------------
  // Animations
  // -------------------------------------------------------------------------

  // calculate an array of animations that need to happen in order to get
  // from pos1 to pos2
  private _calculateAnimations(
    pos1: PositionObject,
    pos2: PositionObject
  ): Animation[] {
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

      const closestPiece = findClosestPiece(pos1, pos2[i]!, i);
      if (closestPiece) {
        animations.push({
          type: 'move',
          source: closestPiece,
          destination: i,
          piece: pos2[i]!,
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
        piece: pos2[i]!,
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
        piece: pos1[i]!,
      });

      delete pos1[i];
    }

    return animations;
  }

  // execute an array of animations
  private async _doAnimations(
    animations: Animation[],
    oldPos: PositionObject,
    newPos: PositionObject
  ) {
    if (animations.length === 0) {
      return;
    }

    let numFinished = 0;
    const transitionEndListener = () => {
      numFinished++;

      if (numFinished === animations.length) {
        this.shadowRoot!.removeEventListener('transitionend', transitionEndListener);
        this._animations.clear();
        this.requestUpdate();
        this.dispatchEvent(
          new CustomEvent('move-end', {
            bubbles: true,
            detail: {
              oldPosition: deepCopy(oldPos),
              newPosition: deepCopy(newPos),
            },
          })
        );
      }
    };
    this.shadowRoot!.addEventListener('transitionend', transitionEndListener);

    // Render once with added pieces at opacity 0
    this._animations.clear();
    for (const animation of animations) {
      if (animation.type === 'add' || animation.type === 'add-start') {
        this._animations.set(animation.square, {
          ...animation,
          type: 'add-start',
        });
      } else if (animation.type === 'move' || animation.type === 'move-start') {
        this._animations.set(animation.destination, {
          ...animation,
          type: 'move-start',
        });
      }else {
        this._animations.set(animation.square, animation);
      }
    }
    this.requestUpdate();

    // Wait for a paint
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Render again with the piece at opacity 1 with a transition
    this._animations.clear();
    for (const animation of animations) {
      if (animation.type === 'move' || animation.type === 'move-start') {
        this._animations.set(animation.destination, animation);
      } else {
        this._animations.set(animation.square, animation);
      }
    }
    this.requestUpdate();
  }

  // -------------------------------------------------------------------------
  // Validation / Errors
  // -------------------------------------------------------------------------

  private _error(code: number, msg: string, _obj?: unknown) {
    const errorText = `Chessboard Error ${code} : ${msg}`;
    this.dispatchEvent(
      new ErrorEvent('error', {
        message: errorText,
      })
    );
    return new Error(errorText);
  }
}
