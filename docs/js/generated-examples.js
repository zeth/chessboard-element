
import * as chessUtils from './chessboard-element.bundled.js';
export const EXAMPLES = {};
export default EXAMPLES;
  EXAMPLES["1000"] = {
  description: "Chessboard.js initializes to an empty board with no second argument.",
  html: "<chess-board style=\"width: 400px\"></chess-board>",
  name: "Empty Board",
  jsStr: undefined,
  jsFn: function () {
undefined
  }
};

EXAMPLES["1001"] = {
  description: "Pass <code class=\"js string\">'start'</code> as the second argument to initialize\nthe board to the start position.",
  html: "<chess-board position=\"start\" style=\"width: 400px\"></chess-board>",
  name: "Start Position",
  jsStr: "",
  jsFn: function () {

  }
};

EXAMPLES["1002"] = {
  description: "Pass a <a href=\"docs.html#fen_string\">FEN String</a> as the second argument to\ninitialize the board to a specific position.",
  html: "<chess-board\n    position=\"r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R\"\n    style=\"width: 400px\">\n</chess-board>",
  name: "FEN String",
  jsStr: "",
  jsFn: function () {

  }
};

EXAMPLES["1003"] = {
  description: "Pass a <a href=\"docs.html#position_object\">Position Object</a> as the second argument to initialize the board to a specific position.",
  html: "<chess-board style=\"width: 400px\"></chess-board>",
  name: "Position Object",
  jsStr: "const board = document.querySelector('chess-board');\r\nboard.position = {\r\n  d6: 'bK',\r\n  d4: 'wP',\r\n  e4: 'wK'\r\n};",
  jsFn: function () {
const board = document.querySelector('chess-board');
board.position = {
  d6: 'bK',
  d4: 'wP',
  e4: 'wK'
};
  }
};

EXAMPLES["1004"] = {
  description: "You can have multiple boards on the same page.",
  html: "<chess-board\n    position=\"start\"\n    hide-notation\n    class=\"small-board\">\n</chess-board>\n\n<chess-board\n    position=\"r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R\"\n    hide-notation\n    class=\"small-board\">\n</chess-board>\n\n<chess-board\n    position=\"r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1\"\n    hide-notation\n    class=\"small-board\">\n</chess-board>",
  name: "Multiple Boards",
  jsStr: "",
  jsFn: function () {

  }
};

EXAMPLES["2000"] = {
  description: "Set the <a href=\"docs.html#config:position\"><code class=\"js plain\">position</code></a> property to <code class=\"js string\">'start'</code> to initialize the board to the start position.",
  html: "<chess-board position=\"start\" style=\"width: 400px\"></chess-board>",
  name: "Start Position",
  jsStr: "",
  jsFn: function () {

  }
};

EXAMPLES["2001"] = {
  description: "Use the <a href=\"docs.html#config:orientation\"><code class=\"js plain\">orientation</code></a> property to set board orientation.",
  html: "<chess-board position=\"start\" orientation=\"black\" style=\"width: 400px\"></chess-board>",
  name: "Orientation",
  jsStr: "",
  jsFn: function () {

  }
};

EXAMPLES["2002"] = {
  description: "Use the <a href=\"docs.html#config:showNotation\"><code class=\"js plain\">showNotation</code></a> property to turn board notation on or off.",
  html: "<chess-board\r\n    position=\"start\"\r\n    hide-notation\r\n    style=\"width: 400px\">\r\n</chess-board>",
  name: "Notation",
  jsStr: "",
  jsFn: function () {

  }
};

EXAMPLES["2003"] = {
  description: "Set <a href=\"docs.html#config:draggable\"><code class=\"js plain\">draggable</code></a> to <code class='js keyword'>true</code> to allow drag and drop of pieces. Pieces will return to their original square when dropped off the board (ie: the default for <a href=\"docs.html#config:dropOffBoard\"><code class=\"js plain\">dropOffBoard</code></a> is <code class=\"js string\">'snapback'</code>).",
  html: "<chess-board\r\n    style=\"width: 400px\"\r\n    draggable-pieces\r\n    drop-off-board=\"snapback\"\r\n    position=\"start\">\r\n</chess-board>",
  name: "Draggable Snapback",
  jsStr: "",
  jsFn: function () {

  }
};

EXAMPLES["2004"] = {
  description: "Use the <a href=\"docs.html#config:pieceTheme\"><code class=\"js plain\">pieceTheme</code></a> property to set the source of piece images.",
  html: "<chess-board\n    style=\"width: 400px\"\n    position=\"start\"\n    piece-theme=\"img/chesspieces/alpha/{piece}.png\">\n</chess-board>",
  name: "Piece Theme String",
  jsStr: "",
  jsFn: function () {

  }
};

EXAMPLES["2005"] = {
  description: "You can control animation speeds with the <a href=\"docs.html#config:moveSpeed\"><code class=\"js plain\">moveSpeed</code></a>, <a href=\"docs.html#config:snapbackSpeed\"><code class=\"js plain\">snapbackSpeed</code></a>, <a href=\"docs.html#config:snapSpeed\"><code class=\"js plain\">snapSpeed</code></a>, and <a href=\"docs.html#config:trashSpeed\"><code class=\"js plain\">trashSpeed</code></a> properties.",
  html: "<chess-board\n    style=\"width: 400px\"\n    position=\"start\"\n    move-speed=\"slow\"\n    snapback-speed=\"500\"\n    snap-speed=\"100\">\n</chess-board>\n\n<button id=\"ruyLopezBtn\">Ruy Lopez</button>\n<button id=\"startBtn\">Start Position</button>",
  name: "Animation Speed",
  jsStr: "const board = document.querySelector('chess-board');\n\ndocument.querySelector('#ruyLopezBtn').addEventListener('click', () => {\n  board.setPosition('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R');\n});\n\ndocument.querySelector('#startBtn').addEventListener('click', () => {\n  board.start();\n});",
  jsFn: function () {
const board = document.querySelector('chess-board');

document.querySelector('#ruyLopezBtn').addEventListener('click', () => {
  board.setPosition('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R');
});

document.querySelector('#startBtn').addEventListener('click', () => {
  board.start();
});
  }
};

EXAMPLES["2006"] = {
  description: "Set <a href=\"docs.html#config:sparePieces\"><code class=\"js plain\">sparePieces</code></a> to <code class=\"js keyword\">true</code> to show spare pieces that can be dropped onto the board.",
  html: "<chess-board\n    style=\"width: 400px\"\n    draggable-pieces\n    drop-off-board=\"trash\"\n    spare-pieces>\n</chess-board>\n\n<button id=\"startBtn\">Start Position</button>\n<button id=\"clearBtn\">Clear Board</button>",
  name: "Spare Pieces",
  jsStr: "const board = document.querySelector('chess-board');\n\ndocument.querySelector('#startBtn').addEventListener('click', () => {\n  board.start();\n});\ndocument.querySelector('#clearBtn').addEventListener('click', () => {\n  board.clear();\n});",
  jsFn: function () {
const board = document.querySelector('chess-board');

document.querySelector('#startBtn').addEventListener('click', () => {
  board.start();
});
document.querySelector('#clearBtn').addEventListener('click', () => {
  board.clear();
});
  }
};

