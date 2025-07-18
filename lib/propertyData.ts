import propertyData from '../data/properties.json';

export interface Property {
  id: string;
  title: string;
  price: number;
  priceType: string;
  area: number;
  rooms: number;
  bathrooms: number;
  floor: number;
  totalFloors: number;
  address: string;
  description: string;
  features: string[];
  images: string[];
  location: {
    lat: number;
    lng: number;
  };
  contact: {
    phone: string;
    agent: string;
    email: string;
  };
  available: boolean;
  createdAt: string;
  // 추가 필드들
  type?: string;
  bedrooms?: number;
  image?: string;
  dealType?: string;
  propertyType?: string;
  deposit?: string;
  parking?: string;
  heating?: string;
  moveInDate?: string;
  lat?: number;
  lng?: number;
}

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  priceType?: string;
  features?: string[];
}

export const getAllProperties = (): Property[] => {
  return propertyData.properties;
};

export const getFilteredProperties = (filters: PropertyFilters): Property[] => {
  let properties = getAllProperties();

  if (filters.minPrice !== undefined) {
    properties = properties.filter(property => property.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    properties = properties.filter(property => property.price <= filters.maxPrice!);
  }

  if (filters.minArea !== undefined) {
    properties = properties.filter(property => property.area >= filters.minArea!);
  }

  if (filters.maxArea !== undefined) {
    properties = properties.filter(property => property.area <= filters.maxArea!);
  }

  if (filters.priceType) {
    properties = properties.filter(property => property.priceType === filters.priceType);
  }

  if (filters.features && filters.features.length > 0) {
    properties = properties.filter(property => 
      filters.features!.some(feature => property.features.includes(feature))
    );
  }

  return properties;
};

export const getPropertyById = (id: string): Property | undefined => {
  return propertyData.properties.find(property => property.id === id);
};

export const formatPrice = (price: number): string => {
  if (price >= 100000000) {
    return `${Math.floor(price / 100000000)}억 ${Math.floor((price % 100000000) / 10000)}만원`;
  } else if (price >= 10000) {
    return `${Math.floor(price / 10000)}만원`;
  } else {
    return `${price.toLocaleString()}원`;
  }
};

export const formatArea = (area: number): string => {
  return `${area}㎡`;
}; 