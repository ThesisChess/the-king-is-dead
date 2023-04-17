import React, {useState} from 'react';

import {Text} from '@rneui/base';
import {View} from 'react-native';
import {Button, CheckBox, Header, Slider} from '@rneui/themed';

type IProps = {
  navigation: any;
};

const Settings = ({navigation}: IProps) => {
  const [value, setValue] = useState(0);
  const [vertValue, setVertValue] = useState(0);

  const interpolate = (start: number, end: number) => {
    let k = (value - 0) / 10; // 0 =>min  && 10 => MAX
    return Math.ceil((1 - k) * start + k * end) % 256;
  };

  const color = () => {
    let r = interpolate(255, 0);
    let g = interpolate(0, 255);
    let b = interpolate(0, 0);
    return `rgb(${r},${g},${b})`;
  };

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
        <Text style={{paddingTop: 20, marginBottom: 20}} h4>
          Volume: {value}
        </Text>

        <Slider
          value={value}
          onValueChange={setValue}
          maximumValue={10}
          minimumValue={0}
          step={1}
          allowTouchTrack
          trackStyle={{height: 5, backgroundColor: 'transparent'}}
          thumbStyle={{height: 20, width: 20, backgroundColor: 'transparent'}}
          thumbProps={{
            children: (
              <View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: color(),
                  borderRadius: 100,
                }}
              />
            ),
          }}
        />

        <View
          style={{
            marginTop: 20,
          }}>
          <Text style={{paddingTop: 20}} h4>
            Sound
          </Text>
          <CheckBox
            checked={false}
            onPress={() => {}}
            // Use ThemeProvider to make change for all checkbox
            iconType="material-community"
            checkedIcon="checkbox-marked"
            uncheckedIcon="checkbox-blank-outline"
            checkedColor="red"
          />
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
