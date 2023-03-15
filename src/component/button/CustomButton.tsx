import React from 'react';
import {TouchableOpacity, TouchableOpacityProps, View} from 'react-native';

interface IProps extends TouchableOpacityProps {
  text: string | React.ReactNode;
  suffix: React.ReactNode;
  prefix: React.ReactNode;
}

const CustomButton = ({text, suffix, prefix, ...props}: IProps) => {
  return (
    <>
      <TouchableOpacity {...props}>
        <View>
          {suffix}
          {text}
          {prefix}
        </View>
      </TouchableOpacity>
    </>
  );
};

export default CustomButton;
