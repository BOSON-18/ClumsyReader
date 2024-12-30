import { ClerkLoaded } from '@clerk/nextjs'
import React from 'react'


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ClerkLoaded>
            <div>
                {/* Header */}
                {children}
            </div>


        </ClerkLoaded>
    )
}

export default DashboardLayout