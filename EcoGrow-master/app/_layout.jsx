import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import {Provider} from 'react-redux';
import store from '../redux/store';

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    'roboto-regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'roboto-medium': require('../assets/fonts/Roboto-Medium.ttf'),
    'roboto-bold': require('../assets/fonts/Roboto-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Optionally add a fallback or loading indicator
  }

  return (
    <Provider store={store}>
    <Stack screenOptions={{
      headerShown: false,
    }}>
      {/* Ensure splash screen is the first screen */}
      <Stack.Screen name="(splash)" options={{ initialRouteName: '(splash)' }} />
      <Stack.Screen name="(login)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(community)" />
      <Stack.Screen name="(product)" />
      <Stack.Screen name="(journal)" />
      <Stack.Screen name="(sales)" />
      <Stack.Screen name="(encyclopedia)" />
    </Stack>
    </Provider>
  );
}
