import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { store } from '@/store';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

export const unstable_settings = {
  // This tells expo-router to use Stack navigation for (tabs) group
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider value={DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
              statusBarStyle: 'dark',
            }}
          />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              title: 'Modal',
            }}
          />
        </Stack>
        <StatusBar style="dark" />
        <Toast />
      </ThemeProvider>
    </Provider>
  );
}
