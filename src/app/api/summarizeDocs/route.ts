import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import cloudinary from "@/lib/cloudinary";
import pdfParse from "pdf-parse";
import fs from "fs";
// Ensure you have `cloudinary.ts` in `src/lib/cloudinary.ts`
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ✅ Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Upload file to Cloudinary (temporary storage)
    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "learnix-temp" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const cloudinaryUrl = (uploadResponse as any).secure_url;
    const cloudinaryPublicId = (uploadResponse as any).public_id;

    console.log("✅ Uploaded File URL:", cloudinaryUrl);

    // ✅ Fetch file from Cloudinary & extract text
    const fileRes = await axios.get(cloudinaryUrl, {
      responseType: "arraybuffer",
    });
    const pdfBuffer = Buffer.from(fileRes.data);
    const data = await pdfParse(pdfBuffer);
    const extractedText = data.text;

    console.log("✅ Extracted Text:", extractedText);

    // ✅ Upload Extracted Text as a `.txt` file to Cloudinary
    const textFilePath = "/tmp/extracted_text.txt";
    fs.writeFile(textFilePath, extractedText, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("✅ Extracted text saved to file.");
      }
    });
    const textUploadResponse = await cloudinary.uploader.upload(textFilePath, {
      resource_type: "raw",
      folder: "learnix-temp",
    });

    const textCloudinaryUrl = textUploadResponse.secure_url;
    const textCloudinaryPublicId = textUploadResponse.public_id;

    console.log("✅ Extracted Text File URL:", textCloudinaryUrl);

    // ✅ Send extracted text to FastAPI AI summarization
    const aiResponse = await axios.post("http://localhost:8000/summarizeFile", {
      text: extractedText,
    });

    // ✅ Delete files from Cloudinary (Optional: Remove if debugging)
    await cloudinary.uploader.destroy(cloudinaryPublicId);
    await cloudinary.uploader.destroy(textCloudinaryPublicId);

    return NextResponse.json({
      message: "File processed and summarized",
      summary: aiResponse.data.summary,
      textFileUrl: textCloudinaryUrl, // Debugging
    },
  {
    status:200
  });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "File processing failed" },
      { status: 500 }
    );
  }
}
