import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="addProduct" />
            <Stack.Screen name="manageProduct" />
            <Stack.Screen name="[product]" />
            <Stack.Screen name="SalesId" />
            <Stack.Screen name="SaleCategory" />
        </Stack>

    )
}