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
  coordinate: string;
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

export interface RowData {
  propertiesType?: string | null;
  reportNumber?: string | null;
  valuationDate?: string | null;
  objectType?: string | null;
  debitur?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  landArea?: string | null;
  buildingArea?: string | null;
  landValue?: string | null;
  buildingValue?: string | null;
  totalValue?: string | null;
  coordinates?: string | null;
  appraiser?: string | null;
}
