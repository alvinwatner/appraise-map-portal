// types.ts
export interface User {
  id: string;
  email: string;
  username: string;
  lastLogin: Date;
  isActive: boolean;
}

export interface Location {
  id: number;
  latitude: number;
  longitude: number;
  address: string;
}

export interface ObjectType {
  id: number;
  name: string;
}

export interface Valuation {
  id: number;
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
  object_type: string;
  valuations: Valuation[];
}
