import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import { Star, ChevronRight, ChevronLeft, Heart, CheckCircle2, MessageCircle, Quote } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

const reviews = [
  {
    id: 1,
    userName: 'Priya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 5,
    title: 'Life-changing Himalayan honey!',
    content: "I've tried many honey brands but this wild Himalayan honey is on another level. The floral and woody notes are incredible.",
    productName: 'Wild Himalayan Cliff Honey (500g)',
    verified: true,
    daysAgo: '3 days ago',
  },
  {
    id: 2,
    userName: 'Rajesh Thapa',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    rating: 5,
    title: 'Authentic Shilajit Resin',
    content: 'The 40-day Surya Tapi method makes all the difference — dissolves perfectly and energy levels improved within a week.',
    productName: 'Pure Himalayan Shilajit Resin (50g)',
    verified: true,
    daysAgo: '1 week ago',
  },
  {
    id: 3,
    userName: 'Anita Gurung',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    rating: 5,
    title: 'Pure A2 Vedic Ghee',
    content: 'The aroma of bilona churned ghee brings back memories of authentic village taste. Highly recommended for daily cooking.',
    productName: 'Organic A2 Himalayan Cow Ghee (1L)',
    verified: true,
    daysAgo: '2 weeks ago',
  },
];

export function RealCustomerReviewsSection() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Star size={13} color="#D97706" fill="#D97706" />
          <Text style={styles.badgeText}>Verified Customer Stories</Text>
        </View>
        <Text style={styles.title}>Loved Across Nepal</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {reviews.map((rev) => (
          <View key={rev.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image source={{ uri: rev.userAvatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.userName}>{rev.userName}</Text>
                  {rev.verified && (
                    <View style={styles.verifiedBadge}>
                      <CheckCircle2 size={12} color="#16A34A" />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.timeText}>{rev.daysAgo}</Text>
              </View>
            </View>

            <View style={styles.starsRow}>
              {[...Array(rev.rating)].map((_, i) => (
                <Star key={i} size={14} color="#D97706" fill="#D97706" />
              ))}
            </View>

            <Text style={styles.reviewTitle}>{rev.title}</Text>
            <Text style={styles.reviewContent}>{rev.content}</Text>

            <View style={styles.productTag}>
              <Text style={styles.productTagText}>📦 {rev.productName}</Text>
            </View>
          </View>
        ))}
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
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
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
  reviewCard: {
    width: screenWidth * 0.75,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    gap: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1917',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: 9,
    color: '#16A34A',
    fontWeight: '700',
  },
  timeText: {
    fontSize: 10,
    color: '#A8A29E',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1917',
  },
  reviewContent: {
    fontSize: 12,
    color: '#57534E',
    lineHeight: 17,
  },
  productTag: {
    backgroundColor: '#F5F5F4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  productTagText: {
    fontSize: 11,
    color: '#365314',
    fontWeight: '600',
  },
});