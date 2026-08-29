import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Play, Heart, MessageCircle, Share2, Sparkles } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

const reels = [
  {
    id: '1',
    title: 'How We Harvest Wild Honey at 3,500m',
    thumbnail: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600',
    duration: '3:42',
    views: '24.5K',
    productSlug: 'wild-cliff-honey-500g',
  },
  {
    id: '2',
    title: '40-Day Surya Tapi Shilajit Purification',
    thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
    duration: '2:15',
    views: '48.2K',
    productSlug: 'pure-himalayan-shilajit-resin-50g',
  },
  {
    id: '3',
    title: 'Vedic Bilona Ghee Churning Ritual',
    thumbnail: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600',
    duration: '1:50',
    views: '19.8K',
    productSlug: 'organic-a2-desi-cow-ghee-1l',
  },
];

export function ReelsSection() {
  const router = useRouter();
  const [likes, setLikes] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Sparkles size={13} color="#365314" />
          <Text style={styles.badgeText}>Himalayan Harvest Reels</Text>
        </View>
        <Text style={styles.title}>Watch the Source</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {reels.map((reel) => {
          const isLiked = !!likes[reel.id];
          return (
            <TouchableOpacity
              key={reel.id}
              style={styles.reelCard}
              onPress={() => router.push(`/products/${reel.productSlug}`)}
              activeOpacity={0.9}
            >
              <Image source={{ uri: reel.thumbnail }} style={styles.thumbnail} />
              <View style={styles.overlay} />

              <View style={styles.playBadge}>
                <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
              </View>

              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{reel.duration}</Text>
              </View>

              <View style={styles.cardBottom}>
                <Text style={styles.reelTitle} numberOfLines={2}>{reel.title}</Text>
                <View style={styles.statsRow}>
                  <Text style={styles.viewsText}>👁️ {reel.views}</Text>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleLike(reel.id);
                    }}
                  >
                    <Heart
                      size={16}
                      color={isLiked ? '#DC2626' : '#FFFFFF'}
                      fill={isLiked ? '#DC2626' : 'transparent'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFCCB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#365314',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1917',
  },
  scrollList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  reelCard: {
    width: screenWidth * 0.48,
    height: 240,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1C1917',
    position: 'relative',
    justifyContent: 'space-between',
    padding: 12,
  },
  thumbnail: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  playBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 60,
  },
  durationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  cardBottom: {
    gap: 6,
  },
  reelTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewsText: {
    color: '#D9F99D',
    fontSize: 10,
    fontWeight: '600',
  },
});