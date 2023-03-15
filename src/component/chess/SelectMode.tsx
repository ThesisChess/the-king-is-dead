import {Button} from '@rneui/themed';
import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {BlackKingIcon, WhiteKingIcon} from '../../constant/image';

type IProps = {
  onSubmit: (value: string) => void;
};

const SelectMode = ({onSubmit}: IProps) => {
  const [selected, setSelected] = useState<string | undefined>(undefined);

  return (
    <>
      <Text style={{marginBottom: 10}}>Select Mode</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              borderColor: selected === 'White' ? '#62B1A8' : '#070707',
              borderWidth: 2,
              borderRadius: 10,
              padding: 5,
            }}
            onPressIn={() => {
              setSelected('White');
            }}>
            <Image
              source={WhiteKingIcon}
              style={{
                height: 40,
                width: 40,
              }}
            />
          </TouchableOpacity>
          <Text>White</Text>
        </View>

        <View style={{alignItems: 'center', marginHorizontal: 10}}>
          <TouchableOpacity
            style={{
              borderColor: selected === 'Random' ? '#62B1A8' : '#070707',
              borderWidth: 2,
              borderRadius: 10,
              padding: 5,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
            onPressIn={() => {
              setSelected('Random');
            }}>
            <View
              style={{
                backgroundColor: '#ffff',
                borderColor: '#070707',
                borderWidth: 2,
                borderTopStartRadius: 10,
                borderBottomStartRadius: 10,
                height: 40,
                width: 20,
              }}
            />
            <View
              style={{
                backgroundColor: '#070707',
                borderColor: '#070707',
                borderWidth: 2,
                borderTopEndRadius: 10,
                borderBottomEndRadius: 10,
                height: 40,
                width: 20,
              }}
            />
          </TouchableOpacity>
          <Text>Random</Text>
        </View>

        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              borderColor: selected === 'Black' ? '#62B1A8' : '#070707',
              borderWidth: 2,
              borderRadius: 10,
              padding: 5,
            }}
            onPressIn={() => {
              setSelected('Black');
            }}>
            <Image source={BlackKingIcon} style={{height: 40, width: 40}} />
          </TouchableOpacity>
          <Text>Black</Text>
        </View>
      </View>

      <View style={{marginTop: '5%', width: '100%'}}>
        <Button
          title="Submit"
          onPress={() => {
            if (selected) onSubmit(selected);
          }}
        />
      </View>
      {/* 
      <TouchableOpacity
        style={{
          backgroundColor: '#62B1A8',
          alignItems: 'center',
          width: '100%',
          padding: 10,
          marginTop: 10,
          borderRadius: 10,
        }}
        onPressIn={() => {
          if (selected) onSubmit(selected);
        }}>
        <Text style={{color: '#ffff'}}>Submit</Text>
      </TouchableOpacity> */}
    </>
  );
};

export default SelectMode;
