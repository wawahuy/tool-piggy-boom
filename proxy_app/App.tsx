import {Container, Content, Header, Root, Title, View} from 'native-base';
import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import ButtonConnect from './src/components/button_connect';
const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Root>
        <Container>
          <Header style={styles.header} androidStatusBarColor="#FF8899">
            <Title style={styles.headerText}>Heo Đến Rồi</Title>
          </Header>
          <Content>
            <View style={styles.containerConnect}>
              <ButtonConnect />
            </View>
          </Content>
        </Container>
      </Root>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerText: {
    color: '#162133',
  },
  containerConnect: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
});

export default App;
