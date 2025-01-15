import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { request } = await req.json();

    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_CHAT_FILE_GENERATE
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: request }],
        },
      ],
    });

    const result = await chat.sendMessage(request);
    const structure = result.response.text();

    return Response.json({ structure });
  } catch (error) {
    console.error("Error generating structure:", error);
    return Response.json(
      { error: "Failed to generate file structure" },
      { status: 500 }
    );
  }
}
