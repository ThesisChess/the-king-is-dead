import React, {useEffect, useRef, useState} from 'react';
import Chessboard, {ChessboardRef} from 'react-native-chessboard';

import randomMove from '../../common/ai/random_move';
import Tts from 'react-native-tts';
import Modal from 'react-native-modal/dist/modal';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import SelectMode from '../../component/chess/SelectMode';
import ChessGameUserDetails from '../../component/user/ChessGameUserDetails';
import useVoiceRecognition from '../../hook/use_voice_recognition';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {styles} from '../../styles/container_style';
import {SafeAreaView, Text, View} from 'react-native';
import {Button, Header} from '@rneui/themed';
import {checker} from '../../utils/move_checker';

type IProps = {
  navigation: any;
};

const ChessPlayWithAi = ({navigation}: IProps) => {
  const [player, setPlayer] = useState<'w' | 'b' | undefined>(undefined); //state for player type
  const [visibleMode, selectVisibleMode] = useState<boolean>(true); //select mode visibility

  const chessboardRef = useRef<ChessboardRef>(null);

  const randomAiMove = (fen: string) => {
    //handle the move randomly
    (async () => {
      //function that give the random move
      const data = await randomMove(fen);

      //handle the piece to move
      await chessboardRef.current?.move({
        from: data.from.toLowerCase(),
        to: data.to.toLowerCase(),
      } as any);
    })();
  };

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
    Tts.speak(`Play With AI`);

    return () => {
      Tts.stop();
    };
  }, []);

  useEffect(() => {
    voiceCommandMove();
  }, [results]);
  return (
    <>
      <Modal isVisible={visibleMode}>
        <SafeAreaView
          style={{
            alignItems: 'center',
            backgroundColor: '#ffff',
            borderRadius: 10,
            padding: 20,
          }}>
          <SelectMode
            onSubmit={val => {
              //function on select of the player type

              let newVal = undefined;

              if (val === 'Random') {
                // Random Picker for player type
                let playerType = ['White', 'Black'];

                const randomIdx = Math.floor(Math.random() * playerType.length);
                const type = playerType[randomIdx];

                newVal = type;
              }

              if ((newVal && newVal === 'Black') || val === 'Black')
                // checker if the ai is the white so that the white do the first move
                randomAiMove(
                  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                );

              setPlayer(newVal === 'White' || val === 'White' ? 'w' : 'b');
              selectVisibleMode(false);
            }}
          />
        </SafeAreaView>
      </Modal>
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
        centerComponent={{text: 'Play with AI', style: {color: '#ffff'}}}
      />
      <GestureHandlerRootView
        style={[
          styles.container_center_and_middle,
          {transform: [{rotate: player === 'b' ? '180deg' : '360deg'}]},
        ]}>
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
            durations={{move: 500}}
            colors={{black: '#f24141', white: '#f4a759'}}
            onMove={val => {
              //This function handle the move and state
              if (val.state.in_checkmate) {
                return Tts.speak(
                  val.move.color === 'w'
                    ? 'Checkmate Black'
                    : 'Checkmate White',
                );
              }

              if (val.state.in_check) {
                Tts.speak(
                  val.move.color === 'w' ? 'Check Black' : 'Check White',
                );
              }

              if (val.state.in_stalemate) {
                return Tts.speak('Stalemate');
              }

              if (val.state.in_draw) {
                return Tts.speak('Draw');
              }

              if (player && val.move.color === player) {
                randomAiMove(val.state.fen);
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

export default ChessPlayWithAi;
