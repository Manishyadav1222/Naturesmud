import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Clock,
  Users,
  ChefHat,
  CheckCircle2,
  Circle,
  ShoppingBag,
  ChevronRight,
  Share2,
} from 'lucide-react-native';
import { recipes } from '@/lib/data/content';
import { Share } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: '#15803D',
  Medium: '#D97706',
  Hard: '#DC2626',
};

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const recipe = recipes.find((r) => r.slug === slug) || recipes[0];
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleStep = (idx: number) => {
    setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const totalTime = recipe.prepTime + recipe.cookTime;
  const diffColor = DIFFICULTY_COLOR[recipe.difficulty] || '#1A3826';

  const handleShare = async () => {
    try {
      await Share.share({
        title: recipe.title,
        message: `Try this amazing recipe: ${recipe.title}\nhttps://naturesmud.shop/recipes/${recipe.slug}`,
      });
    } catch {}
  };

  const completedIngredients = Object.values(checkedIngredients).filter(Boolean).length;
  const completedSteps = Object.values(checkedSteps).filter(Boolean).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: recipe.image }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <View style={styles.heroTopRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.circleBtn}>
              <ArrowLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.circleBtn}>
              <Share2 size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={[styles.diffBadge, { backgroundColor: diffColor }]}>
            <Text style={styles.diffText}>{recipe.difficulty}</Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Title */}
          <Text style={styles.categoryLabel}>{recipe.category}</Text>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <Text style={styles.recipeExcerpt}>{recipe.excerpt}</Text>

          {/* Stats Row */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Clock size={18} color="#1A3826" />
              <Text style={styles.statValue}>{recipe.prepTime}m</Text>
              <Text style={styles.statLabel}>Prep</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <ChefHat size={18} color="#1A3826" />
              <Text style={styles.statValue}>{recipe.cookTime}m</Text>
              <Text style={styles.statLabel}>Cook</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Clock size={18} color="#1A3826" />
              <Text style={styles.statValue}>{totalTime}m</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Users size={18} color="#1A3826" />
              <Text style={styles.statValue}>{recipe.servings}</Text>
              <Text style={styles.statLabel}>Serves</Text>
            </View>
          </View>

          {/* Ingredients Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <Text style={styles.sectionProgress}>
                {completedIngredients}/{recipe.ingredients.length}
              </Text>
            </View>
            <Text style={styles.sectionHint}>Tap to check off as you gather them</Text>
            {recipe.ingredients.map((ing, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.ingredientRow, checkedIngredients[idx] && styles.ingredientRowChecked]}
                onPress={() => toggleIngredient(idx)}
                activeOpacity={0.7}
              >
                {checkedIngredients[idx]
                  ? <CheckCircle2 size={20} color="#15803D" />
                  : <Circle size={20} color="#D6D3D1" />
                }
                <Text style={[
                  styles.ingredientText,
                  checkedIngredients[idx] && styles.ingredientTextChecked,
                ]}>
                  {ing}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Instructions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              <Text style={styles.sectionProgress}>
                {completedSteps}/{recipe.instructions.length}
              </Text>
            </View>
            {recipe.instructions.map((step, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.stepCard, checkedSteps[idx] && styles.stepCardDone]}
                onPress={() => toggleStep(idx)}
                activeOpacity={0.85}
              >
                <View style={[styles.stepNumber, checkedSteps[idx] && styles.stepNumberDone]}>
                  {checkedSteps[idx]
                    ? <CheckCircle2 size={16} color="#FFFFFF" />
                    : <Text style={styles.stepNumberText}>{idx + 1}</Text>
                  }
                </View>
                <Text style={[styles.stepText, checkedSteps[idx] && styles.stepTextDone]}>
                  {step}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {recipe.tags.map((tag) => (
              <View key={tag} style={styles.tagPill}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>

          {/* Shop Ingredients CTA */}
          <TouchableOpacity
            style={styles.shopCTA}
            onPress={() => router.push('/(tabs)/products')}
            activeOpacity={0.9}
          >
            <ShoppingBag size={20} color="#FFFFFF" />
            <View style={{ flex: 1 }}>
              <Text style={styles.shopCTATitle}>Shop the Ingredients</Text>
              <Text style={styles.shopCTASub}>Get 100% pure NaturesMud superfoods</Text>
            </View>
            <ChevronRight size={18} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Other Recipes */}
          <View style={styles.otherSection}>
            <Text style={styles.otherTitle}>More Recipes</Text>
            {recipes.filter((r) => r.id !== recipe.id).slice(0, 2).map((r) => (
              <TouchableOpacity
                key={r.id}
                style={styles.otherCard}
                onPress={() => router.push({ pathname: '/recipes/[slug]', params: { slug: r.slug } })}
                activeOpacity={0.88}
              >
                <Image source={{ uri: r.image }} style={styles.otherImg} resizeMode="cover" />
                <View style={styles.otherBody}>
                  <Text style={styles.otherCategory}>{r.category}</Text>
                  <Text style={styles.otherRecipeTitle} numberOfLines={2}>{r.title}</Text>
                  <View style={styles.otherMeta}>
                    <Clock size={11} color="#78716C" />
                    <Text style={styles.otherMetaText}>{r.prepTime + r.cookTime} min</Text>
                  </View>
                </View>
                <ChevronRight size={18} color="#78716C" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F2' },
  scrollContent: { paddingBottom: 40 },

  heroContainer: { height: 300, position: 'relative', overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  heroTopRow: {
    position: 'absolute', top: 16, left: 16, right: 16,
    flexDirection: 'row', justifyContent: 'space-between', zIndex: 5,
  },
  circleBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  diffBadge: {
    position: 'absolute', bottom: 16, right: 16,
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, zIndex: 5,
  },
  diffText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },

  body: { padding: 20, gap: 20 },
  categoryLabel: { fontSize: 10, fontWeight: '700', color: '#1A3826', textTransform: 'uppercase', letterSpacing: 1 },
  recipeTitle: { fontSize: 26, fontWeight: '900', color: '#1A3826', letterSpacing: -0.4, lineHeight: 34 },
  recipeExcerpt: { fontSize: 14, color: '#57534E', lineHeight: 21, fontStyle: 'italic' },

  statsCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16,
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    borderWidth: 1, borderColor: '#EAE3D6',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  statItem: { alignItems: 'center', gap: 4 },
  statValue: { fontSize: 16, fontWeight: '900', color: '#1A3826' },
  statLabel: { fontSize: 10, color: '#78716C', fontWeight: '600' },
  statDivider: { width: 1, height: 40, backgroundColor: '#EAE3D6' },

  section: { gap: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#1A3826' },
  sectionProgress: {
    fontSize: 12, fontWeight: '700', color: '#15803D',
    backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12,
  },
  sectionHint: { fontSize: 11, color: '#78716C', marginTop: -4 },

  ingredientRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFFFF', padding: 12, borderRadius: 14,
    borderWidth: 1, borderColor: '#EAE3D6',
  },
  ingredientRowChecked: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
  ingredientText: { flex: 1, fontSize: 14, color: '#292524', fontWeight: '500' },
  ingredientTextChecked: { color: '#15803D', textDecorationLine: 'line-through' },

  stepCard: {
    flexDirection: 'row', gap: 14, alignItems: 'flex-start',
    backgroundColor: '#FFFFFF', padding: 14, borderRadius: 16,
    borderWidth: 1, borderColor: '#EAE3D6',
  },
  stepCardDone: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
  stepNumber: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#1A3826', justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  stepNumberDone: { backgroundColor: '#15803D' },
  stepNumberText: { fontSize: 14, fontWeight: '900', color: '#FFFFFF' },
  stepText: { flex: 1, fontSize: 14, color: '#292524', lineHeight: 22, fontWeight: '400', paddingTop: 4 },
  stepTextDone: { color: '#15803D', textDecorationLine: 'line-through' },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagPill: {
    backgroundColor: '#F0EDE7', paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1, borderColor: '#E2D9CB',
  },
  tagText: { fontSize: 11, fontWeight: '600', color: '#78716C' },

  shopCTA: {
    backgroundColor: '#1A3826', borderRadius: 20, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  shopCTATitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  shopCTASub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },

  otherSection: { gap: 12 },
  otherTitle: { fontSize: 20, fontWeight: '900', color: '#1A3826' },
  otherCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: '#EAE3D6', padding: 4,
  },
  otherImg: { width: 80, height: 72, borderRadius: 12 },
  otherBody: { flex: 1, gap: 4 },
  otherCategory: { fontSize: 9, fontWeight: '700', color: '#1A3826', textTransform: 'uppercase' },
  otherRecipeTitle: { fontSize: 13, fontWeight: '700', color: '#1C1917', lineHeight: 18 },
  otherMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  otherMetaText: { fontSize: 11, color: '#78716C' },
});
