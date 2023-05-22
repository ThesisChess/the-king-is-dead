type Piece =
  | 'K'
  | 'Q'
  | 'R'
  | 'B'
  | 'N'
  | 'P'
  | 'k'
  | 'q'
  | 'r'
  | 'b'
  | 'n'
  | 'p';

const getCapturedPieces = (
  fen: string,
  color: 'white' | 'black' | any,
): Piece[] => {
  debugger;
  const fenParts = fen.split(' ');
  const piecePlacement = fenParts[0];
  const capturedPieces: Piece[] = [];

  // Iterate through each character in the piece placement field
  for (let rank = 8; rank >= 1; rank--) {
    let file = 1;
    while (file <= 8) {
      const squareIndex = (rank - 1) * 8 + (file - 1);
      const piece: any = piecePlacement[squareIndex];

      // If the character is not a number (indicating an empty square) and
      // the piece matches the specified color, add it to the capturedPieces array
      if (isNaN(parseInt(piece)) && isPieceColor(piece, color)) {
        capturedPieces.push(piece as Piece);
      }

      file++;
    }
  }

  return capturedPieces;
};

const isPieceColor = (piece: Piece, color: 'white' | 'black'): boolean => {
  if (color === 'white') {
    return piece === piece.toUpperCase();
  } else {
    return piece === piece.toLowerCase();
  }
};
