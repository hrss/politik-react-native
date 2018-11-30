import React, { Component } from 'react'
import {
  Animated,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { Icon } from 'react-native-elements'
import {
  TabViewAnimated,
  TabBar,
  TabViewPagerScroll,
  TabViewPagerPan,
} from 'react-native-tab-view'
import PropTypes from 'prop-types'

import axios from 'axios';
import Posts from './Posts'

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 11,
    marginTop: 45,
  },
  indicatorTab: {
    backgroundColor: 'transparent',
  },
  scroll: {
    backgroundColor: '#FFF',
  },
  sceneContainer: {
    marginTop: 10,
  },
  socialIcon: {
    marginLeft: 14,
    marginRight: 14,
  },
  socialRow: {
    flexDirection: 'row',
  },
  tabBar: {
    backgroundColor: '#EEE',
  },
  tabContainer: {
    flex: 1,
    marginBottom: 12,
  },
  tabLabelNumber: {
    color: 'gray',
    fontSize: 12.5,
    textAlign: 'center',
  },
  tabLabelText: {
    color: 'black',
    fontSize: 22.5,
    fontWeight: '600',
    textAlign: 'center',
  },
  userBioRow: {
    marginLeft: 40,
    marginRight: 40,
  },
  userBioText: {
    color: 'gray',
    fontSize: 13.5,
    textAlign: 'center',
  },
  userImage: {
    borderRadius: 60,
    height: 120,
    marginBottom: 10,
    width: 120,
  },
  userNameRow: {
    marginBottom: 10,
  },
  userNameText: {
    color: '#5B5A5A',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 12,
  },
  law: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection:'row',
    marginBottom: 5
  },
  lawText: {
    marginLeft: 15,
    marginTop: 12.5
  },
  buttonUnfollow: {
    justifyContent: 'center',
    height:45,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom:20,
    width:100,
    borderRadius:30,
    backgroundColor: "#00BFFF",
  },
})

class Profile extends Component {
  static navigationOptions = {
    title: 'Politician'
  };

