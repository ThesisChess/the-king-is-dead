import {Chess} from 'chess.js';
import React, {createContext} from 'react';
import type {PieceType, Player} from '../../types';

const BoardContext = createContext<ReturnType<Chess['board']>>({} as any);

const BoardSetterContext = createContext<
  React.Dispatch<
    React.SetStateAction<
      (
        | {
            type: PieceType;
            color: Player;
          }
        | null
        | any
      )[][]
    >
  >
>({} as any);

export {BoardContext, BoardSetterContext};
