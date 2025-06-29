import { IProduct } from '../types/product';
import { generateProducts } from '../utils/generateProducts';

// Generate categories and brands for export
const categories = [
  { _id: 'cat1', name: 'Water Pumps', slug: 'water-pumps', description: 'High-quality water pumps for various applications' },
  { _id: 'cat2', name: 'Induction Motors', slug: 'induction-motors', description: 'Efficient and reliable induction motors' },
  { _id: 'cat3', name: 'Cables', slug: 'cables', description: 'Durable cables for industrial and residential use' },
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

// Generate dynamic products
const products: IProduct[] = generateProducts();

export { categories, brands, products };
