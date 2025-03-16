import axios from "axios";
import { useChatStore } from "@/store/chatStore";

export const fetchUserID = async () => {
  try {
    const response = await axios.get("/api/auth/me"); // Change this to your actual API
    const userID = response.data.userID;

    if (userID) {
      useChatStore.getState().setUserID(userID);
      console.log("✅ Stored userID in Zustand:", userID);
    } else {
      console.error("🚨 No userID found in response");
    }
  } catch (error) {
    console.error("🚨 Error fetching userID:", error);
  }
};
