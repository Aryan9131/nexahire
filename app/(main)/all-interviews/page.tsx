'use client'
import { Interview } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Copy, Phone, Video } from 'lucide-react'
import React, { use, useEffect } from 'react'
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AllInterviews = () => {
    const { user, loading } = useAuth();
    const [prevInterviews, setPrevInterviews] = React.useState<Interview[]>([]);
    const handleCopyLink = (interviewId: number) => {
        navigator.clipboard.writeText(`http://localhost:3000/interview/${interviewId}`);
        console.log(`Copied: http://localhost:3000/interview/${interviewId}`);
        toast("Interview link copied to clipboard!");
    }

    useEffect(() => {
        // Fetch previously created interviews from an API or context
        const fetchInterviews = async () => {
            const response = await fetch(`/api/user/${user?.id}/interviews`);
            const data = await response.json();
            console.log("previous interviews data from api", data);
            // set only 3 latest interviews
            setPrevInterviews(data);
        };

        user && fetchInterviews();
    }, [user]);
    return (
        <div className='w-full my-5 p-5'>
            <div className='flex items-center justify-between'>
                <h1 className='text-lg font-bold'>Previously Created Interviews</h1>
            </div>
            {
                prevInterviews && prevInterviews.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4'>
                {/* Example Interview Card */}
                {prevInterviews?.map((i) => (
                    <div key={i.id} className='p-5 bg-white border border-gray-200 rounded-lg'>
                        <div className='flex items-center justify-between mb-4'>
                            <Video className='p-3 h-10 w-10 bg-blue-50 text-primary rounded-lg' />
                            <p className='text-sm text-gray-600'>{new Date(i.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className='flex flex-col justify-center items-start'>
                            <p className='font-semibold'>{i.jobPosition}</p>
                            <p className='text-sm text-gray-500'>{i.duration} Min</p>
                        </div>
                        <div className='flex justify-between items-center mt-4'>
                            {/* copy btn with icon */}
                            <Button onClick={() => handleCopyLink(i.id)} variant="outline" size={"lg"} className='cursor-pointer border border-gray-300 flex items-center text-sm text-gray-800 hover:text-gray-700 p-2'>
                                <Copy className='mr-1' /> Copy
                            </Button>

                            {/* send btn with icon */}
                            <Button variant="outline" size={"lg"} className='cursor-pointer flex items-center text-sm text-white p-2 bg-blue-600 hover:bg-blue-500 hover:text-white'>
                                <Phone className='mr-1' /> Send
                            </Button>
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

export default AllInterviews