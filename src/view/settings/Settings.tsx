import React from 'react';

import {Text} from '@rneui/base';
import {View} from 'react-native';
import {Button, Header, Switch} from '@rneui/themed';

type IProps = {
  navigation: any;
};

const Settings = ({navigation}: IProps) => {
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
        centerComponent={{text: 'Settings', style: {color: '#ffff'}}}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: '5%',
        }}>
        <View>
          <Switch />
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <Button style={{width: '100%'}}>Save</Button>
        </View>
      </View>
    </>
  );
};

export default Settings;
