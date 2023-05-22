export interface IMoveResponse {
  key?: string;
  roomKey: string;
  from: string;
  to: string;
  playerId: [string, string];
  timestamp: number;
  status: string;
}

export interface IMoveDataResponse {
  color: string;
  from: string;
  to: string;
  gameId: string;
}
