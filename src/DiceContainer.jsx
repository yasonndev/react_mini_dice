import './DiceContainer.scss';
import { useState, useEffect, useRef } from 'react';

// ─── Данные ───────────────────────────────────────────────────────────────────
const DICE_ITEMS = [
    { icon: '🎲', type: 'dice',    min: 1, max: 6  },
    { icon: '🎯', type: 'target',  min: 1, max: 12 },
    { icon: '🥅', type: 'goal',    min: 0, max: 9  },
    { icon: '🏀', type: 'ball',    min: 1, max: 3  },
    { icon: '🎳', type: 'bowling', min: 0, max: 6  },
    { icon: '🎰', type: 'slot',    min: 1, max: 13 },
];

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '🔔', '7️⃣'];

const TABS = [
    { id: 'dice',  label: '🎲 Кубики' },
    { id: 'slots', label: '🎰 Слоты'  },
];

// ─── Барабан слот-машины ──────────────────────────────────────────────────────
function Reel({ symbol, spinning }) {
    return (
        <div className={`reel${spinning ? ' spinning' : ''}`}>
            <div className="reel-track">
                {spinning
                    ? [...SYMBOLS, ...SYMBOLS].map((s, i) => (
                        <div key={i} className="reel-symbol">{s}</div>
                    ))
                    : <div className="reel-symbol landed">{symbol}</div>
                }
            </div>
        </div>
    );
}

// ─── Главный компонент ────────────────────────────────────────────────────────
export default function DiceContainer() {
    const [tab, setTab] = useState('dice');

    // --- Состояние кубиков ---
    const [game, setGame] = useState({ emoji: '💠', value: null, id: 0 });

    // --- Состояние слотов ---
    const [reels, setReels]         = useState(['🍒', '🍋', '🍊']);
    const [spinState, setSpinState] = useState([false, false, false]);
    const [slotResult, setSlotResult] = useState(null);
    const [coins, setCoins]         = useState(100);
    const [running, setRunning]     = useState(false);
    const timers = useRef([]);

    // --- Логика кубиков ---
    const playDice = (item) => {
        const val = Math.floor(Math.random() * (item.max - item.min + 1)) + item.min;
        setGame({ emoji: item.icon, value: val, id: Date.now() });
    };

    // --- Логика слотов ---
    const clearTimers = () => timers.current.forEach(clearTimeout);

    const spinSlots = () => {
        if (running || coins < 10) return;
        clearTimers();
        setCoins(c => c - 10);
        setSlotResult(null);
        setRunning(true);
        setSpinState([true, true, true]);

        const next = [0, 1, 2].map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);

        [0, 1, 2].forEach(i => {
            const t = setTimeout(() => {
                setSpinState(prev => { const s = [...prev]; s[i] = false; return s; });
                setReels(prev => { const r = [...prev]; r[i] = next[i]; return r; });

                if (i === 2) {
                    setTimeout(() => {
                        const all3 = next[0] === next[1] && next[1] === next[2];
                        const any2 = next[0] === next[1] || next[1] === next[2] || next[0] === next[2];
                        if (all3)      { setSlotResult('jackpot'); setCoins(c => c + 150); }
                        else if (any2) { setSlotResult('win');     setCoins(c => c + 30);  }
                        else             setSlotResult('lose');
                        setRunning(false);
                    }, 120);
                }
            }, 800 + i * 420);
            timers.current.push(t);
        });
    };

    useEffect(() => () => clearTimers(), []);

    return (
        <div className="main-wrapper">

            {/* ── Переключатель ── */}
            <div className="game-switcher">
                {TABS.map(t => (
                    <button
                        key={t.id}
                        className={`switcher-btn${tab === t.id ? ' active' : ''}`}
                        onClick={() => setTab(t.id)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ── Игровая зона ── */}
            <div className="game-area" key={tab}>

                {/* ════ КУБИКИ ════ */}
                {tab === 'dice' && (
                    <>
                        <div className="sf-board">
                            <div className="holder" key={`e-${game.id}`}>{game.emoji}</div>
                            <div className="result-box" key={`v-${game.id}`}>
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
                                    {DICE_ITEMS.map(item => (
                                        <div
                                            key={item.type}
                                            className="emoji-item"
                                            onClick={() => playDice(item)}
                                        >
                                            {item.icon}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ════ СЛОТЫ ════ */}
                {tab === 'slots' && (
                    <div className="slot-game">
                        <div className="slot-coins">🪙 {coins}</div>

                        <div className="slot-machine">
                            <div className="slot-window">
                                {reels.map((s, i) => (
                                    <Reel key={i} symbol={s} spinning={spinState[i]} />
                                ))}
                                <div className="payline" />
                            </div>
                            <div className="cabinet-bolts">
                                {[0,1,2,3].map(i => <span key={i} className="bolt" />)}
                            </div>
                        </div>

                        <div className="slot-result">
                            {slotResult === 'jackpot' && <span className="res-jackpot">🎉 ДЖЕКПОТ! +150🪙</span>}
                            {slotResult === 'win'     && <span className="res-win">✨ Выигрыш! +30🪙</span>}
                            {slotResult === 'lose'    && <span className="res-lose">Не повезло... −10🪙</span>}
                        </div>

                        <button
                            className={`slot-btn${running || coins < 10 ? ' disabled' : ''}`}
                            onClick={spinSlots}
                            disabled={running || coins < 10}
                        >
                            {coins < 10 ? 'Монеты кончились 😢' : running ? '⏳ Крутится...' : '🎰 Крутить! (−10🪙)'}
                        </button>

                        {coins < 10 && (
                            <button className="reset-btn" onClick={() => { setCoins(100); setSlotResult(null); }}>
                                Получить монеты 🪙
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* ── Футер ── */}
            <div className="sf-footer">© Yanchik</div>
        </div>
    );
}
