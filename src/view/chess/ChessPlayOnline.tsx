import React, {memo, useEffect, useRef, useState} from 'react';

import useVoiceRecognition from '../../hook/use_voice_recognition';
import Tts from 'react-native-tts';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import ChessboardContainer, {ChessboardRef} from '../../component/chess';
import ChessGameUserDetails from '../../component/user/ChessGameUserDetails';
import Modal from 'react-native-modal/dist/modal';
import firestore from '@react-native-firebase/firestore';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {styles} from '../../styles/container_style';
import {
  ActivityIndicator,
  AppState,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {checker} from '../../utils/move_checker';
import {Button, Header} from '@rneui/themed';
import {pieces} from '../../utils/piece';
import {IGame} from '../../../config/model/game/game.resquest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  IMove,
  createMove,
  getMoveByGameId,
  updateMove,
} from '../../../config/controller/move.controller';
import {IUserRequest} from '../../../config/model/user/user.request';

type IProps = {
  navigation: any;
};

interface IPlayerDetails {
  name: string;
  color: 'w' | 'b';
  position: 'bottom' | 'top';
}

const ChessPlayOnline = ({navigation}: IProps) => {
  const chessboardRef = useRef<ChessboardRef>(null);
  const countdownRefPlayer1 = useRef<any>(null);
  const countdownRefPlayer2 = useRef<any>(null);
  const gameRef = useRef<IGame | undefined>();
  const moveId = useRef<string | undefined>();
  const gameId = useRef<string | undefined>();
  const playerPieceColor = useRef<string | undefined>();

  const [loading, setLoading] = useState(false);
  const [currentPlayerDetails, setCurrentPlayerDetails] = useState<
    IUserRequest | undefined
  >();
  const [playerDetails, setPlayerDetails] = useState<
    IUserRequest | undefined
  >();
  const [player, setPlayer] = useState<'w' | 'b' | undefined>(undefined); //state for player type
  const [onEndGame, selectOnEndGame] = useState<{
    isGameEnd: boolean;
    isWinner?: 'w' | 'b';
    message?: string;
  }>({isGameEnd: false}); //select mode visibility
  const [gameOrientation] = useState(false);
  const [playerPosition] = useState<
    {
      color: 'w' | 'b';
      position: 'top' | 'bottom';
    }[]
  >();

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

    if (result)
      selectOnEndGame({
        isGameEnd: true,
        isWinner: result?.color,
        message: 'King is Dead',
      });
  };

  const handleMove = async (moveId: string, gameId: string, move: IMove) => {
    await updateMove(moveId, gameId, move);
  };

  //------------------------------------ Start FireStore ------------------------------------

  const handleCreateMove = async (gameIdResponse: string) => {
    const response = await getMoveByGameId(gameIdResponse, 'w');

    const playerColor = !response.docs.length ? 'w' : 'b';
    const createResult = await createMove(gameIdResponse, playerColor);

    if (createResult) {
      await AsyncStorage.setItem('@moveId', createResult?.id);
    }

    setPlayer(playerColor);
    playerPieceColor.current = playerColor;
    moveId.current = createResult?.id;
  };

  useEffect(() => {
    (async () => {
      setLoading(true);

      const gameResponse = await AsyncStorage.getItem('@game');
      const gameIdResponse = await AsyncStorage.getItem('@gameId');
      const moveIdResponse = await AsyncStorage.getItem('@moveId');

      console.log('gameResponse', gameResponse);

      if (gameIdResponse && gameResponse) {
        const documentRef = await firestore()
          .collection('move')
          .doc(moveIdResponse ? moveIdResponse : '');

        // Retrieve the document data
        documentRef.get().then(async documentSnapshot => {
          if (documentSnapshot.exists) {
            const data = documentSnapshot.data();
            console.log('data?.fen', data?.fen);

            setPlayer(data?.playerConstantColor);
            chessboardRef.current?.resetBoard(data?.fen);

            playerPieceColor.current = data?.playerConstantColor;
            moveId.current = documentSnapshot.id;
          } else {
            handleCreateMove(gameIdResponse);
          }
        });

        const gameParsed = JSON.parse(gameResponse);

        gameId.current = gameIdResponse;
        gameRef.current = gameParsed;

        //player setup
        const currentPlayerResponse = await AsyncStorage.getItem('@player');
        if (currentPlayerResponse) {
          const currentPlayerDetails: IUserRequest = JSON.parse(
            currentPlayerResponse,
          );

          const playerDetailsRef = await firestore()
            .collection('player')
            .doc(
              currentPlayerDetails.key === gameParsed.creator
                ? gameParsed.player2
                : gameParsed.creator,
            );

          playerDetailsRef.get().then(async playerDocumentSnapshot => {
            if (playerDocumentSnapshot.exists) {
              const data: any = playerDocumentSnapshot.data();
              if (data) setPlayerDetails(data);
            }
          });

          setCurrentPlayerDetails(currentPlayerDetails);
        }
      }
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    })();

    return () => {
      gameRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('move')
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach((x: any) => {
          const move = x.data();

          if (playerPieceColor) {
            if (move.color !== playerPieceColor?.current) {
              if (move?.from && move?.to) {
                chessboardRef.current?.move({
                  from: move.from,
                  to: move.to,
                });
              }
            }
          }
        });
      });

    return () => unsubscribe();
  }, []);

  //------------------------------------ End FireStore ------------------------------------
  useEffect(() => {
    Tts.speak(`Play Online 1 vs 1`);

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

  return (
    <>
      <Modal isVisible={loading}>
        <ActivityIndicator />
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
        centerComponent={{text: 'Play Online', style: {color: '#ffff'}}}
      />
      <GestureHandlerRootView style={styles.container_center_and_middle}>
        <View style={styles.chess_center_and_middle}>
          <View style={{marginBottom: '5%'}}>
            <ChessGameUserDetails
              ref={countdownRefPlayer2}
              seconds={300}
              showTimer={false}
              player="Player"
              name={playerDetails?.name ? playerDetails?.name : ''}
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
              if (gameId.current && moveId.current) {
                handleMove(moveId.current, gameId.current, {
                  color: move.color,
                  from: move.from,
                  to: move.to,
                  fen: state.fen,
                } as IMove);
              }

              const index = playerPosition?.findIndex(
                x => x.color === move.color,
              );

              const pieceType = pieces.find(x => x.key === move.piece);

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
              showTimer={false}
              player="Player"
              name={
                currentPlayerDetails?.name ? currentPlayerDetails?.name : ''
              }
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

export default memo(ChessPlayOnline);
