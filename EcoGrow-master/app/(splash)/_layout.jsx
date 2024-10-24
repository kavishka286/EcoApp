import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function Splashlayout() {
  return (
    <Stack screenOptions={{
        headerShown: false
    }}>
        <Stack.Screen name="firstScreen"  />
        <Stack.Screen name="secondScreen"  />
        <Stack.Screen name="thirdScreen"  />
    </Stack>
  )
}