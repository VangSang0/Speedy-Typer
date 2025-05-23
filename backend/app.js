import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

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
    "science discoveries",
    "historical events",
    "space exploration",
    "ocean mysteries",
    "ancient civilizations",
    "modern technology",
    "art and culture",
    "music genres",
    "literature classics",
    "inventions that changed the world"
]

// Add more variety with subtopics and random elements
const randomElements = [
    "unusual", "fascinating", "mysterious", "incredible", "bizarre", 
    "surprising", "remarkable", "extraordinary", "peculiar", "amazing"
];

const timeperiods = [
    "from the 1800s", "from ancient times", "from the future", "from today", 
    "from the medieval period", "from the 1960s", "from prehistoric times"
];

function generateTopic() {
    const baseTopic = topics[Math.floor(Math.random() * topics.length)];
    const randomElement = randomElements[Math.floor(Math.random() * randomElements.length)];
    const timePeriod = Math.random() > 0.7 ? timeperiods[Math.floor(Math.random() * timeperiods.length)] : "";
    
    return `${randomElement} ${baseTopic} ${timePeriod}`.trim();
}

// Add a timestamp and random seed to make each request unique
function generateUniquePrompt(topic) {
    const randomSeed = Math.floor(Math.random() * 10000);
    const timestamp = Date.now();
    
    return `Write a creative 3-sentence paragraph about ${topic}. 
    Make it completely unique and different from typical information. 
    Include specific details, numbers, or examples. 
    Be creative and unexpected.
    Random seed: ${randomSeed}, Time: ${timestamp}`;
}

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'frontend')));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generatRandomParagraph(topic) {
    const uniquePrompt = generateUniquePrompt(topic);
    
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        temperature: 1.0,  
        maxOutputTokens: 30,  
        topP: 0.95,  
        contents: uniquePrompt,
    });
    return response.text;
}

app.get('/random-paragraph', async (req, res) => {
    const topic = generateTopic();

    try {
        let paragraph = await generatRandomParagraph(topic);
        res.json({ topic, paragraph });
        console.log('Generated paragraph for topic:', topic);
    } catch (error) {
        console.error('Error generating paragraph:', error);
        res.status(500).json({ error: 'Failed to generate paragraph' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});