import {useContext} from 'react';
import {UserContext} from '.';

const useUser = () => {
  return useContext(UserContext);
};
