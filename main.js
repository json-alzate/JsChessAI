console.log('main.js');
let board = new ChessBoard('board', 'start');

let game = new Chess();

let highlightSquare =
    square => document.querySelector(`.square-${square}`).classList.toggle('highlight')

let removeHighlight =
    () => document.querySelectorAll('.highlight').forEach(el => el.classList.toggle('highlight'))


// métodos
let onMouseoverSquare =
    (square, piece) => {
        var moves = game.moves({ square, verbose: true }).map(({ to }) => to);
        [...moves, square].forEach(highlightSquare)
    }

let onMouseoutSquare = removeHighlight;

let onDragStart =
    (square, piece) =>
        !(game.in_checkmate() || game.in_draw() || /^b/.test(piece))
// /^b/.test(piece) is a black piece,

let onDrop = (from, to) => {
    removeHighlight();
    var move = game.move({ from, to, promotion: 'q' });
    if (!move) return 'snapback';
    // renderHistory();
    window.setTimeout(makeBestMove, 250);

}

//----
let makeBestMove = () => {
    // findBestMove().then(bestMove => {
    //     game.move(bestMove);
    //     board.position(game.fen())
    //     renderHistory();
    // })
}

let findBestMove = () => {
    if (game.game_over()) return alert('Game over!');
    return getBestMoveBasic()
}

let getBestMoveBasic = () => {
    let bestValue = -99999;
    let bestMove = null;
    for (let move of game.moves()) {
        game.move(move);
        let value = getBoardValue(game.board())
        game.undo()
        if (value > bestValue) {
            bestValue = value
            bestMove = move
        }
    }
    return bestMove;
}

let getBoardValue = (board) => {
    return board.reduce(
        (acc, row) => row.reduce((racc, piece) => piece ? racc + getPieceValue(piece) : racc, acc)
        , 0);

}

let getPieceValue = ({ type, color }) => ({
    k: 900,
    q: 90,
    r: 50,
    b: 30,
    n: 30,
    p: 10
}[type] * { w: -1, b: 1 }[color]);
//---
let onSnapEnd = () => {
    board.position(game.fen());
}


let config = {
    draggable: true,
    position: 'start',
    onMouseoutSquare,
    onMouseoverSquare,
    onDragStart,
    onDrop,
    onSnapEnd
}

board = ChessBoard('board', config);