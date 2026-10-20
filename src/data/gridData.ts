export interface Product {
  id: string;
  title: string;
  category: 'Chair' | 'Table' | 'Sofa' | 'Storage';
  link: string;
  tag?: string;
  originalPrice?: string;
  priceText: string;
  priceNumber: number;
  images: string[];
  rating: number;
  description: string;
  features?: string[];
  inStock: boolean;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatar: string;
}

export const CATEGORIES = [
  {
    name: 'Chair',
    slug: 'chair',
    count: '15+ Models',
    image: 'https://99grid.com/cdn/shop/collections/inner_banner_9a4ebf9c-3404-44a9-aa2e-3b525910393a_400x.png?v=1722598451',
    description: 'Ergonomic office seating for all-day focus and posture support'
  },
  {
    name: 'Table',
    slug: 'table',
    count: '15+ Models',
    image: 'https://99grid.com/cdn/shop/collections/indie_desk_c0de22cd-310d-4973-9795-48f68e5c7642_400x.jpg?v=1722598451',
    description: 'Motorized standing desks, executive tables & L-shaped setups'
  },
  {
    name: 'Sofa',
    slug: 'sofa',
    count: 'Collection',
    image: 'https://99grid.com/cdn/shop/collections/aeva_sofa_e3aab43d-84be-495f-8721-5c749f464fe2_400x.jpg?v=1722598451',
    description: 'Minimalist commercial lounge and reception sofas'
  },
  {
    name: 'Storage',
    slug: 'storage',
    count: 'Collection',
    image: 'https://99grid.com/cdn/shop/collections/credenza_ec4754ab-47f4-4414-90a5-59b31173436a_400x.png?v=1722598452',
    description: 'Credenzas, cabinets and modern organizer systems'
  }
];

