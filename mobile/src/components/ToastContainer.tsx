'use client';

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react-native';
import { useUIStore } from '@/store/ui-store';

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastColors = {
  success: '#059669',
  error: '#EF4444',
  info: '#3B82F6',
  warning: '#F59E0B',
};

const toastBgColors = {
  success: '#ECFDF5',
  error: '#FEF2F2',
  info: '#EFF6FF',
  warning: '#FFFBEB',
};

export function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);
  const [animations, setAnimations] = useState<Record<string, Animated.Value>>({});

  // Initialize animations for new toasts
  useEffect(() => {
    toasts.forEach((toast) => {
      if (!animations[toast.id]) {
        const anim = new Animated.Value(0);
        setAnimations((prev) => ({ ...prev, [toast.id]: anim }));
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }
    });
  }, [toasts, animations]);

  const renderToast = (toast: any) => {
    const anim = animations[toast.id];
    if (!anim) return null;

    const translateY = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });

    const opacity = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const IconComponent = toastIcons[toast.type];
    const color = toastColors[toast.type];
    const bgColor = toastBgColors[toast.type];

    return (
      <Animated.View
        key={toast.id}
        style={[
          styles.toast,
          { transform: [{ translateY }], opacity, backgroundColor: bgColor },
        ]}
      >
        <View style={styles.toastContent}>
          <View style={[styles.iconWrapper, { backgroundColor: color }]}>
            <IconComponent style={styles.icon} />
          </View>
          <View style={styles.toastTexts} flex={1}>
            <Text style={[styles.toastTitle, { color }]}>{toast.title}</Text>
            {toast.message && (
              <Text style={styles.toastMessage}>{toast.message}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => removeToast(toast.id)}
          >
            <X style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
        <Animated.View
          style={[
            styles.progressBar,
            { backgroundColor: color },
          ]}
        >
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['100%', '0%'],
                }),
              },
            ]}
          />
        </Animated.View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map(renderToast)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
    pointerEvents: 'none',
    gap: 8,
  },
  toast: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    overflow: 'hidden',
    pointerEvents: 'auto',
    minWidth: 280,
    maxWidth: '100%',
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  icon: {
    color: '#FFFFFF',
  },
  toastTexts: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  toastTitle: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  toastMessage: {
    fontSize: 13,
    color: '#2B2B2B',
    opacity: 0.8,
    fontFamily: 'Inter_400Regular',
  },
  closeButton: {
    padding: 4,
    marginTop: 2,
  },
  closeIcon: {
    color: '#2B2B2B',
    opacity: 0.5,
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  progressFill: {
    height: '100%',
  },
});