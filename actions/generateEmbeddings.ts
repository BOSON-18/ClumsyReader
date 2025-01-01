'use server'

import { generateEmbeddingsInPineConeVectorStore } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

export async function generateEmbeddings(docId: string) {

    auth.protect();//protect with clerk not logged in sign krke aao fir
// Pdf->Embeddings
    await generateEmbeddingsInPineConeVectorStore(docId);

    revalidatePath('/dashboard');//refetch dashbordpage and get the new embeddings/document here
    
    return {completed:true}
}