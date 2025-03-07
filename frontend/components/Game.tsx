import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import MusicSnippet from './MusicSnippet';
import handleGuess from './GuessHandler';
import shuffleArray from '../../backend/utils/shuffleArray';

const Game = ({ songs }: { songs: any[] }) => {
  const [currentSong, setCurrentSong] = useState(0);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleTimeUp = () => {
    alert('⏰ Time is up!');
    setCurrentSong(currentSong + 1);
  };

  const handleUserGuess = (selectedSong: string) => {
    const correctSong = songs[currentSong].name;
    handleGuess(selectedSong, correctSong);
    if (selectedSong === correctSong) {
      setScore(score + 1);
    }
    setCurrentSong(currentSong + 1);
  };

  if (!songs || songs.length === 0) {
    return <p>No songs available</p>;
  }

  if (currentSong >= songs.length) {
    return <p>Game Over! Your score: {score}</p>;
  }

  let choices;
  try {
    choices = shuffleArray([songs[currentSong].name, ...songs.slice(1, 4).map(song => song.name)]);
  } catch (err) {
    setError('Failed to generate choices');
    return <p>{error}</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <MusicSnippet previewUrl={songs[currentSong].preview_url} />
      <Timer onTimeUp={handleTimeUp} />
      {choices.map(choice => (
        <button key={choice} onClick={() => handleUserGuess(choice)}>{choice}</button>
      ))}
    </div>
  );
};

export default Game;
