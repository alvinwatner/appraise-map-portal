import { supabase } from "./../lib/supabaseClient";
import { Property, Valuation, Location, User } from "./../types/types";
import { PostgrestError, PostgrestResponse } from "@supabase/supabase-js";

/**
 * Fetch properties with search and filter options.
 *
 * This function queries the `properties` table and joins with related tables to fetch property data
 * with support for search, filters, pagination, and sorting. The function is designed to handle complex
 * search and filter criteria across multiple related tables including properties, valuations, and locations.
 *
 * Search and filter criteria:
 * - Table: `properties`, Columns: `propertiesType`, `objectType`, `debitur`, `phoneNumber`
 * - Table: `valuation`, Columns: `reportNumber`, `valuationDate`
 * - Table: `locations`, Column: `address`
 *
 * TODO: Conduct more research on optimizing and applying search queries specifically on the `valuation` table
 * to improve performance and accuracy of search results.
 *
 * @param {string} [search=""] - The search keyword to filter results.
 * @param {number} [page=1] - The current page number for pagination.
 * @param {number} [perPage=10] - The number of results per page.
 * @param {any} [filters={}] - The filters to apply to the query.
 * @param {string} [sortField="id"] - The field to sort results by.
 * @param {string} [sort="asc"] - The sort order (ascending or descending).
 *
 * @returns {Promise<{ data: Property[]; total: number }>} - A promise that resolves to the fetched property data and total count.
 */
// export const fetchProperties = async (
//   search: string = "",
//   page: number = 1,
//   perPage: number = 10,
//   filters: any = {},
//   sortField: string = "id",
//   sort: string = "asc"
// ): Promise<{ data: Property[]; total: number }> => {
//   let query = supabase
//     .from("properties")
//     .select(
//       `
//       id,
//       debitur,
//       landArea,
//       buildingArea,
//       phoneNumber,
//       propertiesType,
//       isDeleted,
//       objectType,
//       users (
//         id,
//         email,
//         username,
//         lastLogin,
//         isActive
//       ),
//       locations:LocationId!inner (
//         id,
//         latitude,
//         longitude,
//         address
//       ),
//       valuations (
//         id,
//         valuationDate,
//         landValue,
//         buildingValue,
//         totalValue,
//         reportNumber,
//         appraiser
//       )
//     `,
//       { count: "exact" }
//     )
//     .is("isDeleted", null)
//     .order(sortField, { ascending: sort === "asc" });

//   if (search) {
//     // Update to handle logical 'OR' correctly
//     query = query.or(
//       `debitur.ilike.%${search}%,propertiesType.ilike.%${search}%,objectType.ilike.%${search}%,phoneNumber.ilike.%${search}%`
//     );
//   }

//   if (filters.propertyType) {
//     query = query.eq("propertiesType", filters.propertyType);
//   }

//   if (filters.valuationDate) {
//     query = query.eq("valuations.valuationDate", filters.valuationDate);
//   }

//   if (filters.objectType) {
//     query = query.eq("objectType.name", filters.objectType);
//   }

//   if (filters.minTotalValue !== undefined) {
//     query = query.gte("valuations.totalValue", filters.minTotalValue);
//   }

//   if (filters.maxTotalValue !== undefined) {
//     query = query.lte("valuations.totalValue", filters.maxTotalValue);
//   }

//   const from = (page - 1) * perPage;
//   const to = from + perPage - 1;

//   query = query.range(from, to);

//   const { data, error, count } = await query;

//   if (error) {
//     console.error("Error fetching properties:", error);
//     return { data: [], total: 0 };
//   }

//   return { data: data as unknown as Property[], total: count || 0 };
// };

