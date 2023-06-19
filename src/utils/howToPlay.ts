export interface IHowToPlay {
  title: string;
  text: string[];
}

export const howToPlayList: IHowToPlay[] = [
  {
    title: 'PLAY ONLINE:',
    text: [
      'Select this option to play with other players online from around the world.',
      'Please ask for assistance to create a room.',
      'Players are given a maximum of 15 minutes to make a moves. If a players turn exceeds the given time limit, the game will be considered over, and the opponent will be declared the winner.',
      'Once both players are ready, the game will begin.',
      'If you win, you will earn coins as a reward.',
      'If you lose, a certain number of coins will be deducted.',
    ],
  },

  {
    title: 'PLAY OFFLINE:',
    text: [
      'Choose this option to play in person with another player.',
      'Set up the physical chessboard and pieces.',
      'Players are given a maximum of 15 minutes to make a moves. If a players turn exceeds the given time limit, the game will be considered over, and the opponent will be declared the winner.',
      'Take turns making moves according to the rules of the game.',
      'There are no coins or rewards involved in offline play.',
    ],
  },

  {
    title: 'PLAY WITH AI:',
    text: [
      'Select this option to play against an artificial intelligence (AI) opponent.',
      'The AI will provide a challenging game play experience.',
      'Player’s are given a chance to choose either to play the game with timer or without timer. If player say “YES”, players are given a maximum of 15 minutes to make a moves. If a players turn exceeds the given time limit, the game will be considered over, and the opponent will be declared the winner. If player say “NO”, game will be start without timer.',
      'Make your moves by selecting the piece and the square you want to move to.',
      `The AI will respond with its moves based on the game's rules.`,
    ],
  },

  {
    title: 'MAKING MOVES:',
    text: [
      'To make moves in "The King is Dead" using the voice recognition feature, follow these steps:',
      'State the placement letter and the number of the piece you want to move. For example, say "A3" if you want to move the piece located at square A3.',
      'Clearly state the square where the piece is currently located. For instance, say "Knight on A3" to indicate the current position of the piece.',
      'State the square where you want to move the piece. For example, say "B5" to specify the destination square for the piece.',
      `The application will validate and execute your move based on the provided information.`,
    ],
  },

  {
    title: 'CAPTURING PIECES:',
    text: [
      'To capture pieces in "The King is Dead" using the voice recognition feature, follow these steps:',
      `If your piece is next to your opponent's piece and you want to capture it, state the name of your piece. For example, say "Knight" if you want to capture an opponent's piece with your knight.`,
      'Clearly state the square where your piece is currently located. For instance, say "B5" to indicate the current position of your piece.',
      'State the square where you want to move the piece. For example, say "B5" to specify the destination square for the piece.',
      `Say the square where you want to move your piece and perform the capture. For example, say
"C7" to specify the destination square where you want to move your piece and capture the
opponent's piece.`,
      'The application will handle the capture based on the provided information and update the game accordingly.',
    ],
  },

  {
    title: 'SPECIAL MOVES AND RULES:',
    text: [
      'To perform special moves in "The King is Dead" using the voice recognition feature, follow these instructions:',
      `To castle, say "Castle" followed by the side you want to castle on. Choose between "King's side" or "Queen's side." For example, say "Castle King's side" to perform a king side castle.`,
      'To promote a pawn, say "Promote" followed by the piece you want the pawn to be promoted towhen it reaches the eighth rank. Specify the desired piece such as "Queen," "Knight," "Rook," or "Bishop." For instance, say "Promote to Queen" to promote your pawn to a queen.',
    ],
  },

  {
    title: 'ENDING THE GAME:',
    text: [
      `The game ends when there is a checkmate, where one player's king is checkmated and cannot escape capture, or a draw, which can occur due to various reasons like stalemate, insufficient material, or repetition of moves.`,
      `After the game ends, you have the option to start a new game or exit the application.`,
    ],
  },
];
