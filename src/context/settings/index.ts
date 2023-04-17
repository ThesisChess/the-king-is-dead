import {createContext} from 'react';

export interface ISettings {
  volume: number;
  sound: boolean;
}

const SettingsContext = createContext<ISettings>({
  volume: 0,
  sound: false,
} as ISettings);

export {SettingsContext};
