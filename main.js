console.log('main.js');
let board = new ChessBoard('board', 'start');

let game = new Chess();

// pinta de las casillas para los posibles movimientos
let highlightSquare =
    square => document.querySelector(`.square-${square}`).classList.toggle('highlight')

// remueve el color de las casillas
let removeHighlight =
    () => document.querySelectorAll('.highlight').forEach(el => el.classList.toggle('highlight'))


// métodos

// cuando se pasa el mouse por encima de una pieza se muestran los posibles movimientos
let onMouseoverSquare =
    (square, piece) => {
        var moves = game.moves({ square, verbose: true }).map(({ to }) => to);
        [...moves, square].forEach(highlightSquare)
    }

// cuando sale el mouse por encima de una casilla, se remueve el color de las casillas para los posibles movimientos
let onMouseoutSquare = removeHighlight;

// cuando se va a mover una pieza se valida si el juego no esta en jaque mate, 
// en tablas o si el movimiento es es realizado por las blancas (vamos a jugar con blancas)
let onDragStart =
    (square, piece) =>
        !(game.in_checkmate() || game.in_draw() || /^b/.test(piece))
// /^b/.test(piece) is a black piece,


// Cuando se suelta la pieza se valida si el movimiento es valido
let onDrop = (from, to) => {
    removeHighlight();
    var move = game.move({ from, to, promotion: 'q' });
    if (!move) return 'snapback';
    window.setTimeout(makeBestMove, 250);

}

//----



let makeBestMove = () => {
    let bestMove = findBestMove();
    if (bestMove) {
        game.move(bestMove);
        board.position(game.fen());
    }
}


let getPieceValue = ({ type, color }) => ({
    k: 900,
    q: 90,
    r: 50,
    b: 30,
    n: 30,
    p: 10
}[type] * { w: -1, b: 1 }[color]);


let getBoardValue = (board) => {
    return board.reduce(
        (acc, row) => row.reduce((racc, piece) => piece ? racc + getPieceValue(piece) : racc, acc)
        , 0);

}

let minimax = (depth, maximising) => {

    if (depth == 0) return getBoardValue(game.board());

    var fn = maximising ? Math.max : Math.min;
    var val = maximising ? -Infinity : Infinity;

    for (let move of game.moves()) {
        game.move(move);
        val = fn(val, minimax(depth - 1, !maximising));
        game.undo()
    }
    return val;
}




let findBestMoveRandom = () => {
    if (game.game_over()) return alert('Game over!');
    return randomMove();
}


let findBestMoveBasic = () => {
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



let findBestMove = () => {
    let bestValue = -Infinity;
    let bestMove = null;
    let time = new Date();
    for (let move of game.moves()) {
        game.move(move);
        let value = minimax(1, false);
        game.undo()
        if (value > bestValue) {
            bestValue = value
            bestMove = move
        }
    }
    return bestMove;
}

// elige un movimiento aleatorio de los posibles movimientos
let randomMove = () => {
    let possibleMoves = game.moves();
    let randomIndex = Math.floor(Math.random() * possibleMoves.length);
    return possibleMoves[randomIndex];
}

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