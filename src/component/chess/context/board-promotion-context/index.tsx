import React, {useCallback, useMemo, useState} from 'react';
import {Chess} from 'chess.js';

import {PieceType} from '../../types';
import {PromotionDialog} from './dialog';
import {View} from 'react-native';
import Modal from 'react-native-modal/dist/modal';

export type BoardPromotionContextType = {
  showPromotionDialog: (_: {
    type: PromotionDialogType;
    onSelect?: (_: PieceType) => void;
  }) => void;
  isPromoting: boolean;
};

const BoardPromotionContext = React.createContext<BoardPromotionContextType>({
  showPromotionDialog: () => {
    //
  },
  isPromoting: false,
});

type PromotionDialogType = ReturnType<Chess['turn']>;

export type BoardPromotionContextState = {
  isDialogActive: boolean;
  type?: PromotionDialogType;
  onSelect?: (_: PieceType) => void;
};

const BoardPromotionContextProvider: React.FC<any> = React.memo(
  ({children}: any) => {
    const [dialog, setDialog] = useState<BoardPromotionContextState>({
      isDialogActive: false,
    });

    const showPromotionDialog: BoardPromotionContextType['showPromotionDialog'] =
      useCallback(({type, onSelect}) => {
        setDialog({isDialogActive: true, type, onSelect});
      }, []);

    const onSelect = (piece: PieceType) => {
      dialog.onSelect?.(piece);
      setDialog({isDialogActive: false});
    };

    const value = useMemo(
      () => ({
        showPromotionDialog,
        isPromoting: dialog.isDialogActive,
      }),
      [dialog.isDialogActive, showPromotionDialog],
    );

    return (
      <>
        <BoardPromotionContext.Provider value={value}>
          <PromotionDialog
            type="w"
            {...dialog}
            isDialogActive={dialog.isDialogActive}
            onSelect={onSelect}
          />

          {children}
        </BoardPromotionContext.Provider>
      </>
    );
  },
);

export {BoardPromotionContextProvider, BoardPromotionContext};
