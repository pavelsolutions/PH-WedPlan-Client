import { IService } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const getAllServices = async () => {
  const res = await fetch(`${BASE_URL}/services`);

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
