
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyAxAiZbfcSanGNSJPyD3f-ggf5WJHkCXF8",
	authDomain: "mawa-6f2ef.firebaseapp.com",
	projectId: "mawa-6f2ef",
	storageBucket: "mawa-6f2ef.firebasestorage.app",
	messagingSenderId: "215888482553",
	appId: "1:215888482553:web:6347ebf1a2fa9a21c3d228"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
