
import React, { useState, useRef } from 'react';
import InputField from './components/InputField';
import { generateLyrics, generateAudio, decodeBase64Audio, decodeAudioData } from './services/geminiService';
import { GeneratedLyrics, VoiceOption } from './types';

const OPTIONS = {
  targetSubject: [
    "나 자신", "아내", "남편", "여자친구", "남자친구",
    "헤어진 연인", "짝사랑", "썸 타는 사이", "부모님", "아이(자녀)",
    "할머니/할아버지", "형제/자매", "친구", "반려동물", "선생님",
    "직장동료", "라이벌", "팬(Fan)", "떠난 이(추모)", "미래의 나", "직접 쓰기"
  ],
  genre: ["발라드", "힙합", "록", "팝", "트로트", "R&B", "재즈", "EDM", "포크", "시티팝", "국악 크로스오버", "뉴에이지", "디스코", "블루스", "펑크(Funk)", "직접 쓰기"],
  theme: ["사랑", "이별", "희망", "우정", "도시의 밤", "여행", "그리움", "청춘", "꿈", "고독", "한(恨)", "가족", "고향", "계절의 변화", "나 자신", "직접 쓰기"],
  mood: ["신나는", "슬픈", "몽환적인", "열정적인", "차분한", "웅장한", "귀여운", "어두운", "평화로운", "긴장감", "애절한", "아련한", "비장한", "나른한", "상큼한", "직접 쓰기"],
  language: ["한국어", "English", "日本語", "Español", "Français", "Deutsch", "Italiano", "Tiếng Việt", "ภาษาไทย", "Русский", "직접 쓰기"],
  style: ["90년대 감성", "어쿠스틱", "로우파이", "신스팝", "밴드 사운드", "오케스트라", "미니멀", "그루비한", "빈티지", "트렌디한", "동양적인", "서사적인", "몽글몽글한", "파워풀한", "잔잔한", "직접 쓰기"]
};


