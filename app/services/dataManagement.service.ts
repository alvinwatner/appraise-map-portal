import { supabase } from "./../lib/supabaseClient";
import {
  Property,
  Valuation,
  Location,
  User,
  Notification,
  Settings,
} from "./../types/types";
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

  if (error) {
    console.error("Error fetching properties:", error);
    return { data: [], total: 0 };
  }

  return { data: data as unknown as Property[], total: data.length };
};

/**
 * Fetches the maximum totalValue in the valuations table for the current month.
 */
export const fetchMaxTotalValueCurrentMonth = async (): Promise<number> => {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  try {
    // Convert dates to ISO strings for comparison in the database
    const startDate = firstDayOfMonth.toISOString().split("T")[0];
    const endDate = lastDayOfMonth.toISOString().split("T")[0];

    // Perform the query to find the maximum totalValue within the current month
    const { data, error } = await supabase
      .from("valuations")
      .select("totalValue")
      .gte("valuationDate", startDate)
      .lte("valuationDate", endDate)
      .order("totalValue", { ascending: false }) // Order by totalValue in descending order
      .limit(1); // Only fetch the top record

    if (error) {
      throw error;
    }

    // Return the maximum totalValue, or 0 if no data was found
    return data && data.length > 0 ? data[0].totalValue : 0;
  } catch (error) {
    return 0; // Return 0 in case of error
  }
};

export const fetchMonthlyValuations2024 = async () => {
  // Constructing an array to store the sum of totalValue for each month
  let monthlyTotals = new Array(12).fill(0);

  try {
    const { data, error } = await supabase
      .from("valuations")
      .select("totalValue, valuationDate")
      .gte("valuationDate", "2024-01-01") // Greater than or equal to the start of 2024
      .lte("valuationDate", "2024-12-31") // Less than or equal to the end of 2024
      .order("valuationDate", { ascending: true }); // Ensure the data is sorted by date

    if (error) {
      throw error;
    }

    // Process the fetched data to sum up the total values by month
    data.forEach((item) => {
      const date = new Date(item.valuationDate);
      const month = date.getMonth(); // getMonth() returns month index (0 for January, 11 for December)
      monthlyTotals[month] += item.totalValue;
    });

    console.log(`aggregate total data = ${JSON.stringify(monthlyTotals)}`);

    return monthlyTotals; // Returning the array with monthly totals
  } catch (error) {
    console.error("Error fetching monthly valuations:", error);
    return []; // Return an empty array in case of error
  }
};

export const fetchYearlyValuations = async () => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2]; // Last 3 years including this year
  let yearlyTotals = [0, 0, 0]; // Initialize totals for each year

  try {
    const { data, error } = await supabase
      .from("valuations")
      .select("totalValue, valuationDate")
      .gte("valuationDate", `${years[2]}-01-01`) // Start of 3 years ago
      .lte("valuationDate", `${years[0]}-12-31`); // End of current year

    if (error) {
      throw error;
    }

    // Process the fetched data to sum up the total values by year
    data.forEach((item) => {
      const year = new Date(item.valuationDate).getFullYear();
      const index = years.indexOf(year);
      if (index !== -1) {
        yearlyTotals[index] += item.totalValue;
      }
    });

    return yearlyTotals; // Returning the array with yearly totals
  } catch (error) {
    console.error("Error fetching yearly valuations:", error);
    return [0, 0, 0]; // Return zeros in case of error
  }
};

