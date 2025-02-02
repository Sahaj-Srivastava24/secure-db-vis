"use client";

import { createContext, useContext, useState, useEffect } from "react";
import * as auth from "@/lib/auth";

type User = {
  id: number;
  email: string;
};

type AuthContextType = {
  user: User | null;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signUp: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    auth.getSession().then(setUser);
  }, []);

  const signIn = async (credentials: { email: string; password: string }) => {
    const user = await auth.signIn(credentials);
    setUser(user);
  };

  const signUp = async (credentials: { email: string; password: string }) => {
    const user = await auth.signUp(credentials);
    setUser(user);
  };

  const signOut = async () => {
    await auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}