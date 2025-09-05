'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

// Define the shape of your context data
interface InterviewContextType {
  interviewData: Interview | null;
  setInterviewData: (data: Interview | null) => void;
}

// Create the context
const InterviewContext = createContext<InterviewContextType | null>(null);

// Provider component props type
interface MyContextProviderProps {
  children: ReactNode;
}

export interface Interview {
  id: string | undefined;
  jobPosition: string;
  jobDescription: string;
  duration: number;
  types: string[];
  userId: string | undefined;
  questions: InterviewCategory[]; // The main questions array holds categories
  userName?: string;
  created_at?: string;
  email?: string;
}

export interface InterviewCategory {
  category: string;
  duration: string; // The duration here is a string, e.g., "12 minutes"
  questions: InterviewQuestion[];
}

export interface InterviewQuestion {
  question: string;
  type: "technical" | "behavioral" | "situational";
  difficulty: "beginner" | "intermediate" | "advanced";
  follow_ups: string[]; // Follow-ups are now a nested array of objects
  evaluation_criteria: string;
  ai_evaluation_hints: string;
}

// Context provider component
export function MyContextProvider({ children }: MyContextProviderProps) {
  const [interviewData, setInterviewData] = useState<Interview | null>(null);

  const value: InterviewContextType = {
    interviewData,
    setInterviewData
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
}

// Custom hook to use the context
export function useInterviewContext(): InterviewContextType {
  const context = useContext(InterviewContext);
  
  if (!context) {
    throw new Error('useInterviewContext must be used within a MyContextProvider');
  }
  
  return context;
}