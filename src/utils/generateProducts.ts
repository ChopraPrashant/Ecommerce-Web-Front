import { v4 as uuidv4 } from 'uuid';
import { IProduct } from '../types/product';

const categories = [
  { _id: 'cat1', name: 'Water Pumps', slug: 'water-pumps' },
  { _id: 'cat2', name: 'Induction Motors', slug: 'induction-motors' },
  { _id: 'cat3', name: 'Cables', slug: 'cables' },
];

const brands = [
  { 
    _id: 'brand1', 
    name: 'Crompton Greaves',
    slug: 'crompton-greaves',
    description: 'Leading electrical equipment manufacturer'
  },
  { 
    _id: 'brand2', 
    name: 'Kirloskar',
    slug: 'kirloskar',
    description: 'Trusted brand for pumps and motors'
  },
  { 
    _id: 'brand3', 
    name: 'Bharat Bijlee',
    slug: 'bharat-bijlee',
    description: 'Premium electrical equipment manufacturer'
  },
  { 
    _id: 'brand4', 
    name: 'L&T',
    slug: 'lnt',
    description: 'Multinational conglomerate with electrical division'
  }
];

const generateProduct = (name: string, categoryIndex: number, basePrice: number, count: number): IProduct[] => {
  return Array.from({ length: count }, (_, i) => {
    // Check if this is the 13th cable product (index 12 since arrays are 0-based)
    const is13thCable = name.toLowerCase() === 'cable' && i === 12;
    
    return {
      _id: `p-${is13thCable ? 'cable-13' : uuidv4()}`,
      name: is13thCable ? 'Premium Industrial Cable' : `${name} ${i + 1}`,
      slug: is13thCable ? 'premium-industrial-cable' : `${name.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
      description: is13thCable 
        ? 'High-quality premium industrial cable with enhanced durability and performance. Ideal for heavy-duty applications.'
        : `High-quality ${name.toLowerCase()} model ${i + 1}.`,
      shortDescription: is13thCable 
        ? 'Premium cable for industrial use' 
        : `Model ${i + 1} with premium features`,
      price: is13thCable ? 1500 : basePrice + (i * 500),
      originalPrice: is13thCable ? 1800 : basePrice + 1000 + (i * 500),
      discountPercentage: is13thCable ? 17 : Math.floor(Math.random() * 20) + 5,
      stock: is13thCable ? 25 : Math.floor(Math.random() * 50) + 10,
      sku: is13thCable ? 'CABLE-PREM-13' : `SKU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      images: [
        { 
          url: is13thCable 
            ? '/images/products/cable-premium.jpg' 
            : `/images/products/${categories[categoryIndex].slug}-${(i % 3) + 1}.jpg`, 
          alt: is13thCable ? 'Premium Industrial Cable' : `${name} ${i + 1}`, 
          isPrimary: true 
        },
      ],
      categories: [categories[categoryIndex]],
      brand: is13thCable 
        ? { _id: 'brand4', name: 'L&T', slug: 'lnt', description: 'Multinational conglomerate with electrical division' }
        : brands[Math.floor(Math.random() * brands.length)],
      tags: is13thCable ? ['premium', 'industrial', 'heavy-duty', 'best-seller'] : [],
      variants: [],
      attributes: is13thCable ? [
        { name: 'Length', values: ['100m', '200m', '500m'], isVariant: true, isFilterable: true },
        { name: 'Color', values: ['Black', 'Red', 'Blue'], isVariant: true, isFilterable: true },
        { name: 'Voltage', values: ['110V', '220V', '440V'], isVariant: false, isFilterable: true }
      ] : [],
      reviews: [],
      rating: is13thCable ? 4.8 : Math.floor(Math.random() * 2) + 3.5, // 3.5 - 5.5
      averageRating: is13thCable ? 4.8 : Math.floor(Math.random() * 2) + 3.5,
      reviewCount: is13thCable ? 42 : Math.floor(Math.random() * 100),
      numReviews: is13thCable ? 42 : Math.floor(Math.random() * 100),
      isFeatured: is13thCable ? true : Math.random() > 0.7,
      isActive: true,
      onSale: is13thCable ? true : Math.random() > 0.3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
};

export const generateProducts = () => {
  const waterPumps = generateProduct('Water Pump', 0, 5000, 12);
  const motors = generateProduct('Induction Motor', 1, 8000, 10);
  const cables = generateProduct('Cable', 2, 1000, 15);
  
  return [...waterPumps, ...motors, ...cables];
};
