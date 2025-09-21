
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
import { ImageFile } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (file: ImageFile) => {
  return {
    inlineData: {
      data: file.base64,
      mimeType: file.mimeType,
    },
  };
};

export const generateCaption = async (prompt: string, image?: ImageFile): Promise<string> => {
  const model = 'gemini-2.5-flash';
  const parts: any[] = [{ text: prompt }];
  if (image) {
    parts.unshift(fileToGenerativePart(image));
  }

  const response: GenerateContentResponse = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                captions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: {type: Type.STRING},
                            caption: {type: Type.STRING},
                            hashtags: {type: Type.STRING}
                        }
                    }
                }
            }
        }
    }
  });

  return response.text;
};

export const editImage = async (prompt: string, image: ImageFile): Promise<GenerateContentResponse> => {
  const model = 'gemini-2.5-flash-image-preview';
  const imagePart = fileToGenerativePart(image);
  const textPart = { text: prompt };

  const response = await ai.models.generateContent({
    model,
    contents: { parts: [imagePart, textPart] },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  return response;
};


export const generateVideo = async (prompt: string, image?: ImageFile) => {
    const model = 'veo-2.0-generate-001';
    
    let operation;
    if (image) {
        operation = await ai.models.generateVideos({
            model,
            prompt,
            image: {
                imageBytes: image.base64,
                mimeType: image.mimeType
            },
            config: { numberOfVideos: 1 }
        });
    } else {
        operation = await ai.models.generateVideos({
            model,
            prompt,
            config: { numberOfVideos: 1 }
        });
    }

    return operation;
}

export const checkVideoStatus = async (operation: any) => {
    return await ai.operations.getVideosOperation({ operation });
}

export const getArtStyleAdvice = async (prompt: string, image: ImageFile): Promise<string> => {
  const model = 'gemini-2.5-flash';
  const imagePart = fileToGenerativePart(image);
  const textPart = { text: prompt };

  const response: GenerateContentResponse = await ai.models.generateContent({
    model,
    contents: { parts: [imagePart, textPart] },
  });

  return response.text;
};

export const getMarketingAdvice = async (topic: string): Promise<string> => {
    const model = 'gemini-2.5-flash';
    const prompt = `As a digital marketing expert for artisans, provide detailed advice on: "${topic}". Structure your response clearly with actionable steps.`;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt
    });

    return response.text;
}