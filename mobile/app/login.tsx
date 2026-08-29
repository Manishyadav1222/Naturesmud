import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Leaf, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, Zap, Lock, Mail } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/lib/api';
import { toast } from '@/store/ui-store';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ redirect?: string }>();
  const { setAuth, loginWithDemo } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter your email address and password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.login(email.trim(), password.trim());
      setAuth(response.user, response.token);
      toast.success('Welcome back!', `Logged in as ${response.user.name}`);

      if (params.redirect) {
        router.replace(params.redirect as any);
      } else {
        router.replace('/(tabs)/account');
      }
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (type: 'customer' | 'wholesale') => {
    loginWithDemo(type);
    toast.success('Demo Mode Active', `Signed in as Demo ${type === 'customer' ? 'Customer' : 'Wholesale Merchant'}`);
    if (params.redirect) {
      router.replace(params.redirect as any);
    } else {
      router.replace('/(tabs)/account');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={22} color="#2B2B2B" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.replace('/(tabs)')}
              style={styles.skipButton}
            >
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </View>

          {/* Header & Logo */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Leaf size={28} color="#365314" />
            </View>
            <Text style={styles.title}>Nature's Mud</Text>
            <Text style={styles.subtitle}>
              Sign in to manage your Himalayan harvest orders & rewards
            </Text>
          </View>

          {/* Demo Quick Logins */}
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>⚡ One-Tap Demo Access</Text>
            <View style={styles.demoButtonsRow}>
              <TouchableOpacity
                style={styles.demoButton}
                onPress={() => handleDemoLogin('customer')}
              >
                <Zap size={16} color="#365314" />
                <Text style={styles.demoButtonText}>Demo Customer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.demoButton, styles.demoButtonWholesale]}
                onPress={() => handleDemoLogin('wholesale')}
              >
                <ShieldCheck size={16} color="#7B5E3B" />
                <Text style={[styles.demoButtonText, { color: '#7B5E3B' }]}>
                  Wholesale
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color="#78716C" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  placeholderTextColor="#A8A29E"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      'Password Reset',
                      'A password reset link will be sent to your registered email in production.'
                    )
                  }
                >
                  <Text style={styles.forgotText}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Lock size={20} color="#78716C" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#A8A29E"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#78716C" />
                  ) : (
                    <Eye size={20} color="#78716C" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Sign In</Text>
                  <ArrowRight size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Register Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/register',
                  params: { redirect: params.redirect },
                })
              }
            >
              <Text style={styles.registerLink}> Create an Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 14,
    color: '#78716C',
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ECFCCB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#78716C',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  demoBox: {
    backgroundColor: '#F7FEE7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#D9F99D',
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#365314',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  demoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#BEF264',
  },
  demoButtonWholesale: {
    borderColor: '#E7E5E4',
  },
  demoButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#365314',
  },
  form: {
    gap: 18,
  },
  inputGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#292524',
  },
  forgotText: {
    fontSize: 13,
    color: '#365314',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#1C1917',
  },
  eyeButton: {
    padding: 8,
  },
  submitButton: {
    backgroundColor: '#365314',
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    shadowColor: '#365314',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  footerText: {
    fontSize: 14,
    color: '#78716C',
  },
  registerLink: {
    fontSize: 14,
    color: '#365314',
    fontWeight: '700',
  },
});
