import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="productDetail" />
        <Stack.Screen name="CartScreen" />
        <Stack.Screen name="MyOrders" />
        <Stack.Screen name="OrderDetail" />
        <Stack.Screen name="ShippingDetails" />
    </Stack>
  )
}