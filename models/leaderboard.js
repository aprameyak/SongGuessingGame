const mongoose = require('mongoose'); // Added missing import

const scoreSchema = new mongoose.Schema({
  username: String,
score: Number,
});

const Score = mongoose.model('Score', scoreSchema); // Defined Score model

const getLeaderboard = async () => {
  return await Score.find().sort({ score: -1 }).limit(10);
};

module.exports = getLeaderboard;
