import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown, MessageCircle, Search } from 'lucide-react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const FAQ_DATA = [
  {
    category: 'Orders & Payments',
    color: '#1A3826',
    questions: [
      {
        q: 'How do I place an order?',
        a: 'Browse our catalog, add products to your cart, then proceed to checkout. We accept eSewa, Khalti, bank transfer, and Cash on Delivery across Nepal.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept eSewa, Khalti, ConnectIPS, bank transfer (Nabil, NIC Asia, Global IME), and Cash on Delivery (COD) throughout Nepal.',
      },
      {
        q: 'Can I modify or cancel my order?',
        a: 'Orders can be modified or cancelled within 2 hours of placement. After that, the order enters processing. Contact us immediately via WhatsApp for urgent changes.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes. We use SSL encryption and never store card details. Payments are processed through PCI-compliant gateways (eSewa, Khalti).',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    color: '#1D4ED8',
    questions: [
      {
        q: 'How long does delivery take?',
        a: 'Kathmandu Valley: 1–2 business days. Outside Valley (major cities): 3–5 days. Remote areas: 5–10 days. We ship via Aramex, Pathao, and our own courier network.',
      },
      {
        q: 'Is there a free shipping threshold?',
        a: 'Yes! Orders above Rs. 3,000 get free shipping anywhere in Nepal. Below that, standard rates apply (Rs. 100–200 depending on location).',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes! We ship to the USA, UK, Australia, Canada, and the UAE for Nepali diaspora. International shipping rates and times are calculated at checkout.',
      },
      {
        q: 'How do I track my order?',
        a: 'After your order ships, you\'ll receive an SMS with a tracking number. You can also track directly in the app under Account → My Orders.',
      },
    ],
  },
  {
    category: 'Products & Quality',
    color: '#7C3AED',
    questions: [
      {
        q: 'Are your products really 100% natural?',
        a: 'Yes. Every NaturesMud product is NOCB-certified organic, third-party lab tested, and contains zero artificial additives, preservatives, colors, or flavors. We publish lab reports on each product page.',
      },
      {
        q: 'Where do your products come from?',
        a: 'All products are single-origin from Nepal — we work with 180+ farms across Bagmati, Gandaki, Karnali, and Lumbini provinces. We know every farm by name.',
      },
      {
        q: 'What is the shelf life of your products?',
        a: 'Shelf life varies: Powders (Moringa, Dates, Beetroot): 18 months. Seeds: 12 months. Shilajit Resin: 2+ years. Honey: 3+ years. Always check the expiry date on the packaging.',
      },
      {
        q: 'Is your Shilajit authentic?',
        a: 'Yes. Our Shilajit is harvested from 4,000m+ altitude rocks in the Karnali region and undergoes traditional Surya Tapi purification. Every batch is tested for fulvic acid (>60%) and heavy metals.',
      },
      {
        q: 'Are your products safe for babies?',
        a: 'Our Dates Powder, Moringa, and Chia Seeds are widely used for baby nutrition from 6 months. However, always consult your pediatrician before introducing superfoods. Shilajit and Honey are not recommended for children under 1 year.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    color: '#DC2626',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 7 days of delivery for unopened, sealed products. If you received a damaged or wrong item, we\'ll replace it immediately at no cost.',
      },
      {
        q: 'How do I request a refund?',
        a: 'Contact us via WhatsApp (+977-9713888002) or email (hello@naturesmud.shop) with your order number and reason. Refunds are processed within 5–7 business days.',
      },
      {
        q: 'What if my product arrived damaged?',
        a: 'Take a photo and WhatsApp us within 24 hours of delivery. We\'ll send a replacement immediately, no questions asked.',
      },
    ],
  },
  {
    category: 'Account & Loyalty',
    color: '#D97706',
    questions: [
      {
        q: 'How does the Loyalty Points system work?',
        a: 'Earn 1 point per Rs. 100 spent. 100 points = Rs. 100 discount. Points never expire. Bonus points for referrals, reviews, and special campaigns.',
      },
      {
        q: 'How do I earn referral rewards?',
        a: 'Share your unique referral code. When a friend makes their first purchase using your code, you both get Rs. 200 in loyalty points.',
      },
      {
        q: 'Can I have multiple accounts?',
        a: 'Each phone number and email can only have one account. Creating multiple accounts to abuse promotions will result in suspension.',
      },
    ],
  },
];

type FAQItem = { q: string; a: string };

function AccordionItem({ item, categoryColor }: { item: FAQItem; categoryColor: string }) {
  const [open, setOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((prev) => {
      Animated.timing(rotateAnim, {
        toValue: !prev ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      return !prev;
    });
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <TouchableOpacity style={[styles.accordionItem, open && { borderColor: categoryColor + '40' }]} onPress={toggle} activeOpacity={0.85}>
      <View style={styles.accordionHeader}>
        <Text style={styles.accordionQ}>{item.q}</Text>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <ChevronDown size={18} color={open ? categoryColor : '#78716C'} />
        </Animated.View>
      </View>
      {open && (
        <View style={[styles.accordionBody, { borderLeftColor: categoryColor }]}>
          <Text style={styles.accordionA}>{item.a}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function FAQScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const allCategories = FAQ_DATA.map((c) => c.category);

  const filtered = FAQ_DATA
    .filter((cat) => !activeCategory || cat.category === activeCategory)
    .map((cat) => ({
      ...cat,
      questions: searchQuery.trim()
        ? cat.questions.filter(
            (q) =>
              q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
              q.a.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : cat.questions,
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={20} color="#1A3826" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.pageTitle}>FAQ</Text>
            <Text style={styles.pageSubtitle}>Everything you need to know about NaturesMud</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Search size={16} color="#78716C" />
          <Text
            style={styles.searchInput}
            onPress={() => {}} // Placeholder — real search handled via state
          >
            {searchQuery || 'Search questions...'}
          </Text>
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          <TouchableOpacity
            style={[styles.catChip, !activeCategory && styles.catChipActive]}
            onPress={() => setActiveCategory(null)}
          >
            <Text style={[styles.catChipText, !activeCategory && styles.catChipTextActive]}>All</Text>
          </TouchableOpacity>
          {allCategories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
              onPress={() => setActiveCategory(activeCategory === cat ? null : cat)}
            >
              <Text style={[styles.catChipText, activeCategory === cat && styles.catChipTextActive]}>
                {cat.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* FAQ Sections */}
        {filtered.map((cat) => (
          <View key={cat.category} style={styles.faqSection}>
            <View style={[styles.catHeader, { borderLeftColor: cat.color }]}>
              <Text style={[styles.catTitle, { color: cat.color }]}>{cat.category}</Text>
              <Text style={styles.catCount}>{cat.questions.length} questions</Text>
            </View>
            {cat.questions.map((item, idx) => (
              <AccordionItem key={idx} item={item} categoryColor={cat.color} />
            ))}
          </View>
        ))}

        {/* Still have questions */}
        <View style={styles.contactCTA}>
          <MessageCircle size={22} color="#25D366" />
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaTitle}>Still have questions?</Text>
            <Text style={styles.ctaSub}>Our Kathmandu team is here to help 7 days a week</Text>
          </View>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => {
              require('react-native').Linking.openURL('https://wa.me/9779713888002').catch(() => {});
            }}
          >
            <Text style={styles.ctaBtnText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  headerText: { gap: 4 },
  pageTitle: { fontSize: 30, fontWeight: '900', color: '#1A3826', letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 13, color: '#78716C' },
  searchBar: {
    marginHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: '#E2D9CB', marginBottom: 4,
  },
  searchInput: { fontSize: 14, color: '#A8A29E', flex: 1 },
  catRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  catChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#F0EDE7', borderWidth: 1, borderColor: '#E2D9CB',
  },
  catChipActive: { backgroundColor: '#1A3826', borderColor: '#1A3826' },
  catChipText: { fontSize: 12, fontWeight: '600', color: '#78716C' },
  catChipTextActive: { color: '#FFFFFF' },
  faqSection: { paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  catHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderLeftWidth: 3, paddingLeft: 10,
  },
  catTitle: { fontSize: 16, fontWeight: '900' },
  catCount: { fontSize: 11, color: '#78716C', fontWeight: '600' },
  accordionItem: {
    backgroundColor: '#FFFFFF', borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: '#EAE3D6',
  },
  accordionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: 14, gap: 10,
  },
  accordionQ: { flex: 1, fontSize: 14, fontWeight: '700', color: '#1C1917', lineHeight: 20 },
  accordionBody: {
    paddingHorizontal: 14, paddingBottom: 14,
    borderLeftWidth: 3, marginLeft: 14, marginRight: 14, marginBottom: 4,
  },
  accordionA: { fontSize: 13, color: '#57534E', lineHeight: 21 },
  contactCTA: {
    margin: 16, backgroundColor: '#F0FDF4', borderRadius: 20, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: '#BBF7D0',
  },
  ctaTitle: { fontSize: 15, fontWeight: '800', color: '#1A3826' },
  ctaSub: { fontSize: 11, color: '#78716C', marginTop: 2 },
  ctaBtn: {
    backgroundColor: '#25D366', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  ctaBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
});
