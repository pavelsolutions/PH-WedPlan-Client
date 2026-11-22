"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface DashboardUser {
  name?: string | null;
  email: string;
  image?: string | null;
}

interface DashboardUserContextType {
  user: DashboardUser;
  updateUser: (data: Partial<DashboardUser>) => void;
}

const DashboardUserContext =
  createContext<DashboardUserContextType | null>(null);

export function DashboardUserProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: DashboardUser;
}) {
  const [user, setUser] = useState(initialUser);

  const updateUser = (data: Partial<DashboardUser>) => {
    setUser((prev) => ({
      ...prev,
      ...data,
    }));
  };

  return (
    <DashboardUserContext.Provider
      value={{ user, updateUser }}
    >
      {children}
    </DashboardUserContext.Provider>
  );
}

export function useDashboardUser() {
  const context = useContext(DashboardUserContext);

  if (!context) {
    throw new Error(
      "useDashboardUser must be used inside DashboardUserProvider"
    );
  }

  return context;
}