export const updateSettingsData = async (
  id: number,
  changes: Partial<Settings>
) => {
  const { data, error } = await supabase
    .from("settings")
    .update(changes)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const fetchSettingsData = async (): Promise<Settings> => {
  try {
    const { data, error } = await supabase.from("settings").select(`
        id,
        maxBilling,
        latitude,
        longitude
        `);

    if (error) {
      throw error;
    }

    return data[0] as unknown as Settings;
  } catch (error) {
    console.error("Error fetching settings data:", error);
    throw error;
  }
};

export const fetchUserDataSession = async (): Promise<User> => {
  const { data: session, error: sessionError } =
    await supabase.auth.getSession();
  if (sessionError) {
    throw new Error("Failed to retrieve session");
  }

  if (!session.session?.user.id) {
    throw new Error("No user id found in session");
  }

  const userData = await users(session.session.user.id);
  if (!userData?.data?.id || !userData?.data?.RoleId) {
    throw new Error("User data incomplete");
  }

  return userData.data;
};

export const fetchNotification = async (): Promise<Notification[]> => {
  try {
    // Retrieve the current session to get the user ID
    const userData = await fetchUserDataSession();

    let orConditions = `UserId.eq.${userData.id}`;
    if (userData.RoleId) {
      orConditions += `,RoleId.eq.${userData.RoleId}`;
    }
    orConditions += `,and(UserId.is.null,RoleId.is.null)`;

    const { data, error } = await supabase
      .from("notifications")
      .select(
        `
        id,
        title,
        description,
        createdAt,
        isRead:notification_reads (isRead)
        `
      )
      .or(orConditions)
      .eq("notification_reads.UserId", userData.id)
      .order("createdAt", { ascending: false });

    if (error) {
      throw error;
    }

    const transformedData = data.map((notification) => ({
      ...notification,
      isRead:
        notification.isRead.length > 0 ? notification.isRead[0].isRead : false,
    }));

    console.log(`notification response = ${JSON.stringify(transformedData)}`);

    return transformedData as unknown as Notification[];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    // Retrieve the current session to get the user ID
    const userData = await fetchUserDataSession();

    // Update notifications to mark them as read
    const { error } = await supabase
      .from("notification_reads")
      .update({ isRead: true, readAt: new Date() })
      .eq("UserId", userData.id);

    if (error) {
      throw error;
    }

    console.log("All notifications marked as read.");
  } catch (error) {
    console.error("Error marking notifications as read:", error);
  }
};

export const countUnreadNotifications = async (): Promise<number> => {
  try {
    // Retrieve the current session to get the user ID
    const userData = await fetchUserDataSession();

    const { data, error, count } = await supabase
      .from("notification_reads")
      .select("*", { count: "exact", head: true }) // Retrieve only count, not full data
      .eq("UserId", userData.id)
      .eq("isRead", false);

    if (error) {
      throw error;
    }

    console.log(`Number of unread notifications: ${count}`);
    console.log(`Data fetched: ${JSON.stringify(data)}`);

    return count || 0; // Ensure a number is always returned
  } catch (error) {
    console.error("Error counting unread notifications:", error);
    return 0;
  }
};
export const insertNotification = async ({
  title,
  description,
  roleId,
  userId,
}: {
  title: string;
  description: string;
  roleId?: number;
  userId?: number;
}): Promise<void> => {
  try {
    const { data: notifData, error } = await supabase
      .from("notifications")
      .insert([
        {
          title: title,
          description: description,
          UserId: userId,
          RoleId: roleId,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    if (notifData == null) {
      throw new Error("Notif data is null");
    }

    console.log("Notification added:", notifData);

    const notifId = (notifData[0] as Notification).id;

    // Determine target users for the notification based on roleId or userId
    if (roleId) {
      // Fetch all users with the specific role
      const { data: roleUsers, error: roleUsersError } = await supabase
        .from("users")
        .select("id")
        .eq("RoleId", roleId);

      if (roleUsersError) {
        throw roleUsersError;
      }

      // Insert notification reads for all users with the role
      const reads = roleUsers.map((user) => ({
        UserId: user.id,
        NotifId: notifId,
        isRead: false,
        readAt: null,
      }));

      const { error: readsError } = await supabase
        .from("notification_reads")
        .insert(reads);

      if (readsError) {
        throw readsError;
      }
    } else if (userId) {
      // Insert a single notification read entry for the specific user
      const { error: readsError } = await supabase
        .from("notification_reads")
        .insert([
          {
            UserId: userId,
            NotifId: notifId,
            isRead: false,
            readAt: null,
          },
        ]);

      if (readsError) {
        throw readsError;
      }
    }
  } catch (error) {
    console.error("Error inserting notification:", error);
  }
};

export const fetchTotalPropertiesCount = async (
  isCountAset = true
): Promise<number> => {
  try {
    const propertiesType = isCountAset ? "aset" : "data";

    // Perform the query to count rows
    const { data, error, count } = await supabase
      .from("properties")
      .select("*", { count: "exact" })
      .eq("propertiesType", propertiesType);

    if (error) {
      throw error;
    }

    return count ?? 0;
  } catch (error) {
    return 0;
  }
};

/**
 * Fetches property details along with associated user, location, and valuations by property ID.
 * @param {number} propertyId - The ID of the property to fetch.
 * @returns {Promise<Object>} - A promise that resolves to the property details.
 */
export const fetchPropertyDetailsById = async (
  propertyId: number
): Promise<Property | null> => {
  try {
    const { data, error } = await supabase.rpc("fetch_property_details_by_id", {
      property_id: propertyId,
    });

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.error("Error fetching property details:", error);
    return null;
  }
};

export const fetchTotalValuationCount = async (): Promise<number> => {
  try {
    // Perform the query to count rows
    const { data, error, count } = await supabase
      .from("valuations")
      .select("*", { count: "exact" });

    if (error) {
      throw error;
    }

    return count ?? 0;
  } catch (error) {
    return 0;
  }
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
  // Retrieve the current session to get the user ID
  const userData = await fetchUserDataSession();

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
        UserId: userData.id,
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
      propertiesType,
      debitur,
      phoneNumber,
      landArea,
      buildingArea,
      isDeleted,
      objectType,
      locations (
        address,
        coordinate
      ),
      valuations!inner(
        reportNumber,
        valuationDate,
        appraiser,
        landValue,
        buildingValue,
        totalValue
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

export const getPropertiesCount = async () => {
  let { data, error } = await supabase.rpc("count_properties");

  if (error) {
    console.error("Error fetching properties:", error);
    return { count: 0 };
  }

  return { count: data };
};
