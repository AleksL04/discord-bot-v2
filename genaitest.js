import { GoogleGenAI } from "@google/genai";
import config from "./config.js"

const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

const yourQueryString = "A chill lofi playlist for studying"; 

// 1. UPDATED: The system prompt now demands a JSON array output
const systemPrompt = `You are a playlist assistant. Your only task is to generate a list of 10 songs based on the user's request.
You MUST output a single, valid JSON array.
Each element in the array must be a string in the format: "Song Name by Artist".
Do NOT output anything else (like "Here is your list:" or \`\`\`json ... \`\`\`).
Your entire response must be ONLY the JSON array.`;

async function generatePlaylist(query) {
    try {
        console.log(`Generating playlist for: "${query}"...`);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: query,
            config: {
                systemInstruction: systemPrompt
            },
            // 2. NEW: This forces the model to output valid JSON
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        // 3. UPDATED: We now parse the JSON string, we don't .split()
        const rawText = response.text;
        const playlist = JSON.parse(rawText);
        
        // This logs the final array, ready for a loop
        console.log(playlist);
        
        // Example of how you can now loop over it
        console.log("\n--- Looping over the array: ---");
        for (const song of playlist) {
            console.log(`Found song: ${song}`);
        }

        return playlist;

    } catch (error) {
        console.error("Error generating content:", error);
    }
}

// Run the function
generatePlaylist(yourQueryString);