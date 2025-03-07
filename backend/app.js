const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');
const { getRandomSongs, getUserTopTracks } = require('./spotifyApi');
const User = require('./models/user'); // Changed to lowercase
require('dotenv').config();
const fetch = require('node-fetch');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(express.json());

const mongoUri = process.env.MONGO_URI;
if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
  throw new Error('Invalid MongoDB connection string scheme');
}

mongoose.connect(mongoUri)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/auth', authRoutes);

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send('Unauthorized: No token provided');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send('Unauthorized: Malformed token');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Unauthorized: Invalid token');
    req.userId = decoded.id;
    next();
  });
};

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID || 'your_spotify_client_id',
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET || 'your_spotify_client_secret',
  redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'your_redirect_uri'
});

app.get('/songs', authenticate, async (req, res) => {
  try {
    const songs = await getRandomSongs(req.userId);
    res.send(songs);
  } catch (error) {
    console.error('Error fetching random songs:', error);
    res.status(500).send('Error fetching random songs');
  }
});

app.get('/auth/top-tracks', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    const tracks = await getUserTopTracks(user);
    res.send(tracks);
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    res.status(500).send('Error fetching top tracks');
  }
});

app.get('/game', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const topTracks = await getUserTopTracks(user);
    const randomTrack = topTracks[Math.floor(Math.random() * topTracks.length)];

    const options = [randomTrack];
    while (options.length < 4) {
      const randomOption = topTracks[Math.floor(Math.random() * topTracks.length)];
      if (!options.includes(randomOption)) {
        options.push(randomOption);
      }
    }

    options.sort(() => Math.random() - 0.5);

    res.json({
      songSnippet: randomTrack.preview_url,
      options: options.map(track => track.name)
    });
  } catch (error) {
    console.error('Error fetching game data:', error);
    res.status(500).send('Error fetching game data');
  }
});

app.get('/song', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const topTracks = await getUserTopTracks(user);
    const randomTrack = topTracks[Math.floor(Math.random() * topTracks.length)];

    res.json({ song: randomTrack.name, preview_url: randomTrack.preview_url });
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).send('Error fetching song');
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
