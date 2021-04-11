import {Root, Text, Title, View} from 'native-base';
import React, {useState} from 'react';
import {Linking, SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';
import ButtonConnect, {
  ButtonConnectStatus,
} from './src/components/button_connect';

const messages = {
  [ButtonConnectStatus.START]: 'Đã kết nối!',
  [ButtonConnectStatus.STOP]: 'Chưa kết nối!',
  [ButtonConnectStatus.CONNECTING]: 'Đang kết nối...',
};

const App = () => {
  const [status, setStatus] = useState<ButtonConnectStatus>(
    ButtonConnectStatus.STOP,
  );

  const onChangeStatus = () => {
    setStatus(ButtonConnectStatus.START);
  };

  const onClickAuthor = () => {
    Linking.canOpenURL('https://heoapi.giayuh.com').then(supported => {
      if (supported) {
        Linking.openURL('https://heoapi.giayuh.com');
      } else {
        showMessage({
          message: "Don't know how to open URI: " + 'https://heoapi.giayuh.com',
          type: 'danger',
        });
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fee591" />
      <Root style={styles.container}>
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
      </Root>
      <FlashMessage position="top" />
    </SafeAreaView>
  );
};

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

export default App;
