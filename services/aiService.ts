
import { GoogleGenAI, Type } from "@google/genai";
import { BrandIdentity, Persona, UserProfile, DailyTask } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getNeuralContext = (profile: UserProfile | null) => {
  if (!profile) return "";
  return `
    ADOPT FOUNDER CONTEXT:
    Archetype: ${profile.archetype}
    Voice Tone: ${profile.tone.join(", ")}
    Core Values: ${profile.values.join(", ")}
    Expertise Domain: ${profile.expertise}
  `;
};

export const aiService = {
  // Chatbot logic
  async createChat(profile: UserProfile | null) {
    const context = getNeuralContext(profile);
    return ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `You are the shivam.ai neural core, an advanced brand architect. ${context} 
        Provide strategic, visionary, and data-backed advice. Be concise but profound.`,
      },
    });
  },

  async generateDailyTasks(brand: BrandIdentity | null, profile: UserProfile | null): Promise<DailyTask[]> {
    const context = getNeuralContext(profile);
    const brandName = brand?.name || "uninitialized brand";
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        ${context}
        Current Brand: ${brandName}.
        Generate 3 specific, high-impact day-to-day AI-based brand growth tasks for today.
        Use Google Search if needed to find current trends relevant to this brand.
      `,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['content', 'strategy', 'outreach'] },
              priority: { type: Type.STRING, enum: ['high', 'medium', 'low'] }
            },
            required: ["id", "title", "description", "type", "priority"]
          }
        }
      }
    });
    const tasks: any[] = JSON.parse(response.text || '[]');
    return tasks.map(t => ({ ...t, completed: false }));
  },

  async generateDNA(description: string, profile: UserProfile | null = null, preferredName?: string): Promise<BrandIdentity> {
    const context = getNeuralContext(profile);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        ${context}
        Generate a premium brand DNA based on: ${description}. 
        ${preferredName ? `MANDATORY: Use the name '${preferredName}' exactly.` : "If no name is provided in the description, generate a creative and relevant one."}
        Ensure the brand personality aligns with the founder's archetype.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            mission: { type: Type.STRING },
            colors: {
              type: Type.OBJECT,
              properties: {
                primary: { type: Type.STRING },
                secondary: { type: Type.STRING },
                accent: { type: Type.STRING },
                rationale: { type: Type.STRING }
              },
              required: ["primary", "secondary", "accent", "rationale"]
            },
            typography: {
              type: Type.OBJECT,
              properties: {
                heading: { type: Type.STRING },
                body: { type: Type.STRING },
                style: { type: Type.STRING }
              },
              required: ["heading", "body", "style"]
            }
          },
          required: ["name", "mission", "colors", "typography"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  },

  async profileAudience(niche: string): Promise<Persona[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create 3 detailed psychographic personas for the niche: ${niche}. Return strictly valid JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              demographics: { type: Type.STRING },
              fears: { type: Type.ARRAY, items: { type: Type.STRING } },
              desires: { type: Type.ARRAY, items: { type: Type.STRING } },
              habits: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["name", "demographics", "fears", "desires", "habits"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  },

  async searchLiveTrends(industry: string): Promise<{ data: string, links: any[] }> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `What are the top 3 most profitable untapped niches in ${industry} right now? Provide specific real-world data and trending news.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return {
      data: response.text || '',
      links: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  },

  async findLocalCompetitors(lat: number, lng: number, industry: string): Promise<{ data: string, links: any[] }> {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find top 5 ${industry} competitors near these coordinates: ${lat}, ${lng}. Provide their status and market position.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      }
    });
    return {
      data: response.text || '',
      links: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  },

  async generateBrandedImage(prompt: string, brandColors: any): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: `High-end commercial photography for: ${prompt}. Palette: ${brandColors.primary}, ${brandColors.secondary}. Lighting: Cinematic. Style: Premium Brand Asset.`,
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });
    const imagePart = response.candidates?.[0].content.parts.find((p: any) => p.inlineData);
    return imagePart ? `data:image/png;base64,${imagePart.inlineData.data}` : '';
  },

  async generateContent(prompt: string, type: string, profile: UserProfile | null): Promise<string> {
    const context = getNeuralContext(profile);
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `
        ${context}
        Act as a world-class ghostwriter. Write a high-authority ${type} about: ${prompt}. 
        Sound human, avoid clichés. Align with the founder's archetype and values.
      `,
    });
    return response.text || '';
  },

  async generateViralHooks(topic: string): Promise<{hook: string, score: number}[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 5 viral scroll-stopping headlines/hooks for: ${topic}. For each, provide a clickability score (0-100) based on current social algorithms.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              hook: { type: Type.STRING },
              score: { type: Type.NUMBER }
            },
            required: ["hook", "score"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  },

  async generateCarouselSlides(content: string): Promise<{title: string, body: string}[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Convert the following blog content into a 5-slide visual carousel script. Each slide should have a punchy title and 1-2 sentences of body text: ${content}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              body: { type: Type.STRING }
            },
            required: ["title", "body"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  },

  async generatePromoVideo(prompt: string): Promise<string> {
    const veoAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let operation = await veoAi.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Premium brand advertisement video: ${prompt}. High cinematic quality, 4k look, professional motion graphics style.`,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '16:9'
      }
    });
    
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await veoAi.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },

  async analyzeSentiment(brandName: string): Promise<{ data: string, score: number }> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze current social and search sentiment for "${brandName}" or similar brands in its niche. Provide a sentiment score from 0-100 and a brief summary.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            score: { type: Type.NUMBER }
          },
          required: ["summary", "score"]
        }
      }
    });
    const result = JSON.parse(response.text || '{}');
    return { data: result.summary || 'Neutral', score: result.score || 50 };
  }
};
