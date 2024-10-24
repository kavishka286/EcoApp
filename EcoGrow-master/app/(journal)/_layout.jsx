import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AddJournal"/>
        <Stack.Screen name="ManageJournal"/>
        <Stack.Screen name="ViewJournal"/>
        <Stack.Screen name="JournalDetail"/>
        <Stack.Screen name='UpdateJournal'/>
    </Stack>
  )
}