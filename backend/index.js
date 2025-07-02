import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Google Generative AI setup
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

app.use(cors());
app.use(express.json());

// Broad spectrum list of healthcare-related keywords
const healthcareKeywords = [
  // General medical terms
  "doctor", "practitioner", "consultation", "appointment", "clinic", "hospital", "healthcare", "medical", "lab tests", "diagnosis",

  // Conditions and symptoms
  "anemia", "diabetes", "thyroid", "pcos", "pcod", "migraine", "piles", "fatigue", "stress", "infection", "digestive issues",

  // Treatments and procedures
  "treatment", "therapy", "physiotherapy", "detox", "recovery", "checkup", "preventive care", "diet consultation",

  // Specialties and alternative therapies
  "ayurveda", "homeopathy", "naturopathy", "siddha", "yoga", "meditation", "chiropractic", "mental wellness", "nutrition therapy",

  // Body parts / systems
  "lungs", "heart", "liver", "kidney", "stomach", "immune system", "nervous system", "digestive system", "reproductive system",

  // Wellness and lifestyle
  "nutrition", "diet", "fitness", "stress", "mental health", "wellbeing", "sleep", "exercise", "hydration", "holistic health",

  // Health tech and tools
  "fitbook", "health tracker", "naturefit app", "online consultation", "digital health", "telehealth", "data security", "health reports",

  // Products and supplements
  "supplements", "herbal", "probiotics", "plant-based", "vitamin b12", "antioxidants", "immune support", "lung detox", "natural remedies",

  // Community and wellness programs
  "wellness voucher", "health forum", "group sessions", "community care", "public health", "personalized care"
];

// Function to check if a query is healthcare-related
const isHealthcareQuery = (message) => {
  return healthcareKeywords.some((keyword) =>
    message.toLowerCase().includes(keyword)
  );
};

// Route to handle chatbot messages
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Check if the query is healthcare-related
  if (!isHealthcareQuery(message)) {
    return res.json({
      reply: "I'm specialized in healthcare. Please ask me about medical topics!",
    });
  }

  try {
    // Format the prompt to keep responses healthcare-centric
    const prompt = `You are a healthcare AI assistant. Answer only in the context of medical and healthcare topics. 
    If the user asks about other topics, politely decline. Now answer the following:
    
    User: ${message}
    AI:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
