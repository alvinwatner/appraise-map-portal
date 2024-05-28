import { supabase } from './../lib/supabaseClient';
import { Property } from './../types/types';

export const fetchProperties = async (): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select(`
      id,
      name,
      landArea,
      buildingArea,
      phoneNumber,
      propertiesType,
      isDeleted,
      users (
        id,
        email,
        username,
        lastLogin,
        isActive
      ),
      locations (
        id,
        latitude,
        longitude,
        address
      ),
      object_type (
        id,
        name
      ),
      valuations (
        id,
        valuationDate,
        landValue,
        buildingValue,
        totalValue,
        reportNumber
      )
    `)
    .is('isDeleted', null)
    .order('id', { ascending: true }); 

  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
  return data as Property[];
};

export const updatePropertiesIsDeleted = async (ids: number[], isDeleted: boolean) => {
  const { data, error } = await supabase
    .from('properties')
    .update({ isDeleted })
    .in('id', ids);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const updateProperty = async (id: number, changes: Partial<Property>) => {
  const { data, error } = await supabase
    .from('properties')
    .update(changes)
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const updateValuation = async (id: number, changes: any) => {
  const { data, error } = await supabase
    .from('valuations')
    .update(changes)
    .eq('PropertyId', id);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