export const CHAIR_PRODUCTS: Product[] = [
  {
    id: 'chair-1',
    title: 'GRID x Steelcase Leap',
    category: 'Chair',
    link: '/products/grid-x-steelcase-leap',
    originalPrice: 'Tk 180,000.00',
    priceText: 'from Tk 175,000.00',
    priceNumber: 175000,
    tag: 'Save Tk 5,000',
    images: [
      'https://99grid.com/cdn/shop/products/Leap_Black_Headrest_MedleyPepperBlack_Front_2000x_6c5956de-ee36-4152-8da4-54e5c4676140_600x.webp?v=1722596810',
      'https://99grid.com/cdn/shop/files/ergonomic-chair-review-the-steelcase-leap-main_600x.jpg?v=1722596813'
    ],
    rating: 5,
    description: 'The Steelcase Leap is renowned globally as the gold standard in ergonomic office seating with LiveBack technology and 4D armrests.',
    features: ['LiveBack Natural Spine Contouring', '4D Adjustable Armrests', 'Adjustable Lumbar Support', 'Pneumatic Seat Height Adjustment', '5 Years Warranty'],
    inStock: true
  },
  {
    id: 'chair-2',
    title: 'GRID x Steelcase Gesture Chair',
    category: 'Chair',
    link: '/products/gesture-chair',
    originalPrice: 'Tk 180,000.00',
    priceText: 'from Tk 175,000.00',
    priceNumber: 175000,
    tag: 'Save Tk 5,000',
    images: [
      'https://99grid.com/cdn/shop/products/steelcase_600x.jpg?v=1722596304',
      'https://99grid.com/cdn/shop/products/b2753438-244c-49ae-ba02-f4f2e280e4f6_600x.jpg?v=1722596307'
    ],
    rating: 5,
    description: 'Designed specifically for how people interact with modern mobile devices and computers today. 360-degree rotating armrests.',
    features: ['360-degree Gesture Arm Movement', 'Core Equalizer Weight Balancing', 'Breathable 3D Knit Fabric', 'Made in USA/Europe Grade', '5 Years Warranty'],
    inStock: true
  },
  {
    id: 'chair-3',
    title: 'GRID x Haworth Fern',
    category: 'Chair',
    link: '/products/grid-x-haworth-fern',
    priceText: 'Tk 150,000.00',
    priceNumber: 150000,
    images: [
      'https://99grid.com/cdn/shop/files/Fern-1-whitesweep-haworth_600x.jpg?v=1722596880',
      'https://99grid.com/cdn/shop/files/HaworthFernBlackEdition-2_600x.jpg?v=1722596883'
    ],
    rating: 5,
    description: 'Inspired by nature, Haworth Fern moves with you, not against you. Wave suspension system provides continuous back support.',
    features: ['Stem and Frond Inspired Flex Structure', 'Total Spinal Motion Tracking', 'Ultra-breathable Mesh Suspension', 'Aluminum Polished Base', '5 Years Warranty'],
    inStock: true
  },
  {
    id: 'chair-4',
    title: 'GRID x Steelcase Think Chair',
    category: 'Chair',
    link: '/products/grid-x-steelcase-think',
    originalPrice: 'Tk 110,000.00',
    priceText: 'from Tk 100,000.00',
    priceNumber: 100000,
    tag: 'Save Tk 10,000',
    images: [
      'https://99grid.com/cdn/shop/products/master_600x.jpg?v=1722596304',
      'https://99grid.com/cdn/shop/products/20-0140290_600x.jpg?v=1722596307'
    ],
    rating: 5,
    description: 'Think chair naturally understands how you sit and intuitively adapts to your body movements without manual knob adjustments.',
    features: ['Integrated LiveBack Spring Flexors', 'Weight-activated Mechanism', 'Sustainable Cradle to Cradle certified', 'Adjustable 3D Arms'],
    inStock: true
  },
  {
    id: 'chair-5',
    title: 'GRID Wau v2 Chair',
    category: 'Chair',
    link: '/products/grid-wau-v2',
    originalPrice: 'Tk 60,000.00',
    priceText: 'Tk 55,000.00',
    priceNumber: 55000,
    tag: 'Save Tk 5,000',
    images: [
      'https://99grid.com/cdn/shop/products/Untitled-1_d2a9e10c-fa67-40cb-9d40-744b9ed9e903_600x.jpg?v=1722596346',
      'https://99grid.com/cdn/shop/products/img_9144_hP59y8_600x.jpg?v=1722596348'
    ],
    rating: 5,
    description: 'Futuristic spinal exoskeleton chair with dual-pivot reclining system and breathable elastomer/mesh surface.',
    features: ['Dual-pivot Sync Recline', 'Height-adjustable Headrest', 'TPE / Mesh Ergonomic Back', 'Heavy-duty Metal Chassis'],
    inStock: true
  },
  {
    id: 'chair-6',
    title: 'GRID X Steelcase Personality Plus',
    category: 'Chair',
    link: '/products/grid-x-steelcase-personality-plus',
    originalPrice: 'Tk 53,000.00',
    priceText: 'from Tk 48,000.00',
    priceNumber: 48000,
    tag: 'Save Tk 5,000',
    images: [
      'https://99grid.com/cdn/shop/products/MARKETING_ECOM_PERSONALITYPLUS_HR_SEAGULL_AIRMESHLAGOON_OTTOLAGOON_R1_REN00_2000x_4e6caa75-afe7-47c6-a1ae-2ddf3a537b28_600x.webp?v=1722596809',
      'https://99grid.com/cdn/shop/products/fggfg_600x.jpg?v=1722596812'
    ],
    rating: 5,
    description: 'Comfort engineered by Steelcase with clean modern lines, responsive smart mesh back, and active lumbar support.',
    features: ['Smart Interlocking Mesh', 'Synchronized Tilting mechanism', 'Smooth Glide PU Wheels', 'Steelcase Quality Standards'],
    inStock: true
  },
  {
    id: 'chair-7',
    title: 'GRID Grand Master Chair',
    category: 'Chair',
    link: '/products/grid-grand-master-chair',
    originalPrice: 'Tk 45,000.00',
    priceText: 'Tk 42,000.00',
    priceNumber: 42000,
    tag: 'Save Tk 3,000',
    images: [
      'https://99grid.com/cdn/shop/products/grandmaster_600x.jpg?v=1722596162',
      'https://99grid.com/cdn/shop/products/20210731_171613_600x.jpg?v=1722596169'
    ],
    rating: 5,
    description: 'Executive ergonomics featuring Korean high-tensile mesh, dynamic lumbar compression, and multi-angle lock tilt.',
    features: ['Korean Mesh Fabric', 'Aluminum Alloy Wheel Base', 'Class 4 Gas Lift', '3 Years Free Servicing Warranty'],
    inStock: true
  },
  {
    id: 'chair-8',
    title: 'GRID ErgoFit Chair',
    category: 'Chair',
    link: '/products/grid-ergofit-chair',
    originalPrice: 'Tk 45,000.00',
    priceText: 'Tk 40,000.00',
    priceNumber: 40000,
    tag: 'Save Tk 5,000',
    images: [
      'https://99grid.com/cdn/shop/files/1_2_600x.jpg?v=1747572247',
      'https://99grid.com/cdn/shop/files/5_1_600x.jpg?v=1747572361'
    ],
    rating: 5,
    description: 'Engineered for long 12+ hour sitting sessions with targeted lower back support and soft PU 3D armrests.',
    features: ['Targeted Lumbar Curve', 'Multi-level Tilt Tension', 'High Elastic Mesh', 'Heavy-gauge Nylon Frame'],
    inStock: true
  },
  {
    id: 'chair-9',
    title: 'GRID Supero Chair',
    category: 'Chair',
    link: '/products/grid-supero-chair',
    originalPrice: 'Tk 45,000.00',
    priceText: 'Tk 40,000.00',
    priceNumber: 40000,
    tag: 'Save Tk 5,000',
    images: [
      'https://99grid.com/cdn/shop/files/j_600x.png?v=1722596448',
      'https://99grid.com/cdn/shop/products/S10G120L_BK_BK_01_Black_600x.jpg?v=1722596450'
    ],
    rating: 5,
    description: 'Sleek executive mesh chair with sculpted contours and premium smooth-glide casters.',
    features: ['Sculpted High-Back Design', 'Adjustable Head & Neck Cradle', 'Locking Recline 90-135°', '3 Years Warranty'],
    inStock: true
  },
  {
    id: 'chair-10',
    title: 'GRID Aeronn Chair',
    category: 'Chair',
    link: '/products/grid-aeronn-chair',
    originalPrice: 'Tk 35,000.00',
    priceText: 'from Tk 33,000.00',
    priceNumber: 33000,
    tag: 'Sold Out',
    images: [
      'https://99grid.com/cdn/shop/files/yhtytjytj_600x.png?v=1722596448',
      'https://99grid.com/cdn/shop/products/J17G120L_BK_02_Black_60ccd13f-386c-422d-be61-e4ca275aa45d_600x.webp?v=1722596450'
    ],
    rating: 5,
    description: 'Iconic mesh design offering superior temperature regulation and lumbar support.',
    features: ['All-Mesh Seat and Back', 'Pellicle Suspension Matrix', 'Forward Tilt Limiter', 'Pre-order Available'],
    inStock: false
  },
  {
    id: 'chair-11',
    title: 'GRID Work Master Chair',
    category: 'Chair',
    link: '/products/grid-work-master-chair',
    originalPrice: 'Tk 32,000.00',
    priceText: 'Tk 30,000.00',
    priceNumber: 30000,
    tag: 'Save Tk 2,000',
    images: [
      'https://99grid.com/cdn/shop/files/CM-B257AS_600x.jpg?v=1722596984',
      'https://99grid.com/cdn/shop/files/b1_600x.jpg?v=1722596991'
    ],
    rating: 5,
    description: 'The workhorse of modern startups and home offices. Durable, adjustable, and ergonomically balanced.',
    features: ['Breathable Core Mesh', 'Height Adjustable Armrests', 'Ergonomic Waterfall Seat Edge', 'Smooth 360 Swivel'],
    inStock: true
  },
  {
    id: 'chair-12',
    title: 'GRID Ergon Pro Chair',
    category: 'Chair',
    link: '/products/grid-ergon-pro-chair',
    originalPrice: 'Tk 35,000.00',
    priceText: 'Tk 30,000.00',
    priceNumber: 30000,
    tag: 'Save Tk 5,000',
    images: [
      'https://99grid.com/cdn/shop/products/ergonpro_600x.jpg?v=1722596161',
      'https://99grid.com/cdn/shop/products/20210731_171349-01_600x.jpg?v=1722596168'
    ],
    rating: 5,
    description: 'Optimized posture corrector chair with reinforced nylon spine and thick molded high-density foam seat cushion.',
    features: ['High-density Molded Foam', 'Reinforced Backbone Frame', 'Tilt Tension Regulation', 'BIFMA Certified Gas Lift'],
    inStock: true
  },
  {
    id: 'chair-13',
    title: 'GRID Swift Pro Chair',
    category: 'Chair',
    link: '/products/grid-swift-pro-chair',
    originalPrice: 'Tk 28,000.00',
    priceText: 'from Tk 27,000.00',
    priceNumber: 27000,
    tag: 'Save Tk 1,000',
    images: [
      'https://99grid.com/cdn/shop/files/sf_600x.jpg?v=1751968143',
      'https://99grid.com/cdn/shop/files/WhatsAppImage2024-11-26at19.14.57_600x.jpg?v=1751968143'
    ],
    rating: 5,
    description: 'Compact yet fully capable ergonomic chair ideal for study setups, workstation rows, and tech hubs.',
    features: ['Streamlined Modern Profile', 'Breathable Nylon Back', 'Quiet Floor-safe Casters', 'Free Delivery Dhaka'],
    inStock: true
  },
  {
    id: 'chair-14',
    title: 'GRID Swift Chair',
    category: 'Chair',
    link: '/products/grid-swift-chair',
    originalPrice: 'Tk 28,000.00',
    priceText: 'Tk 26,000.00',
    priceNumber: 26000,
    tag: 'Save Tk 2,000',
    images: [
      'https://99grid.com/cdn/shop/files/Untitled-1_13d14983-d53c-4cf7-b930-7550cda07676_600x.png?v=1722596984',
      'https://99grid.com/cdn/shop/files/WhatsAppImage2023-10-09at10.57.07PM_1_600x.jpg?v=1722596986'
    ],
    rating: 5,
    description: 'Clean Scandinavian aesthetic with curved ergonomic lumbar arch and whisper-quiet base.',
    features: ['Nordic Minimalist Lines', 'Strong Alloy Star Base', 'Padded Armrests', 'Fast Delivery inside Dhaka'],
    inStock: true
  },
  {
    id: 'chair-15',
    title: 'GRID Spine Chair',
    category: 'Chair',
    link: '/products/grid-spine-chair',
    originalPrice: 'Tk 28,000.00',
    priceText: 'Tk 25,000.00',
    priceNumber: 25000,
    tag: 'Save Tk 3,000',
    images: [
      'https://99grid.com/cdn/shop/files/split-chair-1_600x.jpg?v=1740410036',
      'https://99grid.com/cdn/shop/files/split-chair-2_600x.jpg?v=1740410036'
    ],
    rating: 5,
    description: 'Features a split back cushion that independently supports the left and right sides of your spine during micro movements.',
    features: ['Dual Split Spine Wing Cushions', 'Active Tilt Tension', 'Breathable Fabric', '3 Years Warranty'],
    inStock: true
  }
];

