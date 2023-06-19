import firestore from '@react-native-firebase/firestore';

const moveCollection = firestore().collection('move');

export interface IMove {
  color: string;
  from: string;
  to: string;
  fen: string;
}

export interface ICreateMove {
  gameId: string;
  color: string;
  playerConstantColor: string;
  playerId: string;
}

export const createMove = async (
  gameId: string,
  color: string,
  playerId: string,
) => {
  try {
    const response = await moveCollection.add({
      playerConstantColor: color,
      gameId,
      color,
      playerId,
    });

    return response;
  } catch (error) {
    console.error('Error created move:', error);
  }
};

export const updateMove = async (
  moveId: string,
  gameId: string,
  move: IMove,
  playerId: string,
) => {
  try {
    await moveCollection.doc(moveId).update({
      color: move.color,
      from: move.from,
      to: move.to,
      fen: move.fen,
      gameId,
      playerId,
    });
    console.log('Move updated successfully!');
  } catch (error) {
    console.error('Error updating move:', error);
  }
};

export const getMoveByGameId = async (gameId: string, color: string) => {
  const response = await moveCollection
    .where('gameId', '==', gameId)
    .where('color', '==', color)
    .get();

  return response;
};
