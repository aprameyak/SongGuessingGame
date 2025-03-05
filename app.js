const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');
const { getRandomSongs, getUserTopTracks } = require('./spotifyApi');
const User = require('./models/User'); // Assuming you have a User model
require('dotenv').config();

const app = express();
app.use(express.json());

const mongoUri = process.env.MONGO_URI;
if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
  throw new Error('Invalid MongoDB connection string scheme');
}

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/auth', authRoutes);

const authenticate = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Unauthorized');
    req.userId = decoded.id;
    next();
  });
};

app.get('/songs', authenticate, async (req, res) => {
  const songs = await getRandomSongs(req.userId);
  res.send(songs);
});

app.get('/auth/top-tracks', authenticate, async (req, res) => {
  const user = await User.findById(req.userId);
  const tracks = await getUserTopTracks(user); // Corrected function call
  res.send(tracks);
});

app.listen(3000, () => console.log('Server running on port 3000'));
