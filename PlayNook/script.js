const games = {
    ticTacToe: {
        title: "Tic Tac Toe",
        instructions: "Click on a square to place your mark (X). Try to get three in a row before the computer does!",
        icon: "fas fa-times",
        color: "#D4A574"
    },
    memoryMatch: {
        title: "Memory Match",
        instructions: "Click on cards to flip them and find matching pairs. Try to complete the game in as few moves as possible!",
        icon: "fas fa-brain",
        color: "#E8B4B8"
    },
    snake: {
        title: "Snake",
        instructions: "Use arrow keys to control the snake. Eat the food to grow longer. Avoid hitting the walls or yourself!",
        icon: "fas fa-snake",
        color: "#F5D0C5"
    },
    reactionTest: {
        title: "Reaction Test",
        instructions: "Click the button as quickly as possible when it turns green. Test your reaction time!",
        icon: "fas fa-bolt",
        color: "#C9A87A"
    },
    numberGuesser: {
        title: "Number Guesser",
        instructions: "Try to guess the number between 1 and 100. You'll get feedback if your guess is too high or too low.",
        icon: "fas fa-question",
        color: "#DEB887"
    },
    typingSpeed: {
        title: "Typing Speed Test",
        instructions: "Type the displayed text as quickly and accurately as possible. Your typing speed will be calculated.",
        icon: "fas fa-keyboard",
        color: "#E8CAA8"
    }
};

const gameModal = document.getElementById('gameModal');
const modalGameTitle = document.getElementById('modalGameTitle');
const gameArea = document.getElementById('gameArea');
const gameInstructions = document.getElementById('gameInstructions');
const gameControls = document.getElementById('gameControls');
const closeModalBtn = document.getElementById('closeModal');
const bookElements = document.querySelectorAll('.book');

let currentGame = null;
let gameState = {};

bookElements.forEach(book => {
    book.addEventListener('click', () => {
        const gameId = book.getAttribute('data-game');
        openGame(gameId);
    });
});

closeModalBtn.addEventListener('click', closeGame);

gameModal.addEventListener('click', (e) => {
    if (e.target === gameModal) {
        closeGame();
    }
});

// Open a game
function openGame(gameId) {
    currentGame = gameId;
    const game = games[gameId];
    
    modalGameTitle.textContent = game.title;
    gameInstructions.textContent = game.instructions;
    gameModal.style.display = 'flex';
    
    loadGame(gameId);
}

function closeGame() {
    gameModal.style.display = 'none';
    currentGame = null;
    gameState = {};
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    if (gameState.snakeInterval) clearInterval(gameState.snakeInterval);
}

function loadGame(gameId) {
    gameArea.innerHTML = '';
    gameControls.innerHTML = '';
    
    gameArea.style.background = 'radial-gradient(circle at center, rgba(246, 241, 235, 0.9) 0%, rgba(240, 230, 214, 0.9) 100%)';
    gameArea.style.border = '2px solid #D4A574';
    gameArea.style.overflow = 'hidden'; // No scrolling
    gameArea.style.maxHeight = 'calc(100% - 100px)';
    
    switch(gameId) {
        case 'ticTacToe':
            loadTicTacToe();
            break;
        case 'memoryMatch':
            loadMemoryMatch();
            break;
        case 'snake':
            loadSnake();
            break;
        case 'reactionTest':
            loadReactionTest();
            break;
        case 'numberGuesser':
            loadNumberGuesser();
            break;
        case 'typingSpeed':
            loadTypingSpeed();
            break;
        default:
            gameArea.innerHTML = '<h3 style="color: #8B4513;">Game not found</h3>';
    }
}

