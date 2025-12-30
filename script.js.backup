// Matrix-Style Windsurf Tetris - Main Script
// ==========================================

// Canvas Setup
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game Constants
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 35;
const LINES_PER_LEVEL = 10;
const MAX_LEVEL = 1000;

// Tetromino Shapes (Sail Patches)
const SHAPES = {
    I: [[1,1,1,1]],
    O: [[1,1],[1,1]],
    T: [[0,1,0],[1,1,1]],
    S: [[0,1,1],[1,1,0]],
    Z: [[1,1,0],[0,1,1]],
    J: [[1,0,0],[1,1,1]],
    L: [[0,0,1],[1,1,1]]
};

const COLORS = {
    I: '#00ffff',
    O: '#ffff00',
    T: '#ff00ff',
    S: '#00ff00',
    Z: '#ff0000',
    J: '#0000ff',
    L: '#ff8800'
};

// Game State
let arena = createMatrix(COLS, ROWS);
let player = {
    pos: {x: 0, y: 0},
    matrix: null,
    type: null
};
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let score = 0;
let level = 1;
let lines = 0;
let gameOver = false;
let paused = false;
let audioContext = null;
let soundBuffers = {};

// Matrix Rain Effect - Enhanced
let matrixRain = [];
const MATRIX_CHARS = 'アイウエオカキクセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()<>[]{}=+-_';
const RAIN_COLUMNS = Math.floor(canvas.width / 15);

function initMatrixRain() {
    for (let i = 0; i < RAIN_COLUMNS; i++) {
        matrixRain[i] = {
            y: Math.random() * canvas.height - 200,
            speed: 3 + Math.random() * 8,
            chars: [],
            length: 15 + Math.floor(Math.random() * 25),
            brightness: 0.7 + Math.random() * 0.3
        };
        for (let j = 0; j < matrixRain[i].length; j++) {
            matrixRain[i].chars.push(MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]);
        }
    }
}

function drawMatrixRain() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = 'bold 18px monospace';
    
    for (let i = 0; i < matrixRain.length; i++) {
        const col = matrixRain[i];
        const fontSize = 18;
        
        for (let j = 0; j < col.chars.length; j++) {
            const char = col.chars[j];
            const x = i * 15;
            const y = col.y - j * fontSize;
            
            if (y < 0 || y > canvas.height + 50) continue;
            
            let opacity = (1 - j / col.chars.length) * col.brightness;
            
            if (j === 0) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#0f0';
                ctx.fillStyle = `rgba(255, 255, 255, ${col.brightness})`;
            } else if (j < 4) {
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#0f0';
                ctx.fillStyle = `rgba(180, 255, 180, ${opacity})`;
            } else {
                ctx.shadowBlur = 0;
                ctx.fillStyle = `rgba(0, 255, 0, ${opacity * 0.8})`;
            }
            
            ctx.fillText(char, x, y);
        }
        
        ctx.shadowBlur = 0;
        
        col.y += col.speed;
        
        if (col.y > canvas.height + col.length * fontSize + 100) {
            col.y = -col.length * fontSize - Math.random() * 200;
            col.speed = 3 + Math.random() * 8;
            col.length = 15 + Math.floor(Math.random() * 25);
            col.brightness = 0.7 + Math.random() * 0.3;
            col.chars = [];
            for (let j = 0; j < col.length; j++) {
                col.chars.push(MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]);
            }
        }
        
        if (Math.random() > 0.95) {
            const charIndex = Math.floor(Math.random() * col.chars.length);
            col.chars[charIndex] = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        }
    }
}

// Sound Engine
async function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const sounds = ['drop', 'rotate', 'lineclear', 'levelup', 'gameover'];
    
    for (const sound of sounds) {
        try {
            const response = await fetch(`sounds/${sound}.ogg`);
            if (response.ok) {
                const arrayBuffer = await response.arrayBuffer();
                soundBuffers[sound] = await audioContext.decodeAudioData(arrayBuffer);
            }
        } catch (e) {
            console.log(`Sound ${sound} not found - continuing without audio`);
        }
    }
}

function playSound(name) {
    if (!audioContext || !soundBuffers[name]) return;
    
    const source = audioContext.createBufferSource();
    source.buffer = soundBuffers[name];
    source.connect(audioContext.destination);
    source.start(0);
}

// Utility Functions
function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPiece(type) {
    return SHAPES[type];
}

