"use client";
import { useState } from "react";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/aichatbot/summarizeFile", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setSummary(data.summary);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">
          Upload a File for Summarization
        </h1>

        <div className="flex flex-col items-center space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-500 file:text-white
              hover:file:bg-blue-600 cursor-pointer"
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            className={`w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg
              ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
          >
            {loading ? "Processing..." : "Upload & Summarize"}
          </button>
        </div>

        {summary && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
            <h2 className="text-lg font-semibold">Summary:</h2>
            <p className="text-gray-700 mt-2">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}
