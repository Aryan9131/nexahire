'use client'
import Image from 'next/image'
import React, { useEffect } from 'react'
import logo2 from "@/assets/logo2.svg"
import interview from "@/assets/online-job-interview.png"
import { Clock, FileWarning, MessageCircleWarning, Video } from 'lucide-react'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Interview, useInterviewContext } from '@/context/interviewContext'
import { useParams } from 'next/navigation'
import { supabase } from '@/integrations/supabase/client'
import { set } from 'zod'
import { routerServerGlobal } from 'next/dist/server/lib/router-utils/router-server-context'
import { useRouter } from 'next/navigation'

const page = () => {
  const { interview_id } = useParams();
  console.log(interview_id);
  const { interviewData, setInterviewData } = useInterviewContext();
  console.log(interviewData);
  const [userName, setUserName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const router = useRouter();
  useEffect(() => {
    // call a function to fetch interview details based on id
    if (interview_id) {
      fetchInterviewDetails(interview_id);
    }
  }, [interview_id])

  // define a function to fetch a interview form supabase using id
  const fetchInterviewDetails = async (id: string | string[]) => {
    try {
      const { data, error } = await supabase
        .from('Interviews')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }
      console.log('Fetched interview details:', data);
      setInterviewData({
        id: data.id,
        jobPosition: data.jobPosition,
        jobDescription: data.jobDescription,
        duration: data.duration,
        types: data.types,
        userId: data.userId,
        questions: data.questions,
        created_at: data.createdAt,
      });
    } catch (error) {
      console.error('Error fetching interview details:', error);
    }
  };

  const handleJoinInterview = () => {
    setInterviewData({ ...interviewData, userName, email } as Interview);
    // Navigate to the interview room or perform any other action
    router.push(`/interview/${interview_id}/room`);
  };

  return (
    <div className='flex justify-center bg-gray-100 p-4'>
      <div className='px-4 py-3 bg-white rounded-md shadow-sm flex flex-col items-center justify-center w-full md:w-1/2'>
        <Image src={logo2} alt="Header Image" width={180} height={180} />
        <h2 className='text-md text-gray-600'>Ai-Powered Interview Platform</h2>
        <Image src={interview} alt="Header Image" width={250} height={250} className='my-5' />
        <h3 className='text-lg font-bold '>{interviewData?.jobPosition}</h3>
        <div className='flex items-center mt-2 text-gray-600'>
          <Clock className='mr-2 w-4 h-4' />
          <span>{interviewData?.duration} Minutes</span>
        </div>
        <div className='w-full md:w-1/2 mt-3'>
          <Label htmlFor="interview-name" className="text-sm text-gray-600">
            Enter your full name :
          </Label>
          <Input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            type="text"
            id="interview-name"
            placeholder='e.g. John Doe'
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
          
        </div>
         <div className='w-full md:w-1/2 mt-3'>
          <Label htmlFor="interview-email" className="text-sm text-gray-600">
            Enter your email :
          </Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="interview-email"
            placeholder='e.g. john.doe@example.com'
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
          
        </div>
        {/* instructions section */}
        <div className='w-full md:w-1/2 mt-4 bg-blue-100 p-4 rounded-md'>
          <div className='flex items-center'>
            <MessageCircleWarning className='inline-block mr-2 w-5 h-5 text-blue-500' />
            <h3 className='text-sm font-semibold'>Before you begin </h3>
          </div>
          <ul className='list-disc list-inside ml-2 mt-2 text-sm text-gray-600'>
            <li>Be on time for your interview.</li>
            <li>Ensure you have a quiet and well-lit space.</li>
            <li>Have your resume and any other necessary documents ready.</li>
          </ul>
        </div>

        <Button
          onClick={handleJoinInterview}
          className='mt-4 bg-blue-500 text-white flex items-center cursor-pointer' disabled={!userName}><Video className='mr-2 w-4 h-4' /> Start Interview</Button>
      </div>
    </div>
  )
}

export default page