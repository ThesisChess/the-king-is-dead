import React, {useEffect, useRef, useState} from 'react';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tts from 'react-native-tts';
import useVoiceRecognition from '../../hook/use_voice_recognition';
import firestore from '@react-native-firebase/firestore';

import {Image, View} from 'react-native';
import {Text} from '@rneui/base';
import {styles} from '../../styles/container_style';
import {Button} from '@rneui/themed';
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
        if (!isNameSetRef.current) {
          if (e?.value) {
            handleCreate(e?.value[0]).then(() => {
              isNameSetRef.current = true;
            });
          }
        } else {
          const res = e?.value?.join(' ');
          if (res?.toLocaleLowerCase().includes('home'))
            navigation.navigate('Home');

          if (res?.toLocaleLowerCase().includes('settings'))
            navigation.navigate('Settings');
        }
      },
    },
  });

  const handleCreate = async (partialResults: string) => {
    const data = {
      name: partialResults,
      elo_rating: 0,
      is_on_game: false,
      is_online: true,
      created_at: new Date(),
    } as IUserRequest;

    const response = await firestore().collection('player').add(data);

    _stopRecognizing();

    Tts.speak(
      `Hello, ${data.name}. Please say "Home" to begin the game. If you need assistance, please say "Settings" to review how to play King Is Dead`,
    );

    setName(data.name);

    await AsyncStorage.setItem(
      '@player',
      JSON.stringify({key: response.id, ...data}),
    );
  };

  useEffect(() => {
    // if (!isNameSetRef.current)
    Tts.speak(
      'Hello, welcome to world of king is dead. Please state your name...',
    );

    return () => {
      Tts.stop();
      _stopRecognizing();
    };
  }, []);

  // useEffect(() => {
  //   if (isNameSetRef.current)
  //     Tts.speak(
  //       `Hello, ${name}. Please say "Home" to begin the game. If you need assistance, please say "Settings" to review how to play King Is Dead`,
  //     );

  //   return () => {
  //     Tts.stop();
  //     _stopRecognizing();
  //   };
  // }, [isNameSetRef, name]);

  return (
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
              Please state your name...
            </Text>
          </>
        ) : (
          <>
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
              If you need assistance, please say "Settings" to review how to
              play
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
              }}>
              King Is Dead
            </Text>
          </>
        )}
      </View>
      <View style={styles.chess_start_button}>
        <Button
          title="Settings"
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
            <FontAwesomeIcon name="microphone-slash" color="white" size={40} />
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
  );
};

export default CreateUser;
