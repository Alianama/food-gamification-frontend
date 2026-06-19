import { RootState } from '@/store';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function AdminLayout() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Redirect non-admin users — case-insensitive check
    if (user) {
      const roleName = user.role?.name?.toLowerCase() ?? '';
      if (roleName !== 'admin' && roleName !== 'super_admin') {
        router.replace('/(tabs)' as any);
      }
    }
  }, [user, router]);

  const roleName = user?.role?.name?.toLowerCase() ?? '';
  const isAllowed = roleName === 'admin' || roleName === 'super_admin';

  if (!user || !isAllowed) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  );
}
