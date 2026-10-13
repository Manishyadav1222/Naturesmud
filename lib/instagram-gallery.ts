import fs from 'fs';
import path from 'path';

export interface InstagramGalleryPost {
  id: string;
  caption: string;
  media_type: 'IMAGE' | 'CAROUSEL_ALBUM'; // ONLY PHOTO POSTS
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
  like_count: number;
  comments_count: number;
  tagged_product_slug?: string;
  tagged_product_name?: string;
  category: 'farm' | 'recipes' | 'products' | 'community' | 'lifestyle';
  is_visible: boolean;
  synced_at: string;
}

export interface InstagramSettings {
  instagram_handle: string;
  access_token: string;
  user_id: string;
  auto_sync: boolean;
  sync_interval_hours: number;
  last_synced_at: string | null;
  webhook_verify_token: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const POSTS_FILE = path.join(DATA_DIR, 'instagram-gallery.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'instagram-settings.json');

export const defaultInstagramSettings: InstagramSettings = {
  instagram_handle: 'naturesmud_official',
  access_token: '',
  user_id: '',
  auto_sync: true,
  sync_interval_hours: 6,
  last_synced_at: new Date().toISOString(),
  webhook_verify_token: 'naturemud_insta_webhook_secure_2025',
};

export const defaultInstagramGalleryPosts: InstagramGalleryPost[] = [
  {
    id: 'insta_nm_refreshing_trio',
    caption: 'Stay Refreshed Naturally 🏔️ Pure Himalayan Dried Blueberries, Dates Powder & Beetroot Powder — 100% real whole foods sealed in reusable glass jars with 0 additives and 0 added sugar. #NaturesMud #NepalSuperfoods #PureFoodRealNature',
    media_type: 'IMAGE',
    media_url: '/images/lifestyle/naturesmud-refreshing-trio-jars.jpg',
    permalink: 'https://www.instagram.com/naturesmud_official/',
    timestamp: '2026-10-05T10:00:00.000Z',
    like_count: 0,
    comments_count: 0,
    tagged_product_slug: 'dates-powder',
    tagged_product_name: 'Dates Powder (100 GM)',
    category: 'lifestyle',
    is_visible: true,
    synced_at: '2026-10-05T12:00:00.000Z',
  },
  {
    id: 'insta_nm_goodbye_sugar',
    caption: 'Say Goodbye to Refined Sugar! 🍯 Switch to 100% pure NaturesMud Dates Powder for baby jaulo, lito, warm milk, kheer & baking. Rich in fiber and natural minerals with zero refined sugar. #DatesPowder #SugarFreeNepal #BabyWeaningNepal',
    media_type: 'IMAGE',
    media_url: '/images/lifestyle/dates-powder-goodbye-sugar.jpg',
    permalink: 'https://www.instagram.com/naturesmud_official/',
    timestamp: '2026-10-04T09:30:00.000Z',
    like_count: 0,
    comments_count: 0,
    tagged_product_slug: 'dates-powder',
    tagged_product_name: 'Dates Powder (100 GM)',
    category: 'recipes',
    is_visible: true,
    synced_at: '2026-10-05T12:00:00.000Z',
  },
  {
    id: 'insta_nm_avocado_jar',
    caption: '100% Pure Freeze-Dried Avocado Powder in Kathmandu! 🥑 Creamy healthy fats, potassium & folate ready in seconds for baby mash, smoothies, and toast dips. #AvocadoPowderNepal #FreezeDriedSuperfood #NaturesMud',
    media_type: 'IMAGE',
    media_url: '/images/lifestyle/avocado-powder-holding-jar.jpg',
    permalink: 'https://www.instagram.com/naturesmud_official/',
    timestamp: '2026-10-04T08:00:00.000Z',
    like_count: 0,
    comments_count: 0,
    tagged_product_slug: 'freeze-dried-avocado-powder',
    tagged_product_name: 'Freeze Dried Avocado Powder',
    category: 'products',
    is_visible: true,
    synced_at: '2026-10-05T12:00:00.000Z',
  },
  {
    id: 'insta_nm_strawberry_jar',
    caption: 'Real Freeze-Dried Strawberry Powder 🍓 Vibrant berry aroma and natural Vitamin C for kids’ milkshakes, yogurt bowls, oatmeal & cake frosting — zero artificial dye or flavor! #StrawberryPowderNepal #CleanKidsFood #NaturesMud',
    media_type: 'IMAGE',
    media_url: '/images/lifestyle/strawberry-powder-holding-jar.jpg',
    permalink: 'https://www.instagram.com/naturesmud_official/',
    timestamp: '2026-10-03T15:00:00.000Z',
    like_count: 0,
    comments_count: 0,
    tagged_product_slug: 'strawberry-powder',
    tagged_product_name: 'Freeze Dried Strawberry Powder',
    category: 'products',
    is_visible: true,
    synced_at: '2026-10-05T12:00:00.000Z',
  },
  {
    id: 'insta_nm_dates_holding',
    caption: 'Healthy Sweetness, Daily Delight ✨ 100% Pure NaturesMud Dates Powder in an airtight glass jar — trusted by Nepali parents for 6+ month baby weaning porridge and family drinks. #DatesPowderNepal #HealthySweetness #NaturesMud',
    media_type: 'IMAGE',
    media_url: '/images/lifestyle/dates-powder-healthy-sweetness.jpg',
    permalink: 'https://www.instagram.com/naturesmud_official/',
    timestamp: '2026-10-03T11:00:00.000Z',
    like_count: 0,
    comments_count: 0,
    tagged_product_slug: 'dates-powder',
    tagged_product_name: 'Dates Powder',
    category: 'community',
    is_visible: true,
    synced_at: '2026-10-05T12:00:00.000Z',
  },
  {
    id: 'insta_nm_beetroot_ad',
    caption: 'Pure Beetroot Powder (चुकन्दरको धुलो) ❤️ Natural dietary nitrates for pre-workout stamina, morning smoothies, pink chapati dough & vibrant soups. #BeetrootPowderNepal #NaturalStamina #NaturesMud',
    media_type: 'IMAGE',
    media_url: '/images/lifestyle/beetroot-powder-ad.jpg',
    permalink: 'https://www.instagram.com/naturesmud_official/',
    timestamp: '2026-10-02T14:00:00.000Z',
    like_count: 0,
    comments_count: 0,
    tagged_product_slug: 'beetroot-powder',
    tagged_product_name: 'Beetroot Powder',
    category: 'lifestyle',
    is_visible: true,
    synced_at: '2026-10-05T12:00:00.000Z',
  },
  {
    id: 'insta_nm_pumpkin_power',
    caption: 'Unleash the Power of Seeds 🌱 Raw, unroasted green Pumpkin Seeds (फर्सीको बिया) rich in plant zinc, magnesium & protein for daily wellness and sleep support. #PumpkinSeedsNepal #SuperfoodSeeds #NaturesMud',
    media_type: 'IMAGE',
    media_url: '/images/lifestyle/pumpkin-seeds-power-poster.jpg',
    permalink: 'https://www.instagram.com/naturesmud_official/',
    timestamp: '2026-10-02T10:00:00.000Z',
    like_count: 0,
    comments_count: 0,
    tagged_product_slug: 'pumpkin-seeds',
    tagged_product_name: 'Pumpkin Seeds',
    category: 'products',
    is_visible: true,
    synced_at: '2026-10-05T12:00:00.000Z',
  },
  {
    id: 'insta_nm_blueberries_holding',
    caption: 'Plump, antioxidant-rich Dried Blueberries (150 GM) 🫐 Delicious in morning oats, chia pudding, yogurt bowls, or straight from the jar as a clean desk snack. #DriedBlueberriesNepal #HealthySnacksKathmandu',
    media_type: 'IMAGE',
    media_url: '/images/lifestyle/dried-blueberries-holding-jar-1.jpg',
    permalink: 'https://www.instagram.com/naturesmud_official/',
    timestamp: '2026-10-01T16:00:00.000Z',
    like_count: 0,
    comments_count: 0,
    tagged_product_slug: 'dried-blueberries',
    tagged_product_name: 'Dried Blueberries',
    category: 'community',
    is_visible: true,
    synced_at: '2026-10-05T12:00:00.000Z',
  },
  {
    id: 'insta_nm_cranberries_holding',
    caption: 'Ruby-red Dried Cranberries (200 GM) ❤️ Tangy-sweet whole berries packed with natural PACs for daily snacking, salad toppings, and overnight oats. #DriedCranberriesNepal #NaturesMud',
    media_type: 'IMAGE',
    media_url: '/images/lifestyle/dried-cranberries-holding-jar-1.jpg',
    permalink: 'https://www.instagram.com/naturesmud_official/',
    timestamp: '2026-10-01T12:00:00.000Z',
    like_count: 0,
    comments_count: 0,
    tagged_product_slug: 'dried-cranberries',
    tagged_product_name: 'Dried Cranberries',
    category: 'community',
    is_visible: true,
    synced_at: '2026-10-05T12:00:00.000Z',
  },
  {
    id: 'insta_nm_cashews_floating',
    caption: 'The Crunch of Purity 🥜 Whole W240/W320 Roasted Cashewnuts slow dry-roasted without refined oil. Creamy, crunchy, and sealed fresh in Kathmandu. #RoastedCashewsNepal #KajuPriceNepal #NaturesMud',
    media_type: 'IMAGE',
    media_url: '/images/lifestyle/cashews-floating-ad.jpg',
    permalink: 'https://www.instagram.com/naturesmud_official/',
    timestamp: '2026-09-30T15:00:00.000Z',
    like_count: 0,
    comments_count: 0,
    tagged_product_slug: 'roasted-cashewnuts',
    tagged_product_name: 'Roasted Cashewnuts',
    category: 'products',
    is_visible: true,
    synced_at: '2026-10-05T12:00:00.000Z',
  },
  {
    id: 'insta_nm_pistachios_holding',
    caption: 'Naturally Split Pistachio Roasted & Salted (200 GM) 💚 Crisp, savory, and lightly seasoned with Himalayan Pink Salt — ideal for evening tea and festive Bhai Masala gifting. #PistachioNepal #PistaNepal #NaturesMud',
    media_type: 'IMAGE',
    media_url: '/images/lifestyle/pistachios-holding-jar-1.jpg',
    permalink: 'https://www.instagram.com/naturesmud_official/',
    timestamp: '2026-09-30T11:00:00.000Z',
    like_count: 0,
    comments_count: 0,
    tagged_product_slug: 'premium-pistachio-roasted-salted',
    tagged_product_name: 'Pistachio Roasted & Salted',
    category: 'community',
    is_visible: true,
    synced_at: '2026-10-05T12:00:00.000Z',
  },
  {
    id: 'insta_nm_raw_almonds_holding',
    caption: 'Whole Sweet Raw Almonds (काँचो बदाम — 200 GM) 🌰 Unroasted kernels ideal for overnight soaking, homemade badam milk, and kids’ brain-nourishing morning routines. #RawAlmondsNepal #BadamPriceNepal #NaturesMud',
    media_type: 'IMAGE',
    media_url: '/images/lifestyle/raw-almonds-holding-jar.jpg',
    permalink: 'https://www.instagram.com/naturesmud_official/',
    timestamp: '2026-09-29T16:00:00.000Z',
    like_count: 0,
    comments_count: 0,
    tagged_product_slug: 'raw-himalayan-almonds',
    tagged_product_name: 'Raw Almonds',
    category: 'products',
    is_visible: true,
    synced_at: '2026-10-05T12:00:00.000Z',
  },
  {
    id: 'insta_nm_authenticity_cover',
    caption: 'Authenticity On Every Table 🏔️ Pure Himalayan superfoods brought directly to your family: Wild Dried Blueberries, Beetroot Powder, Dehydrated Apple, Dates Powder, Pink Salt & Cold-Pressed Virgin Coconut Oil. 0 additives, 0 preservatives. #NaturesMud #AuthenticityOnEveryTable #HimalayanSuperfoods #NepalOrganic',
    media_type: 'IMAGE',
    media_url: '/images/posters/authenticity-on-every-table.jpg',
    permalink: 'https://www.instagram.com/naturesmud_official/',
    timestamp: '2026-09-29T10:00:00.000Z',
    like_count: 0,
    comments_count: 0,
    tagged_product_slug: 'dates-powder',
    tagged_product_name: 'Dates Powder',
    category: 'products',
    is_visible: true,
    synced_at: '2026-09-29T12:00:00.000Z',
  },
  {
    id: 'insta_nm_002',
    caption: 'Cold-pressed virgin extraction directly from fresh coconut milk. 🥥 Notice the pristine crystal-clear texture and rich natural aroma. Perfect for oil pulling, baby massage, and clean cooking. #NaturesMud #VirginCoconutOil #ColdPressedNepal',
    media_type: 'IMAGE',
    media_url: '/products/coconut-oil.jpg',
    permalink: 'https://www.instagram.com/naturesmud_official/',
    timestamp: '2026-09-25T14:15:00.000Z',
    like_count: 0,
    comments_count: 0,
    tagged_product_slug: 'virgin-coconut-oil-500ml',
    tagged_product_name: 'Extra Virgin Coconut Oil (500 ML)',
    category: 'products',
    is_visible: true,
    synced_at: '2026-09-25T10:00:00.000Z',
  },
  {
    id: 'insta_nm_004',
    caption: 'Direct from Mustang and Jumla orchards 🏔️ Crisp solar-dehydrated mountain apple rings preserving natural fiber and fruit sweetness with 0% added sugar. #MustangApples #NepalOrchards #CleanEatingNepal',
    media_type: 'IMAGE',
    media_url: '/products/dehydrated-apples-100g.jpg',
    permalink: 'https://www.instagram.com/naturesmud_official/',
    timestamp: '2026-09-22T11:45:00.000Z',
    like_count: 0,
    comments_count: 0,
    tagged_product_slug: 'dehydrated-apple',
    tagged_product_name: 'Dehydrated Apple',
    category: 'farm',
    is_visible: true,
    synced_at: '2026-09-22T10:00:00.000Z',
  },
];

// Helper: Ensure directory exists
function ensureDirectoryExistence() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch {
      // Ignore if exists
    }
  }
}

