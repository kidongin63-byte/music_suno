
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { LyricsRequest, GeneratedLyrics } from "../types";

export const generateLyrics = async (params: LyricsRequest): Promise<GeneratedLyrics> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Create professional song lyrics and AI music generator prompts.
    IMPORTANT: All Korean text must be encoded in UTF-8. 
    
    Parameters:
    Genre: ${params.genre}
    Theme: ${params.theme}
    Mood: ${params.mood}
    Lyrics Language: ${params.language}
    Vocal Style Instruction: ${params.style}
    Selected Voice Artist: ${params.voice}
    Song Subject (Who is the song about/for): ${params.targetSubject}
    User's Story/Reference Text: "${params.referenceText || "None provided"}"

    Requirements:
    1. Title: Creative title in the requested language.
    2. Sections: Standard song structure (Intro, Verse, Chorus, Bridge, Outro).
    3. stylePrompt (English): 5-10 comma-separated keywords for Suno/Udio (e.g., "K-Pop, Future Bass, Synthesizers, Upbeat, 128BPM").
    4. vocalPrompt (English): Specific vocal description for Suno/Udio (e.g., "Emotional female vocals, airy, soul-searching, expressive").
    5. explanation (Korean): Brief insight into the song's meaning in Korean.
    
    CRITICAL INSTRUCTION FOR LYRICS:
    If "User's Story/Reference Text" is provided, you MUST incorporate its key phrases, specific imagery, and underlying emotion into the lyrics. Do not just copy it, but adapt it artistically into the song structure.

    Response must be a valid JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            stylePrompt: { type: Type.STRING },
            vocalPrompt: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["type", "content"]
              }
            },
            explanation: { type: Type.STRING }
          },
          required: ["title", "sections", "stylePrompt", "vocalPrompt"]
        }
      }
    });

    const resultText = response.text || "{}";
    return JSON.parse(resultText) as GeneratedLyrics;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("가사와 프롬프트를 생성하는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
};

export const generateAudio = async (text: string, voiceName: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Expressively narrate these lyrics with a musical soul: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName as any },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("Audio data not found");
    return base64Audio;
  } catch (error) {
    console.error("TTS Error:", error);
    throw new Error("음성 미리보기를 생성할 수 없습니다.");
  }
};

export const decodeBase64Audio = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
