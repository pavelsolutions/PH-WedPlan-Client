const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL



export const createBooking = async (bookingData: {
    customerId: string | undefined;
    serviceId: string;
    eventDate: string;
    eventLocation: string;
    message: string;
}) => {
    const response = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(bookingData),
    });

    const result = await response.json().catch(() => null);

    if (response.status === 409) {
        throw new Error(
            result?.message ||
            "You have already booked this service for this date."
        );
    }

    if (!response.ok) {
        throw new Error(
            result?.message || "Failed to create booking."
        );
    }

    return result;
};


// export const getMyBookings = async (customerId: string | undefined) => {
//   const res = await fetch(
//     `${BASE_URL}/customer/bookings/${customerId}`,
//     {
//       credentials: "include",
//     }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch bookings");
//   }

//   const data = await res.json();

//   return data.data;
// };


// Get customer's bookings
export const getMyBookings = async (customerId: string) => {
  const response = await fetch(
    `${BASE_URL}/customer/bookings/${customerId}`,
    {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch bookings");
  }

  return data.data;
};

// Cancel pending booking
export const cancelMyBooking = async (
  customerId: string,
  bookingId: string
) => {
  const response = await fetch(
    `${BASE_URL}/customer/bookings/${customerId}/${bookingId}/cancel`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to cancel booking");
  }

  return data;
};



export const getVendorBookings = async (vendorId: string) => {
  const res = await fetch(
    `${BASE_URL}/vendor/bookings/${vendorId}`,
    {
      credentials: "include",
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch bookings");
  }

  return data.data || [];
};


export const updateVendorBookingStatus = async (
  vendorId: string,
  bookingId: string,
  status: "Confirmed" | "Rejected"
) => {
  try {
    const res = await fetch(
      `${BASE_URL}/vendor/bookings/${vendorId}/${bookingId}/status`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to update booking status");
    }

    return data;
  } catch (error) {
    console.error("Update Booking Status Error:", error);
    throw error;
  }
};


