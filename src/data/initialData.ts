import { Property, Lead, SiteVisit, Enquiry, User, NotificationItem } from '../types/index.ts';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-lunar-oasis',
    title: 'Lunar Oasis Villa',
    slug: 'lunar-oasis-villa',
    tagline: 'Futuristic Curvilinear Desert Sanctuary',
    description: 'This futuristic villa seamlessly blends into the desert environment, offering a modern, flowing space with panoramic desert views. Its innovative design makes it a perfect luxury getaway. Featuring expansive curved floor-to-ceiling thermal glass, a private thermal infinity lagoon, and bespoke sculptural interiors by renowned architectural masters.',
    price: 3500000,
    originalPrice: 3750000,
    pricePerSqFt: 468,
    listingType: 'buy',
    propertyType: 'Villa',
    status: 'available',
    address: '1874 Forest Haven Rd',
    locality: 'Paradise Valley Foothills',
    city: 'Scottsdale',
    state: 'Arizona',
    country: 'United States',
    coordinates: {
      lat: 33.5387,
      lng: -111.9427,
    },
    nearbyLandmarks: [
      { name: 'Scottsdale Private Jet Airport', distance: '12 min drive', type: 'airport' },
      { name: 'Camelback Mountain Trail', distance: '5 min walk', type: 'metro' },
      { name: 'The Phoenician Luxury Resort', distance: '8 min drive', type: 'shopping' },
      { name: 'Mayo Clinic Health Campus', distance: '15 min drive', type: 'hospital' }
    ],
    areaSqM: 695,
    areaSqFt: 7480,
    carpetAreaSqFt: 6250,
    builtUpAreaSqFt: 7480,
    yardSqM: 126,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 3,
    floorNumber: 1,
    totalFloors: 2,
    facingDirection: 'South-East',
    furnishingStatus: 'Furnished',
    possessionStatus: 'Ready to Move',
    propertyAgeYears: 1,
    featuredImage: '/src/assets/images/hero_lunar_villa_1794834327790.jpg',
    galleryImages: [
      '/src/assets/images/hero_lunar_villa_1794834327790.jpg',
      '/src/assets/images/estate_forest_haven_1794834330281.jpg',
      '/src/assets/images/penthouse_skyline_glass_1794834329656.jpg',
      '/src/assets/images/villa_coastal_horizon_1794834329508.jpg'
    ],
    floorPlans: [
      {
        title: 'Ground Level & Terrace Pavilion',
        bedrooms: 2,
        bathrooms: 1,
        areaSqFt: 4200,
        imageUrl: '/src/assets/images/hero_lunar_villa_1794834327790.jpg'
      },
      {
        title: 'Upper Master Suite & Stargazing Lounge',
        bedrooms: 1,
        bathrooms: 1,
        areaSqFt: 3280,
        imageUrl: '/src/assets/images/penthouse_skyline_glass_1794834329656.jpg'
      }
    ],
    virtualTourUrl: 'https://my.matterport.com/show/?m=sample-lunar-oasis',
    videoUrl: 'https://www.youtube.com/watch?v=sample-lunar',
    amenities: [
      'Private Infinity Pool',
      'Panoramic Mountain Views',
      'Smart Home Automation',
      'Solar Energy Storage',
      'EV Supercharger',
      'Wine Cellar & Tasting Room',
      'Integrated Sound Architecture',
      'Private Security Perimeter'
    ],
    isFeatured: true,
    isVerified: true,
    isTrending: true,
    viewCount: 14820,
    likesCount: 4400,
    savesCount: 157,
    agent: {
      id: 'agent-marcus',
      name: 'Marcus Vance',
      email: 'm.vance@aurarealestate.com',
      phone: '+1 (480) 555-0192',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      agency: 'Aura Prime Estates',
      rating: 4.96,
      reviewCount: 48
    },
    listedDate: '2026-10-10',
    lastUpdatedDate: '2026-11-14',
    priceHistory: [
      { date: '2026-10-10', price: 3750000, event: 'Listed on Marketplace' },
      { date: '2026-11-01', price: 3500000, event: 'Special Price Adjustment (-$250k)' }
    ]
  },
  {
    id: 'prop-horizon-cliff',
    title: 'Horizon Cliff Sanctuary',
    slug: 'horizon-cliff-sanctuary',
    tagline: 'Cantilevered Pacific Oceanfront Villa',
    description: 'Perched dramatic 200 feet above the crashing Pacific surf on the iconic Big Sur coast, Horizon Cliff Sanctuary represents the pinnacle of modern organic architecture. Floor-to-ceiling glass pavilions open seamlessly to a heated cantilevered infinity pool, fire terrace, and endless marine sunsets.',
    price: 6800000,
    originalPrice: 6800000,
    pricePerSqFt: 829,
    listingType: 'buy',
    propertyType: 'Villa',
    status: 'available',
    address: '44820 Highway 1',
    locality: 'Coastline Ridges',
    city: 'Big Sur',
    state: 'California',
    country: 'United States',
    coordinates: {
      lat: 36.2704,
      lng: -121.8081,
    },
    nearbyLandmarks: [
      { name: 'Monterey Regional Airport', distance: '35 min drive', type: 'airport' },
      { name: 'Pfeiffer Beach Reserve', distance: '6 min drive', type: 'beach' },
      { name: 'Post Ranch Inn Fine Dining', distance: '4 min drive', type: 'shopping' }
    ],
    areaSqM: 762,
    areaSqFt: 8200,
    carpetAreaSqFt: 7100,
    builtUpAreaSqFt: 8200,
    yardSqM: 350,
    bedrooms: 5,
    bathrooms: 6,
    parkingSpaces: 4,
    floorNumber: 1,
    totalFloors: 3,
    facingDirection: 'West',
    furnishingStatus: 'Furnished',
    possessionStatus: 'Ready to Move',
    propertyAgeYears: 0,
    featuredImage: '/src/assets/images/villa_coastal_horizon_1794834329508.jpg',
    galleryImages: [
      '/src/assets/images/villa_coastal_horizon_1794834329508.jpg',
      '/src/assets/images/hero_lunar_villa_1794834327790.jpg',
      '/src/assets/images/penthouse_skyline_glass_1794834329656.jpg'
    ],
    floorPlans: [
      {
        title: 'Pacific Oceanfront Promenade Level',
        bedrooms: 3,
        bathrooms: 3,
        areaSqFt: 4500,
        imageUrl: '/src/assets/images/villa_coastal_horizon_1794834329508.jpg'
      }
    ],
    amenities: [
      'Cantilevered Infinity Pool',
      'Direct Private Beach Trail',
      'Outdoor Fire Pit Pavilion',
      'Chef Kitchen with Gaggenau Appliances',
      'Private Wellness Spa & Sauna',
      'Helipad Access Nearby'
    ],
    isFeatured: true,
    isVerified: true,
    isTrending: true,
    viewCount: 11450,
    likesCount: 3120,
    savesCount: 124,
    agent: {
      id: 'agent-elena',
      name: 'Elena Rostova',
      email: 'e.rostova@aurarealestate.com',
      phone: '+1 (310) 555-8931',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      agency: 'Aura Coastal & Luxury',
      rating: 4.98,
      reviewCount: 62
    },
    listedDate: '2026-10-18',
    lastUpdatedDate: '2026-11-12',
    priceHistory: [
      { date: '2026-10-18', price: 6800000, event: 'Listed exclusively' }
    ]
  },
  {
    id: 'prop-aurelia-penthouse',
    title: 'The Aurelia Glass Penthouse',
    slug: 'the-aurelia-glass-penthouse',
    tagline: 'Duplex Crown with 360° Skyline Panorama',
    description: 'Occupying the uppermost two stories of Manhattan’s most sought-after contemporary glass tower, The Aurelia delivers 6,100 square feet of curated grandeur. Double-height 24-foot ceilings frame unobstructed views of Central Park, the Hudson River, and the gleaming city skyline.',
    price: 11250000,
    originalPrice: 11500000,
    pricePerSqFt: 1844,
    listingType: 'buy',
    propertyType: 'Penthouse',
    status: 'available',
    address: '111 West 57th Street, Penthouse 72',
    locality: 'Midtown Billionaires Row',
    city: 'New York',
    state: 'New York',
    country: 'United States',
    coordinates: {
      lat: 40.7648,
      lng: -73.9772,
    },
    nearbyLandmarks: [
      { name: 'Central Park South Gate', distance: '1 min walk', type: 'beach' },
      { name: 'Lincoln Center for the Arts', distance: '8 min walk', type: 'school' },
      { name: 'JFK International Airport', distance: '45 min drive', type: 'airport' }
    ],
    areaSqM: 567,
    areaSqFt: 6100,
    carpetAreaSqFt: 5400,
    builtUpAreaSqFt: 6100,
    yardSqM: 80,
    bedrooms: 4,
    bathrooms: 5,
    parkingSpaces: 2,
    floorNumber: 72,
    totalFloors: 73,
    facingDirection: 'North-East',
    furnishingStatus: 'Furnished',
    possessionStatus: 'Ready to Move',
    propertyAgeYears: 2,
    featuredImage: '/src/assets/images/penthouse_skyline_glass_1794834329656.jpg',
    galleryImages: [
      '/src/assets/images/penthouse_skyline_glass_1794834329656.jpg',
      '/src/assets/images/hero_lunar_villa_1794834327790.jpg'
    ],
    amenities: [
      'Private High-Speed Elevator',
      'Floating Architectural Staircase',
      '24/7 White-Glove Concierge',
      'Temperature Controlled Wine Vault',
      'Indoor Lap Pool & Spa Center',
      'Valet Parking with Car Lift'
    ],
    isFeatured: true,
    isVerified: true,
    isTrending: false,
    viewCount: 19800,
    likesCount: 5210,
    savesCount: 289,
    agent: {
      id: 'agent-marcus',
      name: 'Marcus Vance',
      email: 'm.vance@aurarealestate.com',
      phone: '+1 (480) 555-0192',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      agency: 'Aura Prime Estates',
      rating: 4.96,
      reviewCount: 48
    },
    listedDate: '2026-09-24',
    lastUpdatedDate: '2026-11-10',
    priceHistory: [
      { date: '2026-09-24', price: 11500000, event: 'Listed on Marketplace' },
      { date: '2026-10-15', price: 11250000, event: 'Price Improvement' }
    ]
  },
  {
    id: 'prop-alpine-haven',
    title: 'Alpine Pine Pavilion',
    slug: 'alpine-pine-pavilion',
    tagline: 'Modern Organic Mountain Sanctuary',
    description: 'Surrounded by towering pines and rugged Rocky Mountain peaks, Alpine Pine Pavilion pairs raw local granite and blackened cedar with cutting-edge cantilevered architectural design. Features a warm central hearth, radiant heated stone floors, and expansive outdoor decks with panoramic alpine views.',
    price: 8400000,
    originalPrice: 8400000,
    pricePerSqFt: 1175,
    listingType: 'buy',
    propertyType: 'Mansion',
    status: 'available',
    address: '710 Red Mountain Road',
    locality: 'Red Mountain Estate Enclave',
    city: 'Aspen',
    state: 'Colorado',
    country: 'United States',
    coordinates: {
      lat: 39.1911,
      lng: -106.8175,
    },
    nearbyLandmarks: [
      { name: 'Aspen Mountain Silver Queen Gondola', distance: '7 min drive', type: 'metro' },
      { name: 'Aspen/Pitkin County Airport', distance: '12 min drive', type: 'airport' },
      { name: 'Hotel Jerome & Downtown Boutiques', distance: '8 min drive', type: 'shopping' }
    ],
    areaSqM: 664,
    areaSqFt: 7150,
    carpetAreaSqFt: 6200,
    builtUpAreaSqFt: 7150,
    yardSqM: 650,
    bedrooms: 5,
    bathrooms: 6,
    parkingSpaces: 4,
    floorNumber: 1,
    totalFloors: 2,
    facingDirection: 'South',
    furnishingStatus: 'Furnished',
    possessionStatus: 'Ready to Move',
    propertyAgeYears: 1,
    featuredImage: '/src/assets/images/estate_forest_haven_1794834330281.jpg',
    galleryImages: [
      '/src/assets/images/estate_forest_haven_1794834330281.jpg',
      '/src/assets/images/hero_lunar_villa_1794834327790.jpg'
    ],
    amenities: [
      'Ski-in / Ski-out Access',
      'Dual Outdoor Heated Spas',
      'Custom Granite Hearth Fireplaces',
      'Private Cinema & Game Suite',
      'Wine Tasting Grotto',
      'Heated Driveway & Courtyard'
    ],
    isFeatured: true,
    isVerified: true,
    isTrending: true,
    viewCount: 8940,
    likesCount: 2790,
    savesCount: 98,
    agent: {
      id: 'agent-elena',
      name: 'Elena Rostova',
      email: 'e.rostova@aurarealestate.com',
      phone: '+1 (310) 555-8931',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      agency: 'Aura Mountain Properties',
      rating: 4.98,
      reviewCount: 62
    },
    listedDate: '2026-10-05',
    lastUpdatedDate: '2026-11-15',
    priceHistory: [
      { date: '2026-10-05', price: 8400000, event: 'Listed on Marketplace' }
    ]
  },
  {
    id: 'prop-apex-commercial',
    title: 'The Apex Corporate Suite',
    slug: 'the-apex-corporate-suite',
    tagline: 'Biophilic Architectural Sky Headquarters',
    description: 'A revolutionary office suite situated in Miami’s premier LEED Platinum futuristic glass tower. Offering sweeping skyline views, double-height biophilic indoor trees, integrated fiber grid, and an exclusive private outdoor sky terrace overlooking Biscayne Bay.',
    price: 24000, // Monthly Rent
    originalPrice: 26000,
    pricePerSqFt: 4,
    listingType: 'rent',
    propertyType: 'Commercial',
    status: 'available',
    address: '801 Brickell Avenue, 34th Floor',
    locality: 'Brickell Financial District',
    city: 'Miami',
    state: 'Florida',
    country: 'United States',
    coordinates: {
      lat: 25.7617,
      lng: -80.1918,
    },
    nearbyLandmarks: [
      { name: 'Miami International Airport', distance: '18 min drive', type: 'airport' },
      { name: 'Brickell City Centre Mall', distance: '3 min walk', type: 'shopping' },
      { name: 'Metromover Financial Station', distance: '1 min walk', type: 'metro' }
    ],
    areaSqM: 501,
    areaSqFt: 5400,
    carpetAreaSqFt: 4800,
    builtUpAreaSqFt: 5400,
    yardSqM: 110,
    bedrooms: 0,
    bathrooms: 4,
    parkingSpaces: 6,
    floorNumber: 34,
    totalFloors: 54,
    facingDirection: 'East',
    furnishingStatus: 'Furnished',
    possessionStatus: 'Ready to Move',
    propertyAgeYears: 0,
    featuredImage: '/src/assets/images/commercial_tower_apex_1794834329929.jpg',
    galleryImages: [
      '/src/assets/images/commercial_tower_apex_1794834329929.jpg',
      '/src/assets/images/penthouse_skyline_glass_1794834329656.jpg'
    ],
    amenities: [
      'Private Landscaped Sky Terrace',
      'Ultra High-Speed Dedicated Fiber',
      'Executive Boardroom with Video Wall',
      '24/7 Biometric Access Security',
      'Direct Heliport Access Option',
      'On-site Fine Dining & Club'
    ],
    isFeatured: true,
    isVerified: true,
    isTrending: false,
    viewCount: 6520,
    likesCount: 1420,
    savesCount: 64,
    agent: {
      id: 'agent-marcus',
      name: 'Marcus Vance',
      email: 'm.vance@aurarealestate.com',
      phone: '+1 (480) 555-0192',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      agency: 'Aura Commercial Capital',
      rating: 4.96,
      reviewCount: 48
    },
    listedDate: '2026-10-25',
    lastUpdatedDate: '2026-11-08',
    priceHistory: [
      { date: '2026-10-25', price: 26000, event: 'Listed for Rent' },
      { date: '2026-11-05', price: 24000, event: 'Lease rate reduced' }
    ]
  },
  {
    id: 'prop-desert-zen',
    title: 'Solstice Desert Villa',
    slug: 'solstice-desert-villa',
    tagline: 'Sculptural Modern Residence in Red Rock Valley',
    description: 'A striking minimalist residence inspired by the undulating red rock canyons of Sedona. Crafted with rammed earth, structural glass walls, and a quiet reflecting pool that brings the natural desert peace indoors.',
    price: 18500, // Monthly Rent
    originalPrice: 18500,
    pricePerSqFt: 4,
    listingType: 'rent',
    propertyType: 'Villa',
    status: 'available',
    address: '320 Boynton Canyon Way',
    locality: 'Boynton Canyon',
    city: 'Sedona',
    state: 'Arizona',
    country: 'United States',
    coordinates: {
      lat: 34.8697,
      lng: -111.7610,
    },
    nearbyLandmarks: [
      { name: 'Sedona Airport Lookout', distance: '14 min drive', type: 'airport' },
      { name: 'Red Rock State Park', distance: '10 min drive', type: 'beach' }
    ],
    areaSqM: 420,
    areaSqFt: 4520,
    carpetAreaSqFt: 3900,
    builtUpAreaSqFt: 4520,
    yardSqM: 200,
    bedrooms: 3,
    bathrooms: 3,
    parkingSpaces: 2,
    floorNumber: 1,
    totalFloors: 1,
    facingDirection: 'South-West',
    furnishingStatus: 'Furnished',
    possessionStatus: 'Ready to Move',
    propertyAgeYears: 1,
    featuredImage: '/src/assets/images/hero_lunar_villa_1794834327790.jpg',
    galleryImages: [
      '/src/assets/images/hero_lunar_villa_1794834327790.jpg',
      '/src/assets/images/villa_coastal_horizon_1794834329508.jpg'
    ],
    amenities: [
      'Reflecting Pool & Meditation Deck',
      'Outdoor Stargazing Shower',
      'Photovoltaic Solar Power',
      'Organic Herb Garden',
      'High-Speed Satellite Internet'
    ],
    isFeatured: false,
    isVerified: true,
    isTrending: true,
    viewCount: 7890,
    likesCount: 2210,
    savesCount: 110,
    agent: {
      id: 'agent-marcus',
      name: 'Marcus Vance',
      email: 'm.vance@aurarealestate.com',
      phone: '+1 (480) 555-0192',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      agency: 'Aura Prime Estates',
      rating: 4.96,
      reviewCount: 48
    },
    listedDate: '2026-11-01',
    lastUpdatedDate: '2026-11-14',
    priceHistory: [
      { date: '2026-11-01', price: 18500, event: 'Listed for Rent' }
    ]
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    customerName: 'Jonathan Sterling',
    email: 'j.sterling@sterlingcap.com',
    phone: '+1 (415) 555-0184',
    propertyId: 'prop-lunar-oasis',
    propertyTitle: 'Lunar Oasis Villa',
    budgetMin: 3000000,
    budgetMax: 4000000,
    preferredLocation: 'Scottsdale / Phoenix',
    preferredType: 'Villa',
    leadSource: 'website_enquiry',
    status: 'site_visit_scheduled',
    priority: 'high',
    assignedAgentId: 'agent-marcus',
    assignedAgentName: 'Marcus Vance',
    notes: [
      {
        id: 'n1',
        author: 'Marcus Vance',
        content: 'Buyer is pre-approved for $4.5M cash purchase. Expressed keen interest in the solar grid and private wellness pavilion.',
        createdAt: '2026-11-14 14:30'
      }
    ],
    followUpDate: '2026-11-18',
    createdAt: '2026-11-12',
    updatedAt: '2026-11-14'
  },
  {
    id: 'lead-2',
    customerName: 'Sophia Lin-Chen',
    email: 'sophia@linchengroup.hk',
    phone: '+1 (212) 555-0149',
    propertyId: 'prop-aurelia-penthouse',
    propertyTitle: 'The Aurelia Glass Penthouse',
    budgetMin: 10000000,
    budgetMax: 12500000,
    preferredLocation: 'Manhattan, New York',
    preferredType: 'Penthouse',
    leadSource: 'whatsapp',
    status: 'negotiation',
    priority: 'high',
    assignedAgentId: 'agent-marcus',
    assignedAgentName: 'Marcus Vance',
    notes: [
      {
        id: 'n2',
        author: 'Marcus Vance',
        content: 'Reviewing deed restrictions and private elevator keycard protocol with buyer counsel.',
        createdAt: '2026-11-15 09:15'
      }
    ],
    followUpDate: '2026-11-19',
    createdAt: '2026-11-08',
    updatedAt: '2026-11-15'
  },
  {
    id: 'lead-3',
    customerName: 'David K. Morrison',
    email: 'david@morrisondesign.io',
    phone: '+1 (310) 555-0199',
    propertyId: 'prop-horizon-cliff',
    propertyTitle: 'Horizon Cliff Sanctuary',
    budgetMin: 6000000,
    budgetMax: 7000000,
    preferredLocation: 'California Coast',
    preferredType: 'Villa',
    leadSource: 'site_visit',
    status: 'site_visit_completed',
    priority: 'medium',
    assignedAgentId: 'agent-elena',
    assignedAgentName: 'Elena Rostova',
    notes: [
      {
        id: 'n3',
        author: 'Elena Rostova',
        content: 'Completed on-site walkthrough on Nov 13. Loved the cantilevered pool; reviewing HOA guidelines.',
        createdAt: '2026-11-13 17:00'
      }
    ],
    followUpDate: '2026-11-20',
    createdAt: '2026-11-10',
    updatedAt: '2026-11-13'
  }
];

