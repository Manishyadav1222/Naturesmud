import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  RefreshControl,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  ChevronRight,
  Sparkles,
  Search,
  Leaf,
} from 'lucide-react-native';
import { blogPosts, type BlogPost } from '@/lib/data/content';

const { width: screenWidth } = Dimensions.get('window');

const CATEGORIES = ['All', 'Superfoods', 'Health Tips', 'Nutrition', 'Lifestyle', 'Organic Living'];

export default function BlogScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Header fade animation
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 700));
    setRefreshing(false);
  };

  const filtered = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter((p) => p.category === selectedCategory);

  const featured = blogPosts.find((p) => p.featured) || blogPosts[0];
  const rest = filtered.filter((p) => p.id !== featured.id);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />

      {/* Floating compact header on scroll */}
      <Animated.View style={[styles.floatingHeader, { opacity: headerOpacity }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#1A3826" />
        </TouchableOpacity>
        <Text style={styles.floatingTitle}>NaturesMud Blog</Text>
        <View style={{ width: 36 }} />
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1A3826']} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.inlineBack}>
            <ArrowLeft size={20} color="#1A3826" />
          </TouchableOpacity>
          <View style={styles.headerTextBlock}>
            <View style={styles.headerBadge}>
              <BookOpen size={12} color="#1A3826" />
              <Text style={styles.headerBadgeText}>Himalayan Wellness Journal</Text>
            </View>
            <Text style={styles.pageTitle}>Our Blog</Text>
            <Text style={styles.pageSubtitle}>
              Science-backed insights on superfoods, wellness & sustainable living
            </Text>
          </View>
        </View>

        {/* Featured Article */}
        <TouchableOpacity
          style={styles.featuredCard}
          activeOpacity={0.92}
          onPress={() => router.push({ pathname: '/blog/[slug]', params: { slug: featured.slug } })}
        >
          <Image source={{ uri: featured.image }} style={styles.featuredImage} resizeMode="cover" />
          <View style={styles.featuredOverlay} />
          <View style={styles.featuredBadgeRow}>
            <View style={styles.featuredPill}>
              <Sparkles size={11} color="#D97706" />
              <Text style={styles.featuredPillText}>Featured</Text>
            </View>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{featured.category}</Text>
            </View>
          </View>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle} numberOfLines={2}>{featured.title}</Text>
            <Text style={styles.featuredExcerpt} numberOfLines={2}>{featured.excerpt}</Text>
            <View style={styles.featuredMeta}>
              <View style={styles.metaItem}>
                <Clock size={12} color="rgba(255,255,255,0.8)" />
                <Text style={styles.metaText}>{featured.readTime} min read</Text>
              </View>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaText}>{formatDate(featured.date)}</Text>
            </View>
            <View style={styles.readMoreRow}>
              <Text style={styles.readMoreText}>Read Article</Text>
              <ChevronRight size={14} color="#FFFFFF" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Article List */}
        <View style={styles.articlesSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'All Articles' : selectedCategory}
            <Text style={styles.sectionCount}> ({filtered.length})</Text>
          </Text>

          {(selectedCategory === 'All' ? rest : filtered).map((post, idx) => (
            <BlogCard
              key={post.id}
              post={post}
              index={idx}
              onPress={() => router.push({ pathname: '/blog/[slug]', params: { slug: post.slug } })}
              formatDate={formatDate}
            />
          ))}
        </View>

        {/* Newsletter CTA */}
        <View style={styles.newsletterBox}>
          <View style={styles.newsletterIcon}>
            <Leaf size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.newsletterTitle}>Get Wellness Insights</Text>
          <Text style={styles.newsletterSub}>
            New articles on superfoods, recipes, and Himalayan wellness every week.
          </Text>
          <TouchableOpacity style={styles.newsletterBtn}>
            <Text style={styles.newsletterBtnText}>Subscribe to Newsletter</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

