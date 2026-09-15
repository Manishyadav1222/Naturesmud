import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Building2,
  Package,
  Truck,
  BarChart3,
  Shield,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  Send,
} from 'lucide-react-native';

const BENEFITS = [
  { icon: 'percent', title: 'Wholesale Pricing', desc: 'Up to 40% off retail prices on bulk orders. Tiered pricing by volume.' },
  { icon: 'truck', title: 'Priority Shipping', desc: 'Dedicated logistics with bulk freight options across Nepal and internationally.' },
  { icon: 'support', title: 'Dedicated Support', desc: 'Your personal account manager, WhatsApp hotline, and monthly check-ins.' },
  { icon: 'custom', title: 'Custom Packaging', desc: 'White-label and co-branded packaging available for orders above 500 units.' },
];

const MIN_ORDERS = [
  { category: 'Powders (Moringa, Dates, Beetroot)', min: '10 kg', price: 'From Rs. 800/kg' },
  { category: 'Seeds (Chia, Pumpkin, Flax)', min: '5 kg', price: 'From Rs. 450/kg' },
  { category: 'Shilajit Resin', min: '500g', price: 'From Rs. 2,200/100g' },
  { category: 'Wild Honey', min: '5L', price: 'From Rs. 900/500ml' },
  { category: 'Nuts & Dried Fruits', min: '10 kg', price: 'From Rs. 600/kg' },
];