export const TABLE_PRODUCTS: Product[] = [
  {
    id: 'table-1',
    title: 'GRID Elevating Desk Pro L-Shape Table',
    category: 'Table',
    link: '/products/grid-elevating-l-shape-table',
    originalPrice: 'Tk 110,000.00',
    priceText: 'from Tk 95,000.00',
    priceNumber: 95000,
    tag: 'Save Tk 15,000',
    images: [
      'https://99grid.com/cdn/shop/files/ASFASF_600x.jpg?v=1722596880',
      'https://99grid.com/cdn/shop/files/6__73213.1639589206.1280.1280_1445x_627639a5-e8f5-410a-bfe3-e6616cfafcc2_600x.webp?v=1722596882'
    ],
    rating: 5,
    description: 'Triple-motor corner standing desk with spacious L-shape configuration and digital memory keypad.',
    features: ['Triple Motor Synchronization', 'Digital LED Controller with 4 Presets', 'Anti-collision Safety Sensor', '150kg Heavy Weight Capacity', '5 Years Frame Warranty'],
    inStock: true
  },
  {
    id: 'table-2',
    title: 'GRID Elevating Desk Pro (Dual Motor)',
    category: 'Table',
    link: '/products/grid-elevating-desk-pro',
    originalPrice: 'Tk 57,500.00',
    priceText: 'from Tk 52,500.00',
    priceNumber: 52500,
    tag: 'Save Tk 5,000',
    images: [
      'https://99grid.com/cdn/shop/files/two-leg_600x.jpg?v=1722596448',
      'https://99grid.com/cdn/shop/files/blackleg-2_600x.png?v=1722596473'
    ],
    rating: 5,
    description: 'Bangladesh\'s best-selling dual motor height adjustable desk. Smooth, quiet elevation with 4 memory height presets.',
    features: ['Dual Whisper Motors (<45dB)', 'Height Range: 62cm - 128cm', '4 Memory Preset Controller', '120kg Load Capacity', '5 Years Warranty'],
    inStock: true
  },
  {
    id: 'table-3',
    title: 'GRID Elevating Desk ( Single Motor )',
    category: 'Table',
    link: '/products/grid-elevating-desk',
    originalPrice: 'Tk 45,000.00',
    priceText: 'from Tk 40,500.00',
    priceNumber: 40500,
    tag: 'Save Tk 4,500',
    images: [
      'https://99grid.com/cdn/shop/files/main-web-file-elevatimg-1_600x.jpg?v=1722596034',
      'https://99grid.com/cdn/shop/products/2.1-min_600x.jpg?v=1722596037'
    ],
    rating: 5,
    description: 'Affordable motorized sit-to-stand desk. Sturdy carbon steel frame with scratch-resistant melamine top.',
    features: ['Smooth Electric Elevation', 'Up/Down Simple Controller', 'Sturdy T-frame Leg Support', 'Free Assembly in Dhaka'],
    inStock: true
  },
  {
    id: 'table-4',
    title: 'GRID Supreme Table',
    category: 'Table',
    link: '/products/grid',
    originalPrice: 'Tk 35,000.00',
    priceText: 'from Tk 30,000.00',
    priceNumber: 30000,
    tag: 'Save Tk 5,000',
    images: [
      'https://99grid.com/cdn/shop/files/WhatsAppImage2024-01-11at17.48.31_600x.jpg?v=1722596984',
      'https://99grid.com/cdn/shop/files/WhatsAppImage2024-01-11at17.48.46_600x.jpg?v=1722596986'
    ],
    rating: 5,
    description: 'Executive conference and workstation table featuring high-grade chamfered edges and concealed cable conduits.',
    features: ['Premium Chamfer Edge Finish', 'Concealed Cable Channel', 'Heavy Duty Powder Coated Legs', 'Seats 4-6 Comfortably'],
    inStock: true
  },
  {
    id: 'table-5',
    title: 'GRID Quad Desk Pro',
    category: 'Table',
    link: '/products/grid-quad-desk-pro',
    originalPrice: 'Tk 40,000.00',
    priceText: 'from Tk 30,000.00',
    priceNumber: 30000,
    tag: 'Save Tk 10,000',
    images: [
      'https://99grid.com/cdn/shop/files/5_ffc05569-5d68-4850-a323-ace1c6a2599c_600x.jpg?v=1722596958',
      'https://99grid.com/cdn/shop/files/7_600x.jpg?v=1722596962'
    ],
    rating: 5,
    description: 'Robust 4-leg frame workstation with built-in power strip tray and modular storage compatibility.',
    features: ['Reinforced 4-post Box Steel Legs', 'Under-desk Cable Raceway', 'Matte Textured Top', '3 Years Warranty'],
    inStock: true
  },
  {
    id: 'table-6',
    title: 'GRID Taskmaster Table',
    category: 'Table',
    link: '/products/grid-taskmaster-table',
    originalPrice: 'Tk 25,000.00',
    priceText: 'from Tk 22,000.00',
    priceNumber: 22000,
    tag: 'Save Tk 3,000',
    images: [
      'https://99grid.com/cdn/shop/files/2_908d75c0-ee71-4640-9251-1a01005f7ab3_600x.jpg?v=1722596882',
      'https://99grid.com/cdn/shop/files/1_fd41aa71-06e5-4eaa-ade6-f6b9c2f8c8c0_600x.png?v=1722596888'
    ],
    rating: 5,
    description: 'The definitive office desk for creators and engineers. Ample surface space with minimalist clean lines.',
    features: ['Spacious 5x2.5 ft Work Area', 'Industrial Strength Steel Legs', 'Scratch & Heat Resistant', 'Free Home Delivery inside Dhaka'],
    inStock: true
  },
  {
    id: 'table-7',
    title: 'GRID Levitating Standing Desk',
    category: 'Table',
    link: '/products/grid-levitating-desk',
    priceText: 'Tk 20,000.00',
    priceNumber: 20000,
    images: [
      'https://99grid.com/cdn/shop/products/GRID_3_600x.jpg?v=1628355617',
      'https://99grid.com/cdn/shop/products/GRID_3_ed990a73-90ab-4bcb-96a9-cf6f55b09935_600x.jpg?v=1629194169'
    ],
    rating: 5,
    description: 'Manual pneumatic counter-balance desk allowing effortless transition from sitting to standing within 2 seconds.',
    features: ['Gas-spring Assisted Lift', 'No Electricity Required', 'Infinite Height Lock positions', 'Compact Apartment Friendly'],
    inStock: true
  },
  {
    id: 'table-8',
    title: 'GRID Teakwood Table',
    category: 'Table',
    link: '/products/grid-teakwood-table',
    originalPrice: 'Tk 14,000.00',
    priceText: 'Tk 12,000.00',
    priceNumber: 12000,
    tag: 'Save Tk 2,000',
    images: [
      'https://99grid.com/cdn/shop/files/Untitled-1_1_600x.jpg?v=1723365220',
      'https://99grid.com/cdn/shop/files/shegun-table.jpg-3_600x.jpg?v=1723365220'
    ],
    rating: 5,
    description: 'Solid Burmese Teak / Shegun wood grain texture top paired with industrial matte black legs.',
    features: ['Authentic Natural Wood Grain', 'Eco-friendly Clear Lacquer Polish', 'Anti-wobble Adjustable Footpads'],
    inStock: true
  },
  {
    id: 'table-9',
    title: 'GRID Quad Desk',
    category: 'Table',
    link: '/products/grid-quad-desk',
    originalPrice: 'Tk 15,000.00',
    priceText: 'from Tk 12,000.00',
    priceNumber: 12000,
    tag: 'Save Tk 3,000',
    images: [
      'https://99grid.com/cdn/shop/products/quad-desk-grid_5464636b-3a7a-4884-b2ee-cef744b71791_600x.png?v=1722596228',
      'https://99grid.com/cdn/shop/products/1_600x.jpg?v=1722596230'
    ],
    rating: 5,
    description: 'Clean four-legged geometric profile table designed for sleek productivity and durable everyday use.',
    features: ['Minimalist Tube Steel Frame', 'Anti-scratch Surface', 'Easy 15-Minute Assembly'],
    inStock: true
  },
  {
    id: 'table-10',
    title: 'GRID Indie Desk - L Shape',
    category: 'Table',
    link: '/products/grid-indie-desk-l-shape',
    originalPrice: 'Tk 15,000.00',
    priceText: 'Tk 12,000.00',
    priceNumber: 12000,
    tag: 'Save Tk 3,000',
    images: [
      'https://99grid.com/cdn/shop/files/81cytyxtlwl_600x.png?v=1722595970',
      'https://99grid.com/cdn/shop/products/indie-L_600x.png?v=1722595974'
    ],
    rating: 5,
    description: 'Budget-friendly corner L-shape desk maximizing room corner real estate for dual monitors and paperwork.',
    features: ['Corner Fitting L-Layout', 'Reversible Left/Right Assembly', 'Heavy-gauge Steel Framing'],
    inStock: true
  },
  {
    id: 'table-11',
    title: 'GRID Indie Max Desk',
    category: 'Table',
    link: '/products/grid-indie-max-desk',
    originalPrice: 'Tk 12,000.00',
    priceText: 'from Tk 10,000.00',
    priceNumber: 10000,
    tag: 'Save Tk 2,000',
    images: [
      'https://99grid.com/cdn/shop/products/Indiemax2_600x.jpg?v=1722596303',
      'https://99grid.com/cdn/shop/products/indie-max_600x.png?v=1722596308'
    ],
    rating: 5,
    description: 'Spacious extended desktop width with integrated headphone hook and reinforced bracing.',
    features: ['Extended 4.5x2 ft Desk Space', 'Matte Oak or Walnut Finishes', 'Steel Reinforcement Bar'],
    inStock: true
  },
  {
    id: 'table-12',
    title: 'GRID Solid Shegun Wooden Table Top',
    category: 'Table',
    link: '/products/grid-solid-shegun-wooden-table-top',
    originalPrice: 'Tk 11,000.00',
    priceText: 'from Tk 9,000.00',
    priceNumber: 9000,
    tag: 'Save Tk 2,000',
    images: [
      'https://99grid.com/cdn/shop/files/pikaso_texttoimage_35mm-film-photography-Professional-product-photogr_600x.jpg?v=1722596810',
      'https://99grid.com/cdn/shop/files/3_1646ac7d-2ba0-47a0-a093-c92ae262291f_600x.jpg?v=1722596813'
    ],
    rating: 5,
    description: 'Standalone authentic solid Shegun teak wood slab crafted and beveled for motorized desk frames.',
    features: ['100% Seasoned Solid Shegun Wood', 'Treated against Pests & Moisture', 'Custom Dimension Options'],
    inStock: true
  },
  {
    id: 'table-13',
    title: 'GRID Convo Multiuse Table',
    category: 'Table',
    link: '/products/grid-convo-multiuse-table',
    originalPrice: 'Tk 10,000.00',
    priceText: 'from Tk 8,500.00',
    priceNumber: 8500,
    tag: 'Save Tk 1,500',
    images: [
      'https://99grid.com/cdn/shop/products/1_5efaaf05-bc87-438b-9101-62f73609c445_600x.png?v=1722596859',
      'https://99grid.com/cdn/shop/products/6_00b55338-a346-4d84-9abd-23cb2d8c29c4_600x.png?v=1722596865'
    ],
    rating: 5,
    description: 'Versatile multi-utility table ideal as a laptop desk, dining surface, or creative workstation.',
    features: ['Multi-functional Compact Design', 'Quick Folding / Assembling', 'Lightweight & Sturdy'],
    inStock: true
  },
  {
    id: 'table-14',
    title: 'GRID Indie Desk',
    category: 'Table',
    link: '/products/grid-indie-desk',
    originalPrice: 'Tk 10,000.00',
    priceText: 'from Tk 8,500.00',
    priceNumber: 8500,
    tag: 'Save Tk 1,500',
    images: [
      'https://99grid.com/cdn/shop/products/image_2021-06-23_204358_600x.png?v=1722595911',
      'https://99grid.com/cdn/shop/products/image_2021-06-23_204432_600x.png?v=1722595914'
    ],
    rating: 5,
    description: 'The original iconic Indie Desk that started it all. Minimal, solid, and timeless.',
    features: ['Compact Footprint', 'Fast Delivery inside Dhaka within 3 Days', 'High Durability Surface'],
    inStock: true
  },
  {
    id: 'table-15',
    title: 'GRID Layer Table',
    category: 'Table',
    link: '/products/grid-layer-table-1',
    priceText: 'Tk 6,500.00',
    priceNumber: 6500,
    images: [
      'https://99grid.com/cdn/shop/files/4_eeb6fd2e-3b8d-40c3-afde-2f6dc23f2d43_600x.png?v=1722596991',
      'https://99grid.com/cdn/shop/files/3_e516e43b-bd60-4aec-baa7-fe363b39ef34_600x.png?v=1722596998'
    ],
    rating: 5,
    description: 'Tiered multi-level shelf table providing designated storage for books, tablet, and stationery.',
    features: ['Upper Monitor / Accessory Tier', 'Lower Workspace Clearance', 'Modern Matte Finish'],
    inStock: true
  }
];

