import {Button, Spinner, Text, View} from 'native-base';
import React from 'react';

const ButtonConnect = () => {
  return (
    <View>
      <Button
        style={{

          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 40,
          backgroundColor: '#213A78'
        }}>
          <Text>Kết nối</Text>
      </Button>
    </View>
  );
};

export default ButtonConnect;
