import {IUserRequest} from './model/user/user.request';
import UserServices from './services/user.services';

export class UserFirebaseController {
  getAllUsers = async () => {
    const response = await UserServices.getUsers();
    return response;
  };
  getUserById = () => {};
  createUser = async (body: IUserRequest) => {
    const response = await UserServices.createUser(body);
  };
  updateUser = () => {};
}
