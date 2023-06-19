import React, {useEffect, useState} from 'react';

import useVoiceRecognition from '../../hook/use_voice_recognition';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {Image, View} from 'react-native';
import {styles} from '../../styles/container_style';
import {Button, Text} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
type IProps = {
  navigation: any;
};

const UserDetails = ({navigation}: IProps) => {
  const [name, setName] = useState<string>();

  const {isStarted, _startRecognizing, _stopRecognizing} = useVoiceRecognition({
    speechVolume: false,
    callbacks: {
      onSpeechResults: e => {
        console.log('onSpeechResults', e.value);
        const res = e?.value?.join(' ');
        if (res?.toLocaleLowerCase().includes('home'))
          navigation.navigate('Home');

        // if (res?.toLocaleLowerCase().includes('settings'))
        //   navigation.navigate('Settings');
      },
    },
  }); //Voice Command Hook

  useEffect(() => {
    (async () => {
      const response = await AsyncStorage.getItem('@player');
      if (response) setName(response);
    })();
  }, []);

  return (
    <>
      <View
        style={[
          {
            flex: 1,
            marginTop: 70,
            margin: 20,
            alignContent: 'center',
            justifyContent: 'center',
          },
        ]}>
        <Image
          style={[
            {
              width: 250,
              height: 250,
              justifyContent: 'center',
              alignSelf: 'center',
            },
          ]}
          source={require('../../assets/image/chess-pieces-group.png')}
        />

        <View
          style={{
            marginVertical: 40,
          }}>
          <Text
            h3
            style={{
              textAlign: 'center',
            }}>
            Hello, {name}.
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
            }}>
            Please say "Home" to begin the game.
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
            }}>
            If you need assistance, please say "Settings" to review how to play
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
            }}>
            King Is Dead
          </Text>
        </View>
        <View style={styles.chess_start_button}>
          <Button
            // title="Settings"
            onPress={() => {
              if (!isStarted) {
                _startRecognizing();
              } else {
                _stopRecognizing();
              }
            }}
            buttonStyle={{
              width: 100,
              height: 100,
              borderRadius: 100,
            }}>
            {isStarted ? (
              <FontAwesomeIcon name="microphone" color="white" size={40} />
            ) : (
              <FontAwesomeIcon
                name="microphone-slash"
                color="white"
                size={40}
              />
            )}
          </Button>

          <Text>{isStarted ? 'Started' : 'Stopped'} </Text>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <Button
            title="Close"
            type="outline"
            size="lg"
            onPress={() => navigation.navigate('Home')}
          />
        </View>
      </View>
    </>
  );
};
export default UserDetails;
