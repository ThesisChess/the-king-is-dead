import React from 'react';
import {Image, Text, View} from 'react-native';

type IProps = {
  loading: boolean;
  children: React.ReactNode;
};

const LoadingScreen = ({loading, children}: IProps) => {
  if (loading)
    return (
      <>
        <View
          style={{
            flex: 1,
            margin: 20,
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={[
              {
                width: 250,
                height: 250,
                justifyContent: 'center',
                alignSelf: 'center',
              },
            ]}
            source={require('../../assets/image/knight_jump_loading.gif')}
          />

          <Text style={{textAlign: 'center', fontSize: 20}}>Loading.....</Text>
        </View>
      </>
    );

  return <>{children}</>;
};

export default LoadingScreen;
