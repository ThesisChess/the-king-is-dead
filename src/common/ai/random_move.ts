import {status as Status, moves as Moves, move as Move} from 'js-chess-engine';

export interface IMiniMax {
  fen: string;
  from: string;
  to: string;
}

const randomMove = async (fen: string): Promise<IMiniMax> => {
  const board = Status(fen);
  const moves = Moves(fen);
  const startingPoints = Object.keys(moves);

  const possibleMoves = startingPoints.reduce(
    (all: [string, string][], current: string) => {
      const movesFromThisPosition = moves[current].map((move: string) => [
        current,
        move,
      ]);

      return [...all, ...movesFromThisPosition];
    },
    [],
  );

  const randomIdx = Math.floor(Math.random() * possibleMoves.length);
  const move = possibleMoves[randomIdx];
  const newFenMove = Move(fen, move[0], move[1]);

  return {fen: newFenMove, from: move[0], to: move[1]} as IMiniMax;
};

export default randomMove;
