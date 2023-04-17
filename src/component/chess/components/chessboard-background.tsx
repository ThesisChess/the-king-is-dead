/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useChessboardProps} from '../context/props-context/hooks';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
});

type BackgroundProps = {
  letters: boolean;
  numbers: boolean;
};

interface BaseProps extends BackgroundProps {
  white: boolean;
}

interface RowProps extends BaseProps {
  row: number;
  orientation?: 'w' | 'b';
}

interface SquareProps extends RowProps {
  col: number;
}

const Square = React.memo(
  ({white, row, col, letters, numbers}: SquareProps) => {
    const {colors, orientation} = useChessboardProps();

    const backgroundColor = white ? colors.black : colors.white;

    const color = white ? colors.white : colors.black;

    const textStyle = {fontWeight: '500' as const, fontSize: 10, color};

    const newLocal = col === 0;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor,
          padding: 4,
          justifyContent: 'space-between',
        }}>
        {orientation === 'b' ? (
          <>
            {row === 0 && (
              <Text
                style={[
                  textStyle,
                  {
                    alignSelf: 'flex-end',
                    transform: [
                      {
                        rotate: orientation === 'b' ? '180deg' : '360deg',
                      },
                    ],
                  },
                ]}>
                {String.fromCharCode(97 + col)}
              </Text>
            )}
            {numbers && (
              <Text
                style={[
                  textStyle,
                  {
                    opacity: newLocal ? 1 : 0,
                    transform: [
                      {
                        rotate: orientation === 'b' ? '180deg' : '360deg',
                      },
                    ],
                  },
                ]}>
                {'' + (8 - row)}
              </Text>
            )}
          </>
        ) : (
          <>
            {numbers && (
              <Text style={[textStyle, {opacity: newLocal ? 1 : 0}]}>
                {'' + (8 - row)}
              </Text>
            )}
            {row === 7 && letters && (
              <Text style={[textStyle, {alignSelf: 'flex-end'}]}>
                {String.fromCharCode(97 + col)}
              </Text>
            )}
          </>
        )}
      </View>
    );
  },
);

const Row = React.memo(({white, row, orientation = 'w', ...rest}: RowProps) => {
  const offset = white ? 0 : 1;

  const count = Array.from({length: 8}, (_, index) => index);

  return (
    <View style={styles.container}>
      {count.map((_, i) => (
        <Square
          {...rest}
          row={row}
          col={i}
          key={i}
          white={(i + offset) % 2 === 1}
        />
      ))}
    </View>
  );
});

const Background: React.FC = React.memo(() => {
  const {withLetters, withNumbers, orientation} = useChessboardProps();

  return (
    <View
      style={{
        flex: 1,
      }}>
      {new Array(8).fill(0).map((_, i) => (
        <Row
          key={i}
          white={i % 2 === 0}
          row={i}
          letters={withLetters}
          numbers={withNumbers}
          orientation={orientation}
        />
      ))}
    </View>
  );
});

export default Background;