export const ALL_PRODUCTS = [...CHAIR_PRODUCTS, ...TABLE_PRODUCTS];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Raisul Kabir',
    role: 'MD',
    company: 'Brainstation 23',
    quote: 'They have a very well behaved and professional customer service.',
    rating: 5,
    avatar: 'https://99grid.com/cdn/shop/files/Capture_200x.jpg?v=1652958741'
  },
  {
    name: 'Adnan Imtiaz Halim',
    role: 'CEO',
    company: 'Sheba.xyz',
    quote: 'Needed comfortable chairs for my office. Grid provided the best quality chairs on our budget.',
    rating: 5,
    avatar: 'https://99grid.com/cdn/shop/files/images_200x.jpg?v=1652958644'
  },
  {
    name: 'Jubayer Talukder',
    role: 'Youtube Content Creator',
    company: 'Tech Studio',
    quote: 'Really pleased with the after sale service. Got my product assembled in one day !',
    rating: 5,
    avatar: 'https://99grid.com/cdn/shop/files/Jubaer-Talukdar_200x.png?v=1652958798'
  },
  {
    name: 'Abdullah Zidan',
    role: 'Student & Creator',
    company: 'Dhaka',
    quote: 'Great quality and fast delivery ! totally recomended.',
    rating: 5,
    avatar: 'https://99grid.com/cdn/shop/files/abdullah_200x.jpg?v=1645264634'
  },
  {
    name: 'Shohag',
    role: 'Youtube Content Creator',
    company: 'Soag360',
    quote: 'Grid will always be my first choice for my studio setup.',
    rating: 5,
    avatar: 'https://99grid.com/cdn/shop/files/download_200x.jpg?v=1652958975'
  }
];

