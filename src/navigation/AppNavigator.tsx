import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Platform } from 'react-native';

import WebViewScreen from '../screens/WebViewScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import { TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'WebViewTab') {
              iconName = focused ? 'globe' : 'globe-outline';
            } else if (route.name === 'VideoPlayerTab') {
              iconName = focused ? 'play-circle' : 'play-circle-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e5e5e5',
            paddingTop: 8,
            paddingBottom: Platform.OS === 'ios' ? 25 : 12,
            height: Platform.OS === 'ios' ? 88 : 70,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            position: 'absolute', // This helps avoid conflicts
            bottom: 0,
            left: 0,
            right: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          },
          tabBarHideOnKeyboard: true, // Hide tab bar when keyboard is open
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTintColor: '#ffffff',
        })}
      >
        <Tab.Screen
          name="WebViewTab"
          component={WebViewScreen}
          options={{
            title: 'WebView',
            headerTitle: 'Web Browser',
          }}
        />
        <Tab.Screen
          name="VideoPlayerTab"
          component={VideoPlayerScreen}
          options={{
            title: 'Video Player',
            headerTitle: 'HLS Video Player',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AppNavigator;
