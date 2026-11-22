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