/*! chessboard.js v@VERSION | (c) 2019 Chris Oakman | MIT License chessboardjs.com/license */

export const styles = `
  :host {
    display: block;
  }
  .board {
    border: 2px solid #404040;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(8, 12.5%);
    grid-template-rows: repeat(8, 12.5%);
  }

  .square {
    position: relative;

    /* disable any native browser highlighting */
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .piece {
    width: 100%;
    height: 100%;
    z-index: 10;
  }

  .spare-pieces {
    display: grid;
    position: relative;
    padding: 0 2px;
    grid-template-columns: repeat(8, 12.5%);
  }

  .white {
    background-color: #f0d9b5;
    color: #b58863;
  }

  .black {
    background-color: #b58863;
    color: #f0d9b5;
  }

  .highlight1,
  .highlight2 {
    box-shadow: inset 0 0 3px 3px yellow;
  }

  .notation {
    cursor: default;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 14px;
    position: absolute;
  }

  .alpha {
    bottom: 1px;
    right: 3px;
  }

  .numeric {
    top: 2px;
    left: 2px;
  }
`;
