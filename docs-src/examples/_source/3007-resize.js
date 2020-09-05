const board = document.querySelector('chess-board');

if (window.ResizeObserver === undefined) {
  window.addEventListener('resize', () => board.resize());
}
