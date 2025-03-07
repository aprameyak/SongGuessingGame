import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Game from '../components/Game';

const IndexPage = () => {
  const [songs, setSongs] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  const startGame = async () => {
    try {
      setIsLoading(true); // Set loading to true when starting the game
      const response = await axios.get('/auth/top-tracks', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setSongs(response.data);
      setIsGameStarted(true);
    } catch (err) {
      setError('Failed to start game');
    } finally {
      setIsLoading(false); // Set loading to false after the request is done
    }
  };

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setIsLoading(true); // Set loading to true when fetching songs
        const response = await axios.get('/songs', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setSongs(response.data);
      } catch (err) {
        setError('Failed to fetch songs');
      } finally {
        setIsLoading(false); // Set loading to false after the request is done
      }
    };
    fetchSongs();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>; // Display loading message
  }

  if (!isGameStarted) {
    return <button onClick={startGame}>Start Game</button>;
  }

  if (songs.length === 0) {
    return <p>No songs available</p>; // Handle case where no songs are fetched
  }

  return <Game songs={songs} />;
};

export default IndexPage;
