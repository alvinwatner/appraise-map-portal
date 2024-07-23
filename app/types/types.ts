export interface Notification {
  id: number;
  title: number;
  description: number;
  isRead: boolean;
  createdAt: string;
}

export interface Location {
  id: number | null;
  latitude: number;
  longitude: number;
  address: string;
}

export interface Valuation {
  id?: number | undefined;
  PropertyId: number;
  valuationDate: Date;
  landValue: number;
  buildingValue: number;
  totalValue: number;
  reportNumber: string;
  appraiser: string;
}

export interface Settings {  
  id: number;
  title: number;
  latitude: number;
  longitude: number;
  maxBilling: string;
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

export interface User {
  id: string;
  RoleId?: number;
  email?: string;
  username?: string;
  password?: string;
  lastLogin?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  auth_id?: string;
}
