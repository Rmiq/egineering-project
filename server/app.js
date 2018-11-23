const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const GameInstance = require('./gameInstance.js');
const port = 3001;
// ------------------------------------------------

const gameInstance = new GameInstance(app, io);
gameInstance.serveFile();
gameInstance.openConnection();

http.listen(port, () => console.log(`App listening on port ${port}!`));