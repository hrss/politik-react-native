import React from 'react';
import {
  AsyncStorage,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import axios from 'axios';

export default class DetailsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.state = {
        data: []
    };
  }
  componentDidMount(){
    const item = this.props.navigation.getParam('item');
    this.loadRequest(global.api,this,item);
  }

  loadRequest(api, st, item) {
    api.post('/get_votes_for_law', {
      law_id: item.id
    })
    .then(function (response) {
      //console.log(response)
      st.setState({data: response.data});
      console.log(st.state.data)
    })
    .catch(function (error) {
      console.log(error);
    });
  }



  renderFail = () => {
    <View><Text>Fail\n</Text></View>
  }

  render() {
    const {navigate} = this.props.navigation;
    const out_item = this.props.navigation.getParam('item');
    const api = axios.create({
      baseURL: 'http://ec2-54-149-173-164.us-west-2.compute.amazonaws.com/api',
    });
    api.defaults.headers.post['Content-Type'] = 'application/json';

    voteInterpretate = (vote) => {
      if (vote === 'null') {
        return 'Não votou';
      } else if (vote) {
          return 'Sim';
      } else {
        return 'Nao';
      }
    }

    return (
      // <View style={styles.container}>
      //     <Text style={styles.name}>{item.name}</Text>
      //     <Image style={styles.photo}
      //       source={{uri: item.photoURL}}
      //     />
      // </View>
      

      
      <ScrollView>
          
          <Text style={styles.header}><Text>Lei</Text></Text>
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.name}>{out_item.name}</Text>
              <Text style={styles.info}>Resumo:</Text>
              <Text style={styles.description}>{out_item.description}</Text>
              <Text style={styles.info}>Votes:</Text>
              
            </View>
            <FlatList
                  data={this.state.data}
                  keyExtractor = { item => item.pol_id.toString()}
                  renderItem={({item}) => 
                    <TouchableOpacity style={styles.row}>        
                      <Image
                        style={styles.rowImage}
                        source={{uri: item.photo_url}}
                      />
                      <Text style={styles.rowText}>{item.pol_name}</Text>
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonUnfollow}>
                            <Text style={styles.buttonUnfollowText}>{voteInterpretate(item.vote)}</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  
                  }
              />
        </View>
      </ScrollView>
    );
  }
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
    flexDirection:'row',
    marginBottom: 5
  },

  header:{
    backgroundColor: "#00BFFF",
    fontSize: 20,
    textAlign: 'center',
    marginTop: 30
  },
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  body:{
    marginTop:0,
    flex: 1,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  buttonContainer: {
    position: 'absolute',
    right: 0,
  },
  buttonUnfollow: {
    justifyContent: 'center',
    height:45,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:20,
    width:100,
    borderRadius:30,
    backgroundColor: "#00BFFF",
  },
  buttonUnfollowText: {
    padding: 10,
    color: 'white'
  },

});
