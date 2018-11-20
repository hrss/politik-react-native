import React from 'react';
import {
  Alert,
  AsyncStorage,
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import axios from 'axios';

export default class DetailsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const {navigate} = this.props.navigation;

    const api = axios.create({
      baseURL: 'https://063be4cd.ngrok.io/api',
    });
    api.defaults.headers.post['Content-Type'] = 'application/json';

    async function getApiToken(api, token, _storeData) {
      api.post('/Details', {
        token: token
      })
      .then(function (response) {
        console.log(response)
        _storeData(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    async function _storeData(token) {
      try {
        alert(token.data.jwt)
        await AsyncStorage.setItem('api_token', token.data.jwt);
        navigate('Main');
      } catch (error) {
        // Error saving data
      }
    }

    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={() => function (){}} underlayColor="white">
          <View style={styles.button}>
            <Text style={styles.buttonText}>TouchableHighlight</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: 'center'
  },
  button: {
    marginBottom: 30,
    width: 260,
    alignItems: 'center',
    backgroundColor: '#2196F3'
  },
  buttonText: {
    padding: 20,
    color: 'white'
  }
});
