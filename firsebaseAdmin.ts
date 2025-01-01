import { initializeApp, getApps, App, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
// const serviceKey = require("./service_key.json");

const serviceKey = process.env.SERVICE_KEY_JSON;
if(!serviceKey){
    throw new Error("SERVICE_KEY_JSON is not set");
}
let app :App;
if(getApps().length===0){
    app =initializeApp({
        credential: cert(serviceKey),
    })
}else{
    app=getApp();
}

const adminDb=getFirestore(app);

export {app as adminApp,adminDb};
