import { useState, useEffect } from 'react';

const Timer = ({ onTimeUp }: { onTimeUp: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  return <p>⏳ Time Left: {timeLeft}s</p>;
};

export default Timer;
