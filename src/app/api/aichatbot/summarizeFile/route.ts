import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import pdfParse from "pdf-parse"; // Install with `npm install pdf-parse`
import cloudinary from "@/lib/cloudinary";
import fs from "fs/promises";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ✅ Upload file to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "learnix-temp" },
      async (error, result) => {
        if (error || !result) {
          return NextResponse.json({ error: "Cloudinary upload failed" }, { status: 500 });
        }

        const cloudinaryUrl = result.secure_url;
        console.log("✅ Cloudinary File URL:", cloudinaryUrl);

        // ✅ Download PDF from Cloudinary
        const fileRes = await axios.get(cloudinaryUrl, { responseType: "arraybuffer" });
        const pdfBuffer = Buffer.from(fileRes.data);

        // ✅ Extract text from PDF
        const data = await pdfParse(pdfBuffer);
        const extractedText = data.text;

        console.log("✅ Extracted Text:", extractedText);

        // ✅ Save Extracted Text as a Temporary `.txt` File
        const textFilePath = "/tmp/extracted_text.txt";
        await fs.writeFile(textFilePath, extractedText);

        // ✅ Upload Extracted Text to Cloudinary
        const textUploadResponse = await cloudinary.uploader.upload(textFilePath, {
          resource_type: "raw",
          folder: "learnix-temp",
        });

        const textCloudinaryUrl = textUploadResponse.secure_url;
        const textCloudinaryPublicId = textUploadResponse.public_id;

        console.log("✅ Text File Uploaded to Cloudinary:", textCloudinaryUrl);

        // ✅ Send extracted text to FastAPI AI summarization
        const aiResponse = await axios.post("http://127.0.0.1:8000/summarizeFile", {
          text: extractedText,
        });

        // ✅ Delete extracted text file from Cloudinary after use
        await cloudinary.uploader.destroy(textCloudinaryPublicId);

        return NextResponse.json({
          message: "File processed and summarized",
          textFileUrl: textCloudinaryUrl, // ✅ Provide link for debugging
          summary: aiResponse.data.summary,
        });
      }
    );

    uploadResponse.end(await file.arrayBuffer());
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