EXAMPLES["2030"] = {
  description: "<a href=\"docs.html#config:pieceTheme\"><code class=\"js plain\">pieceTheme</code></a> can be a function.",
  html: "<chess-board\n    style=\"width: 400px\"\n    position=\"start\">\n</chess-board>",
  name: "Piece Theme Function",
  jsStr: "const board = document.querySelector('chess-board');\nboard.pieceTheme = (piece) => {\n  // wikipedia theme for white pieces\n  if (piece.search(/w/) !== -1) {\n    return 'img/chesspieces/wikipedia/' + piece + '.png'\n  }\n\n  // alpha theme for black pieces\n  return 'img/chesspieces/alpha/' + piece + '.png'\n};",
  jsFn: function () {
const board = document.querySelector('chess-board');
board.pieceTheme = (piece) => {
  // wikipedia theme for white pieces
  if (piece.search(/w/) !== -1) {
    return 'img/chesspieces/wikipedia/' + piece + '.png'
  }

  // alpha theme for black pieces
  return 'img/chesspieces/alpha/' + piece + '.png'
};
  }
};

EXAMPLES["2044"] = {
  description: "You can set the <a href=\"docs.html#config:position\"><code class=\"js plain\">position</code></a> property to a <a href=\"http://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation\">FEN</a> string.",
  html: "<chess-board\n    position=\"r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R\"\n    style=\"width: 400px\">\n</chess-board>",
  name: "Position FEN",
  jsStr: "",
  jsFn: function () {

  }
};

EXAMPLES["2063"] = {
  description: "You can set the <a href=\"docs.html#config:position\"><code class=\"js plain\">position</code></a> property with a <a href=\"docs.html#position_object\">Position Object</a>.",
  html: "<chess-board style=\"width: 400px\"></chess-board>",
  name: "Position Object",
  jsStr: "const board = document.querySelector('chess-board');\nboard.position = {\n  d6: 'bK',\n  d4: 'wP',\n  e4: 'wK'\n}",
  jsFn: function () {
const board = document.querySelector('chess-board');
board.position = {
  d6: 'bK',
  d4: 'wP',
  e4: 'wK'
}
  }
};

EXAMPLES["2082"] = {
  description: "Set <a href=\"docs.html#config:dropOffBoard\"><code class=\"js plain\">dropOffBoard</code></a> to <code class='js string'>'trash'</code> to remove pieces when they are dropped outside the board.",
  html: "<chess-board\n    style=\"width: 400px\"\n    draggable-pieces\n    drop-off-board=\"trash\"\n    position=\"start\">\n</chess-board>",
  name: "Draggable Trash",
  jsStr: "",
  jsFn: function () {

  }
};

EXAMPLES["3000"] = {
  description: "Use the <a href=\"docs.html#methods:position\"><code class=\"js plain\">position</code></a> and <a href=\"docs.html#methods:fen\"><code class=\"js plain\">fen</code></a> methods to retrieve the current position of the board.",
  html: "<chess-board\n    style=\"width: 400px\"\n    position=\"start\"\n    draggable-pieces>\n</chess-board>\n\n<button id=\"showPositionBtn\">Show position in console</button>",
  name: "Get Position",
  jsStr: "const board = document.querySelector('chess-board');\n\ndocument.querySelector('#showPositionBtn').addEventListener('click', () => {\n  console.log('Current position as an Object:');\n  console.log(board.position);\n\n  console.log('Current position as a FEN string:');\n  console.log(board.fen());\n});",
  jsFn: function () {
const board = document.querySelector('chess-board');

document.querySelector('#showPositionBtn').addEventListener('click', () => {
  console.log('Current position as an Object:');
  console.log(board.position);

  console.log('Current position as a FEN string:');
  console.log(board.fen());
});
  }
};

EXAMPLES["3001"] = {
  description: "Use the <a href=\"docs.html#methods:start\"><code class=\"js plain\">start</code></a> and <a href=\"docs.html#methods:position\"><code class=\"js plain\">position</code></a> methods to set the board position.",
  html: "<chess-board style=\"width: 400px\"></chess-board>\n\n<button id=\"setRuyLopezBtn\">Ruy Lopez</button>\n<button id=\"setStartBtn\">Start Position</button>\n<button id=\"setRookCheckmateBtn\">Rook Checkmate</button>",
  name: "Set Position",
  jsStr: "const board = document.querySelector('chess-board');\n\ndocument.querySelector('#setRuyLopezBtn').addEventListener('click', () => {\n  board.setPosition('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R');\n});\n\ndocument.querySelector('#setStartBtn').addEventListener('click', () => {\n  board.start();\n});\n\ndocument.querySelector('#setRookCheckmateBtn').addEventListener('click', () => {\n  board.setPosition({\n    a4: 'bK',\n    c4: 'wK',\n    a7: 'wR'\n  });\n});",
  jsFn: function () {
const board = document.querySelector('chess-board');

document.querySelector('#setRuyLopezBtn').addEventListener('click', () => {
  board.setPosition('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R');
});

document.querySelector('#setStartBtn').addEventListener('click', () => {
  board.start();
});

document.querySelector('#setRookCheckmateBtn').addEventListener('click', () => {
  board.setPosition({
    a4: 'bK',
    c4: 'wK',
    a7: 'wR'
  });
});
  }
};

EXAMPLES["3002"] = {
  description: "Pass <code class=\"js keyword\">false</code> as the second argument to the <a href=\"docs.html#methods:start\"><code class=\"js plain\">start</code></a> and <a href=\"docs.html#methods:position\"><code class=\"js plain\">position</code></a> methods to set the board position instantly.",
  html: "<chess-board style=\"width: 400px\"></chess-board>\n\n<button id=\"setRuyLopezBtn\">Ruy Lopez</button>\n<button id=\"setStartBtn\">Start Position</button>\n<button id=\"setRookCheckmateBtn\">Rook Checkmate</button>",
  name: "Set Position Instantly",
  jsStr: "const board = document.querySelector('chess-board');\n\ndocument.querySelector('#setRuyLopezBtn').addEventListener('click', () => {\n  const ruyLopez = 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R';\n  board.setPosition(ruyLopez);\n});\n\ndocument.querySelector('#setStartBtn').addEventListener('click', () => {\n  board.start();\n});\n\ndocument.querySelector('#setRookCheckmateBtn').addEventListener('click', () => {\n  board.position = {\n    a4: 'bK',\n    c4: 'wK',\n    a7: 'wR'\n  };\n});",
  jsFn: function () {
const board = document.querySelector('chess-board');

document.querySelector('#setRuyLopezBtn').addEventListener('click', () => {
  const ruyLopez = 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R';
  board.setPosition(ruyLopez);
});

document.querySelector('#setStartBtn').addEventListener('click', () => {
  board.start();
});

document.querySelector('#setRookCheckmateBtn').addEventListener('click', () => {
  board.position = {
    a4: 'bK',
    c4: 'wK',
    a7: 'wR'
  };
});
  }
};

