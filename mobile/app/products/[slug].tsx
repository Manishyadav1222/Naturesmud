import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  ShieldCheck,
  Truck,
  Leaf,
  Plus,
  Minus,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Sparkles,
  MessageSquare,
} from 'lucide-react-native';
import { products as allProducts } from '@/lib/data/products';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { toast } from '@/store/ui-store';

const { width: screenWidth } = Dimensions.get('window');

const WEIGHT_OPTIONS = ['50g', '100g', '250g', '500g', '1kg'];

export default function ProductDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const product = allProducts.find((p) => p.slug === slug) || allProducts[0];
  const { addItem } = useCartStore();
  const { toggleFavorite, isFavorite } = useWishlistStore();

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedWeight, setSelectedWeight] = useState(product.weight || '50g');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'benefits' | 'nutrition' | 'reviews'>('details');

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewsList, setReviewsList] = useState([
    {
      id: 'rev_1',
      name: 'Pooja K.',
      rating: 5,
      date: '3 days ago',
      comment: 'Authentic pure quality! You can feel the energy and purity of the Himalayas in every dose.',
      verified: true,
    },
    {
      id: 'rev_2',
      name: 'Bikash Shrestha',
      rating: 5,
      date: '1 week ago',
      comment: 'Prompt delivery in Pokhara. The packaging is eco-friendly and sealed properly.',
      verified: true,
    },
  ]);

  const discount = product.compareAtPrice
    ? calculateDiscount(product.compareAtPrice, product.price)
    : 0;

  const favorited = isFavorite(product.id);

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        image: product.image,
        weight: selectedWeight,
        category: product.category,
      },
      quantity
    );
    toast.success('Added to Cart', `${quantity}x ${product.name} added.`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const handleToggleFav = () => {
    const nextState = toggleFavorite(product.id);
    if (nextState) {
      toast.success('Saved to Favorites', `${product.name} added to your wishlist.`);
    } else {
      toast.info('Removed from Favorites', `${product.name} removed.`);
    }
  };

  const handleAddReview = () => {
    if (!reviewName.trim() || !reviewComment.trim()) {
      Alert.alert('Missing Fields', 'Please enter your name and comments.');
      return;
    }
    const newRev = {
      id: `rev_${Date.now()}`,
      name: reviewName.trim(),
      rating: reviewRating,
      date: 'Just now',
      comment: reviewComment.trim(),
      verified: true,
    };
    setReviewsList([newRev, ...reviewsList]);
    setShowReviewModal(false);
    setReviewName('');
    setReviewComment('');
    toast.success('Review Submitted', 'Thank you for your feedback!');
  };

  const galleryImages = [
    product.image,
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600',
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#1C1917" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.name}
        </Text>
        <View style={styles.headerRightBtns}>
          <TouchableOpacity style={styles.headerBtn} onPress={handleToggleFav}>
            <Heart
              size={20}
              color={favorited ? '#DC2626' : '#1C1917'}
              fill={favorited ? '#DC2626' : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Image Banner */}
        <View style={styles.imageGalleryContainer}>
          <Image source={{ uri: selectedImage }} style={styles.mainImage} resizeMode="cover" />
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% OFF</Text>
            </View>
          )}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{product.category}</Text>
          </View>
        </View>

        {/* Image Thumbnails */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnailsRow}>
          {galleryImages.map((img, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.thumbBox, selectedImage === img && styles.thumbBoxActive]}
              onPress={() => setSelectedImage(img)}
            >
              <Image source={{ uri: img }} style={styles.thumbImg} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Product Details Header */}
        <View style={styles.infoSection}>
          <Text style={styles.productName}>{product.name}</Text>

          {/* Rating and Reviews Count */}
          <View style={styles.ratingRow}>
            <View style={styles.starsBox}>
              <Star size={16} color="#D97706" fill="#D97706" />
              <Text style={styles.ratingScore}>{product.rating || 4.9}</Text>
            </View>
            <Text style={styles.ratingCount}>({reviewsList.length + 18} Verified Reviews)</Text>
            <View style={styles.stockBadge}>
              <CheckCircle2 size={12} color="#16A34A" />
              <Text style={styles.stockText}>In Stock (Himalayan Fresh)</Text>
            </View>
          </View>

          {/* Price Block */}
          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>{formatPrice(product.price)}</Text>
            {product.compareAtPrice && (
              <Text style={styles.comparePrice}>{formatPrice(product.compareAtPrice)}</Text>
            )}
            <Text style={styles.taxInclusive}>Inclusive of all Nepal taxes</Text>
          </View>

          {/* Weight Selection */}
          <View style={styles.weightSelector}>
            <Text style={styles.sectionLabel}>Select Package Size</Text>
            <View style={styles.weightChips}>
              {WEIGHT_OPTIONS.map((w) => (
                <TouchableOpacity
                  key={w}
                  style={[styles.weightChip, selectedWeight === w && styles.weightChipActive]}
                  onPress={() => setSelectedWeight(w)}
                >
                  <Text
                    style={[
                      styles.weightChipText,
                      selectedWeight === w && styles.weightChipTextActive,
                    ]}
                  >
                    {w}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quantity Counter */}
          <View style={styles.qtyRow}>
            <Text style={styles.sectionLabel}>Quantity</Text>
            <View style={styles.qtyCounter}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={16} color="#1C1917" />
              </TouchableOpacity>
              <Text style={styles.qtyVal}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Plus size={16} color="#1C1917" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Purity Guarantee Strip */}
        <View style={styles.guaranteeBox}>
          <View style={styles.guaranteeItem}>
            <Leaf size={20} color="#365314" />
            <Text style={styles.guaranteeText}>100% Organic Harvest</Text>
          </View>
          <View style={styles.guaranteeItem}>
            <ShieldCheck size={20} color="#365314" />
            <Text style={styles.guaranteeText}>Lab Certified Pure</Text>
          </View>
          <View style={styles.guaranteeItem}>
            <Truck size={20} color="#365314" />
            <Text style={styles.guaranteeText}>Free Shipping Rs.3k+</Text>
          </View>
        </View>

        {/* Tabs: Details, Benefits, Nutrition, Reviews */}
        <View style={styles.tabSection}>
          <View style={styles.tabHeaderRow}>
            {(['details', 'benefits', 'nutrition', 'reviews'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.contentTab, activeTab === tab && styles.contentTabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.contentTabText,
                    activeTab === tab && styles.contentTabTextActive,
                  ]}
                >
                  {tab === 'details'
                    ? 'Overview'
                    : tab === 'benefits'
                    ? 'Benefits'
                    : tab === 'nutrition'
                    ? 'Nutrition'
                    : 'Reviews'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab 1: Details */}
          {activeTab === 'details' && (
            <View style={styles.tabBody}>
              <Text style={styles.bodyParagraph}>{product.description}</Text>
              <View style={styles.highlightsBox}>
                <Text style={styles.highlightsTitle}>🌿 Harvest Highlights</Text>
                <Text style={styles.highlightItem}>• Sourced directly from authentic Himalayan regions</Text>
                <Text style={styles.highlightItem}>• Unprocessed, preservative-free, zero chemicals</Text>
                <Text style={styles.highlightItem}>• Packaged in UV-resistant protective amber containers</Text>
              </View>
            </View>
          )}

          {/* Tab 2: Benefits */}
          {activeTab === 'benefits' && (
            <View style={styles.tabBody}>
              {product.benefits && product.benefits.length > 0 ? (
                product.benefits.map((b, i) => (
                  <View key={i} style={styles.benefitRow}>
                    <CheckCircle2 size={16} color="#365314" style={{ marginTop: 2 }} />
                    <Text style={styles.benefitText}>{b}</Text>
                  </View>
                ))
              ) : (
                <>
                  <View style={styles.benefitRow}>
                    <CheckCircle2 size={16} color="#365314" style={{ marginTop: 2 }} />
                    <Text style={styles.benefitText}>Rich in 85+ bioavailable ionic trace minerals</Text>
                  </View>
                  <View style={styles.benefitRow}>
                    <CheckCircle2 size={16} color="#365314" style={{ marginTop: 2 }} />
                    <Text style={styles.benefitText}>Supports natural vitality, stamina and healthy immunity</Text>
                  </View>
                  <View style={styles.benefitRow}>
                    <CheckCircle2 size={16} color="#365314" style={{ marginTop: 2 }} />
                    <Text style={styles.benefitText}>Promotes balanced metabolism and cognitive focus</Text>
                  </View>
                </>
              )}
            </View>
          )}

          {/* Tab 3: Nutrition */}
          {activeTab === 'nutrition' && (
            <View style={styles.tabBody}>
              <View style={styles.nutritionTable}>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionKey}>Fulvic Acid Content</Text>
                  <Text style={styles.nutritionVal}>65.4%</Text>
                </View>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionKey}>Bio-minerals Count</Text>
                  <Text style={styles.nutritionVal}>85+ Minerals</Text>
                </View>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionKey}>Purity Standard</Text>
                  <Text style={styles.nutritionVal}>Grade A Himalayan</Text>
                </View>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionKey}>Preservatives</Text>
                  <Text style={styles.nutritionVal}>0% (Pure)</Text>
                </View>
              </View>
            </View>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'reviews' && (
            <View style={styles.tabBody}>
              <View style={styles.reviewsHeader}>
                <View>
                  <Text style={styles.reviewsAvgText}>4.9 out of 5</Text>
                  <Text style={styles.reviewsTotalText}>Based on customer feedback</Text>
                </View>
                <TouchableOpacity
                  style={styles.writeReviewBtn}
                  onPress={() => setShowReviewModal(true)}
                >
                  <MessageSquare size={15} color="#FFFFFF" />
                  <Text style={styles.writeReviewBtnText}>Write Review</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.reviewsList}>
                {reviewsList.map((rev) => (
                  <View key={rev.id} style={styles.reviewCard}>
                    <View style={styles.revTop}>
                      <Text style={styles.revName}>{rev.name}</Text>
                      <Text style={styles.revDate}>{rev.date}</Text>
                    </View>
                    <View style={styles.revStars}>
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} size={13} color="#D97706" fill="#D97706" />
                      ))}
                    </View>
                    <Text style={styles.revComment}>{rev.comment}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceCol}>
          <Text style={styles.bottomTotalLabel}>Total Price</Text>
          <Text style={styles.bottomTotalVal}>
            {formatPrice(product.price * quantity)}
          </Text>
        </View>
        <View style={styles.bottomButtonsRow}>
          <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
            <ShoppingBag size={18} color="#365314" />
            <Text style={styles.cartBtnText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyNowBtn} onPress={handleBuyNow}>
            <Text style={styles.buyNowBtnText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Write Review Modal */}
      <Modal visible={showReviewModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Write a Review</Text>
            <Text style={styles.modalSubtitle}>Share your experience with this Himalayan harvest</Text>

            <View style={styles.starSelectRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => setReviewRating(s)}>
                  <Star
                    size={28}
                    color="#D97706"
                    fill={s <= reviewRating ? '#D97706' : 'transparent'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Your Name"
              placeholderTextColor="#A8A29E"
              value={reviewName}
              onChangeText={setReviewName}
            />

            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="How did this product help your wellness?"
              placeholderTextColor="#A8A29E"
              multiline
              numberOfLines={4}
              value={reviewComment}
              onChangeText={setReviewComment}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowReviewModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleAddReview}>
                <Text style={styles.modalSubmitText}>Submit Review</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
    backgroundColor: '#FFFFFF',
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F5F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1917',
    textAlign: 'center',
    marginHorizontal: 12,
  },
  headerRightBtns: {
    flexDirection: 'row',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  imageGalleryContainer: {
    width: '100%',
    height: 320,
    backgroundColor: '#F5F5F4',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  categoryBadgeText: {
    color: '#365314',
    fontWeight: '700',
    fontSize: 12,
  },
  thumbnailsRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: '#FFFFFF',
  },
  thumbBox: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E7E5E4',
    overflow: 'hidden',
  },
  thumbBoxActive: {
    borderColor: '#365314',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
    gap: 12,
  },
  productName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1917',
    lineHeight: 28,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  starsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ratingScore: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
  },
  ratingCount: {
    fontSize: 12,
    color: '#78716C',
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFCCB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#365314',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: '#365314',
  },
  comparePrice: {
    fontSize: 16,
    color: '#A8A29E',
    textDecorationLine: 'line-through',
  },
  taxInclusive: {
    fontSize: 11,
    color: '#78716C',
  },
  weightSelector: {
    marginTop: 8,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#292524',
  },
  weightChips: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  weightChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F5F5F4',
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  weightChipActive: {
    backgroundColor: '#365314',
    borderColor: '#365314',
  },
  weightChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#57534E',
  },
  weightChipTextActive: {
    color: '#FFFFFF',
  },
  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  qtyBtn: {
    padding: 10,
  },
  qtyVal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1917',
    paddingHorizontal: 14,
  },
  guaranteeBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F7FEE7',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D9F99D',
  },
  guaranteeItem: {
    alignItems: 'center',
    gap: 4,
  },
  guaranteeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#365314',
  },
  tabSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  tabHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
  },
  contentTab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  contentTabActive: {
    borderBottomWidth: 2.5,
    borderBottomColor: '#365314',
  },
  contentTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#78716C',
  },
  contentTabTextActive: {
    color: '#365314',
    fontWeight: '700',
  },
  tabBody: {
    padding: 18,
  },
  bodyParagraph: {
    fontSize: 14,
    color: '#44403C',
    lineHeight: 22,
  },
  highlightsBox: {
    backgroundColor: '#F5F5F4',
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
    gap: 6,
  },
  highlightsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1917',
    marginBottom: 4,
  },
  highlightItem: {
    fontSize: 13,
    color: '#57534E',
    lineHeight: 18,
  },
  benefitRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  benefitText: {
    flex: 1,
    fontSize: 13,
    color: '#292524',
    lineHeight: 18,
  },
  nutritionTable: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    overflow: 'hidden',
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F4',
  },
  nutritionKey: {
    fontSize: 13,
    color: '#78716C',
  },
  nutritionVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1917',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewsAvgText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1917',
  },
  reviewsTotalText: {
    fontSize: 12,
    color: '#78716C',
  },
  writeReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#365314',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  writeReviewBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  reviewsList: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: '#F5F5F4',
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  revTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  revName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1917',
  },
  revDate: {
    fontSize: 11,
    color: '#A8A29E',
  },
  revStars: {
    flexDirection: 'row',
    gap: 2,
  },
  revComment: {
    fontSize: 13,
    color: '#44403C',
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E7E5E4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomPriceCol: {
    justifyContent: 'center',
  },
  bottomTotalLabel: {
    fontSize: 11,
    color: '#78716C',
  },
  bottomTotalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#365314',
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFCCB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  cartBtnText: {
    color: '#365314',
    fontWeight: '700',
    fontSize: 14,
  },
  buyNowBtn: {
    backgroundColor: '#365314',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyNowBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    gap: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1917',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#78716C',
  },
  starSelectRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 6,
  },
  modalInput: {
    backgroundColor: '#F5F5F4',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: '#1C1917',
  },
  modalTextArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  modalCancelText: {
    fontSize: 14,
    color: '#78716C',
    fontWeight: '600',
  },
  modalSubmitBtn: {
    backgroundColor: '#365314',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});