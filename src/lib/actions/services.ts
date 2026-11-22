
import { CreateServicePayload } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// export const createService = async (data : CreateServicePayload) => {
//     const res = await fetch(`${BASE_URL}/services`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//     })
// }




export const createService = async (
  data: CreateServicePayload
) => {
  const res = await fetch(`${BASE_URL}/services`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(
      result.message || "Failed to create service."
    ) as Error & {
      code?: string;
      status?: number;
    };

    error.code = result.code;
    error.status = res.status;

    throw error;
  }

  return result;
};



export const updateService = async (
    serviceId: string,
    updatedData: {
        serviceName: string;
        category: string;
        price: number;
        location: string;
        description: string;
        image: string;
    }
) => {
    const res = await fetch(`${BASE_URL}/services/${serviceId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(updatedData),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to update service");
    }

    return data;
};
