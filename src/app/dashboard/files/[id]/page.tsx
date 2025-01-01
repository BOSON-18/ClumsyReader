import { auth } from '@clerk/nextjs/server'
import React from 'react'
import { adminDb } from '../../../../../firsebaseAdmin'
import PdfView from '@/components/global/PdfView'
import Chat from '@/components/global/Chat'

type Props = {
    params: { id: string }
}

const ChatToFilePage = async ({ params }: Props) => {
    const { id } = params; // no need to await params

    auth.protect(); // Protect the route

    const { userId } = await auth(); // Use the userId from Clerk's auth

    // Fetch the file from Firestore using the userId and id
    const ref = await adminDb.collection("users").doc(userId!).collection("files").doc(id).get();

    // Extract the download URL
    const url = (ref as any)._fieldsProto.downloadUrl.stringValue;

    return (
        <div className="grid lg:grid-cols-5 h-full overflow-hidden">
            {/* Right */}
            <div className="col-span-5 lg:col-span-2 overflow-y-auto">
                {/* Chat */}
                <Chat id={id} />
            </div>

            {/* Left */}
            <div className="col-span-5 lg:col-span-3 bg-gray-100 border-r-2 lg:border-indigo-600 lg:-order-1 overflow-auto">
                {/* PDFView */}
                <PdfView url={url} />
            </div>
        </div>
    )
}

export default ChatToFilePage;
