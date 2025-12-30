// Matrix-Style Windsurf Tetris - Enhanced Version
// ================================================

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

// Tetromino Shapes
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
    type: null,
    rotation: 0
};
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let score = 0;
let level = 1;
let lines = 0;
let gameOver = false;
let paused = false;
let gameStarted = false;
let playerName = '';
let audioContext = null;
let soundBuffers = {};
let nextPiece = null;

// Matrix Rain - Like matrixshell-web
const MATRIX_CHARS = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const fontSize = 16;
let columns;
let drops = [];

function initMatrixRain() {
    columns = Math.floor(canvas.width / fontSize);
    drops = Array.from({ length: columns }, () => Math.random() * canvas.height / fontSize);
}

// Matrix Explosion and LEVEL UP Animation
let explosions = [];
let levelUpAnimation = null;

function triggerMatrixExplosion() {
    const explosionCount = 50;
    for (let i = 0; i < explosionCount; i++) {
        explosions.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            char: MATRIX_CHARS.charAt(Math.floor(Math.random() * MATRIX_CHARS.length)),
            life: 1.0,
            size: 16 + Math.random() * 20
        });
    }
    
    // Trigger LEVEL UP text animation
    levelUpAnimation = {
        text: 'LEVEL UP',
        particles: [],
        life: 1.0,
        stage: 0 // 0: forming, 1: stable, 2: exploding
    };
    
    // Create particles that form LEVEL UP
    const text = 'LEVEL UP';
    const fontSize = 60;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const textWidth = text.length * fontSize * 0.6;
    const startX = centerX - textWidth / 2;
    
    for (let i = 0; i < text.length; i++) {
        const targetX = startX + i * fontSize * 0.6;
        const targetY = centerY;
        
        // Create multiple particles per letter for effect
        for (let j = 0; j < 15; j++) {
            levelUpAnimation.particles.push({
                char: text[i],
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                targetX: targetX + (Math.random() - 0.5) * 20,
                targetY: targetY + (Math.random() - 0.5) * 20,
                vx: 0,
                vy: 0,
                size: fontSize,
                alpha: 1.0
            });
        }
    }
}

function drawMatrixRain() {
    // Simple fade like matrixshell-web
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw matrix rain
    ctx.fillStyle = '#0F0';
    ctx.font = `${fontSize}px monospace`;
    
    for (let i = 0; i < columns; i++) {
        const text = MATRIX_CHARS.charAt(Math.floor(Math.random() * MATRIX_CHARS.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(text, x, y);
        
        // Reset and slower speed
        if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i] += 0.3 + Math.random() * 0.4;
    }
    
    // Draw explosions
    for (let i = explosions.length - 1; i >= 0; i--) {
        const exp = explosions[i];
        
        exp.x += exp.vx;
        exp.y += exp.vy;
        exp.vy += 0.3;
        exp.life -= 0.02;
        
        if (exp.life <= 0) {
            explosions.splice(i, 1);
            continue;
        }
        
        const alpha = exp.life;
        ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
        ctx.font = `${exp.size}px monospace`;
        ctx.fillText(exp.char, exp.x, exp.y);
    }
    
    // Draw LEVEL UP animation
    if (levelUpAnimation) {
        const anim = levelUpAnimation;
        
        for (const particle of anim.particles) {
            // Stage 0: Move towards target position
            if (anim.stage === 0) {
                const dx = particle.targetX - particle.x;
                const dy = particle.targetY - particle.y;
                particle.vx = dx * 0.1;
                particle.vy = dy * 0.1;
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Check if close enough
                if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
                    particle.x = particle.targetX;
                    particle.y = particle.targetY;
                }
            }
            // Stage 2: Explode
            else if (anim.stage === 2) {
                particle.vx = (Math.random() - 0.5) * 15;
                particle.vy = (Math.random() - 0.5) * 15 - 5;
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.alpha -= 0.02;
            }
            
            // Draw particle
            if (particle.alpha > 0) {
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#0f0';
                ctx.fillStyle = `rgba(0, 255, 0, ${particle.alpha})`;
                ctx.font = `bold ${particle.size}px monospace`;
                ctx.fillText(particle.char, particle.x, particle.y);
                ctx.shadowBlur = 0;
            }
        }
        
        // Update animation stage
        if (anim.stage === 0) {
            // Check if all particles reached target
            const allReached = anim.particles.every(p => 
                Math.abs(p.x - p.targetX) < 5 && Math.abs(p.y - p.targetY) < 5
            );
            if (allReached) {
                anim.stage = 1;
                anim.stableTime = 0;
            }
        } else if (anim.stage === 1) {
            // Stay stable for a bit
            anim.stableTime = (anim.stableTime || 0) + 1;
            if (anim.stableTime > 60) {
                anim.stage = 2;
            }
        } else if (anim.stage === 2) {
            // Explode and fade
            anim.life -= 0.015;
            if (anim.life <= 0) {
                levelUpAnimation = null;
            }
        }
    }
}

// Highscore System with JSON File & LocalStorage Fallback
async function loadHighscores() {
    // Try to load from JSON file first
    try {
        const response = await fetch('highscores.json');
        if (response.ok) {
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        }
    } catch (e) {
        console.log('Loading from LocalStorage instead');
    }
    
    // Fallback to LocalStorage
    const stored = localStorage.getItem('matrixTetrisHighscores');
    return stored ? JSON.parse(stored) : [];
}

