import {useEffect, useRef, useState} from 'react';

interface UseCountdownTimerProps {
  initialTime: number;
  onTimerEnd?: () => void;
}

interface UseCountdownTimerReturn {
  time: string;
  isActive: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

const useCountdownTimer = ({
  initialTime,
  onTimerEnd,
}: UseCountdownTimerProps): UseCountdownTimerReturn => {
  const intervalRef = useRef<any>();

  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  const handleStart = () => setIsRunning(true);

  const handleStop = () => setIsRunning(false);

  const handleReset = () => setTime(initialTime);

  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (time % 60).toString().padStart(2, '0');

  useEffect(() => {}, []);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (time === 0 && onTimerEnd) {
      onTimerEnd();
      setIsRunning(false);
    }
  }, [time]);

  return {
    time: `${minutes}:${seconds}`,
    isActive: isRunning,
    start: handleStart,
    stop: handleStop,
    reset: handleReset,
  };
};

export default useCountdownTimer;
