"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
const app_1 = require("firebase-admin/app");
const configs_1 = require("../../configs");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Initialize Firebase
const app = (0, app_1.initializeApp)(configs_1.firebaseConfig);
exports.default = app;
