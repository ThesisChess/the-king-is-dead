import React, {useEffect, useRef, useState} from 'react';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tts from 'react-native-tts';
import useVoiceRecognition from '../../hook/use_voice_recognition';
import firestore from '@react-native-firebase/firestore';

import {Image, TouchableOpacity, View} from 'react-native';
import {Text} from '@rneui/base';
import {IUserRequest} from '../../../config/model/user/user.request';

type IProps = {
  navigation: any;
};

const CreateUser = ({navigation}: IProps) => {
  const [name, setName] = useState<string>();
  const isNameSetRef = useRef<boolean>(false);

  const {isStarted, _startRecognizing, _stopRecognizing} = useVoiceRecognition({
    speechVolume: false,
    callbacks: {
      onSpeechResults: e => {
        if (!isNameSetRef?.current) {
          if (e?.value) {
            console.log('value>>>>>>>>>>', e?.value);

            handleCreate(e?.value[0]);
          }
        } else {
          const res = e?.value?.join(' ');

          if (res?.toLocaleLowerCase().includes('home'))
            navigation.navigate('Home');
        }
      },
    },
  });

  const handleCreate = async (partialResults: string) => {
    try {
      const data = {
        name: partialResults,
        elo_rating: 0,
        is_on_game: false,
        is_online: true,
        created_at: new Date(),
      } as IUserRequest;
      console.log('data>>>>>>>>>>', data);

      const response = await firestore().collection('player').add(data);
      console.log('response>>>>>>>>>>', response);

      _stopRecognizing();

      Tts.speak(`Hello, ${data.name}. Tap the screen to close.`);

      setName(data.name);

      AsyncStorage.setItem(
        '@player',
        JSON.stringify({key: response.id, ...data}),
      );

      isNameSetRef.current = true;
    } catch (error) {
      console.log('handleCreate', error);
    }
  };

  useEffect(() => {
    Tts.speak(
      'Hello, welcome to world of king is dead. Please tap the screen and state your name.',
    );

    return () => {
      Tts.stop();
      _stopRecognizing();
    };
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        if (!name) {
          if (!isStarted) {
            _startRecognizing();
          } else {
            _stopRecognizing();
          }
        } else {
          navigation.navigate('Home');
        }
      }}
      style={{
        flex: 1,
        // backgroundColor: 'red',
        alignContent: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={[
          {
            marginTop: 70,
            margin: 20,
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
            alignItems: 'center',
          }}>
          {!name ? (
            <>
              <Text
                h3
                style={{
                  textAlign: 'center',
                }}>
                Hello, welcome to world of King is Dead.
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                }}>
                Please tap the screen and state your name
              </Text>

              <View
                style={{
                  marginTop: 50,
                  width: 100,
                  height: 100,
                  borderRadius: 100,
                  backgroundColor: 'red',
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
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
              </View>
            </>
          ) : (
            <>
              <Text
                h3
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                }}>
                King Is Dead
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                }}>
                Hello, {name}.
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                }}>
                Tap the screen to close.{' '}
              </Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CreateUser;
