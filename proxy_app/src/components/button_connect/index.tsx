import {Button, Text, View} from 'native-base';
import React, {useEffect, useState} from 'react';
import {NativeModules, StyleSheet, NativeEventEmitter} from 'react-native';

const ButtonConnect = () => {
  const [status, setStatus] = useState<boolean>();

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
    const eventListener = eventEmitter.addListener(
      'vpn_event',
      (event: {status: boolean}) => {
        setStatus(event.status);
      },
    );
    return () => {
      eventListener.remove();
    };
  }, []);

  const onPress = () => {
    if (status) {
      NativeModules.ProxyModule.stopVpn();
    } else {
      NativeModules.ProxyModule.startVpn('103.130.219.155', 10001);
    }
  };

  return (
    <View>
      <Button style={styles.button} onPress={onPress}>
        <Text>{!status ? 'Kết nối' : 'Ngắt'}</Text>
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
