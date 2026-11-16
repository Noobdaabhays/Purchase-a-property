export type PropertyType = 'Villa' | 'Apartment' | 'Penthouse' | 'Mansion' | 'Independent House' | 'Commercial' | 'Plot';

export type ListingType = 'buy' | 'rent';

export type PropertyStatus = 'available' | 'under_offer' | 'sold' | 'rented';

export interface PropertyAmenity {
  id: string;
  name: string;
  icon?: string;
}

export interface FloorPlan {
  title: string;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  imageUrl: string;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  event: string;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  pricePerSqFt: number;
  listingType: ListingType;
  propertyType: PropertyType;
  status: PropertyStatus;
  
  // Location
  address: string;
  locality: string;
  city: string;
  state: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  nearbyLandmarks: Array<{
    name: string;
    distance: string;
    type: 'airport' | 'school' | 'hospital' | 'metro' | 'beach' | 'shopping';
  }>;

  // Dimensions & Specs
  areaSqM: number;
  areaSqFt: number;
  carpetAreaSqFt: number;
  builtUpAreaSqFt: number;
  yardSqM?: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  floorNumber?: number;
  totalFloors?: number;
  facingDirection: 'North' | 'East' | 'South' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West';
  furnishingStatus: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
  possessionStatus: 'Ready to Move' | 'Under Construction';
  possessionDate?: string;
  propertyAgeYears: number;

  // Media
  featuredImage: string;
  galleryImages: string[];
  floorPlans?: FloorPlan[];
  virtualTourUrl?: string;
  videoUrl?: string;

  // Features
  amenities: string[];
  isFeatured: boolean;
  isVerified: boolean;
  isTrending: boolean;
  viewCount: number;
  likesCount: number;
  savesCount: number;

  // Dealer / Agent
  agent: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    agency: string;
    rating: number;
    reviewCount: number;
  };

  // Timestamps & Tracking
  listedDate: string;
  lastUpdatedDate: string;
  priceHistory: PriceHistoryPoint[];
}

export interface PropertyFilters {
  listingType?: ListingType | 'all';
  searchQuery?: string;
  propertyType?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | 'any';
  minAreaSqFt?: number;
  maxAreaSqFt?: number;
  readyToMoveOnly?: boolean;
  verifiedOnly?: boolean;
  featuredOnly?: boolean;
  furnishing?: string;
  amenities?: string[];
  sortBy?: 'recommended' | 'price_asc' | 'price_desc' | 'newest' | 'popularity';
}

export type UserRole = 'customer' | 'agent' | 'admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  role: UserRole;
  createdAt: string;
}

export interface SiteVisit {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyAddress: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  agentId: string;
  agentName: string;
  date: string;
  timeSlot: string;
  visitType: 'in_person' | 'virtual';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  preferredContact: 'phone' | 'email' | 'whatsapp';
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
}

export interface Lead {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  propertyId?: string;
  propertyTitle?: string;
  budgetMin?: number;
  budgetMax?: number;
  preferredLocation?: string;
  preferredType?: PropertyType;
  leadSource: 'website_enquiry' | 'site_visit' | 'whatsapp' | 'phone_call' | 'walk_in';
  status: 'new' | 'contacted' | 'interested' | 'site_visit_scheduled' | 'site_visit_completed' | 'negotiation' | 'booking_initiated' | 'deal_closed' | 'not_interested';
  priority: 'low' | 'medium' | 'high';
  assignedAgentId: string;
  assignedAgentName: string;
  notes: Array<{
    id: string;
    author: string;
    content: string;
    createdAt: string;
  }>;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  targetRole?: UserRole | 'all';
  title: string;
  message: string;
  type: 'enquiry' | 'site_visit' | 'price_drop' | 'lead' | 'system';
  link?: string;
  isRead: boolean;
  createdAt: string;
}
