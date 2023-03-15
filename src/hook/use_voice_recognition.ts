import {useEffect, useState} from 'react';
import SpeechRecognition, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
  SpeechStartEvent,
  SpeechEndEvent,
  SpeechVolumeChangeEvent,
} from '@react-native-voice/voice';
import Tts from 'react-native-tts';

export interface ISpeechRecognitionCallback {
  onSpeechStart: (e: SpeechRecognizedEvent) => void;
  onSpeechRecognized: (e: SpeechRecognizedEvent) => void;
  onSpeechEnd: (e: SpeechEndEvent) => void;
  onSpeechResults: (e: SpeechResultsEvent) => void;
  onSpeechPartialResults: (e: SpeechResultsEvent) => void;
  onSpeechError: (e: SpeechErrorEvent) => void;
  onSpeechVolumeChanged: (e: SpeechVolumeChangeEvent) => void;
}

type IProps = {
  speechVolume?: boolean;
};

const useVoiceRecognition = ({speechVolume}: IProps) => {
  const [isStarted, setIsStarted] = useState<boolean>(false);

  const [started, setStarted] = useState<SpeechStartEvent>();

  const [recognized, setRecognized] = useState<SpeechRecognizedEvent>();

  const [end, setEnd] = useState<SpeechEndEvent>();

  const [results, setResults] = useState<SpeechResultsEvent>();

  const [partialResults, setPartialResults] = useState<SpeechResultsEvent>();

  const [error, setError] = useState<SpeechErrorEvent>();

  const [volume, setVolume] = useState<SpeechVolumeChangeEvent>();

  const onSpeechStart = (e: SpeechStartEvent) => {
    setStarted(e);
  };

  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    setRecognized(e);
  };

  const onSpeechEnd = (e: SpeechEndEvent) => {
    setEnd(e);
    console.log('onSpeechEnd', e);
    setIsStarted(false);
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    setResults(e);
    // if (e.value) Tts.speak(e.value?.join(' '));
    console.log('onSpeechResults', e);
  };

  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    setPartialResults(e);
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    setError(e);
  };

  const onSpeechVolumeChanged = (e: SpeechVolumeChangeEvent) => {
    console.log('SpeechVolumeChangeEvent', e);
    setVolume(e);
  };

  const _startRecognizing = async () => {
    _clearState();
    try {
      await SpeechRecognition.start('en-US');
      setIsStarted(true);
      console.log('called start');
    } catch (e) {
      console.error(e);
    }
  };

  const _stopRecognizing = async () => {
    try {
      await SpeechRecognition.stop();
      setIsStarted(false);
    } catch (e) {
      console.error(e);
    }
  };

  const _cancelRecognizing = async () => {
    try {
      await SpeechRecognition.cancel();
      setIsStarted(false);
    } catch (e) {
      console.error(e);
    }
  };

  const _destroyRecognizer = async () => {
    try {
      await SpeechRecognition.destroy();

      SpeechRecognition.removeAllListeners();

      setIsStarted(false);
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

  useEffect(() => {
    SpeechRecognition.onSpeechStart = onSpeechStart;
    SpeechRecognition.onSpeechRecognized = onSpeechRecognized;
    SpeechRecognition.onSpeechEnd = onSpeechEnd;
    SpeechRecognition.onSpeechResults = onSpeechResults;
    SpeechRecognition.onSpeechPartialResults = onSpeechPartialResults;
    SpeechRecognition.onSpeechError = onSpeechError;

    if (speechVolume)
      SpeechRecognition.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      SpeechRecognition.destroy().then(SpeechRecognition.removeAllListeners);
    };
  }, []);

  return {
    recognized,
    isStarted,
    volume,
    error,
    end,
    started,
    results,
    partialResults,
    _startRecognizing,
    _stopRecognizing,
    _cancelRecognizing,
    _destroyRecognizer,
    callbacks: {
      onSpeechRecognized,
      onSpeechEnd,
      onSpeechResults,
      onSpeechPartialResults,
      onSpeechError,
      onSpeechVolumeChanged,
    } as ISpeechRecognitionCallback,
  };
};

export default useVoiceRecognition;
