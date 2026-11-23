import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

import TransactionsClient from "./TransactionsClient";
import { getAllTransactions } from "@/lib/actions/payments";

export default async function AdminTransactionsPage() {
  // 1. Authenticate
  const session = await auth.api.getSession({
    headers: await headers(),
  });


  if (!session) {
    redirect("/login");
  }

  // 2. Admin role protection
  if (session.user.role !== "admin") {
    redirect("/");
  }

  // 3. MongoDB connection
  const client = await clientPromise;
  const db = client.db("phWedPlanDB");

  const paymentsCollection = db.collection("payments");
  const usersCollection = db.collection("user");

  // 4. Get all transactions
  const paymentRecords = await paymentsCollection
    .find({})
    .sort({
      payment_date: -1,
      createdAt: -1,
    })
    .toArray();

  // 5. Collect vendor IDs
  const vendorIds = Array.from(
    new Set(
      paymentRecords
        .map((payment) =>
          String(payment.vendorId || payment.userId || "")
        )
        .filter(Boolean)
    )
  );

  // 6. Find vendor users
  const objectIds = vendorIds
    .filter((id) => ObjectId.isValid(id))
    .map((id) => new ObjectId(id));

  const vendors = await usersCollection
    .find({
      $or: [
        {
          _id: {
            $in: objectIds,
          },
        },
        {
          id: {
            $in: vendorIds,
          },
        },
      ],
    })
    .toArray();

  // 7. Create vendor lookup map
  const vendorMap = new Map<string, any>();

  vendors.forEach((vendor) => {
    vendorMap.set(vendor._id.toString(), vendor);

    if (vendor.id) {
      vendorMap.set(String(vendor.id), vendor);
    }
  });

  // 8. Serialize transactions
  const transactions = paymentRecords.map((payment) => {
    const vendorId = String(
      payment.vendorId || payment.userId || ""
    );

    const vendor = vendorMap.get(vendorId);

    const paymentIntent = payment.payment_intent;

    const transactionId =
      typeof paymentIntent === "string"
        ? paymentIntent
        : paymentIntent?.id ||
        payment.stripePaymentIntentId ||
        payment.paymentIntentId ||
        "";

    const sessionId =
      payment.sessionId ||
      payment.stripeSessionId ||
      payment.checkoutSessionId ||
      "";

    const rawDate =
      payment.payment_date ||
      payment.paidAt ||
      payment.createdAt ||
      payment.updatedAt ||
      null;

    let paymentDate: string | null = null;

    if (rawDate) {
      const date = new Date(rawDate);

      if (!Number.isNaN(date.getTime())) {
        paymentDate = date.toISOString();
      }
    }

    const rawStatus = String(
      payment.payment_status ||
      payment.status ||
      "unknown"
    ).toLowerCase();

    let status = rawStatus;

    if (rawStatus === "complete" || rawStatus === "paid") {
      status = "paid";
    } else if (
      rawStatus === "expired" ||
      rawStatus === "failed" ||
      rawStatus === "canceled" ||
      rawStatus === "cancelled"
    ) {
      status = "failed";
    } else if (
      rawStatus === "processing" ||
      rawStatus === "pending" ||
      rawStatus === "unpaid"
    ) {
      status = "pending";
    }

    // Stripe amount_total is in cents.
    // payment.amount is assumed to be stored in dollars.
    const amount =
      typeof payment.amount_total === "number"
        ? payment.amount_total / 100
        : typeof payment.amount === "number"
          ? payment.amount
          : typeof payment.totalAmount === "number"
            ? payment.totalAmount
            : 0;

    return {
      id: payment._id.toString(),

      transactionId,

      sessionId,

      vendorId,

      vendorName:
        vendor?.name ||
        payment.vendorName ||
        payment.businessName ||
        "Unknown Vendor",

      vendorEmail:
        vendor?.email ||
        payment.customer_email ||
        payment.vendorEmail ||
        "",

      amount,

      currency: String(
        payment.currency || "usd"
      ).toLowerCase(),

      plan:
        payment.plan ||
        payment.subscriptionPlan ||
        "premium",

      status,

      paymentDate,
    };
  });

  // 9. Render admin transactions UI
  return (
    <TransactionsClient
      transactions={transactions}
    />
  );
}