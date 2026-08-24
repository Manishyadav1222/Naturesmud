'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, TextInput, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { User, Package, Heart, Settings, LogOut, Bell, CreditCard, ShieldCheck, Truck, Star, Gift, ArrowRight, ChevronRight, Edit2, Moon, Sun, HelpCircle, Share2, Lock, Mail, Phone, MapPin } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import { tokenStorage, authApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { ScrollReveal } from '@/components/ScrollReveal';

export default function AccountScreen() {
  const router = useRouter();
  const { user, token, isLoading, setAuth, clearAuth } = useAuthStore();
  const { items: cartItems, getTotalItems } = useCartStore();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const cartCount = getTotalItems();

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsLoggingIn(true);
    try {
      const response = await authApi.login(loginEmail, loginPassword);
      await setAuth(response.user, response.token);
      setShowLoginModal(false);
      setLoginEmail('');
      setLoginPassword('');
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async () => {
    if (!registerName || !registerEmail || !registerPhone || !registerPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (registerPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    setIsRegistering(true);
    try {
      const response = await authApi.register(registerName, registerEmail, registerPhone, registerPassword, registerConfirmPassword);
      await setAuth(response.user, response.token);
      setShowRegisterModal(false);
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPhone('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'Registration failed');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleLogout = async () => {
    await authApi.logout();
    await clearAuth();
  };

  const menuItems = [
    {
      section: 'My Account',
      items: [
        { id: 'orders', icon: Package, label: 'My Orders', badge: '3', onPress: () => router.push('/account/orders') },
        { id: 'addresses', icon: MapPin, label: 'Saved Addresses', onPress: () => router.push('/account/addresses') },
        { id: 'payment', icon: CreditCard, label: 'Payment Methods', onPress: () => router.push('/account/payment') },
        { id: 'wishlist', icon: Heart, label: 'Wishlist', badge: '12', onPress: () => router.push('/favorites') },
        { id: 'reviews', icon: Star, label: 'My Reviews', onPress: () => router.push('/account/reviews') },
      ],
    },
    {
      section: 'Subscriptions & Loyalty',
      items: [
        { id: 'subscribe', icon: Gift, label: 'Subscribe & Save', onPress: () => router.push('/account/subscriptions') },
        { id: 'loyalty', icon: Star, label: 'Loyalty Points', badge: '2,450', onPress: () => router.push('/account/loyalty') },
        { id: 'referrals', icon: Share2, label: 'Refer & Earn', onPress: () => router.push('/account/referrals') },
      ],
    },
    {
      section: 'Settings',
      items: [
        { id: 'profile', icon: User, label: 'Edit Profile', onPress: () => router.push('/account/profile') },
        { id: 'notifications', icon: Bell, label: 'Notifications', onPress: () => router.push('/account/notifications') },
        { id: 'security', icon: Lock, label: 'Security & Privacy', onPress: () => router.push('/account/security') },
        { id: 'appearance', icon: isDarkMode ? Sun : Moon, label: isDarkMode ? 'Light Mode' : 'Dark Mode', onPress: () => setIsDarkMode(!isDarkMode) },
      ],
    },
    {
      section: 'Support',
      items: [
        { id: 'help', icon: HelpCircle, label: 'Help Center', onPress: () => router.push('/help') },
        { id: 'contact', icon: Mail, label: 'Contact Us', onPress: () => router.push('/contact') },
        { id: 'track', icon: Truck, label: 'Track Order', onPress: () => router.push('/track') },
        { id: 'returns', icon: RotateCcw, label: 'Returns & Refunds', onPress: () => router.push('/returns') },
      ],
    },
  ];

  if (!token) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Guest Header */}
        <View style={styles.guestHeader}>
          <View style={styles.guestAvatar}>
            <User style={styles.guestAvatarIcon} />
          </View>
          <Text style={styles.guestTitle}>Welcome to Nature's Mud</Text>
          <Text style={styles.guestDesc}>Sign in to access your orders, wishlist, and personalized recommendations</Text>

          <View style={styles.guestButtons}>
            <TouchableOpacity style={styles.guestButtonPrimary} onPress={() => setShowLoginModal(true)}>
              <Text style={styles.guestButtonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.guestButtonOutline} onPress={() => setShowRegisterModal(true)}>
              <Text style={styles.guestButtonOutlineText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.guestBenefits}>
            <View style={styles.guestBenefit}>
              <ShieldCheck style={styles.guestBenefitIcon} />
              <Text style={styles.guestBenefitText}>Secure Checkout</Text>
            </View>
            <View style={styles.guestBenefit}>
              <Truck style={styles.guestBenefitIcon} />
              <Text style={styles.guestBenefitText}>Free Shipping > Rs. 3,000</Text>
            </View>
            <View style={styles.guestBenefit}>
              <Gift style={styles.guestBenefitIcon} />
              <Text style={styles.guestBenefitText}>Exclusive Member Offers</Text>
            </View>
          </View>
        </View>

        {/* Quick Links for Guests */}
        <View style={styles.quickLinks}>
          <Text style={styles.quickLinksTitle}>Quick Links</Text>
          <View style={styles.quickLinksGrid}>
            {[
              { icon: Package, label: 'Track Order', onPress: () => router.push('/track') },
              { icon: HelpCircle, label: 'Help Center', onPress: () => router.push('/help') },
              { icon: Mail, label: 'Contact Us', onPress: () => router.push('/contact') },
              { icon: RotateCcw, label: 'Returns', onPress: () => router.push('/returns') },
            ].map((item) => (
              <TouchableOpacity key={item.label} style={styles.quickLinkCard} onPress={item.onPress}>
                <View style={styles.quickLinkIconContainer}>
                  <item.icon style={styles.quickLinkIcon} />
                </View>
                <Text style={styles.quickLinkLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Nature's Mud v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2024 Nature's Mud. All rights reserved.</Text>
        </View>
      </ScrollView>
    );
  }

  // Logged in user view
  const recentOrders = [
    { id: 'ORD-2024-001', date: '2024-01-15', status: 'delivered', total: 4599, items: 3 },
    { id: 'ORD-2024-002', date: '2024-01-08', status: 'shipped', total: 2999, items: 2 },
    { id: 'ORD-2024-003', date: '2024-01-02', status: 'processing', total: 6499, items: 5 },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'delivered': return styles.statusDelivered;
      case 'shipped': return styles.statusShipped;
      case 'processing': return styles.statusProcessing;
      default: return styles.statusDefault;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'shipped': return 'Shipped';
      case 'processing': return 'Processing';
      default: return status;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} refreshControl={
      <RefreshControl refreshing={false} onRefresh={() => {}} />
    }>
      {/* User Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.profileAvatarImage} />
          ) : (
            <Text style={styles.profileAvatarInitial}>{user?.name?.charAt(0).toUpperCase()}</Text>
          )}
          {user?.is_active && <View style={styles.verifiedBadge} />}
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          {user?.phone && <Text style={styles.profilePhone}>{user?.phone}</Text>}
        </View>
        <TouchableOpacity style={styles.editProfileButton} onPress={() => router.push('/account/profile')}>
          <Edit2 style={styles.editIcon} />
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <TouchableOpacity style={styles.statCard} onPress={() => router.push('/account/orders')}>
          <Text style={styles.statValue}>{recentOrders.length}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statCard} onPress={() => router.push('/favorites')}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Wishlist</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statCard} onPress={() => router.push('/account/loyalty')}>
          <Text style={styles.statValue}>2,450</Text>
          <Text style={styles.statLabel}>Points</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statCard} onPress={() => router.push('/account/subscriptions')}>
          <Text style={styles.statValue}>2</Text>
          <Text style={styles.statLabel}>Subscriptions</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Orders */}
      <View style={styles.recentOrdersSection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity style={styles.viewAllLink} onPress={() => router.push('/account/orders')}>
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight style={styles.viewAllArrow} />
          </TouchableOpacity>
        </View>
        {recentOrders.map((order) => (
          <TouchableOpacity key={order.id} style={styles.orderCard} onPress={() => router.push(`/account/orders/${order.id}`)}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>{order.id}</Text>
              <View style={[styles.orderStatus, getStatusStyle(order.status)]}>
                <Text style={styles.orderStatusText}>{getStatusText(order.status)}</Text>
              </View>
            </View>
            <View style={styles.orderDetails}>
              <Text style={styles.orderDate}>{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
              <Text style={styles.orderItems}>{order.items} items</Text>
              <Text style={styles.orderTotal}>{formatPrice(order.total)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Menu Sections */}
      {menuItems.map((section, sectionIndex) => (
        <ScrollReveal key={section.section} direction="up" distance={20} delay={sectionIndex * 100}>
          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.section}</Text>
            <View style={styles.menuItems}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
                  <View style={styles.menuItemIconContainer}>
                    <item.icon style={styles.menuItemIcon} />
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemLabel}>{item.label}</Text>
                  </View>
                  {item.badge && (
                    <View style={styles.menuItemBadge}>
                      <Text style={styles.menuItemBadgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <ChevronRight style={styles.menuItemArrow} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollReveal>
      ))}

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>Nature's Mud v1.0.0</Text>
        <Text style={styles.appCopyright}>© 2024 Nature's Mud. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
}

// Login Modal
function LoginModal({ visible, onClose, onSwitchToRegister, email, setEmail, password, setPassword, onLogin, isLoading }: any) {
  if (!visible) return null;

  return (
    <View style={styles.modalOverlay} onTouchStart={onClose}>
      <View style={styles.modalContainer} onTouchStart={(e) => e.stopPropagation()}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Welcome Back</Text>
          <TouchableOpacity style={styles.modalClose} onPress={onClose}>
            <X style={styles.modalCloseIcon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.modalSubtitle}>Sign in to your Nature's Mud account</Text>

        <View style={styles.modalForm}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoCompleteType="email"
            />
          </View>
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Password</Text>
              <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/forgot-password')}>
                <Text style={styles.forgotPasswordText}>Forgot?</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              autoCompleteType="password"
            />
          </View>

          <TouchableOpacity style={[styles.modalButton, isLoading && styles.modalButtonDisabled]} onPress={onLogin} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.modalButtonText}>Sign In</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.modalFooter}>
          <Text style={styles.modalFooterText}>Don't have an account? </Text>
          <TouchableOpacity onPress={onSwitchToRegister}>
            <Text style={styles.modalFooterLink}>Create one</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Register Modal
function RegisterModal({ visible, onClose, onSwitchToLogin, name, setName, email, setEmail, phone, setPhone, password, setPassword, confirmPassword, setConfirmPassword, onRegister, isLoading }: any) {
  if (!visible) return null;

  return (
    <View style={styles.modalOverlay} onTouchStart={onClose}>
      <View style={styles.modalContainer} onTouchStart={(e) => e.stopPropagation()}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Create Account</Text>
          <TouchableOpacity style={styles.modalClose} onPress={onClose}>
            <X style={styles.modalCloseIcon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.modalSubtitle}>Join Nature's Mud for exclusive benefits</Text>

        <View style={styles.modalForm}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
              autoCapitalize="words"
              autoCompleteType="name"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoCompleteType="email"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+977 98XXXXXXXX"
              keyboardType="phone-pad"
              autoCompleteType="tel"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              autoCompleteType="new-password"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              secureTextEntry
              autoCompleteType="new-password"
            />
          </View>

          <TouchableOpacity style={[styles.modalButton, isLoading && styles.modalButtonDisabled]} onPress={onRegister} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.modalButtonText}>Create Account</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.modalFooter}>
          <Text style={styles.modalFooterText}>Already have an account? </Text>
          <TouchableOpacity onPress={onSwitchToLogin}>
            <Text style={styles.modalFooterLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Need to import missing components
import { RefreshControl, ActivityIndicator, X } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF5',
  },
  guestHeader: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
    gap: 16,
  },
  guestAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F7EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestAvatarIcon: {
    color: '#365314',
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2B2B2B',
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  guestDesc: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Inter_400Regular',
  },
  guestButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  guestButtonPrimary: {
    backgroundColor: '#365314',
    borderRadius: 9999,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  guestButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  guestButtonOutline: {
    borderWidth: 1,
    borderColor: '#365314',
    borderRadius: 9999,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  guestButtonOutlineText: {
    color: '#365314',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  guestBenefits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
    paddingHorizontal: 20,
  },
  guestBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(43, 43, 43, 0.12)',
  },
  guestBenefitIcon: {
    color: '#365314',
  },
  guestBenefitText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  quickLinks: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  quickLinksTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2B2B2B',
    marginBottom: 16,
    fontFamily: 'Poppins_700Bold',
  },
  quickLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  quickLinkCard: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickLinkIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F7EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickLinkIcon: {
    color: '#365314',
  },
  quickLinkLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2B2B2B',
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  appInfo: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  appVersion: {
    fontSize: 13,
    color: '#2B2B2B',
    opacity: 0.5,
    fontFamily: 'Inter_400Regular',
  },
  appCopyright: {
    fontSize: 11,
    color: '#2B2B2B',
    opacity: 0.4,
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  profileAvatar: {
    position: 'relative',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F5F7EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
  },
  profileAvatarInitial: {
    fontSize: 28,
    fontWeight: '700',
    color: '#365314',
    fontFamily: 'Poppins_700Bold',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  profileEmail: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  profilePhone: {
    fontSize: 13,
    color: '#2B2B2B',
    opacity: 0.5,
    fontFamily: 'Inter_400Regular',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8F4EC',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editIcon: {
    color: '#365314',
  },
  editText: {
    color: '#365314',
    fontWeight: '600',
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2B2B2B',
    fontFamily: 'Poppins_800ExtraBold',
  },
  statLabel: {
    fontSize: 12,
    color: '#2B2B2B',
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  recentOrdersSection: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  viewAllLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#365314',
    fontFamily: 'Poppins_600SemiBold',
  },
  viewAllArrow: {
    color: '#365314',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  orderStatus: {
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusDelivered: {
    backgroundColor: '#ECFDF5',
  },
  statusShipped: {
    backgroundColor: '#EFF6FF',
  },
  statusProcessing: {
    backgroundColor: '#FEFCE8',
  },
  statusDefault: {
    backgroundColor: '#F3F4F6',
  },
  orderStatusText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  orderDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  orderDate: {
    fontSize: 12,
    color: '#2B2B2B',
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  orderItems: {
    fontSize: 12,
    color: '#2B2B2B',
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#365314',
    fontFamily: 'Poppins_700Bold',
  },
  menuSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  menuSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2B2B2B',
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
    fontFamily: 'Poppins_600SemiBold',
  },
  menuItems: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(43, 43, 43, 0.08)',
  },
  menuItemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F4EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemIcon: {
    color: '#365314',
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2B2B2B',
    fontFamily: 'Inter_500Medium',
  },
  menuItemBadge: {
    backgroundColor: '#365314',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  menuItemBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  menuItemArrow: {
    color: '#2B2B2B',
    opacity: 0.3,
  },
  logoutSection: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    paddingVertical: 16,
  },
  logoutIcon: {
    color: '#EF4444',
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseIcon: {
    color: '#2B2B2B',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.6,
    marginBottom: 24,
    fontFamily: 'Inter_400Regular',
  },
  modalForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  forgotPassword: {
    padding: 4,
  },
  forgotPasswordText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#365314',
    fontFamily: 'Poppins_600SemiBold',
  },
  input: {
    backgroundColor: '#F8F4EC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2B2B2B',
    fontFamily: 'Inter_400Regular',
  },
  modalButton: {
    backgroundColor: '#365314',
    borderRadius: 9999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonDisabled: {
    opacity: 0.7,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  modalFooterText: {
    fontSize: 14,
    color: '#2B2B2B',
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  modalFooterLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#365314',
    fontFamily: 'Poppins_600SemiBold',
  },
});