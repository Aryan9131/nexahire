'use client'
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, Copy, Phone, Video } from 'lucide-react'
import React, { use, useEffect } from 'react'
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export interface ScheduledInterview {
  id: number
  userId: string
  jobPosition: string | null
  jobDescription: string | null
  questions: JSON | null
  created_at: string
  duration: number | null
  types?: string[] | null
  Feedbacks?:[{
    id: number
    interview_id: number
    userName: string
    userEmail: string
    feedback: JSON
    created_at: string
  }]
}

const ScheduledInterviews = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [scheduledInterviews, setScheduledInterviews] = React.useState<ScheduledInterview[]>([]);
    const handleCopyLink = (interviewId: number) => {
        navigator.clipboard.writeText(`http://localhost:3000/interview/${interviewId}`);
        console.log(`Copied: http://localhost:3000/interview/${interviewId}`);
        toast("Interview link copied to clipboard!");
    }

    useEffect(() => {
        // Fetch previously created interviews from an API or context
        const fetchInterviews = async () => {
            const response = await fetch(`/api/user/${user?.id}/scheduled`);
            const data = await response.json();
            console.log("previous interviews data from api", data);
            setScheduledInterviews(data);
        };

        user && fetchInterviews();
    }, [user]);
    return (
        <div className='w-full my-5 p-5'>
            <div className='flex items-center justify-between'>
                <h1 className='text-lg font-bold'>Scheduled Interviews</h1>
            </div>
            {
                scheduledInterviews && scheduledInterviews.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
                {/* Example Interview Card */}
                {scheduledInterviews?.map((i) => (
                    <div key={i.id} className='p-5 bg-white border border-gray-200 rounded-lg'>
                        <div className='flex items-center justify-between mb-4'>
                            <Video className='p-3 h-10 w-10 bg-blue-50 text-primary rounded-lg' />
                            <p className='text-sm text-gray-600'>{new Date(i.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className='flex flex-col justify-center items-start'>
                            <p className='font-semibold'>{i.jobPosition}</p>
                            <div className='w-full my-2 flex justify-between '>
                                 <p className='text-sm text-gray-500'>{i.duration} Min</p>
                                 <p className='text-sm text-green-500'>{i.Feedbacks?.length || 0} Candidates</p>
                            </div>
                        </div>
                        <div className='w-full flex justify-between items-center mt-4' onClick={()=>{router.push(`/scheduled/${i.id}`)}}>
                              <Button variant="outline" size={"lg"} className='p-2 w-full flex items-center justify-between cursor-pointer shadow-sm'>View Details <ArrowRight className='animate-pulse'/></Button>
                        </div>
                    </div>

                ))}
            </div>
                )
                :
                <p className='text-gray-500 text-center py-10'>No previous interviews found.</p>
            }
        </div>
    )
}

export default ScheduledInterviews