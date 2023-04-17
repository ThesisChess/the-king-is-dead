import React from 'react';
import {Image, ImageProps} from 'react-native';
import {PIECES} from '../../constants';
import {useChessboardProps} from '../../context/props-context/hooks';
import type {PieceType} from '../../types';

type ChessPieceType = {
  id: PieceType;
} & Partial<ImageProps>;

const ChessPiece: React.FC<ChessPieceType> = React.memo(({id, ...rest}) => {
  const {pieceSize, orientation, renderPiece} = useChessboardProps();
  return (
    renderPiece?.(id) ?? (
      <Image
        style={[
          {width: pieceSize, height: pieceSize},
          {transform: [{rotate: orientation === 'b' ? '180deg' : '360deg'}]},
          rest.style,
        ]}
        {...rest}
        source={PIECES[id]}
      />
    )
  );
});

export {ChessPiece};
