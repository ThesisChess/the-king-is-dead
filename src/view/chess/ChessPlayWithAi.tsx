import React, {useEffect, useRef, useState} from 'react';

import randomMove from '../../common/ai/random_move';
import Tts from 'react-native-tts';
import Modal from 'react-native-modal/dist/modal';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import SelectMode from '../../component/chess/SelectMode';
import ChessGameUserDetails from '../../component/user/ChessGameUserDetails';
import useVoiceRecognition from '../../hook/use_voice_recognition';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {styles} from '../../styles/container_style';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {Button, Header} from '@rneui/themed';
import {checker} from '../../utils/move_checker';
import ChessboardContainer, {ChessboardRef} from '../../component/chess';
import {pieces} from '../../utils/piece';
import {Move} from 'chess.ts';

type IProps = {
  navigation: any;
};

const ChessPlayWithAi = ({navigation}: IProps) => {
  const countdownRefPlayer1 = useRef<any>(null);
  const countdownRefPlayer2 = useRef<any>(null);
  const visibleRef = useRef<any>(true);

  const [playerPosition, setPlayerPosition] = useState<
    {
      color: 'w' | 'b';
      position: 'top' | 'bottom';
    }[]
  >();

  const [onEndGame, selectOnEndGame] = useState<{
    isGameEnd: boolean;
    isWinner?: 'w' | 'b';
    message?: string;
  }>({isGameEnd: false}); //select mode visibility

  const [player, setPlayer] = useState<'w' | 'b' | undefined>(undefined); //state for player type
  const [visibleMode, selectVisibleMode] = useState<boolean>(true); //select mode visibility

  const chessboardRef = useRef<ChessboardRef>(null);

  const {isStarted, _startRecognizing, _stopRecognizing} = useVoiceRecognition({
    speechVolume: false,
    callbacks: {
      onSpeechResults: e => {
        const res = e?.value?.join(' ').toLowerCase();

        console.log(e);

        if (res?.toLocaleLowerCase().includes('Quit'.toLowerCase())) {
          Tts.speak(`Quit Game`);

          setTimeout(() => {
            navigation.goBack();
          }, 1000);
        }

        if (visibleRef.current) {
          if (res?.toLocaleLowerCase().includes('Random'.toLowerCase())) {
            selectModeColor('Random');
            Tts.speak(`Random`);
          }
          if (res?.toLocaleLowerCase().includes('Black'.toLowerCase())) {
            selectModeColor('Black');
            Tts.speak(`Black`);
          }
          if (res?.toLocaleLowerCase().includes('White'.toLowerCase())) {
            selectModeColor('White');
            Tts.speak(`White`);
          }

          if (res?.toLocaleLowerCase().includes('Cancel'.toLowerCase())) {
            navigation.goBack();
          }

          _stopRecognizing();
        } else voiceCommandMove(e); // Voice Command in Move
      },
    },
  }); //Voice Command Hook

  const randomAiMove = (fen: string) => {
    //handle the move randomly
    (async () => {
      //function that give the random move
      const data = await randomMove(fen);

      //handle the piece to move
      setTimeout(async () => {
        const result = await chessboardRef.current?.move({
          from: data.from.toLowerCase(),
          to: data.to.toLowerCase(),
        } as any);
      }, 1500);
    })();
  };

  const selectModeColor = (val: string) => {
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

    visibleRef.current = false;

    Tts.speak('Game Has Starter');

    // position of the player if top or bottom
    result?.map((x: any) => {
      if (x.position === 'bottom') {
        Tts.speak(`
      Player 1 ${x.color === 'w' ? 'White' : 'Black'} pieces`);
      } else {
        Tts.speak(`
      AI ${x.color === 'w' ? 'White' : 'Black'} pieces`);
      }
    });

    // position of the player if top or bottom
    const findPlayerPosition = result.find((x: any) => x.color === 'w');

    if (findPlayerPosition)
      Tts.speak(
        `${
          findPlayerPosition?.position === 'bottom' ? 'Player 1' : 'AI'
        } make the first move`,
      );

    setTimeout(() => {
      //AI First Move if AI is White
      if ((newVal && newVal === 'Black') || val === 'Black')
        // checker if the ai is the white so that the white do the first move
        randomAiMove(
          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        );
    }, 6000);
  };

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
                  if (moved) {
                    Tts.speak(`${move.from} to ${move.to}`);

                    Tts.speak(
                      moved.color === 'w' ? 'Black Turn' : 'White Turn',
                    );
                  }
                })();
              });
            });
            Tts.speak(`Invalid Move`);
          }
        }
      })();
  };

  const handleOnEndTime = (position: 'top' | 'bottom') => {
    const result = playerPosition?.find(
      x => x.position.toLocaleLowerCase() === position.toLocaleLowerCase(),
    );

    if (result)
      selectOnEndGame({
        isGameEnd: true,
        isWinner: result?.color,
        message: 'King is Dead',
      });
  };
  useEffect(() => {
    Tts.speak(`Play With AI`);

    return () => {
      Tts.stop();
      _stopRecognizing();
    };
  }, []);

  useEffect(() => {
    if (onEndGame.isGameEnd) {
      if (onEndGame?.message) Tts.speak(onEndGame?.message);
      Tts.speak(`Press the screen to close the game`);
    }

    return () => {
      Tts.stop();
      _stopRecognizing();
    };
  }, [onEndGame.isGameEnd]);

  useEffect(() => {
    if (visibleRef.current) {
      Tts.speak(`Choose from the following modes: White, Random, and Black.`);
    }

    return () => {
      Tts.stop();
      _stopRecognizing();
    };
  }, []);

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
              selectModeColor(val);
            }}
            onCancel={() => {
              navigation.navigate('Home');
            }}
          />

          <View style={[styles.chess_start_button, {paddingTop: 20}]}>
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
        // rightComponent={{
        //   icon: 'settings',
        //   color: '#fff',
        //   onPress: () => {
        //     navigation.navigate('Settings');
        //   },
        // }}
        centerComponent={{text: 'Play with AI', style: {color: '#ffff'}}}
      />
      <GestureHandlerRootView style={[styles.container_center_and_middle]}>
        <View style={styles.chess_center_and_middle}>
          <View style={{marginBottom: '5%'}}>
            <ChessGameUserDetails
              ref={countdownRefPlayer2}
              seconds={900}
              player="AI"
              name="Computer"
              image={require('../../assets/image/robot.png')}
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
            onMove={val => {
              //This function handle the move and state
              const index = playerPosition?.findIndex(
                x => x.color === val.move.color,
              );

              const pieceType = pieces.find(x => x.key === val.move.piece);

              if (val.move.captured) {
                const pieceCapturedType = pieces.find(
                  x => x.key === val.move.captured,
                );
                Tts.speak(
                  `${pieceType?.type} ${
                    val.move.color === 'w' ? 'white' : 'black'
                  } captured ${pieceCapturedType?.type} ${
                    val.move.color !== 'w' ? 'white' : 'black'
                  }`,
                );
              } else {
                Tts.speak(
                  `${pieceType?.type} ${
                    val.move.color === 'w' ? 'white' : 'black'
                  } move to ${val.move.to}`,
                );
              }

              if (playerPosition) {
                if (index != undefined && index >= 0) {
                  const data = playerPosition[index];

                  if (data.position === 'top') {
                    countdownRefPlayer1.current.resume();
                    countdownRefPlayer2.current.pause();
                  } else {
                    countdownRefPlayer2.current.resume();
                    countdownRefPlayer1.current.pause();
                  }
                }
              }

              if (val.state.isCheckmate) {
                return selectOnEndGame({
                  isGameEnd: true,
                  isWinner: val.move.color,
                  message:
                    val.move.color === 'w'
                      ? 'Checkmate Black'
                      : 'Checkmate White',
                });
              }

              if (val.state.isStalemate) {
                return selectOnEndGame({
                  isGameEnd: true,
                  isWinner: val.move.color,
                  message: 'Stalemate',
                });
              }

              if (val.state.isDraw) {
                return selectOnEndGame({
                  isGameEnd: true,
                  isWinner: val.move.color,
                  message: 'Draw',
                });
              }

              if (val.state.inCheck) {
                Tts.speak(
                  val.move.color === 'w' ? 'Check Black' : 'Check White',
                );
              }

              if (player && val.move.color === player) {
                randomAiMove(val.state.fen);
              }
            }}
          />
          <View style={{marginTop: '5%'}}>
            <ChessGameUserDetails
              ref={countdownRefPlayer1}
              seconds={900}
              player="Player 1"
              name="Player"
              onEnd={() => {
                handleOnEndTime('bottom');
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

export default ChessPlayWithAi;
