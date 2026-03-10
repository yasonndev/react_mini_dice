```jsx
import './App.css'
import './DiceContainer.scss'

import { useState, useEffect, useRef } from 'react';

// ─── Слот-машина ────────────────────────────────────────────────────────────
const SLOT_SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '🔔', '7️⃣'];

function SlotReel({ symbol, spinning, delay }) {
    return (
        <div className={`reel ${spinning ? 'spinning' : ''}`} style={{ animationDelay: `${delay}ms` }}>
            <div className="reel-inner">
                {spinning
                    ? SLOT_SYMBOLS.map((s, i) => <div key={i} className="reel-symbol">{s}</div>)
                    : <div className="reel-symbol final">{symbol}</div>
                }
            </div>
        </div>
    );
}

function SlotGame() {
    const [reels, setReels] = useState(['🍒', '🍋', '🍊']);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null); // 'win' | 'lose' | null
    const [coins, setCoins] = useState(100);
    const timeoutRef = useRef(null);

    const spin = () => {
        if (spinning || coins < 10) return;
        setCoins(c => c - 10);
        setSpinning(true);
        setResult(null);

        const newReels = reels.map(() =>
            SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]
        );

        timeoutRef.current = setTimeout(() => {
            setReels(newReels);
            setSpinning(false);
            if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
                setResult('jackpot');
                setCoins(c => c + 150);
            } else if (newReels[0] === newReels[1] || newReels[1] === newReels[2] || newReels[0] === newReels[2]) {
                setResult('win');
                setCoins(c => c + 30);
            } else {
                setResult('lose');
            }
        }, 1800);
    };

    useEffect(() => () => clearTimeout(timeoutRef.current), []);

    return (
        <div className="slot-game">
            <div className="slot-coins">🪙 {coins}</div>
            <div className="slot-machine">
                <div className="slot-window">
                    {reels.map((sym, i) => (
                        <SlotReel key={i} symbol={sym} spinning={spinning} delay={i * 120} />
                    ))}
                </div>
                <div className="slot-line" />
            </div>

            <div className="slot-result">
                {result === 'jackpot' && <span className="jackpot-text">🎉 ДЖЕКПОТ! +150</span>}
                {result === 'win' && <span className="win-text">✨ Выигрыш! +30</span>}
                {result === 'lose' && <span className="lose-text">Не повезло... -10</span>}
            </div>

            <button
                className={`slot-btn ${spinning ? 'disabled' : ''} ${coins < 10 ? 'broke' : ''}`}
                onClick={spin}
                disabled={spinning || coins < 10}
            >
                {coins < 10 ? 'Монеты кончились 😢' : spinning ? 'Крутится...' : '🎰 Крутить! (−10)'}
            </button>

            {coins < 10 && (
                <button className="reset-btn" onClick={() => { setCoins(100); setResult(null); }}>
                    Получить монеты 🪙
                </button>
            )}
        </div>
    );
}

// ─── Кубики (оригинальная игра) ──────────────────────────────────────────────
const emojis = [
    { icon: '🎲', type: 'dice', min: 1, max: 6 },
    { icon: '🎯', type: 'target', min: 1, max: 12 },
    { icon: '🥅', type: 'goal', min: 0, max: 9 },
    { icon: '🏀', type: 'ball', min: 1, max: 3 },
    { icon: '🎳', type: 'bowling', min: 0, max: 6 },
    { icon: '🃏', type: 'card', min: 1, max: 13 },
];

function DiceGame() {
    const [game, setGame] = useState({ emoji: '💠', value: null, id: 0 });

    const play = (item) => {
        const result = Math.floor(Math.random() * (item.max - item.min + 1)) + item.min;
        setGame({ emoji: item.icon, value: result, id: Date.now() });
    };

    return (
        <>
            <div className="sf-board">
                <div className="holder" key={`emoji-${game.id}`}>{game.emoji}</div>
                <div className="result-box" key={`res-${game.id}`}>
                    {game.value !== null && (
                        game.value === 0
                            ? <span className="zero-text">Упс! Мазила... 🤡</span>
                            : <span className="number">{game.value}</span>
                    )}
                </div>
            </div>

            <div className="sf-deck">
                <div className="sizer">
                    <div className="emojis">
                        {emojis.map((item) => (
                            <div key={item.type} className="emoji-item" onClick={() => play(item)}>
                                {item.icon}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

// ─── Главный компонент ───────────────────────────────────────────────────────
const GAMES = [
    { id: 'dice', label: '🎲 Кубики' },
    { id: 'slots', label: '🎰 Слоты' },
];

function DiceContainer() {
    const [activeGame, setActiveGame] = useState('dice');

    return (
        <div className="main-wrapper">
            {/* Переключатель игр */}
            <div className="game-switcher">
                {GAMES.map(g => (
                    <button
                        key={g.id}
                        className={`switcher-btn ${activeGame === g.id ? 'active' : ''}`}
                        onClick={() => setActiveGame(g.id)}
                    >
                        {g.label}
                    </button>
                ))}
            </div>

            {/* Контент игры */}
            <div className="game-content">
                {activeGame === 'dice' && <DiceGame />}
                {activeGame === 'slots' && <SlotGame />}
            </div>

            <div className="sf-footer">© Yanchik</div>
        </div>
    );
}

export default DiceContainer;

```