const VOICES: VoiceOption[] = [
  { id: 'f1', name: '서아', gender: 'female', description: '부드러운 발라드', geminiVoice: 'Kore' },
  { id: 'f2', name: '지민', gender: 'female', description: '파워풀한 록', geminiVoice: 'Kore' },
  { id: 'f3', name: '하은', gender: 'female', description: '몽글몽글 인디', geminiVoice: 'Kore' },
  { id: 'f4', name: '소윤', gender: 'female', description: '애절한 한의 정서', geminiVoice: 'Kore' },
  { id: 'f5', name: '리사', gender: 'female', description: '트렌디 시티팝', geminiVoice: 'Kore' },
  { id: 'f6', name: '영숙', gender: 'female', description: '전통 트로트 여왕', geminiVoice: 'Kore' },
  { id: 'f7', name: '정희', gender: 'female', description: '우아한 고전미', geminiVoice: 'Kore' },
  { id: 'f8', name: '옥자', gender: 'female', description: '따뜻한 어머니의 품', geminiVoice: 'Kore' },
  { id: 'f9', name: '미경', gender: 'female', description: '호소력 짙은 성인가요', geminiVoice: 'Kore' },
  { id: 'f10', name: '혜숙', gender: 'female', description: '구성진 민요 스타일', geminiVoice: 'Kore' },
  { id: 'm1', name: '도윤', gender: 'male', description: '감미로운 R&B', geminiVoice: 'Puck' },
  { id: 'm2', name: '건우', gender: 'male', description: '강렬한 힙합', geminiVoice: 'Fenrir' },
  { id: 'm3', name: '시우', gender: 'male', description: '차분한 어쿠스틱', geminiVoice: 'Zephyr' },
  { id: 'm4', name: '민호', gender: 'male', description: '웅장한 대서사', geminiVoice: 'Charon' },
  { id: 'm5', name: '준서', gender: 'male', description: '신나는 팝', geminiVoice: 'Puck' },
  { id: 'm6', name: '철수', gender: 'male', description: '묵직한 중저음 매력', geminiVoice: 'Charon' },
  { id: 'm7', name: '광식', gender: 'male', description: '신명나는 트로트 가락', geminiVoice: 'Puck' },
  { id: 'm8', name: '태성', gender: 'male', description: '연륜 있는 미성', geminiVoice: 'Zephyr' },
  { id: 'm9', name: '덕배', gender: 'male', description: '거칠고 야성적인 창법', geminiVoice: 'Fenrir' },
  { id: 'm10', name: '성진', gender: 'male', description: '편안한 중년의 감성', geminiVoice: 'Zephyr' },
];

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [result, setResult] = useState<GeneratedLyrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [voiceTab, setVoiceTab] = useState<'female' | 'male'>('female');

  const [form, setForm] = useState({
    genre: '발라드',
    theme: '사랑',
    mood: '차분한',
    language: '한국어',
    style: '어쿠스틱',
    targetSubject: '나 자신',
    referenceText: '', // User's custom input text
    voiceId: 'f1'
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const selectedVoice = VOICES.find(v => v.id === form.voiceId);
      const lyrics = await generateLyrics({ ...form, voice: selectedVoice?.description });
      setResult(lyrics);
      requestAnimationFrame(() => {
        const element = document.getElementById('result-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = async () => {
    if (!result) return;
    setAudioLoading(true);
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const selectedVoice = VOICES.find(v => v.id === form.voiceId);
      const fullText = result.sections.map(s => s.content).join(' ');
      const base64 = await generateAudio(fullText.substring(0, 1000), selectedVoice?.geminiVoice || 'Kore');

      const audioData = decodeBase64Audio(base64);
      const audioBuffer = await decodeAudioData(audioData, audioContextRef.current);

      // Stop existing audio if playing
      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.stop();
        } catch (e) { /* ignore */ }
      }

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start();
      audioSourceRef.current = source;
    } catch (err) {
      alert("오디오 재생 중 오류가 발생했습니다.");
    } finally {
      setAudioLoading(false);
    }
  };

  const copyToClipboard = (textToCopy: string, message: string) => {
    navigator.clipboard.writeText(textToCopy);
    alert(message);
  };

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 max-w-6xl mx-auto selection:bg-indigo-100 bg-[#fdfdff]">
      {/* Header */}
      <header className="pt-16
       pb-5 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-br from-indigo-100/30 to-rose-100/30 blur-[120px] rounded-full -z-10 animate-pulse"></div>

        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-6">
          <span className="bg-gradient-to-br from-gray-900 via-indigo-900 to-rose-900 bg-clip-text text-transparent">
            새로운시작
          </span>
        </h1>
        <p className="mt-6 text-gray-400 max-w-xl mx-auto text-lg font-medium tracking-tight leading-relaxed px-4">
          전 세대의 감성을 아우르는<br />Suno AI 최적화 프롬프트와 함께 완성하는 나만의 걸작
        </p>
      </header>

      {/* Main Input Box */}
      <main className="relative group p-1">
        <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-rose-200 rounded-[4rem] blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

        <div className="relative bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] p-8 md:p-12 border border-gray-100 overflow-hidden">
          <div className="space-y-20">
            <div className="grid grid-cols-1 gap-12">
              <InputField label="노래의 주인공 (대상)" icon="👤" value={form.targetSubject} onChange={(v) => setForm({ ...form, targetSubject: v })} options={OPTIONS.targetSubject} colorScheme="rose" />

              {/* New Reference Text Input */}
              <div className="flex flex-col space-y-4">
                <label className="text-base font-bold text-gray-800 flex items-center tracking-tight">
                  <span className="mr-2 text-xl filter drop-shadow-sm">📝</span>
                  나만의 이야기 / 참조 글귀 (선택)
                </label>
                <div className="relative">
                  <textarea
                    value={form.referenceText}
                    onChange={(e) => setForm({ ...form, referenceText: e.target.value })}
                    placeholder="가사에 넣고 싶은 문장, 현재 느끼는 감정, 혹은 편지 내용을 자유롭게 적어주세요. AI가 이 내용을 바탕으로 가사를 작사합니다."
                    className="w-full h-40 p-6 rounded-[2rem] border-2 border-gray-100 bg-gray-50/50 text-gray-700 text-sm font-medium focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all resize-none placeholder-gray-400 leading-relaxed shadow-inner"
                  />
                  <div className="absolute bottom-4 right-6 text-xs font-bold text-gray-400 pointer-events-none">
                    AI가 참고할 영감
                  </div>
                </div>
              </div>

              <InputField label="음악 장르" icon="🎻" value={form.genre} onChange={(v) => setForm({ ...form, genre: v })} options={OPTIONS.genre} colorScheme="indigo" />
              <InputField label="가사 주제" icon="🕯️" value={form.theme} onChange={(v) => setForm({ ...form, theme: v })} options={OPTIONS.theme} colorScheme="purple" />
              <InputField label="곡의 분위기" icon="🌊" value={form.mood} onChange={(v) => setForm({ ...form, mood: v })} options={OPTIONS.mood} colorScheme="orange" />
              <InputField label="노래 스타일" icon="🏺" value={form.style} onChange={(v) => setForm({ ...form, style: v })} options={OPTIONS.style} colorScheme="emerald" />
            </div>

            <div className="space-y-8 pt-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-6 gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎙️</span>
                  <div>
                    <h3 className="text-xl font-black text-gray-800 tracking-tighter">보이스 스타일 선택</h3>
                    <p className="text-xs font-bold text-indigo-400 mt-1">Suno 모델이 가장 선호하는 아티스트 보컬 스타일</p>
                  </div>
                </div>
                <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
                  <button onClick={() => setVoiceTab('female')} className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${voiceTab === 'female' ? 'bg-white shadow-md text-rose-600' : 'text-gray-400'}`}>여성</button>
                  <button onClick={() => setVoiceTab('male')} className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${voiceTab === 'male' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-400'}`}>남성</button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
                {VOICES.filter(v => v.gender === voiceTab).map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => setForm({ ...form, voiceId: voice.id })}
                    className={`relative p-5 rounded-[2rem] text-left transition-all border-2 flex flex-col items-center text-center ${form.voiceId === voice.id ? 'border-indigo-500 bg-indigo-50/40 ring-4 ring-indigo-50 shadow-xl -translate-y-2' : 'border-gray-50 bg-white hover:border-indigo-100'}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center text-xl ${form.voiceId === voice.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{voice.gender === 'female' ? '👩' : '👨'}</div>
                    <div className={`font-black text-base tracking-tighter ${form.voiceId === voice.id ? 'text-indigo-900' : 'text-gray-800'}`}>{voice.name}</div>
                    <div className="text-[10px] font-bold text-gray-400 mt-2 uppercase leading-tight min-h-[2.5em] flex items-center">{voice.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <InputField label="출력 언어" icon="🎌" value={form.language} onChange={(v) => setForm({ ...form, language: v })} options={OPTIONS.language} colorScheme="rose" />
          </div>

          <div className="mt-16 mb-8">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="relative mx-auto w-150 px-10 py-5 bg-gray-800 text-white rounded-[3rem] font-black text-2xl shadow-[0_35px_70px_-15px_rgba(0,0,0,0.5)] hover:bg-black transform transition-all hover:-translate-y-2 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-6 group"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-10 w-10 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span className="animate-pulse">Suno 최적화 엔진 가동 중...</span>
                </>
              ) : (
                <>
                  <span className="text-4xl group-hover:rotate-12 transition-transform">🖋️</span>
                  <span className="tracking-tight">나만의 걸작 가사 완성하기</span>
                </>
              )}
            </button>
            {error && (
              <div className="mt-8 p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl text-rose-600 font-bold text-center animate-in zoom-in-95 duration-300 shadow-sm max-w-2xl mx-auto">
                <span className="text-xl mr-2">⚠️</span> {error}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Result Section */}
      {result && (
        <div id="result-section" className="mt-24 bg-white rounded-[4.5rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.08)] p-8 md:p-24 border border-gray-50 relative animate-in fade-in slide-in-from-bottom-20 duration-1000">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 opacity-50"></div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-4 border-b border-gray-50 pb-12">
            <div className="space-y-8 flex-1">
              <div className="flex flex-wrap gap-2.5">
                {[form.targetSubject, form.genre, form.mood, form.style, VOICES.find(v => v.id === form.voiceId)?.name].map((tag, i) => tag && (
                  <span key={i} className="px-5 py-2 bg-gray-50 text-gray-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-gray-100">#{tag}</span>
                ))}
              </div>
              <h2 className="text-4xl md:text-3xl font-black text-gray-900 tracking-tighter leading-[0.8]">{result.title}</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handlePlayAudio}
                disabled={audioLoading}
                className={`flex items-center justify-center gap-4 px-8 py-4 rounded-[2rem] font-black transition-all active:scale-95 shadow-xl min-w-[200px] ${audioLoading ? 'bg-gray-100 text-gray-400' : 'bg-rose-500 text-white hover:bg-rose-600'}`}
              >
                {audioLoading ? '보컬 튜닝 중..' : '보이스 미리듣기'}
                <span className="text-2xl">▶️</span>
              </button>
              <button
                onClick={() => copyToClipboard(`[Title]\n${result.title}\n\n` + (result.sections || []).map(s => `[${s.type}]\n${s.content}`).join('\n\n') + `\n\n[Suno Style]\n${result.stylePrompt}\n[Suno Vocal]\n${result.vocalPrompt}`, "Suno용 전체 텍스트가 복사되었습니다!")}
                className="flex items-center justify-center gap-4 px-10 py-7 bg-gray-900 hover:bg-black text-white rounded-[2rem] font-black transition-all shadow-xl active:scale-95"
              >
                가사+프롬프트 복사
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              </button>
            </div>
          </div>

          {/* Suno Console Style Prompt Box */}
          <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-10 bg-[#121212] text-white rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 scale-[1.5] group-hover:rotate-12 transition-transform"><svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" /></svg></div>
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Suno Music Style</h3>
              <p className="text-xl font-bold tracking-tight mb-8 leading-relaxed text-gray-100">{result.stylePrompt}</p>
              <button onClick={() => copyToClipboard(result.stylePrompt, "스타일 프롬프트가 복사되었습니다!")} className="text-xs font-black px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10">Style Copy</button>
            </div>
            <div className="p-10 bg-[#121212] text-white rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 scale-[1.5] group-hover:rotate-12 transition-transform"><svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2v-2zm0-10h2v8h-2V6z" /></svg></div>
              <h3 className="text-[10px] font-black text-rose-400 uppercase tracking-[0.4em] mb-4">Suno Vocal Description</h3>
              <p className="text-xl font-bold tracking-tight mb-8 leading-relaxed text-gray-100">{result.vocalPrompt}</p>
              <button onClick={() => copyToClipboard(result.vocalPrompt, "보컬 프롬프트가 복사되었습니다!")} className="text-xs font-black px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10">Vocal Copy</button>
            </div>
          </div>

          <div className="space-y-8">
            {(result.sections || []).map((section, idx) => (
              <div key={idx} className="group relative text-center">
                <div className="text-[11px] font-black text-indigo-400/30 tracking-[1em] uppercase mb-2 flex items-center justify-center">
                  <div className="h-[2px] w-24 bg-gradient-to-r from-transparent to-indigo-50 mr-10"></div>
                  {section.type}
                  <div className="h-[2px] w-24 bg-gradient-to-l from-transparent to-indigo-50 ml-10"></div>
                </div>
                <div className="text-3xl md:text-xl leading-[1.6] text-gray-800 whitespace-pre-wrap font-bold px-4 md:px-28 group-hover:text-black transition-all duration-700 tracking-tight group-hover:scale-[1.01]">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {result.explanation && (
            <div className="mt-20 p-16 md:p-12 bg-gradient-to-br from-indigo-50/20 via-white to-rose-50/20 rounded-[4.5rem] border border-gray-50 shadow-inner group/note relative">
              <h3 className="text-xs font-black text-indigo-500 mb-4 flex items-center gap-4 uppercase tracking-[0.5em] relative z-10">
                <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse"></div>
                Lyrics Insight (Korean)
              </h3>
              <p className="text-gray-900/90 leading-relaxed font-bold text-2xl md:text-xl italic relative z-10 tracking-tight">
                "{result.explanation}"
              </p>
            </div>
          )}
        </div>
      )}

      <footer className="mt-48 py-24 border-t border-gray-50 text-center">
        <p className="text-gray-300 text-xs font-black tracking-[0.4em] uppercase opacity-60">Created by AI Studio • 새로운시작 • Seoul, KR</p>
      </footer>
    </div>
  );
};

export default App;
