export const seedCategories = [
  { id: 'cat_1', name: 'SHIRTS', slug: 'shirts', description: 'Formal and casual shirts.', isActive: true, displayOrder: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat_2', name: 'JACKETS & BLAZERS', slug: 'jackets-blazers', description: 'Premium outer wear.', isActive: true, displayOrder: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat_3', name: 'ETHNIC WEAR', slug: 'ethnic-wear', description: 'Traditional and celebration wear.', isActive: true, displayOrder: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat_4', name: 'TROUSERS', slug: 'trousers', description: 'Pants and trousers.', isActive: true, displayOrder: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat_5', name: 'ACCESSORIES', slug: 'accessories', description: 'Ties, belts, wallets.', isActive: true, displayOrder: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

export const seedProducts = Array.from({ length: 15 }).map((_, index) => {
  const categories = ['cat_1', 'cat_2', 'cat_3', 'cat_4', 'cat_5'];
  const categoryId = categories[index % categories.length];
  
  const productNames = [
    'Classic Oxford Shirt', 'Linen Summer Blazer', 'Regal Velvet Sherwani', 'Slim Fit Chinos', 'Italian Leather Belt',
    'Printed Resort Shirt', 'Tuxedo Jacket', 'Embroidered Kurta Set', 'Formal Tailored Trousers', 'Silk Designer Tie',
    'Denim Casual Shirt', 'Double Breasted Suit', 'Wedding Indo-Western', 'Stretch Cotton Pants', 'Silver Cufflinks'
  ];
  
  const images = [
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593030103066-0093718efeb9?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1599424859062-8e7c10b25e1b?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1624378439575-d1ead6bb164c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1594938328870-9117ee6289c5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1624378441864-6d811fb264f3?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&q=80&w=800',
  ];

  const price = 2000 + Math.floor(Math.random() * 8000);
  const isSale = Math.random() > 0.7;

  return {
    id: `prod_dummy_${index + 1}`,
    name: productNames[index],
    slug: productNames[index].toLowerCase().replace(/\s+/g, '-'),
    sku: `BS-DM-${1000 + index}`,
    description: `A premium ${productNames[index].toLowerCase()} designed with comfort and luxury in mind.`,
    categoryId: categoryId,
    price: price,
    salePrice: isSale ? Math.floor(price * 0.8) : null,
    images: [images[index]],
    sizes: categoryId === 'cat_5' ? ['One Size'] : ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'White', 'Grey'].sort(() => 0.5 - Math.random()).slice(0, 2),
    stockQuantity: 10 + Math.floor(Math.random() * 40),
    isNew: Math.random() > 0.5,
    isFeatured: Math.random() > 0.5,
    status: 'published',
    displayOrder: index + 1,
    seoTitle: `${productNames[index]} | Brand Store Anand`,
    seoDescription: `Buy the ${productNames[index]} at Brand Store Anand.`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

export const seedStoreSettings = {
  storeName: 'Brand Store Anand',
  whatsappNumber: '919876543210',
  storeLogo: '/logo.jpg',
  theme: 'dark',
  policies: ['No Returns on Sale Items', 'Exchange within 7 days', 'Dry Clean Only'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
