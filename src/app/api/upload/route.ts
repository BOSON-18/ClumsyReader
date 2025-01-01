import { put } from '@vercel/blob';

export async function PUT(request: Request) {

  
  // Parse the form data
  const form = await request.formData();
  const file = form.get('file') as File; // The file object from form data
  const userId = form.get('userId') as string; // The user ID passed in the form data

  // Ensure that both the file and userId are present
  if (!file || !userId) {
    return new Response('File or user ID is missing', { status: 400 });
  }

  // Define the file path in Vercel Blob with the user ID
  const filePath = `users/${userId}/files/${file.name}`;
  console.log("File Path->", filePath);

  try {
    // Upload the file to Vercel Blob with public access
    const blob = await put(filePath, file, { access: 'public' });

    // Return the blob metadata as the response, including the URL of the uploaded file
    return Response.json(blob);
  } catch (error) {
    console.error('Error uploading file:', error);
    return new Response('Error uploading file', { status: 500 });
  }
}
// Example Blob
// {
//     pathname: 'profilesv1/user-12345.txt',
//     contentType: 'text/plain',
//     contentDisposition: 'attachment; filename="user-12345.txt"',
//     url: 'https://ce0rcu23vrrdzqap.public.blob.vercel-storage.com/profilesv1/user-12345-NoOVGDVcqSPc7VYCUAGnTzLTG2qEM2.txt'
//     downloadUrl: 'https://ce0rcu23vrrdzqap.public.blob.vercel-storage.com/profilesv1/user-12345-NoOVGDVcqSPc7VYCUAGnTzLTG2qEM2.txt?download=1'
//   }