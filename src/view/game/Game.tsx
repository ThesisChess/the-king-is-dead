import React, {useState, useEffect, useRef} from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useVoiceRecognition from '../../hook/use_voice_recognition';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {styles} from '../../styles/container_style';
import {View, Text} from 'react-native';
import {IUserRequest} from '../../../config/model/user/user.request';
import {Button, Card} from '@rneui/themed';
import {IGame} from '../../../config/model/game/game.resquest';
import {ScrollView} from 'react-native-gesture-handler';
import Tts from 'react-native-tts';

type IProps = {
  navigation: any;
};

const Game = ({navigation}: IProps) => {
  const roomCollection = firestore().collection('room');
  const currentUserRef = useRef<IUserRequest>();
  const gameIdRef = useRef<any>();
  const gamesRef = useRef<IGame[]>([]);

  const [games, setGames] = useState<IGame[]>([]);
  const [hasCreatedGame, setHasCreatedGame] = useState(false);

  const {isStarted, _startRecognizing, _stopRecognizing} = useVoiceRecognition({
    speechVolume: false,
    callbacks: {
      onSpeechResults: e => {
        const res = e?.value?.join(' ').toLowerCase();

        if (res?.toLocaleLowerCase().includes('Back'.toLowerCase())) {
          Tts.speak(`Back to Home`);

          setTimeout(() => {
            navigation.goBack();
          }, 1000);
        }

        if (res?.toLocaleLowerCase().includes('Create a room'.toLowerCase())) {
          handleCreateGame();
        }

        if (res?.toLocaleLowerCase().includes('Join a room'.toLowerCase())) {
          if (gamesRef.current) {
            const randomIdx = Math.floor(
              Math.random() * gamesRef.current?.length,
            );

            handleJoinGame(gamesRef.current[randomIdx]);
          }
        }
      },
    },
  });

  // Listen to changes in the games collection

  // Handle the create game button press
  const handleCreateGame = async () => {
    if (currentUserRef?.current) {
      // Check if the user has already created a game
      const existingGame = gamesRef.current.find(
        game => game.creator === currentUserRef?.current?.key,
      );

      if (existingGame) {
        console.log('You have already created a game.');

        Tts.speak(`You have already created a game.`);

        return;
      }

      // Create a new game document
      const response = await roomCollection.add({
        creator: currentUserRef?.current?.key,
        player2: null,
      });
      ``;
      await AsyncStorage.setItem('@gameId', response.id);

      if (response.id) gameIdRef.current = response.id;

      setHasCreatedGame(true);

      Tts.speak(`Game created.`);
      _stopRecognizing();
    }
  };

  // Handle the join game button press
  const handleJoinGame = async (game: IGame) => {
    Tts.speak(`Joining to ${game?.creator}.`);

    if (game.player2 !== null) {
      Tts.speak(`This game is already full.`);
      return;
    }

    if (game.creator === currentUserRef?.current?.key) {
      Tts.speak(`You cannot join a game that you have created.`);
      return;
    }

    // Update the game object
    await roomCollection.doc(game.gameId).update({
      player2: currentUserRef?.current?.key,
    });

    await AsyncStorage.setItem('@gameId', game.gameId);

    // Remove the game from the list
    setGames(prevGames => {
      return prevGames.filter(prevGame => prevGame.gameId !== game.gameId);
    });

    gamesRef.current = games;

    if (game.gameId) gameIdRef.current = game.gameId;

    navigation.navigate('StartOnlineGame');
    _stopRecognizing();
  };

  // Handle the join game button press
  const handleLeaveGame = async (game: IGame) => {
    await roomCollection.doc(game.gameId).update({
      player2: null,
    });

    // Remove the game from the list
    setGames(prevGames => {
      return prevGames.filter(prevGame => prevGame.gameId !== game.gameId);
    });

    gamesRef.current = games;
  };

  useEffect(() => {
    (async () => {
      const playerString = await AsyncStorage.getItem('@player');

      if (playerString) {
        const player = JSON.parse(playerString) as IUserRequest;
        currentUserRef.current = player;
      }
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = roomCollection.onSnapshot(
      async (querySnapshot: any) => {
        const existingGame = games.find(
          game => game.creator === currentUserRef?.current?.key,
        );

        if (!existingGame) {
          const newGames: IGame[] = [];

          querySnapshot.forEach((doc: any) => {
            const game = doc.data() as IGame;

            game.gameId = doc.id;

            newGames.push(game);
          });

          setGames(newGames);

          gamesRef.current = newGames;
        }

        const resultGameId = await AsyncStorage.getItem('@gameId');

        if (resultGameId) {
          const documentRef = roomCollection.doc(resultGameId);

          // Retrieve the document data
          documentRef.get().then(async documentSnapshot => {
            if (documentSnapshot.exists) {
              console.log('documentSnapshot', documentSnapshot);

              navigation.navigate('StartOnlineGame');

              const data = {
                creator: documentSnapshot.data()?.creator,
                player2: documentSnapshot.data()?.player2,
                gameId: documentSnapshot.id,
              } as IGame;

              await AsyncStorage.setItem('@game', JSON.stringify(data));
            } else {
              console.log('Document does not exist.');
            }
          });
        }
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    Tts.speak(`Join a room or Create a room?`);

    return () => {
      Tts.stop();
      _stopRecognizing();
    };
  }, []);

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 20,
        }}>
        <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 15}}>
          Find Match
        </Text>

        <View style={{marginVertical: 5, width: '100%'}}>
          <Button
            title="Create Game"
            onPress={handleCreateGame}
            disabled={hasCreatedGame}
          />
        </View>
        {games.length > 0 ? (
          <View
            style={{
              width: '100%',
            }}>
            <Text
              style={{
                marginTop: 10,
                fontWeight: 'bold',
              }}>
              List of Game
            </Text>
            <ScrollView
              style={{
                height: '60%',
              }}>
              {games.map(item => (
                <Card key={item.gameId}>
                  <Card.Title>{item.creator}</Card.Title>
                  <Card.Divider />

                  <View style={{marginBottom: 10}}>
                    <Text>Creator Id: {item.creator}</Text>
                    {item.player2 ? (
                      <Text>Player 2 Id: {item.creator}</Text>
                    ) : (
                      <Text>Waiting for player 2...</Text>
                    )}
                  </View>

                  {currentUserRef?.current?.key !== item.creator &&
                  currentUserRef?.current?.key !== item.player2 ? (
                    <View style={{marginBottom: 10}}>
                      <Button
                        title="Join"
                        onPress={() => handleJoinGame(item)}
                      />
                    </View>
                  ) : (
                    <></>
                  )}
                  {/* 
                {currentUserRef?.current?.key === item.player2 ? (
                  <View>
                    <Button
                      title="Leave"
                      onPress={() => handleLeaveGame(item)}
                    />
                  </View>
                ) : (
                  <></>
                )} */}
                </Card>
              ))}
            </ScrollView>
          </View>
        ) : (
          <Text>No available games.</Text>
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
    </>
  );
};

export default Game;
