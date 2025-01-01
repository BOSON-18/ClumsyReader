import { auth } from '@clerk/nextjs/server';
import React from 'react';
import { adminDb } from '../../../../../firsebaseAdmin';
import PdfView from '@/components/global/PdfView';
import Chat from '@/components/global/Chat';

type Params = Promise<{ id: string }>; // Defining the type for params

async function ChatToFilePage({
  params,
}: {
  params: Params;
}): Promise<React.ReactNode> { // Explicit return type
  // Await the params to get the `id`
  const { id } = await params; 

  // Authentication
  auth.protect();
  const { userId } = await auth();

  // Fetch the file reference from Firebase
  const ref = await adminDb.collection("users").doc(userId!).collection("files").doc(id).get();
  const url = (ref as any)._fieldsProto.downloadUrl.stringValue; // Extract download URL

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
  );
}

export default ChatToFilePage;