async function saveHighscore(name, score, level, lines) {
    let highscores = await loadHighscores();
    highscores.push({
        name: name || 'Anonymous',
        score: score,
        level: level,
        lines: lines,
        date: new Date().toISOString()
    });
    highscores.sort((a, b) => b.score - a.score);
    const top10 = highscores.slice(0, 10);
    
    // Try to save to JSON file via PHP
    try {
        const response = await fetch('save_highscore.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(top10)
        });
        
        if (!response.ok) {
            throw new Error('Server save failed');
        }
    } catch (e) {
        console.log('Saving to LocalStorage only');
    }
    
    // Always save to LocalStorage as backup
    localStorage.setItem('matrixTetrisHighscores', JSON.stringify(top10));
    return top10;
}

async function displayHighscores() {
    const highscores = await loadHighscores();
    const listEl = document.getElementById('highscoreList');
    
    if (!listEl) return;
    
    if (highscores.length === 0) {
        listEl.innerHTML = '<div class="highscore-empty">No scores yet!</div>';
        return;
    }
    
    let html = '';
    highscores.forEach((hs, index) => {
        const medal = index === 0 ? '🥇' : (index === 1 ? '🥈' : (index === 2 ? '🥉' : `${index + 1}.`));
        html += `
            <div class="highscore-entry">
                <span class="rank">${medal}</span>
                <span class="hs-name">${hs.name}</span>
                <span class="hs-score">${hs.score}</span>
            </div>
        `;
    });
    listEl.innerHTML = html;
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
            console.log(`Sound ${sound} not available`);
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
    const shape = SHAPES[type];
    return shape.map(row => row.map(cell => cell === 0 ? 0 : type));
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
    const offsetX = (canvas.width - COLS * BLOCK_SIZE) / 2;
    const offsetY = 50;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(offsetX, offsetY, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);
    
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(offsetX, offsetY, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);
    
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
    
    if (player.matrix) {
        drawMatrix(player.matrix, player.pos);
    }
}

function drawNext() {
    nextCtx.fillStyle = '#000';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    if (nextPiece) {
        const offsetX = (nextCanvas.width / 20 - nextPiece.matrix[0].length) / 2;
        const offsetY = (nextCanvas.height / 20 - nextPiece.matrix.length) / 2;
        
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
    // Simple 90-degree clockwise rotation
    const N = matrix.length;
    const M = matrix[0].length;
    const rotated = [];
    
    for (let i = 0; i < M; i++) {
        rotated[i] = [];
        for (let j = 0; j < N; j++) {
            rotated[i][j] = matrix[N - 1 - j][i];
        }
    }
    
    // Copy back to original matrix
    matrix.length = 0;
    rotated.forEach(row => matrix.push(row));
}

function playerRotate(dir) {
    const originalMatrix = player.matrix.map(row => [...row]);
    const originalPos = {...player.pos};
    
    // Don't rotate O piece
    if (player.type === 'O') {
        return;
    }
    
    rotate(player.matrix, dir);
    
    // Try basic position
    if (!collide(arena, player)) {
        playSound('rotate');
        return;
    }
    
    // Try moving left
    player.pos.x -= 1;
    if (!collide(arena, player)) {
        playSound('rotate');
        return;
    }
    
    // Try moving right
    player.pos.x = originalPos.x + 1;
    if (!collide(arena, player)) {
        playSound('rotate');
        return;
    }
    
    // Try moving right more
    player.pos.x = originalPos.x + 2;
    if (!collide(arena, player)) {
        playSound('rotate');
        return;
    }
    
    // Failed - restore original
    player.matrix = originalMatrix;
    player.pos = originalPos;
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
    
    // Trigger matrix explosion
    triggerMatrixExplosion();
}

function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('lines').textContent = lines;
}

async function endGame() {
    gameOver = true;
    gameStarted = false;
    playSound('gameover');
    
    await saveHighscore(playerName, score, level, lines);
    
    document.getElementById('finalPlayerName').textContent = playerName;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalLevel').textContent = level;
    document.getElementById('finalLines').textContent = lines;
    document.getElementById('gameOver').style.display = 'block';
    
    await displayHighscores();
}

function startGame() {
    const nameInput = document.getElementById('playerName');
    playerName = nameInput.value.trim() || 'Anonymous';
    
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'flex';
    document.getElementById('playerNameDisplay').textContent = playerName;
    
    arena = createMatrix(COLS, ROWS);
    score = 0;
    level = 1;
    lines = 0;
    dropInterval = 1000;
    gameOver = false;
    paused = false;
    gameStarted = true;
    nextPiece = null;
    
    updateScore();
    displayHighscores();
    playerReset();
    lastTime = performance.now();
}

function backToStart() {
    gameStarted = false;
    gameOver = false;
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('startScreen').style.display = 'flex';
    document.getElementById('playerName').value = '';
    displayHighscores();
}

// Make functions globally available
window.startGame = startGame;
window.backToStart = backToStart;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    
    drawMatrixRain();
    
    if (gameStarted && !gameOver && !paused) {
        dropCounter += deltaTime;
        if (dropCounter > dropInterval) {
            playerDrop();
        }
        draw();
    } else if (gameStarted) {
        draw();
    }
    
    requestAnimationFrame(update);
}

// Keyboard Controls
document.addEventListener('keydown', event => {
    if (!gameStarted) return;
    
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
    }
});

// Start Screen Enter Key
document.getElementById('playerName').addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        startGame();
    }
});

// Window Resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initMatrixRain();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initMatrixRain();
    initAudio();
    displayHighscores();
    update();
});

document.addEventListener('click', () => {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
}, { once: true });

console.log('Matrix Tetris Loaded - Enter the Matrix...');
