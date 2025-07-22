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
    description: 'Compact and efficient 0.5HP water pump with max head of 15 meters. Perfect for small homes and gardens.',
    shortDescription: '0.5 HP Domestic Water Supply Pump',
    sku: 'WP-KIRLOSKAR-0.5HP',
    price: 4899,
    originalPrice: 5475,
    stock: 8,
    brand: brands[1],
    categories: [categories[0]],
    tags: ['domestic', 'compact'],
    images: [
      { url: '/jalraj.png', alt: 'Kirloskar 0.5HP Jalraaj', isPrimary: true }
    ],
    reviews: []
  }),
  createProduct({
    name: 'Kirloskar Chhotu 0.5HP',
    slug: 'kirloskar-chhotu-0.5hp',
    description: 'Compact and efficient 0.5HP water pump with max head of 15 meters. Perfect for small homes and gardens.',
    shortDescription: '0.5HP Domestic Water Pump',
    sku: 'WP-KIRLOSKAR-CS05',
    price: 3950,
    originalPrice: 4660,
    stock: 12,
    brand: brands[1],
    categories: [categories[0]],
    tags: ['domestic', 'compact'],
    images: [
      { url: '/chotu.png', alt: 'Kirloskar 0.5HP Chhotu', isPrimary: true }
    ],
    reviews: []
  }),
  createProduct({
    name: 'Crompton Mini Everest 2HP',
    slug: 'crompton-mini-everest-2hp',
    description: 'Compact and powerful 2HP water pump with max head of 60 meters.',
    shortDescription: '2HP Self Priming Regenerative Pump',
    sku: 'WP-CROMPTON-ME2',
    price: 19375,
    originalPrice: 22775,
    stock: 9,
    brand: brands[0],
    categories: [categories[0]],
    tags: ['domestic', 'compact', '2hp'],
    images: [
      { url: '/minieverest.png', alt: 'Crompton Mini Everest 2HP', isPrimary: true }
    ],
    reviews: []
  }),
  createProduct({
    name: 'Crompton Aquagold Dura 150',
    slug: 'crompton-aquagold-dura-150',
    description: 'Heavy-duty 2.0HP water pump with max head of 45 meters.',
    shortDescription: '1.5HP Heavy Duty Water Pump',
    sku: 'WP-CROMPTON-AG150',
    price: 12999,
    originalPrice: 15550,
    stock: 5,
    brand: brands[0],
    categories: [categories[0]],
    tags: ['agricultural', 'heavy-duty'],
    images: [
      { url: '/aquagolddura150.png', alt: 'Crompton Aquagold Dura 150', isPrimary: true }
    ],
    reviews: []
  }),
  
  createProduct({
    name: 'Crompton Flomax Plus 1HP',
    slug: 'crompton-flomax-plus-1hp',
    description: 'Efficient 1.0HP water pump.',
    shortDescription: '1HP High Power Self Priming Pump',
    sku: 'WP-CROMPTON-FLP1',
    price: 10999,
    originalPrice: 12900,
    stock: 10,
    brand: brands[0],
    categories: [categories[0]],
    tags: ['domestic'],
    images: [
      { url: '/flomaxplus.png', alt: 'Crompton Flomax Plus 1HP', isPrimary: true }
    ],
    reviews: []
  }),
  
  createProduct({
    name: 'Crompton Champ Dura 1HP',
    slug: 'crompton-champ-dura-1hp',
    description: 'Efficient 1.0HP water pump.',
    shortDescription: '1HP High Power Self Priming Pump',
    sku: 'WP-CROMPTON-CHD1',
    price: 5199,
    originalPrice: 6400,
    stock: 6,
    brand: brands[0],
    categories: [categories[0]],
    tags: ['domestic'],
    images: [
      { url: '/champdura.png', alt: 'Crompton Champ Dura 1HP', isPrimary: true }
    ],
    reviews: []
  }),
  createProduct({
    name: 'Crompton OWE052(1PH)Z-21FS',
    slug: 'crompton-owe052-1ph-z-21fs',
    description: 'Dewatering Pump 0.5HP',
    shortDescription: '0.5HP Sewerage Dewatering Pump',
    sku: 'WP-CROMPTON-OWE052',
    price: 9999,
    originalPrice: 11530,
    stock: 4,
    brand: brands[0],
    categories: [categories[0]],
    tags: ['agricultural', 'dewatering'],
    images: [
      { url: '/OWE052.png', alt: 'Crompton OWE052(1PH)Z-21FS', isPrimary: true }
    ],
    reviews: []
  }),
  createProduct({
    name: 'Crompton Aquagold 150',
    slug: 'crompton-aquagold-150',
    description: 'Powerful 1.5HP water pump with max head of 35 meters. Ideal for large homes and small farms.',
    shortDescription: '1.5HP Heavy Duty Water Pump',
    sku: 'WP-CROMPTON-AG150',
    price: 15550,
    originalPrice: 15550,
    stock: 8,
    brand: brands[0],
    categories: [categories[0]],
    tags: ['domestic', 'agricultural'],
    images: [
      { url: '/aquagold150.png', alt: 'Crompton Aquagold 150', isPrimary: true }
    ],
    reviews: []
  }),
  createProduct({
    name: 'Pressure Booster Pump V24',
    slug: 'crompton-pressure-booster-pump-v24',
    description: 'Pressure Booster Pump V24',
    shortDescription: '1HP Pressure Booster Pump With 24L Tank',
    sku: 'WP-CROMPTON-PBPV24',
    price: 24999,
    originalPrice: 28050,
    stock: 2,
    brand: brands[0],
    categories: [categories[0]],
    tags: ['agricultural', 'industrial', 'heavy-duty'],
    images: [
      { url: '/Pressure Booster.png', alt: 'Crompton Pressure Booster Pump V24', isPrimary: true }
    ],
    reviews: []
  }),
  createProduct({
    name: 'Control Panel ARMOR1.5-DSU',
    slug: 'crompton-control-panel-armor1.5-dsu',
    description: 'Premium ',
    shortDescription: 'Premium 1.5HP Control Panel',
    sku: 'WP-CROMPTON-CP1.5',
    price: 3499,
    originalPrice: 3800,
    stock: 10,
    brand: brands[0],
    categories: [categories[0]],
    tags: ['domestic', 'premium'],
    images: [
      { url: '/controlpanel.png', alt: 'Crompton Control Panel ARMOR1.5-DSU', isPrimary: true }
    ],
    reviews: []
  }),
  createProduct({
    name: 'Crompton STPG052(1PH)-8',
    slug: 'crompton-stpg052-1ph-8',
    description: 'Efficient 0.5HP Sewerage Pump.',
    shortDescription: '0.5HP Durable Sewerage Pump',
    sku: 'WP-CROMPTON-STPG052',
    price: 11999,
    originalPrice: 13900,
    stock: 5,
    brand: brands[0],
    categories: [categories[0]],
    tags: ['domestic', 'sewerage'],
    images: [
      { url: '/stpg.png', alt: 'Crompton STPG052(1PH)-8 Sewerage Pump', isPrimary: true }
    ],
    reviews: []
  }),
  createProduct({
    name: 'Crompton STPM12(1PH)-11',
    slug: 'crompton-stpm12-1ph-11',
    description: 'Efficient 1HP Dewatering Pump.',
    shortDescription: '1HP Single Phase Dewatering Pump',
    sku: 'WP-CROMPTON-STPM12',
    price: 17999,
    originalPrice: 20775,
    stock: 5,
    brand: brands[0],
    categories: [categories[0]],
    tags: ['domestic', 'dewatering'],
    images: [
      { url: '/Stpm22.png', alt: 'Crompton STPM12(1PH)-11 Dewatering Pump', isPrimary: true }
    ],
    reviews: []
  }),
  createProduct({
    name: 'Crompton STPM22(1PH)-15',
    slug: 'crompton-stpm22-1ph-15',
    description: 'Efficient 2HP Dewatering Pump.',
    shortDescription: '2HP Single Phase Dewatering Pump',
    sku: 'WP-CROMPTON-STPM22',
    price: 24999,
    originalPrice: 25800,
    stock: 5,
    brand: brands[0],
    categories: [categories[0]],
    tags: ['domestic', 'dewatering'],
    images: [
      { url: '/Stpm22.png', alt: 'Crompton STPM22(1PH)-15 Dewatering Pump', isPrimary: true }
    ],
    reviews: []
  }),
  createProduct({
    name: 'Crompton STPM32(1PH)-18',
    slug: 'crompton-stpm32-1ph-18',
    description: 'Efficient 3HP Dewatering Pump.',
    shortDescription: '3HP Single Phase Dewatering Pump',
    sku: 'WP-CROMPTON-STPM32',
    price: 26999,
    originalPrice: 33040,
    stock: 5,
    brand: brands[0],
    categories: [categories[0]],
    tags: ['domestic', 'dewatering'],
    images: [
      { url: '/Stpm22.png', alt: 'Crompton STPM32(1PH)-18 Dewatering Pump', isPrimary: true }
    ],
    reviews: []
  }),
  createProduct({
    name: 'Crompton STPM32-18',
    slug: 'crompton-stpm32-18',
    description: 'Efficient 3HP Dewatering Pump.',
    shortDescription: '3HP Three Phase Dewatering Pump',
    sku: 'WP-CROMPTON-STPM32',
    price: 24099,
    originalPrice: 28520,
    stock: 5,
    brand: brands[0],
    categories: [categories[0]],
    tags: ['domestic', 'dewatering'],
    images: [
      { url: '/Stpm22.png', alt: 'Crompton STPM32-18 Dewatering Pump', isPrimary: true }
    ],
    reviews: []
  })
];