export const INITIAL_SITE_VISITS: SiteVisit[] = [
  {
    id: 'sv-101',
    propertyId: 'prop-lunar-oasis',
    propertyTitle: 'Lunar Oasis Villa',
    propertyImage: '/src/assets/images/hero_lunar_villa_1794834327790.jpg',
    propertyAddress: '1874 Forest Haven Rd, Scottsdale, AZ',
    userId: 'user-customer-1',
    userName: 'Jonathan Sterling',
    userEmail: 'j.sterling@sterlingcap.com',
    userPhone: '+1 (415) 555-0184',
    agentId: 'agent-marcus',
    agentName: 'Marcus Vance',
    date: '2026-11-18',
    timeSlot: '11:00 AM - 12:30 PM',
    visitType: 'in_person',
    status: 'confirmed',
    notes: 'Buyer requests meeting directly at private front gate.',
    createdAt: '2026-11-12'
  },
  {
    id: 'sv-102',
    propertyId: 'prop-alpine-haven',
    propertyTitle: 'Alpine Pine Pavilion',
    propertyImage: '/src/assets/images/estate_forest_haven_1794834330281.jpg',
    propertyAddress: '710 Red Mountain Road, Aspen, CO',
    userId: 'user-customer-1',
    userName: 'Jonathan Sterling',
    userEmail: 'j.sterling@sterlingcap.com',
    userPhone: '+1 (415) 555-0184',
    agentId: 'agent-elena',
    agentName: 'Elena Rostova',
    date: '2026-11-24',
    timeSlot: '02:00 PM - 03:30 PM',
    visitType: 'virtual',
    status: 'confirmed',
    notes: 'Virtual live walkthrough over HD camera.',
    createdAt: '2026-11-15'
  }
];

