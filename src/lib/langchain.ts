import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "../../firsebaseAdmin"
import { auth } from "@clerk/nextjs/server";


const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-pro",   // You can change this to any other available model
    temperature: 0,            // Adjust the creativity of the output
    maxRetries: 2,             // Optional: Number of retry attempts
    apiKey: process.env.GEMINI_API_KEY, // Pass the API Key from environment variables
});
export const indexName = "clumsyreads"

async function generateDocs(docId: string) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("User not logged in")
    }

    console.log("Fetching the Donwload Url From Firebase Database");
    const fireBaseRef = await adminDb.collection("users").doc(userId).collection("files").doc(docId).get();
    const downloadUrl = fireBaseRef.data()?.downloadUrl;

    if (!downloadUrl) {
        throw new Error("Download URL Not Found");
    }

    //Fetch PDF From Specified URL
    const response = await fetch(downloadUrl);

    //BLOB_>Binary represenation of PDF
    const data = await response.blob();
    //Loading PDF into an PDFObject format
    const loader = new PDFLoader(data);
    const docs = await loader.load();

    //Splitting PDF into chunks
    console.log("Splitting the PDF")
    const splitter = new RecursiveCharacterTextSplitter();
    const splitDocs = await splitter.splitDocuments(docs);
    console.log(`Split into ${splitDocs.length} chunks`);
    return splitDocs;

}

async function namespaceExists(
    index: Index<RecordMetadata>,
    namespace: string
) {
    if (namespace === null) throw new Error("No namespace value provided.");
    const { namespaces } = await index.describeIndexStats();
    return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInPineConeVectorStore(docId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not logged in")
    }

    let pineconeVectorStore;

    // Generate embeddings (numerical representation) for the split documents
    console.log("Generating embeddings...");
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
    })
    const index = await pineconeClient.Index(indexName);
    const namespaceAlreadyExists = await namespaceExists(index, docId);

    if (namespaceAlreadyExists) {
        console.log("Namespace already exists");
        // No need to generete embeddings always so if already exits you chat model api call gets saved

        pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex: index,
            namespace: docId,
        })
        return pineconeVectorStore;
    } else {
        // namesapce doesnt exist download the pdf from firestore database .Download Url pass kri thi upload krte time And generate embeddings and store them in Pinecone vector store

        const splitDocs = await generateDocs(docId);
        console.log(`Storing the embeddings in namespace ${docId} in the ${indexName} PineCOne vector store`);

        pineconeVectorStore = await PineconeStore.fromDocuments(splitDocs, embeddings, {
            pineconeIndex: index,
            namespace: docId
        })
console.log("Upload DOne")
        return pineconeVectorStore;
    }
}