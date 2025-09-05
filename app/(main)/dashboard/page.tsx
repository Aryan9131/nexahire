"use client";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/supabaseAuth";
import Link from "next/link";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layoutComponents/AppSidebar";
import CreateOptions from "@/components/dashboard/CreateOptions";
import LatestInterviews from "@/components/dashboard/LatestInterviews";


const DashboardPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/sign-in");
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Redirecting...</p>;

  return (
      <div className="my-3">
        <h1 className="text-2xl font-bold my-3">Dashboard</h1>
        <CreateOptions/>
        <LatestInterviews/>
      </div>
  );
};

export default DashboardPage;
