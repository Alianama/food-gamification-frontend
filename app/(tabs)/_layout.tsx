import CustomBottomBar from '@/components/custom-bottom-bar';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { RootState } from '@/store';
import { Redirect, Slot } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  if (!accessToken) {
    return <Redirect href="/lobby" />;
  }

  return (
    <View
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
    >
      <Slot />
      <CustomBottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
