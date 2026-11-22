import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { getSession } from "@/lib/core/server";
import { auth } from "@/lib/auth";

export async function POST() {

  const userSession = await getSession();

  try {
    // 1. Get current logged-in user
    const session = await auth.api.getSession({
      headers: await headers(),
    });



    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    // 2. Vendor role check
    if (session.user.role !== "vendor") {
      return NextResponse.json(
        { message: "Only vendors can upgrade to Premium." },
        { status: 403 }
      );
    }

    // 3. Base URL
    const baseUrl = process.env.BETTER_AUTH_URL;

    if (!baseUrl) {
      return NextResponse.json(
        { message: "BETTER_AUTH_URL is not configured." },
        { status: 500 }
      );
    }

    // 4. Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: userSession?.user.email,
      // metadata:{
      //   userId: userSession?.user.id,
      // },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "WedPlan Premium Membership",
              description:
                "One-time payment for WedPlan Premium vendor membership",
            },
            unit_amount: 2500, // $25 USD
          },
          quantity: 1,
        },
      ],

      // Authenticated vendor ID only
      metadata: {
        vendorId: session.user.id,
        plan: "premium",
      },

      client_reference_id: session.user.id,

      // After payment
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,

      // If user cancels payment
      cancel_url: `${baseUrl}/dashboard/vendor/upgrade?canceled=true`,
    });

    // 5. Send Checkout URL to frontend
    return NextResponse.json({
      success: true,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("Stripe Checkout Session Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create Stripe checkout session.",
      },
      { status: 500 }
    );
  }
}