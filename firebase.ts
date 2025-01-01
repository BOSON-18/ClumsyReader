import { getApp,getApps,initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDYkPr5Dh02NPWX059Eh0BKH5qXIyH0loU",
    authDomain: "clumsyreader-25a3f.firebaseapp.com",
    projectId: "clumsyreader-25a3f",
    storageBucket: "clumsyreader-25a3f.firebasestorage.app",
    messagingSenderId: "954144484048",
    appId: "1:954144484048:web:f702117308eef29f074cd5",
    measurementId: "G-RMHDT9X0D4"
  };

  const app=getApps().length===0?initializeApp(firebaseConfig):getApp();
  const db=getFirestore(app);
  const storage=getStorage(app);

  export {db,storage};