# WedPlan – Wedding Planning Platform

WedPlan is a full-stack wedding planning platform that helps customers discover wedding-related services and book services from different vendors. Vendors can create and manage their wedding services, handle booking requests, and upgrade to a Premium subscription. Admins can manage users, review services, and monitor platform transactions.

The platform provides a role-based experience for Customers, Vendors, and Admins.

## 🌐 Live Website

**Live Link:** https://wedplan-frontend-three.vercel.app

## 📂 GitHub Repositories

- **Client Repository:** https://github.com/pavelsolutions/PH-WedPlan-Client
- **Server Repository:** https://github.com/pavelsolutions/PH-WedPlan-Server

## ✨ Important Features

### 👤 Customer Features
- Browse available wedding services.
- Search services by name.
- Filter services by category and location.
- View detailed service information.
- Submit wedding service booking requests.
- Track booking request status.
- Cancel pending booking requests.
- Manage personal profile.
- Access Customer Dashboard.

### 🏢 Vendor Features
- Create and manage vendor profiles.
- Add, update, and delete wedding services.
- View service approval status.
- Manage customer booking requests.
- Accept or reject booking requests.
- View booking information and service statistics.
- Manage subscription plans.
- Upgrade to Premium subscription.
- Access Vendor Dashboard.

### 🛡️ Admin Features
- View all registered users.
- Search users by name or email.
- Filter users by role.
- View user information.
- Block and unblock users.
- Review and approve or reject services.
- Manage published services.
- View platform transactions.
- Monitor platform statistics.
- Access Admin Dashboard.

### 💳 Payment & Subscription
- Stripe Checkout integration.
- Premium subscription payment verification.
- Vendor subscription management.
- Payment information storage.
- Payment status verification.

### 🔐 Authentication & Security
- Email and password authentication.
- Role-based user experience.
- Customer, Vendor, and Admin roles.
- Protected dashboard pages.
- Secure environment variable configuration.

## 🛠️ Technology Stack

### Frontend
- Next.js
- TypeScript
- JavaScript
- Tailwind CSS
- ShadCN / HeroUI
- Framer Motion / Motion

### Backend
- Node.js
- Express.js
- MongoDB
- Better Auth
- Stripe

### Other Tools & Services
- ImgBB – Image Hosting
- Git & GitHub – Version Control
- Vercel – Frontend Deployment

## 📦 Installation Instructions

To run WedPlan locally, you need to set up both the client and server repositories.

### 1. Clone the Client Repository

```bash
git clone https://github.com/pavelsolutions/PH-WedPlan-Client.git
```

Navigate to the client directory:

```bash
cd PH-WedPlan-Client
```

Install dependencies:

```bash
npm install
```

### 2. Clone the Server Repository

Open another terminal:

```bash
git clone https://github.com/pavelsolutions/PH-WedPlan-Server.git
```

Navigate to the server directory:

```bash
cd PH-WedPlan-Server
```

Install dependencies:

```bash
npm install
```

## ⚙️ Environment Variables

### Backend Environment Variables

Create a `.env` file in the server root directory.

```env
PORT=5000

DB_USER=your_mongodb_username
DB_PASSWORD=your_mongodb_password

FRONTEND_URL=http://localhost:3000

STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Frontend Environment Variables

Create a `.env.local` file in the client root directory and configure the backend API URL and any authentication or image-hosting credentials required by your implementation.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Important:** Never upload `.env` or `.env.local` files, database credentials, authentication secrets, or Stripe secret keys to GitHub.

## 🚀 How to Run the Project Locally

### Start the Backend Server

From the server directory, run:

```bash
npm run dev
```

The backend server will run at:

```text
http://localhost:5000
```

### Start the Frontend Application

From the client directory, run:

```bash
npm run dev
```

The frontend application will run at:

```text
http://localhost:3000
```

Open the following URL in your browser:

http://localhost:3000

## 🗄️ Database

WedPlan uses MongoDB as its database.

**Database Name:** `phWedPlanDB`

Main collections include:

- `user`
- `services`
- `session`
- `bookings`
- `payments`
- `transactions`

## 📌 Additional Information

- Customers can discover and book wedding services.
- Vendors can manage their services and booking requests.
- New services are submitted with a Pending approval status.
- Public service listings display approved services.
- Stripe is used for payment verification and Premium subscription management.
- Admins can manage users, services, and platform activities.

## 👨‍💻 Project Information

**Project Name:** WedPlan  
**Category:** Wedding Planning Platform  
**Project Type:** Full-Stack Web Application