const board = document.querySelector('chess-board');
board.pieceTheme = (piece) => {
  // wikipedia theme for white pieces
  if (piece.search(/w/) !== -1) {
    return `../../chesspieces/wikipedia/${piece}.png`;
  }

  // alpha theme for black pieces
  return `../../chesspieces/alpha/${piece}.png`;
};
