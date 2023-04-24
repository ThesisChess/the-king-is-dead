import React, {useEffect, useRef, useState} from 'react';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tts from 'react-native-tts';
import useVoiceRecognition from '../../hook/use_voice_recognition';

import {Image, View} from 'react-native';
import {Text} from '@rneui/base';
import {styles} from '../../styles/container_style';
import {Button} from '@rneui/themed';
import {UserFirebaseController} from '../../../config/user.firebase';
import {IUserRequest} from '../../../config/model/user/user.request';
import {SpeechResultsEvent} from '@react-native-voice/voice';

type IProps = {
  navigation: any;
};

const CreateUser = ({navigation}: IProps) => {
  const {createUser} = new UserFirebaseController();

  const [name, setName] = useState<string>();
  const isNameSetRef = useRef<boolean>(false);

  const {isStarted, _startRecognizing, _stopRecognizing} = useVoiceRecognition({
    speechVolume: false,
    callbacks: {
      onSpeechResults: (e, partialResults) => {
        console.log('onSpeechResults', e.value);
        console.log('onSpeechResults', partialResults);
        console.log('onSpeechResults', name);

        if (!isNameSetRef.current) {
          if (e?.value) {
            handleCreate(e?.value[0]);
            isNameSetRef.current = true;
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
      elo_rating: 0,
      is_visually_impaired: true,
      name: partialResults,
      photo: '',
      created_at: new Date(),
    } as IUserRequest;

    await createUser(data).then(async () => {
      setName(data.name);

      await AsyncStorage.setItem('@player', JSON.stringify(data));
    });
  };

  useEffect(() => {
    if (!isNameSetRef.current)
      Tts.speak(
        'Hello, welcome to world of king is dead. Please state your name...',
      );

    return () => {
      Tts.stop();
    };
  }, []);

  useEffect(() => {
    if (isNameSetRef.current)
      Tts.speak(
        `Hello, ${name}. Please say "Home" to begin the game. If you need assistance, please say "Settings" to review how to play King Is Dead`,
      );

    return () => {
      Tts.stop();
    };
  }, [name]);

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
