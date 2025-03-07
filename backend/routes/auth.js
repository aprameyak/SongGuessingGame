const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const SpotifyWebApi = require('spotify-web-api-node');
const User = require('../models/user'); // Changed to lowercase

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

router.get('/login', (req, res) => {
  const scopes = ['user-top-read'];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
});

router.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;

    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    const me = await spotifyApi.getMe();
    let user = await User.findOne({ spotifyId: me.body.id });

    if (!user) {
      user = new User({
        spotifyId: me.body.id,
        spotifyAccessToken: access_token,
        refreshToken: refresh_token
      });
      await user.save();
    } else {
      user.spotifyAccessToken = access_token;
      user.refreshToken = refresh_token;
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error during Spotify authentication:', error);
    res.status(500).send('Error during Spotify authentication');
  }
});

module.exports = router;
