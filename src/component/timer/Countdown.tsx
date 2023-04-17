import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Button} from 'react-native';

interface CountdownProps {
  initialTimeInSeconds: number;
  onComplete: () => void;
}

const Countdown: React.FC<CountdownProps> = ({
  initialTimeInSeconds,
  onComplete,
}) => {
  const [remainingTime, setRemainingTime] = useState(initialTimeInSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemainingTime(prevTime => {
          if (prevTime === 0) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            onComplete();
            return prevTime;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning, onComplete]);

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    clearInterval(intervalRef.current!);
    setIsRunning(false);
    setRemainingTime(initialTimeInSeconds);
  };

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <View>
      <Text>{`${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`}</Text>
      {!isRunning && remainingTime !== initialTimeInSeconds && (
        <Button title="Reset" onPress={handleReset} />
      )}
      {!isRunning && remainingTime === initialTimeInSeconds && (
        <Button title="Start" onPress={handleStart} />
      )}
      {isRunning && <Button title="Stop" onPress={handleStop} />}
    </View>
  );
};

export default Countdown;