function drawMatrix(matrix, offset, context = ctx, blockSize = BLOCK_SIZE) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const px = (offset.x + x) * blockSize + (canvas.width - COLS * BLOCK_SIZE) / 2;
                const py = (offset.y + y) * blockSize + 50;
                
                context.fillStyle = COLORS[value] || '#0f0';
                context.fillRect(px, py, blockSize - 1, blockSize - 1);
                
                context.strokeStyle = '#000';
                context.lineWidth = 2;
                context.strokeRect(px, py, blockSize - 1, blockSize - 1);
                
                // Neon glow effect
                context.shadowColor = COLORS[value] || '#0f0';
                context.shadowBlur = 10;
                context.strokeStyle = COLORS[value] || '#0f0';
                context.lineWidth = 1;
                context.strokeRect(px + 2, py + 2, blockSize - 5, blockSize - 5);
                context.shadowBlur = 0;
            }
        });
    });
}

function draw() {
    // Draw game board background
    const offsetX = (canvas.width - COLS * BLOCK_SIZE) / 2;
    const offsetY = 50;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(offsetX, offsetY, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);
    
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(offsetX, offsetY, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);
    
    // Draw arena (placed blocks)
    arena.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const px = offsetX + x * BLOCK_SIZE;
                const py = offsetY + y * BLOCK_SIZE;
                
                ctx.fillStyle = value;
                ctx.fillRect(px, py, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
                
                ctx.shadowColor = value;
                ctx.shadowBlur = 5;
                ctx.strokeStyle = value;
                ctx.lineWidth = 1;
                ctx.strokeRect(px + 2, py + 2, BLOCK_SIZE - 5, BLOCK_SIZE - 5);
                ctx.shadowBlur = 0;
            }
        });
    });
    
    // Draw current piece
    if (player.matrix) {
        drawMatrix(player.matrix, player.pos);
    }
}

function drawNext() {
    nextCtx.fillStyle = '#000';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    if (nextPiece) {
        const offsetX = (nextCanvas.width / BLOCK_SIZE - nextPiece.matrix[0].length) / 2;
        const offsetY = (nextCanvas.height / BLOCK_SIZE - nextPiece.matrix.length) / 2;
        
        nextPiece.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    const px = (offsetX + x) * 20;
                    const py = (offsetY + y) * 20;
                    
                    nextCtx.fillStyle = COLORS[nextPiece.type];
                    nextCtx.fillRect(px, py, 18, 18);
                    
                    nextCtx.shadowColor = COLORS[nextPiece.type];
                    nextCtx.shadowBlur = 5;
                    nextCtx.strokeStyle = COLORS[nextPiece.type];
                    nextCtx.strokeRect(px + 2, py + 2, 14, 14);
                    nextCtx.shadowBlur = 0;
                }
            });
        });
    }
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (arena[y + o.y] === undefined ||
                arena[y + o.y][x + o.x] === undefined ||
                arena[y + o.y][x + o.x] !== 0)) {
                return true;
            }
        }
    }
    return false;
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = COLORS[player.type];
            }
        });
    });
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

// SRS Wall Kick Data
const WALL_KICK_DATA = {
    JLSTZ: {
        '0->R': [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]],
        'R->0': [[0,0], [1,0], [1,-1], [0,2], [1,2]],
        'R->2': [[0,0], [1,0], [1,-1], [0,2], [1,2]],
        '2->R': [[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]],
        '2->L': [[0,0], [1,0], [1,1], [0,-2], [1,-2]],
        'L->2': [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]],
        'L->0': [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]],
        '0->L': [[0,0], [1,0], [1,1], [0,-2], [1,-2]]
    },
    I: {
        '0->R': [[0,0], [-2,0], [1,0], [-2,-1], [1,2]],
        'R->0': [[0,0], [2,0], [-1,0], [2,1], [-1,-2]],
        'R->2': [[0,0], [-1,0], [2,0], [-1,2], [2,-1]],
        '2->R': [[0,0], [1,0], [-2,0], [1,-2], [-2,1]],
        '2->L': [[0,0], [2,0], [-1,0], [2,1], [-1,-2]],
        'L->2': [[0,0], [-2,0], [1,0], [-2,-1], [1,2]],
        'L->0': [[0,0], [1,0], [-2,0], [1,-2], [-2,1]],
        '0->L': [[0,0], [-1,0], [2,0], [-1,2], [2,-1]]
    },
    O: {
        '0->R': [[0,0]],
        'R->0': [[0,0]],
        'R->2': [[0,0]],
        '2->R': [[0,0]],
        '2->L': [[0,0]],
        'L->2': [[0,0]],
        'L->0': [[0,0]],
        '0->L': [[0,0]]
    }
};

