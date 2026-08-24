'use client';

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Animated } from 'react-native';
import { Link } from 'expo-router';
import { Play, Pause, Heart, Heart as HeartFilled, Share2, MessageCircle, Bookmark, Bookmark as BookmarkFilled, ChevronRight, Sparkles, Leaf, Mountain } from 'lucide-react-native';
import { ScrollReveal } from '@/components/ScrollReveal';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const reels = [
  {
    id: 1,
    title: 'How We Harvest Wild Honey at 3,500m',
    description: 'Watch Gurung honey hunters scale cliffs using traditional rope ladders — a 5,000-year-old practice.',
    videoUrl: 'https://example.com/honey-harvest.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600',
    duration: '3:42',
    author: 'Nature\'s Mud',
    authorAvatar: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=100',
    likes: 12400,
    comments: 890,
    shares: 2100,
    saves: 4500,
    hashtags: ['#WildHoney', '#Himalayas', '#TraditionalHarvest', '#Gurung'],
    productSlug: 'wild-himalayan-honey-500g',
  },
  {
    id: 2,
    title: '40-Day Surya Tapi Shilajit Process',
    description: 'The ancient sun-drying purification method in copper vessels — why it takes 40 days and matters.',
    videoUrl: 'https://example.com/shilajit-process.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
    duration: '2:18',
    author: 'Nature\'s Mud',
    authorAvatar: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100',
    likes: 8900,
    comments: 560,
    shares: 1400,
    saves: 6200,
    hashtags: ['#Shilajit', '#SuryaTapi', '#Ayurveda', '#Superfood'],
    productSlug: 'pure-shilajit-resin-20g',
  },
  {
    id: 3,
    title: 'Morning Vitality Ritual — 7 Days',
    description: 'Real customer shows their daily routine with our bundle: honey, turmeric latte, amla, green tea.',
    videoUrl: 'https://example.com/morning-ritual.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
    duration: '1:55',
    author: 'Priya S. • Verified Buyer',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    likes: 5600,
    comments: 340,
    shares: 890,
    saves: 3100,
    hashtags: ['#MorningRoutine', '#Wellness', '#HimalayanHealth', '#Bundle'],
    productSlug: 'morning-vitality-bundle',
  },
  {
    id: 4,
    title: 'Baby Massage Tutorial with Our Oil',
    description: 'Pediatrician-recommended techniques for newborn massage using our apricot-sesame-lavender blend.',
    videoUrl: 'https://example.com/baby-massage.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1515488042261-424e6a5a7f3e?w=600',
    duration: '4:20',
    author: 'Dr. Meera Joshi • Pediatrician',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    likes: 7200,
    comments: 420,
    shares: 1100,
    saves: 5800,
    hashtags: ['#BabyCare', '#Massage', '#NewParent', '#Organic'],
    productSlug: 'baby-massage-oil-100ml',
  },
  {
    id: 5,
    title: 'Moringa Farm Tour — 1,200m Altitude',
    description: 'Visit our partner farm in the Himalayan foothills where the Miracle Tree grows in mineral-rich soil.',
    videoUrl: 'https://example.com/moringa-farm.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600',
    duration: '2:45',
    author: 'Nature\'s Mud',
    authorAvatar: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=100',
    likes: 4300,
    comments: 280,
    shares: 650,
    saves: 2200,
    hashtags: ['#Moringa', '#Superfood', '#RegenerativeFarming', '#Himalayas'],
    productSlug: 'organic-moringa-powder-200g',
  },
];

export function ReelsSection() {
  const [currentReel, setCurrentReel] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const reel = reels[currentReel];

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleShare = () => {
    // Share functionality
  };

  const nextReel = () => {
    setCurrentReel((prev) => (prev + 1) % reels.length);
    setPlaying(true);
    setLiked(false);
    setSaved(false);
  };

  const prevReel = () => {
    setCurrentReel((prev) => (prev - 1 + reels.length) % reels.length);
    setPlaying(true);
    setLiked(false);
    setSaved(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconWrapper}>
            <Sparkles style={styles.headerIcon} />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Himalayan Reels</Text>
            <Text style={styles.sectionSubtitle}>Stories from the mountains</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewAllLink} onPress={() => {}}>
          <Text style={styles.viewAllText}>Watch All</Text>
          <ChevronRight style={styles.viewAllArrow} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.reelsContainer}
        style={styles.reelsScroll}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
          setCurrentReel(index);
          setPlaying(true);
          setLiked(false);
          setSaved(false);
        }}
      >
        {reels.map((reel, index) => (
          <View key={reel.id} style={[styles.reelCard, { width: screenWidth }]}>
            <ReelCard
              reel={reel}
              isCurrent={index === currentReel}
              playing={playing && index === currentReel}
              liked={liked}
              saved={saved}
              onPlayPause={() => setPlaying(!playing)}
              onLike={handleLike}
              onSave={handleSave}
              onShare={handleShare}
              onProfilePress={() => {}}
              onProductPress={() => {}}
              onCommentsPress={() => setShowComments(true)}
            />
          </View>
        ))}
      </ScrollView>

      {/* Reel Indicators */}
      <View style={styles.indicators}>
        {reels.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.indicator,
              index === currentReel && styles.indicatorActive,
            ]}
            onPress={() => {
              setCurrentReel(index);
              setPlaying(true);
            }}
          />
        ))}
      </View>
    </View>
  );
}

