import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react-native';
import { useUIStore, ToastItem } from '@/store/ui-store';

export function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);

  const getIcon = (type: ToastItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="#FFFFFF" />;
      case 'error':
        return <AlertCircle size={18} color="#FFFFFF" />;
      case 'warning':
        return <AlertTriangle size={18} color="#FFFFFF" />;
      default:
        return <Info size={18} color="#FFFFFF" />;
    }
  };

  const getColors = (type: ToastItem['type']) => {
    switch (type) {
      case 'success':
        return { bg: '#F7FEE7', border: '#BEF264', text: '#365314', iconBg: '#365314' };
      case 'error':
        return { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', iconBg: '#DC2626' };
      case 'warning':
        return { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706', iconBg: '#D97706' };
      default:
        return { bg: '#F5F5F4', border: '#E7E5E4', text: '#1C1917', iconBg: '#365314' };
    }
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => {
        const colors = getColors(toast.type);
        return (
          <View
            key={toast.id}
            style={[styles.toastCard, { backgroundColor: colors.bg, borderColor: colors.border }]}
          >
            <View style={[styles.iconBox, { backgroundColor: colors.iconBg }]}>
              {getIcon(toast.type)}
            </View>
            <View style={styles.textBox}>
              <Text style={[styles.title, { color: colors.text }]}>{toast.title}</Text>
              {toast.message ? <Text style={styles.message}>{toast.message}</Text> : null}
            </View>
            <TouchableOpacity
              onPress={() => removeToast(toast.id)}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={16} color="#78716C" />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
    gap: 8,
    pointerEvents: 'box-none',
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    gap: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  message: {
    fontSize: 12,
    color: '#57534E',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
});