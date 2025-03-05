const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const SPOTIFY_PROFILE_URL = 'https://api.spotify.com/v1/me'; // Added missing constant

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  preferences: [String],
  spotifyId: { type: String, unique: true },
  spotifyAccessToken: String,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

userSchema.methods.getTopTracks = async function () {
  const response = await axios.get(SPOTIFY_PROFILE_URL + '/top/tracks', {
    headers: { 'Authorization': `Bearer ${this.spotifyAccessToken}` }
  });
  return response.data.items;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