EXAMPLES["3003"] = {
  description: "Use the <a href=\"docs.html#methods:clear\"><code class=\"js plain\">clear</code></a> method to remove all the pieces from the board.",
  html: "<chess-board\n    style=\"width: 400px\"\n    position=\"start\"\n    draggable-pieces>\n</chess-board>\n\n<button id=\"clearBoardBtn\">Clear Board</button>\n<button id=\"startPositionBtn\">Start Position</button>\n<button id=\"clearBoardInstantBtn\">Clear Board Instant</button>",
  name: "Clear Board",
  jsStr: "const board = document.querySelector('chess-board');\n\ndocument.querySelector('#clearBoardBtn').addEventListener('click', () => {\n  board.clear();\n});\n\ndocument.querySelector('#startPositionBtn').addEventListener('click', () => {\n  board.start();\n});\n\ndocument.querySelector('#clearBoardInstantBtn').addEventListener('click', () => {\n  board.clear(false);\n});",
  jsFn: function () {
const board = document.querySelector('chess-board');

document.querySelector('#clearBoardBtn').addEventListener('click', () => {
  board.clear();
});

document.querySelector('#startPositionBtn').addEventListener('click', () => {
  board.start();
});

document.querySelector('#clearBoardInstantBtn').addEventListener('click', () => {
  board.clear(false);
});
  }
};

EXAMPLES["3004"] = {
  description: "Use the <a href=\"docs.html#methods:move\"><code class=\"js plain\">move</code></a> method to make one or more moves on the board.",
  html: "<chess-board style=\"width: 400px\"></chess-board>\n\n<button id=\"move1Btn\">e2-e4</button>\n<button id=\"move2Btn\">d2-d4, g8-f6</button>\n<button id=\"startPositionBtn\">Start Position</button>",
  name: "Move Pieces",
  jsStr: "const board = document.querySelector('chess-board');\n\ndocument.querySelector('#move1Btn').addEventListener('click', () => {\n  board.move('e2-e4');\n});\n\ndocument.querySelector('#move2Btn').addEventListener('click', () => {\n  board.move('d2-d4', 'g8-f6');\n});\n\ndocument.querySelector('#startPositionBtn').addEventListener('click', () => {\n  board.start();\n});",
  jsFn: function () {
const board = document.querySelector('chess-board');

document.querySelector('#move1Btn').addEventListener('click', () => {
  board.move('e2-e4');
});

document.querySelector('#move2Btn').addEventListener('click', () => {
  board.move('d2-d4', 'g8-f6');
});

document.querySelector('#startPositionBtn').addEventListener('click', () => {
  board.start();
});
  }
};

EXAMPLES["3005"] = {
  description: "Use the <a href=\"docs.html#methods:orientation\"><code class=\"js plain\">orientation</code></a> method to retrieve and set the orientation. Use the <a href=\"docs.html#methods:flip\"><code class=\"js plain\">flip</code></a> method to flip orientation.",
  html: "<chess-board\n    style=\"width: 400px\"\n    position=\"r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R\">\n</chess-board>\n\n<button id=\"showOrientationBtn\">Show orientation in console</button>\n<button id=\"flipOrientationBtn\">Flip orientation</button>\n<br />\n<button id=\"whiteOrientationBtn\">White orientation</button>\n<button id=\"blackOrientationBtn\">Black orientation</button>",
  name: "Orientation",
  jsStr: "const board = document.querySelector('chess-board');\n\ndocument.querySelector('#showOrientationBtn').addEventListener('click', () => {\n  console.log('Board orientation is: ' + board.orientation);\n});\n\ndocument.querySelector('#flipOrientationBtn').addEventListener('click', () => {\n  board.flip();\n});\n\ndocument.querySelector('#whiteOrientationBtn').addEventListener('click', () => {\n  board.orientation = 'white';\n});\n\ndocument.querySelector('#blackOrientationBtn').addEventListener('click', () => {\n  board.orientation = 'black';\n});",
  jsFn: function () {
const board = document.querySelector('chess-board');

document.querySelector('#showOrientationBtn').addEventListener('click', () => {
  console.log('Board orientation is: ' + board.orientation);
});

document.querySelector('#flipOrientationBtn').addEventListener('click', () => {
  board.flip();
});

document.querySelector('#whiteOrientationBtn').addEventListener('click', () => {
  board.orientation = 'white';
});

document.querySelector('#blackOrientationBtn').addEventListener('click', () => {
  board.orientation = 'black';
});
  }
};

EXAMPLES["3007"] = {
  description: "Use the <a href=\"docs.html#methods:resize\"><code class=\"js plain\">resize</code></a> method to recalculate and redraw the board based on the size of it's parent element. See the full effect of this example in a <a href=\"examples/3007\" target=\"_new\">new window</a>.",
  html: "<chess-board style=\"width: 60%\" position=\"start\"></chess-board>",
  name: "Resize",
  jsStr: "// NOTE: click \"View example in new window.\" to see the full effect of this example\nconst board = document.querySelector('chess-board');\n\n$(window).resize(() => board.resize());",
  jsFn: function () {
// NOTE: click "View example in new window." to see the full effect of this example
const board = document.querySelector('chess-board');

$(window).resize(() => board.resize());
  }
};

