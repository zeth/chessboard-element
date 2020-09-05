---
title: Resize
id: 3007
group: Methods
---

`<chess-board>` uses <a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver">ResizeObserver </a> to automatically detect when it's resized and recalculate and redraw the board based on the size of its parent element.

In case a browser does not support ResizeObserver, you can load a polyfill or manually call the <a href="{{ '/docs/#methods:resize' | url }}"><code class="js plain">resize</code></a> method.
