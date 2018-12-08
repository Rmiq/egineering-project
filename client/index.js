const Game = require('./game.js');

// Setup connection with server
let body = {
    name: `Player-${Math.floor(Math.random() * 100)}`,
    input: "DOWN"
}

let gameState = '';
let startPosition = {};
let canGoRight = true;

game = new Game();
console.log('Waiting for a game start...');
game.initializeConnection(body)
    .then(res => res.text())
    .then(json => json ? gameLoop() : console.log("Couldn't connect with server"));

function gameLoop() {
    game.getCurrentState()
        .then(res => res.text()).then(json => {
            let newGameState = JSON.parse(json);
            let playerIndex;
            newGameState.players.forEach((player, i) => {
                player.name == body.name ? playerIndex = i : "";
            });
            setTimeout(() => {
                if (gameState == '') {
                    gameState = newGameState;
                    playerAction(newGameState, playerIndex);
                    startPosition = {
                        x: newGameState.players[playerIndex].x,
                        y: newGameState.players[playerIndex].y
                    };
                    gameLoop();
                } else {
                    if (newGameState.state == "RUNNING") {
                        if (newGameState.players[playerIndex].x != gameState.players[playerIndex].x ||
                            newGameState.players[playerIndex].y != gameState.players[playerIndex].y) {
                            playerAction(newGameState, playerIndex);
                        }
                        gameState = newGameState
                        gameLoop();
                    } else { }
                }
            }, 100);
        })
}

function playerAction(state, playerIndex) {
    // Custom algorithm code goes here...
    let player = state.players[playerIndex];
    let board = state.board;
    let x = player.x;
    let y = player.y;
    let tempX, tempY;
    let square = 0;

    // // Change move
    body.input = makeMove(board, x, y);

    // Make move if needed
    game.makeMove(body);
}


function makeMove(board, x, y) {

    let direction = '';
    let lock = false;

    if (isCanMove(board, x + 1, y) && canGoRight ) {
        direction = 'RIGHT';
        lock = true;
        if (x + 1 == board.size - 1) {
            canGoRight = false;
        }
    }

    if (!lock) {
        if (isCanMove(board, x, y + 1) && (isCanMove(board, x - 1, y + 2) || isCanMove(board, x - 1, y + 3))) {
            direction = 'DOWN';

        } else if (isCanMove(board, x, y - 1) && (isCanMove(board, x - 1, y - 2) || isCanMove(board, x - 1, y + 3))) {
            direction = 'UP';

        } else if (isCanMove(board, x - 1, y)) {
            direction = 'LEFT';
        }
    }

    return direction;

}


function isCanMove(board, x, y) {
    let canMove = true;
    if (x < 0 || x >= board.size || y < 0 || y >= board.size) {
        canMove = false;
    } else {
        if (board.fields[y][x] != 0) {
            canMove = false;
        }
    }

    return canMove;
}