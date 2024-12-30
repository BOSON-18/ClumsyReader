export const dynamic = 'force-dynamic'
import Documents from '@/components/global/Documents'
import PlaceHolderDocument from '@/components/global/PlaceHolderDocument'
import React from 'react'
const Dashboard = () => {
  return (
    <div className="flex flex-wrap p-5 bg-gray-100 justify-center lg:justify-start rounded-sm gap-5 max-w-7xl mx-auto">
<h1 className='text-3xl p5 bg-gray-100 font-extralight text-indigo-600'>
    My Documents
    {/* Map through documents */}
    {/* Placeholder Document */}
    <PlaceHolderDocument/>
    </h1>

    <Documents/>
    </div>
  )
}

export default Dashboard