let id = 1;
let takenFields = [];

class Player {
    constructor(name) {
        this.name = name;
        this.id = this.assigneId();
        this.direction = 'DOWN';
        this.isInGame = true;
        this.x = 0;
        this.y = 0;
        this.tempX = 0;
        this.tempY = 0;
    }

    setupPlayer(board) {
        this.calcStartPositionX();
        this.calcStartPositionY();
        if (this.checkIsTaken(this.x, this.y, board)) {
            this.setupPlayer();
        }
    }

    calcStartPositionX() {
        this.x = Math.floor(Math.random() * 10) + 8;
    }
    calcStartPositionY() {
        this.y = Math.floor(Math.random() * 10) + 7;
    }
    assigneId() {
        ++id;
        return id;
    }

    checkIsTaken(x, y, board) {
        if( x < 0 || x > board.size - 1 || y < 0 || y > board.size ) {
            return true;
        } else {
            return board.fields[y][x] == 0 ? false : true;
        }
        
    }

    checkIsOnBoard(x, y, board) {
        return x < 0 || x > board.size - 1 || y < 0 || y > board.size - 1 ? true : false;
    }

    makeMove() {
        if (this.isInGame) {
            switch (this.direction) {
                case "UP":
                    --this.y;
                    break;
                case "RIGHT":
                    ++this.x;
                    break;
                case "DOWN":
                    ++this.y;
                    break;
                case "LEFT":
                    --this.x;
                    break;
            }
        }
    }

    validateMove(board) {
        if (this.isInGame) {
            switch (this.direction) {
                case "UP":
                    this.tempX = this.x;
                    this.tempY = this.y - 1;
                    break;
                case "RIGHT":
                    this.tempX = this.x + 1;
                    this.tempY = this.y;
                    break;
                case "DOWN":
                    this.tempX = this.x;
                    this.tempY = this.y + 1;
                    break;
                case "LEFT":
                    this.tempX = this.x - 1;
                    this.tempY = this.y;
                    break;
            }

            takenFields.push({
                x: this.tempX,
                y: this.tempY,
                playerName: this.name
            });

            if (this.checkIsTaken(this.tempX, this.tempY, board) || this.checkIsOnBoard(this.tempX, this.tempY, board)) {
                this.isInGame = false;
            }

        }
    }

    validateTakenFields(turn) {
        takenFields.forEach((field) => {
            if (this.tempX == field.x && this.tempY == field.y && this.name != field.playerName) {
                this.isInGame = false;
            }
        });
    }

    clearTakenFields() {
        takenFields = [];
    }
}

module.exports = Player;