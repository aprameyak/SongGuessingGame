import { useState, useEffect } from 'react';

const MusicSnippet = ({ previewUrl }: { previewUrl: string }) => {
  const [audio] = useState(new Audio(previewUrl));

  useEffect(() => {
    audio.play();
    setTimeout(() => audio.pause(), 5000); // Stop after 5 seconds
  }, [audio]);

  return <p>Guess the song!</p>;
};

export default MusicSnippet;
