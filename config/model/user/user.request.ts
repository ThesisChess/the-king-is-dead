export interface IUserRequest {
  key?: string;
  elo_rating: number;
  is_on_game: boolean;
  is_online: boolean;
  is_visually_impaired: boolean;
  name: string;
  photo: string;
  created_at?: Date;
  updated_at?: Date;
}
