import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Slot, Stack } from 'expo-router';
import { Providers } from '@/providers/Providers';
import { useAuthStore } from '@/store/auth-store';
import { useUIStore } from '@/store/ui-store';
import { theme } from '@/theme';

export default function RootLayout() {
  const { isLoading, getStoredToken } = useAuthStore();
  const { setIsOnline } = useUIStore();

  useEffect(() => {
    // Check online status
    const checkOnline = async () => {
      try {
        const response = await fetch('https://www.google.com', { method: 'HEAD', cache: 'no-cache' });
        setIsOnline(response.ok);
      } catch {
        setIsOnline(false);
      }
    };
    checkOnline();
    const interval = setInterval(checkOnline, 30000);
    return () => clearInterval(interval);
  }, [setIsOnline]);

  useEffect(() => {
    // Initialize auth
    const initAuth = async () => {
      const token = await getStoredToken();
      // Token validation would happen here
    };
    initAuth();
  }, [getStoredToken]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#365314" />
        <Text style={styles.loadingText}>Loading Nature's Mud...</Text>
      </View>
    );
  }

  return (
    <Providers>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: styles.screenContent,
        }}
      >
        <Slot />
      </Stack>
    </Providers>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAF5',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  screenContent: {
    backgroundColor: '#FAFAF5',
  },
});