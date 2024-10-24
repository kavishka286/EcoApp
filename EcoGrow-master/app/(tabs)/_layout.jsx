import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Colors } from '../../constants/Colors';


export default function TabLayout() {
  return (
    <Tabs screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.PRIMARY,
    }}>
        <Tabs.Screen name="Home" 
        options={{
            tabBarLabel: 'Home',
            tabBarLabelStyle: {
                marginBottom: 3,
                fontFamily: 'roboto-bold'
            },
            tabBarIcon: ({color, size}) => (
                <Entypo name="home" size={size} color={color}/>
            )
        }}/>
        <Tabs.Screen name="Journal"
        options={{
            tabBarLabel: 'Journal',
            tabBarLabelStyle: {
                marginBottom: 3,
                fontFamily: 'roboto-bold'
            },
            tabBarIcon: ({color, size}) => (
                <Ionicons name="journal" size={24} color={color} />
            ),
            
        }}
        />
        <Tabs.Screen name="Community"
        options={{
            tabBarLabel: 'Community',
            tabBarLabelStyle: {
                marginBottom: 3,
                fontFamily: 'roboto-bold'
            },
            tabBarIcon: ({color, size}) => (
                <FontAwesome6 name="people-group" size={24} color={color} />
            )
        }}
        />
        <Tabs.Screen name="Sales"
        options={{
            tabBarLabel: 'Sales',
            tabBarLabelStyle: {
                marginBottom: 3,
                fontFamily: 'roboto-bold'
            },
            tabBarIcon: ({color, size}) => (
                <FontAwesome6 name="hand-holding-dollar" size={24} color={color} />
            )
        }}
        />
        <Tabs.Screen name="profile"
        options={{
            tabBarLabel: 'Profile',
            tabBarLabelStyle: {
                marginBottom: 3,
                fontFamily: 'roboto-bold'
            },
            tabBarIcon: ({color, size}) => (
                <Ionicons name="people-circle" size={24} color={color} />
            )
        }}
        />
    </Tabs>
  )
}