EXAMPLES["4000"] = {
  description: "The <a href=\"docs.html#event:change\"><code class=\"js plain\">change</code></a> event fires when the board position changes.",
  html: "<chess-board\n    style=\"width: 400px\"\n    position=\"start\"\n    draggable-pieces>\n</chess-board>\n\n<button id=\"ruyLopezBtn\">Ruy Lopez</button>\n<button id=\"startPositionBtn\">Start Position</button>",
  name: "change",
  jsStr: "const board = document.querySelector('chess-board');\n\nboard.addEventListener('change', (e) => {\n  const {value, oldValue} = e.detail;\n  console.log('Position changed:');\n  console.log('Old position: ' + chessUtils.objToFen(oldValue));\n  console.log('New position: ' + chessUtils.objToFen(value));\n  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');\n});\n\ndocument.querySelector('#ruyLopezBtn').addEventListener('click', () => {\n  const ruyLopez = 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R';\n  board.setPosition(ruyLopez);\n});\n\ndocument.querySelector('#startPositionBtn').addEventListener('click', () => {\n  board.start();\n});",
  jsFn: function () {
const board = document.querySelector('chess-board');

board.addEventListener('change', (e) => {
  const {value, oldValue} = e.detail;
  console.log('Position changed:');
  console.log('Old position: ' + chessUtils.objToFen(oldValue));
  console.log('New position: ' + chessUtils.objToFen(value));
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
});

document.querySelector('#ruyLopezBtn').addEventListener('click', () => {
  const ruyLopez = 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R';
  board.setPosition(ruyLopez);
});

document.querySelector('#startPositionBtn').addEventListener('click', () => {
  board.start();
});
  }
};

EXAMPLES["4001"] = {
  description: "The <a href=\"docs.html#event:drag-start\"><code class=\"js plain\">drag-start</code></a> event fires every time a piece is picked up.",
  html: "<chess-board\n    style=\"width: 400px\"\n    position=\"start\"\n    draggable-pieces\n    spare-pieces>\n</chess-board>",
  name: "drag-start",
  jsStr: "const board = document.querySelector('chess-board');\n\nboard.addEventListener('drag-start', (e) => {\n  const {source, piece, position, orientation} = e.detail;\n  console.log('Drag started:')\n  console.log('Source: ' + source)\n  console.log('Piece: ' + piece)\n  console.log('Position: ' + chessUtils.objToFen(position))\n  console.log('Orientation: ' + orientation)\n  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')\n});",
  jsFn: function () {
const board = document.querySelector('chess-board');

board.addEventListener('drag-start', (e) => {
  const {source, piece, position, orientation} = e.detail;
  console.log('Drag started:')
  console.log('Source: ' + source)
  console.log('Piece: ' + piece)
  console.log('Position: ' + chessUtils.objToFen(position))
  console.log('Orientation: ' + orientation)
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
});
  }
};

EXAMPLES["4002"] = {
  description: "Prevent the drag action by calling <code class=\"js keyword\">preventDefault()</code> from the <a href=\"docs.html#event:drag-start\"><code class=\"js plain\">drag-start</code></a> listener.",
  html: "<chess-board\n    style=\"width: 400px\"\n    position=\"start\"\n    draggable-pieces>\n</chess-board>\n\n<button id=\"flipOrientationBtn\">Flip Orientation</button>",
  name: "drag-start Prevent Drag",
  jsStr: "const board = document.querySelector('chess-board');\n\nboard.addEventListener('drag-start', (e) => {\n  const {piece, orientation} = e.detail;\n  if ((orientation === 'white' && piece.search(/^w/) === -1) ||\n      (orientation === 'black' && piece.search(/^b/) === -1)) {\n    e.preventDefault();\n  }\n});\n\ndocument.querySelector('#flipOrientationBtn').addEventListener('click', () => {\n  board.flip();\n});",
  jsFn: function () {
const board = document.querySelector('chess-board');

board.addEventListener('drag-start', (e) => {
  const {piece, orientation} = e.detail;
  if ((orientation === 'white' && piece.search(/^w/) === -1) ||
      (orientation === 'black' && piece.search(/^b/) === -1)) {
    e.preventDefault();
  }
});

document.querySelector('#flipOrientationBtn').addEventListener('click', () => {
  board.flip();
});
  }
};

EXAMPLES["4003"] = {
  description: "The <a href=\"docs.html#event:drag-move\"><code class=\"js plain\">drag-move</code></a> event fires every time a piece changes location.",
  html: "<chess-board\n    style=\"width: 400px\"\n    position=\"start\"\n    draggable-pieces\n    spare-pieces>\n</chess-board>",
  name: "drag-move",
  jsStr: "const board = document.querySelector('chess-board');\n\nboard.addEventListener('drag-move', (e) => {\n  const {newLocation, oldLocation, source,\n                     piece, position, orientation} = e.detail;\n  console.log('New location: ' + newLocation)\n  console.log('Old location: ' + oldLocation)\n  console.log('Source: ' + source)\n  console.log('Piece: ' + piece)\n  console.log('Position: ' + chessUtils.objToFen(position))\n  console.log('Orientation: ' + orientation)\n  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')\n});",
  jsFn: function () {
const board = document.querySelector('chess-board');

board.addEventListener('drag-move', (e) => {
  const {newLocation, oldLocation, source,
                     piece, position, orientation} = e.detail;
  console.log('New location: ' + newLocation)
  console.log('Old location: ' + oldLocation)
  console.log('Source: ' + source)
  console.log('Piece: ' + piece)
  console.log('Position: ' + chessUtils.objToFen(position))
  console.log('Orientation: ' + orientation)
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
});
  }
};

EXAMPLES["4004"] = {
  description: "The <a href=\"docs.html#event:drop\"><code class=\"js plain\">drop</code></a> event fires every time a piece is dropped.",
  html: "<chess-board\n    style=\"width: 400px\"\n    position=\"start\"\n    draggable-pieces\n    spare-pieces>\n</chess-board>",
  name: "drop",
  jsStr: "const board = document.querySelector('chess-board');\n\nboard.addEventListener('drop', (e) => {\n  const {source, target, piece, newPosition, oldPosition, orientation} = e.detail;\n  console.log('Source: ' + source)\n  console.log('Target: ' + target)\n  console.log('Piece: ' + piece)\n  console.log('New position: ' + chessUtils.objToFen(newPosition))\n  console.log('Old position: ' + chessUtils.objToFen(oldPosition))\n  console.log('Orientation: ' + orientation)\n  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')\n});",
  jsFn: function () {
const board = document.querySelector('chess-board');

board.addEventListener('drop', (e) => {
  const {source, target, piece, newPosition, oldPosition, orientation} = e.detail;
  console.log('Source: ' + source)
  console.log('Target: ' + target)
  console.log('Piece: ' + piece)
  console.log('New position: ' + chessUtils.objToFen(newPosition))
  console.log('Old position: ' + chessUtils.objToFen(oldPosition))
  console.log('Orientation: ' + orientation)
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
});
  }
};

