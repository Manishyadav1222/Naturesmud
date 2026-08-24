'use client';

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import { Star, Star as StarFilled, ChevronRight, Heart, Verified, MessageCircle, Quote } from 'lucide-react-native';
import { Link } from 'expo-router';
import { ScrollReveal } from '@/components/ScrollReveal';

const { width: screenWidth } = Dimensions.get('window');

const reviews = [
  {
    id: 1,
    userName: 'Priya Sharma',
    userInitials: 'PS',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 5,
    title: 'Life-changing honey!',
    content: 'I\'ve tried many honey brands but this wild Himalayan honey is on another level. The flavor is complex — floral, woody, with a subtle medicinal finish. My morning tea has never tasted better. You can truly taste the 100+ wildflowers. Worth every rupee!',
    productName: 'Wild Himalayan Honey 500g',
    productSlug: 'wild-himalayan-honey-500g',
    verified: true,
    helpful: 47,
    daysAgo: 12,
    images: [
      'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=300',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300',
    ],
  },
  {
    id: 2,
    userName: 'Rajesh Thapa',
    userInitials: 'RT',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    rating: 5,
    title: 'Authentic Shilajit — finally!',
    content: 'After trying 3 different brands, this is the real deal. The 40-day Surya Tapi method makes all the difference — the resin is glossy, dissolves perfectly, and has that distinct bittersweet taste. Energy levels noticeably improved within 2 weeks. Third-party lab reports gave me confidence.',
    productName: 'Pure Shilajit Resin 20g',
    productSlug: 'pure-shilajit-resin-20g',
    verified: true,
    helpful: 89,
    daysAgo: 5,
    images: [],
  },
  {
    id: 3,
    userName: 'Anita Gurung',
    userInitials: 'AG',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    rating: 5,
    title: 'Perfect for my morning ritual',
    content: 'The Morning Vitality Bundle is genius — everything I need in one box. The turmeric latte mix is perfectly spiced, amla powder is vibrant green (so fresh!), and the green tea is smooth without bitterness. Plus the wild honey ties it all together. Beautiful gift packaging too.',
    productName: 'Morning Vitality Ritual Bundle',
    productSlug: 'morning-vitality-bundle',
    verified: true,
    helpful: 34,
    daysAgo: 28,
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300',
    ],
  },
  {
    id: 4,
    userName: 'Dr. Suresh Kandel',
    userInitials: 'SK',
    userAvatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100',
    rating: 5,
    title: 'Recommended to my patients',
    content: 'As an Ayurvedic practitioner, I\'m very selective about what I recommend. Nature\'s Mud Shilajit and wild honey meet the highest standards — authentic sourcing, proper processing, transparent lab testing. My patients report excellent results for energy, immunity, and joint health.',
    productName: 'Pure Shilajit Resin 20g',
    productSlug: 'pure-shilajit-resin-20g',
    verified: true,
    helpful: 156,
    daysAgo: 45,
    images: [],
  },
  {
    id: 5,
    userName: 'Meera Joshi',
    userInitials: 'MJ',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    rating: 4,
    title: 'Great quality, fast delivery',
    content: 'Ordered the moringa powder and chia seeds — both arrived in 2 days to Pokhara. Packaging is premium, products are fresh (moringa is vivid green, chia forms perfect gel). Only giving 4 stars because shipping was Rs. 150 (free above Rs. 3000). Will order again!',
    productName: 'Organic Moringa Powder 200g',
    productSlug: 'organic-moringa-powder-200g',
    verified: true,
    helpful: 23,
    daysAgo: 8,
    images: [],
  },
  {
    id: 6,
    userName: 'Kiran Bhandari',
    userInitials: 'KB',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    rating: 5,
    title: 'Baby massage oil is amazing',
    content: 'Got this for my 3-month-old. The apricot-sesame blend absorbs beautifully, no greasy residue. Lavender scent is subtle and calming — baby falls asleep faster after massage. Pediatrician approved was the deciding factor for me. Highly recommend for new parents!',
    productName: 'Baby Massage Oil 100ml',
    productSlug: 'baby-massage-oil-100ml',
    verified: true,
    helpful: 67,
    daysAgo: 19,
    images: [
      'https://images.unsplash.com/photo-1515488042261-424e6a5a7f3e?w=300',
    ],
  },
];

