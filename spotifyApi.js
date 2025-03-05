const axios = require('axios');
const User = require('./models/user');
require('dotenv').config();

const getSpotifyAccessToken = async () => {
  const response = await axios.post('https://accounts.spotify.com/api/token', 
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
      }
    }
  );
  return response.data.access_token;
};

const getRandomSongs = async (userId) => {
  const user = await User.findById(userId);
  const response = await axios.get('https://api.spotify.com/v1/recommendations', {
    headers: { 'Authorization': `Bearer ${user.spotifyAccessToken}` },
    params: { seed_genres: user.preferences.join(','), limit: 10 }
  });
  return response.data.tracks;
};

const getUserTopTracks = async (userId) => {
  const user = await User.findById(userId);
  const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
    headers: { 'Authorization': `Bearer ${user.spotifyAccessToken}` },
    params: { limit: 10 }
  });
  return response.data.items;
};

module.exports = { getRandomSongs, getUserTopTracks };
