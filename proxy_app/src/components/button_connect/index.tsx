import {Button, Text, View} from 'native-base';
import React from 'react';
import {NativeModules, StyleSheet} from 'react-native';

const ButtonConnect = () => {
  const onPress = () => {
    NativeModules.TestModule.show('abc', NativeModules.TestModule.LENG_LONG);
  };

  return (
    <View>
      <Button style={styles.button} onPress={onPress}>
        <Text>Kết nối</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    backgroundColor: '#213A78',
  },
});

export default ButtonConnect;
