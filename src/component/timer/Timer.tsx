import React from 'react';
import {Text, View} from 'react-native';

type IProps = {
  time: string;
};

const Timer = ({time}: IProps) => {
  return (
    <>
      <View
        style={{
          marginLeft: '5%',
          padding: '3%',
          borderRadius: 10,
          backgroundColor: '#F24141',
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            color: '#ffff',
          }}>
          {time}
        </Text>
      </View>
    </>
  );
};

export default Timer;