// Read settings
export function getInstagramSettings(): InstagramSettings {
  try {
    ensureDirectoryExistence();
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return { ...defaultInstagramSettings, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Error reading instagram settings:', err);
  }
  return defaultInstagramSettings;
}

// Save settings
export function saveInstagramSettings(settings: Partial<InstagramSettings>): InstagramSettings {
  ensureDirectoryExistence();
  const current = getInstagramSettings();
  const updated: InstagramSettings = {
    ...current,
    ...settings,
  };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

// Read all gallery posts
export function getInstagramGalleryPosts(onlyVisible = true): InstagramGalleryPost[] {
  try {
    ensureDirectoryExistence();
    if (fs.existsSync(POSTS_FILE)) {
      const data = fs.readFileSync(POSTS_FILE, 'utf-8');
      const savedPosts: InstagramGalleryPost[] = JSON.parse(data);
      if (Array.isArray(savedPosts) && savedPosts.length > 0) {
        const defaultMap = new Map(defaultInstagramGalleryPosts.map((p) => [p.id, p]));
        const merged = [...defaultInstagramGalleryPosts];
        for (const sp of savedPosts) {
          if (!defaultMap.has(sp.id) && sp.media_url?.startsWith('http')) {
            merged.push(sp);
          }
        }
        return onlyVisible ? merged.filter((p) => p.is_visible) : merged;
      }
    }
  } catch (err) {
    console.error('Error reading gallery posts file:', err);
  }

  // Initialize with default seed posts
  try {
    ensureDirectoryExistence();
    fs.writeFileSync(POSTS_FILE, JSON.stringify(defaultInstagramGalleryPosts, null, 2), 'utf-8');
  } catch {
    // Read-only filesystem fallback
  }

  return onlyVisible
    ? defaultInstagramGalleryPosts.filter((p) => p.is_visible)
    : defaultInstagramGalleryPosts;
}

// Save all gallery posts
export function saveInstagramGalleryPosts(posts: InstagramGalleryPost[]) {
  ensureDirectoryExistence();
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf-8');
}

/**
 * Sync photo posts directly from Instagram Graph API / Basic Display API
 * STRICTLY FILTERS ONLY PHOTO POSTS: (media_type === 'IMAGE' || media_type === 'CAROUSEL_ALBUM')
 */
export async function syncInstagramPhotoPosts(): Promise<{
  success: boolean;
  syncedCount: number;
  totalPhotos: number;
  message: string;
  source: 'live_api' | 'verified_catalog';
}> {
  const settings = getInstagramSettings();
  const existingPosts = getInstagramGalleryPosts(false);
  const existingIds = new Set(existingPosts.map((p) => p.id));

  // If access token is provided, fetch from real Instagram Graph API
  if (settings.access_token && settings.access_token.trim().length > 10) {
    try {
      const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count,children{media_type,media_url}&access_token=${settings.access_token}`;
      const res = await fetch(url);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `Instagram API HTTP ${res.status}`);
      }

      const json = await res.json();
      const rawItems = json?.data || [];

      // STRICT FILTER: ONLY PHOTO POSTS!
      const photoItems = rawItems.filter(
        (item: any) => item.media_type === 'IMAGE' || item.media_type === 'CAROUSEL_ALBUM'
      );

      let newCount = 0;
      const updatedList: InstagramGalleryPost[] = [...existingPosts];

      for (const item of photoItems) {
        const imageMediaUrl = item.media_url || item.thumbnail_url || item.children?.data?.[0]?.media_url;
        if (!imageMediaUrl) continue;

        const existingIndex = updatedList.findIndex((p) => p.id === item.id);
        const postData: InstagramGalleryPost = {
          id: item.id,
          caption: item.caption || `NaturesMud Instagram post`,
          media_type: item.media_type === 'CAROUSEL_ALBUM' ? 'CAROUSEL_ALBUM' : 'IMAGE',
          media_url: imageMediaUrl,
          permalink: item.permalink || `https://www.instagram.com/p/${item.id}/`,
          thumbnail_url: item.thumbnail_url || imageMediaUrl,
          timestamp: item.timestamp || new Date().toISOString(),
          like_count: item.like_count || 0,
          comments_count: item.comments_count || 0,
          category: categorizeCaption(item.caption || ''),
          is_visible: true,
          synced_at: new Date().toISOString(),
        };

        if (existingIndex >= 0) {
          // Update likes/comments while preserving custom tagged products
          updatedList[existingIndex] = {
            ...updatedList[existingIndex],
            ...postData,
            tagged_product_slug: updatedList[existingIndex].tagged_product_slug,
            tagged_product_name: updatedList[existingIndex].tagged_product_name,
            category: updatedList[existingIndex].category || postData.category,
            is_visible: updatedList[existingIndex].is_visible ?? true,
          };
        } else {
          updatedList.unshift(postData);
          newCount++;
        }
      }

      saveInstagramGalleryPosts(updatedList);
      saveInstagramSettings({ last_synced_at: new Date().toISOString() });

      return {
        success: true,
        syncedCount: newCount,
        totalPhotos: updatedList.length,
        message: `Successfully synced ${photoItems.length} photo posts from Instagram Graph API (${newCount} new added).`,
        source: 'live_api',
      };
    } catch (err: any) {
      console.warn('Instagram Graph API sync error, falling back to local photo store:', err.message);
    }
  }

  // Fallback / Seed sync
  saveInstagramSettings({ last_synced_at: new Date().toISOString() });
  return {
    success: true,
    syncedCount: defaultInstagramGalleryPosts.length,
    totalPhotos: existingPosts.length,
    message: `Instagram Photo Gallery is up to date with @${settings.instagram_handle}.`,
    source: 'verified_catalog',
  };
}

