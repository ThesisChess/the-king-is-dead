import React, {useEffect, useState} from 'react';

import firestore from '@react-native-firebase/firestore';

import {Image, Text, View} from 'react-native';
import {IUserRequest} from '../../../config/model/user/user.request';
import {Header, Skeleton} from '@rneui/themed';

type IProps = {
  navigation: any;
};

const Leaderboard = ({navigation}: IProps) => {
  const [players, setPlayers] = useState<IUserRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const players = await firestore()
        .collection('player')
        .orderBy('elo_rating', 'desc')
        .get();

      const result = players.docs.map((x: any) => {
        return {
          key: x.id,
          ...x._data,
        } as IUserRequest;
      });

      setPlayers(
        result.sort((a, b) => b.elo_rating - a.elo_rating).slice(0, 5),
      );

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    })();

    return () => {
      setLoading(false);
      setPlayers([]);
    };
  }, []);

  return (
    <>
      <Header
        style={{alignContent: 'center', alignItems: 'center'}}
        leftComponent={{
          icon: 'home',
          color: '#fff',
          onPress: () => {
            navigation.navigate('Home');
          },
        }}
        rightComponent={{
          icon: 'settings',
          color: '#fff',
          onPress: () => {
            navigation.navigate('Settings');
          },
        }}
        centerComponent={{text: 'Leaderboard', style: {color: '#ffff'}}}
      />
      <View
        style={[
          {
            flex: 1,
            marginTop: 70,
            margin: 20,
            padding: 20,
            alignContent: 'center',
            justifyContent: 'center',
          },
        ]}>
        <Image
          style={[
            {
              width: 150,
              height: 250,
              justifyContent: 'center',
              alignSelf: 'center',
            },
          ]}
          source={require('../../assets/image/trophy-icon.png')}
        />
        {loading
          ? [1, 2, 3, 4, 5].map(x => (
              <View
                key={`loading${x}`}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: 10,
                }}>
                <Skeleton animation="wave" width={80} height={30} />
                <Skeleton animation="wave" width={80} height={30} />
                <Skeleton animation="wave" width={80} height={30} />
              </View>
            ))
          : players.map((x, i) => (
              <View
                key={x?.key}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: 10,
                }}>
                <Text style={{fontWeight: '900'}}>Rank No.{i + 1}</Text>
                <Text style={{fontWeight: '900'}}>{x.name}</Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    alignContent: 'center',
                  }}>
                  <Image
                    style={[
                      {
                        width: 20,
                        height: 20,
                      },
                    ]}
                    source={require('../../assets/image/coin.png')}
                  />

                  <Text style={{fontWeight: '900'}}>{x.elo_rating}</Text>
                </View>
              </View>
            ))}
      </View>
    </>
  );
};

export default Leaderboard;