export const COMPANY_LOGOS = [
  { name: 'Partner 1', url: 'https://99grid.com/cdn/shop/files/Untitled-1_300x.png?v=1762632693' },
  { name: 'H&M', url: 'https://99grid.com/cdn/shop/files/hm_300x.png?v=1762632715' },
  { name: 'UNHCR', url: 'https://99grid.com/cdn/shop/files/unchr_300x.png?v=1762632734' },
  { name: '10 Minute School', url: 'https://99grid.com/cdn/shop/files/10-min_300x.png?v=1762632750' },
  { name: 'IDLC', url: 'https://99grid.com/cdn/shop/files/idlc_8adbe2a0-02ac-4ec3-a0bf-e4ea054b4ff0_300x.png?v=1762632825' },
  { name: 'Rangs', url: 'https://99grid.com/cdn/shop/files/rangs_300x.png?v=1762632843' },
  { name: 'Samsung', url: 'https://99grid.com/cdn/shop/files/sam_300x.png?v=1762632860' },
  { name: 'Standard Chartered', url: 'https://99grid.com/cdn/shop/files/standard_300x.png?v=1762632879' },
  { name: 'ACI', url: 'https://99grid.com/cdn/shop/files/aci_300x.png?v=1762632903' },
  { name: 'UNDP', url: 'https://99grid.com/cdn/shop/files/un-das_300x.png?v=1762632922' }
];