export const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-1',
    propertyId: 'prop-lunar-oasis',
    propertyTitle: 'Lunar Oasis Villa',
    propertyImage: '/src/assets/images/hero_lunar_villa_1794834327790.jpg',
    userId: 'user-customer-1',
    customerName: 'Jonathan Sterling',
    customerEmail: 'j.sterling@sterlingcap.com',
    customerPhone: '+1 (415) 555-0184',
    message: 'Interested in making an initial offer. Does the property include current custom Italian furnishings?',
    preferredContact: 'phone',
    status: 'contacted',
    createdAt: '2026-11-12 10:14'
  },
  {
    id: 'enq-2',
    propertyId: 'prop-apex-commercial',
    propertyTitle: 'The Apex Corporate Suite',
    propertyImage: '/src/assets/images/commercial_tower_apex_1794834329929.jpg',
    customerName: 'Amara Vance',
    customerEmail: 'amara@vantis.co',
    customerPhone: '+1 (305) 555-4421',
    message: 'Seeking a 3-year commercial lease for our technology consultancy starting January 2027.',
    preferredContact: 'email',
    status: 'new',
    createdAt: '2026-11-16 08:30'
  }
];

export const DEMO_USERS: User[] = [
  {
    id: 'user-customer-1',
    name: 'Alexander Cross',
    email: 'alexander@aura-client.com',
    phone: '+1 (415) 555-7821',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'customer',
    createdAt: '2026-09-01'
  },
  {
    id: 'agent-marcus',
    name: 'Marcus Vance',
    email: 'm.vance@aurarealestate.com',
    phone: '+1 (480) 555-0192',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'agent',
    createdAt: '2026-08-15'
  },
  {
    id: 'user-admin-1',
    name: 'Victoria Sterling',
    email: 'admin@aurarealestate.com',
    phone: '+1 (212) 555-9988',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    createdAt: '2026-08-01'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    targetRole: 'customer',
    title: 'Site Visit Confirmed',
    message: 'Your in-person visit to Lunar Oasis Villa is scheduled for Nov 18 at 11:00 AM.',
    type: 'site_visit',
    link: '#dashboard-visits',
    isRead: false,
    createdAt: '2026-11-15'
  },
  {
    id: 'notif-2',
    targetRole: 'customer',
    title: 'Price Drop Alert',
    message: 'Lunar Oasis Villa just dropped price by $250,000!',
    type: 'price_drop',
    link: '#property-prop-lunar-oasis',
    isRead: false,
    createdAt: '2026-11-01'
  },
  {
    id: 'notif-3',
    targetRole: 'admin',
    title: 'New High-Value Lead',
    message: 'Jonathan Sterling submitted an enquiry on Lunar Oasis Villa ($3.5M).',
    type: 'lead',
    link: '#admin-leads',
    isRead: false,
    createdAt: '2026-11-12'
  }
];
