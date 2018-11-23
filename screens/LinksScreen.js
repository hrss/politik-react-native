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
import { ExpoLinksView } from '@expo/samples';
import axios from 'axios';
import { SearchBar } from 'react-native-elements'

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };

  constructor(props){
      super(props);
      this.state = {
          data: []
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
      baseURL: 'http://ec2-54-149-173-164.us-west-2.compute.amazonaws.com/api',
    });

    retrieveData().then((response) => {
      console.log("this is the response" + response)
      api.defaults.headers.common['Authorization'] = 'JWT ' + response;
      //api.defaults.headers.post['Content-Type'] = 'application/json';
      this.loadProduct(api, this);
    })
    .catch(function (error) {
      console.log(error);
    });

  }


  loadProduct = async (api, st) => {
    api.get('/politician')

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

  render() {
    return (
      <View style={styles.container}>

      <SearchBar
      lightTheme
      searchIcon={false}
      onChangeText={function() {}}
      onClear={function(){}}
      placeholder='Type Here...' />

        <FlatList
           data={this.state.data}
           renderItem={({item}) =>
             <View style={styles.row}>
               <Image
                 style={styles.rowImage}
                 source={{uri: item.photoURL}}
               />
               <Text style={styles.rowText}>{item.name}</Text>
             </View>
           }
       />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
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
});