export const fetchProperties = async (
  search?: string,
  page: number = 1,
  perPage: number = 10,
  filters: any = {},
  sortField: string = "id",
  sort: string = "asc"
): Promise<{ data: Property[]; total: number }> => {
  const {
    propertyType,
    objectType,
    valuationDate,
    minTotalValue,
    maxTotalValue,
  } = filters;

  const rpcParams = {
    page: page,
    per_page: perPage,
    search_query: search && search !== "" ? search : null,
    property_type: propertyType && propertyType !== "" ? propertyType : null,
    object_type: objectType && objectType !== "" ? objectType : null,
    valuation_date:
      valuationDate && valuationDate !== "" ? valuationDate : null,
    min_total_value: minTotalValue || null,
    max_total_value: maxTotalValue || null,
    sort_field: sortField,
    sort_order: sort,
  };

  let { data, error } = await supabase.rpc("fetch_properties", rpcParams);

  if (error) {
    console.error("Error fetching properties:", error);
    return { data: [], total: 0 };
  }

  return { data: data as unknown as Property[], total: data.length };
};

export const fetchPropertiesByBoundingBox = async (
  swLat: number,
  swLng: number,
  neLat: number,
  neLng: number,
  filters: {
    propertyType?: string;
    objectType?: string;
    valuationDate?: string;
    minTotalValue?: number;
    maxTotalValue?: number;
  } = {}
): Promise<{ data: Property[]; total: number }> => {
  const rpcFilters = {
    min_lat: swLat,
    min_long: swLng,
    max_lat: neLat,
    max_long: neLng,
    property_type:
      filters.propertyType && filters.propertyType !== ""
        ? filters.propertyType
        : null,
    object_type:
      filters.objectType && filters.objectType !== ""
        ? filters.objectType
        : null,
    valuation_date:
      filters.valuationDate && filters.valuationDate !== ""
        ? filters.valuationDate
        : null,
    min_total_value: filters.minTotalValue || null,
    max_total_value: filters.maxTotalValue || null,
  };

  let { data, error } = await supabase.rpc("properties_in_view", rpcFilters);

  console.log(`result data = ${JSON.stringify(data)}`);

  if (error) {
    console.error("Error fetching properties:", error);
    return { data: [], total: 0 };
  }

  return { data: data as unknown as Property[], total: data.length };
};