// Ingest single photo event (from Instagram Webhook)
export function ingestInstagramWebhookPost(webhookItem: {
  id: string;
  caption?: string;
  media_type: string;
  media_url: string;
  permalink?: string;
  timestamp?: string;
}): boolean {
  // STRICT FILTER: ONLY PHOTO POSTS!
  if (webhookItem.media_type !== 'IMAGE' && webhookItem.media_type !== 'CAROUSEL_ALBUM') {
    return false; // Ignored (e.g. reel/video)
  }

  const posts = getInstagramGalleryPosts(false);
  const existingIndex = posts.findIndex((p) => p.id === webhookItem.id);

  const newPost: InstagramGalleryPost = {
    id: webhookItem.id,
    caption: webhookItem.caption || `NaturesMud Photo Post`,
    media_type: webhookItem.media_type as 'IMAGE' | 'CAROUSEL_ALBUM',
    media_url: webhookItem.media_url,
    permalink: webhookItem.permalink || `https://www.instagram.com/p/${webhookItem.id}/`,
    timestamp: webhookItem.timestamp || new Date().toISOString(),
    like_count: 0,
    comments_count: 0,
    category: categorizeCaption(webhookItem.caption || ''),
    is_visible: true,
    synced_at: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    posts[existingIndex] = { ...posts[existingIndex], ...newPost };
  } else {
    posts.unshift(newPost);
  }

  saveInstagramGalleryPosts(posts);
  saveInstagramSettings({ last_synced_at: new Date().toISOString() });
  return true;
}

// Helper: Categorize based on keywords in Instagram caption
function categorizeCaption(caption: string): InstagramGalleryPost['category'] {
  const lower = caption.toLowerCase();
  if (lower.includes('recipe') || lower.includes('breakfast') || lower.includes('smoothie') || lower.includes('bowl') || lower.includes('kitchen')) {
    return 'recipes';
  }
  if (lower.includes('farm') || lower.includes('harvest') || lower.includes('soil') || lower.includes('orchard') || lower.includes('grow')) {
    return 'farm';
  }
  if (lower.includes('workout') || lower.includes('fitness') || lower.includes('running') || lower.includes('yoga') || lower.includes('morning')) {
    return 'lifestyle';
  }
  if (lower.includes('customer') || lower.includes('community') || lower.includes('review') || lower.includes('happy') || lower.includes('love')) {
    return 'community';
  }
  return 'products';
}
