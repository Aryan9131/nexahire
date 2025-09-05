import Image from 'next/image'
import React from 'react'
import logo2 from "@/assets/logo2.svg"

const Header = () => {
  return (
    <div className='px-4 py-1 border border-gray-200 flex items-center'>
      <Image src={logo2} alt="Header Image" width={250} height={250} />
    </div>
  )
}

export default Header