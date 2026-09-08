import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';

export default function AdminLayout() {
  const { user } = useAuthStore();
  const router = useRouter();

  // Gate: redirect non-admins immediately
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    // Redirect on next tick to avoid render-time navigation
    setTimeout(() => router.replace('/(tabs)'), 0);
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FAF7F2' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="products" />
      <Stack.Screen name="customers" />
    </Stack>
  );
}
