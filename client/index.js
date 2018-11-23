const Game = require('./game.js');

// Setup connection with server
let body = {
    name: `Player-${Math.floor(Math.random() * 100)}`,
    input: "DOWN"
}

let gameState = '';

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
                    gameLoop();
                } else {
                    if (newGameState.state == "RUNNING") {
                        if (newGameState.players[playerIndex].x != gameState.players[playerIndex].x ||
                            newGameState.players[playerIndex].y != gameState.players[playerIndex].y) {
                            playerAction(newGameState, playerIndex);
                        }
                        gameState = newGameState
                        gameLoop();
                    } else {}
                }
            }, 100);
        })
}

function playerAction(state, playerIndex) {
    // Custom algorithm code goes here...
    let player = state.players[playerIndex];
    let x = player.x;
    let y = player.y;
    let direction;

    if (x + 1 < state.board.fields.length) {
        if (state.board.fields[y][x + 1] == 0) {
            direction = "RIGHT"
        }
    }

    if (y + 1 < state.board.fields.length) {
        if (state.board.fields[y + 1][x] == 0) {
            direction = "DOWN";
        }
    }
    if (x - 1 >= 0) {
        if (state.board.fields[y][x - 1] == 0) {
            direction = "LEFT"
        }
    }

    if (y - 1 >= 0) {
        if (state.board.fields[y - 1][x] == 0) {
            direction = "UP"
        }
    }


    // // Change move
    body.input = direction;

    // Make move if needed
    game.makeMove(body);
}