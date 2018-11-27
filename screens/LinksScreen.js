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
          data: [],
          fixedData: []
      };
  }

  arrayholder = [];

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
      this.setState({token: response});
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
      st.arrayholder = response.data;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  }

  follow = async (item, st) => {

    const api = axios.create({
      baseURL: 'http://ec2-54-149-173-164.us-west-2.compute.amazonaws.com/api',
    });

    console.log("Follow:" , item)
    api.defaults.headers.common['Authorization'] = 'JWT ' + this.state.token;
    api.defaults.headers.post['Content-Type'] = 'application/json';
    api.post('/follow', {
      politician: item
    })
    .then(function (response) {
      console.log(response);
      st.props.navigation.navigate('Home');
    })
    .catch(function (error) {
      console.log(error);

    });
  }

  searchFilterFunction = text => {
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.name.toUpperCase()}
      ${item.name.toUpperCase()} ${item.name.toUpperCase()}`;
       const textData = text.toUpperCase();

       return itemData.indexOf(textData) > -1;
    });
    this.setState({ data: newData });
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>

      <SearchBar
        placeholder="Type Here..."
        lightTheme
        round
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false}
      />

        <FlatList
           data={this.state.data}
           keyExtractor={item => item.id.toString()}
           renderItem={({item}) =>

              <TouchableOpacity style={styles.row} onPress={()=> {navigate('Details', {item: item})}}>
                <Image
                  style={styles.rowImage}
                  source={{uri: item.photoURL}}
                />
                <Text style={styles.rowText}>{item.name}</Text>
                <TouchableOpacity onPress={() => {this.follow(item.user_id,this)}} style={styles.buttonFollow}>
                  <Text style={styles.buttonFollowText}>Follow</Text>
                </TouchableOpacity>
              </TouchableOpacity>

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
  buttonFollow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonFollowText: {
    marginLeft: 15,
    marginTop: 12.5,
  },
});