```scss
body {
  background: #eee;
  height: 100vh;
  width: 100%;
  #root {
    width: 100%;
  }
}

/* ── Анимации ─────────────────────────────────────────────────── */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes popUp {
  0% { transform: scale(0.8) translateY(20px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

@keyframes reelSpin {
  0%   { transform: translateY(0); }
  100% { transform: translateY(-700%); }
}

@keyframes jackpotPulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.12); }
}

@keyframes fadeSlideIn {
  0%   { opacity: 0; transform: translateY(-6px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* ── Обёртка ──────────────────────────────────────────────────── */
.main-wrapper {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
  max-height: 100vh;
  width: 100%;
}

/* ── Переключатель игр ────────────────────────────────────────── */
.game-switcher {
  background: #0d2161;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 2px solid #1a3a8f;
}

.switcher-btn {
  background: #1e3a8a;
  color: #a8c3ff;
  border: 2px solid #2951a0;
  border-radius: 10px;
  padding: 8px 24px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.22s ease;
  letter-spacing: 0.5px;

  &:hover {
    background: #2951a0;
    color: #fff;
    border-color: #747bff;
    transform: translateY(-1px);
  }

  &.active {
    background: #535bf2;
    color: #fff;
    border-color: #f3bf41;
    box-shadow: 0 3px 16px rgba(83, 91, 242, 0.5);
    transform: translateY(-1px);
  }
}

/* ── Контент (растягивается) ──────────────────────────────────── */
.game-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}

/* ── Доска (кубики) ───────────────────────────────────────────── */
.sf-board {
  background: #535bf2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  flex: 0 0 30%;

  .holder {
    font-size: 80px;
    animation: popUp 0.3s ease-out;
  }

  .result-box {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;

    .number {
      font-size: 54px;
      font-weight: 800;
      color: #f3bf41;
      text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      animation: bounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    .zero-text {
      font-size: 24px;
      color: #ff4d4d;
      font-weight: bold;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
      animation: shake 0.4s ease-in-out;
    }
  }
}

/* ── Дека (кубики) ────────────────────────────────────────────── */
.sf-deck {
  background: #2951a0;
  flex: 1;
  display: flex;
  align-items: center;

  .sizer {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 32px 16px;
    width: 100%;
  }

  .emojis {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 20px;

    .emoji-item {
      background: #747bff;
      font-size: 32px;
      padding: 28px;
      border: 1px solid #747bff;
      border-radius: 12px;
      box-shadow: 0 3px 12px 0 #103275;
      transition: all 0.3s ease-in-out;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background-color: #f3bf41;
        transform: rotate(2deg) scale(1.2);
        box-shadow: 0 8px 24px 0 #103275;
        border-color: #f3bf41;
      }
    }
  }
}

/* ── Слот-машина ──────────────────────────────────────────────── */
.slot-game {
  flex: 1;
  background: #1a0a3d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 24px 16px;
  overflow: hidden;
}

.slot-coins {
  font-size: 22px;
  font-weight: 800;
  color: #f3bf41;
  background: rgba(243,191,65,0.12);
  border: 2px solid #f3bf41;
  border-radius: 30px;
  padding: 6px 24px;
  letter-spacing: 1px;
  animation: fadeSlideIn 0.3s ease;
}

.slot-machine {
  position: relative;
  background: linear-gradient(145deg, #2d1060, #1a0a3d);
  border: 3px solid #7c3aed;
  border-radius: 20px;
  padding: 20px 24px;
  box-shadow:
    0 0 40px rgba(124,58,237,0.4),
    inset 0 0 30px rgba(0,0,0,0.4);
}

.slot-window {
  display: flex;
  gap: 12px;
  background: #0d0628;
  border-radius: 12px;
  padding: 12px;
  border: 2px solid #4c1d95;
  overflow: hidden;
  position: relative;

  /* блики как у настоящей машины */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 40%;
    background: linear-gradient(to bottom, rgba(255,255,255,0.04), transparent);
    border-radius: 10px 10px 0 0;
    pointer-events: none;
    z-index: 2;
  }
}

.reel {
  width: 72px;
  height: 90px;
  overflow: hidden;
  border-radius: 8px;
  background: #12072a;
  position: relative;
  border: 1px solid #4c1d95;

  &.spinning .reel-inner {
    animation: reelSpin 0.18s linear infinite;
  }
}

.reel-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.reel-symbol {
  font-size: 42px;
  width: 72px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.final {
    animation: bounceIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
}

.slot-line {
  position: absolute;
  left: 24px;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  height: 3px;
  background: linear-gradient(90deg, transparent, #f3bf41, transparent);
  border-radius: 2px;
  pointer-events: none;
  opacity: 0.6;
}

.slot-result {
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;

  .jackpot-text {
    color: #f3bf41;
    text-shadow: 0 0 20px rgba(243,191,65,0.8);
    animation: jackpotPulse 0.5s ease infinite;
  }

  .win-text {
    color: #86efac;
    animation: bounceIn 0.4s ease;
  }

  .lose-text {
    color: #f87171;
    animation: shake 0.4s ease;
  }
}

.slot-btn {
  background: linear-gradient(135deg, #7c3aed, #535bf2);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 14px 40px;
  font-size: 17px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 20px rgba(124,58,237,0.5);

  &:hover:not(.disabled):not(.broke) {
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 8px 28px rgba(124,58,237,0.7);
  }

  &:active:not(.disabled) {
    transform: translateY(0) scale(0.98);
  }

  &.disabled, &.broke {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
}

.reset-btn {
  background: transparent;
  color: #f3bf41;
  border: 2px solid #f3bf41;
  border-radius: 10px;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f3bf41;
    color: #1a0a3d;
  }
}

/* ── Футер ────────────────────────────────────────────────────── */
.sf-footer {
  background: #103275;
  color: #f3bf41;
  text-align: center;
  padding: 4px 12px;
}
```