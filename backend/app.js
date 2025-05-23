import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

const topics = [
    "sports",
    "computers",
    "random Facts",
    "Animals",
    "Food",
    "facts about a random country",
    "a random person",
    "a random place",
    "a random event",
]

function generateTopic() {
    return topics[Math.floor(Math.random() * topics.length)];
}

dotenv.config();

const app = express();
const port = 3000;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generatRandomParagraph(topic) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        temperature: 0.9,
        maxOutputTokens: 100,
        contents: `Write a 5 sentence paragraph about ${topic}. Be creative and specific.`,
    });
    return response.text;
}


app.get('/random-paragraph', async (req, res) => {
    const topic = generateTopic();
    try {
        const paragraph = await generatRandomParagraph(topic);
        res.json({ topic, paragraph });
    } catch (error) {
        console.error('Error generating paragraph:', error);
        res.status(500).json({ error: 'Failed to generate paragraph' });
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

