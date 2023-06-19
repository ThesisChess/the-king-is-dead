import React, {useCallback, useState} from 'react';
import SpeechRecognition, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
  SpeechStartEvent,
  SpeechEndEvent,
  SpeechVolumeChangeEvent,
} from '@react-native-voice/voice';
import {useEffectOnce} from './use_effect_once';

export interface ISpeechRecognitionCallback {
  onSpeechStart?: (e: SpeechStartEvent) => void;
  onSpeechRecognized?: (e: SpeechRecognizedEvent) => void;
  onSpeechEnd?: (e: SpeechEndEvent) => void;
  onSpeechResults?: (
    e: SpeechResultsEvent,
    partialResults?: SpeechResultsEvent,
  ) => void;
  onSpeechPartialResults?: (e: SpeechResultsEvent) => void;
  onSpeechError?: (e: SpeechErrorEvent) => void;
  onSpeechVolumeChanged?: (e: SpeechVolumeChangeEvent) => void;
}

type IProps = {
  speechVolume?: boolean;
  callbacks?: ISpeechRecognitionCallback;
};

const useVoiceRecognition = ({speechVolume, callbacks}: IProps) => {
  const [isStarted, setIsStarted] = useState<boolean>(false);

  const [started, setStarted] = useState<SpeechStartEvent>();

  const [recognized, setRecognized] = useState<SpeechRecognizedEvent>();

  const [end, setEnd] = useState<SpeechEndEvent>();

  const [results, setResults] = useState<SpeechResultsEvent>();

  const [partialResults, setPartialResults] = useState<SpeechResultsEvent>();

  const [error, setError] = useState<SpeechErrorEvent>();

  const [volume, setVolume] = useState<SpeechVolumeChangeEvent>();

  const onSpeechStart = (e: SpeechStartEvent) => {
    console.log('Error', e);
    setStarted(e);
    callbacks?.onSpeechStart && callbacks.onSpeechStart(e);
  };

  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    setRecognized(e);
  };

  const onSpeechEnd = (e: SpeechEndEvent) => {
    setEnd(e);
    setIsStarted(false);
    callbacks?.onSpeechEnd && callbacks.onSpeechEnd(e);
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    setResults(e);
    callbacks?.onSpeechResults && callbacks.onSpeechResults(e, partialResults);
  };

  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    setPartialResults(e);
    callbacks?.onSpeechPartialResults && callbacks.onSpeechPartialResults(e);
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    setError(e);
    setIsStarted(false);
    callbacks?.onSpeechError && callbacks.onSpeechError(e);
  };

  const onSpeechVolumeChanged = (e: SpeechVolumeChangeEvent) => {
    console.log('Error', e);
    setVolume(e);
    callbacks?.onSpeechVolumeChanged && callbacks.onSpeechVolumeChanged(e);
  };

  const _startRecognizing = useCallback(() => {
    try {
      // _clearState();
      console.log('Test');
      SpeechRecognition.start('en-US')
        .then(() => {
          setIsStarted(true);
        })
        .catch(() => {
          SpeechRecognition.removeAllListeners();
          setIsStarted(false);
        });
    } catch (e) {
      console.error('_startRecognizing', e);
      setIsStarted(false);
    }
  }, []);

  const _stopRecognizing = useCallback(() => {
    try {
      // SpeechRecognition.removeAllListeners();
      // SpeechRecognition.stop();
      SpeechRecognition.destroy()
        .then(() => {
          SpeechRecognition.removeAllListeners();
          setIsStarted(false);
        })
        .catch(() => {
          SpeechRecognition.removeAllListeners();
          setIsStarted(false);
        });
    } catch (e) {
      console.error('_startRecognizing', e);
      setIsStarted(false);
    }
  }, []);

  const _cancelRecognizing = () => {
    try {
      SpeechRecognition.removeAllListeners();
      SpeechRecognition.cancel();

      setIsStarted(false);
    } catch (e) {
      console.error(e);
    }
  };

  const _destroyRecognizer = useCallback(() => {
    try {
      SpeechRecognition.removeAllListeners();
      SpeechRecognition.destroy();

      setIsStarted(false);
    } catch (e) {
      console.error(e);
    }
    _clearState();
  }, []);

  const _clearState = () => {
    setRecognized(undefined);
    setVolume(undefined);
    setError(undefined);
    setEnd(undefined);
    setStarted(undefined);
    setResults(undefined);
    setPartialResults(undefined);
  };

  useEffectOnce(() => {
    SpeechRecognition.onSpeechStart = onSpeechStart;
    SpeechRecognition.onSpeechRecognized = onSpeechRecognized;
    // SpeechRecognition.onSpeechEnd = onSpeechEnd;
    SpeechRecognition.onSpeechResults = onSpeechResults;
    // SpeechRecognition.onSpeechPartialResults = onSpeechPartialResults;
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
  };
};

export default useVoiceRecognition;
