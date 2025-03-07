import React, { useState, useEffect } from 'react';

const Game = () => {
  const [song, setSong] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setGuess(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (guess.toLowerCase() === song.toLowerCase()) {
      setMessage('Correct!');
      setPoints(points + 1);
    } else {
      setMessage('Try again!');
    }
  };

  const startGame = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/song');
      const data = await response.json();
      setSong(data.song);
      setPreviewUrl(data.preview_url);
      setMessage('');
      setGuess('');
    } catch (error) {
      console.error('Error fetching song:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (previewUrl) {
      const audio = new Audio(previewUrl);
      audio.play();
    }
  }, [previewUrl]);

  return (
    <div>
      <h1>Song Guessing Game</h1>
      <button onClick={startGame} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Start Game'}
      </button>
      {song && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={guess}
            onChange={handleInputChange}
            placeholder="Guess the song"
          />
          <button type="submit">Submit</button>
        </form>
      )}
      {message && <p>{message}</p>}
      <p>Points: {points}</p>
    </div>
  );
};

export default Game;
