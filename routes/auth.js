const express = require('express');
const axios = require('axios');
const User = require('../models/User'); // Corrected import
const router = express.Router();
const authenticate = require('../middleware/authenticate'); // Added missing import

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_PROFILE_URL = 'https://api.spotify.com/v1/me';

router.get('/spotify-login', (req, res) => {
  const scopes = 'user-top-read user-read-recently-played';
  const redirectUri = `${process.env.BASE_URL}/auth/spotify-callback`;
  const authUrl = `${SPOTIFY_AUTH_URL}?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  res.redirect(authUrl);
});

router.get('/spotify-callback', async (req, res) => {
  const code = req.query.code;
  const response = await axios.post(SPOTIFY_TOKEN_URL, new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: `${process.env.BASE_URL}/auth/spotify-callback`,
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  const { access_token } = response.data;
  const profileResponse = await axios.get(SPOTIFY_PROFILE_URL, {
    headers: { 'Authorization': `Bearer ${access_token}` }
  });

  const { id, display_name } = profileResponse.data;
  let user = await User.findOne({ spotifyId: id });
  if (!user) {
    user = new User({ spotifyId: id, username: display_name, spotifyAccessToken: access_token });
    await user.save();
  } else {
    user.spotifyAccessToken = access_token;
    await user.save();
  }

  res.send({ token: user.generateToken() });
});

router.get('/top-tracks', authenticate, async (req, res) => {
  const user = await User.findById(req.userId);
  const response = await axios.get(SPOTIFY_PROFILE_URL + '/top/tracks', {
    headers: { 'Authorization': `Bearer ${user.spotifyAccessToken}` }
  });
  res.send(response.data.items);
});

router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ token: user.generateToken() });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(400).send('Invalid credentials');
    }
    res.send({ token: user.generateToken() });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
