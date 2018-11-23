class Board {
    constructor(size) {
        this.size = size;
        this.state = "NOT_INITIALIZED";
        this.fields = [];
        this.createBoard(this.size);
        this.initalizeBoard();
    }

    createBoard(boardSize) {
        for (let i = 1; i <= boardSize; i++) {
            let row = [];
            for (let j = 1; j <= boardSize; j++) {
                row.push(Math.random() * 10 <= 9.5 ? "0" : "1")
            }
            this.fields.push(row);
        }
    }

    markMoveOnBoard(player) {

        this.fields[player.y][player.x] = player.id;
    }

    initalizeBoard() {
        this.state = "INITIALIZED";
    }
}

module.exports = Board;