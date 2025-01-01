import { auth } from '@clerk/nextjs/server'
import React from 'react'
import { adminDb } from '../../../../../firsebaseAdmin'
import PdfView from '@/components/global/PdfView'
import Chat from '@/components/global/Chat'

type Props = {
    params: { id: string }
}

// No need to `await` the `params` since it's already available
const ChatToFilePage = async ({ params }: Props) => {
    const { id } = params; // Directly use params here, no need to await it
    auth.protect();
    const { userId } = await auth();

    const ref = await adminDb.collection("users").doc(userId!).collection("files").doc(id).get();
    const url = (ref as any)._fieldsProto.downloadUrl.stringValue; // Access URL

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

export default ChatToFilePage
