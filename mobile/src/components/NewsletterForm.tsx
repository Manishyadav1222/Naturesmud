'use client';

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Mail, Check, Loader2 } from 'lucide-react-native';
import { newsletterApi } from '@/lib/api';

interface NewsletterFormProps {
  variant?: 'inline' | 'card' | 'minimal';
  showLabel?: boolean;
  placeholder?: string;
  buttonText?: string;
  onSuccess?: () => void;
}

export function NewsletterForm({
  variant = 'inline',
  showLabel = true,
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  onSuccess,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      await newsletterApi.subscribe(email);
      setStatus('success');
      setMessage('Thanks for subscribing! Check your email for a 10% off code.');
      setEmail('');
      onSuccess?.();
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  if (variant === 'minimal') {
    return (
      <View style={styles.minimalContainer}>
        <TextInput
          style={styles.minimalInput}
          placeholder={placeholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          onSubmitEditing={handleSubmit}
        />
        <TouchableOpacity
          style={[styles.minimalButton, status === 'loading' && styles.buttonLoading]}
          onPress={handleSubmit}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <Loader2 style={styles.loader} />
          ) : status === 'success' ? (
            <Check style={styles.successIcon} />
          ) : (
            <Mail style={styles.buttonIcon} />
          )}
        </TouchableOpacity>
      </View>
    );
  }

  if (variant === 'card') {
    return (
      <View style={styles.cardContainer}>
        {showLabel && <Text style={styles.cardLabel}>Stay in the loop</Text>}
        <Text style={styles.cardDesc}>Get 10% off your first order + wellness tips from the Himalayas</Text>
        <View style={styles.inputWrapper}>
          <Mail style={styles.inputIcon} />
          <TextInput
            style={styles.cardInput}
            placeholder={placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            onSubmitEditing={handleSubmit}
          />
        </View>
        <TouchableOpacity
          style={[styles.cardButton, status === 'loading' && styles.buttonLoading]}
          onPress={handleSubmit}
          disabled={status === 'loading' || !isValidEmail(email)}
        >
          {status === 'loading' ? (
            <Loader2 style={styles.loader} />
          ) : status === 'success' ? (
            <>
              <Check style={styles.successIcon} />
              <Text style={styles.cardButtonText}>Subscribed!</Text>
            </>
          ) : (
            <Text style={styles.cardButtonText}>{buttonText}</Text>
          )}
        </TouchableOpacity>
        {message && <Text style={[styles.message, status === 'success' && styles.messageSuccess, status === 'error' && styles.messageError]}>{message}</Text>}
      </View>
    );
  }

  // Default inline variant
  return (
    <View style={styles.container}>
      {showLabel && <Text style={styles.label}>Email Address</Text>}
      <View style={styles.inputWrapper}>
        <Mail style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          onSubmitEditing={handleSubmit}
        />
        <TouchableOpacity
          style={[styles.button, status === 'loading' && styles.buttonLoading]}
          onPress={handleSubmit}
          disabled={status === 'loading' || !isValidEmail(email)}
        >
          {status === 'loading' ? (
            <Loader2 style={styles.loader} />
          ) : (
            <Text style={styles.buttonText}>{buttonText}</Text>
          )}
        </TouchableOpacity>
      </View>
      {message && <Text style={[styles.message, status === 'success' && styles.messageSuccess, status === 'error' && styles.messageError]}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.1)',
    overflow: 'hidden',
  },
  inputIcon: {
    color: '#2B2B2B',
    opacity: 0.4,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 12,
    fontSize: 15,
    color: '#2B2B2B',
    fontFamily: 'Inter_400Regular',
  },
  button: {
    backgroundColor: '#365314',
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLoading: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
  },
  message: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  messageSuccess: {
    color: '#059669',
  },
  messageError: {
    color: '#EF4444',
  },

  // Card variant
  cardContainer: {
    gap: 12,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
  },
  cardDesc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Inter_400Regular',
  },
  cardInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#2B2B2B',
    fontFamily: 'Inter_400Regular',
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D9A441',
    borderRadius: 9999,
    paddingVertical: 16,
  },
  cardButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
  },
  successIcon: {
    color: '#FFFFFF',
  },

  // Minimal variant
  minimalContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  minimalInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 15,
    color: '#2B2B2B',
    fontFamily: 'Inter_400Regular',
  },
  minimalButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#365314',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    color: '#FFFFFF',
  },
  loader: {
    color: '#FFFFFF',
  },
});