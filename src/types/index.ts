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

// Generic API Response
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Service API Responses
export type IServiceResponse = ApiResponse<IService>;

export type IServicesResponse = ApiResponse<IService[]>;

export type ICreateServiceResponse = ApiResponse<{
  insertedId: string;
}>;

export type IUpdateServiceResponse = ApiResponse<{
  modifiedCount: number;
}>;

export type IDeleteServiceResponse = ApiResponse<{
  deletedCount: number;
}>;