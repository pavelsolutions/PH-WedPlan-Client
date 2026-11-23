
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getVendorBookings = async (vendorId: string) => {
    const res = await fetch(
        `${BASE_URL}/vendor/bookings/${vendorId}`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
            },
            cache: "no-store",
        }
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Failed to fetch bookings");
    }

    return data.data || [];
};
