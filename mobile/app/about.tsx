import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Linking,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Leaf,
  Heart,
  Mountain,
  ShieldCheck,
  Award,
  Users,
  Globe,
  ChevronRight,
} from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

const TIMELINE = [
  { year: '2019', title: 'The Vision', desc: 'Founded in Kathmandu with one mission: make pure Himalayan superfoods accessible to every Nepali family.' },
  { year: '2020', title: 'First Products', desc: 'Launched Shilajit Resin and Wild Honey — both hand-harvested from 3,500m+ altitude farms.' },
  { year: '2021', title: 'Expanding Roots', desc: 'Partnered with 50+ small-scale organic farms across Bagmati, Gandaki and Karnali provinces.' },
  { year: '2022', title: 'Baby & Mother Line', desc: 'Introduced zero-additive Dates Powder and Moringa for pediatric nutrition — first in Nepal.' },
  { year: '2023', title: 'Digital Growth', desc: 'Launched e-commerce nationwide. Over 10,000 happy families served across all 77 districts.' },
  { year: '2024', title: '180+ Farm Partners', desc: 'Certified regenerative agriculture across 500+ hectares. Community-first, planet-first.' },
  { year: '2025', title: 'International', desc: 'First exports to UK, Australia, and Nepali diaspora worldwide. Nepal\'s superfoods, going global.' },
];

const VALUES = [
  { icon: 'leaf', title: '0 Additives', desc: 'Every product contains exactly what the label says — nothing more.', color: '#15803D' },
  { icon: 'mountain', title: 'Single Origin', desc: 'We know every farm by name. Traceable from soil to your shelf.', color: '#1A3826' },
  { icon: 'shield', title: 'Lab Tested', desc: 'Third-party testing for purity, heavy metals, and microbials.', color: '#1D4ED8' },
  { icon: 'heart', title: 'Community First', desc: '30% of profits go directly to our farm partner families.', color: '#BE185D' },
];

const STATS = [
  { value: '10,000+', label: 'Happy Families' },
  { value: '180+', label: 'Farm Partners' },
  { value: '77', label: 'Districts Reached' },
  { value: '0', label: 'Additives Ever' },
];

