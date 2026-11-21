import { IService } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// export const getAllServices = async () => {
//   const res = await fetch(`${BASE_URL}/services`);

//   if (!res.ok) {
//     throw new Error("Failed to fetch services");
//   }

//   return res.json();
// };


export const getAllServices = async () => {
  const res = await fetch(`${BASE_URL}/services`);

  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }

  const data = await res.json();

  // Backend response থেকে services array return করবে
  return Array.isArray(data)
    ? data
    : Array.isArray(data?.services)
      ? data.services
      : [];
};

export const getAllServicesData = async (params?: {
  search?: string;
  category?: string;
  location?: string;
  sort?: string;
  minBudget?: string;
  maxBudget?: string;
  rating?: string;
  verified?: boolean;
  featured?: boolean;
}) => {
  const query = new URLSearchParams();

  // Keyword search
  if (params?.search?.trim()) {
    query.set("search", params.search.trim());
  }

  // Category filter
  if (params?.category && params.category !== "all") {
    query.set("category", params.category);
  }

  // Location filter
  if (params?.location?.trim()) {
    query.set("location", params.location.trim());
  }

  // Sorting
  if (params?.sort) {
    query.set("sort", params.sort);
  }

  // Minimum budget
  if (params?.minBudget) {
    query.set("minBudget", params.minBudget);
  }

  // Maximum budget
  if (params?.maxBudget) {
    query.set("maxBudget", params.maxBudget);
  }

  // Rating filter
  if (params?.rating && params.rating !== "all") {
    query.set("rating", params.rating);
  }

  // Verified vendors
  if (params?.verified) {
    query.set("verified", "true");
  }

  // Featured services
  if (params?.featured) {
    query.set("featured", "true");
  }

  const url = `${BASE_URL}/services?${query.toString()}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }

  return res.json();
};


// export const getServices = async (
//   vendorId: string
// ): Promise<IService[]> => {
//   const res = await fetch(
//     `${BASE_URL}/services?vendorId=${encodeURIComponent(vendorId)}`,
//     {
//       cache: "no-store",
//     }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch services");
//   }

//   const data = await res.json();

//   return data;
// };


export const getServiceById = async (serviceId: string) => {
  const response = await fetch(
    `${BASE_URL}/services/${serviceId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  const data = await response.json();

  console.log("API Response:", data);

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to load service details."
    );
  }

  return data.service ?? data;
};


export const getVendorServices = async (vendorId: string) => {
  const res = await fetch(
    `${BASE_URL}/vendor/services?vendorId=${vendorId}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch vendor services");
  }

  return res.json();
};

export const getAdminServices = async () => {
  const res = await fetch(
    `${BASE_URL}/admin/services`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch vendor services");
  }

  return res.json();
};

export const updateAdminServices = async (
  id: string,
  status: "APPROVED" | "REJECTED"
) => {
  const res = await fetch(
    `${BASE_URL}/admin/services/${id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );
}


export const deleteAdminService = async (id: string) => {
  const res = await fetch(`${BASE_URL}/services/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete service");
  }

  return res.json();
};


export const deleteService = async (serviceId: string) => {
  const response = await fetch(
    `${BASE_URL}/services/${serviceId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete service");
  }

  return data;
};

export const getVendorServiceCount = async (vendorId: string) => {
  const res = await fetch(
    `${BASE_URL}/vendor/services/count/${vendorId}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch service count");
  }

  return res.json();
};