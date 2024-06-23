// types.ts
export interface User {
  id: string;
  email: string;
  username: string;
  lastLogin: Date;
  isActive: boolean;  
}

export interface Location {
  id: number | null;
  latitude: number;
  longitude: number;
  address: string;
}

export interface Valuation {
  id?: number | null;
  valuationDate: Date;
  landValue: number;
  buildingValue: number;
  totalValue: number;
  reportNumber: string;
  appraiser: string;
}

export interface Property {
  id: number;
  debitur: string;
  landArea: number;
  buildingArea: number;
  phoneNumber: string;
  propertiesType: string;
  isDeleted: boolean | null;
  users: User;
  locations: Location;
  objectType: string;
  valuations: Valuation[];
}
