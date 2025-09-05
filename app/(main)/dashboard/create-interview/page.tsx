'use client'

import { ArrowLeft } from 'lucide-react'
import React, { useEffect } from 'react'
import { Progress } from "@/components/ui/progress"
import { useRouter } from 'next/navigation'
import { InterviewForm } from '@/components/dashboard/CreateInterviewForm'
import axios from 'axios'
import QuestionsList from '@/components/dashboard/QuestionsList'
import { useAuth } from '@/hooks/useAuth'
import { set } from 'zod'
import { supabase } from '@/integrations/supabase/client'
import InterviewDetails from '@/components/dashboard/InterviewDetails'
import { useInterviewContext } from '@/context/interviewContext'

export interface InterviewFormInputs {
  position: string;
  description: string;
  duration: number;
  types: string[];
}

export interface Interview {
  id:string,
  jobPosition: string;
  jobDescription: string;
  duration: number;
  types: string[];
  userId: string | undefined;
  questions: InterviewQuestion[];
  createdAt: string | undefined;
}

export interface InterviewQuestion {
  question: string;
  type: "technical" | "behavioral" | "situational";
  difficulty: "beginner" | "intermediate" | "advanced";
  follow_ups: string[];
  evaluation_criteria: string;
  ai_evaluation_hints: string;
}

export interface QuestionCategory {
  category: string;
  duration: string;
  questions: InterviewQuestion[];
}

export interface InterviewPlan {
  total_duration: string;
  question_categories: QuestionCategory[];
  additional_notes: string;
}

export interface GenerateQuestionsResponse {
  success: boolean;
  data: InterviewPlan;
}


const page = () => {
  const router = useRouter();
  
  const { user, session } = useAuth();
  const [step, setStep] = React.useState(1);
  const [questionsCategories, setQuestionsCategories] = React.useState<QuestionCategory[]>();
  const [isGeneratingQuestions, setIsGeneratingQuestions] = React.useState(false);
  const [interviewFormValues, setInterviewFormValues] = React.useState<InterviewFormInputs>();
  const [currentInterview, setCurrentInterview] = React.useState<Interview | null>(null);
  // 1. Define a submit handler for step 1.
  async function onSubmit(values: InterviewFormInputs) {
    console.log("Form Values : ", values);
    try {
      setIsGeneratingQuestions(true);
      setStep(2);
      const { data } = await axios.post<GenerateQuestionsResponse>(
        '/api/generate/questions',
        values
      );

      console.log("Generated question_categories : ", data);

      setInterviewFormValues(values);
      setQuestionsCategories(data.data.question_categories); // ✅ now properly typed

      setIsGeneratingQuestions(false);
    } catch (error) {
      console.error("Error generating questions: ", error);
      setIsGeneratingQuestions(false);
    }
  }

  // 2. Define interview creation submission for step 2.
  async function onCreateInterview() {
    if (!questionsCategories || !interviewFormValues) return;

    try {
      console.log('=== CLIENT-SIDE AUTH CHECK ===')

      // Check current session
      // const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      // console.log('Session error:', sessionError)
      console.log('Session exists:', !!session)
      console.log('Session user:', session?.user ? { id: session.user.id, email: session.user.email } : 'No user')

      if (!session) {
        console.log('❌ No session found - user needs to login again')
        // Redirect to login or show login prompt
        return
      }

      // Check if session is expired
      const now = Math.floor(Date.now() / 1000)
      const expiresAt = session.expires_at || 0
      console.log('Session expires at:', new Date(expiresAt * 1000))
      console.log('Current time:', new Date())
      console.log('Session expired:', now > expiresAt)

      if (now > expiresAt) {
        console.log('❌ Session expired - attempting refresh')
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()

        if (refreshError) {
          console.log('❌ Refresh failed:', refreshError)
          // Redirect to login
          return
        }

        console.log('✅ Session refreshed')
      }
      const { data } = await axios.post('/api/interview/create', {
        userId: user?.id,
        jobPosition: interviewFormValues.position,
        jobDescription: interviewFormValues.description,
        types: interviewFormValues.types,
        questions: questionsCategories,
        duration: interviewFormValues.duration,
      });

      console.log("Created interview: ", data);
      setCurrentInterview(data.interview);
      setStep(3);
      // router.push(`/dashboard/interviews/${data.id}`);
    } catch (error) {
      console.error("Error creating interview: ", error);
    }
  }

  useEffect(()=>{
    console.log("current interview is ", currentInterview)
  },[currentInterview])

  return (
    <div className='px-5 flex flex-col items-center justify-center '>
      <div className='w-full md:w-2/3 '>
        <div id="header" className='w-full flex flex-col items-center gap-3 '>
          <div className='w-full flex items-center gap-5 text-xl font-bold'>
            <ArrowLeft className='cursor-pointer hover:text-blue-600' onClick={() => router.back()} />
            <h2>Create Interview</h2>
          </div>
          <div id="progressbar" className='w-full mt-2'>
            <Progress value={step * 33.33} />
          </div>
        </div>
        {
          step == 1
            ?
            <InterviewForm onSubmit={onSubmit} />
            :
            (
              step == 2
                ?
                <QuestionsList questionsCategories={questionsCategories} isLoading={isGeneratingQuestions} onSubmit={onCreateInterview} />
                :
                <InterviewDetails interviewId={currentInterview?.id} />
            )
        }
      </div>
    </div>
  )
}

export default page