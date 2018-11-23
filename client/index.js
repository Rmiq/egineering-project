const Game = require('./game.js');

// Setup connection with server
let body = {
	name: `Player-Kuba-1-${Math.floor(Math.random() * 100)}`,
	input: "DOWN"
};

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
				} else {
				}
			}
		}, 100);
	})
}

function playerAction(state, playerIndex) {
	const tryToGoRight = () => {
		if (state.board.fields[y][x + 1] == 0) {
			direction = "RIGHT";
			return true;
		} else {
			return false;
		}
	};

	const tryToGoDown = () => {
		if (state.board.fields[y + 1][x] == 0) {
			direction = "DOWN";
			return true;
		} else {
			return false
		}
	};

	const tryToGoLeft = () => {
		if (state.board.fields[y][x - 1] == 0) {
			direction = "LEFT";
			return true;
		} else {
			return false;
		}
	};

	const tryToGoUp = () => {
		if (state.board.fields[y - 1][x] == 0) {
			direction = "UP";
			return true;
		} else {
			return false;
		}
	};

	const goRandom = () => {
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
	};

	// Custom algorithm code goes here...
	let player = state.players[playerIndex];
	let x = player.x;
	let y = player.y;
	let direction;

	let yArrayA = state.board.fields[y - 2] ? y - 2 : state.board.fields[y - 1] ? y - 1 : y;
	let yArrayB = state.board.fields[y + 3] ? y + 3 : state.board.fields[y + 2] ? y + 2 : state.board.fields[y + 1] ? y + 1 : y;

	let xArrayA = state.board.fields[0][x - 2] ? x - 2 : state.board.fields[0][x - 1] ? x - 1 : x;
	let xArrayB = state.board.fields[0][x + 3] ? x + 3 : state.board.fields[0][x + 2] ? x + 2 : state.board.fields[0][x + 1] ? x + 1 : x;

	let yArray = state.board.fields.slice(yArrayA, yArrayB);

	const array = [];
	yArray.forEach(xArray => {
		let res = xArray.slice(xArrayA, xArrayB);
		array.push(res);
	});

	let isUp = y < 3;
	let isDown = y > 21;

	let isLeft = x < 3;
	let isRight = x > 21;

	const performAction = () => {
		const moveInDirection = (res) => {

			if (res === 'LEFT') {
				let a = tryToGoLeft();
				if (!a) {
					goRandom()
				}
			}

			if (res === 'RIGHT') {
				let a = tryToGoRight();
				if (!a) {
					goRandom()
				}
			}

			if (res === 'UP') {
				let a = tryToGoUp();
				if (!a) {
					goRandom()
				}
			}

			if (res === 'DOWN') {
				let a = tryToGoDown();
				if (!a) {
					goRandom()
				}
			}
		};

		const countForMiddleOfBoard = () => {
			let goLeft = 0;
			let goRight = 0;
			let goUp = 0;
			let goDown = 0;

			array.forEach((yArray, index) => {
				if (yArray[2] == 0 && index < 2) {
					goUp++;
				} else if (yArray[2] == 0 && index > 2) {
					goDown++;
				}
			});

			if (array[2][0] == 0 || array[2][1] == 0) {
				goLeft++;
			} else if (array[2][3] == 0 || array[2][4] == 0) {
				goRight++;
			}

			let hor = goLeft > goRight ? 'LEFT' : 'RIGHT';
			let vert = goUp > goDown ? 'UP' : 'DOWN';

			let res = goUp > goRight || goUp > goLeft || goDown > goLeft || goDown > goRight ? vert : hor;

			moveInDirection(res);
		};

		const countForBottomOfBoard = () => {
			let temp = array.splice(0, 3);
			let goLeft = 0;
			let goRight = 0;
			let goUp = 0;
			let goDown = 0;


			temp.forEach((yArray) => {
				if (yArray[2] == '0') {
					goUp++;
				}
			});
			if(temp[2]) {
				if (temp[2][0] == 0 || temp[2][1] == 0) {
					goLeft++;
				} else if (temp[2][3] == 0 || temp[2][4] == 0) {
					goRight++;
				}
			} else {
				if (temp[1][0] == 0 || temp[1][1] == 0) {
					goLeft++;
				} else if (temp[1][3] == 0 || temp[1][4] == 0) {
					goRight++;
				}
			}

			let hor = goLeft > goRight ? 'LEFT' : 'RIGHT';
			let vert = goUp > goDown ? 'UP' : 'DOWN';

			let res = goUp > goRight || goUp > goLeft || goDown > goLeft || goDown > goRight ? vert : hor;

			moveInDirection(res);
		};

		const countForTopOfBoard = () => {
			let temp = array.slice(-3);
			let goLeft = 0;
			let goRight = 0;
			let goUp = 0;
			let goDown = 0;


			temp.forEach((yArray) => {
				if (yArray[2] == '0') {
					goDown++;
				}
			});

			if (temp[0][0] == 0 || temp[0][1] == 0) {
				goLeft++;
			} else if (temp[0][3] == 0 || temp[0][4] == 0) {
				goRight++;
			}

			let hor = goLeft > goRight ? 'LEFT' : 'RIGHT';
			let vert = goUp > goDown ? 'UP' : 'DOWN';

			let res = goUp > goRight || goUp > goLeft || goDown > goLeft || goDown > goRight ? vert : hor;

			moveInDirection(res);
		};

		const countForRightPartOfTheBoard = () => {
			const arr = [];
			array.forEach(xArray => {
				arr.push([xArray[0], xArray[1], xArray[2]]);
			});

			let goLeft = 0;
			let goRight = 0;
			let goUp = 0;
			let goDown = 0;

			arr.forEach((yArray, index) => {
				if (yArray[2] == 0 && index < 2) {
					goUp++;
				} else if (yArray[2] == 0 && index > 2) {
					goDown++;
				}
			});

			if (arr[2][0] == 0 || arr[2][1] == 0) {
				goLeft++;
			}

			let hor = goLeft > goRight ? 'LEFT' : 'RIGHT';
			let vert = goUp > goDown ? 'UP' : 'DOWN';

			let res = goUp > goRight || goUp > goLeft || goDown > goLeft || goDown > goRight ? vert : hor;

			moveInDirection(res);
		};

		const countForLeftPartOfTheBoard = () => {
			const arr = [];
			array.forEach(xArray => {
				arr.push([xArray[2], xArray[3], xArray[4]]);
			});

			let goLeft = 0;
			let goRight = 0;
			let goUp = 0;
			let goDown = 0;

			arr.forEach((yArray, index) => {
				if (yArray[0] == 0 && index < 2) {
					goUp++;
				} else if (yArray[0] == 0 && index > 2) {
					goDown++;
				}
			});

			if (arr[2][1] == 0 || arr[2][2] == 0) {
				goRight++;
			}

			let hor = goLeft > goRight ? 'LEFT' : 'RIGHT';
			let vert = goUp > goDown ? 'UP' : 'DOWN';

			let res = goUp > goRight || goUp > goLeft || goDown > goLeft || goDown > goRight ? vert : hor;

			moveInDirection(res);
		};

		if (!isUp && !isDown && !isLeft && !isRight) {
			countForMiddleOfBoard();
		} else if (isDown && !isLeft && !isRight) {
			countForBottomOfBoard();
		} else if (isRight && !isUp && !isDown) {
			countForRightPartOfTheBoard();
		} else if (isUp && !isLeft && !isRight) {
			countForTopOfBoard();
		} else if (isLeft && !isUp && !isDown) {
			countForLeftPartOfTheBoard();
		} else {
			goRandom();
		}
	};

	performAction();

	// // Change move
	body.input = direction;

	// Make move if needed
	game.makeMove(body);
}