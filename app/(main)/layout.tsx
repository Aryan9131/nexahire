import Header from '@/components/interview/layoutComponent/Header';
import { AppSidebar } from '@/components/layoutComponents/AppSidebar';
import WelcomeCard from '@/components/layoutComponents/WelcomeCard';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { MyContextProvider } from '@/context/interviewContext'; // Note: .tsx extension
import React from 'react';

interface InterviewLayoutProps {
  children: React.ReactNode;
}

export default function InterviewLayout({ children }: InterviewLayoutProps) {
  return (
     <SidebarProvider>
              <div className="relative flex w-full min-h-screen">
                <AppSidebar />
                <SidebarTrigger className="absolute left-0 md:left-65 z-9 hover:text-blue-400 text-blue-500 py-5" />
                <div className="flex-1 p-3">
                  <WelcomeCard />
                  {children}
                </div>
              </div>
            </SidebarProvider>
  );
}