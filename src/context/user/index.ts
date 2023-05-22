import {createContext} from 'react';
import {IUserRequest} from '../../../config/model/user/user.request';

export interface IUser {
  useDetails: IUserRequest;
}

const UserContext = createContext<IUser>({
  useDetails: {} as IUserRequest,
} as IUser);

export {UserContext};
