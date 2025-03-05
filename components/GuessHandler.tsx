const handleGuess = (selectedSong: string, correctSong: string) => {
  if (selectedSong === correctSong) {
    alert("✅ Correct!");
    // Add points to user
  } else {
    alert(`❌ Wrong! The correct answer was: ${correctSong}`);
  }
};

export default handleGuess;
