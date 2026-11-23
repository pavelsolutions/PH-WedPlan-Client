import { IService } from "@/types";
import { getTokenFromClient } from "../token/getTokenFromClient";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

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

  if (params?.search?.trim()) {
    query.set("search", params.search.trim());
  }

  if (params?.category && params.category !== "all") {
    query.set("category", params.category);
  }

  if (params?.location?.trim()) {
    query.set("location", params.location.trim());
  }

  query.set("sort", params?.sort || "newest");

  if (params?.minBudget) {
    query.set("minBudget", params.minBudget);
  }

  if (params?.maxBudget) {
    query.set("maxBudget", params.maxBudget);
  }

  if (params?.rating && params.rating !== "all") {
    query.set("rating", params.rating);
  }

  if (params?.verified) {
    query.set("verified", "true");
  }

  if (params?.featured) {
    query.set("featured", "true");
  }

  const res = await fetch(
    `${BASE_URL}/services/all?${query.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Failed to fetch services"
    );
  }

  return data;
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
  const token = await getTokenFromClient();
  const res = await fetch(
    `${BASE_URL}/admin/services`, { 
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    }
  });

  

  

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