function ReelCard({
  reel,
  isCurrent,
  playing,
  liked,
  saved,
  onPlayPause,
  onLike,
  onSave,
  onShare,
  onProfilePress,
  onProductPress,
  onCommentsPress,
}: any) {
  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <View style={styles.reelWrapper}>
      {/* Video/Thumbnail */}
      <Image
        source={{ uri: reel.thumbnail }}
        style={styles.reelVideo}
        resizeMode="cover"
      />

      {/* Play/Pause Overlay */}
      <TouchableOpacity style={styles.playOverlay} onPress={onPlayPause}>
        {playing ? (
          <Pause style={styles.playIcon} />
        ) : (
          <Play style={styles.playIcon} />
        )}
      </TouchableOpacity>

      {/* Duration */}
      <View style={styles.durationBadge}>
        <Text style={styles.durationText}>{reel.duration}</Text>
      </View>

      {/* Content Info */}
      <View style={styles.contentInfo}>
        <View style={styles.authorRow}>
          <TouchableOpacity style={styles.authorAvatar} onPress={onProfilePress}>
            <Image source={{ uri: reel.authorAvatar }} style={styles.authorAvatarImage} />
          </TouchableOpacity>
          <View style={styles.authorDetails}>
            <Text style={styles.authorName}>{reel.author}</Text>
            <Text style={styles.reelTitle}>{reel.title}</Text>
          </View>
          <TouchableOpacity style={styles.followButton} onPress={onProfilePress}>
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.reelDescription}>{reel.description}</Text>

        {/* Hashtags */}
        <View style={styles.hashtags}>
          {reel.hashtags.slice(0, 3).map((tag, i) => (
            <Text key={i} style={styles.hashtag}>{tag}</Text>
          ))}
          {reel.hashtags.length > 3 && (
            <Text style={styles.hashtag}>+{reel.hashtags.length - 3} more</Text>
          )}
        </View>

        {/* Product Tag */}
        <TouchableOpacity style={styles.productTag} onPress={onProductPress}>
          <View style={styles.productTagIcon}>
            <Leaf style={styles.productTagLeaf} />
          </View>
          <Text style={styles.productTagText}>Shop Featured Product</Text>
          <ChevronRight style={styles.productTagArrow} />
        </TouchableOpacity>
      </View>

      {/* Actions Sidebar */}
      <View style={styles.actionsSidebar}>
        <TouchableOpacity style={styles.actionButton} onPress={onProfilePress}>
          <Image source={{ uri: reel.authorAvatar }} style={styles.actionAvatar} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <View style={styles.actionIconWrapper}>
            {liked ? (
              <HeartFilled style={[styles.actionIcon, styles.actionIconLiked]} />
            ) : (
              <Heart style={styles.actionIcon} />
            )}
          </View>
          <Text style={[styles.actionCount, liked && styles.actionCountLiked]}>{formatCount(reel.likes)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onCommentsPress}>
          <View style={styles.actionIconWrapper}>
            <MessageCircle style={styles.actionIcon} />
          </View>
          <Text style={styles.actionCount}>{formatCount(reel.comments)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <View style={styles.actionIconWrapper}>
            <Share2 style={styles.actionIcon} />
          </View>
          <Text style={styles.actionCount}>{formatCount(reel.shares)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onSave}>
          <View style={styles.actionIconWrapper}>
            {saved ? (
              <BookmarkFilled style={[styles.actionIcon, styles.actionIconSaved]} />
            ) : (
              <Bookmark style={styles.actionIcon} />
            )}
          </View>
          <Text style={[styles.actionCount, saved && styles.actionCountSaved]}>{formatCount(reel.saves)}</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Gradient */}
      <View style={styles.bottomGradient} />
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
  reelsScroll: {
    flex: 1,
  },
  reelsContainer: {
    paddingBottom: 8,
  },
  reelCard: {
    position: 'relative',
  },
  reelWrapper: {
    flex: 1,
    position: 'relative',
  },
  reelVideo: {
    width: screenWidth,
    height: screenHeight * 0.6,
    borderRadius: 16,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
  },
  playIcon: {
    color: '#FFFFFF',
    opacity: 0.9,
  },
  durationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  contentInfo: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    right: 80,
    gap: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  authorAvatarImage: {
    width: '100%',
    height: '100%',
  },
  authorDetails: {
    flex: 1,
    gap: 2,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
  },
  reelTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter_400Regular',
  },
  followButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backdropFilter: 'blur(10px)',
  },
  followText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  reelDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  hashtags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  hashtag: {
    color: '#D9A441',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  productTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 9999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backdropFilter: 'blur(10px)',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  productTagIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D9A441',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productTagLeaf: {
    color: '#FFFFFF',
  },
  productTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  productTagArrow: {
    color: '#FFFFFF',
  },
  actionsSidebar: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    gap: 20,
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  actionAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  actionIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  actionIcon: {
    color: '#FFFFFF',
  },
  actionIconLiked: {
    color: '#EF4444',
  },
  actionIconSaved: {
    color: '#D9A441',
  },
  actionCount: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  actionCountLiked: {
    color: '#EF4444',
  },
  actionCountSaved: {
    color: '#D9A441',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: 'transparent',
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
});