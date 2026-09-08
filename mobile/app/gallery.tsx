import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  Modal,
  FlatList,
  StatusBar,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, X, Play, Instagram, ChevronRight, Grid2X2, Layers } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const ITEM_SIZE = (screenWidth - 52) / 3;

const GALLERY_IMAGES = [
  { id: '1', uri: 'https://naturesmud.shop/images/gallery/shilajit-harvest.jpg', type: 'photo', caption: 'Shilajit harvested from 4000m altitude' },
  { id: '2', uri: 'https://naturesmud.shop/images/gallery/chia-seeds-bowl.jpg', type: 'photo', caption: 'Organic Chia Seeds — Morning ritual' },
  { id: '3', uri: 'https://naturesmud.shop/images/gallery/dates-powder-cooking.jpg', type: 'photo', caption: 'Dates Powder — Baby-safe sweetener' },
  { id: '4', uri: 'https://naturesmud.shop/images/gallery/wild-honey-harvest.jpg', type: 'photo', caption: 'Wild Himalayan Honey harvest ceremony' },
  { id: '5', uri: 'https://naturesmud.shop/images/gallery/moringa-farm.jpg', type: 'photo', caption: 'Moringa grown at 2000m altitude' },
  { id: '6', uri: 'https://naturesmud.shop/images/gallery/pumpkin-seeds-jar.jpg', type: 'photo', caption: 'Premium raw pumpkin seeds' },
  { id: '7', uri: 'https://naturesmud.shop/images/gallery/beetroot-powder.jpg', type: 'photo', caption: 'Sun-dehydrated Beetroot Powder' },
  { id: '8', uri: 'https://naturesmud.shop/images/gallery/products-flatlay.jpg', type: 'photo', caption: 'NaturesMud full lineup' },
  { id: '9', uri: 'https://naturesmud.shop/images/gallery/packaging-detail.jpg', type: 'photo', caption: 'Eco-friendly packaging' },
  { id: '10', uri: 'https://naturesmud.shop/images/gallery/cashews-himalayan.jpg', type: 'photo', caption: 'Royal Himalayan cashews' },
  { id: '11', uri: 'https://naturesmud.shop/images/gallery/cranberries-dried.jpg', type: 'photo', caption: 'Ruby cranberries — Dried & whole' },
  { id: '12', uri: 'https://naturesmud.shop/images/gallery/kitchen-lifestyle.jpg', type: 'photo', caption: 'Natural living with NaturesMud' },
];

