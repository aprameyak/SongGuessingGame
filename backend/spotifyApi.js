const axios = require('axios');
const express = require('express');
const User = require('./models/user');
require('dotenv').config();
const { getRandomSongs, getUserTopTracks } = require('./spotifyApi');

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/random-songs/:userId', async (req, res) => {
  try {
    const songs = await getRandomSongs(req.params.userId);
    res.json(songs);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/api/top-tracks/:userId', async (req, res) => {
  try {
    const tracks = await getUserTopTracks(req.params.userId);
    res.json(tracks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { getRandomSongs, getUserTopTracks };
