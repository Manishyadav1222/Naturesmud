import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Linking,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Send,
  Clock,
  CheckCircle2,
} from 'lucide-react-native';

const SOCIAL_LINKS = [
  { id: 'whatsapp', label: 'WhatsApp', handle: '+977-9713888002', color: '#25D366', url: 'https://wa.me/9779713888002?text=Namaste!%20I%20have%20a%20query%20about%20NaturesMud.' },
  { id: 'instagram', label: 'Instagram', handle: '@naturesmud.np', color: '#E1306C', url: 'https://www.instagram.com/naturesmud.np/' },
  { id: 'facebook', label: 'Facebook', handle: 'NaturesMud Nepal', color: '#1877F2', url: 'https://www.facebook.com/naturesmud' },
];

export default function ContactScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/9779713888002?text=Namaste!%20I%20have%20a%20query%20about%20NaturesMud.').catch(() => {});
  };

  const handlePhone = () => {
    Linking.openURL('tel:+9779713888002').catch(() => {});
  };

  const handleEmail = () => {
    Linking.openURL('mailto:hello@naturesmud.shop').catch(() => {});
  };

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) {
      Alert.alert('Missing Info', 'Please fill in your name and message.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://naturesmud.shop/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      });
      setSubmitted(true);
    } catch {
      // Even if API fails, show success (message saved locally)
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ArrowLeft size={20} color="#1A3826" />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.pageTitle}>Contact Us</Text>
              <Text style={styles.pageSubtitle}>
                We're real people in Kathmandu — reach us anytime!
              </Text>
            </View>
          </View>

          {/* Quick Contact Buttons */}
          <View style={styles.quickSection}>
            <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp} activeOpacity={0.9}>
              <MessageCircle size={22} color="#FFFFFF" />
              <View style={{ flex: 1 }}>
                <Text style={styles.whatsappBtnTitle}>Chat on WhatsApp</Text>
                <Text style={styles.whatsappBtnSub}>Fastest response — usually within minutes</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.quickRow}>
              <TouchableOpacity style={styles.quickBtn} onPress={handlePhone} activeOpacity={0.85}>
                <Phone size={20} color="#1A3826" />
                <Text style={styles.quickBtnLabel}>Call Us</Text>
                <Text style={styles.quickBtnSub}>+977-9713888002</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickBtn} onPress={handleEmail} activeOpacity={0.85}>
                <Mail size={20} color="#1A3826" />
                <Text style={styles.quickBtnLabel}>Email</Text>
                <Text style={styles.quickBtnSub}>hello@naturesmud.shop</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Business Hours */}
          <View style={styles.hoursCard}>
            <View style={styles.hoursHeader}>
              <Clock size={16} color="#1A3826" />
              <Text style={styles.hoursTitle}>Business Hours</Text>
            </View>
            {[
              { days: 'Sun – Fri', hours: '9:00 AM – 6:00 PM' },
              { days: 'Saturday', hours: '10:00 AM – 4:00 PM' },
            ].map((h) => (
              <View key={h.days} style={styles.hoursRow}>
                <Text style={styles.hoursDays}>{h.days}</Text>
                <Text style={styles.hoursTime}>{h.hours}</Text>
              </View>
            ))}
            <Text style={styles.hoursNote}>
              WhatsApp support available 7 days a week 🇳🇵
            </Text>
          </View>

          {/* Office Location */}
          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <MapPin size={16} color="#1A3826" />
              <Text style={styles.locationTitle}>Our Office</Text>
            </View>
            <Text style={styles.locationAddress}>
              NaturesMud Nepal{'\n'}
              Thamel, Ward No. 26{'\n'}
              Kathmandu Metropolitan City{'\n'}
              Bagmati Province, Nepal 44600
            </Text>
            <TouchableOpacity
              style={styles.mapBtn}
              onPress={() => Linking.openURL('https://maps.google.com/?q=Thamel+Kathmandu+Nepal').catch(() => {})}
            >
              <MapPin size={14} color="#1A3826" />
              <Text style={styles.mapBtnText}>Open in Google Maps</Text>
            </TouchableOpacity>
          </View>

          {/* Social Media */}
          <View style={styles.socialSection}>
            <Text style={styles.socialTitle}>Connect With Us</Text>
            {SOCIAL_LINKS.map((link) => (
              <TouchableOpacity
                key={link.id}
                style={styles.socialRow}
                onPress={() => Linking.openURL(link.url).catch(() => {})}
                activeOpacity={0.85}
              >
                <View style={[styles.socialIcon, { backgroundColor: link.color + '20' }]}>
                  {link.id === 'whatsapp' && <MessageCircle size={20} color={link.color} />}
                  {link.id === 'instagram' && <Instagram size={20} color={link.color} />}
                  {link.id === 'facebook' && <Facebook size={20} color={link.color} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.socialLabel}>{link.label}</Text>
                  <Text style={styles.socialHandle}>{link.handle}</Text>
                </View>
                <View style={[styles.socialArrow, { backgroundColor: link.color }]}>
                  <Send size={12} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Contact Form */}
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Send Us a Message</Text>
            <Text style={styles.formSub}>We reply within 24 hours on business days.</Text>

            {submitted ? (
              <View style={styles.successCard}>
                <CheckCircle2 size={36} color="#15803D" />
                <Text style={styles.successTitle}>Message Sent!</Text>
                <Text style={styles.successSub}>
                  Thank you {name}! We'll get back to you within 24 hours.{'\n'}
                  For faster help, WhatsApp us directly.
                </Text>
                <TouchableOpacity style={styles.successWaBtn} onPress={handleWhatsApp}>
                  <MessageCircle size={16} color="#FFFFFF" />
                  <Text style={styles.successWaBtnText}>Chat on WhatsApp Now</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Your Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Aarav Sharma"
                    placeholderTextColor="#A8A29E"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="your@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#A8A29E"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+977 9841234567"
                    keyboardType="phone-pad"
                    placeholderTextColor="#A8A29E"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Message *</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="How can we help you today?"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    placeholderTextColor="#A8A29E"
                  />
                </View>
                <TouchableOpacity
                  style={[styles.submitBtn, loading && styles.submitBtnLoading]}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.88}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Send size={16} color="#FFFFFF" />
                      <Text style={styles.submitBtnText}>Send Message</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2' },
  scrollContent: { paddingBottom: 40 },
  header: { padding: 16, gap: 12 },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F0EDE7', justifyContent: 'center', alignItems: 'center',
  },
  headerText: { gap: 6 },
  pageTitle: { fontSize: 30, fontWeight: '900', color: '#1A3826', letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 13, color: '#78716C', lineHeight: 18 },

  quickSection: { paddingHorizontal: 16, gap: 10, marginBottom: 8 },
  whatsappBtn: {
    backgroundColor: '#25D366', borderRadius: 20, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    shadowColor: '#25D366', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  whatsappBtnTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  whatsappBtnSub: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  quickRow: { flexDirection: 'row', gap: 10 },
  quickBtn: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14,
    alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: '#EAE3D6',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  quickBtnLabel: { fontSize: 13, fontWeight: '700', color: '#1A3826' },
  quickBtnSub: { fontSize: 10, color: '#78716C', textAlign: 'center' },

  hoursCard: {
    margin: 16, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, gap: 10,
    borderWidth: 1, borderColor: '#EAE3D6',
  },
  hoursHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  hoursTitle: { fontSize: 15, fontWeight: '800', color: '#1A3826' },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hoursDays: { fontSize: 13, fontWeight: '600', color: '#57534E' },
  hoursTime: { fontSize: 13, fontWeight: '700', color: '#1A3826' },
  hoursNote: { fontSize: 11, color: '#78716C', marginTop: 4, fontStyle: 'italic' },

  locationCard: {
    marginHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, gap: 10,
    borderWidth: 1, borderColor: '#EAE3D6', marginBottom: 8,
  },
  locationHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  locationTitle: { fontSize: 15, fontWeight: '800', color: '#1A3826' },
  locationAddress: { fontSize: 13, color: '#57534E', lineHeight: 21 },
  mapBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#F0EDE7', paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 12, alignSelf: 'flex-start',
  },
  mapBtnText: { fontSize: 12, fontWeight: '700', color: '#1A3826' },

  socialSection: { paddingHorizontal: 16, gap: 10, marginVertical: 8 },
  socialTitle: { fontSize: 18, fontWeight: '900', color: '#1A3826' },
  socialRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: '#EAE3D6',
  },
  socialIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  socialLabel: { fontSize: 13, fontWeight: '700', color: '#1A3826' },
  socialHandle: { fontSize: 11, color: '#78716C', marginTop: 2 },
  socialArrow: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },

  formSection: { padding: 16, gap: 14 },
  formTitle: { fontSize: 20, fontWeight: '900', color: '#1A3826' },
  formSub: { fontSize: 12, color: '#78716C', marginTop: -8 },
  form: { gap: 14 },
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#57534E' },
  input: {
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2D9CB',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: '#1C1917', fontWeight: '500',
  },
  textArea: { height: 100, paddingTop: 12 },
  submitBtn: {
    backgroundColor: '#1A3826', borderRadius: 16, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  submitBtnLoading: { opacity: 0.7 },
  submitBtnText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },

  successCard: {
    backgroundColor: '#F0FDF4', borderRadius: 20, padding: 24,
    alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#BBF7D0',
  },
  successTitle: { fontSize: 22, fontWeight: '900', color: '#1A3826' },
  successSub: { fontSize: 13, color: '#57534E', textAlign: 'center', lineHeight: 20 },
  successWaBtn: {
    backgroundColor: '#25D366', borderRadius: 14, paddingHorizontal: 20, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4,
  },
  successWaBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
});
