import { db } from "@/firebase/fireConfig";
import { collection, setDoc, doc } from "firebase/firestore";

export async function createNotification(notificationData) {
  const notifDocRef = doc(collection(db, "notifications"));
  setDoc(notifDocRef, notificationData);
}
