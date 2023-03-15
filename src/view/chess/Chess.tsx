import React, {useEffect, useRef, useState} from 'react';
import Chessboard, {ChessboardRef} from 'react-native-chessboard';

import useVoiceRecognition from '../../hook/use_voice_recognition';
import Tts from 'react-native-tts';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {styles} from '../../styles/container_style';
import {Text, View} from 'react-native';
import {checker} from '../../utils/move_checker';
import {Button, Header} from '@rneui/themed';
import ChessGameUserDetails from '../../component/user/ChessGameUserDetails';

type IProps = {
  navigation: any;
};

const Chess = ({navigation}: IProps) => {
  const [, setPlayer] = useState<'w' | 'b'>('w');

  const chessboardRef = useRef<ChessboardRef>(null);
  const {
    results,
    isStarted,
    _startRecognizing,
    _stopRecognizing,
    _cancelRecognizing,
    _destroyRecognizer,
  } = useVoiceRecognition({speechVolume: false}); //Voice Command Hook

  const voiceCommandMove = () => {
    if (results)
      // check the voice recognition if not null
      (async () => {
        //Voice Command Hook make the Piece Move Sample to move the piece "d2 to d4"
        const data = checker(results?.value);

        //Correct Move
        if (data.length) {
          if (data.length === 2) {
            const move: any = {
              from: data[0].toLowerCase(),
              to: data[1].toLowerCase(),
            };
            (async () => {
              const moved = await chessboardRef.current?.move(move);
              if (moved) {
                Tts.speak(`${move.from} to ${move.to}`);
                Tts.speak(moved.color === 'w' ? 'Black Turn' : 'White Turn');
              } else Tts.speak(`Invalid Move`);
            })();
          } else {
            // data.map(first => {
            //   data.map(second => {
            //     const move: any = {
            //       from: first.toLowerCase(),
            //       to: second.toLowerCase(),
            //     };
            //     (async () => {
            //       const moved = await chessboardRef.current?.move(move);
            //       console.log('move', move);
            //       if (moved) {
            //         Tts.speak(`${move.from} to ${move.to}`);

            //         Tts.speak(
            //           moved.color === 'w' ? 'Black Turn' : 'White Turn',
            //         );
            //       }
            //     })();
            //   });
            // });
            Tts.speak(`Invalid Move`);
          }
        } else {
          Tts.speak(`Invalid Move`);
        }
      })();
  };

  useEffect(() => {
    Tts.speak(`Play Offline 1 vs 1`);

    return () => {
      Tts.stop();
    };
  }, []);

  useEffect(() => {
    voiceCommandMove();
  }, [results]);

  return (
    <>
      <Header
        style={{alignContent: 'center', alignItems: 'center'}}
        leftComponent={{
          icon: 'home',
          color: '#fff',
          onPress: () => {
            navigation.navigate('Home');
          },
        }}
        rightComponent={{
          icon: 'settings',
          color: '#fff',
          onPress: () => {
            navigation.navigate('Settings');
          },
        }}
        centerComponent={{text: 'Play Offline 1 vs 1', style: {color: '#ffff'}}}
      />
      <GestureHandlerRootView style={styles.container_center_and_middle}>
        <View style={styles.chess_center_and_middle}>
          <View style={{marginBottom: '5%'}}>
            <ChessGameUserDetails
              player="Player 2"
              name="David Dylan"
              image="https://randomuser.me/api/portraits/men/36.jpg"
            />
          </View>
          <Chessboard
            ref={chessboardRef}
            gestureEnabled={true}
            colors={{black: '#f24141', white: '#f4a759'}}
            onMove={({state, move}) => {
              //This function handle the move and state
              if (move.color) setPlayer(move.color === 'b' ? 'w' : 'b');

              if (state.in_checkmate) {
                return Tts.speak(
                  move.color === 'w' ? 'Checkmate Black' : 'Checkmate White',
                );
              }

              if (state.in_check) {
                Tts.speak(move.color === 'w' ? 'Check Black' : 'Check White');
              }

              if (state.in_stalemate) {
                return Tts.speak('Stalemate');
              }

              if (state.in_draw) {
                return Tts.speak('Draw');
              }
            }}
          />
          <View style={{marginTop: '5%'}}>
            <ChessGameUserDetails
              player="Player 1"
              name="Christian Adam"
              image="https://randomuser.me/api/portraits/men/35.jpg"
            />
          </View>
        </View>
        <View style={styles.chess_start_button}>
          <Button
            title="Settings"
            onPress={() => {
              if (!isStarted) {
                (async () => {
                  await _startRecognizing();
                })();
              } else {
                console.log('Test');

                _destroyRecognizer();
                (async () => {
                  await _stopRecognizing();
                  await _cancelRecognizing();
                })();
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
      </GestureHandlerRootView>
    </>
  );
};

export default Chess;
