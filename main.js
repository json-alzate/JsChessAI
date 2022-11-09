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

let findBestMove = () => {
    if (game.game_over()) return alert('Game over!');
    return randomMove();
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