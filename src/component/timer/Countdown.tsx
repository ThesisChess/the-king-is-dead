import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {StyleProp, Text, TextStyle, View, ViewStyle} from 'react-native';

export type CountdownProps = {
  seconds: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onEnd: () => void;
};

type CountdownRef = {
  resume: () => void;
  pause: () => void;
};

const Countdown = forwardRef<CountdownRef, CountdownProps>(
  ({seconds, style, textStyle, onEnd}: CountdownProps, ref) => {
    const [timeLeft, setTimeLeft] = useState(seconds);
    const [paused, setPaused] = useState(false);
    const [start, setStart] = useState(false);
    const [ended, setEnded] = useState(false); // new state variable
    const intervalRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
      if (timeLeft <= 0 && !ended) {
        // check if countdown has not already ended
        clearInterval(intervalRef.current!);
        setEnded(true); // mark countdown as ended
        onEnd();
      }
    }, [timeLeft, onEnd, ended]);

    useEffect(() => {
      if (start) {
        intervalRef.current = setInterval(() => {
          if (!paused) {
            setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
          }
        }, 1000);
      }

      return () => clearInterval(intervalRef.current!);
    }, [start, paused]);

    useImperativeHandle(ref, () => ({
      resume: () => {
        setPaused(false);
        setStart(true);
      },
      pause: () => {
        setPaused(true);
      },
    }));

    const getFormattedTime = (time: number) => {
      const minutes = Math.floor(time / 60)
        .toString()
        .padStart(2, '0');
      const seconds = (time % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    };

    return (
      <View style={style}>
        <Text style={textStyle}>{getFormattedTime(timeLeft)}</Text>
      </View>
    );
  },
);

export default Countdown;