EXAMPLES["4005"] = {
  description: "If <code class=\"js string\">'snapback'</code> is passed to the <a href=\"docs.html#event:drop\"><code class=\"js plain\">drop</code></a> event's <code class=\"js plain\">setAction()</code> function, the dragged piece will return to it's source square.",
  html: "<chess-board\n    style=\"width: 400px\"\n    position=\"start\"\n    draggable-pieces>\n</chess-board>",
  name: "drop Snapback",
  jsStr: "const board = document.querySelector('chess-board');\n\n// snapback black pieces when they are dropped\nboard.addEventListener('drop', (e) => {\n  const {piece, setAction} = e.detail;\n  if (piece.search(/b/) !== -1) {\n    setAction('snapback');\n  }\n});",
  jsFn: function () {
const board = document.querySelector('chess-board');

// snapback black pieces when they are dropped
board.addEventListener('drop', (e) => {
  const {piece, setAction} = e.detail;
  if (piece.search(/b/) !== -1) {
    setAction('snapback');
  }
});
  }
};

EXAMPLES["4006"] = {
  description: "If <code class=\"js string\">'trash'</code> is passed to the <a href=\"docs.html#event:drop\"><code class=\"js plain\">drop</code></a> event's <code class=\"js plain\">setAction()</code> function, the dragged piece will be removed.",
  html: "<chess-board\n    style=\"width: 400px\"\n    position=\"start\"\n    draggable-pieces>\n</chess-board>",
  name: "drop Trash",
  jsStr: "const board = document.querySelector('chess-board');\n\n// trash black pieces when they are dropped\nboard.addEventListener('drop', (e) => {\n  const {piece, setAction} = e.detail;\n  if (piece.search(/b/) !== -1) {\n    setAction('trash');\n  }\n});",
  jsFn: function () {
const board = document.querySelector('chess-board');

// trash black pieces when they are dropped
board.addEventListener('drop', (e) => {
  const {piece, setAction} = e.detail;
  if (piece.search(/b/) !== -1) {
    setAction('trash');
  }
});
  }
};

EXAMPLES["4011"] = {
  description: "The <a href=\"docs.html#event:snapback-end\"><code class=\"js plain\">snapback-end</code></a> event fires after a piece has snapped back to it's original square.",
  html: "<chess-board\n    style=\"width: 400px\"\n    position=\"start\"\n    draggable-pieces>\n</chess-board>",
  name: "snapback-end",
  jsStr: "const board = document.querySelector('chess-board');\n\nboard.addEventListener('snapback-end', (e) => {\n  const {piece, square, position, orientation} = e.detail;\n\n  console.log('Piece: ' + piece)\n  console.log('Square: ' + square)\n  console.log('Position: ' + chessUtils.objToFen(position))\n  console.log('Orientation: ' + orientation)\n  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')\n});",
  jsFn: function () {
const board = document.querySelector('chess-board');

board.addEventListener('snapback-end', (e) => {
  const {piece, square, position, orientation} = e.detail;

  console.log('Piece: ' + piece)
  console.log('Square: ' + square)
  console.log('Position: ' + chessUtils.objToFen(position))
  console.log('Orientation: ' + orientation)
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
});
  }
};

EXAMPLES["4012"] = {
  description: "The <a href=\"docs.html#event:move-end\"><code class=\"js plain\">move-end</code></a> event fires at the end of animations when the board position changes.",
  html: "<chess-board\n    style=\"width: 400px\"\n    position=\"start\">\n</chess-board>\n\n<button id=\"ruyLopezBtn\">Ruy Lopez</button>\n<button id=\"moveBtn\">a2-a4, h7-h5</button>\n<button id=\"startBtn\">Start Position</button>\n<button id=\"clearBtn\">Clear Board</button>",
  name: "move-end",
  jsStr: "const board = document.querySelector('chess-board');\n\nboard.addEventListener('move-end', (e) => {\n  const {oldPosition, newPosition} = e.detail;\n\n  console.log('Move animation complete:');\n  console.log('Old position: ' + chessUtils.objToFen(oldPosition));\n  console.log('New position: ' + chessUtils.objToFen(newPosition));\n  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');\n});\n\ndocument.querySelector('#ruyLopezBtn').addEventListener('click', () => {\n  board.setPosition('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R');\n});\ndocument.querySelector('#moveBtn').addEventListener('click', () => {\n  board.move('a2-a4', 'h7-h5');\n});\ndocument.querySelector('#startBtn').addEventListener('click', () => {\n  board.start();\n});\ndocument.querySelector('#clearBtn').addEventListener('click', () => {\n  board.clear();\n});",
  jsFn: function () {
const board = document.querySelector('chess-board');

board.addEventListener('move-end', (e) => {
  const {oldPosition, newPosition} = e.detail;

  console.log('Move animation complete:');
  console.log('Old position: ' + chessUtils.objToFen(oldPosition));
  console.log('New position: ' + chessUtils.objToFen(newPosition));
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
});

document.querySelector('#ruyLopezBtn').addEventListener('click', () => {
  board.setPosition('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R');
});
document.querySelector('#moveBtn').addEventListener('click', () => {
  board.move('a2-a4', 'h7-h5');
});
document.querySelector('#startBtn').addEventListener('click', () => {
  board.start();
});
document.querySelector('#clearBtn').addEventListener('click', () => {
  board.clear();
});
  }
};

EXAMPLES["5000"] = {
  description: "You can integrate chessboard-element with the <a href=\"https://github.com/jhlywa/chess.js\">chess.js</a> library to only allow legal moves.",
  html: "<chess-board\n    style=\"width: 400px\"\n    position=\"start\"\n    draggable-pieces>\n</chess-board>\n\n<label>Status:</label>\n<div id=\"status\"></div>\n<label>FEN:</label>\n<div id=\"fen\"></div>\n<label>PGN:</label>\n<div id=\"pgn\"></div>",
  name: "Only Allow Legal Moves",
  jsStr: "// NOTE: this example uses the chess.js library:\n// https://github.com/jhlywa/chess.js\n\nconst board = document.querySelector('chess-board');\nconst game = new Chess();\nconst statusElement = document.querySelector('#status');\nconst fenElement = document.querySelector('#fen');\nconst pgnElement = document.querySelector('#pgn');\n\nboard.addEventListener('drag-start', (e) => {\n  const {source, piece, position, orientation} = e.detail;\n\n  // do not pick up pieces if the game is over\n  if (game.game_over()) {\n    e.preventDefault();\n    return;\n  }\n\n  // only pick up pieces for the side to move\n  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||\n      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {\n    e.preventDefault();\n    return;\n  }\n});\n\nboard.addEventListener('drop', (e) => {\n  const {source, target, setAction} = e.detail;\n\n  // see if the move is legal\n  const move = game.move({\n    from: source,\n    to: target,\n    promotion: 'q' // NOTE: always promote to a queen for example simplicity\n  });\n\n  // illegal move\n  if (move === null) {\n    setAction('snapback');\n  }\n\n  updateStatus();\n});\n\n// update the board position after the piece snap\n// for castling, en passant, pawn promotion\nboard.addEventListener('snap-end', (e) => {\n  board.setPosition(game.fen());\n});\n\nfunction updateStatus () {\n  let status = '';\n\n  let moveColor = 'White';\n  if (game.turn() === 'b') {\n    moveColor = 'Black';\n  }\n\n  if (game.in_checkmate()) {\n    // checkmate?\n    status = `Game over, ${moveColor} is in checkmate.`;\n  } else if (game.in_draw()) {\n    // draw?\n    status = 'Game over, drawn position';\n  } else {\n    // game still on\n    status = `${moveColor} to move`;\n\n    // check?\n    if (game.in_check()) {\n      status += `, ${moveColor} is in check`;\n    }\n  }\n\n  statusElement.innerHTML = status;\n  fenElement.innerHTML = game.fen();\n  pgnElement.innerHTML = game.pgn();\n}\n\nupdateStatus();",
  jsFn: function () {
// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

const board = document.querySelector('chess-board');
const game = new Chess();
const statusElement = document.querySelector('#status');
const fenElement = document.querySelector('#fen');
const pgnElement = document.querySelector('#pgn');

board.addEventListener('drag-start', (e) => {
  const {source, piece, position, orientation} = e.detail;

  // do not pick up pieces if the game is over
  if (game.game_over()) {
    e.preventDefault();
    return;
  }

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    e.preventDefault();
    return;
  }
});

board.addEventListener('drop', (e) => {
  const {source, target, setAction} = e.detail;

  // see if the move is legal
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) {
    setAction('snapback');
  }

  updateStatus();
});