export const FOOTER_PROMOTIONS = [
  {
    title: 'Exceptional Furniture For The Taskmasters',
    text: 'We founded GRID: to make it easy for teams of all sizes to create an office you love. We sell direct, so our collection costs half as much as premium furniture of comparable quality.',
    image: 'https://99grid.com/cdn/shop/files/Group_834_600x.png?v=1633346197'
  },
  {
    title: 'Ergonomic Design',
    text: 'Enjoy stylish and ergonomic work seating for every budget, from the home office to the open office. Durable, adjustable and built to inspire: make your office feel like home with contract-grade desks & chairs from GRID Furniture.',
    image: 'https://99grid.com/cdn/shop/files/ASDASDA_600x.jpg?v=1652694147'
  },
  {
    title: 'Wherever you are, work your best.',
    text: 'Our breathable mesh material provides an optimal air flow to avoid sweating and sticking, keep air circulation for extra comfy, and the mesh office chair resists abrasion and transformation.',
    image: 'https://99grid.com/cdn/shop/files/5A2A5635_600x.jpg?v=1613715225'
  }
];

export const VALUE_PROPOSITIONS = [
  {
    title: 'Free Delivery',
    description: 'FREE home delivery with assembly inside Dhaka within 3 working days. Delivery anywhere in Bangladesh takes 5-7 working days with delivery charge.'
  },
  {
    title: 'Returns & Warranty',
    description: 'GRID provides an easy, hassle-free servicing system where we pick up your product from your home if there is any problem and get it back to you.'
  },
  {
    title: 'EMI Policy',
    description: 'To avail EMI, Place your order through Website and share your order ID in our Inbox. We will share the EMI payment link.'
  }
];
