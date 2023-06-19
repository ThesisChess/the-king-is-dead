import React, {useEffect} from 'react';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Tts from 'react-native-tts';

import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {howToPlayList} from '../../utils/howToPlay';
import {Button, Header} from '@rneui/themed';
import {styles} from '../../styles/container_style';
import useVoiceRecognition from '../../hook/use_voice_recognition';

type IProps = {
  navigation: any;
};

const HowToPlayView = ({navigation}: IProps) => {
  const {isStarted, _startRecognizing, _stopRecognizing} = useVoiceRecognition({
    speechVolume: false,
    callbacks: {
      onSpeechResults: e => {
        const res = e?.value?.join(' ').toLowerCase();

        if (res?.toLocaleLowerCase().includes('Back'.toLowerCase())) {
          Tts.speak(` Back to Home`);

          setTimeout(() => {
            navigation.goBack();
          }, 1000);
        }
      },
    },
  });

  useEffect(() => {
    Tts.speak('How to play king is dead');

    Tts.speak('Tap the screen to close how to play king is dead');

    howToPlayList.map(x => {
      Tts.speak(x.title);

      x.text.map((text, index) => {
        Tts.speak(`${index + 1}. ${text}`);
      });
    });

    return () => {
      Tts.stop();
    };
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Home');
      }}>
      <Header
        style={{alignContent: 'center', alignItems: 'center'}}
        leftComponent={{
          icon: 'home',
          color: '#fff',
          onPress: () => {
            navigation.navigate('Home');
          },
        }}
        centerComponent={{
          text: 'HOW TO PLAY KING IS DEAD',
          style: {color: '#ffff'},
        }}
      />
      <SafeAreaView
        style={{
          marginTop: 20,
          marginBottom: 20,
        }}>
        <View>
          <Text style={{textAlign: 'center'}}>HOW TO PLAY KING IS DEAD</Text>
        </View>
        <ScrollView>
          <View
            style={{
              margin: 20,
              marginBottom: '30%',
            }}>
            {howToPlayList.map((x, titleIndex) => {
              return (
                <React.Fragment key={`title-${titleIndex}`}>
                  <View
                    style={{
                      marginTop: 10,
                    }}>
                    <Text style={{fontWeight: 'bold'}}>{x.title}</Text>
                  </View>
                  {x.text.map((text, index) => (
                    <View key={`text-${index}`}>
                      <Text>
                        {index + 1}. {text}
                      </Text>
                    </View>
                  ))}
                </React.Fragment>
              );
            })}
          </View>
        </ScrollView>
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
              <FontAwesomeIcon
                name="microphone-slash"
                color="white"
                size={40}
              />
            )}
          </Button>

          <Text>{isStarted ? 'Started' : 'Stopped'} </Text>
        </View>
      </SafeAreaView>
    </TouchableOpacity>
  );
};

export default HowToPlayView;
