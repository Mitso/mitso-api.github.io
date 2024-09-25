import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection } from "firebase/firestore";
const configs = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  databaseURL: process.env.FIREBASE_DB_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};
initializeApp(configs);
const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
};
express.json();
express.urlencoded({ extended: true });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.options("*", cors(corsOptions));
const store = getFirestore();
app.get("/", async (req, res) => {
  const getData = await getDocs(collection(store, "home"));
  getData.forEach((item) => {
    console.log(">>", item.id, item.data());
  });
  res.send("Running express.js API");
});
app.post("/signup", cors(corsOptions), (req, res) => {
  res.send("The server has received your request.");
});
const viteNodeApp = app;
export {
  viteNodeApp
};
