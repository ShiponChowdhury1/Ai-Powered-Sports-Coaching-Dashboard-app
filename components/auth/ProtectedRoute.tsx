"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { initializeAuth } from "@/features/auth/authSlice";
import { useGetProfileQuery } from "@/store/api/profileApi";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    dispatch(initializeAuth());
    setIsInitialized(true);
  }, [dispatch]);

  // Fetch user profile to verify role
  const { data: profile, isLoading, isError } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated || !isInitialized,
  });

  useEffect(() => {
    if (!isInitialized) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    // If profile loaded and user is not Admin, redirect to login
    if (profile && profile.role !== "Admin") {
      router.replace("/auth/login");
      return;
    }

    // If error fetching profile (e.g., invalid token), redirect to login
    if (isError) {
      router.replace("/auth/login");
      return;
    }
  }, [isAuthenticated, profile, isError, isInitialized, router]);

  // Show loading state while checking authentication and profile
  if (!isInitialized || isLoading || !profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not admin, don't render children (will redirect)
  if (profile.role !== "Admin") {
    return null;
  }

  // User is authenticated and is an admin
  return <>{children}</>;
}
