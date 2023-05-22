import firestore from '@react-native-firebase/firestore';

const moveCollection = firestore().collection('move');

export interface IMove {
  color: string;
  from: string;
  to: string;
  fen: string;
}

export const createMove = async (gameId: string, color: string) => {
  try {
    const response = await moveCollection.add({
      playerConstantColor: color,
      gameId,
      color,
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
) => {
  try {
    await moveCollection.doc(moveId).update({
      color: move.color,
      from: move.from,
      to: move.to,
      fen: move.fen,
      gameId,
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
