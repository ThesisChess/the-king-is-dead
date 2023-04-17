export interface IUserRequest {
  key?: string;
  elo_rating: number;
  is_visually_impaired: boolean;
  name: string;
  photo: string;
  created_at?: Date;
  updated_at?: Date;
}
