import { getTokenFromClient } from "../token/getTokenFromClient";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL


export const checkoutVerify = async (sessionId: string) => {
    const response = await fetch(`${BASE_URL}/payments/checkout-verify`,
    {
      method: "POST",credentials: "include",
      headers: {
        'Content-Type': "application/json",
      },
      body: JSON.stringify({sessionId}),
    });
}

export const getAllTransactions = async () => {
  const token = await getTokenFromClient();
  const res = await fetch(`${BASE_URL}/payments`, {
    headers: {
      authorization: `Bearer ${token}`,
      method: "GET",
      cache: "no-store",
    }
  });

  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch transactions");
  }

  return result.data;
};