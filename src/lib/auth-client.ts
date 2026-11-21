
"use client";

import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL:
    process.env.BETTER_AUTH_URL ||
    "http://localhost:3000",

  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
        },
        isBlocked: {
          type: "boolean",
        },
        businessName: {
          type: "string",
        },
        subscriptionPlan: {
          type: "string",
        },
        subscriptionExpiresAt: {
          type: "date",
        },
      },
    }),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