  static propTypes = {
    containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    tabContainerStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        words: PropTypes.string.isRequired,
        sentence: PropTypes.string.isRequired,
        paragraph: PropTypes.string.isRequired,
        image: PropTypes.string,
        user: PropTypes.shape({
          name: PropTypes.string.isRequired,
          username: PropTypes.string.isRequired,
          avatar: PropTypes.string.isRequired,
          email: PropTypes.string.isRequired,
        }),
      })
    ),
  }

  static defaultProps = {
    containerStyle: {},
    tabContainerStyle: {},
  }

  state = {
    tabs: {
      index: 0,
      routes: [
        { key: '1', title: 'active', count: 31 },
        { key: '2', title: 'like', count: 86 },
        { key: '3', title: 'following', count: 95 },
        { key: '4', title: 'followers', count: '1.3 K' },
      ],
    },
    data: [],
    following: "Follow",
  }

  loadProduct = async (api, st) => {
    const item = st.props.navigation.getParam('item');
    api.post('/get_votes_for_politician', {
      pol_id: item.id
    })
    .then(function (response) {
      // handle success
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

  getFollowing = async (api, st) => {
    console.log("jdsalkjfkldlskfjçadfskçljdksjfdasjfçlakfljdlskjflkdskfljdafsjlkdslfkjdksljf");
    api.get('/following')
    .then(function (response) {
      const item = st.props.navigation.getParam('item');
      // handle success
      for (index = 0; index < response.data.length; ++index) {
        console.log(response.data[index])
        if (response.data[index].id === item.id){
          st.setState({following: "Unfollow"});
          console.log("eu sou burro para caralho")
        }
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  }

  onPressPlace = () => {
    console.log('place')
  }

  _handleIndexChange = index => {
    this.setState({
      tabs: {
        ...this.state.tabs,
        index,
      },
    })
  }

  _renderHeader = props => {
    return (
      <TabBar
        {...props}
        indicatorStyle={styles.indicatorTab}
        renderLabel={this._renderLabel(props)}
        pressOpacity={0.8}
        style={styles.tabBar}
      />
    )
  }

  _renderScene = ({ route: { key } }) => {
    const {navigate} = this.props.navigation;
    function evaluateVote(vote) {
      if (vote == null) {
        return "Não votou";
      }

      if (vote) {
        return "Sim";
      }

      return "Não";

    }

    return <FlatList
           data={this.state.data}
           keyExtractor={item => item.law.id.toString()}
           renderItem={({item}) =>
             <View>
               <TouchableOpacity style={styles.law} onPress={()=> {navigate('LawsDetails', {item: item.law})}}>
                 <Text style={styles.lawText}>{item.law.name}</Text>
               </TouchableOpacity>
               <View style={styles.buttonUnfollow}>
                  <Text style={styles.buttonUnfollowText}>{evaluateVote(item.vote)}</Text>
               </View>
             </View>
           }
      />
  }

  _renderLabel = props => ({ route, index }) => {
    const inputRange = props.navigationState.routes.map((x, i) => i)
    const outputRange = inputRange.map(
      inputIndex => (inputIndex === index ? 'black' : 'gray')
    )
    const color = props.position.interpolate({
      inputRange,
      outputRange,
    })

    return (
      <View>
        <Animated.Text style={[styles.tabLabelText, { color }]}>
          {route.count}
        </Animated.Text>
        <Animated.Text style={[styles.tabLabelNumber, { color }]}>
          {route.title}
        </Animated.Text>
      </View>
    )
  }

  _renderPager = props => {
    return Platform.OS === 'ios' ? (
      <TabViewPagerScroll {...props} />
    ) : (
      <TabViewPagerPan {...props} />
    )
  }

  renderContactHeader = () => {
    const {navigate} = this.props.navigation;
    const item = this.props.navigation.getParam('item');

    return (
      <View style={styles.headerContainer}>
        <View style={styles.userRow}>
          <Image
            style={styles.userImage}
            source={{
              uri: item.photoURL,
            }}
          />
          <View style={styles.userNameRow}>
            <Text style={styles.userNameText}>{item.name}</Text>
          </View>
          <View style={styles.userBioRow}>
            <Text style={styles.userBioText}>{item.party} - {item.fu}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => {this.follow(item.user_id,this)}} style={styles.socialRow}>
          <Text>{this.state.following}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  componentDidMount(){
      this.loadProduct(global.api, this);
      this.getFollowing(global.api, this);
  }

  follow = async (item, st) => {

    api = global.api;

    console.log("Follow:" , item)

    if (st.state.following === "Unfollow"){
      api.post('/unfollow', {
        politician: item
      })
      .then(function (response) {
        console.log(response);
        st.setState({following: "Follow"});
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    if (st.state.following === "Follow"){
      api.post('/follow', {
        politician: item
      })
      .then(function (response) {
        console.log(response);
        st.setState({following: "Unfollow"});
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  render() {

    const {navigate} = this.props.navigation;
    const item = this.props.navigation.getParam('item');

    const api = axios.create({
      baseURL: 'http://ec2-54-149-173-164.us-west-2.compute.amazonaws.com/api',
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
        navigate('Home');
      } catch (error) {
        // Error saving data
      }
    }

    return (
      <ScrollView style={styles.scroll}>
        <View style={[styles.container, this.props.containerStyle]}>
          <View style={styles.cardContainer}>
            {this.renderContactHeader()}
            <TabViewAnimated
              style={[styles.tabContainer, this.props.tabContainerStyle]}
              navigationState={this.state.tabs}
              renderScene={this._renderScene}
              renderPager={this._renderPager}
              renderHeader={this._renderHeader}
              onIndexChange={this._handleIndexChange}
            />
          </View>
        </View>
      </ScrollView>
    )
  }
}

export default Profile
