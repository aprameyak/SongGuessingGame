const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  username: String,
  score: Number,
  date: { type: Date, default: Date.now },
});

const Score = mongoose.model('Score', scoreSchema);

const saveScore = async (username, score) => {
  const newScore = new Score({ username, score });
  await newScore.save();
};

module.exports = { saveScore, Score };