// Tic Tac Toe Game 
// Tic Tac Toe Game 
function loadTicTacToe() {
    gameState.board = ['', '', '', '', '', '', '', '', ''];
    gameState.currentPlayer = 'X';
    gameState.gameActive = true;
    
    // Clear any existing content
    gameArea.innerHTML = '';
    gameControls.innerHTML = '';
    
    const container = document.createElement('div');
    container.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
    `;
    
    const board = document.createElement('div');
    board.id = 'ticTacToeBoard';
    board.style.cssText = `
        display: grid;
        grid-template-columns: repeat(3, 60px);
        grid-template-rows: repeat(3, 60px);
        gap: 4px;
        margin: 10px 0;
        flex-shrink: 0;
    `;
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.className = 'tic-tac-cell';
        cell.setAttribute('data-index', i);
        cell.setAttribute('type', 'button'); // Important for button behavior
        cell.textContent = gameState.board[i];
        cell.style.cssText = `
            width: 60px;
            height: 60px;
            min-width: 60px;
            min-height: 60px;
            background-color: #F0E6D6;
            border: 2px solid #D4A574;
            border-radius: 5px;
            font-size: 1.5rem;
            font-weight: bold;
            cursor: pointer;
            color: #8B4513;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.2s;
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        `;
        
        cell.addEventListener('mouseenter', () => {
            if (cell.textContent === '' && gameState.gameActive) {
                cell.style.backgroundColor = '#E8CAA8';
            }
        });
        
        cell.addEventListener('mouseleave', () => {
            if (cell.textContent === '' && gameState.gameActive) {
                cell.style.backgroundColor = '#F0E6D6';
            }
        });
        
        cell.addEventListener('click', () => handleTicTacToeClick(i));
        board.appendChild(cell);
    }
    
    const status = document.createElement('div');
    status.id = 'ticTacToeStatus';
    status.style.cssText = `
        color: #8B4513;
        font-size: 0.9rem;
        margin: 10px 0;
        text-align: center;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    `;
    status.innerHTML = `Current Player: <span style="font-weight:bold;color:${games.ticTacToe.color}">${gameState.currentPlayer}</span>`;
    
    container.appendChild(board);
    container.appendChild(status);
    gameArea.appendChild(container);
    
    const resetBtn = document.createElement('button');
    resetBtn.className = 'game-btn';
    resetBtn.textContent = 'Reset Game';
    resetBtn.addEventListener('click', loadTicTacToe);
    gameControls.appendChild(resetBtn);
}
function handleTicTacToeClick(index) {
    if (!gameState.gameActive || gameState.board[index] !== '') return;
    
    // Player move
    gameState.board[index] = gameState.currentPlayer;
    const cell = document.querySelector(`.tic-tac-cell[data-index="${index}"]`);
    cell.textContent = gameState.currentPlayer;
    cell.style.color = gameState.currentPlayer === 'X' ? '#8B4513' : '#A0522D';
    cell.style.backgroundColor = gameState.currentPlayer === 'X' ? '#F5D0C5' : '#E8B4B8';
    
    if (checkTicTacToeWin()) {
        document.getElementById('ticTacToeStatus').innerHTML = 
            `<span style="color:${games.ticTacToe.color};font-weight:bold;">Player ${gameState.currentPlayer} wins!</span>`;
        gameState.gameActive = false;
        return;
    }
    
    if (checkTicTacToeDraw()) {
        document.getElementById('ticTacToeStatus').innerHTML = 
            '<span style="color:#C9A87A;font-weight:bold;">Game ended in a draw!</span>';
        gameState.gameActive = false;
        return;
    }
    
    // Switch player
    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('ticTacToeStatus').innerHTML = 
        `Current Player: <span style="font-weight:bold;color:${games.ticTacToe.color}">${gameState.currentPlayer}</span>`;
    
    // Computer move (AI)
    if (gameState.currentPlayer === 'O' && gameState.gameActive) {
        setTimeout(makeComputerMove, 500);
    }
}

function makeComputerMove() {
    const emptyCells = gameState.board
        .map((cell, index) => cell === '' ? index : null)
        .filter(val => val !== null);
    
    if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        handleTicTacToeClick(randomIndex);
    }
}

function checkTicTacToeWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6] 
    ];
    
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameState.board[a] && 
            gameState.board[a] === gameState.board[b] && 
            gameState.board[a] === gameState.board[c]) {
            return true;
        }
    }
    return false;
}

function checkTicTacToeDraw() {
    return !gameState.board.includes('');
}

// Memory Match Game 
function loadMemoryMatch() {
    const symbols = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍓'];
    const cards = [...symbols, ...symbols];
    
    // Shuffle cards
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    gameState.memoryMatch = {
        cards: cards,
        flipped: [],
        matched: [],
        moves: 0,
        gameActive: true
    };
    
    const container = document.createElement('div');
    container.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 10px;
    `;
    
    const status = document.createElement('div');
    status.style.cssText = `
        color: #8B4513;
        font-size: 0.9rem;
        margin-bottom: 10px;
        text-align: center;
    `;
    status.innerHTML = 'Moves: <span id="memoryMoves">0</span> | Matches: <span id="memoryMatches">0/6</span>';
    
    const board = document.createElement('div');
    board.style.cssText = `
        display: grid;
        grid-template-columns: repeat(4, 50px);
        grid-template-rows: repeat(3, 50px);
        gap: 5px;
        margin: 5px 0;
    `;
    
    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        card.style.cssText = `
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #E8B4B8 0%, #D8A2A8 100%);
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5rem;
            color: #8B4513;
            border: 2px solid #C97B84;
            cursor: pointer;
            transition: transform 0.3s, background-color 0.3s;
        `;
        card.textContent = '?';
        
        card.addEventListener('click', () => handleMemoryCardClick(index, card));
        board.appendChild(card);
    });
    
    container.appendChild(status);
    container.appendChild(board);
    gameArea.appendChild(container);
    
    const resetBtn = document.createElement('button');
    resetBtn.className = 'game-btn';
    resetBtn.textContent = 'New Game';
    resetBtn.addEventListener('click', loadMemoryMatch);
    gameControls.appendChild(resetBtn);
}

