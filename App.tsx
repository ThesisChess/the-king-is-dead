import React, {useEffect, useState} from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createTheme, ThemeProvider} from '@rneui/themed';

import Chess from './src/view/chess/Chess';
import LoadingScreen from './src/component/screen/LoadingScreen';
import Home from './src/view/home/Home';
import ChessPlayWithAi from './src/view/chess/ChessPlayWithAi';
import Settings from './src/view/settings/Settings';
import ChessPlayOnline from './src/view/chess/ChessPlayOnline';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <>
      <LoadingScreen loading={loading}>
        <NavigationContainer theme={navTheme}>
          <ThemeProvider theme={theme}>
            {/* Handle the Navigation */}
            <Stack.Navigator
              initialRouteName="LoadingScreen"
              screenOptions={{
                headerTransparent: true,
                headerShown: false,
              }}>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="OnlineGame" component={ChessPlayOnline} />
              <Stack.Screen name="OfflineGame" component={Chess} />
              <Stack.Screen name="PlayWithAi" component={ChessPlayWithAi} />
              <Stack.Screen name="Settings" component={Settings} />
            </Stack.Navigator>
          </ThemeProvider>
        </NavigationContainer>
      </LoadingScreen>
    </>
  );
};
export default App;
