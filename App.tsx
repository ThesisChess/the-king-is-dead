import React, {useEffect, useState} from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createTheme, ThemeProvider} from '@rneui/themed';
import {SettingsContext} from './src/context/settings';
import {useSettings} from './src/context/settings/hooks';

import Chess from './src/view/chess/Chess';
import LoadingScreen from './src/component/screen/LoadingScreen';
import Home from './src/view/home/Home';
import ChessPlayWithAi from './src/view/chess/ChessPlayWithAi';
import Settings from './src/view/settings/Settings';
import ChessPlayOnline from './src/view/chess/ChessPlayOnline';
import CreateUser from './src/view/user/CreateUser';
import Leaderboard from './src/view/leaderboard/Leaderboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IUserRequest} from './config/model/user/user.request';

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffff',
  },
};

const theme = createTheme({
  lightColors: {
    primary: '#F24141',
  },
  darkColors: {
    primary: '#000',
  },
  mode: 'light',
});

const App = () => {
  const {volume, sound} = useSettings();

  const [loading, setLoading] = useState(false);
  const [player, setPlayer] = useState<IUserRequest | undefined>();

  useEffect(() => {
    setLoading(true);

    AsyncStorage.getItem('@player').then(res => {
      if (res) setPlayer(JSON.parse(res));
      else setPlayer(undefined);

      setTimeout(() => {
        setLoading(false);
      }, 1500);
    });

    return () => {
      setPlayer(undefined);
      setLoading(false);
    };
  }, []);

  return (
    <>
      <LoadingScreen loading={loading}>
        <NavigationContainer theme={navTheme}>
          <ThemeProvider theme={theme}>
            <SettingsContext.Provider value={{sound, volume}}>
              {/* Handle the Navigation */}
              <Stack.Navigator
                initialRouteName={!player ? 'CreateUser' : 'Home'}
                screenOptions={{
                  headerTransparent: true,
                  headerShown: false,
                }}>
                <Stack.Screen name="CreateUser" component={CreateUser} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="OnlineGame" component={ChessPlayOnline} />
                <Stack.Screen name="OfflineGame" component={Chess} />
                <Stack.Screen name="Leaderboard" component={Leaderboard} />
                <Stack.Screen name="PlayWithAi" component={ChessPlayWithAi} />
                <Stack.Screen name="Settings" component={Settings} />
              </Stack.Navigator>
            </SettingsContext.Provider>
          </ThemeProvider>
        </NavigationContainer>
      </LoadingScreen>
    </>
  );
};
export default App;
