import { IService } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// export const getServices = async () => {
//     const res = await fetch(`${BASE_URL}/services`)
//     return res.json();
// }


export const getServices = async (
  vendorId: string
): Promise<IService[]> => {
  const res = await fetch(
    `${BASE_URL}/services?vendorId=${encodeURIComponent(vendorId)}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }

  const data = await res.json();

  return data;
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
