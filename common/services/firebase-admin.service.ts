// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import {initializeApp} from 'firebase-admin/app';

import {firebaseConfig} from "../../configs";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;