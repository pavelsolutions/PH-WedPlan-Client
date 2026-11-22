// Service Categories
export const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
] as const;

export type ServiceCategory = (typeof categories)[number];

// Service Status
export type ServiceStatus = "Pending" | "Approved" | "Rejected";

// Complete Service
export interface IService {
  _id: string;
  vendorId: string;

  serviceName: string;
  category: ServiceCategory;
  description: string;

  price: number;
  location: string;
  image: string;

  status: ServiceStatus;
  rejectionReason?: string;

  createdAt: string;
  updatedAt: string;
}

// Create Service Payload
export interface CreateServicePayload {
  serviceName: string;
  category: ServiceCategory;
  description: string;
  price: number;
  location: string;
  image: string;
  vendorId:string | undefined;
}

// Update Service Payload
export type UpdateServicePayload = Partial<CreateServicePayload>;

export interface IProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  isBlocked: boolean;
  businessName?: string;
  phone?: string;
  city?: string;
  bio?: string;
  subscriptionPlan?: string;
  subscriptionExpiresAt?: string | Date;
}

export interface Transaction {
  vendorId: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  amount: number;
  currency: string;
  plan: "monthly" | "yearly";
  status: "pending" | "paid" | "failed" | "cancelled";
  subscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface IUpdateProfileResponse {
    success: boolean;
    message: string;
    data: IProfile;
}