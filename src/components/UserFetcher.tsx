"use client";  // ✅ Mark as a Client Component

import { useEffect } from "react";
import { fetchUserID } from "@/helpers/getUserId/route"; // Import function

export default function UserFetcher() {
  useEffect(() => {
    fetchUserID();
  }, []);

  return null; // No UI, just logic
}
