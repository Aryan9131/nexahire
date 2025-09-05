'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { routes } from '@/config/routes';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Define the public routes that don't require authentication
  const publicRoutes = [routes.auth.signIn, routes.auth.signUp];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    // Only perform the check after authentication has loaded
    if (!loading) {
      // If a user is not logged in and is trying to access a protected route, redirect to sign-in
      if (!user && !isPublicRoute) {
        router.push(routes.auth.signIn);
      }
      // If a user is logged in and is on a public auth page, redirect them to the dashboard
      else if (user && isPublicRoute) {
        router.push(routes.dashboard);
      }
    }
  }, [loading, user, isPublicRoute, router]);

  // Handle the loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Render children only when the state is resolved and the user is on the correct page
  if (user || isPublicRoute) {
    return <>{children}</>;
  }

  // Fallback, don't render anything if redirection is pending
  return null;
}
