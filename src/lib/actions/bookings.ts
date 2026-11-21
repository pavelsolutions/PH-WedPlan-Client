const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

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

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Failed to create booking."
    );
  }

  return response.json();
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
