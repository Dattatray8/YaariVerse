import { GoogleGenAI } from "@google/genai";
import fs from "fs";

export const geminiGeneratedCaption = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    const mimeType = req.file.mimetype;
    const base64Image = fs.readFileSync(req.file.path, { encoding: "base64" });

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "Write a short, catchy, and engaging social media caption (max 100 words) for this image or video. Make it attention-grabbing with a strong opening line, reflect a friendly and relatable tone, and include a subtle call-to-action encouraging likes or comments. Keep the caption authentic and conversational as seen in popular social media apps. Only provide the caption text without additional explanation.",
            },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    fs.unlinkSync(req.file.path);
    return res.status(200).json({
      success: true,
      caption: response?.candidates?.[0]?.content?.parts?.[0]?.text || "",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error generating caption",
      error: error.message,
    });
  }
};