export function RealCustomerReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const scrollX = useRef<any>(null);
  const cardWidth = screenWidth - 40;

  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

  const nextReview = () => {
    if (currentIndex < visibleReviews.length - 1) {
      setCurrentIndex(currentIndex + 1);
      scrollX.current?.scrollTo({ x: (currentIndex + 1) * cardWidth, animated: true });
    }
  };

  const prevReview = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      scrollX.current?.scrollTo({ x: (currentIndex - 1) * cardWidth, animated: true });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconWrapper}>
            <MessageCircle style={styles.headerIcon} />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Real Customer Reviews</Text>
            <Text style={styles.sectionSubtitle}>{reviews.length} verified reviews • 4.9★ average</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewAllLink} onPress={() => setShowAll(!showAll)}>
          <Text style={styles.viewAllText}>{showAll ? 'Show Less' : 'View All'}</Text>
          <ChevronRight
            style={[
              styles.viewAllArrow,
              showAll && styles.viewAllArrowRotated,
            ]}
          />
        </TouchableOpacity>
      </View>

      {showAll ? (
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.reviewsContainer}
          style={styles.reviewsScroll}
        >
          {visibleReviews.map((review, index) => (
            <View key={review.id} style={[styles.reviewCard, { width: cardWidth }]}>
              <ReviewCard review={review} />
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.carouselContainer}>
          <TouchableOpacity
            style={styles.navArrow}
            onPress={prevReview}
            disabled={currentIndex === 0}
          >
            <ChevronLeft style={styles.navArrowIcon} />
          </TouchableOpacity>
          <ScrollView
            ref={scrollX}
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reviewsContainer}
            style={styles.reviewsScroll}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / cardWidth);
              setCurrentIndex(Math.max(0, Math.min(index, visibleReviews.length - 1)));
            }}
          >
            {visibleReviews.map((review) => (
              <View key={review.id} style={[styles.reviewCard, { width: cardWidth }]}>
                <ReviewCard review={review} />
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.navArrow}
            onPress={nextReview}
            disabled={currentIndex === visibleReviews.length - 1}
          >
            <ChevronRight style={styles.navArrowIcon} />
          </TouchableOpacity>
        </View>
      )}

      {!showAll && (
        <View style={styles.indicators}>
          {visibleReviews.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.indicator,
                index === currentIndex && styles.indicatorActive,
              ]}
              onPress={() => {
                setCurrentIndex(index);
                scrollX.current?.scrollTo({ x: index * cardWidth, animated: true });
              }}
            />
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.writeReviewButton}>
        <Text style={styles.writeReviewText}>Write a Review</Text>
        <ChevronRight style={styles.writeReviewArrow} />
      </TouchableOpacity>
    </View>
  );
}

function ReviewCard({ review }: { review: typeof reviews[0] }) {
  return (
    <View style={styles.reviewCardContent}>
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Image source={{ uri: review.userAvatar }} style={styles.avatarImage} />
            {/* <Text style={styles.avatarInitials}>{review.userInitials}</Text> */}
          </View>
          <View style={styles.userDetails}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{review.userName}</Text>
              {review.verified && (
                <View style={styles.verifiedBadge}>
                  <Verified style={styles.verifiedIcon} />
                </View>
              )}
            </View>
            <View style={styles.reviewMeta}>
              <View style={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarFilled
                    key={i}
                    style={[
                      styles.star,
                      i < review.rating ? styles.starFilled : styles.starEmpty,
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.reviewTime}>{review.daysAgo} days ago</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.reviewTitle}>{review.title}</Text>
      <Text style={styles.reviewContent}>{review.content}</Text>

      {review.images.length > 0 && (
        <View style={styles.reviewImages}>
          {review.images.map((img, i) => (
            <Image key={i} source={{ uri: img }} style={styles.reviewImage} />
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.productLink}>
        <Text style={styles.productLinkText}>{review.productName}</Text>
        <ChevronRight style={styles.productLinkArrow} />
      </TouchableOpacity>

      <View style={styles.reviewActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Heart style={styles.actionIcon} />
          <Text style={styles.actionText}>{review.helpful} Helpful</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle style={styles.actionIcon} />
          <Text style={styles.actionText}>Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    color: '#365314',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#2B2B2B',
    opacity: 0.6,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
  viewAllLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#365314',
    fontFamily: 'Poppins_600SemiBold',
  },
  viewAllArrow: {
    color: '#365314',
  },
  viewAllArrowRotated: {
    transform: [{ rotate: '180deg' }],
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  navArrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
  },
  navArrowIcon: {
    color: '#365314',
  },
  reviewsScroll: {
    flex: 1,
  },
  reviewsContainer: {
    gap: 16,
    paddingBottom: 8,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reviewCardContent: {
    padding: 20,
    gap: 14,
  },
  reviewHeader: {
    gap: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F7EF',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    color: '#365314',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  userDetails: {
    flex: 1,
    gap: 4,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B2B2B',
    fontFamily: 'Poppins_600SemiBold',
  },
  verifiedBadge: {
    backgroundColor: '#ECFDF5',
    borderRadius: 9999,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  verifiedIcon: {
    color: '#059669',
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  star: {
    color: '#F59E0B',
  },
  starFilled: {
    opacity: 1,
  },
  starEmpty: {
    opacity: 0.3,
  },
  reviewTime: {
    fontSize: 11,
    color: '#2B2B2B',
    opacity: 0.5,
    fontFamily: 'Inter_400Regular',
  },
  reviewTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2B2B2B',
    fontFamily: 'Poppins_700Bold',
  },
  reviewContent: {
    fontSize: 13,
    color: '#2B2B2B',
    opacity: 0.8,
    lineHeight: 22,
    fontFamily: 'Inter_400Regular',
  },
  reviewImages: {
    flexDirection: 'row',
    gap: 8,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  productLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(43, 43, 43, 0.1)',
  },
  productLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#365314',
    fontFamily: 'Poppins_600SemiBold',
  },
  productLinkArrow: {
    color: '#365314',
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 9999,
  },
  actionIcon: {
    color: '#2B2B2B',
    opacity: 0.5,
  },
  actionText: {
    fontSize: 12,
    color: '#2B2B2B',
    opacity: 0.7,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(43, 43, 43, 0.2)',
  },
  indicatorActive: {
    width: 24,
    backgroundColor: '#365314',
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    paddingVertical: 14,
    backgroundColor: '#F8F4EC',
    borderRadius: 9999,
  },
  writeReviewText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#365314',
    fontFamily: 'Poppins_600SemiBold',
  },
  writeReviewArrow: {
    color: '#365314',
  },
});