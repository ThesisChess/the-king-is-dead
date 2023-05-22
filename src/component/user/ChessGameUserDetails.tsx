import React, {forwardRef} from 'react';
import {Avatar} from '@rneui/base';
import {Text, View} from 'react-native';
import Countdown, {CountdownProps} from '../timer/Countdown';

type IProps = {
  player: string;
  name: string;
  image?: string;
  showTimer?: boolean;
} & CountdownProps;

const ChessGameUserDetails = forwardRef(
  ({player, name, image, showTimer = true, ...props}: IProps, ref: any) => {
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
          {showTimer ? (
            <View>
              <Countdown
                ref={ref}
                style={{
                  paddingVertical: '5%',
                  paddingHorizontal: '2%',
                  borderRadius: 5,
                  backgroundColor: '#F24141',
                }}
                textStyle={{
                  textAlign: 'center',
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: '#ffff',
                }}
                {...props}
              />
            </View>
          ) : (
            <></>
          )}
        </View>
      </>
    );
  },
);

export default ChessGameUserDetails;
