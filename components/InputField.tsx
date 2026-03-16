import React, { useState } from 'react';

interface InputFieldProps {
  label: string;
  icon: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  tooltip?: string;
  colorScheme?: 'indigo' | 'purple' | 'orange' | 'emerald' | 'rose';
}

const unselectedClasses = {
  indigo: 'hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-sm',
  purple: 'hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 hover:shadow-sm',
  orange: 'hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 hover:shadow-sm',
  emerald: 'hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-sm',
  rose: 'hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 hover:shadow-sm',
};

const selectedClasses = {
  indigo: 'bg-gradient-to-r from-indigo-600 to-blue-500 shadow-indigo-200 shadow-lg text-white border-transparent -translate-y-1 scale-105',
  purple: 'bg-gradient-to-r from-purple-600 to-fuchsia-500 shadow-purple-200 shadow-lg text-white border-transparent -translate-y-1 scale-105',
  orange: 'bg-gradient-to-r from-orange-500 to-amber-400 shadow-orange-200 shadow-lg text-white border-transparent -translate-y-1 scale-105',
  emerald: 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-emerald-200 shadow-lg text-white border-transparent -translate-y-1 scale-105',
  rose: 'bg-gradient-to-r from-rose-500 to-pink-400 shadow-rose-200 shadow-lg text-white border-transparent -translate-y-1 scale-105',
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  value,
  onChange,
  options,
  tooltip,
  colorScheme = 'indigo'
}) => {
  const [isTypingCustom, setIsTypingCustom] = useState(false);

  const isDirectInput = isTypingCustom || (value !== '' && !options.filter(opt => opt !== '직접 쓰기').includes(value));

  const handleCustomActivate = () => {
    setIsTypingCustom(true);
    if (!isDirectInput && value !== '직접 쓰기') {
       onChange(''); // clear value initially when activated
    }
  };

  const ringStyles = {
    indigo: 'focus:ring-indigo-100',
    purple: 'focus:ring-purple-100',
    orange: 'focus:ring-orange-100',
    emerald: 'focus:ring-emerald-100',
    rose: 'focus:ring-rose-100'
  };

  const textStyles = {
    indigo: 'text-indigo-700',
    purple: 'text-purple-700',
    orange: 'text-orange-700',
    emerald: 'text-emerald-700',
    rose: 'text-rose-700'
  }

  const borderStyles = {
    indigo: 'border-indigo-100',
    purple: 'border-purple-100',
    orange: 'border-orange-100',
    emerald: 'border-emerald-100',
    rose: 'border-rose-100'
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-base font-bold text-gray-800 flex items-center tracking-tight">
          <span className="mr-2 text-xl filter drop-shadow-sm">{icon}</span>
          {label}
        </label>
        {tooltip && (
          <span className="text-gray-400 cursor-help group relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            <div className="absolute bottom-full right-0 mb-3 w-56 p-3 bg-gray-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-20 shadow-2xl leading-relaxed">
              {tooltip}
            </div>
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const isSelected = option === '직접 쓰기' ? isDirectInput : (!isTypingCustom && value === option);

          return (
            <button
              key={option}
              onClick={() => {
                if (option === '직접 쓰기') {
                  handleCustomActivate();
                } else {
                  setIsTypingCustom(false);
                  onChange(option);
                }
              }}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 border-2 ${isSelected
                  ? selectedClasses[colorScheme]
                  : `bg-white text-gray-500 border-gray-100 ${unselectedClasses[colorScheme]}`
                }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {isDirectInput && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="relative">
            <input
              type="text"
              autoFocus
              placeholder={`${label} 내용을 직접 입력해주세요`}
              value={value === '직접 쓰기' ? '' : value}
              onChange={(e) => onChange(e.target.value)}
              className={`w-full p-4 rounded-2xl border-2 ${borderStyles[colorScheme]} bg-white text-gray-700 text-sm font-bold focus:ring-4 ${ringStyles[colorScheme]} focus:outline-none transition-all shadow-inner`}
            />
            <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black ${textStyles[colorScheme]} uppercase tracking-widest`}>
              Custom Input
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputField;

