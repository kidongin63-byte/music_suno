
export interface LyricsRequest {
  genre: string;
  theme: string;
  mood: string;
  language: string;
  style: string;
  voice?: string;
  targetSubject?: string; // New field for the subject of the song
  referenceText?: string; // New field for user's own story or phrases
}

export interface SongSection {
  type: string;
  content: string;
}

export interface GeneratedLyrics {
  title: string;
  sections: SongSection[];
  stylePrompt: string; // Music style tags (e.g., genre, instruments)
  vocalPrompt: string; // Vocal specific tags for Suno/Udio
  explanation?: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'male' | 'female';
  description: string;
  geminiVoice: string; 
}
