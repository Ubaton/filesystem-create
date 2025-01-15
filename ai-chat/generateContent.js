const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_CHAT_FILE_GENERATE
);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [{ text: "Hello" }],
    },
    {
      role: "model",
      parts: [{ text: "Great to meet you. What would you like to know?" }],
    },
  ],
});

let result = await chat.sendMessage("I have 2 dogs in my house.");
console.log(result.response.text());
let result2 = await chat.sendMessage("How many paws are in my house?");
console.log(result2.response.text());
