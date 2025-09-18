import Image from 'next/image'
import React from 'react'
import rightTik from '../../assets/rightTik.svg.png'
import { Button } from '../ui/button'
import { ArrowLeft, Clock, Copy, Download, Logs, MailIcon, Menu, MessageSquare, MessageSquareText, Plus } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
const InterviewDetails = ({ interviewId }: { interviewId: string | undefined }) => {
  console.log("interview id coming is : ", interviewId)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/interview/${interviewId}`);
    console.log(`Copied: ${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/interview/${interviewId}`);
    toast("Interview link copied to clipboard!");
  }
  return (
    <div id="form" className="w-full my-5 rounded-lg p-6 ">
      <div className='flex justify-center items-center'>
        <Image src={rightTik} alt="Interview Image" width={50} height={50} />
      </div>
      <div className='text-center space-y-2 mt-3'>
        <h1 className='text-md font-bold'>Your Ai Interview is Ready!</h1>
        <p className='text-sm text-gray-600 font-semibold letter-spacing'>Share this link with your candidates to start the interview process</p>
      </div>
      <div className='bg-white rounded-lg p-4 mt-4'>
        <div className='flex justify-between items-center'>
          <p className='text-sm font-bold'>Interview Link</p>
          <p className='text-sm text-blue-400 bg-blue-100 rounded-lg px-2 py-1'>Valid for 10 days</p>
        </div>
        <div className='flex justify-between items-center my-2'>
          <div className='flex-1 bg-gray-100 border border-gray-200 p-2 rounded-lg mr-3'>
            <p className='text-sm text-gray-600'>{process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/interview/{interviewId}</p>
          </div>
          <Button variant="outline" className='cursor-pointer' onClick={handleCopyLink}> <Copy /> Copy Link</Button>
        </div>
        <hr className='my-4 w-full border-gray-200' />
        <div className='flex justify-start items-center text-sm text-gray-600 gap-6'>
            <div className='flex items-center'>
              <Clock className='w-4 h-4 mr-1' /> 
              <p>10 Min</p>
            </div>
            <div className='flex items-center'>
              <Logs className='w-4 h-4 mr-1' />
              <p>10 Questions</p>
            </div>
        </div>
      </div>
      <div className='bg-white rounded-lg p-4 mt-4'>
        <div className='flex justify-between items-center'>
          <p className='text-sm font-bold'>Share Via</p>
        </div>
        <div className='flex justify-start items-center my-2 gap-3'>
          <Button variant="outline" className='cursor-pointer' > < MessageSquare /> Slack</Button>
          <Button variant="outline" className='cursor-pointer mx-3 ' > <MailIcon /> Email </Button>
          <Button variant="outline" className='cursor-pointer ' > <MessageSquareText /> Whatsapp </Button>
        </div>
      </div>
      <div className=' mt-4 flex justify-between gap-2'>
        <Link href="/dashboard" >
          <Button variant="outline" className='p-5 cursor-pointer '><ArrowLeft /> Back to Dashboard</Button>
        </Link>
        <Link href="/interview/create-interview" >
          <Button variant="outline" className='bg-blue-600 cursor-pointer hover:bg-blue-500 hover:text-white text-white p-5'><Plus /> Create New Interview</Button>
        </Link>
      </div>
    </div>
  )
}

export default InterviewDetails