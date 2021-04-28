import React, {useEffect, useState} from 'react';
import {Text, Title, View} from 'native-base';
import {Linking, StyleSheet} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import ButtonConnect, {
  ButtonConnectStatus,
} from '../../components/button_connect';
import {addEventListener, startVpn, stopVpn} from '../../modules/proxy_module';
import {configs} from '../../configs/env';

const messages = {
  [ButtonConnectStatus.START]: 'Đã kết nối!',
  [ButtonConnectStatus.STOP]: 'Chưa kết nối!',
  [ButtonConnectStatus.CONNECTING]: 'Đang kết nối...',
};

export default function Home() {
  const [status, setStatus] = useState<ButtonConnectStatus>(
    ButtonConnectStatus.STOP,
  );

  useEffect(() => {
    const listener = addEventListener((event: {status: boolean}) => {
      setStatus(
        event.status ? ButtonConnectStatus.START : ButtonConnectStatus.STOP,
      );
    });
    return () => {
      listener.remove();
    };
  }, []);

  const onChangeStatus = () => {
    setStatus(ButtonConnectStatus.START);
    if (!status) {
      startVpn('', 0, '');
    } else {
      stopVpn();
    }
  };

  const onClickAuthor = () => {
    Linking.canOpenURL(configs.HOMEPAGE).then(supported => {
      if (supported) {
        Linking.openURL(configs.HOMEPAGE);
      } else {
        showMessage({
          message: "Don't know how to open URI: " + configs.HOMEPAGE,
          type: 'danger',
        });
      }
    });
  };

  return (
    <>
      <LinearGradient
        colors={['#FFE385', '#ffedb2']}
        style={styles.background}
      />
      <View style={styles.circle} />
      <View style={styles.containerConnect}>
        <View style={styles.containerTop}>
          <Title style={styles.titleLogo}>HEO ĐẾN RỒI</Title>
          <ButtonConnect status={status} onPress={onChangeStatus} />
          <Text style={styles.status}>{messages[status]}</Text>
        </View>
        <Text style={styles.modBy} onPress={onClickAuthor}>
          Mod © GiaYuh
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
  },
  containerConnect: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    zIndex: 3,
  },
  containerTop: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    zIndex: 1,
    width: '230%',
    height: '230%',
    backgroundColor: '#fee591',
  },
  circle: {
    position: 'absolute',
    top: '75%',
    left: 0,
    width: '230%',
    height: '230%',
    zIndex: 2,
    borderRadius: 9999999,
    backgroundColor: '#FEE17F',
    transform: [{rotate: '1deg'}],
  },
  titleLogo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4F4C41',
  },
  status: {
    color: '#E4B208',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.75,
  },
  modBy: {
    color: '#4F4C41',
    fontSize: 12,
    margin: 10,
  },
});
