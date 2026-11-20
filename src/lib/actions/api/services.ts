
// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

import { IService } from "@/types";

// export const getServices = async () => {
//     const res = await fetch(`${BASE_URL}/services`)
//     return res.json();
// }

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";


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