// Induction Motors
const inductionMotors: IProduct[] = [
  createProduct({
    name: 'Bharat Bijlee IE2 Induction Motor 3 HP',
    slug: 'bharat-bijlee-3hp-induction',
    description: 'Energy efficient 3HP 3-phase induction motor with IP55 protection. Suitable for industrial applications.',
    shortDescription: 'IE2 3HP Squirrel Cage 3000 RPM Foot Mounted Induction Motor',
    sku: 'MOTOR-BB-3HP',
    price: 39999,
    originalPrice: 47680,
    stock: 5,
    brand: brands[2],
    categories: [categories[1]],
    tags: ['industrial', '3-phase'],
    images: [
      { url: '/InductionMotor.png', alt: 'Bharat Bijlee 3HP Motor', isPrimary: true }
    ],
    reviews: []
  }),
  createProduct({
    name: 'Bharat Bijlee IE3 Induction Motor 5 HP',
    slug: 'bharat-bijlee-5hp-induction',
    description: 'Heavy-duty 5HP 3-phase induction motor with IP55 protection. Ideal for industrial and agricultural applications.',
    shortDescription: 'IE3 5HP Squirrel Cage 3000 RPM Foot Mounted Induction Motor',
    sku: 'MOTOR-BB-5HP',
    price: 51999,
    originalPrice: 73580,
    stock: 4,
    brand: brands[2],
    categories: [categories[1]],
    tags: ['industrial', '3-phase', 'heavy-duty'],
    images: [
      { url: '/inductionred.png', alt: 'Bharat Bijlee 5HP Motor', isPrimary: true }
    ],
    reviews: []
  }),
  createProduct({
    name: 'Bharat Bijlee IE3 Induction Motor 7.5 HP',
    slug: 'bharat-bijlee-7.5hp-induction',
    description: 'Heavy-duty 7.5HP 3-phase induction motor with IP55 protection. Designed for industrial applications.',
    shortDescription: 'IE3 7.5HP Squirrel Cage 1500 RPM Foot Mounted Induction Motor',
    sku: 'MOTOR-BB-7.5HP',
    price: 79999,
    originalPrice: 111000,
    stock: 3,
    brand: brands[2],
    categories: [categories[1]],
    tags: ['industrial', '3-phase', 'heavy-duty'],
    images: [
      { url: '/inductionn.png', alt: 'Bharat Bijlee 7.5HP Motor', isPrimary: true }
    ],
    reviews: []
  }),
  createProduct({
    name: 'Bharat Bijlee IE3 Induction Motor 10 HP',
    slug: 'bharat-bijlee-10hp-induction',
    description: 'Heavy-duty 10HP 3-phase induction motor with IP55 protection. Designed for industrial applications.',
    shortDescription: 'IE3 10HP Squirrel Cage 3000 RPM Foot Mounted Induction Motor',
    sku: 'MOTOR-BB-10HP',
    price: 99999,
    originalPrice: 122930,
    stock: 5,
    brand: brands[2],
    categories: [categories[1]],
    tags: ['industrial', '3-phase', 'heavy-duty'],
    images: [
      { url: '/inductionred.png', alt: 'Bharat Bijlee 10HP Motor', isPrimary: true }
    ],
    reviews: []
  })
];









