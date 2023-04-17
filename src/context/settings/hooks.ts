import {useContext} from 'react';
import {SettingsContext} from '.';

const useSettings = () => {
  return useContext(SettingsContext);
};

export {useSettings};
