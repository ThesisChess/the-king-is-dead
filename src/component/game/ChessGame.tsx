import React from 'react';

import ChessGameUserDetails from '../user/ChessGameUserDetails';

import {View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {styles} from '../../styles/container_style';

const ChessGame = () => {
  return (
    <>
      {/* <GestureHandlerRootView style={styles.container_center_and_middle}>
        <View style={styles.chess_center_and_middle}>
          <View style={{marginBottom: '5%'}}>
            <ChessGameUserDetails
              player="Player 2"
              name="David Dylan"
              image="https://randomuser.me/api/portraits/men/36.jpg"
            />
          </View>
        </View>
      </GestureHandlerRootView> */}
    </>
  );
};

export default ChessGame;
