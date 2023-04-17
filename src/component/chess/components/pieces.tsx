import React from 'react';
import Piece from './piece';
import {useChessboardProps} from '../context/props-context/hooks';

import {useBoard} from '../context/board-context/hooks';
import {usePieceRefs} from '../context/board-refs-context/hooks';

import {useReversePiecePosition} from '../notation';

const Pieces = React.memo(() => {
  const board = useBoard();
  const refs = usePieceRefs();

  const {pieceSize, orientation} = useChessboardProps();
  const {toPosition} = useReversePiecePosition();

  return (
    <>
      {board.map((row: any, y: number) =>
        row.map((piece: any, x: number) => {
          if (piece !== null) {
            const square = toPosition({
              x: x * pieceSize,
              y: y * pieceSize,
            });

            return (
              <Piece
                ref={refs?.current?.[square]}
                key={`${x}-${y}`}
                id={`${piece.color}${piece.type}` as any}
                startPosition={{x, y}}
                square={square}
                size={pieceSize}
              />
            );
          }
          return null;
        }),
      )}
    </>
  );
});

export {Pieces};
