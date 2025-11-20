import React from 'react';
import { CidrData } from '../types';

interface InputControlProps {
  data: CidrData;
  onChange: (newData: CidrData) => void;
}

export const InputControl: React.FC<InputControlProps> = ({ data, onChange }) => {
  
  const handleIpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, ipAddress: e.target.value });
  };

  const handleMaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      onChange({ ...data, maskBits: Math.max(0, Math.min(32, val)) });
    }
  };

  const incrementMask = () => onChange({ ...data, maskBits: Math.min(32, data.maskBits + 1) });
  const decrementMask = () => onChange({ ...data, maskBits: Math.max(0, data.maskBits - 1) });

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 mb-8">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        
        {/* IP Input */}
        <div className="flex-grow w-full md:w-auto">
          <label className="block text-sm font-medium text-slate-400 mb-2">IP Address</label>
          <input
            type="text"
            value={data.ipAddress}
            onChange={handleIpChange}
            placeholder="192.168.1.1"
            className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-4 py-3 text-lg font-mono focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Slash Separator (Visual) */}
        <div className="hidden md:block text-slate-500 text-3xl pt-6">/</div>

        {/* CIDR Input */}
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium text-slate-400 mb-2 flex justify-between">
            <span>CIDR / Mask</span>
            <span className="text-brand-400 font-mono">/{data.maskBits}</span>
          </label>
          <div className="flex items-center gap-2">
             <button 
              onClick={decrementMask}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
              aria-label="Decrease Mask"
            >
              -
            </button>
            <div className="flex-grow relative h-10 bg-slate-900 rounded-lg border border-slate-600 overflow-hidden">
                <input
                  type="range"
                  min="0"
                  max="32"
                  value={data.maskBits}
                  onChange={handleMaskChange}
                  className="w-full h-full opacity-0 absolute z-20 cursor-pointer"
                />
                <div 
                  className="absolute top-0 left-0 h-full bg-brand-600 z-10 transition-all duration-100"
                  style={{ width: `${(data.maskBits / 32) * 100}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center z-0 font-mono text-sm pointer-events-none text-slate-300">
                  {data.maskBits}
                </div>
            </div>
            <button 
              onClick={incrementMask}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
              aria-label="Increase Mask"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
