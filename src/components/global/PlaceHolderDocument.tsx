"use client"
import React from 'react'
import { Button } from '../ui/button'
import { PlusCircleIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

const PlaceHolderDocument = () => {
const router=useRouter();
    const handleClick = () => {
        //Check if user is free and usage is over limit usko bolo paisa de
        router.push("/dashboard/upload");
    }
    return (
        <Button onClick={handleClick} className="flex flex-col items-center w-64 h-80 rounded-xl bg-gray-200 drop-shadow-md text-gray-400">
            <PlusCircleIcon className='h-16 w-16' />
            <p>Add a document</p>
        </Button>
    )
}

export default PlaceHolderDocument