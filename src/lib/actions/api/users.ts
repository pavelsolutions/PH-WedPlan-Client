import { IProfile } from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL

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



// Get All Registered Users
export const getAdminUsers = async () => {
  const res = await fetch(`${BASE_URL}/admin/users`);

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
};

// Block / Unblock User
export const updateAdminUser = async (
  id: string,
  isBlocked: boolean
) => {
  const res = await fetch(
    `${BASE_URL}/admin/users/${id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isBlocked }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update user");
  }

  return res.json();
};


export const getUserPremiumById = async (userId:string) => {
  const response = await fetch(`${BASE_URL}/users/${userId}/premium`);
  return response.json();
};