function handleMemoryCardClick(index, cardElement) {
    const game = gameState.memoryMatch;
    if (!game.gameActive || game.flipped.includes(index) || game.matched.includes(index)) return;
    
    game.flipped.push(index);
    cardElement.textContent = game.cards[index];
    cardElement.style.backgroundColor = '#F0E6D6';
    cardElement.style.transform = 'rotateY(180deg)';
    
    if (game.flipped.length === 2) {
        game.moves++;
        document.getElementById('memoryMoves').textContent = game.moves;
        
        const [first, second] = game.flipped;
        
        if (game.cards[first] === game.cards[second]) {
            game.matched.push(first, second);
            game.flipped = [];
            
            document.getElementById('memoryMatches').textContent = `${game.matched.length/2}/6`;
            
            if (game.matched.length === 12) {
                setTimeout(() => {
                    alert(`Congratulations! You won in ${game.moves} moves!`);
                    game.gameActive = false;
                }, 500);
            }
        } else {
            setTimeout(() => {
                document.querySelectorAll('.memory-card').forEach((card, idx) => {
                    if (game.flipped.includes(idx) && !game.matched.includes(idx)) {
                        card.textContent = '?';
                        card.style.backgroundColor = '#E8B4B8';
                        card.style.transform = 'rotateY(0deg)';
                    }
                });
                game.flipped = [];
            }, 800);
        }
    }
}