const REELS = [
  { id: 'r1', thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400', url: 'https://www.instagram.com/naturesmud.np/', caption: 'How we harvest Shilajit' },
  { id: 'r2', thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', url: 'https://www.instagram.com/naturesmud.np/', caption: 'Morning Ritual with Superfoods' },
  { id: 'r3', thumbnail: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', url: 'https://www.instagram.com/naturesmud.np/', caption: 'Chia Pudding Recipe' },
  { id: 'r4', thumbnail: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400', url: 'https://www.instagram.com/naturesmud.np/', caption: 'Energy Balls Tutorial' },
];

// Fallback image for gallery items
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400',
  'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
  'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400',
  'https://images.unsplash.com/photo-1515488042261-424e6a5a7f3e?w=400',
  'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400',
  'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400',
  'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400',
  'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=400',
  'https://images.unsplash.com/photo-1502741509987-b5b1f65651b2?w=400',
];

const GALLERY = GALLERY_IMAGES.map((item, idx) => ({
  ...item,
  uri: FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length],
}));

export default function GalleryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'photos' | 'reels'>('photos');
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const openLightbox = (idx: number) => {
    setSelectedIndex(idx);
    setLightboxVisible(true);
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: idx, animated: false });
    }, 100);
  };

  const handleInstagram = () => {
    Linking.openURL('https://www.instagram.com/naturesmud.np/').catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#1A3826" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Gallery</Text>
          <Text style={styles.headerSub}>NaturesMud Nepal</Text>
        </View>
        <TouchableOpacity style={styles.igBtn} onPress={handleInstagram}>
          <Instagram size={20} color="#E1306C" />
        </TouchableOpacity>
      </View>

      {/* Tab Toggle */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'photos' && styles.tabActive]}
          onPress={() => setActiveTab('photos')}
        >
          <Grid2X2 size={16} color={activeTab === 'photos' ? '#FFFFFF' : '#78716C'} />
          <Text style={[styles.tabText, activeTab === 'photos' && styles.tabTextActive]}>Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reels' && styles.tabActive]}
          onPress={() => setActiveTab('reels')}
        >
          <Play size={16} color={activeTab === 'reels' ? '#FFFFFF' : '#78716C'} />
          <Text style={[styles.tabText, activeTab === 'reels' && styles.tabTextActive]}>Reels</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'photos' ? (
          <>
            {/* Masonry-style photo grid */}
            <View style={styles.gridSection}>
              <Text style={styles.sectionTitle}>Our Himalayan Journey</Text>
              <Text style={styles.sectionSubtitle}>{GALLERY.length} photos • Tap to view</Text>
            </View>

            <View style={styles.photoGrid}>
              {GALLERY.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.photoItem,
                    idx % 5 === 0 && styles.photoItemWide, // Every 5th item is wider
                  ]}
                  onPress={() => openLightbox(idx)}
                  activeOpacity={0.88}
                >
                  <Image
                    source={{ uri: item.uri }}
                    style={styles.photoImg}
                    resizeMode="cover"
                  />
                  <View style={styles.photoOverlay} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Instagram CTA */}
            <TouchableOpacity style={styles.igCTA} onPress={handleInstagram} activeOpacity={0.9}>
              <Instagram size={22} color="#FFFFFF" />
              <View style={{ flex: 1 }}>
                <Text style={styles.igCTATitle}>Follow @naturesmud.np</Text>
                <Text style={styles.igCTASub}>Daily updates from the Himalayas</Text>
              </View>
              <ChevronRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Reels / Videos */}
            <View style={styles.gridSection}>
              <Text style={styles.sectionTitle}>Our Instagram Reels</Text>
              <Text style={styles.sectionSubtitle}>Behind-the-scenes & tutorials</Text>
            </View>

            <View style={styles.reelsGrid}>
              {REELS.map((reel) => (
                <TouchableOpacity
                  key={reel.id}
                  style={styles.reelCard}
                  onPress={() => Linking.openURL(reel.url).catch(() => {})}
                  activeOpacity={0.88}
                >
                  <Image source={{ uri: reel.thumbnail }} style={styles.reelThumbnail} resizeMode="cover" />
                  <View style={styles.reelOverlay} />
                  <View style={styles.playButton}>
                    <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
                  </View>
                  <View style={styles.reelCaption}>
                    <Text style={styles.reelCaptionText} numberOfLines={2}>{reel.caption}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.igCTA} onPress={handleInstagram} activeOpacity={0.9}>
              <Instagram size={22} color="#FFFFFF" />
              <View style={{ flex: 1 }}>
                <Text style={styles.igCTATitle}>Watch All Reels on Instagram</Text>
                <Text style={styles.igCTASub}>@naturesmud.np</Text>
              </View>
              <ChevronRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Lightbox Modal */}
      <Modal
        visible={lightboxVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLightboxVisible(false)}
      >
        <View style={styles.lightboxBg}>
          <TouchableOpacity
            style={styles.lightboxClose}
            onPress={() => setLightboxVisible(false)}
          >
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <FlatList
            ref={flatListRef}
            data={GALLERY}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={selectedIndex}
            getItemLayout={(_, idx) => ({ length: screenWidth, offset: screenWidth * idx, index: idx })}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
              setSelectedIndex(idx);
            }}
            renderItem={({ item }) => (
              <View style={styles.lightboxItem}>
                <Image
                  source={{ uri: item.uri }}
                  style={styles.lightboxImage}
                  resizeMode="contain"
                />
                <View style={styles.lightboxCaption}>
                  <Text style={styles.lightboxCaptionText}>{item.caption}</Text>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />

          <Text style={styles.lightboxCounter}>
            {selectedIndex + 1} / {GALLERY.length}
          </Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EAE3D6',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F0EDE7', justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#1A3826' },
  headerSub: { fontSize: 10, color: '#78716C', fontWeight: '600' },
  igBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#FFF0F5', justifyContent: 'center', alignItems: 'center',
  },

  tabRow: {
    flexDirection: 'row', padding: 12, gap: 8,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EAE3D6',
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#F0EDE7', borderWidth: 1, borderColor: '#E2D9CB',
  },
  tabActive: { backgroundColor: '#1A3826', borderColor: '#1A3826' },
  tabText: { fontSize: 13, fontWeight: '700', color: '#78716C' },
  tabTextActive: { color: '#FFFFFF' },

  scrollContent: { padding: 16, paddingBottom: 40 },
  gridSection: { gap: 4, marginBottom: 14 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#1A3826' },
  sectionSubtitle: { fontSize: 12, color: '#78716C' },

  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 20 },
  photoItem: {
    width: ITEM_SIZE, height: ITEM_SIZE, borderRadius: 12, overflow: 'hidden',
  },
  photoItemWide: { width: ITEM_SIZE * 2 + 4 },
  photoImg: { width: '100%', height: '100%' },
  photoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },

  reelsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  reelCard: {
    width: (screenWidth - 44) / 2, height: 240, borderRadius: 20,
    overflow: 'hidden', position: 'relative',
  },
  reelThumbnail: { width: '100%', height: '100%' },
  reelOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  playButton: {
    position: 'absolute', top: '50%', left: '50%',
    marginTop: -24, marginLeft: -24,
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
    zIndex: 5,
  },
  reelCaption: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 10, zIndex: 5,
  },
  reelCaptionText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF', lineHeight: 16 },

  igCTA: {
    backgroundColor: '#E1306C', borderRadius: 20, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  igCTATitle: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  igCTASub: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  // Lightbox
  lightboxBg: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
  },
  lightboxClose: {
    position: 'absolute', top: 50, right: 20, zIndex: 100,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  lightboxItem: { width: screenWidth, justifyContent: 'center', alignItems: 'center' },
  lightboxImage: { width: screenWidth, height: screenHeight * 0.7 },
  lightboxCaption: {
    position: 'absolute', bottom: -40, left: 0, right: 0,
    paddingHorizontal: 24, paddingVertical: 8,
  },
  lightboxCaptionText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  lightboxCounter: {
    position: 'absolute', bottom: 40, width: '100%', textAlign: 'center',
    fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '600',
  },
});
