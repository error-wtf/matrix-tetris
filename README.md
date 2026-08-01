# 🎮 Matrix Tetris

A stunning Matrix-themed Tetris game with authentic falling code rain, explosive level-up animations, and a compact square layout.

## ✨ [Play Live on GitHub Pages](https://error-wtf.github.io/matrix-tetris/)

![Matrix Tetris](assets/matrix-tetris-badge.svg)

---

## 🌟 Features

### 🎯 Core Gameplay
- **Classic Tetris Mechanics** - Authentic rotation with wall-kick support
- **7 Tetromino Types** - I, O, T, S, Z, J, L pieces with distinct colors
- **Progressive Difficulty** - Speed increases with each level
- **Scoring System** - Points for drops, lines, and combos

### 🎬 Matrix Effects
- **Authentic Matrix Rain** - Katakana characters falling like in the movie
- **LEVEL UP Animation** - Characters fly together to form "LEVEL UP" text
- **Matrix Explosions** - 50+ characters explode on level advancement
- **Neon Glow Effects** - Green CRT-style glow and shadows
- **Scan-Line Effect** - Authentic CRT monitor aesthetic

### 📊 Features
- **Top 10 Highscores** - Persistent leaderboard (LocalStorage)
- **Compact Square Layout** - Perfect for embedding
- **Responsive Design** - Highscore left, game center, stats right
- **Player Names** - Personalized gaming experience
- **Next Piece Preview** - See what's coming

---

## 🎮 Controls

| Key | Action |
|-----|--------|
| `←` `→` | Move piece left/right |
| `↑` | Rotate piece clockwise |
| `↓` | Soft drop (faster fall) |
| `Space` | Hard drop (instant) |
| `P` | Pause/Resume |

---

## 🚀 Quick Start

### Option 1: Play Online
Visit **[https://error-wtf.github.io/matrix-tetris/](https://error-wtf.github.io/matrix-tetris/)**

### Option 2: Local Setup
```bash
# Clone the repository
git clone https://github.com/error-wtf/matrix-tetris.git
cd matrix-tetris

# Open in browser
start index.html
# or
open index.html
# or
python -m http.server 8000
```

---

## 📁 Project Structure

```
matrix-tetris/
├── index.html          # Main HTML structure
├── style.css           # Compact square layout CSS
├── script.js           # Game logic & Matrix effects
├── sounds/             # Sound effects (optional)
│   ├── drop.ogg
│   ├── rotate.ogg
│   ├── lineclear.ogg
│   ├── levelup.ogg
│   └── gameover.ogg
└── README.md           # This file
```

---

## 🎨 Design Highlights

### Matrix Rain
- **Characters**: Authentic Katakana + alphanumeric
- **Speed**: 0.3-0.7 units per frame (slower, more cinematic)
- **Style**: Matrixshell-web inspired

### LEVEL UP Animation
1. **Formation** (2s): 120 characters fly from random positions to center
2. **Stability** (1s): Text holds stable with green glow
3. **Explosion**: Characters scatter in all directions with fade-out

### Compact Layout
- **Left**: Top 10 Highscores (180px width)
- **Center**: Game Canvas (300x600px)
- **Right**: Next Piece + Stats + Controls (180px width)
- **Total**: ~750px width (perfect square with margins)

---

## 🛠️ Technologies

- **HTML5 Canvas** - Rendering engine
- **Vanilla JavaScript** - No frameworks needed
- **LocalStorage API** - Persistent highscores
- **CSS3 Animations** - Glitch effects & neon glow

---

## 📝 Game Rules

1. **Lines**: Complete horizontal rows to clear them
2. **Scoring**:
   - Single Line: 100 points
   - Multiple Lines: 100 × lines²
   - Hard Drop: 2 points per cell
3. **Leveling**: Every 10 lines cleared = +1 level
4. **Speed**: Increases with each level (max level 20)
5. **Game Over**: When pieces stack to the top

---

## 🎯 Embedding

Perfect for iframes and embedding:

```html
<iframe 
  src="https://error-wtf.github.io/matrix-tetris/" 
  width="800" 
  height="700" 
  frameborder="0">
</iframe>
```

---

## 🔧 Customization

### Change Matrix Rain Speed
Edit `script.js` line 110:
```javascript
drops[i] += 0.3 + Math.random() * 0.4;  // Adjust these values
```

### Change Colors
Edit `script.js` lines 30-38:
```javascript
const COLORS = {
    I: '#00ffff',  // Cyan
    O: '#ffff00',  // Yellow
    // ... modify as needed
};
```

---

## 📜 License

**Anti-Capitalist Software License v1.4**

This software is released under the [Anti-Capitalist Software License v1.4](LICENSE).

### ✊ Who Can Use This Software?

✅ **Allowed:**
- Individual developers working for themselves
- Non-profit organizations
- Educational institutions
- Worker cooperatives (equal ownership & voting rights)
- Community projects

❌ **Not Allowed:**
- For-profit corporations with separated ownership and labor
- Organizations exploiting workers
- Military or law enforcement
- Any entity perpetuating economic inequality

See the full [LICENSE](LICENSE) file for details.

---

## 👥 Credits

- **Inspiration**: The Matrix (1999)
- **Matrix Rain**: Based on [matrixshell-web](https://github.com/error-wtf/matrixshell-web)
- **Tetris**: Based on classic Tetris game mechanics

---

## 🐛 Known Issues

None currently! 🎉

---

## 💡 Future Ideas

- [ ] Mobile touch controls
- [ ] Sound effects toggle
- [ ] Theme variations
- [ ] Multiplayer mode
- [ ] Ghost piece preview

---

**Enter the Matrix. Play Tetris. 🟢**
