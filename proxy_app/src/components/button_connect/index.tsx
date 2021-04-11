import {Button, Text, View} from 'native-base';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {addEventListener, startVpn, stopVpn} from '../../modules/proxy_module';

const ButtonConnect = () => {
  const [status, setStatus] = useState<boolean>();

  useEffect(() => {
    const eventListener = addEventListener((event: {status: boolean}) => {
      setStatus(event.status);
    });
    return () => {
      eventListener.remove();
    };
  }, []);

  const onPress = () => {
    if (status) {
      stopVpn();
    } else {
      startVpn('103.130.219.155', 10001, 'com.aladinfun.clashofsky_th_pig');
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
