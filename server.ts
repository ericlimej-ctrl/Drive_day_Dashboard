import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Gemini Client initialization with server-side API Key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Maps Grounding Fuel and Route Assistance endpoint
app.post('/api/fuel-advice', async (req, res) => {
  try {
    const { prompt, lat = 1.3521, lng = 103.8198 } = req.body;

    const userPrompt = prompt || 
      'Find top petrol kiosks and fuel stations near Tampines and Central Singapore, along with tips for optimizing expressway fuel consumption on PIE and KPE.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: Number(lat) || 1.3521,
              longitude: Number(lng) || 103.8198,
            },
          },
        },
      },
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    res.json({
      text,
      groundingChunks,
    });
  } catch (error: any) {
    console.error('Error in /api/fuel-advice:', error);
    res.status(500).json({
      error: error?.message || 'Failed to query Google Maps grounding data.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Day_drive server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
