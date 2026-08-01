import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'aura-hoodie-01',
    name: 'AURA Cyber Oversized Hoodie',
    tagline: 'Heavyweight 450GSM Organic Cotton with Modular Tech Pocketing',
    category: 'hoodies',
    price: 145,
    originalPrice: 180,
    description: 'Engineered for street comfort and weather resistance. Features reinforced drop-shoulder geometry, deep double-lined hood, and high-density brushed fleece interior.',
    materials: ['100% Organic Heavyweight Cotton', 'Brushed Fleece Interior', 'Ribbed Elastane Cuffs'],
    stock: { S: 8, M: 14, L: 4, XL: 2 },
    colors: [
      { name: 'Obsidian Black', hex: '#111318' },
      { name: 'Neon Cyber Blue', hex: '#0066FF' },
      { name: 'Glacier Silver', hex: '#D1D5DB' },
      { name: 'Crimson Ember', hex: '#DC2626' }
    ],
    defaultColor: '#111318',
    modelType: 'hoodie',
    decalOptions: ['AURA Emblem', 'Cyber Mesh', 'Japanese Katakana', 'Minimalist Grid'],
    rating: 4.9,
    reviewsCount: 128,
    isNew: true,
    isBestseller: true,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    realPhotos360: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80', // 0° Front
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80', // 90° Side Profile
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80', // 180° Back View
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1000&q=80'  // 270° Detail Fit
    ]
  },
  {
    id: 'aura-tee-02',
    name: 'Matrix Heavyweight Boxy Tee',
    tagline: '300GSM Supima Cotton with Seamless 3D Knit Texture',
    category: 'tees',
    price: 65,
    originalPrice: 85,
    description: 'Precision-cut drop shoulder graphic tee built with pre-shrunk Supima cotton. Micro-stitch detailing provides structural drape that retains shape wash after wash.',
    materials: ['100% USA Supima Cotton', 'High-Density Screenprint Ready', 'Pre-shrunk Fabric'],
    stock: { S: 25, M: 18, L: 12, XL: 6 },
    colors: [
      { name: 'Pure Chalk', hex: '#F9FAFB' },
      { name: 'Midnight Charcoal', hex: '#1F2937' },
      { name: 'Sage Olive', hex: '#4B5563' },
      { name: 'Electric Violet', hex: '#7C3AED' }
    ],
    defaultColor: '#F9FAFB',
    modelType: 'shirt',
    decalOptions: ['AURA Tech Code', 'Holographic Circuit', 'Geometric Wave', 'None'],
    rating: 4.8,
    reviewsCount: 94,
    isBestseller: true,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    realPhotos360: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80', // 0° Front
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80', // 90° Side Profile
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80', // 180° Back
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80'  // 270° Close-up Collar
    ]
  },
  {
    id: 'aura-jacket-03',
    name: 'Vanguard Modular Tech Jacket',
    tagline: 'Waterproof 3-Layer GORE-TEX Shell with Dynamic Zipper Vents',
    category: 'jackets',
    price: 285,
    originalPrice: 340,
    description: 'Ultra-lightweight all-weather techwear shell. Features taped seams, 4 utility magnetic pockets, ergonomic elbow articulation, and high-visibility reflective trim.',
    materials: ['3-Layer Waterproof Nylon Shell', 'Magnetic Fidlock Pockets', 'YKK AquaGuard Zippers'],
    stock: { S: 5, M: 9, L: 3, XL: 1 },
    colors: [
      { name: 'Matte Stealth Black', hex: '#18181B' },
      { name: 'Tactical Tan', hex: '#78716C' },
      { name: 'Solar Flare Orange', hex: '#EA580C' }
    ],
    defaultColor: '#18181B',
    modelType: 'jacket',
    decalOptions: ['Vanguard Crest', 'Reflective Barcode', 'Tactical Unit'],
    rating: 5.0,
    reviewsCount: 67,
    isNew: true,
    imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80',
    realPhotos360: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80', // 0° Front
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80', // 90° Side Profile
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80', // 180° Back
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1000&q=80'  // 270° Zip Detail
    ]
  },
  {
    id: 'aura-pants-04',
    name: 'Apex Tactical Cargo Trousers',
    tagline: '4-Way Stretch Ripstop Cotton with Quick-Release Ankle Straps',
    category: 'pants',
    price: 135,
    originalPrice: 160,
    description: 'Designed for unrestricted mobility. Engineered with reinforced knee darts, 6 modular cargo compartments, and adjustable tension straps for customizable taper.',
    materials: ['92% Ripstop Cotton', '8% Spandex Flex Strand', 'DWR Water-Repellent Coating'],
    stock: { S: 12, M: 7, L: 5, XL: 3 },
    colors: [
      { name: 'Phantom Dark Gray', hex: '#27272A' },
      { name: 'Military Olive', hex: '#3F6212' },
      { name: 'Desert Khaki', hex: '#A16207' }
    ],
    defaultColor: '#27272A',
    modelType: 'pants',
    decalOptions: ['Utility Seal', 'Tech Strap Accent'],
    rating: 4.7,
    reviewsCount: 82,
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
    realPhotos360: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80', // 0° Front
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80', // 90° Side Profile
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80', // 180° Back
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1000&q=80'  // 270° Pocket Detail
    ]
  },
  {
    id: 'aura-sneaker-05',
    name: 'Quantum-X 3D Cyber Sneakers',
    tagline: 'Procedurally 3D-Printed Lattice Sole with Responsive Foam Core',
    category: 'sneakers',
    price: 210,
    originalPrice: 250,
    description: 'Futuristic footwear engineering. The additive lattice midsole absorbs shock while providing explosive energy return. Breathable FlyKnit upper with quick lace lock system.',
    materials: ['3D Printed Polymer Sole', 'Recycled FlyKnit Canvas', 'Memory Foam Insole'],
    stock: { S: 6, M: 11, L: 8, XL: 4 },
    colors: [
      { name: 'Cyber White & Neon', hex: '#E2E8F0' },
      { name: 'Triple Black', hex: '#0F172A' },
      { name: 'Hyper Orange Mesh', hex: '#F97316' }
    ],
    defaultColor: '#E2E8F0',
    modelType: 'sneaker',
    decalOptions: ['Quantum Badge', 'Neon Stripe'],
    rating: 4.9,
    reviewsCount: 156,
    isNew: true,
    isBestseller: true,
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80',
    realPhotos360: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80', // 0° Front Profile
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80', // 90° Side Profile
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80', // 180° Heel Back
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1000&q=80'  // 270° Sole Mesh Detail
    ]
  },
  {
    id: 'aura-blazer-06',
    name: 'Sovereign Atelier Tailored Blazer',
    tagline: 'Merino Wool Blend with Satin Lapel and Concealed Smart Pocket',
    category: 'blazers',
    price: 320,
    originalPrice: 390,
    description: 'Modern luxury tailoring meeting sharp architectural lines. Features structured shoulders, silk touch lining, metallic button accents, and hidden RFID phone pocket.',
    materials: ['80% Virgin Merino Wool', '20% Mulberry Silk Blend', 'Bemberg Cupro Lining'],
    stock: { S: 4, M: 6, L: 2, XL: 1 },
    colors: [
      { name: 'Royal Midnight Navy', hex: '#1E1B4B' },
      { name: 'Onyx Black Satin', hex: '#09090B' },
      { name: 'Champagne Taupe', hex: '#78716C' }
    ],
    defaultColor: '#1E1B4B',
    modelType: 'blazer',
    decalOptions: ['Monogram Crest', 'Satin Trim'],
    rating: 4.9,
    reviewsCount: 43,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
    realPhotos360: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80', // 0° Front Fit
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80', // 90° Side Lapel
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80', // 180° Tailored Back
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1000&q=80'  // 270° Cuff & Button Detail
    ]
  }
];

export const PROMO_CODES = [
  { code: 'AURA3D', discountPercent: 15, description: '15% Off 3D Launch Special' },
  { code: 'VIP20', discountPercent: 20, description: '20% Off VIP Member Special' },
  { code: 'FREESHIP', discountPercent: 10, description: '10% Off + Free Express Shipping' }
];