// Cables
const cables: IProduct[] = [
  createProduct({
    name: 'Polycab 4 Sq.mm 90m FR PVC',
    slug: 'polycab-4sqmm-fr-pvc-cable',
    description: '4 Sq.mm 3.5 Core 90m FR PVC Copper Cable. Fire retardant and suitable for domestic and industrial wiring.',
    shortDescription: '4 Sq.mm 3.5 Core FR PVC Cable',
    sku: 'CABLE-POLYCAB-4SQMM',
    price: 18500,
    originalPrice: 19999,
    stock: 25,
    brand: { 
      _id: 'brand7', 
      name: 'Polycab',
      slug: 'polycab',
      description: 'Leading manufacturer of wires and cables',
      logo: '/images/brands/polycab.png'
    },
    categories: [categories[2]],
    tags: ['copper', 'fr-pvc'],
    images: [
      { url: '/Cables.png', alt: 'Polycab 4 Sq.mm Cable', isPrimary: true }
    ],
    reviews: []
  }),
  createProduct({
    name: 'Finolex 1.5 Sq.mm 90m FR PVC',
    slug: 'finolex-1.5sqmm-fr-pvc-cable',
    description: '1.5 Sq.mm 2 Core 90m FR PVC Copper Cable. Fire retardant and suitable for domestic wiring.',
    shortDescription: '1.5 Sq.mm 2 Core FR PVC Cable',
    sku: 'CABLE-FINOLEX-1.5SQMM',
    price: 5200,
    originalPrice: 5899,
    stock: 40,
    brand: { 
      _id: 'brand8', 
      name: 'Finolex',
      slug: 'finolex',
      description: 'Trusted brand for electrical wires and cables',
      logo: '/images/brands/finolex.png'
    },
    categories: [categories[2]],
    tags: ['copper', 'fr-pvc'],
    images: [
      { url: '/cable1.png', alt: 'Finolex 1.5 Sq.mm Cable', isPrimary: true }
    ],
    reviews: []
  }),
  createProduct({
    name: 'Polycab 25 Sq.mm 90m Armoured Cable',
    slug: 'polycab-25sqmm-armoured-cable',
    description: '25 Sq.mm 3.5 Core 90m Armoured Cable. Extra protection with steel wire armouring for underground and outdoor use.',
    shortDescription: '25 Sq.mm 3.5 Core Armoured Cable',
    sku: 'CABLE-POLYCAB-25SQMM-ARM',
    price: 112500,
    originalPrice: 124999,
    stock: 5,
    brand: { 
      _id: 'brand7', 
      name: 'Polycab',
      slug: 'polycab',
      description: 'Leading manufacturer of wires and cables',
      logo: '/images/brands/polycab.png'
    },
    categories: [categories[2]],
    tags: ['copper', 'armoured', 'underground'],
    images: [
      { url: '/cable.png', alt: 'Polycab 25 Sq.mm Armoured Cable', isPrimary: true }
    ],
    reviews: []
  }),
  createProduct({
    name: 'Finolex 1.0 Sq.mm 90m FR PVC',
    slug: 'finolex-1.0sqmm-fr-pvc-cable',
    description: '1.0 Sq.mm 2 Core 90m FR PVC Copper Cable. Ideal for lighting circuits and domestic wiring.',
    shortDescription: '1.0 Sq.mm 2 Core FR PVC Cable',
    sku: 'CABLE-FINOLEX-1.0SQMM',
    price: 3800,
    originalPrice: 4299,
    stock: 50,
    brand: { 
      _id: 'brand8', 
      name: 'Finolex',
      slug: 'finolex',
      description: 'Trusted brand for electrical wires and cables',
      logo: '/images/brands/finolex.png'
    },
    categories: [categories[2]],
    tags: ['copper', 'fr-pvc'],
    images: [
      { url: '/cable2.png', alt: 'Finolex 1.0 Sq.mm Cable', isPrimary: true }
    ],
    reviews: []
  })
];

export const generateProducts = (): IProduct[] => {
  // Combine all products without any limits
  return [
    ...waterPumps,     // All water pumps
    ...inductionMotors, // All induction motors
    ...cables          // All cables
  ];
};
