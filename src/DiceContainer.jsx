import './App.css'
import './DiceContainer.scss'

import { useState } from 'react';

function DiceContainer() {
    const [game, setGame] = useState({
        emoji: '💠',
        value: null,
        id: 0
    });

    const emojis = [
        { icon: '🎲', type: 'dice', min: 1, max: 6 },
        { icon: '🎯', type: 'target', min: 1, max: 12 },
        { icon: '🎰', type: 'slots', min: 1, max: 48 },
        { icon: '🥅', type: 'goal', min: 0, max: 9 },
        { icon: '🏀', type: 'ball', min: 1, max: 3 },
        { icon: '🎳', type: 'bowling', min: 0, max: 6 },
    ];

    const play = (item) => {
        const result = Math.floor(Math.random() * (item.max - item.min + 1)) + item.min;

        setGame({
            emoji: item.icon,
            value: result,
            id: Date.now()
        });
    };

    return (
        <div className={'main-wrapper'}>
            <div className={'sf-board'}>
                {/* Анимация по key заставит эмодзи "прыгать" при каждом клике */}
                <div className={'holder'} key={`emoji-${game.id}`}>
                    {game.emoji}
                </div>

                <div className={'result-box'} key={`res-${game.id}`}>
                    {game.value !== null && (
                        game.value === 0 ? (
                            <span className="zero-text">Упс! Мазила... 🤡</span>
                        ) : (
                            <span className="number">{game.value}</span>
                        )
                    )}
                </div>
            </div>

            <div className={'sf-deck'}>
                <div className={'sizer'}>
                    <div className={'emojis'}>
                        {emojis.map((item) => (
                            <div
                                key={item.type}
                                className={'emoji-item'}
                                onClick={() => play(item)}
                            >
                                {item.icon}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={'sf-footer'}>© Yanchik</div>
        </div>
    );
}

export default DiceContainer
