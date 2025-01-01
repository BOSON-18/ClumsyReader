"use client";

// import { generateEmbeddings } from "@/actions/generateEmbeddings";

import { useUser } from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore"; // Firestore functions
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebase";
import { generateEmbeddings } from "../actions/generateEmbeddings";

export enum StatusText {
  UPLOADING = "Uploading file...",
  UPLOADED = "File uploaded successfully",
  SAVING = "Saving file to database...",
  GENERATING = "Generating AI Embeddings, This will only take a few seconds...",
}

export type Status = StatusText[keyof StatusText];

function useUpload() {
  const [progress, setProgress] = useState<number | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const { user } = useUser();

  const handleUpload = async (file: File) => {
    if (!file || !user) return;

    const fileIdToUpload = uuidv4(); // Unique ID for the file
    const userDirectory = `users/${user.id}/files/${fileIdToUpload}`; // Define the path for the file in Vercel Blob
    console.log("User Directory->", userDirectory);
    setStatus(StatusText.UPLOADING);
    
    try {
      // Create a FormData object to send the file and user info
      const formData = new FormData();
      formData.append('file', file); // Append the file
      formData.append('userId', user.id); // Append the user ID
        console.log("Form Data->", formData);
      // Make a PUT request to upload the file to Vercel Blob
      const response = await fetch("https://5068-2401-4900-1c19-cb90-95b8-eabd-60d5-5ab8.ngrok-free.app/api/upload", {
        method: "PUT",
        body: formData,
      });
    //   const response = await fetch("/api/upload", {
    //     method: "PUT",
    //     body: formData,
    //   });

      if (!response.ok) {
        throw new Error("File upload failed.");
      }

      const blobData = await response.json(); // Get the response (blob URL and metadata)

      setStatus(StatusText.UPLOADED);

      // Save the file metadata to Firestore (or any other database)
      setStatus(StatusText.SAVING);

      console.log("Blob Data->", blobData);
      
      await setDoc(doc(db, "users", user.id, "files", fileIdToUpload), {
        name: file.name,
        size: file.size,
        type: file.type,
        downloadUrl: blobData.url,  // Vercel Blob URL
        ref: userDirectory,         // Reference to the blob file path in Vercel Blob
        createdAt: new Date(),
      });

      setStatus(StatusText.GENERATING);
      await generateEmbeddings(fileIdToUpload); // Call embeddings generation if needed

      setFileId(fileIdToUpload);
    } catch (error) {
      console.error("Error uploading file", error);
      setStatus("Upload failed.");
    }
  };

  return { progress, status, fileId, handleUpload };
}

export default useUpload;
