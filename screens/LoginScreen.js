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
import { Permissions, Notifications } from 'expo';


async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();

  data_saved = global.data_saved;
  api = global.api
  api.post('/register_expo', {
    expo_token: token
  })
  .then(function (response) {
    console.log(response)
  })
  .catch(function (error) {
    console.log(error);
  });
}


export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const {navigate} = this.props.navigation;

    const api = axios.create({
      baseURL: 'http://ec2-54-149-173-164.us-west-2.compute.amazonaws.com/api',
    });
    api.defaults.headers.post['Content-Type'] = 'application/json';
    global.api = api

    async function getApiToken(api, token, _storeData) {
      api.post('/login', {
        token: token
      })
      .then(function (response) {
        global.api.defaults.headers.common['Authorization'] = 'JWT ' + response;
        global.api.defaults.headers.post['Content-Type'] = 'application/json';
        console.log(response)
        registerForPushNotificationsAsync()
        _storeData(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    async function _storeData(token) {
      try {
        global.api_token = token.data.jwt;
        await AsyncStorage.setItem('api_token', token.data.jwt);
        navigate('Home');
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
          await getApiToken(api, token, _storeData)
          // type === 'cancel'
        }
      } catch ({ message }) {
        alert(`Facebook Login Error: ${message}`);
      }
    }
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={() => logIn()} underlayColor="transparent">
          <View style={styles.button}>
            <Text style={styles.buttonText}>Login with Facebook</Text>
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
