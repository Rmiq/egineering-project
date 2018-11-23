const bodyParser = require('body-parser');
const Player = require('./game/player.js');
const Board = require('./game/board.js');
const EventEmitter = require('events');
const SIZE = 25;

class GameInstance {
    constructor(app, io) {
        this.app = app;
        this.io = io;
        this.eventEmitter = new EventEmitter();
        this.game = {
            state: "WAITING",
            turn: 0,
            players: [],
            board: new Board(SIZE)
        };
    }

    serveFile() {
        this.app.use(bodyParser.json());
        this.app.get('/', function (req, res) {
            res.sendFile(__dirname + '/index.html');
        });
    }

    /* --- Open connection for players and browser --- */
    openConnection() {
        this.app.post('/initializeConnection', (req, res) => {
            let newPlayer = new Player(req.body.name);
            newPlayer.setupPlayer(this.game.board);
            this.game.players.push(newPlayer);
            this.game.board.markMoveOnBoard(newPlayer);
            this.updateBrowser();
            this.eventEmitter.on('emitGameStart', (msg) => {
                res.send(true);
            });
        });
        this.app.get('/getCurrentState', (req, res) => {
            res.send(JSON.stringify(this.game));
        });
        this.app.post('/move', (req, res) => {
            let playerName = req.body.name;
            let playerMove = req.body.input;
            let stillInGame = true;
            this.game.players.forEach((player) => {
                stillInGame = player.isInGame;
                player.name == playerName ? player.direction = playerMove : "";
            });
            res.send(stillInGame);
        });

        this.io.on('connection', (socket) => {
            socket.on('gameStart', (data) => {
                this.emitEvent('emitGameStart');
                this.changeGameState("RUNNING");
                this.logMesssage(`Game started, number of players: ${this.game.players.length}`);
                this.nextTurn();
            });
        });
    }


    /* --- Main Loop --- */
    gameUpdate() {
        this.validatePlayersMoves();
        this.validateTakenFields();
        this.movePlayers();
        this.updateBrowser();
        this.updateTurnCounter();

        if (this.playersLeftCount() > 1) {
            this.nextTurn();
        } else {
            this.endGame();
        }

    }


    /* --- Functions --- */
    validatePlayersMoves() {
        this.game.players.forEach((player) => {
            player.validateMove(this.game.board);
        });
    }

    validateTakenFields() {
        this.game.players.forEach((player) => {
            player.validateTakenFields(this.game.turn);
        })
    }

    movePlayers() {
        this.game.players.forEach((player) => {
            player.makeMove();
            player.clearTakenFields();
            this.game.board.markMoveOnBoard(player);
        });
    }

    updateTurnCounter(turn) {
        this.game.turn++;
    }

    updateBrowser(eventName) {
        this.io.emit('gameUpdate', this.game);
    }

    playersLeftCount() {
        let playersInGame = 0;
        this.game.players.forEach((player) => {
            if (player.isInGame) {
                playersInGame++;
            }
        })
        return playersInGame;
    }

    nextTurn() {
        setTimeout(() => {
            this.gameUpdate();
        }, 300);
    }

    endGame() {
        if (this.playersLeftCount() == 1) {
            this.game.players.forEach((player) => {
                if (player.isInGame) {
                    this.logMesssage(`Game over! Winner is ${player.name}`);
                }
            })

        } else if (this.playersLeftCount() == 0) {
            this.logMesssage(`Game over! Draw!`);
        }
        this.changeGameState("END");

    }

    changeGameState(state) {
        this.game.state = state;
    }


    emitEvent(eventName) {
        this.eventEmitter.emit(eventName);
    }

    logMesssage(msg) {
        console.log(msg);
    }

}

module.exports = GameInstance;