// update the board position after the piece snap
// for castling, en passant, pawn promotion
board.addEventListener('snap-end', (e) => {
  board.setPosition(game.fen());
});

function updateStatus () {
  let status = '';

  let moveColor = 'White';
  if (game.turn() === 'b') {
    moveColor = 'Black';
  }

  if (game.in_checkmate()) {
    // checkmate?
    status = `Game over, ${moveColor} is in checkmate.`;
  } else if (game.in_draw()) {
    // draw?
    status = 'Game over, drawn position';
  } else {
    // game still on
    status = `${moveColor} to move`;

    // check?
    if (game.in_check()) {
      status += `, ${moveColor} is in check`;
    }
  }

  statusElement.innerHTML = status;
  fenElement.innerHTML = game.fen();
  pgnElement.innerHTML = game.pgn();
}

updateStatus();
  }
};

EXAMPLES["5001"] = {
  description: "You can integrate chessboard-element with the <a href=\"https://github.com/jhlywa/chess.js\">chess.js</a> library to play against random moves.",
  html: "<chess-board\n    style=\"width: 400px\"\n    position=\"start\"\n    draggable-pieces>\n</chess-board>",
  name: "Play Random Computer",
  jsStr: "// NOTE: this example uses the chess.js library:\n// https://github.com/jhlywa/chess.js\n\nconst board = document.querySelector('chess-board');\nconst game = new Chess();\n\nboard.addEventListener('drag-start', (e) => {\n  const {source, piece, position, orientation} = e.detail;\n\n  // do not pick up pieces if the game is over\n  if (game.game_over()) {\n    e.preventDefault();\n    return;\n  }\n\n  // only pick up pieces for White\n  if (piece.search(/^b/) !== -1) {\n    e.preventDefault();\n    return;\n  }\n});\n\nfunction makeRandomMove () {\n  let possibleMoves = game.moves();\n\n  // game over\n  if (possibleMoves.length === 0) {\n    return;\n  }\n\n  const randomIdx = Math.floor(Math.random() * possibleMoves.length);\n  game.move(possibleMoves[randomIdx]);\n  board.setPosition(game.fen());\n}\n\nboard.addEventListener('drop', (e) => {\n  const {source, target, setAction} = e.detail;\n\n  // see if the move is legal\n  const move = game.move({\n    from: source,\n    to: target,\n    promotion: 'q' // NOTE: always promote to a queen for example simplicity\n  });\n\n  // illegal move\n  if (move === null) {\n    setAction('snapback');\n    return;\n  }\n\n  // make random legal move for black\n  window.setTimeout(makeRandomMove, 250);\n});\n\n// update the board position after the piece snap\n// for castling, en passant, pawn promotion\nboard.addEventListener('snap-end', (e) => {\n  board.setPosition(game.fen());\n});",
  jsFn: function () {
// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

const board = document.querySelector('chess-board');
const game = new Chess();

board.addEventListener('drag-start', (e) => {
  const {source, piece, position, orientation} = e.detail;

  // do not pick up pieces if the game is over
  if (game.game_over()) {
    e.preventDefault();
    return;
  }

  // only pick up pieces for White
  if (piece.search(/^b/) !== -1) {
    e.preventDefault();
    return;
  }
});

function makeRandomMove () {
  let possibleMoves = game.moves();

  // game over
  if (possibleMoves.length === 0) {
    return;
  }

  const randomIdx = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIdx]);
  board.setPosition(game.fen());
}

board.addEventListener('drop', (e) => {
  const {source, target, setAction} = e.detail;

  // see if the move is legal
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) {
    setAction('snapback');
    return;
  }

  // make random legal move for black
  window.setTimeout(makeRandomMove, 250);
});

// update the board position after the piece snap
// for castling, en passant, pawn promotion
board.addEventListener('snap-end', (e) => {
  board.setPosition(game.fen());
});
  }
};

EXAMPLES["5002"] = {
  description: "Who will win in this riveting game of <code class=\"js plain\">Math.random()</code> vs <code class=\"js plain\">Math.random()</code>?",
  html: "<chess-board style=\"width: 400px\" position=\"start\"></chess-board>",
  name: "Random vs Random",
  jsStr: "// NOTE: this example uses the chess.js library:\n// https://github.com/jhlywa/chess.js\n\nconst board = document.querySelector('chess-board');\nvar game = new Chess();\n\nfunction makeRandomMove() {\n  const possibleMoves = game.moves();\n\n  // exit if the game is over\n  if (game.game_over()) {\n    return;\n  }\n\n  const randomIdx = Math.floor(Math.random() * possibleMoves.length);\n  game.move(possibleMoves[randomIdx]);\n  board.setPosition(game.fen());\n\n  window.setTimeout(makeRandomMove, 500);\n}\n\nwindow.setTimeout(makeRandomMove, 500);",
  jsFn: function () {
// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

const board = document.querySelector('chess-board');
var game = new Chess();

function makeRandomMove() {
  const possibleMoves = game.moves();

  // exit if the game is over
  if (game.game_over()) {
    return;
  }

  const randomIdx = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIdx]);
  board.setPosition(game.fen());

  window.setTimeout(makeRandomMove, 500);
}

