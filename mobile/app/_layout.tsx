import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { Providers } from '@/providers/Providers';
import { useAuthStore } from '@/store/auth-store';
import { useUIStore } from '@/store/ui-store';

export default function RootLayout() {
  const { isLoading, getStoredToken } = useAuthStore();
  const { isOnline, setIsOnline } = useUIStore();

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
    // Initialize stored auth token
    const initAuth = async () => {
      await getStoredToken();
    };
    initAuth();
  }, [getStoredToken]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#365314" />
        <Text style={styles.loadingText}>Nature's Mud Nepal...</Text>
      </View>
    );
  }

  return (
    <Providers>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>📡 Offline Mode · Browsing Cached Himalayan Harvest</Text>
        </View>
      )}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: styles.screenContent,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="products/[slug]" options={{ headerShown: false }} />
        <Stack.Screen name="checkout" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="register" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="search" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="track-order" options={{ headerShown: false }} />
        <Stack.Screen name="health-benefits" options={{ headerShown: false }} />
      </Stack>
    </Providers>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF9F6',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#365314',
  },
  screenContent: {
    backgroundColor: '#FAF9F6',
  },
  offlineBanner: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 6,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  offlineText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
});