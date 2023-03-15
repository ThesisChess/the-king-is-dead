import React, {useEffect} from 'react';
import Tts from 'react-native-tts';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import useVoiceRecognition from '../../hook/use_voice_recognition';

import {Button} from '@rneui/themed';
import {Image, View} from 'react-native';

type IProps = {
  navigation: any;
};

const Home = ({navigation}: IProps) => {
  const {
    results,
    isStarted,
    _startRecognizing,
    _stopRecognizing,
    _cancelRecognizing,
    _destroyRecognizer,
  } = useVoiceRecognition({speechVolume: true});

  useEffect(() => {
    Tts.speak(`Home`);

    return () => {
      Tts.stop();
    };
  }, []);

  useEffect(() => {
    Tts.speak(
      `Please choose from the options: Play Online, Play Offline 1 vs 1, Play with AI, and Settings.`,
    );

    setTimeout(() => {
      _startRecognizing();
    }, 3000);

    return () => {
      Tts.stop();
      _stopRecognizing();
      _cancelRecognizing();
      _destroyRecognizer();
    };
  }, []);

  return (
    <>
      <View
        style={[
          {
            flex: 1,
            margin: 20,
            alignContent: 'center',
            justifyContent: 'center',
          },
        ]}>
        <View>
          <Image
            style={[
              {
                width: 350,
                height: 350,
                justifyContent: 'center',
                alignSelf: 'center',
              },
            ]}
            source={require('../../assets/image/home_icon.png')}
          />
        </View>
        {isStarted ? (
          <FontAwesomeIcon name="microphone" color="white" size={40} />
        ) : (
          <FontAwesomeIcon name="microphone-slash" color="white" size={40} />
        )}
        <View style={{paddingBottom: 10}}>
          <Button
            title="Play Online"
            onPress={() => navigation.navigate('OnlineGame')}
          />
        </View>
        <View style={{paddingBottom: 10}}>
          <Button
            title="Play Offline 1 vs 1"
            onPress={() => navigation.navigate('OfflineGame')}
          />
        </View>
        <View style={{paddingBottom: 10}}>
          <Button
            title="Play with AI"
            onPress={() => navigation.navigate('PlayWithAi')}
          />
        </View>
        <View style={{paddingBottom: 10}}>
          <Button
            title="Settings"
            onPress={() => navigation.navigate('Settings')}
          />
        </View>
      </View>
    </>
  );
};

export default Home;
