import Image from 'next/image'
import React from 'react'

import rightTik from '@/assets/rightTik.svg.png'
import onlineJobVector from '@/assets/online-job-interview.png'
import { Send } from 'lucide-react'

const page = () => {
  return (
    <div className='flex flex-col justify-center items-center my-5'>
        <div className="flex justify-center items-center">
            <Image src={rightTik} alt="Description" width={50} height={50} />
        </div>
        <div className='flex flex-col justify-center items-center mt-4 space-y-2'>
            <h1 className='text-2xl font-bold'>Interview Completed Successfully</h1>
            <p className='text-sm text-gray-500'>Your interview has been successfully completed. Thank you for your participation!</p>
        </div>
        <div className="flex justify-center items-center">
            <Image src={onlineJobVector} alt="Description" width={300} height={300} />
        </div>
        <div className='flex flex-col justify-center items-center mt-4 space-y-2'>
            <Send className='text-white bg-blue-500 w-15 h-15 p-4 rounded-full' />
            <h1 className='text-2xl font-bold'>What Next ?</h1>
            <p className='text-sm text-gray-500'>Our team will review your performance and get back to you shortly.</p>
        </div>
    </div>
  )
}

export default page