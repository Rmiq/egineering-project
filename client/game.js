const fetch = require('node-fetch');

const API = {
    initializeConnection: "http://localhost:3001/initializeConnection",
    getCurrentState: "http://localhost:3001/getCurrentState",
    makeMove: "http://localhost:3001/move"
}

class Game {
    initializeConnection(body) {
        return fetch(API.initializeConnection, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        });
    }
    makeMove(body) {
        fetch(API.makeMove, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => res.text())
    }
    getCurrentState() {
        return fetch(API.getCurrentState)
    }
    endGame() {
        console.log(`Game finished! The winner is...`);
    }
}

module.exports = Game;