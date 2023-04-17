import {IUserRequest} from '../model/user/user.request';
import {baseUrl} from './services';

const baseRoute = 'players.json';

const UserServices = {
  getUsers: () => {
    return fetch(`${baseUrl}/${baseRoute}`)
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  },
  createUser: (body: IUserRequest) => {
    return fetch(`${baseUrl}/${baseRoute}`, {
      body: JSON.stringify(body),
      method: 'post',
      headers: {'Content-Type': 'application/json'},
    }).catch(error => {
      console.error(error);
    });
  },
};

export default UserServices;
