import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Clock,
  ChefHat,
  Users,
  Flame,
  Sparkles,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react-native';
import { recipes, type Recipe } from '@/lib/data/content';

// Extend type locally if needed
type RecipeItem = typeof recipes[0];

const { width: screenWidth } = Dimensions.get('window');

const CATEGORIES = ['All', 'Beverages', 'Breakfast', 'Snacks', 'Meals', 'Desserts'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: '#15803D',
  Medium: '#D97706',
  Hard: '#DC2626',
};

export default function RecipesScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const featured = recipes.find((r) => r.featured) || recipes[0];

  const filtered = selectedCategory === 'All'
    ? recipes
    : recipes.filter((r) => r.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={20} color="#1A3826" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <View style={styles.headerBadge}>
              <ChefHat size={12} color="#1A3826" />
              <Text style={styles.headerBadgeText}>Himalayan Kitchen</Text>
            </View>
            <Text style={styles.pageTitle}>Superfood Recipes</Text>
            <Text style={styles.pageSubtitle}>Nourishing recipes made with NaturesMud products</Text>
          </View>
        </View>

        {/* Featured Recipe Card */}
        <TouchableOpacity
          style={styles.featuredCard}
          activeOpacity={0.92}
          onPress={() => router.push({ pathname: '/recipes/[slug]', params: { slug: featured.slug } })}
        >
          <Image source={{ uri: featured.image }} style={styles.featuredImage} resizeMode="cover" />
          <View style={styles.featuredOverlay} />
          <View style={styles.featuredBadgeRow}>
            <View style={styles.featuredPill}>
              <Sparkles size={11} color="#D97706" />
              <Text style={styles.featuredPillText}>Chef's Pick</Text>
            </View>
            <View style={[styles.diffBadge, { backgroundColor: DIFFICULTY_COLOR[featured.difficulty] || '#1A3826' }]}>
              <Flame size={10} color="#FFFFFF" />
              <Text style={styles.diffText}>{featured.difficulty}</Text>
            </View>
          </View>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredCategory}>{featured.category}</Text>
            <Text style={styles.featuredTitle}>{featured.title}</Text>
            <View style={styles.featuredStats}>
              <View style={styles.statItem}>
                <Clock size={13} color="rgba(255,255,255,0.85)" />
                <Text style={styles.statText}>{featured.prepTime + featured.cookTime} min</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Users size={13} color="rgba(255,255,255,0.85)" />
                <Text style={styles.statText}>{featured.servings} servings</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <ChefHat size={13} color="rgba(255,255,255,0.85)" />
                <Text style={styles.statText}>{featured.ingredients.length} ingredients</Text>
              </View>
            </View>
            <View style={styles.makeItRow}>
              <Text style={styles.makeItText}>Make This Recipe</Text>
              <ChevronRight size={14} color="#FFFFFF" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
            >
              <Text style={[styles.catChipText, selectedCategory === cat && styles.catChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recipes Grid */}
        <View style={styles.recipesSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'All Recipes' : selectedCategory}
            <Text style={styles.sectionCount}> ({filtered.length})</Text>
          </Text>

          <View style={styles.recipesGrid}>
            {filtered.map((recipe, idx) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                index={idx}
                onPress={() => router.push({ pathname: '/recipes/[slug]', params: { slug: recipe.slug } })}
              />
            ))}
          </View>
        </View>

        {/* Shop CTA */}
        <TouchableOpacity
          style={styles.shopCTA}
          onPress={() => router.push('/(tabs)/products')}
          activeOpacity={0.9}
        >
          <ShoppingBag size={20} color="#FFFFFF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.shopCTATitle}>Get the Ingredients</Text>
            <Text style={styles.shopCTASub}>Shop 100% pure NaturesMud superfoods</Text>
          </View>
          <ChevronRight size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function RecipeCard({
  recipe,
  index,
  onPress,
}: {
  recipe: RecipeItem;
  index: number;
  onPress: () => void;
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

  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <Animated.View style={[{ opacity: fadeAnim }, styles.recipeCardWrap]}>
      <TouchableOpacity style={styles.recipeCard} onPress={onPress} activeOpacity={0.88}>
        <View style={styles.recipeImgContainer}>
          <Image source={{ uri: recipe.image }} style={styles.recipeImg} resizeMode="cover" />
          <View style={[
            styles.recipeTimeBadge,
            { backgroundColor: DIFFICULTY_COLOR[recipe.difficulty] || '#1A3826' }
          ]}>
            <Text style={styles.recipeTimeBadgeText}>{recipe.difficulty}</Text>
          </View>
        </View>
        <View style={styles.recipeBody}>
          <Text style={styles.recipeCategory}>{recipe.category}</Text>
          <Text style={styles.recipeTitle} numberOfLines={2}>{recipe.title}</Text>
          <View style={styles.recipeStats}>
            <View style={styles.recipeStatItem}>
              <Clock size={11} color="#78716C" />
              <Text style={styles.recipeStatText}>{totalTime} min</Text>
            </View>
            <View style={styles.recipeStatDot} />
            <View style={styles.recipeStatItem}>
              <Users size={11} color="#78716C" />
              <Text style={styles.recipeStatText}>{recipe.servings}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2' },
  scrollContent: { paddingBottom: 40 },

  pageHeader: { padding: 16, gap: 12 },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F0EDE7', justifyContent: 'center', alignItems: 'center',
  },
  headerText: { gap: 6 },
  headerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, alignSelf: 'flex-start',
  },
  headerBadgeText: { fontSize: 10, fontWeight: '700', color: '#92400E' },
  pageTitle: { fontSize: 30, fontWeight: '900', color: '#1A3826', letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 13, color: '#78716C', lineHeight: 18 },

  featuredCard: {
    marginHorizontal: 16, borderRadius: 24, overflow: 'hidden',
    height: 340, position: 'relative',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 16, elevation: 8,
  },
  featuredImage: { width: '100%', height: '100%' },
  featuredOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.48)' },
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
  diffBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  diffText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
  featuredContent: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 18, gap: 8, zIndex: 5,
  },
  featuredCategory: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase' },
  featuredTitle: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.3 },
  featuredStats: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  statDivider: { width: 1, height: 14, backgroundColor: 'rgba(255,255,255,0.3)' },
  makeItRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', marginTop: 2,
  },
  makeItText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  categoryRow: { paddingHorizontal: 16, paddingVertical: 16, gap: 8 },
  catChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#F0EDE7', borderWidth: 1, borderColor: '#E2D9CB',
  },
  catChipActive: { backgroundColor: '#1A3826', borderColor: '#1A3826' },
  catChipText: { fontSize: 12, fontWeight: '600', color: '#78716C' },
  catChipTextActive: { color: '#FFFFFF' },

  recipesSection: { paddingHorizontal: 16, gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#1A3826' },
  sectionCount: { fontWeight: '500', color: '#78716C' },

  recipesGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
  },
  recipeCardWrap: { width: (screenWidth - 44) / 2 },
  recipeCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: '#EAE3D6',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  recipeImgContainer: { position: 'relative' },
  recipeImg: { width: '100%', height: 130 },
  recipeTimeBadge: {
    position: 'absolute', top: 8, right: 8,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12,
  },
  recipeTimeBadgeText: { fontSize: 9, fontWeight: '800', color: '#FFFFFF' },
  recipeBody: { padding: 10, gap: 4 },
  recipeCategory: { fontSize: 9, fontWeight: '700', color: '#1A3826', textTransform: 'uppercase' },
  recipeTitle: { fontSize: 13, fontWeight: '800', color: '#1C1917', lineHeight: 18 },
  recipeStats: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  recipeStatItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  recipeStatText: { fontSize: 10, color: '#78716C' },
  recipeStatDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#D6D3D1' },

  shopCTA: {
    margin: 16, backgroundColor: '#1A3826', borderRadius: 20,
    padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 24,
  },
  shopCTATitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  shopCTASub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
});
