import {Button, Spinner, Text, View} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';

export enum ButtonConnectStatus {
  START,
  STOP,
  CONNECTING,
}

export interface ButtonConnectProps {
  onPress?: () => void;
  status?: ButtonConnectStatus;
}

function getContentButton(status: ButtonConnectStatus | undefined) {
  switch (status) {
    case ButtonConnectStatus.START:
      return <Text style={styles.textBtn}>Tắt</Text>;
    case ButtonConnectStatus.STOP:
      return <Text style={styles.textBtn}>Mở</Text>;
    case ButtonConnectStatus.CONNECTING:
      return <Spinner color="#fee591" />;
    default:
      return <></>;
  }
}

const ButtonConnect = (props: ButtonConnectProps) => {
  return (
    <View>
      <Button rounded style={styles.button} onPress={props.onPress}>
        {getContentButton(props.status)}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 90,
    width: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  textBtn: {
    color: '#555555',
    fontWeight: 'bold',
  },
});

export default ButtonConnect;
