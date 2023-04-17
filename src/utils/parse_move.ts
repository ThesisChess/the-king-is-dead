export const parseVoiceCommand = (voiceCommand: string): string | null => {
  // Define a regular expression to match common move formats in chess
  const moveRegex: RegExp = /[a-h][1-8][a-h][1-8]/;

  // Use the regular expression to extract the move from the voice command
  const moveMatch: RegExpMatchArray | null = voiceCommand.match(moveRegex);

  if (moveMatch) {
    // If a move was found, return it
    return moveMatch[0];
  } else {
    // If no move was found, return null
    return null;
  }
};
