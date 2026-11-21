import { IProfile } from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const getProfile = async (
  userId: string
): Promise<IProfile> => {
  const res = await fetch(
    `${BASE_URL}/users/${encodeURIComponent(userId)}`,
    { cache: "no-store" }
  );

  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch profile");
  }

  return result.data;
};

export const updateProfile = async (
  userId: string,
  data: {
    name: string;
    businessName: string;
    phone: string;
    city: string;
    bio: string;
    image?: string;
  }
): Promise<IProfile> => {

  const res = await fetch(
    `${BASE_URL}/users/${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result.message || "Failed to update profile");
  }

  return result.data;
};