import ErrorBoundary from '@/components/error-boundary';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { store } from '@/store';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <ThemeProvider value={DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="login"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="admin"
              options={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
          </Stack>
          <StatusBar style="dark" />
          <Toast />
        </ThemeProvider>
      </ErrorBoundary>
    </Provider>
  );
}
