import React, {useState, useEffect} from 'react';

import SpeechRecognition, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
  SpeechStartEvent,
  SpeechEndEvent,
  SpeechVolumeChangeEvent,
} from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import {View} from 'react-native';

type IProps = {
  children: React.ReactNode;
};

const VoiceRecognition = ({children}: IProps) => {
  const [started, setStarted] = useState<SpeechStartEvent>();

  const [recognized, setRecognized] = useState<SpeechRecognizedEvent>();

  const [end, setEnd] = useState<SpeechEndEvent>();

  const [results, setResults] = useState<SpeechResultsEvent>();

  const [partialResults, setPartialResults] = useState<SpeechResultsEvent>();

  const [error, setError] = useState<SpeechErrorEvent>();

  const [volume, setVolume] = useState<SpeechVolumeChangeEvent>();

  useEffect(() => {
    SpeechRecognition.onSpeechStart = onSpeechStart;
    SpeechRecognition.onSpeechRecognized = onSpeechRecognized;
    SpeechRecognition.onSpeechEnd = onSpeechEnd;
    SpeechRecognition.onSpeechResults = onSpeechResults;
    SpeechRecognition.onSpeechPartialResults = onSpeechPartialResults;
    SpeechRecognition.onSpeechError = onSpeechError;
    SpeechRecognition.onSpeechVolumeChanged = onSpeechVolumeChanged;

    Tts.speak('The king is dead');

    return () => {
      SpeechRecognition.destroy().then(SpeechRecognition.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e: SpeechStartEvent) => {
    setStarted(e);
  };

  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    setRecognized(e);
  };

  const onSpeechEnd = (e: SpeechEndEvent) => {
    setEnd(e);
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    setResults(e);
  };

  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    setPartialResults(e);
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    setError(e);
  };

  const onSpeechVolumeChanged = (e: SpeechVolumeChangeEvent) => {
    setVolume(e);
  };

  const _startRecognizing = async () => {
    _clearState();
    try {
      await SpeechRecognition.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  const _stopRecognizing = async () => {
    try {
      await SpeechRecognition.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const _cancelRecognizing = async () => {
    try {
      await SpeechRecognition.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const _destroyRecognizer = async () => {
    try {
      await SpeechRecognition.destroy();
    } catch (e) {
      console.error(e);
    }
    _clearState();
  };

  const _clearState = () => {
    setRecognized(undefined);
    setVolume(undefined);
    setError(undefined);
    setEnd(undefined);
    setStarted(undefined);
    setResults(undefined);
    setPartialResults(undefined);
  };

  return <View>{children}</View>;
};

export default VoiceRecognition;
