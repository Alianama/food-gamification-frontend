import type { RootState } from '@/store';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { accessToken, loading } = useSelector((s: RootState) => s.auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !accessToken) {
      router.replace('/lobby');
    }
  }, [accessToken, loading]);

  if (loading && !accessToken) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (accessToken) return <>{children}</>;

  return null;
}