export const updatePropertiesIsDeleted = async (
  ids: number[],
  isDeleted: boolean
) => {
  const { data, error } = await supabase
    .from("properties")
    .update({ isDeleted })
    .in("id", ids);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const updateProperty = async (
  id: number,
  changes: Partial<Property>
) => {
  if (changes.locations) {
    const { error } = await supabase
      .from("locations")
      .update(changes.locations)
      .eq("id", changes.locations.id)
      .select();
    if (error) {
      throw new Error(error.message);
    }
  }
  delete changes.locations;
  delete changes.valuations;
  const { data, error } = await supabase
    .from("properties")
    .update(changes)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

interface AddPropertyArgs {
  latitude: number;
  longitude: number;
  address: string;
  objectType: string;
  landArea: number;
  buildingArea: number;
  phoneNumber: string;
  propertiesType: string;
  debitur: string;
  landValue: number;
  buildingValue: number;
  totalValue: number;
  reportNumber?: string | null;
  valuationDate?: string | null;
}

interface UpdatePropertyArgs {
  latitude: number;
  longitude: number;
  address: string;
  objectType: string;
  landArea: number;
  buildingArea: number;
  phoneNumber: string;
  propertiesType: string;
  debitur: string;
  landValue: number;
  buildingValue: number;
  totalValue: number;
  reportNumber?: string | null;
  valuationDate?: string | null;
}

export const addProperty = async ({
  latitude,
  longitude,
  address,
  objectType,
  landArea,
  buildingArea,
  phoneNumber,
  propertiesType,
  debitur,
  landValue,
  buildingValue,
  totalValue,
  reportNumber,
  valuationDate,
}: AddPropertyArgs) => {
  // Insert new location
  const { data: locationData, error: locationError } = await supabase
    .from("locations")
    .insert({
      coordinate: `POINT(${longitude} ${latitude})`,
      address: address,
    })
    .select();

  console.log("response add location = " + locationData);

  if (locationError) {
    throw new Error(`Error adding location: ${locationError.message}`);
  }

  if (locationData == null) {
    throw new Error("Location data is null or empty");
  }

  const locationId = (locationData[0] as Location).id;

  // Insert the property
  const { data: propertyData, error: propertyError } = await supabase
    .from("properties") // No type argument here
    .insert([
      {
        UserId: 3,
        LocationId: locationId,
        objectType: objectType,
        landArea: landArea,
        buildingArea: buildingArea,
        phoneNumber: phoneNumber,
        propertiesType: propertiesType,
        isDeleted: false,
        debitur: debitur,
      },
    ])
    .select();

  if (propertyError) {
    throw new Error(`Error adding property: ${propertyError.message}`);
  }

  if (propertyData == null) {
    throw new Error("Property data is null");
  }

  const propertyId = (propertyData[0] as Property).id;

  // Insert the valuations
  const valuations = [
    {
      landValue: landValue,
      buildingValue: buildingValue,
      totalValue: totalValue,
      reportNumber: reportNumber,
      valuationDate: valuationDate,
      PropertyId: propertyId,
    },
  ];

  const { data: valuationData, error: valuationError } = await supabase
    .from("valuations")
    .insert(valuations)
    .select();

  if (valuationError) {
    throw new Error(`Error adding valuations: ${valuationError.message}`);
  }

  return {
    property: propertyData as Property[],
    valuations: valuationData as unknown as Valuation[],
  };
};

export const addValuations = async (valuations: Valuation[]) => {
  const { data: valuationData, error: valuationError } = await supabase
    .from("valuations")
    .insert(valuations)
    .select();

  if (valuationError) {
    throw new Error(`Error adding valuations: ${valuationError.message}`);
  }
  return {
    valuations: valuationData as unknown as Valuation[],
  };
};

export const updateValuation = async (id: number, changes: any) => {
  const { data, error } = await supabase
    .from("valuations")
    .update(changes)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const fetchAllProperties = async (
  search: string = "",
  filters: any = {}
): Promise<{ data: Property[]; total: number }> => {
  let query = supabase
    .from("properties")
    .select(
      `
      id,
      debitur,
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
      objectType,
      valuations!inner(
        id,
        valuationDate,
        landValue,
        buildingValue,
        totalValue,
        reportNumber,
        appraiser
      )
    `,
      { count: "exact" }
    )
    .is("isDeleted", null)
    .order("id", { ascending: true });

  if (search) {
    query = query.ilike("debitur", `%${search}%`);
  }

  if (filters.propertyType) {
    query = query.eq("propertiesType", filters.propertyType);
  }

  if (filters.valuationDate) {
    query = query.eq("valuations.valuationDate", filters.valuationDate);
  }

  if (filters.objectType) {
    query = query.eq("objectType", filters.objectType);
  }

  if (filters.minTotalValue !== undefined) {
    query = query.gte("valuations.totalValue", filters.minTotalValue);
  }

  if (filters.maxTotalValue !== undefined) {
    query = query.lte("valuations.totalValue", filters.maxTotalValue);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching properties:", error);
    return { data: [], total: 0 };
  }

  return { data: data as unknown as Property[], total: count || 0 };
};

export async function fetchObjectTypes(): Promise<string[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("objectType");

  if (error) {
    throw new Error(error.message);
  }

  // Extract unique object_type values
  const objectTypes = Array.from(
    new Set(data.map((item: any) => item.objectType))
  );

  return objectTypes;
}

export const users = async (userId?: string): Promise<{ data: User }> => {
  let query = supabase.from("users").select().eq("auth_id", userId).single();
  const { data, error, count } = await query;
  if (error) {
    console.error("Error fetching properties:", error);
    return { data: null as any };
  }
  return { data: data as unknown as User };
};
