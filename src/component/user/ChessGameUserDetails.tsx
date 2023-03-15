import {Avatar} from '@rneui/base';
import React from 'react';
import {Text, View} from 'react-native';

type IProps = {
  player: string;
  name: string;
  image?: string;
};

const ChessGameUserDetails = ({player, name, image}: IProps) => {
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
          <Avatar size={40} rounded source={{uri: image}} />
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
            10:00
          </Text>
        </View>
      </View>
    </>
  );
};

export default ChessGameUserDetails;
