import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

import SubscriptionClient from "./SubscriptionClient";

export default async function VendorSubscriptionPage() {
  // 1. Authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // 2. Vendor check
  if (session.user.role !== "vendor") {
    redirect("/");
  }

  // 3. User ID
  const vendorId = session.user.id;

  // 4. Database
  const client = await clientPromise;
  const db = client.db("phWedPlanDB");

  const usersCollection = db.collection("user");
  const paymentsCollection = db.collection("payments");

  // 5. Find user from USER collection
const vendorObjectId = ObjectId.isValid(vendorId)
  ? new ObjectId(vendorId)
  : null;

if (!vendorObjectId) {
  throw new Error("Invalid vendor ID");
}

const vendor = await usersCollection.findOne({
  _id: vendorObjectId,
});

  // 6. Get actual subscription plan from user document
  const subscriptionPlan = String(
    vendor?.subscriptionPlan || "free"
  ).toLowerCase();

  const isPremium = subscriptionPlan === "premium";

  // 7. Fetch payment history for this vendor
  const paymentHistory = await paymentsCollection
    .find({
      $or: [
        { userId: vendorId },
        { vendorId: vendorId },
      ],
    })
    .sort({
      payment_date: -1,
      createdAt: -1,
    })
    .toArray();

  // 8. Successful payment filter
  const successfulPayments = paymentHistory.filter((payment) => {
    const paymentStatus = String(
      payment.payment_status || ""
    ).toLowerCase();

    const status = String(
      payment.status || ""
    ).toLowerCase();

    return (
      paymentStatus === "paid" ||
      status === "complete" ||
      status === "paid"
    );
  });

  // 9. Calculate total paid
  const totalPaid = successfulPayments.reduce(
    (total, payment) =>
      total + (Number(payment.amount) || 0),
    0
  );

  // 10. Serialize payment history
  const serializedPayments = paymentHistory.map((payment) => {
    const paymentIntent = payment.payment_intent;

    const transactionId =
      typeof paymentIntent === "string"
        ? paymentIntent
        : paymentIntent?.id ||
          payment.stripePaymentIntentId ||
          payment.paymentIntentId ||
          "";

    const rawDate =
      payment.payment_date ||
      payment.paidAt ||
      payment.createdAt ||
      null;

    let paymentDate: string | null = null;

    if (rawDate) {
      const date = new Date(rawDate);

      if (!Number.isNaN(date.getTime())) {
        paymentDate = date.toISOString();
      }
    }

    return {
      id: payment._id.toString(),

      sessionId:
        payment.sessionId ||
        payment.stripeSessionId ||
        "",

      transactionId,

      amount: Number(payment.amount) || 0,

      currency: String(payment.currency || "usd").toLowerCase(),

      plan:
        payment.plan ||
        payment.subscriptionPlan ||
        "premium",

      status:
        payment.payment_status ||
        payment.status ||
        "unknown",

      paymentDate,

      email:
        payment.customer_email ||
        payment.vendorEmail ||
        session.user.email ||
        "",
    };
  });

  // 11. Premium activation date from user document
  const premiumActivatedAt = vendor?.premiumActivatedAt
    ? new Date(vendor.premiumActivatedAt).toISOString()
    : null;

  // 12. Vendor information
  const vendorName =
    vendor?.name ||
    session.user.name ||
    "Vendor";

  const vendorEmail =
    vendor?.email ||
    session.user.email ||
    "";

  // 13. Render
  return (
    <SubscriptionClient
      vendorName={vendorName}
      vendorEmail={vendorEmail}
      subscriptionPlan={subscriptionPlan}
      isPremium={isPremium}
      totalPaid={totalPaid}
      paymentCount={successfulPayments.length}
      payments={serializedPayments}
      premiumActivatedAt={premiumActivatedAt}
    />
  );
}