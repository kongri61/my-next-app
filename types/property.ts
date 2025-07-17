export interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  type: string;
  bedrooms: number;
  area: string;
  image: string;
  description: string;
  features: string[];
  address: string;
  floor: string;
  parking: string;
  heating: string;
  moveInDate: string;
  lat: number;
  lng: number;
  dealType: string;
  propertyType: string;
  deposit?: string;
}

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  priceType?: string;
  features?: string[];
} 