function playerRotate(dir) {
    const originalMatrix = player.matrix.map(row => [...row]);
    const originalPos = {...player.pos};
    
    rotate(player.matrix, dir);
    
    const rotationType = player.type === 'I' ? 'I' : (player.type === 'O' ? 'O' : 'JLSTZ');
    
    if (!player.rotation) player.rotation = 0;
    const fromState = player.rotation;
    const toState = (player.rotation + (dir > 0 ? 1 : 3)) % 4;
    
    const stateNames = ['0', 'R', '2', 'L'];
    const kickKey = `${stateNames[fromState]}->${stateNames[toState]}`;
    const kicks = WALL_KICK_DATA[rotationType][kickKey] || [[0,0]];
    
    let success = false;
    for (const [dx, dy] of kicks) {
        player.pos.x = originalPos.x + dx;
        player.pos.y = originalPos.y + dy;
        
        if (!collide(arena, player)) {
            success = true;
            player.rotation = toState;
            playSound('rotate');
            break;
        }
    }
    
    if (!success) {
        player.matrix = originalMatrix;
        player.pos = originalPos;
    }
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
        playSound('drop');
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerHardDrop() {
    while (!collide(arena, player)) {
        player.pos.y++;
        score += 2;
    }
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
    playSound('drop');
}

let nextPiece = null;

function playerReset() {
    const types = Object.keys(SHAPES);
    
    if (!nextPiece) {
        const type = types[types.length * Math.random() | 0];
        nextPiece = {
            matrix: createPiece(type),
            type: type
        };
    }
    
    player.matrix = nextPiece.matrix;
    player.type = nextPiece.type;
    player.rotation = 0;
    player.pos.y = 0;
    player.pos.x = (COLS / 2 | 0) - (player.matrix[0].length / 2 | 0);
    
    const type = types[types.length * Math.random() | 0];
    nextPiece = {
        matrix: createPiece(type),
        type: type
    };
    
    drawNext();
    
    if (collide(arena, player)) {
        endGame();
    }
}

function arenaSweep() {
    let rowCount = 0;
    outer: for (let y = arena.length - 1; y >= 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        
        rowCount++;
        score += 100;
    }
    
    if (rowCount > 0) {
        lines += rowCount;
        score += rowCount * rowCount * 100;
        playSound('lineclear');
        
        const newLevel = Math.min(MAX_LEVEL, Math.floor(lines / LINES_PER_LEVEL) + 1);
        if (newLevel > level) {
            level = newLevel;
            dropInterval = Math.max(100, 1000 - (level - 1) * 5);
            triggerGlitch();
            playSound('levelup');
        }
    }
}

function triggerGlitch() {
    const overlay = document.getElementById('glitchOverlay');
    overlay.classList.add('active');
    setTimeout(() => {
        overlay.classList.remove('active');
    }, 300);
}

function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('lines').textContent = lines;
}

function endGame() {
    gameOver = true;
    playSound('gameover');
    
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalLevel').textContent = level;
    document.getElementById('finalLines').textContent = lines;
    document.getElementById('gameOver').style.display = 'block';
}

function restart() {
    arena = createMatrix(COLS, ROWS);
    score = 0;
    level = 1;
    lines = 0;
    dropInterval = 1000;
    gameOver = false;
    paused = false;
    
    document.getElementById('gameOver').style.display = 'none';
    
    updateScore();
    playerReset();
    update();
}

function update(time = 0) {
    if (gameOver || paused) {
        requestAnimationFrame(update);
        return;
    }
    
    const deltaTime = time - lastTime;
    lastTime = time;
    
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }
    
    drawMatrixRain();
    draw();
    
    requestAnimationFrame(update);
}

// Keyboard Controls
document.addEventListener('keydown', event => {
    if (gameOver && event.key.toLowerCase() === 'r') {
        restart();
        return;
    }
    
    if (gameOver) return;
    
    if (event.key === 'ArrowLeft') {
        playerMove(-1);
    } else if (event.key === 'ArrowRight') {
        playerMove(1);
    } else if (event.key === 'ArrowDown') {
        playerDrop();
    } else if (event.key === 'ArrowUp') {
        playerRotate(1);
    } else if (event.key === ' ') {
        event.preventDefault();
        playerHardDrop();
    } else if (event.key.toLowerCase() === 'p') {
        paused = !paused;
        if (!paused) {
            lastTime = performance.now();
        }
    } else if (event.key.toLowerCase() === 'r') {
        if (confirm('Restart game? Current progress will be lost.')) {
            restart();
        }
    }
});

// Window Resize Handler
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initMatrixRain();
});

// Initialize Game
document.addEventListener('DOMContentLoaded', () => {
    initMatrixRain();
    initAudio();
    updateScore();
    playerReset();
    update();
});

// First user interaction to activate audio
document.addEventListener('click', () => {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
}, { once: true });

console.log('Matrix-Style Windsurf Tetris Loaded!');
console.log('Press any key to start surfing the digital waves...');
