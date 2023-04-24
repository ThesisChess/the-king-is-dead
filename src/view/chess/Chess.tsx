import React, {memo, useCallback, useEffect, useRef, useState} from 'react';

import useVoiceRecognition from '../../hook/use_voice_recognition';
import Tts from 'react-native-tts';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import ChessboardContainer, {ChessboardRef} from '../../component/chess';
import ChessGameUserDetails from '../../component/user/ChessGameUserDetails';
import Modal from 'react-native-modal/dist/modal';
import SelectMode from '../../component/chess/SelectMode';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {styles} from '../../styles/container_style';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {checker} from '../../utils/move_checker';
import {Button, CheckBox, Header} from '@rneui/themed';
import {pieces} from '../../utils/piece';

type IProps = {
  navigation: any;
};

const Chess = ({navigation}: IProps) => {
  const countdownRefPlayer1 = useRef<any>(null);
  const countdownRefPlayer2 = useRef<any>(null);

  const [player, setPlayer] = useState<'w' | 'b' | undefined>(undefined); //state for player type
  const [visibleMode, selectVisibleMode] = useState<boolean>(true); //select mode visibility
  const [onEndGame, selectOnEndGame] = useState<{
    isGameEnd: boolean;
    isWinner?: 'w' | 'b';
    message?: string;
  }>({isGameEnd: false}); //select mode visibility

  const [gameOrientation, setGameOrientation] = useState(false);

  const [playerPosition, setPlayerPosition] = useState<
    {
      color: 'w' | 'b';
      position: 'top' | 'bottom';
    }[]
  >();

  const chessboardRef = useRef<ChessboardRef>(null);
  const {isStarted, _startRecognizing, _stopRecognizing} = useVoiceRecognition({
    speechVolume: false,
    callbacks: {
      onSpeechResults: e => {
        voiceCommandMove(e);
      },
    },
  }); //Voice Command Hook

  const voiceCommandMove = (results: any) => {
    _stopRecognizing();

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
            data.map(first => {
              data.map(second => {
                const move: any = {
                  from: first.toLowerCase(),
                  to: second.toLowerCase(),
                };
                (async () => {
                  const moved = await chessboardRef.current?.move(move);
                  console.log('move', move);
                  if (moved) {
                    Tts.speak(`${move.from} to ${move.to}`);

                    Tts.speak(
                      moved.color === 'w' ? 'Black Turn' : 'White Turn',
                    );
                  }
                })();
              });
            });
            // Tts.speak(`Invalid Move`);
          }
        } else {
          Tts.speak(`Invalid Move`);
        }
      })();
  };

  const handleOnEndTime = (position: 'top' | 'bottom') => {
    const result = playerPosition?.find(
      x => x.position.toLocaleLowerCase() === position.toLocaleLowerCase(),
    );

    console.log('handleOnEndTime', result);

    if (result)
      selectOnEndGame({
        isGameEnd: true,
        isWinner: result?.color,
        message: 'King is Dead',
      });
  };

  useEffect(() => {
    Tts.speak(`Play Offline 1 vs 1`);

    return () => {
      Tts.stop();
    };
  }, []);

  useEffect(() => {
    if (onEndGame.isGameEnd) {
      if (onEndGame?.message) Tts.speak(onEndGame?.message);
      Tts.speak(`Press the screen to close the game`);
    }

    return () => {
      Tts.stop();
    };
  }, [onEndGame.isGameEnd]);

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
              let newVal: any = undefined;

              if (val === 'Random') {
                // Random Picker for player type
                let playerType = ['White', 'Black'];

                const randomIdx = Math.floor(Math.random() * playerType.length);
                const type = playerType[randomIdx];

                newVal = type;
              }

              const result: any = ['w', 'b'].map((x: any) => {
                return {
                  color: x,
                  position:
                    newVal?.charAt(0)?.toLowerCase() === x ||
                    val?.charAt(0)?.toLowerCase() === x
                      ? 'bottom'
                      : 'top',
                };
              });

              setPlayerPosition(result);
              setPlayer(newVal === 'White' || val === 'White' ? 'w' : 'b');
              selectVisibleMode(false);
            }}
            onCancel={() => {
              navigation.goBack();
            }}>
            {/* <CheckBox
              checked={gameOrientation}
              onPress={() => {
                setGameOrientation(!gameOrientation);
              }}
              title="Game Orientation on move"
              iconType="material-community"
              checkedIcon="checkbox-marked"
              uncheckedIcon="checkbox-blank-outline"
              checkedColor="red"
            /> */}
          </SelectMode>
        </SafeAreaView>
      </Modal>

      <Modal isVisible={onEndGame.isGameEnd}>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
          }}
          onPress={() => {
            navigation.navigate('Home');
          }}>
          <Image
            style={[
              {
                width: 250,
                height: 250,
                justifyContent: 'center',
                alignSelf: 'center',
              },
            ]}
            source={require('../../assets/image/game-over-icon.png')}
          />
          <View>
            <Text style={{textAlign: 'center', color: '#ffff', fontSize: 20}}>
              {onEndGame.message}
            </Text>
          </View>
          <View>
            <Text style={{textAlign: 'center', color: '#ffff'}}>
              Press the screen to close the game
            </Text>
          </View>
        </TouchableOpacity>
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
        centerComponent={{text: 'Play Offline 1 vs 1', style: {color: '#ffff'}}}
      />
      <GestureHandlerRootView style={styles.container_center_and_middle}>
        <View style={styles.chess_center_and_middle}>
          <View style={{marginBottom: '5%'}}>
            <ChessGameUserDetails
              ref={countdownRefPlayer2}
              seconds={300}
              player="Player 2"
              name="Player"
              onEnd={() => {
                handleOnEndTime('top');
              }}
            />
          </View>
          <ChessboardContainer
            ref={chessboardRef}
            gestureEnabled={true}
            orientation={player}
            colors={{black: '#f24141', white: '#f4a759'}}
            onMove={({state, move}) => {
              const index = playerPosition?.findIndex(
                x => x.color === move.color,
              );

              const pieceType = pieces.find(x => x.key === move.piece);
              console.log(move);

              if (move.captured) {
                const pieceCapturedType = pieces.find(
                  x => x.key === move.captured,
                );
                Tts.speak(
                  `${pieceType?.type} ${
                    move.color === 'w' ? 'white' : 'black'
                  } captured ${pieceCapturedType?.type} ${
                    move.color !== 'w' ? 'white' : 'black'
                  }`,
                );
              } else {
                Tts.speak(
                  `${pieceType?.type} ${
                    move.color === 'w' ? 'white' : 'black'
                  } move to ${move.to}`,
                );
              }

              if (playerPosition) {
                if (index != undefined && index >= 0) {
                  const data = playerPosition[index];

                  if (data.position === 'top') {
                    countdownRefPlayer1.current.resume();
                    countdownRefPlayer2.current.pause();
                  } else {
                    console.log('bottom');
                    countdownRefPlayer2.current.resume();
                    countdownRefPlayer1.current.pause();
                  }
                }
              }

              if (gameOrientation)
                if (move.color) setPlayer(move.color === 'b' ? 'w' : 'b');

              if (state.isCheckmate) {
                return selectOnEndGame({
                  isGameEnd: true,
                  isWinner: move.color,
                  message:
                    move.color === 'w' ? 'Checkmate Black' : 'Checkmate White',
                });
              }

              if (state.inCheck) {
                return Tts.speak(
                  move.color === 'w' ? 'Check Black' : 'Check White',
                );
              }

              if (state.isStalemate) {
                return selectOnEndGame({
                  isGameEnd: true,
                  isWinner: move.color,
                  message: 'Stalemate',
                });
              }

              if (state.isDraw) {
                return selectOnEndGame({
                  isGameEnd: true,
                  isWinner: move.color,
                  message: 'Draw',
                });
              }
            }}
          />
          <View style={{marginTop: '5%'}}>
            <ChessGameUserDetails
              ref={countdownRefPlayer1}
              seconds={300}
              player="Player 1"
              name="Player"
              onEnd={() => {
                handleOnEndTime('top');
              }}
            />
          </View>
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

export default memo(Chess);
