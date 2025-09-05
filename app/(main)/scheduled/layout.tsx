import Header from '@/components/interview/layoutComponent/Header';
import { MyContextProvider } from '@/context/interviewContext'; // Note: .tsx extension
import React from 'react';

interface InterviewLayoutProps {
  children: React.ReactNode;
}

export default function InterviewLayout({ children }: InterviewLayoutProps) {
  return (
      <div>
        {children}
      </div>
  );
}