// Snake Game 
function loadSnake() {
    // Clear any existing game state
    if (gameState.snakeInterval) {
        clearInterval(gameState.snakeInterval);
        gameState.snakeInterval = null;
    }
    
    document.removeEventListener('keydown', handleSnakeKeyPress);
    
    gameArea.innerHTML = '';
    
    const container = document.createElement('div');
    container.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
    `;
    
    const scoreDisplay = document.createElement('div');
    scoreDisplay.style.cssText = `
        color: #8B4513;
        font-size: 1.1rem;
        margin-bottom: 15px;
        font-weight: bold;
        text-align: center;
        width: 100%;
    `;
    scoreDisplay.innerHTML = 'Score: <span id="snakeScore" style="color:#A0522D; font-size:1.2rem;">0</span> | Use Arrow Keys';
    
    const gameContainer = document.createElement('div');
    gameContainer.style.cssText = `
        width: 300px;
        height: 300px;
        position: relative;
        margin: 0 auto;
    `;
    
    const canvas = document.createElement('canvas');
    canvas.id = 'snakeCanvas';
    canvas.width = 300;
    canvas.height = 300;
    canvas.style.cssText = `
        background-color: #F0E6D6;
        border: 3px solid #D4A574;
        border-radius: 5px;
        display: block;
    `;
    
    gameContainer.appendChild(canvas);
    container.appendChild(gameContainer);
    gameArea.appendChild(container);
    
    const gridSize = 20;
    const cellSize = canvas.width / gridSize;
    
    const initialSnake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
    ];
    
    gameState.snake = {
        gridSize: gridSize,
        cellSize: cellSize,
        snake: [...initialSnake],
        direction: 'right',
        nextDirection: 'right',
        gameActive: true,
        score: 0,
        food: null
    };
    
    generateNewFood();
    
    drawSnakeGame();
    
    document.addEventListener('keydown', handleSnakeKeyPress);
    
    // Start game loop
    gameState.snakeInterval = setInterval(updateSnakeGame, 150);
    
    gameControls.innerHTML = '';
    const resetBtn = document.createElement('button');
    resetBtn.className = 'game-btn';
    resetBtn.textContent = 'New Game';
    resetBtn.addEventListener('click', loadSnake);
    gameControls.appendChild(resetBtn);
}

function generateNewFood() {
    if (!gameState.snake) return;
    
    const game = gameState.snake;
    let food;
    let attempts = 0;
    const maxAttempts = 500;
    
    // Keep trying until we find an empty spot
    do {
        food = {
            x: Math.floor(Math.random() * game.gridSize),
            y: Math.floor(Math.random() * game.gridSize)
        };
        attempts++;
        
        if (attempts >= maxAttempts) {
            for (let x = 0; x < game.gridSize; x++) {
                for (let y = 0; y < game.gridSize; y++) {
                    const isOccupied = game.snake.some(segment => segment.x === x && segment.y === y);
                    if (!isOccupied) {
                        game.food = {x, y};
                        return;
                    }
                }
            }
            game.food = {x: 5, y: 5};
            return;
        }
    } while (game.snake.some(segment => segment.x === food.x && segment.y === food.y));
    
    game.food = food;
}

// Draw the game
function drawSnakeGame() {
    const canvas = document.getElementById('snakeCanvas');
    if (!canvas || !gameState.snake) return;
    
    const ctx = canvas.getContext('2d');
    const game = gameState.snake;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#F0E6D6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid 
    ctx.strokeStyle = 'rgba(139, 69, 19, 0.1)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= canvas.width; x += game.cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += game.cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // Draw snake
    game.snake.forEach((segment, index) => {
        if (index === 0) {
            // Draw head
            ctx.fillStyle = '#A0522D';
            ctx.fillRect(
                segment.x * game.cellSize, 
                segment.y * game.cellSize, 
                game.cellSize, 
                game.cellSize
            );
            
            // Draw eyes
            ctx.fillStyle = '#FFFFFF';
            const eyeSize = 3;
            if (game.direction === 'right') {
                ctx.fillRect(segment.x * game.cellSize + game.cellSize - 8, segment.y * game.cellSize + 6, eyeSize, eyeSize);
                ctx.fillRect(segment.x * game.cellSize + game.cellSize - 8, segment.y * game.cellSize + game.cellSize - 9, eyeSize, eyeSize);
            } else if (game.direction === 'left') {
                ctx.fillRect(segment.x * game.cellSize + 5, segment.y * game.cellSize + 6, eyeSize, eyeSize);
                ctx.fillRect(segment.x * game.cellSize + 5, segment.y * game.cellSize + game.cellSize - 9, eyeSize, eyeSize);
            } else if (game.direction === 'up') {
                ctx.fillRect(segment.x * game.cellSize + 6, segment.y * game.cellSize + 5, eyeSize, eyeSize);
                ctx.fillRect(segment.x * game.cellSize + game.cellSize - 9, segment.y * game.cellSize + 5, eyeSize, eyeSize);
            } else if (game.direction === 'down') {
                ctx.fillRect(segment.x * game.cellSize + 6, segment.y * game.cellSize + game.cellSize - 8, eyeSize, eyeSize);
                ctx.fillRect(segment.x * game.cellSize + game.cellSize - 9, segment.y * game.cellSize + game.cellSize - 8, eyeSize, eyeSize);
            }
        } else {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(
                segment.x * game.cellSize, 
                segment.y * game.cellSize, 
                game.cellSize, 
                game.cellSize
            );
            
            ctx.fillStyle = '#A0522D';
            ctx.fillRect(
                segment.x * game.cellSize + 2, 
                segment.y * game.cellSize + 2, 
                game.cellSize - 4, 
                game.cellSize - 4
            );
        }
        
        ctx.strokeStyle = '#D4A574';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            segment.x * game.cellSize, 
            segment.y * game.cellSize, 
            game.cellSize, 
            game.cellSize
        );
    });
    
    if (game.food) {
        ctx.fillStyle = '#E8B4B8';
        ctx.beginPath();
        ctx.arc(
            game.food.x * game.cellSize + game.cellSize/2,
            game.food.y * game.cellSize + game.cellSize/2,
            game.cellSize/2 - 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(
            game.food.x * game.cellSize + game.cellSize/3,
            game.food.y * game.cellSize + game.cellSize/3,
            game.cellSize/6,
            0,
            Math.PI * 2
        );
        ctx.fill();
    } else {
        generateNewFood();
    }
}

function updateSnakeGame() {
    if (!gameState.snake || !gameState.snake.gameActive) return;
    
    const game = gameState.snake;
    
    // Update direction
    game.direction = game.nextDirection;
    
    const head = {...game.snake[0]};
    
    switch(game.direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    if (head.x < 0 || head.x >= game.gridSize || head.y < 0 || head.y >= game.gridSize) {
        endSnakeGame();
        return;
    }
    
    for (let i = 1; i < game.snake.length; i++) {
        if (game.snake[i].x === head.x && game.snake[i].y === head.y) {
            endSnakeGame();
            return;
        }
    }
    
    game.snake.unshift(head);
    
    if (game.food && head.x === game.food.x && head.y === game.food.y) {
        // Increase score
        game.score++;
        
        generateNewFood();
    } else {
        game.snake.pop();
    }
    
    drawSnakeGame();
}

function handleSnakeKeyPress(e) {
    if (!gameState.snake || !gameState.snake.gameActive) return;
    
    const game = gameState.snake;
    
    // Prevent default scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
    
    switch(e.key) {
        case 'ArrowUp':
            if (game.direction !== 'down') game.nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (game.direction !== 'up') game.nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (game.direction !== 'right') game.nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (game.direction !== 'left') game.nextDirection = 'right';
            break;
        case ' ':
            game.gameActive = !game.gameActive;
            break;
    }
}

function endSnakeGame() {
    if (!gameState.snake) return;
    
    const game = gameState.snake;
    game.gameActive = false;
    
    if (gameState.snakeInterval) {
        clearInterval(gameState.snakeInterval);
        gameState.snakeInterval = null;
    }
    
    const canvas = document.getElementById('snakeCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = 'rgba(139, 69, 19, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#F6F1EB';
        ctx.font = 'bold 24px "Fredoka", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 20);
        
        ctx.font = '18px "Fredoka", sans-serif';
        ctx.fillText(`Score: ${game.score}`, canvas.width/2, canvas.height/2 + 20);
        
        ctx.font = '14px "Fredoka", sans-serif';
        ctx.fillText('Click "New Game" to play again', canvas.width/2, canvas.height/2 + 50);
    }
    
    gameControls.innerHTML = '';
    const resetBtn = document.createElement('button');
    resetBtn.className = 'game-btn';
    resetBtn.textContent = 'New Game';
    resetBtn.addEventListener('click', loadSnake);
    gameControls.appendChild(resetBtn);
}

function closeGame() {
    gameModal.style.display = 'none';
    currentGame = null;
    
    if (gameState.snakeInterval) {
        clearInterval(gameState.snakeInterval);
        gameState.snakeInterval = null;
    }
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    
    document.removeEventListener('keydown', handleSnakeKeyPress);
    
    gameState = {};
}

// Reaction Test 
function loadReactionTest() {
    const container = document.createElement('div');
    container.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 10px;
    `;
    
    container.innerHTML = `
        <h3 style="color: #8B4513; margin: 0 0 10px 0;">Reaction Test</h3>
        <p style="color: #A0522D; margin-bottom: 15px; font-size: 0.9rem; text-align: center;">
            Click the button as quickly as possible when it turns GREEN!
        </p>
        <div id="reactionButton" style="width: 120px; height: 120px; background-color: #C9A87A; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; font-size: 0.9rem; font-weight: bold; color: #8B4513; border: 4px solid #A0522D; transition: all 0.3s; margin: 10px 0;">
            Wait for Green
        </div>
        <div style="margin-top: 15px;">
            <p style="color: #8B4513; font-size: 0.9rem;">Your reaction time: <span id="reactionTime">0</span> ms</p>
            <p style="color: #A0522D; font-size: 0.8rem;">Best: <span id="bestTime">--</span> ms</p>
        </div>
    `;
    
    gameArea.appendChild(container);
    
    const button = document.getElementById('reactionButton');
    const reactionTimeDisplay = document.getElementById('reactionTime');
    const bestTimeDisplay = document.getElementById('bestTime');
    
    let waiting = true;
    let startTime = null;
    let bestTime = localStorage.getItem('bestReactionTime') || Infinity;
    if (bestTime !== Infinity) bestTimeDisplay.textContent = bestTime;
    
    const startTest = () => {
        if (waiting) {
            button.style.backgroundColor = '#2E8B57'; // GREEN color
            button.textContent = 'CLICK NOW!';
            button.style.color = '#F6F1EB';
            button.style.borderColor = '#228B22';
            startTime = Date.now();
            waiting = false;
        }
    };
    
    setTimeout(startTest, Math.random() * 2000 + 1000);
    
    button.addEventListener('click', () => {
        if (waiting) {
            button.style.backgroundColor = '#E8B4B8';
            button.textContent = 'Too Soon!';
            button.style.borderColor = '#C97B84';
            setTimeout(() => {
                button.style.backgroundColor = '#C9A87A';
                button.textContent = 'Wait for Green';
                button.style.color = '#8B4513';
                button.style.borderColor = '#A0522D';
                
                waiting = true;
                setTimeout(startTest, Math.random() * 2000 + 1000);
            }, 1000);
        } else {
            const reactionTime = Date.now() - startTime;
            reactionTimeDisplay.textContent = reactionTime;
            button.style.backgroundColor = '#D4A574';
            button.textContent = `${reactionTime}ms`;
            button.style.color = '#8B4513';
            button.style.borderColor = '#8B4513';
            
            if (reactionTime < bestTime) {
                bestTime = reactionTime;
                bestTimeDisplay.textContent = bestTime;
                localStorage.setItem('bestReactionTime', bestTime);
            }
            
            setTimeout(() => {
                waiting = true;
                button.style.backgroundColor = '#C9A87A';
                button.textContent = 'Wait for Green';
                button.style.color = '#8B4513';
                button.style.borderColor = '#A0522D';
                reactionTimeDisplay.textContent = '0';
                setTimeout(startTest, Math.random() * 2000 + 1000);
            }, 2000);
        }
    });
    
    const resetBtn = document.createElement('button');
    resetBtn.className = 'game-btn';
    resetBtn.textContent = 'New Test';
    resetBtn.addEventListener('click', loadReactionTest);
    gameControls.appendChild(resetBtn);
}