export default function WholesaleScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    email: '',
    city: '',
    businessType: '',
    monthlyVolume: '',
    products: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.businessName || !form.ownerName || !form.phone) {
      Alert.alert('Missing Info', 'Please fill in your business name, owner name, and phone.');
      return;
    }
    setLoading(true);
    try {
      await fetch('https://naturesmud.shop/api/wholesale/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const IconComp = ({ type, size, color }: { type: string; size: number; color: string }) => {
    switch (type) {
      case 'percent': return <BarChart3 size={size} color={color} />;
      case 'truck': return <Truck size={size} color={color} />;
      case 'support': return <MessageCircle size={size} color={color} />;
      case 'custom': return <Package size={size} color={color} />;
      default: return <Shield size={size} color={color} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ArrowLeft size={20} color="#1A3826" />
            </TouchableOpacity>
            <View style={styles.heroCard}>
              <Building2 size={28} color="#FFFFFF" />
              <Text style={styles.heroTitle}>Become a Distributor</Text>
              <Text style={styles.heroSub}>
                Join 200+ retail partners, hospitals, restaurants and wellness brands across Nepal powered by NaturesMud wholesale.
              </Text>
            </View>
          </View>

          {/* Benefits */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why Partner With Us?</Text>
            {BENEFITS.map((b) => (
              <View key={b.title} style={styles.benefitRow}>
                <View style={styles.benefitIcon}>
                  <IconComp type={b.icon} size={20} color="#1A3826" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitTitle}>{b.title}</Text>
                  <Text style={styles.benefitDesc}>{b.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Minimum Orders */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Minimum Order Quantities</Text>
            <View style={styles.moqTable}>
              <View style={styles.moqHeader}>
                <Text style={[styles.moqCell, styles.moqHeaderText, { flex: 2 }]}>Product Category</Text>
                <Text style={[styles.moqCell, styles.moqHeaderText]}>Min Qty</Text>
                <Text style={[styles.moqCell, styles.moqHeaderText]}>Price</Text>
              </View>
              {MIN_ORDERS.map((row, idx) => (
                <View key={row.category} style={[styles.moqRow, idx % 2 === 1 && styles.moqRowAlt]}>
                  <Text style={[styles.moqCell, { flex: 2, fontSize: 11 }]} numberOfLines={2}>{row.category}</Text>
                  <Text style={[styles.moqCell, styles.moqMinText]}>{row.min}</Text>
                  <Text style={[styles.moqCell, { fontSize: 10, color: '#1A3826' }]}>{row.price}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Application Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Apply for Wholesale</Text>
            <Text style={styles.formSub}>Our team will contact you within 48 hours.</Text>

            {submitted ? (
              <View style={styles.successCard}>
                <CheckCircle2 size={40} color="#15803D" />
                <Text style={styles.successTitle}>Application Received!</Text>
                <Text style={styles.successSub}>
                  Thank you for your interest. Our wholesale team will contact {form.ownerName || 'you'} within 2 business days on {form.phone || 'your phone'}.
                </Text>
                <TouchableOpacity
                  style={styles.waSuccessBtn}
                  onPress={() => {
                    const msg = `Namaste! I just applied for NaturesMud wholesale. My business: ${form.businessName}.`;
                    require('react-native').Linking.openURL(`https://wa.me/9779713888002?text=${encodeURIComponent(msg)}`).catch(() => {});
                  }}
                >
                  <MessageCircle size={16} color="#FFFFFF" />
                  <Text style={styles.waSuccessBtnText}>Speed up on WhatsApp</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.form}>
                {[
                  { key: 'businessName', label: 'Business / Shop Name *', placeholder: 'Himalayan Organic Store' },
                  { key: 'ownerName', label: 'Owner / Manager Name *', placeholder: 'Aarav Sharma' },
                  { key: 'phone', label: 'Phone Number *', placeholder: '+977 9841234567', keyboardType: 'phone-pad' as const },
                  { key: 'email', label: 'Email', placeholder: 'store@example.com', keyboardType: 'email-address' as const },
                  { key: 'city', label: 'City / District', placeholder: 'Kathmandu' },
                  { key: 'businessType', label: 'Business Type', placeholder: 'e.g. Retail, Restaurant, Hospital, Gym...' },
                  { key: 'monthlyVolume', label: 'Estimated Monthly Volume', placeholder: 'e.g. 50 kg, Rs. 20,000/month' },
                  { key: 'products', label: 'Products You\'re Interested In', placeholder: 'Shilajit, Chia Seeds, Dates Powder...' },
                ].map((field) => (
                  <View key={field.key} style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{field.label}</Text>
                    <TextInput
                      style={styles.input}
                      value={form[field.key as keyof typeof form]}
                      onChangeText={(v) => updateForm(field.key as keyof typeof form, v)}
                      placeholder={field.placeholder}
                      placeholderTextColor="#A8A29E"
                      keyboardType={field.keyboardType || 'default'}
                      autoCapitalize={field.key === 'email' ? 'none' : 'words'}
                    />
                  </View>
                ))}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Additional Notes</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={form.message}
                    onChangeText={(v) => updateForm('message', v)}
                    placeholder="Any specific requirements or questions..."
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    placeholderTextColor="#A8A29E"
                  />
                </View>
                <TouchableOpacity
                  style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Send size={16} color="#FFFFFF" />
                      <Text style={styles.submitBtnText}>Submit Wholesale Application</Text>
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
  header: { padding: 16, gap: 14 },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F0EDE7', justifyContent: 'center', alignItems: 'center',
  },
  heroCard: {
    backgroundColor: '#1A3826', borderRadius: 24, padding: 24, gap: 10,
  },
  heroTitle: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.3 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 20 },
  section: { paddingHorizontal: 16, gap: 12, marginBottom: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#1A3826' },
  benefitRow: {
    flexDirection: 'row', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: '#EAE3D6', alignItems: 'flex-start',
  },
  benefitIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#DCFCE7',
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  benefitTitle: { fontSize: 14, fontWeight: '800', color: '#1A3826', marginBottom: 3 },
  benefitDesc: { fontSize: 12, color: '#78716C', lineHeight: 17 },
  moqTable: {
    backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: '#EAE3D6',
  },
  moqHeader: { flexDirection: 'row', backgroundColor: '#1A3826', padding: 10 },
  moqHeaderText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  moqRow: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderTopColor: '#F5F5F4' },
  moqRowAlt: { backgroundColor: '#FAFAF9' },
  moqCell: { flex: 1, fontSize: 12, color: '#292524' },
  moqMinText: { fontSize: 12, fontWeight: '700', color: '#1A3826' },
  formSub: { fontSize: 12, color: '#78716C', marginTop: -6 },
  form: { gap: 12 },
  inputGroup: { gap: 5 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#57534E' },
  input: {
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2D9CB',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: '#1C1917',
  },
  textArea: { height: 90, paddingTop: 12 },
  submitBtn: {
    backgroundColor: '#1A3826', borderRadius: 16, paddingVertical: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  successCard: {
    backgroundColor: '#F0FDF4', borderRadius: 20, padding: 24, alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: '#BBF7D0',
  },
  successTitle: { fontSize: 22, fontWeight: '900', color: '#1A3826' },
  successSub: { fontSize: 13, color: '#57534E', textAlign: 'center', lineHeight: 20 },
  waSuccessBtn: {
    backgroundColor: '#25D366', borderRadius: 14, paddingHorizontal: 20, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  waSuccessBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
});
