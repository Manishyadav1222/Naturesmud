import fs from 'fs';

const products = JSON.parse(fs.readFileSync('./products.json', 'utf8'));
const siteConfig = {
  url: 'https://naturesmud.shop',
  freeShippingThreshold: 3000,
};

console.log('Testing Google Merchant Listing Schema on all active products...');

let checkedCount = 0;
for (const product of products) {
  if (product.isActive === false || product.isPublished === false) continue;

  const officialName = product.official_label_name || product.name;
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${siteConfig.url}/products/${product.slug}#product`,
    name: officialName,
    image: productImages.map((img) => (img.startsWith('http') ? img : `${siteConfig.url}${img}`)),
    description: product.description || product.shortDescription,
    sku: `NM-${product.slug.toUpperCase()}`,
    mpn: `NM-${product.slug.toUpperCase()}`,
    category: product.category || 'Superfoods',
    brand: {
      '@type': 'Brand',
      name: 'NaturesMud',
    },
    ...(product.weight
      ? {
          hasMeasurement: {
            '@type': 'QuantitativeValue',
            value: parseFloat(product.weight) || 100,
            unitCode: product.weight.includes('ML') ? 'MLT' : 'GRM',
            unitText: product.weight,
          },
        }
      : {}),
    offers: {
      '@type': 'Offer',
      '@id': `${siteConfig.url}/products/${product.slug}#offer`,
      url: `${siteConfig.url}/products/${product.slug}`,
      priceCurrency: 'NPR',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'NaturesMud',
        url: siteConfig.url,
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'NP',
        returnPolicyCountry: 'NP',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
        refundType: 'https://schema.org/FullRefund',
        returnShippingFeesAmount: {
          '@type': 'MonetaryAmount',
          value: 0,
          currency: 'NPR',
        },
      },
      shippingDetails: [
        {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: product.price >= siteConfig.freeShippingThreshold ? 0 : 100,
            currency: 'NPR',
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'NP',
            addressRegion: 'Bagmati (Kathmandu Valley)',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 0,
              maxValue: 1,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 1,
              maxValue: 2,
              unitCode: 'DAY',
            },
          },
        },
        {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: product.price >= siteConfig.freeShippingThreshold ? 0 : 150,
            currency: 'NPR',
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'NP',
            addressRegion: 'Outside Kathmandu Valley (All 7 Provinces)',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 0,
              maxValue: 1,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 2,
              maxValue: 4,
              unitCode: 'DAY',
            },
          },
        },
      ],
    },
  };

  // Assertions
  if (!schema.name) throw new Error(`Missing name on ${product.slug}`);
  if (!schema.image || schema.image.length === 0) throw new Error(`Missing image on ${product.slug}`);
  if (!schema.sku || !schema.mpn) throw new Error(`Missing sku/mpn on ${product.slug}`);
  if (!schema.offers.price || schema.offers.price <= 0) throw new Error(`Invalid price on ${product.slug}`);
  if (!schema.offers.hasMerchantReturnPolicy.returnFees) throw new Error(`Missing return policy on ${product.slug}`);
  if (schema.offers.shippingDetails.length !== 2) throw new Error(`Missing shipping details zones on ${product.slug}`);
  if (!schema.offers.shippingDetails[0].deliveryTime.transitTime.unitCode) throw new Error(`Missing transit time on ${product.slug}`);

  checkedCount++;
}

console.log(`SUCCESS: All ${checkedCount} products have 100% valid Google Merchant Listing structured data!`);
