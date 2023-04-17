import React, {useState} from 'react';
import {Button} from '@rneui/themed';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {BlackKingIcon, WhiteKingIcon} from '../../constant/image';

type IProps = {
  children?: React.ReactNode;
  onSubmit: (value: string) => void;
  onCancel?: () => void;
};

const SelectMode = ({children, onSubmit, onCancel}: IProps) => {
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
              borderColor: selected === 'White' ? '#F24141' : '#070707',
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
              borderColor: selected === 'Random' ? '#F24141' : '#070707',
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
              borderColor: selected === 'Black' ? '#F24141' : '#070707',
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

      {children}

      <View style={{marginTop: '5%', width: '100%'}}>
        <Button
          title="Submit"
          onPress={() => {
            if (selected) onSubmit(selected);
          }}
        />
      </View>

      {onCancel && (
        <View style={{marginTop: '5%', width: '100%'}}>
          <Button
            title="Cancel"
            type="outline"
            onPress={() => {
              onCancel();
            }}
          />
        </View>
      )}
    </>
  );
};

export default SelectMode;
