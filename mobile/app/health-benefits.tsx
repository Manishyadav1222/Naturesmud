import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sparkles, ShieldCheck, Heart, Leaf, CheckCircle2, ChevronRight } from 'lucide-react-native';

const WELLNESS_ARTICLES = [
  {
    id: 'shilajit',
    title: 'Pure Himalayan Shilajit Resin',
    tag: 'Energy & Longevity',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
    description:
      'Sourced above 16,000 ft in the pristine Himalayas. Rich in over 85+ trace minerals and 65% fulvic acid for natural energy and cognitive clarity.',
    benefits: [
      'Boosts natural cellular energy (ATP production)',
      'Enhances stamina, strength & post-workout recovery',
      'Supports healthy testosterone & vitality',
      'Potent antioxidant that neutralizes cellular free radicals',
    ],
    howToUse: 'Dissolve a pea-sized portion (300-500mg) in warm water, herbal tea, or milk every morning on an empty stomach.',
  },
  {
    id: 'honey',
    title: 'Wild Himalayan Cliff Honey',
    tag: 'Raw & Unpasteurized',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600',
    description:
      'Ethically harvested by indigenous Gurung honey hunters from giant Himalayan honeybees (Apis laboriosa). 100% unfiltered and raw.',
    benefits: [
      'Natural prebiotic supporting digestive gut microbiome',
      'Rich in bioactive pollen, enzymes & royal jelly traces',
      'Soothes throat irritation & natural cough remedy',
      'Low glycemic alternative to refined table sugars',
    ],
    howToUse: 'Enjoy 1 spoonful daily on its own, drizzled over yogurt, or mixed with warm lemon water.',
  },
  {
    id: 'ghee',
    title: 'Vedic A2 Himalayan Cow Ghee',
    tag: 'Bilona Churned',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600',
    description:
      'Made from free-grazing Himalayan indigenous cows using traditional wooden bilona churning of curd into golden, aromatic butter.',
    benefits: [
      'Contains 100% A2 beta-casein protein (easy to digest)',
      'High in Butyric acid supporting intestinal gut lining',
      'Rich in fat-soluble vitamins A, D, E, and K2',
      'High smoke point (250°C) perfect for healthy cooking',
    ],
    howToUse: 'Add 1-2 teaspoons to warm rice, dal, or enjoy a teaspoon in bulletproof morning coffee/tea.',
  },
];

export default function HealthBenefitsScreen() {
  const router = useRouter();
  const [selectedArticle, setSelectedArticle] = useState(WELLNESS_ARTICLES[0]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#1C1917" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Himalayan Health Guide</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroBadge}>
            <Leaf size={14} color="#365314" />
            <Text style={styles.heroBadgeText}>Ancient Ayurvedic Wisdom</Text>
          </View>
          <Text style={styles.heroTitle}>Purity Powered by the Himalayas</Text>
          <Text style={styles.heroSubtitle}>
            Every harvest from Nature's Mud is lab-certified, chemical-free, and ethically hand-gathered.
          </Text>
        </View>

        {/* Tab Selection */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabList}>
          {WELLNESS_ARTICLES.map((article) => {
            const isSelected = selectedArticle.id === article.id;
            return (
              <TouchableOpacity
                key={article.id}
                style={[styles.tabChip, isSelected && styles.tabChipActive]}
                onPress={() => setSelectedArticle(article)}
              >
                <Text style={[styles.tabChipText, isSelected && styles.tabChipTextActive]}>
                  {article.title.split(' ')[2] || article.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Article Card */}
        <View style={styles.articleCard}>
          <Image source={{ uri: selectedArticle.image }} style={styles.articleImage} />
          <View style={styles.articleBody}>
            <View style={styles.articleTag}>
              <Sparkles size={12} color="#365314" />
              <Text style={styles.articleTagText}>{selectedArticle.tag}</Text>
            </View>
            <Text style={styles.articleTitle}>{selectedArticle.title}</Text>
            <Text style={styles.articleDesc}>{selectedArticle.description}</Text>

            <View style={styles.sectionDivider} />

            <Text style={styles.subHeading}>Key Health Benefits</Text>
            <View style={styles.benefitsList}>
              {selectedArticle.benefits.map((benefit, i) => (
                <View key={i} style={styles.benefitRow}>
                  <CheckCircle2 size={16} color="#365314" style={{ marginTop: 2 }} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>

            <View style={styles.howToUseBox}>
              <Text style={styles.howToUseTitle}>🥄 How to Consume</Text>
              <Text style={styles.howToUseText}>{selectedArticle.howToUse}</Text>
            </View>

            <TouchableOpacity
              style={styles.shopNowBtn}
              onPress={() => router.push('/(tabs)/products')}
            >
              <Text style={styles.shopNowText}>Shop Organic Harvest</Text>
              <ChevronRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F5F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1917',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  heroBanner: {
    backgroundColor: '#365314',
    borderRadius: 20,
    padding: 20,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFCCB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#365314',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#D9F99D',
    lineHeight: 18,
  },
  tabList: {
    gap: 8,
  },
  tabChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  tabChipActive: {
    backgroundColor: '#365314',
    borderColor: '#365314',
  },
  tabChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#57534E',
  },
  tabChipTextActive: {
    color: '#FFFFFF',
  },
  articleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  articleImage: {
    width: '100%',
    height: 200,
  },
  articleBody: {
    padding: 18,
  },
  articleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFCCB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  articleTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#365314',
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C1917',
    marginBottom: 8,
  },
  articleDesc: {
    fontSize: 14,
    color: '#57534E',
    lineHeight: 20,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#F5F5F4',
    marginVertical: 16,
  },
  subHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 12,
  },
  benefitsList: {
    gap: 8,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  benefitText: {
    flex: 1,
    fontSize: 13,
    color: '#292524',
    lineHeight: 18,
  },
  howToUseBox: {
    backgroundColor: '#F7FEE7',
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#D9F99D',
  },
  howToUseTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#365314',
    marginBottom: 4,
  },
  howToUseText: {
    fontSize: 12,
    color: '#4D7C0F',
    lineHeight: 18,
  },
  shopNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#365314',
    borderRadius: 14,
    height: 48,
    gap: 8,
    marginTop: 20,
  },
  shopNowText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
