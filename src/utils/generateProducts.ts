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
    name: 'Crompton',
    slug: 'crompton',
    description: 'Leading electrical equipment manufacturer',
    logo: '/images/brands/crompton.png'
  },
  { 
    _id: 'brand2', 
    name: 'Kirloskar',
    slug: 'kirloskar',
    description: 'Trusted brand for pumps and motors',
    logo: '/images/brands/kirloskar.png'
  },
  { 
    _id: 'brand3', 
    name: 'Bharat Bijlee',
    slug: 'bharat-bijlee',
    description: 'Premium electrical equipment manufacturer',
    logo: '/images/brands/bharat-bijlee.png'
  },
  { 
    _id: 'brand4', 
    name: 'L&T',
    slug: 'lnt',
    description: 'Multinational conglomerate with electrical division',
    logo: '/images/brands/lnt.png'
  },
  { 
    _id: 'brand5', 
    name: 'Havells',
    slug: 'havells',
    description: 'Leading electrical equipment company',
    logo: '/images/brands/havells.png'
  },
  { 
    _id: 'brand6', 
    name: 'Orient Electric',
    slug: 'orient-electric',
    description: 'Trusted name in electrical appliances',
    logo: '/images/brands/orient.png'
  }
];

const createProduct = (productData: Partial<IProduct>): IProduct => {
  const baseProduct: IProduct = {
    _id: uuidv4(),
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    sku: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    images: [],
    categories: [],
    brand: brands[0],
    tags: [],
    variants: [],
    attributes: [],
    reviews: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return { ...baseProduct, ...productData };
};

// Water Pumps
const waterPumps: IProduct[] = [
  createProduct({
    name: 'Crompton Nile Plus I',
    slug: 'crompton-nile-plus-1',
    description: 'High efficiency self-priming water pump with max head of 25 meters and max discharge of 2400 LPH. Features thermal overload protection and rust-proof body.',
    shortDescription: 'Mini Self Priming Regenerative Pump 1 HP',
    sku: 'WP-CROMPTON-NP1',
    price: 4999,
    originalPrice: 5850,
    stock: 15,
    brand: brands[0],
    categories: [categories[0]],
    tags: ['domestic'],
    images: [
      { url: '/Nile plus I.png', alt: 'Crompton 1HP Mini Champ', isPrimary: true }
    ],
    reviews: []
  }),
  createProduct({
    name: 'Kirloskar Jalraaj Ultra 0.5HP ',
    slug: 'kirloskar-jalraaj-ultra-0.5hp',
    description: 'Heavy duty 2HP water pump with max head of 40 meters and max discharge of 3600 LPH. Ideal for agricultural use.',
    shortDescription: '0.5 HP Domestic Water Supply Pump',
    sku: 'WP-KIRLOSKAR-0.5HP',
    price: 4899,
    originalPrice: 5475,
    stock: 8,
    brand: brands[1],
    categories: [categories[0]],
    tags: ['agricultural', 'heavy-duty'],
    images: [
      { url: '/jalraj.png', alt: 'Kirloskar 2HP Jalraaj', isPrimary: true }
    ],
    reviews: []
  }),
  // Add 6 more water pumps...

];

// Induction Motors
const inductionMotors: IProduct[] = [
  createProduct({
    name: 'Bharat Bijlee 3HP Induction Motor',
    slug: 'bharat-bijlee-3hp-induction',
    description: 'Energy efficient 3HP 3-phase induction motor with IP55 protection. Suitable for industrial applications.',
    shortDescription: '3HP industrial induction motor',
    sku: 'MOTOR-BB-3HP',
    price: 18999,
    originalPrice: 20999,
    stock: 5,
    brand: brands[2],
    categories: [categories[1]],
    tags: ['industrial', '3-phase'],
    images: [
      { url: '/images/products/motors/bharat-bijlee-3hp.jpg', alt: 'Bharat Bijlee 3HP Motor', isPrimary: true }
    ],
    reviews: []
  }),
  // Add 7 more induction motors...
];

// Cables
const cables: IProduct[] = [
  createProduct({
    name: 'L&T 6 Sq.mm 90m FR PVC Cable',
    slug: 'lnt-6sqmm-fr-pvc-cable',
    description: '6 Sq.mm 2 Core 90m FR PVC Copper Cable. Fire retardant and suitable for domestic and industrial wiring.',
    shortDescription: '6 Sq.mm 2 Core FR PVC Cable',
    sku: 'CABLE-LNT-6SQMM',
    price: 12500,
    originalPrice: 13999,
    stock: 50,
    brand: brands[3],
    categories: [categories[2]],
    tags: ['copper', 'fr-pvc'],
    images: [
      { url: '/images/products/cables/lnt-6sqmm.jpg', alt: 'L&T 6 Sq.mm Cable', isPrimary: true }
    ],
    reviews: []
  }),
  // Add 7 more cables...
];

export const generateProducts = (): IProduct[] => {
  // Combine all products
  return [
    ...waterPumps.slice(0, 8),      // First 8 water pumps
    ...inductionMotors.slice(0, 8), // First 8 induction motors
    ...cables.slice(0, 8)           // First 8 cables
  ];
};