// Number Guesser
function loadNumberGuesser() {
    const secretNumber = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;
    
    const container = document.createElement('div');
    container.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 10px;
    `;
    
    container.innerHTML = `
        <h3 style="color: #8B4513; margin: 0 0 10px 0;">Number Guesser</h3>
        <p style="color: #A0522D; margin-bottom: 15px; font-size: 0.9rem; text-align: center;">
            Guess the number between 1 and 100
        </p>
        <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <input type="number" id="numberGuess" min="1" max="100" placeholder="Enter guess" 
                style="padding: 8px; font-size: 0.9rem; width: 120px; text-align: center; border: 2px solid #D4A574; border-radius: 5px; background-color: #F6F1EB; color: #8B4513;">
            <button id="submitGuess" 
                style="padding: 8px 15px; font-size: 0.9rem; background: linear-gradient(to bottom, #A0522D 0%, #8B4513 100%); color: #F6F1EB; border: none; border-radius: 5px; cursor: pointer;">
                Submit
            </button>
        </div>
        <div style="margin-top: 10px; text-align: center;">
            <p id="guessFeedback" style="font-size: 0.9rem; min-height: 30px; color: #8B4513; margin: 5px 0;"></p>
            <p style="color: #A0522D; font-size: 0.9rem;">Attempts: <span id="guessAttempts">0</span></p>
        </div>
    `;
    
    gameArea.appendChild(container);
    
    const guessInput = document.getElementById('numberGuess');
    const submitBtn = document.getElementById('submitGuess');
    const feedback = document.getElementById('guessFeedback');
    const attemptsDisplay = document.getElementById('guessAttempts');
    
    submitBtn.addEventListener('click', () => {
        const guess = parseInt(guessInput.value);
        
        if (isNaN(guess) || guess < 1 || guess > 100) {
            feedback.textContent = 'Please enter a number between 1 and 100';
            feedback.style.color = '#E8B4B8';
            return;
        }
        
        attempts++;
        attemptsDisplay.textContent = attempts;
        
        if (guess === secretNumber) {
            feedback.innerHTML = `<span style="color:#8B4513;font-weight:bold">Correct! You guessed it in ${attempts} attempts!</span>`;
            submitBtn.disabled = true;
            guessInput.disabled = true;
        } else if (guess < secretNumber) {
            feedback.textContent = 'Too low! Try a higher number.';
            feedback.style.color = '#D4A574';
        } else {
            feedback.textContent = 'Too high! Try a lower number.';
            feedback.style.color = '#C9A87A';
        }
        
        guessInput.value = '';
        guessInput.focus();
    });
    
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitBtn.click();
        }
    });
    
    const resetBtn = document.createElement('button');
    resetBtn.className = 'game-btn';
    resetBtn.textContent = 'New Game';
    resetBtn.addEventListener('click', loadNumberGuesser);
    gameControls.appendChild(resetBtn);
}

function loadTypingSpeed() {
    const text = "The quick brown fox jumps over the lazy dog";
    
    const container = document.createElement('div');
    container.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 10px;
    `;
    
    container.innerHTML = `
        <h3 style="color: #8B4513; margin: 0 0 10px 0;">Typing Speed Test</h3>
        <p style="color: #A0522D; margin-bottom: 10px; font-size: 0.9rem; text-align: center;">
            Type the text below as quickly and accurately as possible
        </p>
        <div style="background-color: #F0E6D6; padding: 10px; border-radius: 8px; margin-bottom: 10px; font-size: 1rem; line-height: 1.4; color: #8B4513; border: 2px solid #D4A574; width: 100%; max-width: 400px; text-align: center;">
            ${text}
        </div>
        <textarea id="typingInput" placeholder="Start typing here..." 
            style="width: 100%; max-width: 400px; height: 70px; padding: 10px; font-size: 0.9rem; border-radius: 8px; border: 2px solid #D4A574; background-color: #F6F1EB; color: #8B4513; resize: none; margin-bottom: 10px;">
        </textarea>
        <div style="text-align: center;">
            <p style="color: #8B4513; font-size: 0.9rem;">Time: <span id="typingTime">0</span>s | WPM: <span id="wpm">0</span> | Accuracy: <span id="accuracy">100%</span></p>
        </div>
    `;
    
    gameArea.appendChild(container);
    
    const typingInput = document.getElementById('typingInput');
    const timeDisplay = document.getElementById('typingTime');
    const wpmDisplay = document.getElementById('wpm');
    const accuracyDisplay = document.getElementById('accuracy');
    
    let startTime = null;
    let timerInterval = null;
    let originalText = text;
    
    typingInput.addEventListener('focus', () => {
        if (!startTime) {
            startTime = Date.now();
            timerInterval = setInterval(() => {
                const timeInSeconds = Math.floor((Date.now() - startTime) / 1000);
                timeDisplay.textContent = timeInSeconds;
                
                const typedWords = typingInput.value.trim().split(/\s+/).length;
                const timeInMinutes = (Date.now() - startTime) / 60000;
                const wpm = Math.round(typedWords / timeInMinutes);
                wpmDisplay.textContent = isFinite(wpm) ? wpm : 0;
                
                const typedText = typingInput.value;
                let correctChars = 0;
                for (let i = 0; i < Math.min(typedText.length, originalText.length); i++) {
                    if (typedText[i] === originalText[i]) correctChars++;
                }
                const accuracy = Math.round((correctChars / originalText.length) * 100);
                accuracyDisplay.textContent = `${accuracy}%`;
            }, 1000);
        }
    });
    
    typingInput.addEventListener('input', () => {
        if (typingInput.value === text) {
            clearInterval(timerInterval);
            typingInput.disabled = true;
            typingInput.style.backgroundColor = '#E8CAA8';
        }
    });
    
    const resetBtn = document.createElement('button');
    resetBtn.className = 'game-btn';
    resetBtn.textContent = 'New Test';
    resetBtn.addEventListener('click', loadTypingSpeed);
    gameControls.appendChild(resetBtn);
}

// Initialize with welcome message
console.log("PlayNook loaded! Click on any book to play a game.");