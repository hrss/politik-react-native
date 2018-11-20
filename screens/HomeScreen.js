import React from 'react';
import {
  Alert,
  AsyncStorage,
  Image,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';
import axios from 'axios';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){
      super(props);
      this.state = {
          data: [],
          token: ''
      };
  }

  componentDidMount(){
    async function retrieveData () {
     try {
       const value = await AsyncStorage.getItem('api_token');
       if (value !== null) {
         console.log(value)
         return value
       }
      } catch (error) {
        console.log(error)
      }
    }

    const api = axios.create({
      baseURL: 'https://063be4cd.ngrok.io/api',
    });

    retrieveData().then((response) => {
      console.log("this is the response" + response)
      api.defaults.headers.common['Authorization'] = 'JWT ' + response;
      this.setState({token: response});

      //api.defaults.headers.post['Content-Type'] = 'application/json';
      this.loadProduct(api, this);
    })
    .catch(function (error) {
      console.log(error);
    });

  }


  loadProduct = async (api, st, token) => {
    api.get('/following')

    .then(function (response) {
      // handle success
      console.log(response.data);
      st.setState({data: response.data});
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  }

  Unfollow = async (item, st) => {

    const api = axios.create({
      baseURL: 'https://063be4cd.ngrok.io/api',
    });


      api.defaults.headers.common['Authorization'] = 'JWT ' + this.state.token;
      api.defaults.headers.post['Content-Type'] = 'application/json';
      api.post('/unfollow', {
        politician: item
      })
      .then(function (response) {
        console.log(reponse);
      })
      .catch(function (error) {
        console.log(error);

      });


  }

  renderItem = ({item}) => (
    <View key={item.id} style={styles.row}>
      <Image
        style={styles.rowImage}
        source={{uri: item.photoURL}}
      />
      <Text style={styles.rowText}>{item.user_id}</Text>
      <TouchableOpacity onPress={() =>{this.Unfollow(item.user_id, this)}} style={styles.buttonUnfollow}>
        <Text style={styles.buttonUnfollowText}>Unfollow</Text>
      </TouchableOpacity>
    </View>
  );

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>

        <FlatList
           data={this.state.data}
           keyExtractor={item => item.user_id.toString()}
           renderItem = {this.renderItem }

       />
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  rowImage: {
    width: 50,
    height: 50,
    borderRadius: 50
  },
  rowText: {
    marginLeft: 15,
    marginTop: 12.5
  },
  row: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection:'row',
    marginBottom: 5
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  buttonUnfollow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonUnfollowText: {
    marginLeft: 15,
    marginTop: 12.5,
  },
});
