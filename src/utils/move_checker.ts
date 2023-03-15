const total = 8; //number of the board
const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']; // letter in the board

export const checker = (text?: string[]): string[] => {
  const list: {index: number | undefined; move: string}[] = [];

  // Handle the text of voice recognition
  text?.map(a => {
    for (let index = 1; index <= total; index++) {
      letter.map(value => {
        const move = a.match(`${value}${index}`);

        if (move) {
          list.push({index: move.index, move: move[0]});
        }
      });
    }
  });

  return [
    ...new Set(
      list.sort((a, b) => Number(a.index) - Number(b.index)).map(x => x.move),
    ),
  ]; // The Final Result
};
