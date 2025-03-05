import { useEffect, useState } from 'react';
import axios from 'axios';
import Game from '../components/Game';

const IndexPage = () => {
  const [songs, setSongs] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [error, setError] = useState(null);

  const startGame = async () => {
    try {
      const response = await axios.get('/auth/top-tracks', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setSongs(response.data);
      setIsGameStarted(true);
    } catch (err) {
      setError('Failed to start game');
    }
  };

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('/songs', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setSongs(response.data);
      } catch (err) {
        setError('Failed to fetch songs');
      }
    };
    fetchSongs();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!isGameStarted) {
    return <button onClick={startGame}>Start Game</button>;
  }

  if (songs.length === 0) {
    return <p>Loading...</p>;
  }

  return <Game songs={songs} />;
};

export default IndexPage;