export default function AboutScreen() {
  const router = useRouter();

  const IconComponent = ({ name, size, color }: { name: string; size: number; color: string }) => {
    switch (name) {
      case 'leaf': return <Leaf size={size} color={color} />;
      case 'mountain': return <Mountain size={size} color={color} />;
      case 'shield': return <ShieldCheck size={size} color={color} />;
      case 'heart': return <Heart size={size} color={color} />;
      default: return <Leaf size={size} color={color} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={20} color="#1A3826" />
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Leaf size={12} color="#FFFFFF" />
              <Text style={styles.heroBadgeText}>Est. 2019 · Kathmandu, Nepal</Text>
            </View>
            <Text style={styles.heroTitle}>Nature's Mud Nepal</Text>
            <Text style={styles.heroSubtitle}>
              Bringing the purest Himalayan superfoods from mountain farms to your family's table.
            </Text>
          </View>
        </View>

        {/* Stats Strip */}
        <View style={styles.statsStrip}>
          {STATS.map((stat, idx) => (
            <React.Fragment key={stat.label}>
              {idx > 0 && <View style={styles.statDivider} />}
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Mission */}
        <View style={styles.missionCard}>
          <View style={styles.missionBadge}>
            <Mountain size={14} color="#1A3826" />
            <Text style={styles.missionBadgeText}>Our Mission</Text>
          </View>
          <Text style={styles.missionTitle}>Pure Food. Real Nature. Zero Compromise.</Text>
          <Text style={styles.missionBody}>
            We started NaturesMud because we couldn't find food in Nepal that was truly pure — no
            preservatives, no artificial flavors, no hidden chemicals. Just the raw goodness that
            the Himalayas have offered for centuries.
          </Text>
          <Text style={styles.missionBody}>
            Today, we work directly with 180+ small-scale farmers across Nepal, bringing you
            single-origin, zero-additive superfoods at fair prices — while ensuring every farmer
            family earns a dignified living.
          </Text>
        </View>

        {/* Our Values */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Values</Text>
          <View style={styles.valuesGrid}>
            {VALUES.map((val) => (
              <View key={val.title} style={styles.valueCard}>
                <View style={[styles.valueIcon, { backgroundColor: val.color + '18' }]}>
                  <IconComponent name={val.icon} size={22} color={val.color} />
                </View>
                <Text style={styles.valueTitle}>{val.title}</Text>
                <Text style={styles.valueDesc}>{val.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Journey</Text>
          <View style={styles.timeline}>
            {TIMELINE.map((item, idx) => (
              <View key={item.year} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <Text style={styles.timelineYear}>{item.year}</Text>
                  {idx < TIMELINE.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                  <Text style={styles.timelineDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Certifications */}
        <View style={styles.certsCard}>
          <Award size={20} color="#D97706" />
          <Text style={styles.certsTitle}>Certifications & Standards</Text>
          {['NOCB Certified Organic', 'Third-Party Lab Tested', 'ISO 22000 Food Safety', 'Fair Trade Practices'].map((cert) => (
            <View key={cert} style={styles.certRow}>
              <ShieldCheck size={14} color="#15803D" />
              <Text style={styles.certText}>{cert}</Text>
            </View>
          ))}
        </View>

        {/* Social */}
        <View style={styles.socialCard}>
          <Globe size={20} color="#1A3826" />
          <Text style={styles.socialTitle}>Follow Our Journey</Text>
          <Text style={styles.socialSub}>We share daily farm stories, behind-the-scenes and recipes.</Text>
          <TouchableOpacity
            style={styles.igBtn}
            onPress={() => Linking.openURL('https://www.instagram.com/naturesmud.np/').catch(() => {})}
          >
            <Text style={styles.igBtnText}>@naturesmud.np on Instagram</Text>
            <ChevronRight size={16} color="#E1306C" />
          </TouchableOpacity>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.shopCTA}
          onPress={() => router.push('/(tabs)/products')}
          activeOpacity={0.9}
        >
          <Leaf size={20} color="#FFFFFF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.shopCTATitle}>Shop Our Products</Text>
            <Text style={styles.shopCTASub}>Taste the Himalayas, delivered to your door</Text>
          </View>
          <ChevronRight size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2' },
  scrollContent: { paddingBottom: 40 },
  topBar: { padding: 16 },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F0EDE7', justifyContent: 'center', alignItems: 'center',
  },
  heroSection: { height: 360, position: 'relative', marginTop: -16 },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  heroContent: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 24, gap: 10, zIndex: 5,
  },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  heroBadgeText: { fontSize: 11, fontWeight: '600', color: '#FFFFFF' },
  heroTitle: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5, lineHeight: 38 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 21 },

  statsStrip: {
    flexDirection: 'row', backgroundColor: '#1A3826',
    paddingVertical: 20, paddingHorizontal: 8,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  statLabel: { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 8 },

  missionCard: {
    margin: 16, backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, gap: 12,
    borderWidth: 1, borderColor: '#EAE3D6',
  },
  missionBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, alignSelf: 'flex-start',
  },
  missionBadgeText: { fontSize: 10, fontWeight: '700', color: '#1A3826' },
  missionTitle: { fontSize: 20, fontWeight: '900', color: '#1A3826', lineHeight: 28 },
  missionBody: { fontSize: 14, color: '#57534E', lineHeight: 22 },

  section: { paddingHorizontal: 16, gap: 14, marginBottom: 8 },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: '#1A3826' },

  valuesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  valueCard: {
    width: (screenWidth - 44) / 2, backgroundColor: '#FFFFFF', borderRadius: 20,
    padding: 16, gap: 8, borderWidth: 1, borderColor: '#EAE3D6',
  },
  valueIcon: {
    width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center',
  },
  valueTitle: { fontSize: 14, fontWeight: '800', color: '#1A3826' },
  valueDesc: { fontSize: 12, color: '#78716C', lineHeight: 17 },

  timeline: { gap: 0 },
  timelineRow: { flexDirection: 'row', gap: 16 },
  timelineLeft: { alignItems: 'center', width: 52 },
  timelineYear: {
    fontSize: 12, fontWeight: '900', color: '#1A3826',
    backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 10, textAlign: 'center',
  },
  timelineLine: { flex: 1, width: 2, backgroundColor: '#EAE3D6', marginTop: 4, minHeight: 40 },
  timelineContent: { flex: 1, paddingBottom: 20 },
  timelineTitle: { fontSize: 14, fontWeight: '800', color: '#1A3826', marginBottom: 4 },
  timelineDesc: { fontSize: 12, color: '#78716C', lineHeight: 17 },

  certsCard: {
    margin: 16, backgroundColor: '#FFFBEB', borderRadius: 20, padding: 20, gap: 10,
    borderWidth: 1, borderColor: '#FDE68A',
  },
  certsTitle: { fontSize: 16, fontWeight: '800', color: '#1A3826' },
  certRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  certText: { fontSize: 13, color: '#292524', fontWeight: '500' },

  socialCard: {
    margin: 16, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, gap: 10,
    borderWidth: 1, borderColor: '#EAE3D6',
  },
  socialTitle: { fontSize: 16, fontWeight: '800', color: '#1A3826' },
  socialSub: { fontSize: 12, color: '#78716C', lineHeight: 17 },
  igBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFF0F5', padding: 12, borderRadius: 12,
    borderWidth: 1, borderColor: '#FBCFE8',
  },
  igBtnText: { fontSize: 13, fontWeight: '700', color: '#E1306C' },

  shopCTA: {
    margin: 16, backgroundColor: '#1A3826', borderRadius: 20, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  shopCTATitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  shopCTASub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
});
