import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import LawsScreen from '../screens/LawsScreen';
import LoginScreen from '../screens/LoginScreen';
import DetailsScreen from '../screens/DetailsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Profile from '../screens/Profile';
import LawsDetailsScreen from '../screens/LawDetailsScreen'

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Details: Profile,
  LawsDetails: LawsDetailsScreen
}, {headerMode: 'screen'});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
}, {headerMode: 'screen'});

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-link'}
    />
  ),
};

const LawsStack = createStackNavigator({
  Laws: LawsScreen,
  LawsDetails: LawsDetailsScreen,
}, {headerMode: 'screen'});

LawsStack.navigationOptions = {
  tabBarLabel: 'Laws',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-link'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
}, {headerMode: 'screen'});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options'}
    />
  ),
};

const TabStack =  createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
  LawsStack
},
{headerMode: 'screen'});

const RootStack = createStackNavigator(
  {
    Login: LoginScreen,
    Main: TabStack
  },
  {
    initialRouteName: "Login",
    headerMode: 'none'
  },
);


export default RootStack;
