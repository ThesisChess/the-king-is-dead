export interface IGameRequest {
  key?: string;
  color: string;
  from: string;
  to: string;
  fen: string;
  playerIds: string[];
}

export interface IRoomRequest {
  create_date: string;
  player_one_id: string;
  player_two_id: string;
}

export interface IGame {
  gameId: string;
  unsubscribe?: any | null;
  creator: string;
  player2?: string | null;
}
