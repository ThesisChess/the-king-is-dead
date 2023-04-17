import {useChessboardProps} from '../../../context/props-context/hooks';
import React from 'react';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

import {StyleSheet} from 'react-native';
import type {BoardPromotionContextState} from '..';
import {DialogPiece} from './dialog-piece';
import {PieceType} from '../../../types';

const PROMOTION_PIECES: PieceType[] = ['q', 'r', 'n', 'b'];

const PromotionDialog: React.FC<Required<BoardPromotionContextState>> = ({
  type,
  isDialogActive,
  onSelect,
}) => {
  const {boardSize, orientation} = useChessboardProps();

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[
        {
          display: isDialogActive ? 'flex' : 'none',
          width: boardSize / 3,
          left: boardSize / 3,
          right: boardSize / 3,
          zIndex: 10,
          transform: [{rotate: orientation === 'b' ? '180deg' : '360deg'}],
        },
        styles.container,
      ]}>
      {PROMOTION_PIECES.map((piece, i) => {
        return (
          <DialogPiece
            key={i}
            width={boardSize / 6}
            index={i}
            piece={piece}
            type={type}
            onSelectPiece={onSelect}
          />
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    position: 'absolute',
    backgroundColor: 'rgba(256,256,256,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    shadowColor: 'black',
    aspectRatio: 1,
    borderRadius: 5,
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 5,
      width: 0,
    },
  },
});

export {PromotionDialog};
