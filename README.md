# chessboard-element

A <chess-board> element for your web pages

## What is chessboard-element?

chessboard-element is a standalone chess board web component. It defines a `<chess-board>` custom element that works anywhere HTML works - in plain HTML pages, or in your framework of choice. It is designed to be "just a board" and expose a powerful API so that it can be used in different ways.

Here's a non-exhaustive list of things you can do with chessboard-element:

- Use `<chess-board>` to show game positions alongside your expert commentary.
- Use `<chess-board>` to have a tactics website where users have to guess the best
  move.
- Integrate chessboard-element and [chess.js] with a PGN database and allow people to
  search and playback games.
- Build a chess server and have users play their games out using the
  `<chess-board>` element.

chessboard-element is flexible enough to handle any of these situations with relative
ease.

### Relationship to chessboard.js

chessboard-element is a fork of of the wonderful [chessboard.js] library, repacking it as a web component, and updating the source to modern JavaScript and CSS. The differences include:

  - No need to use JavaScript for basic boards, just use the `<chess-board>` element.
  - All chessboard DOM is encapsulated in a shadow root. Styles do not leak.
  - No implicit dependency on jQuery
  - Just one script tag required, all dependencies and styles are imported directly.
  - Published as standard JS modules
  - Uses CSS transitions for all anmations
  - Uses CSS grid and flex for layout
  - New declarative attribute and property APIs play nice with declarative frameworks and template libraries like React and lit-html

Many thanks to Chris Oakman for chessboard.js.

## What can chessboard-element **not** do?

The scope of chessboard-element is limited to "just a board." This is intentional and makes chessboard-element flexible for handling a multitude of chess-related problems.

This is a common source of confusion for new users. [remove?]

Specifically, chessboard-element does not understand anything about how the game of chess is played: how a knight moves, whose turn is it, is White in check?, etc.

Fortunately, the powerful [chess.js] library deals with exactly this sort of
problem domain and plays nicely with chessboard-element's flexible API. Some examples of chessboard-element combined with chess.js: [Example 5000], [Example 5001], [Example 5002]

Please see the powerful [chess.js] library for an API to deal with these sorts
of questions.


This logic is distinct from the logic of the board. Please see the powerful
[chess.js] library for this aspect of your application.

Here is a list of things that chessboard.js is **not**:

- A chess engine
- A legal move validator
- A PGN parser

chessboard.js is designed to work well with any of those things, but the idea
behind chessboard.js is that the logic that controls the board should be
independent of those other problems.

## Docs and Examples

_TBD_

## Developing

```sh
# Build the TypeScript files
npm run build

# Build the docs site
npm run docs

# Start the dev server
npm run serve
```

## License

[MIT License](LICENSE.md)

[chessboard.js]: (https://github.com/oakmac/chessboardjs)
[chessboardjs.com]: http://chessboardjs.com
[chess.js]: https://github.com/jhlywa/chess.js
<!-- [Example 5000]: http://chessboardjs.com/examples#5000
[Example 5001]: http://chessboardjs.com/examples#5001
[Example 5002]: http://chessboardjs.com/examples#5002 -->
