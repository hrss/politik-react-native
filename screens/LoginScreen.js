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

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const {navigate} = this.props.navigation;

    const api = axios.create({
      baseURL: 'https://c1c735b1.ngrok.io/api',
    });
    api.defaults.headers.post['Content-Type'] = 'application/json';

    async function getApiToken(api, token, _storeData) {
      api.post('/login', {
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

    async function logIn() {
      try {
        const {
          type,
          token,
          expires,
          permissions,
          declinedPermissions,
        } = await Expo.Facebook.logInWithReadPermissionsAsync('324628148088370', {
          permissions: ['email', 'public_profile'],
        });
        if (type === 'success') {
          // Get the user's name using Facebook's Graph API
          const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
          Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
          getApiToken(api, token, _storeData)
        } else {
          // type === 'cancel'
        }
      } catch ({ message }) {
        alert(`Facebook Login Error: ${message}`);
      }
    }
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={() => logIn()} underlayColor="white">
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
