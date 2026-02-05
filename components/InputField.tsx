
import React from 'react';

interface InputFieldProps {
  label: string;
  icon: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  tooltip?: string;
  colorScheme?: 'indigo' | 'purple' | 'orange' | 'emerald' | 'rose';
}

const colorMap = {
  indigo: 'from-indigo-600 to-blue-500 shadow-indigo-200 border-indigo-100 bg-indigo-50 text-indigo-700',
  purple: 'from-purple-600 to-fuchsia-500 shadow-purple-200 border-purple-100 bg-purple-50 text-purple-700',
  orange: 'from-orange-500 to-amber-400 shadow-orange-200 border-orange-100 bg-orange-50 text-orange-700',
  emerald: 'from-emerald-500 to-teal-400 shadow-emerald-200 border-emerald-100 bg-emerald-50 text-emerald-700',
  rose: 'from-rose-500 to-pink-400 shadow-rose-200 border-rose-100 bg-rose-50 text-rose-700',
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
  const activeStyles = colorMap[colorScheme];

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-base font-bold text-gray-800 flex items-center tracking-tight">
          <span className="mr-2 text-xl filter drop-shadow-sm">{icon}</span>
          {label}
        </label>
        {tooltip && (
          <span className="text-gray-400 cursor-help group relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <div className="absolute bottom-full right-0 mb-3 w-56 p-3 bg-gray-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-20 shadow-2xl leading-relaxed">
              {tooltip}
            </div>
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const isSelected = value === option;
          const [bgGrad, shadow, border, lightBg, text] = activeStyles.split(' ');
          
          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 border-2 ${
                isSelected 
                  ? `bg-gradient-to-r ${bgGrad} text-white border-transparent shadow-lg ${shadow} -translate-y-1 scale-105` 
                  : `bg-white text-gray-500 border-gray-100 hover:border-${colorScheme}-200 hover:${lightBg} hover:${text} hover:shadow-sm`
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InputField;
