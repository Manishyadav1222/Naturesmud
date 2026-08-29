import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Mail, Check } from 'lucide-react-native';
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
      setMessage(error?.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  if (variant === 'card') {
    return (
      <View style={styles.cardContainer}>
        {showLabel && <Text style={styles.cardLabel}>Stay in the loop</Text>}
        <Text style={styles.cardDesc}>Get 10% off your first order + wellness tips from the Himalayas</Text>
        <View style={styles.inputWrapper}>
          <Mail size={18} color="#78716C" />
          <TextInput
            style={styles.cardInput}
            placeholder={placeholder}
            placeholderTextColor="#A8A29E"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          style={[styles.cardButton, status === 'loading' && styles.buttonLoading]}
          onPress={handleSubmit}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : status === 'success' ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Check size={16} color="#FFFFFF" />
              <Text style={styles.cardButtonText}>Subscribed!</Text>
            </View>
          ) : (
            <Text style={styles.cardButtonText}>{buttonText}</Text>
          )}
        </TouchableOpacity>
        {message ? (
          <Text style={[styles.message, status === 'success' ? styles.messageSuccess : styles.messageError]}>
            {message}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showLabel && <Text style={styles.label}>Subscribe for Himalayan Harvest Updates</Text>}
      <View style={styles.inputWrapper}>
        <Mail size={18} color="#78716C" />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#A8A29E"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[styles.button, status === 'loading' && styles.buttonLoading]}
          onPress={handleSubmit}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>{buttonText}</Text>
          )}
        </TouchableOpacity>
      </View>
      {message ? (
        <Text style={[styles.message, status === 'success' ? styles.messageSuccess : styles.messageError]}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1917',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    paddingLeft: 12,
    paddingRight: 4,
    height: 48,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1C1917',
  },
  button: {
    backgroundColor: '#365314',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonLoading: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    gap: 10,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1917',
  },
  cardDesc: {
    fontSize: 12,
    color: '#78716C',
    lineHeight: 16,
  },
  cardInput: {
    flex: 1,
    fontSize: 14,
    color: '#1C1917',
  },
  cardButton: {
    backgroundColor: '#365314',
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  message: {
    fontSize: 12,
    marginTop: 4,
  },
  messageSuccess: {
    color: '#16A34A',
  },
  messageError: {
    color: '#DC2626',
  },
});