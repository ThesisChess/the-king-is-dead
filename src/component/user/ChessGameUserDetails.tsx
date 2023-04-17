import React, {forwardRef, useEffect, useRef} from 'react';

import useCountdownTimer from '../../hook/use_countdown_timer';
// import Timer from '../timer/Timer';

import {Avatar} from '@rneui/base';
import {Text, View} from 'react-native';
import {Countdown} from 'react-native-element-timer';
import {CountDownProps} from 'react-native-element-timer/lib/typescript/CountDown/model';

type IProps = {
  player: string;
  name: string;
  image?: string;
} & CountDownProps &
  React.RefAttributes<any>;

const ChessGameUserDetails = forwardRef(
  ({player, name, image, ...props}: IProps, ref) => {
    return (
      <>
        <View
          style={{
            marginLeft: '5%',
            marginRight: '5%',
            flexDirection: 'row',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignContent: 'center',
              justifyContent: 'space-between',
            }}>
            {image ? (
              <Avatar
                size={40}
                rounded
                source={typeof image === 'string' ? {uri: image} : image}
              />
            ) : (
              <Avatar
                size={40}
                rounded
                source={require('../../assets/image/empty.png')}
              />
            )}

            <View style={{marginLeft: '5%'}}>
              <Text
                style={{
                  fontWeight: 'bold',
                }}>
                {player}
              </Text>
              <Text>{name}</Text>
            </View>
          </View>
          <Countdown
            ref={ref}
            style={{
              marginLeft: '5%',
              padding: '3%',
              borderRadius: 10,
              backgroundColor: '#F24141',
            }}
            textStyle={{
              fontSize: 15,
              fontWeight: 'bold',
              color: '#ffff',
            }}
            {...props}
          />
        </View>
      </>
    );
  },
);

export default ChessGameUserDetails;