window.setTimeout(makeRandomMove, 500);
  }
};

EXAMPLES["5003"] = {
  description: "Use the <code class=\"js plain\"><a href=\"docs.html#config:onMouseoverSquare\">onMouseoverSquare</a></code> and <code class=\"js plain\"><a href=\"docs.html#config:onMouseoutSquare\">onMouseoutSquare</a></code> events to highlight legal squares.",
  html: "<chess-board\n    style=\"width: 400px\"\n    position=\"start\"\n    draggable-pieces>\n</chess-board>",
  name: "Highlight Legal Moves",
  jsStr: "// NOTE: this example uses the chess.js library:\n// https://github.com/jhlywa/chess.js\n\nconst board = document.querySelector('chess-board');\nconst game = new Chess();\n\nconst highlightStyles = document.createElement('style');\ndocument.head.append(highlightStyles);\nconst whiteSquareGrey = '#a9a9a9';\nconst blackSquareGrey = '#696969';\n\nfunction removeGreySquares() {\n  highlightStyles.textContent = '';\n}\n\nfunction greySquare(square) {\n  const highlightColor = (square.charCodeAt(0) % 2) ^ (square.charCodeAt(1) % 2)\n      ? whiteSquareGrey\n      : blackSquareGrey;\n  \n  highlightStyles.textContent += `\n    chess-board::part(${square}) {\n      background-color: ${highlightColor};\n    }\n  `;\n}\n\nboard.addEventListener('drag-start', (e) => {\n  const {source, piece} = e.detail;\n\n  // do not pick up pieces if the game is over\n  if (game.game_over()) {\n    e.preventDefault();\n    return;\n  }\n\n  // or if it's not that side's turn\n  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||\n      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {\n    e.preventDefault();\n    return;\n  }\n});\n\nboard.addEventListener('drop', (e) => {\n  const {source, target, setAction} = e.detail;\n\n  removeGreySquares();\n\n  // see if the move is legal\n  const move = game.move({\n    from: source,\n    to: target,\n    promotion: 'q' // NOTE: always promote to a queen for example simplicity\n  });\n\n  // illegal move\n  if (move === null) {\n    setAction('snapback');\n  }\n});\n\nboard.addEventListener('mouseover-square', (e) => {\n  const {square, piece} = e.detail;\n\n  // get list of possible moves for this square\n  const moves = game.moves({\n    square: square,\n    verbose: true\n  });\n\n  // exit if there are no moves available for this square\n  if (moves.length === 0) {\n    return;\n  }\n\n  // highlight the square they moused over\n  greySquare(square);\n\n  // highlight the possible squares for this piece\n  for (const move of moves) {\n    greySquare(move.to);\n  }\n});\n\nboard.addEventListener('mouseout-square', (e) => {\n  removeGreySquares();\n});\n\nboard.addEventListener('snap-end', (e) => {\n  board.setPosition(game.fen())\n});",
  jsFn: function () {
// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

const board = document.querySelector('chess-board');
const game = new Chess();

const highlightStyles = document.createElement('style');
document.head.append(highlightStyles);
const whiteSquareGrey = '#a9a9a9';
const blackSquareGrey = '#696969';

function removeGreySquares() {
  highlightStyles.textContent = '';
}

function greySquare(square) {
  const highlightColor = (square.charCodeAt(0) % 2) ^ (square.charCodeAt(1) % 2)
      ? whiteSquareGrey
      : blackSquareGrey;
  
  highlightStyles.textContent += `
    chess-board::part(${square}) {
      background-color: ${highlightColor};
    }
  `;
}

board.addEventListener('drag-start', (e) => {
  const {source, piece} = e.detail;

  // do not pick up pieces if the game is over
  if (game.game_over()) {
    e.preventDefault();
    return;
  }

  // or if it's not that side's turn
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    e.preventDefault();
    return;
  }
});

board.addEventListener('drop', (e) => {
  const {source, target, setAction} = e.detail;

  removeGreySquares();

  // see if the move is legal
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) {
    setAction('snapback');
  }
});

board.addEventListener('mouseover-square', (e) => {
  const {square, piece} = e.detail;

  // get list of possible moves for this square
  const moves = game.moves({
    square: square,
    verbose: true
  });

  // exit if there are no moves available for this square
  if (moves.length === 0) {
    return;
  }

  // highlight the square they moused over
  greySquare(square);

  // highlight the possible squares for this piece
  for (const move of moves) {
    greySquare(move.to);
  }
});

board.addEventListener('mouseout-square', (e) => {
  removeGreySquares();
});

board.addEventListener('snap-end', (e) => {
  board.setPosition(game.fen())
});
  }
};

EXAMPLES["5004"] = {
  description: "Use CSS to show piece highlighting.",
  html: "<chess-board\n    style=\"width: 400px\"\n    position=\"start\"\n    draggable-pieces>\n</chess-board>",
  name: "Piece Highlighting 1",
  jsStr: "// NOTE: this example uses the chess.js library:\n// https://github.com/jhlywa/chess.js\n\nconst board = document.querySelector('chess-board');\nconst highlightStyles = document.createElement('style');\ndocument.head.append(highlightStyles);\n\nconst game = new Chess();\n\nconst styles = [];\nlet pendingStyle = '';\n\nconst updateHighlights = () => {\n  highlightStyles.textContent = styles.join('\\n');\n}\n\nconst highlight = (square, color) => `\n  chess-board::part(${square}) {\n    box-shadow: inset 0 0 3px 3px ${color};\n  }\n`;\n\nfunction makeRandomMove () {\n  const possibleMoves = game.moves({\n    verbose: true,\n  });\n\n  // exit if the game is over\n  if (game.game_over()) {\n    return;\n  }\n\n  const randomIdx = Math.floor(Math.random() * possibleMoves.length);\n  const move = possibleMoves[randomIdx];\n\n  if (styles.length === 4) {\n    styles.shift();\n    styles.shift();\n  }\n  if (move.color === 'w') {\n    styles.push(highlight(move.from, 'yellow'));\n    pendingStyle = highlight(move.to, 'yellow');\n  } else {\n    styles.push(highlight(move.from, 'blue'));\n    pendingStyle = highlight(move.to, 'blue');\n  }\n  updateHighlights();\n  game.move(possibleMoves[randomIdx].san);\n  board.setPosition(game.fen());\n\n  window.setTimeout(makeRandomMove, 1200);\n}\n\nboard.addEventListener('move-end', (e) => {\n  styles.push(pendingStyle);\n  updateHighlights();\n});\n\nwindow.setTimeout(makeRandomMove, 500);",
  jsFn: function () {
// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

const board = document.querySelector('chess-board');
const highlightStyles = document.createElement('style');
document.head.append(highlightStyles);

const game = new Chess();

const styles = [];
let pendingStyle = '';

const updateHighlights = () => {
  highlightStyles.textContent = styles.join('\n');
}

const highlight = (square, color) => `
  chess-board::part(${square}) {
    box-shadow: inset 0 0 3px 3px ${color};
  }
`;

function makeRandomMove () {
  const possibleMoves = game.moves({
    verbose: true,
  });

  // exit if the game is over
  if (game.game_over()) {
    return;
  }

  const randomIdx = Math.floor(Math.random() * possibleMoves.length);
  const move = possibleMoves[randomIdx];

  if (styles.length === 4) {
    styles.shift();
    styles.shift();
  }
  if (move.color === 'w') {
    styles.push(highlight(move.from, 'yellow'));
    pendingStyle = highlight(move.to, 'yellow');
  } else {
    styles.push(highlight(move.from, 'blue'));
    pendingStyle = highlight(move.to, 'blue');
  }
  updateHighlights();
  game.move(possibleMoves[randomIdx].san);
  board.setPosition(game.fen());

  window.setTimeout(makeRandomMove, 1200);
}

board.addEventListener('move-end', (e) => {
  styles.push(pendingStyle);
  updateHighlights();
});

window.setTimeout(makeRandomMove, 500);
  }
};

