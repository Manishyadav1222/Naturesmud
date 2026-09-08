import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Share,
  Animated,
  Dimensions,
  Linking,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Clock,
  Share2,
  Bookmark,
  MessageCircle,
  ChevronRight,
  Tag,
  User,
  Calendar,
} from 'lucide-react-native';
import { blogPosts } from '@/lib/data/content';

const { width: screenWidth } = Dimensions.get('window');

export default function BlogDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const scrollY = useRef(new Animated.Value(0)).current;

  const post = blogPosts.find((p) => p.slug === slug) || blogPosts[0];
  const related = blogPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 2);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: post.title,
        message: `${post.title}\n\nRead on NaturesMud: https://naturesmud.shop/blog/${post.slug}`,
        url: `https://naturesmud.shop/blog/${post.slug}`,
      });
    } catch {}
  };

  const handleWhatsApp = () => {
    Linking.openURL(
      `https://wa.me/9779819844486?text=I%20read%20your%20article:%20${encodeURIComponent(post.title)}`
    ).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Sticky Header */}
      <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <ArrowLeft size={20} color="#1A3826" />
        </TouchableOpacity>
        <Text style={styles.stickyTitle} numberOfLines={1}>{post.title}</Text>
        <TouchableOpacity onPress={handleShare} style={styles.headerBtn}>
          <Share2 size={18} color="#1A3826" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Animated.Image
            source={{ uri: post.image }}
            style={[styles.heroImage, { transform: [{ scale: imageScale }] }]}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroTopRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ArrowLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.backBtn}>
              <Share2 size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.heroCategoryPill}>
            <Text style={styles.heroCategoryText}>{post.category}</Text>
          </View>
        </View>

        {/* Article Content */}
        <View style={styles.articleBody}>
          {/* Title & Meta */}
          <Text style={styles.articleTitle}>{post.title}</Text>
          <Text style={styles.articleExcerpt}>{post.excerpt}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <User size={13} color="#78716C" />
              <Text style={styles.metaText}>{post.author}</Text>
            </View>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <Calendar size={13} color="#78716C" />
              <Text style={styles.metaText}>{formatDate(post.date)}</Text>
            </View>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <Clock size={13} color="#78716C" />
              <Text style={styles.metaText}>{post.readTime} min read</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Body Paragraphs */}
          {post.content.map((para, idx) => (
            <Text key={idx} style={styles.bodyParagraph}>{para}</Text>
          ))}

          {/* Tags */}
          <View style={styles.tagsSection}>
            <View style={styles.tagsHeader}>
              <Tag size={14} color="#78716C" />
              <Text style={styles.tagsLabel}>Tags</Text>
            </View>
            <View style={styles.tagsRow}>
              {post.tags.map((tag) => (
                <View key={tag} style={styles.tagPill}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Share CTA */}
          <View style={styles.shareSection}>
            <Text style={styles.shareTitle}>Found this helpful?</Text>
            <View style={styles.shareRow}>
              <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                <Share2 size={16} color="#1A3826" />
                <Text style={styles.shareBtnText}>Share Article</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.shareBtn, styles.waShareBtn]} onPress={handleWhatsApp}>
                <MessageCircle size={16} color="#FFFFFF" />
                <Text style={[styles.shareBtnText, { color: '#FFFFFF' }]}>Ask Us on WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Related Articles */}
          {related.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.relatedTitle}>Related Articles</Text>
              {related.map((rp) => (
                <TouchableOpacity
                  key={rp.id}
                  style={styles.relatedCard}
                  onPress={() => router.push({ pathname: '/blog/[slug]', params: { slug: rp.slug } })}
                  activeOpacity={0.88}
                >
                  <Image source={{ uri: rp.image }} style={styles.relatedImg} resizeMode="cover" />
                  <View style={styles.relatedBody}>
                    <Text style={styles.relatedCategory}>{rp.category}</Text>
                    <Text style={styles.relatedPostTitle} numberOfLines={2}>{rp.title}</Text>
                    <View style={styles.relatedMeta}>
                      <Clock size={11} color="#78716C" />
                      <Text style={styles.relatedReadTime}>{rp.readTime} min read</Text>
                    </View>
                  </View>
                  <ChevronRight size={18} color="#78716C" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2' },
  stickyHeader: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
    backgroundColor: 'rgba(250,247,242,0.96)',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#EAE3D6',
  },
  stickyTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: '#1A3826', textAlign: 'center', marginHorizontal: 8 },
  headerBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F0EDE7', justifyContent: 'center', alignItems: 'center',
  },
  scrollContent: { paddingBottom: 40 },

  heroContainer: { height: 320, position: 'relative', overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  heroTopRow: {
    position: 'absolute', top: 16, left: 16, right: 16,
    flexDirection: 'row', justifyContent: 'space-between', zIndex: 5,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  heroCategoryPill: {
    position: 'absolute', bottom: 20, left: 20,
    backgroundColor: '#1A3826', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
  },
  heroCategoryText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },

  articleBody: { padding: 20, gap: 14 },
  articleTitle: { fontSize: 26, fontWeight: '900', color: '#1A3826', letterSpacing: -0.4, lineHeight: 34 },
  articleExcerpt: { fontSize: 15, color: '#57534E', lineHeight: 22, fontStyle: 'italic' },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 12, color: '#78716C' },
  metaDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#D6D3D1' },
  divider: { height: 1, backgroundColor: '#EAE3D6', marginVertical: 4 },
  bodyParagraph: {
    fontSize: 15, color: '#292524', lineHeight: 26,
    fontWeight: '400', letterSpacing: 0.1,
  },

  tagsSection: { gap: 10, marginTop: 8 },
  tagsHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tagsLabel: { fontSize: 13, fontWeight: '700', color: '#78716C' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagPill: {
    backgroundColor: '#F0EDE7', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
    borderWidth: 1, borderColor: '#E2D9CB',
  },
  tagText: { fontSize: 11, fontWeight: '600', color: '#78716C' },

  shareSection: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: '#EAE3D6', gap: 12,
  },
  shareTitle: { fontSize: 16, fontWeight: '800', color: '#1A3826' },
  shareRow: { flexDirection: 'row', gap: 10 },
  shareBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: 12,
    backgroundColor: '#F0EDE7', borderWidth: 1, borderColor: '#E2D9CB',
  },
  waShareBtn: { backgroundColor: '#15803D' },
  shareBtnText: { fontSize: 12, fontWeight: '700', color: '#1A3826' },

  relatedSection: { gap: 12 },
  relatedTitle: { fontSize: 18, fontWeight: '900', color: '#1A3826' },
  relatedCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: '#EAE3D6', padding: 4,
  },
  relatedImg: { width: 80, height: 72, borderRadius: 12 },
  relatedBody: { flex: 1, gap: 4 },
  relatedCategory: { fontSize: 9, fontWeight: '700', color: '#1A3826', textTransform: 'uppercase' },
  relatedPostTitle: { fontSize: 13, fontWeight: '700', color: '#1C1917', lineHeight: 18 },
  relatedMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  relatedReadTime: { fontSize: 11, color: '#78716C' },
});
