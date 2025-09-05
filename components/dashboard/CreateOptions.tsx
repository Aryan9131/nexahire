'use client'
import { Phone, Video } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const CreateOptions = () => {
  const router = useRouter();
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 flex justify-center'>
      <div className='p-5 bg-white border border-gray-200 rounded-lg cursor-pointer hover:shadow-md' onClick={() => router.push('/dashboard/create-interview')}>
        <Video className='p-3 h-12 w-12 bg-blue-50 text-primary rounded-lg' />
        <h2 className='font-bold'>Create New Interview</h2>
        <p className='text-gray-500'>Create Ai interviews and schedule then with candidates</p>
      </div>
      <div className='p-5 bg-white border border-gray-200 rounded-lg cursor-pointer hover:shadow-md' onClick={() => router.push('/dashboard/create-phone-interview')}>
        <Phone className='p-3 h-12 w-12 bg-blue-50 text-primary rounded-lg' />
        <h2 className='font-bold'>Create New Phone Interview</h2>
        <p className='text-gray-500'>Create Ai phone interviews and schedule then with candidates</p>
      </div>
    </div>
  )
}

export default CreateOptions