EXAMPLES["5005"] = {
  description: "Use CSS to show piece highlighting.",
  html: "<chess-board\n    style=\"width: 400px\"\n    position=\"start\"\n    draggable-pieces>\n</chess-board>",
  name: "Piece Highlighting 2",
  jsStr: "// NOTE: this example uses the chess.js library:\n// https://github.com/jhlywa/chess.js\n\nconst board = document.querySelector('chess-board');\nconst highlightStyles = document.createElement('style');\ndocument.head.append(highlightStyles);\n\nconst game = new Chess();\n\nconst styles = [];\nlet pendingStyle = undefined;\n\nconst updateHighlights = () => {\n  highlightStyles.textContent = styles.join('\\n');\n}\n\nconst highlight = (square, color) => `\n  chess-board::part(${square}) {\n    box-shadow: inset 0 0 3px 3px ${color};\n  }\n`;\n\nfunction removeHighlights (color) {\n  highlightStyles.textContent = '';\n}\n\nboard.addEventListener('drag-start', (e) => {\n  const {source, piece, position, orientation} = e.detail;\n\n  // do not pick up pieces if the game is over\n  if (game.game_over()) {\n    return false;\n  }\n\n  // only pick up pieces for White\n  if (piece.search(/^b/) !== -1) {\n    return false;\n  }\n});\n\nfunction makeRandomMove () {\n  const possibleMoves = game.moves({\n    verbose: true,\n  });\n\n  // game over\n  if (possibleMoves.length === 0) {\n    return;\n  }\n\n  const randomIdx = Math.floor(Math.random() * possibleMoves.length);\n  const move = possibleMoves[randomIdx];\n  game.move(move.san);\n\n\n  // highlight black's move\n  if (styles.length === 4) {\n    styles.shift();\n    styles.shift();\n  }\n  styles.push(highlight(move.from, 'blue'));\n  pendingStyle = highlight(move.to, 'blue');\n  updateHighlights();\n\n  // update the board to the new position\n  board.setPosition(game.fen())\n}\n\nboard.addEventListener('drop', (e) => {\n  const {source, target, setAction} = e.detail;\n\n  // see if the move is legal\n  const move = game.move({\n    from: source,\n    to: target,\n    promotion: 'q' // NOTE: always promote to a queen for example simplicity\n  });\n\n  // illegal move\n  if (move === null) {\n    setAction('snapback');\n    return;\n  }\n\n  // highlight white's move\n  if (styles.length === 4) {\n    styles.shift();\n    styles.shift();\n  }\n  styles.push(highlight(move.from, 'yellow'));\n  styles.push(highlight(move.to, 'yellow'));\n  pendingStyle = undefined;\n  updateHighlights();\n\n  // make random move for black\n  window.setTimeout(makeRandomMove, 250)\n});\n\nboard.addEventListener('move-end', (e) => {\n  if (pendingStyle !== undefined) {\n    styles.push(pendingStyle);\n    pendingStyle = undefined;\n  }\n  updateHighlights();\n});\n\n// update the board position after the piece snap\n// for castling, en passant, pawn promotion\nboard.addEventListener('snap-end', (e) => {\n  board.setPosition(game.fen())\n});",
  jsFn: function () {
// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

const board = document.querySelector('chess-board');
const highlightStyles = document.createElement('style');
document.head.append(highlightStyles);

const game = new Chess();

const styles = [];
let pendingStyle = undefined;

const updateHighlights = () => {
  highlightStyles.textContent = styles.join('\n');
}

const highlight = (square, color) => `
  chess-board::part(${square}) {
    box-shadow: inset 0 0 3px 3px ${color};
  }
`;

function removeHighlights (color) {
  highlightStyles.textContent = '';
}

board.addEventListener('drag-start', (e) => {
  const {source, piece, position, orientation} = e.detail;

  // do not pick up pieces if the game is over
  if (game.game_over()) {
    return false;
  }

  // only pick up pieces for White
  if (piece.search(/^b/) !== -1) {
    return false;
  }
});

function makeRandomMove () {
  const possibleMoves = game.moves({
    verbose: true,
  });

  // game over
  if (possibleMoves.length === 0) {
    return;
  }

  const randomIdx = Math.floor(Math.random() * possibleMoves.length);
  const move = possibleMoves[randomIdx];
  game.move(move.san);


  // highlight black's move
  if (styles.length === 4) {
    styles.shift();
    styles.shift();
  }
  styles.push(highlight(move.from, 'blue'));
  pendingStyle = highlight(move.to, 'blue');
  updateHighlights();

  // update the board to the new position
  board.setPosition(game.fen())
}

board.addEventListener('drop', (e) => {
  const {source, target, setAction} = e.detail;

  // see if the move is legal
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) {
    setAction('snapback');
    return;
  }

  // highlight white's move
  if (styles.length === 4) {
    styles.shift();
    styles.shift();
  }
  styles.push(highlight(move.from, 'yellow'));
  styles.push(highlight(move.to, 'yellow'));
  pendingStyle = undefined;
  updateHighlights();

  // make random move for black
  window.setTimeout(makeRandomMove, 250)
});

board.addEventListener('move-end', (e) => {
  if (pendingStyle !== undefined) {
    styles.push(pendingStyle);
    pendingStyle = undefined;
  }
  updateHighlights();
});

// update the board position after the piece snap
// for castling, en passant, pawn promotion
board.addEventListener('snap-end', (e) => {
  board.setPosition(game.fen())
});
  }
};

