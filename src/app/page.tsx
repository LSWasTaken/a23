'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase'; // Firebase import
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

const clickSound = new Audio('/click-sound.mp3'); // Ensure the sound file is in the public folder

const TanzaFightersGame = () => {
    const [score, setScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [scores, setScores] = useState<any[]>([]);
    const [powerUpActive, setPowerUpActive] = useState(false);
    const [powerUpCooldown, setPowerUpCooldown] = useState(false);

    // Handle button click and score increase
    const handleButtonClick = () => {
        let scoreIncrement = 1;

        if (powerUpActive) {
            scoreIncrement = 2; // Double points when power-up is active
        }

        // Special attack logic (every 20th click)
        if (score % 20 === 0 && score > 0) {
            alert('🔥 Special Attack: BONUS SCORE! 🔥');
            scoreIncrement += 5; // Add bonus score
        }

        setScore((prev) => prev + scoreIncrement); // Increment the score
        clickSound.play(); // Play the sound
        setButtonClicked(true); // Trigger button click animation
        setTimeout(() => setButtonClicked(false), 300); // Reset animation

        // Activate power-up after 10 clicks
        if (score + scoreIncrement >= 10 && !powerUpCooldown) {
            setPowerUpActive(true);
            setPowerUpCooldown(true);
            setTimeout(() => setPowerUpActive(false), 5000); // Power-up lasts for 5 seconds
            setTimeout(() => setPowerUpCooldown(false), 10000); // Cooldown for 10 seconds
        }
    };

    // Fetch leaderboard scores from Firestore
    useEffect(() => {
        const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(10));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => doc.data());
            setScores(data);
        });

        return () => unsubscribe();
    }, []);

    // Handle form submission to save score to Firestore
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!playerName) return;

        await addDoc(collection(db, 'scores'), {
            playerName,
            score,
            avatarUrl,
            timestamp: new Date(),
        });

        setPlayerName('');
        setAvatarUrl('');
        setScore(0); // Reset score after submitting
    };

    return (
        <main className="p-6 max-w-xl mx-auto space-y-8 bg-gray-900 text-white">
            <h1 className="text-4xl font-bold text-center text-green-500 sm:text-3xl">⚔️ Tanza Fighters ⚔️</h1>

            {/* Game Start Section */}
            {!isPlaying ? (
                <div className="text-center space-y-4">
                    <button
                        onClick={() => setIsPlaying(true)}
                        className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition w-full sm:w-auto"
                    >
                        Start Fight!
                    </button>
                    <p className="text-xl sm:text-lg">Click to fight and climb the leaderboard!</p>
                </div>
            ) : (
                <div className="space-y-4 text-center">
                    <button
                        onClick={handleButtonClick}
                        className={`bg-blue-500 text-white py-4 px-8 rounded-full hover:bg-blue-600 transition transform w-full sm:w-auto ${buttonClicked ? 'scale-110' : ''}`}
                    >
                        Fight! Click to increase your score
                    </button>
                    <p className="text-xl sm:text-lg">Score: {score}</p>

                    {powerUpActive && (
                        <p className="text-green-500 text-lg">Power-up Active! Double points for 5 seconds!</p>
                    )}
                    {powerUpCooldown && !powerUpActive && (
                        <p className="text-red-500 text-lg">Power-up is on cooldown. Wait for it to recharge!</p>
                    )}
                </div>
            )}

            {/* Leaderboard */}
            <ul className="space-y-3 mt-8">
                {scores.map((score, index) => (
                    <li key={index} className="flex items-center gap-4 bg-white p-3 rounded shadow fade-in-animation">
                        {score.avatarUrl && (
                            <img src={score.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                        )}
                        <div>
                            <p className="font-semibold">{score.playerName}</p>
                            <p className="text-sm text-gray-500">Score: {score.score}</p>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Player Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-8 bg-gray-800 p-4 rounded-lg shadow">
                <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Player name"
                    className="w-full p-2 rounded border"
                    required
                />
                <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="Avatar URL (optional)"
                    className="w-full p-2 rounded border"
                />
                <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                    Submit Score
                </button>
            </form>
        </main>
    );
};

export default TanzaFightersGame;
