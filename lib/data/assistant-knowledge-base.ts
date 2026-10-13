export interface AssistantQA {
  id: string;
  category: 'product' | 'shipping' | 'baby' | 'payment' | 'storage' | 'wholesale' | 'brand';
  keywords: string[];
  nepaliKeywords: string[];
  romanNepaliKeywords: string[];
  questionEn: string;
  questionNp: string;
  answerEn: string;
  answerNp: string;
  productSlug?: string;
  suggestedAction?: {
    type: 'cart' | 'link' | 'whatsapp';
    label: string;
    url?: string;
    productSlug?: string;
  };
}

export const ASSISTANT_KNOWLEDGE_BASE: AssistantQA[] = [
  // 1. BRAND IDENTITY & DISAMBIGUATION
  {
    id: 'brand-identity',
    category: 'brand',
    keywords: ['what is naturesmud', 'who are you', 'clay', 'mud mask', 'face pack', 'skincare'],
    nepaliKeywords: ['नेचर्स मड के हो', 'माटो', 'फेस प्याक'],
    romanNepaliKeywords: ['naturesmud k ho', 'skincare ho ki khana', 'mato ho'],
    questionEn: 'What is NaturesMud Nepal? Is it a skincare or clay product?',
    questionNp: 'नेचर्स मड के हो? के यो सौन्दर्य सामग्री वा माटो हो?',
    answerEn:
      'NaturesMud Nepal is a 100% pure food, superfood, and nutrition brand — NOT a skincare, clay mask, or cosmetic line. We produce 32 single-ingredient whole-food powders (Avocado, Banana, Dates, Moringa), dehydrated fruits, mountain nuts, seeds, cold-pressed oils, and Himalayan salts with 0% added sugar and 0% preservatives.',
    answerNp:
      'नेचर्स मड नेपाल १००% शुद्ध प्राकृतिक सम्पूर्ण आहार (Food & Nutrition) ब्रान्ड हो — यो कुनै कस्मेटिक वा फेस प्याक माटो होइन। हामी ३२ प्रकारका सुपरफुड पाउडर, डिहाइड्रेटेड फलफूल, ड्राइ फ्रुट्स, सिड्स, तेल र हिमाली नुन ०% थप चिनी र ०% प्रिजर्भेटिभ बिना उत्पादन गर्दछौँ।',
    suggestedAction: {
      type: 'link',
      label: 'Explore Our Story & Quality',
      url: '/about',
    },
  },

  // 2. SHIPPING & DELIVERY CHARGES
  {
    id: 'shipping-charges',
    category: 'shipping',
    keywords: ['delivery charge', 'shipping cost', 'free delivery', 'kathmandu delivery', 'how much for delivery'],
    nepaliKeywords: ['डेलिभरी शुल्क', 'काठमाडौँ डेलिभरी', 'फ्री डेलिभरी'],
    romanNepaliKeywords: ['delivery charge kati ho', 'shipping fee', 'free delivery kahile'],
    questionEn: 'What are the delivery charges and timelines across Nepal?',
    questionNp: 'नेपालभर डेलिभरी शुल्क र समय कति लाग्छ?',
    answerEn:
      'Delivery rates across Nepal: Inside Kathmandu Valley is Rs. 100 (delivered within 24–48 hours). Major cities outside the valley (Pokhara, Chitwan, Butwal, Biratnagar) is Rs. 150 (2–4 days). Remote districts are Rs. 200 (3–7 days). FREE delivery on all orders above Rs. 3,000 across all 77 districts of Nepal!',
    answerNp:
      'डेलिभरी शुल्क: काठमाडौँ उपत्यकाभित्र रु १०० (२४–४८ घण्टामा डेलिभरी)। उपत्यका बाहिरका प्रमुख सहरहरू (पोखरा, चितवन, बुटवल, विराटनगर) मा रु १५० (२–४ दिन)। दुर्गम जिल्लामा रु २०० (३–७ दिन)। रु ३,००० भन्दा माथिको अर्डरमा नेपालभर ७७ वटै जिल्लामा डेलिभरी निःशुल्क (FREE) छ!',
    suggestedAction: {
      type: 'link',
      label: 'View Shipping Policy',
      url: '/shipping-policy',
    },
  },

  // 3. CASH ON DELIVERY (COD) & PAYMENTS
  {
    id: 'payment-methods',
    category: 'payment',
    keywords: ['cod', 'cash on delivery', 'esewa', 'khalti', 'fonepay', 'payment', 'how to pay'],
    nepaliKeywords: ['नगद भुक्तानी', 'ईसेवा', 'खल्ती', 'फोनपे'],
    romanNepaliKeywords: ['cod chha ki chhaina', 'esewa bata milchha', 'cash on delivery hunchha'],
    questionEn: 'Do you offer Cash on Delivery (COD) and digital payments?',
    questionNp: 'के क्यास अन डेलिभरी (COD) र डिजिटल भुक्तानी उपलब्ध छ?',
    answerEn:
      'Yes! We provide Cash on Delivery (COD) across all 77 districts of Nepal. You can also pay seamlessly online via FonePay QR, eSewa, Khalti, direct bank transfer, or international payment links via WhatsApp concierge.',
    answerNp:
      'हजुर, नेपालका ७७ वटै जिल्लामा क्यास अन डेलिभरी (COD) उपलब्ध छ। साथै FonePay QR, eSewa, Khalti वा बैंक ट्रान्सफर मार्फत पनि सजिलै भुक्तानी गर्न सक्नुहुन्छ।',
    suggestedAction: {
      type: 'whatsapp',
      label: 'Order on WhatsApp (+977-9713888002)',
      url: 'https://wa.me/9779713888002?text=Hello%20NaturesMud!%20I%20would%20like%20to%20order%20with%20COD.',
    },
  },

  // 4. PEDIATRIC ADVISORY & BABY WEANING
  {
    id: 'baby-weaning-rule',
    category: 'baby',
    keywords: ['baby food', 'lito', 'weaning', 'infant', '6 month baby', 'pediatrician', 'child food'],
    nepaliKeywords: ['बच्चाको लिटो', 'शिशु आहार', '६ महिना', 'बालरोग विशेषज्ञ'],
    romanNepaliKeywords: ['bacha ko lito', 'baby lai dina milchha', '6 month bacha khana'],
    questionEn: 'Are NaturesMud powders safe for baby weaning and infant porridge?',
    questionNp: 'के नेचर्स मडका पाउडरहरू शिशुको लिटोको लागि उपयुक्त छन्?',
    answerEn:
      'Mandatory Pediatric Advice: Our single-ingredient Sweet Potato, Banana, Carrot, and Dates powders are suitable for complementary feeding from 6 months, as advised by your pediatrician. Never introduce honey under 12 months. Always introduce one new food at a time (3-day wait rule) to check for food allergies. Breast milk or infant formula remains the primary nutrition during early months.',
    answerNp:
      'बालरोग विशेषज्ञको अनिवार्य सल्लाह: हाम्रा सखरखण्ड, केरा, गाजर र खजुर पाउडर ६ महिना पुगेका शिशुहरूका लागि बालरोग विशेषज्ञको सल्लाह अनुसार लिटो वा जाउलोमा मिसाउन उपयुक्त हुन्छन्। १ वर्ष मुनिका शिशुलाई कहिल्यै मह नदिनुहोस्। एलर्जी जाँच्न ३ दिनमा एउटा मात्र नयाँ खाना सुरु गर्नुहोस्। पहिलो ६ महिना आमाको दूध नै मुख्य आहार हो।',
    suggestedAction: {
      type: 'link',
      label: 'Explore Baby Weaning Hub',
      url: '/baby-weaning',
    },
  },

  // 5. BANANA POWDER
  {
    id: 'banana-powder-info',
    category: 'product',
    keywords: ['banana powder', 'raw banana', 'kera powder', 'kera ko dhulo', 'banana price'],
    nepaliKeywords: ['केरा पाउडर', 'केराको धुलो', 'काँचो केरा'],
    romanNepaliKeywords: ['kera powder price', 'banana powder use kasari garne', 'kera ko powder'],
    questionEn: 'What is the price and ingredients of Banana Powder?',
    questionNp: 'केरा पाउडर (Banana Powder) को मूल्य र सामग्री के हो?',
    answerEn:
      'NaturesMud Raw Banana Powder is priced at Rs. 590 for a 100 GM airtight glass jar. Ingredients: 100% whole bananas, gently dehydrated and cold-milled with 0% added sugar, 0% maltodextrin, and 0% preservatives. Rich in potassium and gentle resistant starch for baby lito and smoothies.',
    answerNp:
      'नेचर्स मड केरा पाउडरको मूल्य १०० ग्राम एयरटाइट काँचको जारको रु ५९० हो। सामग्री: १००% शुद्ध केरा। यसमा ०% चिनी र ०% प्रिजर्भेटिभ छ। बच्चाको लिटो र स्मूदीको लागि उत्तम प्राकृतिक विकल्प।',
    productSlug: 'banana-powder',
    suggestedAction: {
      type: 'cart',
      label: 'Add Banana Powder to Cart (Rs. 590)',
      productSlug: 'banana-powder',
    },
  },

  // 6. DATES POWDER
  {
    id: 'dates-powder-info',
    category: 'product',
    keywords: ['dates powder', 'khajur powder', 'natural sweetener', 'sugar substitute', 'dates price'],
    nepaliKeywords: ['खजुर पाउडर', 'खजुरको धुलो', 'चिनीको विकल्प'],
    romanNepaliKeywords: ['khajur powder price', 'chini ko bikalpa', 'dates powder kati ho'],
    questionEn: 'What is Dates Powder and can it replace white sugar?',
    questionNp: 'खजुर पाउडर के हो र के यसले सेतो चिनी विस्थापन गर्न सक्छ?',
    answerEn:
      'NaturesMud Dates Powder is priced at Rs. 400 for a 100 GM glass jar. It is 100% pure dried Arabian dates finely pulverized. It replaces refined white sugar 1:1 in baby lito, tea, kheer, porridge, and baking while retaining natural dietary fiber, potassium, and magnesium.',
    answerNp:
      'नेचर्स मड खजुर पाउडरको मूल्य १०० ग्राम काँचको जारको रु ४०० हो। यो १००% शुद्ध सुकाएको खजुरलाई पिँधेर बनाइएको हो। यसले बच्चाको लिटो, खीर, चिया र पारिवारिक परिकारमा सेतो चिनीको उत्तम प्राकृतिक विकल्प दिन्छ।',
    productSlug: 'dates-powder',
    suggestedAction: {
      type: 'cart',
      label: 'Add Dates Powder to Cart (Rs. 400)',
      productSlug: 'dates-powder',
    },
  },

  // 7. SWEET POTATO POWDER
  {
    id: 'sweet-potato-powder-info',
    category: 'product',
    keywords: ['sweet potato powder', 'sakarkhanda', 'sakharkhanda powder', 'sweet potato price'],
    nepaliKeywords: ['सखरखण्ड पाउडर', 'सखरखण्डको धुलो'],
    romanNepaliKeywords: ['sakharkhanda powder', 'sweet potato powder use', 'sakarkhanda ko price'],
    questionEn: 'What is the price and use of Sweet Potato Powder?',
    questionNp: 'सखरखण्ड पाउडर (Sweet Potato Powder) को मूल्य र प्रयोग के हो?',
    answerEn:
      'NaturesMud Sweet Potato Powder is priced at Rs. 510 for a 100 GM glass jar. Sourced from Terai lowland farms, gently dehydrated below 45°C. Rich in beta-carotene and dietary fiber. Ideal for preparing smooth baby purees in under 2 minutes, or mixing into jaulo, soups, and pancakes.',
    answerNp:
      'नेचर्स मड सखरखण्ड पाउडरको मूल्य १०० ग्राम काँचको जारको रु ५१० हो। तराईको मलिलो माटोबाट सङ्कलित १००% शुद्ध सखरखण्ड। शिशुको लिटो, जाउलो र प्यानकेक बनाउन २ मिनेटमै तयार हुने सहज प्राकृतिक आहार।',
    productSlug: 'sweet-potato-powder',
    suggestedAction: {
      type: 'cart',
      label: 'Add Sweet Potato Powder to Cart (Rs. 510)',
      productSlug: 'sweet-potato-powder',
    },
  },

  // 8. SHILAJIT RESIN
  {
    id: 'shilajit-resin-info',
    category: 'product',
    keywords: ['shilajit', 'shilajit price', 'pure shilajit', 'fulvic acid', 'shilajit test', 'resin'],
    nepaliKeywords: ['शिलाजीत', 'शुद्ध हिमाली शिलाजीत', 'शिलाजीतको मूल्य'],
    romanNepaliKeywords: ['shilajit price in nepal', 'shilajit kasari khane', 'pure shilajit resin'],
    questionEn: 'What is the price and purity standard of NaturesMud Shilajit?',
    questionNp: 'नेचर्स मड शिलाजीतको मूल्य र शुद्धता मापदण्ड के हो?',
    answerEn:
      'NaturesMud Pure Mountain Himalayan Shilajit Resin is priced at Rs. 1,995 for a 20 GM amber glass jar with a stainless-steel dosing spoon. Sourced above 3,000m alpine rocks in Nepal. Traditional water-purified resin with zero maltodextrin, zero fillers, and natural fulvic acid. Dissolves completely in warm water without sediment.',
    answerNp:
      'नेचर्स मड शुद्ध हिमाली शिलाजीत रेजिनको मूल्य २० ग्राम काँचको जार (डोजिङ चम्चा सहित) को रु १,९९५ हो। ३,००० मिटर भन्दा माथिका हिमाली चट्टानबाट सङ्कलित शुद्ध रेजिन। तातो पानी वा दूधमा मटरको दाना जति घोलेर बिहान पिउन सकिन्छ।',
    productSlug: 'pure-mountain-himalayan-shilajit-resin',
    suggestedAction: {
      type: 'cart',
      label: 'Add Shilajit Resin to Cart (Rs. 1,995)',
      productSlug: 'pure-mountain-himalayan-shilajit-resin',
    },
  },

  // 9. MONSOON STORAGE & CLUMPING
  {
    id: 'storage-monsoon-guidance',
    category: 'storage',
    keywords: ['storage', 'monsoon', 'clumping', 'how to store', 'shelf life', 'wet spoon'],
    nepaliKeywords: ['कसरी सुरक्षित राख्ने', 'वर्षायाम', 'बिग्रिन्छ कि', 'भण्डारण'],
    romanNepaliKeywords: ['powder kasari store garne', 'jamchha ki', 'monsoon ma kasari rakhne'],
    questionEn: 'How should I store fruit and vegetable powders during Nepal’s monsoon season?',
    questionNp: 'नेपालको वर्षायाममा पाउडरहरू कसरी सुरक्षित भण्डारण गर्ने?',
    answerEn:
      'Because NaturesMud powders contain 0% anti-caking chemicals or silica agents, they naturally attract atmospheric humidity. Always use a 100% dry spoon. Tightly seal the glass jar immediately after use. Store in a cool, dark kitchen cupboard away from boiling pots, stoves, and direct sunlight. Never refrigerate dry jars as condensation creates clumping.',
    answerNp:
      'नेचर्स मडका पाउडरहरूमा कुनै कृत्रिम केमिकल वा एन्टी-केक एजेन्ट नहुने भएकाले हावाको आर्द्रताले जम्न सक्छ। सधैँ सुक्खा चम्चा प्रयोग गर्नुहोस्, प्रयोगपछि जारको बिर्को तुरुन्त कसेर बन्द गर्नुहोस् र ग्यासको बाफबाट टाढा सुक्खा ठाउँमा राख्नुहोस्।',
    suggestedAction: {
      type: 'link',
      label: 'Read Storage Guide',
      url: '/blog/how-to-store-dry-fruits-nuts-and-powders-in-monsoon-nepal',
    },
  },

  // 10. DIASPORA GIFTING / SEND GIFTS TO NEPAL
  {
    id: 'diaspora-gifting',
    category: 'shipping',
    keywords: ['send gifts to nepal', 'australia', 'usa', 'uk', 'gulf', 'parents gift', 'gift hamper'],
    nepaliKeywords: ['विदेशबाट नेपाल उपहार', 'बुबाआमालाई उपहार', 'उपहार बाकस'],
    romanNepaliKeywords: ['bidesh bata gift pathaune', 'australia bata nepal gift', 'parents lai gift'],
    questionEn: 'Can I send a health gift hamper to family in Nepal from Australia, USA, or the UK?',
    questionNp: 'के अष्ट्रेलिया वा अमेरिकाबाट नेपालमा रहेका परिवारलाई उपहार पठाउन सकिन्छ?',
    answerEn:
      'Yes! Nepalis abroad frequently order our curated wellness hampers for parents and family in Nepal. We offer personalized handwritten cards, secure gift packaging, and express 24h delivery in Kathmandu Valley and nationwide across all 77 districts. Chat with our international concierge on WhatsApp (+977-9713888002) for smooth payment and tracking.',
    answerNp:
      'हजुर, विदेशमा बस्नुहुने नेपालीहरूले हाम्रा बुबाआमा विशेष तथा चाडपर्व उपहार बाकस नेपालभर सहजै पठाउन सक्नुहुन्छ। निःशुल्क हातले लेखिएको शुभकामना कार्ड सहित काठमाडौँ उपत्यकामा २४ घण्टामै र बाहिर २-४ दिनमा सुरक्षित डेलिभरी गरिन्छ।',
    suggestedAction: {
      type: 'link',
      label: 'View Send Gifts to Nepal Portal',
      url: '/send-gifts-to-nepal',
    },
  },

  // 11. WHOLESALE & BULK ORDERS
  {
    id: 'wholesale-bulk-orders',
    category: 'wholesale',
    keywords: ['wholesale', 'bulk', 'distributor', 'reseller', 'hotel', 'restaurant', 'cafe'],
    nepaliKeywords: ['थोक बिक्री', 'होलसेल', 'वितरक'],
    romanNepaliKeywords: ['wholesale ma painchha', 'bulk order', 'distributor banna'],
    questionEn: 'Do you offer wholesale pricing or bulk supplies for cafes, hotels, and retailers?',
    questionNp: 'के क्याफे, होटल र खुद्रा पसलहरूका लागि थोक (Wholesale) सुविधा छ?',
    answerEn:
      'Yes. NaturesMud supplies 5kg, 10kg, and bulk bulk-packed superfood powders, dehydrated fruits, and Himalayan pink rock salt for cafes, bakeries, organic stores, and baby stores. Contact our wholesale desk directly at wholesale@naturesmud.shop or WhatsApp +977-9713888002.',
    answerNp:
      'हजुर, क्याफे, बेकरी र अर्गानिक पसलहरूका लागि ५ केजी, १० केजी तथा थोक परिमाणमा सहुलियत दरमा उत्पादन उपलब्ध गराइन्छ। हाम्रो थोक डेस्कमा सम्पर्क गर्न सक्नुहुन्छ।',
    suggestedAction: {
      type: 'link',
      label: 'Explore Wholesale Page',
      url: '/wholesale',
    },
  },

  // 12. HUMAN ESCALATION DESK
  {
    id: 'human-escalation',
    category: 'brand',
    keywords: ['talk to human', 'call', 'contact number', 'whatsapp', 'customer care', 'phone', 'help'],
    nepaliKeywords: ['सम्पर्क नम्बर', 'फोन', 'मान्छे सँग कुरा', 'ह्वाट्सएप'],
    romanNepaliKeywords: ['phone number k ho', 'kura garna man chha', 'call garna'],
    questionEn: 'How can I speak directly with a human customer support agent?',
    questionNp: 'म सिधै आधिकारिक प्रतिनिधिसँग कसरी सम्पर्क गर्न सक्छु?',
    answerEn:
      'Our dedicated Baneshwor customer desk is active Sunday to Friday, 9:00 AM to 6:00 PM NPT. You can reach our team directly by phone at +977-9713888002 or chat with us on WhatsApp at +977-9713888002 for instant assistance.',
    answerNp:
      'हाम्रो बानेश्वर कार्यालय आइतबारदेखि शुक्रबार बिहान ९:०० देखि साँझ ६:०० बजेसम्म खुला रहन्छ। तपाईं सिधै फोन नम्बर +९७७-९७१३८८८००२ मा वा WhatsApp मार्फत सम्पर्क गर्न सक्नुहुन्छ।',
    suggestedAction: {
      type: 'whatsapp',
      label: 'Open WhatsApp Chat (+977-9713888002)',
      url: 'https://wa.me/9779713888002?text=Hello%20NaturesMud!%20I%20need%20assistance%20with%20my%20order.',
    },
  },
];
