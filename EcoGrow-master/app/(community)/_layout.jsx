import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import UpdatePost from './[post]'

export default function _layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="managePosts" />
    <Stack.Screen name="addPost" />
    <Stack.Screen name="[post]" />
    <Stack.Screen name="allPosts"  />
</Stack>

  )
}