function BlogCard({
  post,
  index,
  onPress,
  formatDate,
}: {
  post: BlogPost;
  index: number;
  onPress: () => void;
  formatDate: (d: string) => string;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 80,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity style={styles.blogCard} onPress={onPress} activeOpacity={0.88}>
        <Image source={{ uri: post.image }} style={styles.blogCardImage} resizeMode="cover" />
        <View style={styles.blogCardBody}>
          <View style={styles.blogCardCategory}>
            <Text style={styles.blogCardCategoryText}>{post.category}</Text>
          </View>
          <Text style={styles.blogCardTitle} numberOfLines={2}>{post.title}</Text>
          <Text style={styles.blogCardExcerpt} numberOfLines={2}>{post.excerpt}</Text>
          <View style={styles.blogCardMeta}>
            <Text style={styles.blogCardAuthor}>{post.author}</Text>
            <View style={styles.blogCardMetaRight}>
              <Clock size={11} color="#78716C" />
              <Text style={styles.blogCardReadTime}>{post.readTime} min</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2' },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: 'rgba(250,247,242,0.96)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAE3D6',
  },
  floatingTitle: { fontSize: 16, fontWeight: '800', color: '#1A3826' },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F0EDE7', justifyContent: 'center', alignItems: 'center',
  },
  scrollContent: { paddingBottom: 40 },
  pageHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  inlineBack: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F0EDE7', justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  headerTextBlock: { gap: 6 },
  headerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, alignSelf: 'flex-start',
  },
  headerBadgeText: { fontSize: 10, fontWeight: '700', color: '#1A3826' },
  pageTitle: { fontSize: 30, fontWeight: '900', color: '#1A3826', letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 13, color: '#78716C', lineHeight: 18 },

  featuredCard: {
    marginHorizontal: 16, borderRadius: 24, overflow: 'hidden',
    height: 360, position: 'relative',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 16, elevation: 8,
  },
  featuredImage: { width: '100%', height: '100%' },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  featuredBadgeRow: {
    position: 'absolute', top: 16, left: 16, right: 16,
    flexDirection: 'row', gap: 8, zIndex: 5,
  },
  featuredPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  featuredPillText: { fontSize: 10, fontWeight: '800', color: '#1C1917' },
  categoryPill: {
    backgroundColor: 'rgba(26,56,38,0.9)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  categoryPillText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
  featuredContent: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 18, gap: 8, zIndex: 5,
  },
  featuredTitle: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.3 },
  featuredExcerpt: { fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 18 },
  featuredMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  metaDot: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  readMoreRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
  },
  readMoreText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  categoryRow: { paddingHorizontal: 16, paddingVertical: 16, gap: 8 },
  categoryChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#F0EDE7', borderWidth: 1, borderColor: '#E2D9CB',
  },
  categoryChipActive: {
    backgroundColor: '#1A3826', borderColor: '#1A3826',
  },
  categoryChipText: { fontSize: 12, fontWeight: '600', color: '#78716C' },
  categoryChipTextActive: { color: '#FFFFFF' },

  articlesSection: { paddingHorizontal: 16, gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#1A3826', marginBottom: 4 },
  sectionCount: { fontWeight: '500', color: '#78716C' },

  blogCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: '#EAE3D6', flexDirection: 'row',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  blogCardImage: { width: 110, height: 120 },
  blogCardBody: { flex: 1, padding: 12, gap: 5 },
  blogCardCategory: {
    backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 10, alignSelf: 'flex-start',
  },
  blogCardCategoryText: { fontSize: 9, fontWeight: '700', color: '#1A3826' },
  blogCardTitle: { fontSize: 13, fontWeight: '800', color: '#1C1917', lineHeight: 18 },
  blogCardExcerpt: { fontSize: 11, color: '#78716C', lineHeight: 15 },
  blogCardMeta: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4,
  },
  blogCardAuthor: { fontSize: 10, fontWeight: '600', color: '#1A3826' },
  blogCardMetaRight: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  blogCardReadTime: { fontSize: 10, color: '#78716C' },

  newsletterBox: {
    margin: 16, backgroundColor: '#1A3826', borderRadius: 24, padding: 24,
    alignItems: 'center', gap: 10, marginTop: 24,
  },
  newsletterIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center',
  },
  newsletterTitle: { fontSize: 18, fontWeight: '900', color: '#FFFFFF' },
  newsletterSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 18 },
  newsletterBtn: {
    backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 20, marginTop: 4,
  },
  newsletterBtnText: { fontSize: 13, fontWeight: '800', color: '#1A3826' },
});
