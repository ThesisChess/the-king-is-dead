import React, {useEffect, useLayoutEffect, useState} from 'react';
import Tts from 'react-native-tts';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import useVoiceRecognition from '../../hook/use_voice_recognition';

import {Avatar, Button, Header} from '@rneui/themed';
import {Image, Text, View} from 'react-native';
import {styles} from '../../styles/container_style';
import {IUserRequest} from '../../../config/model/user/user.request';
import AsyncStorage from '@react-native-async-storage/async-storage';

type IProps = {
  navigation: any;
};

const Home = ({navigation}: IProps) => {
  const [player, setPlayer] = useState<IUserRequest | undefined>();

  const {isStarted, _startRecognizing, _stopRecognizing} = useVoiceRecognition({
    speechVolume: false,
    callbacks: {
      onSpeechResults: results => {
        const res = results?.value?.join(' ');
        if (res?.toLocaleLowerCase().includes('play online'))
          navigation.navigate('OnlineGame');
        if (res?.toLocaleLowerCase().includes('play offline 1 vs 1'))
          navigation.navigate('OfflineGame');
        if (res?.toLocaleLowerCase().includes('play with AI'))
          navigation.navigate('PlayWithAi');
        if (res?.toLocaleLowerCase().includes('leaderboard'))
          navigation.navigate('Leaderboard');
        if (res?.toLocaleLowerCase().includes('settings'))
          navigation.navigate('Settings');
      },
    },
  }); //Voice Command Hook

  useLayoutEffect(() => {
    AsyncStorage.getItem('@player').then((res: any) => {
      setPlayer(JSON.parse(res));
    });
  }, []);

  useEffect(() => {
    Tts.speak(`Home`);

    return () => {
      Tts.stop();
    };
  }, []);

  useEffect(() => {
    Tts.speak(
      `Please choose from the options: Play Online, Play Offline 1 vs 1, Play with AI, Leaderboard and Settings.`,
    );

    return () => {
      Tts.stop();
    };
  }, []);

  return (
    <>
      <Header
        style={{alignContent: 'center', alignItems: 'center'}}
        leftComponent={
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Avatar
              size={25}
              rounded
              source={
                player?.photo
                  ? {uri: player.photo}
                  : require('../../assets/image/empty.png')
              }
            />
            <Text style={{color: '#fff', marginLeft: 10}}>{player?.name}</Text>
          </View>
        }
        rightComponent={
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Avatar
                size={25}
                rounded
                source={require('../../assets/image/coin.png')}
              />
              <Text style={{color: '#fff', marginLeft: 10}}>
                {player?.elo_rating}
              </Text>
            </View>
          </>
        }
        centerComponent={{text: 'Home', style: {color: '#ffff'}}}
      />
      <View
        style={[
          {
            flex: 1,
            marginTop: 40,
            margin: 20,
            paddingHorizontal: 30,
            alignContent: 'center',
            justifyContent: 'center',
          },
        ]}>
        <View>
          <Image
            style={[
              {
                width: 250,
                height: 250,
                justifyContent: 'center',
                alignSelf: 'center',
              },
            ]}
            source={require('../../assets/image/home_icon.png')}
          />
        </View>

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
            title="Leaderboard"
            onPress={() => navigation.navigate('Leaderboard')}
          />
        </View>
        <View style={{paddingBottom: 10}}>
          <Button
            title="Settings"
            onPress={() => navigation.navigate('Settings')}
          />
        </View>

        <View
          style={[
            styles.chess_start_button,
            {
              flex: 1,
              justifyContent: 'flex-end',
            },
          ]}>
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
              <FontAwesomeIcon
                name="microphone-slash"
                color="white"
                size={40}
              />
            )}
          </Button>

          <Text>{isStarted ? 'Started' : 'Stopped'} </Text>
        </View>
      </View>
    </>
  );
};

export default Home;
