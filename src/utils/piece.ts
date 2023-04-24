export const pieces: IPieceType[] = [
  {
    key: 'p',
    type: 'Pawn',
  },
  {
    key: 'r',
    type: 'Rook',
  },
  {
    key: 'n',
    type: 'Knight',
  },
  {
    key: 'b',
    type: 'Bishop',
  },
  {
    key: 'q',
    type: 'Queen',
  },
  {
    key: 'k',
    type: 'King',
  },
];

export interface IPieceType {
  key: string;
  type: string;
}
