import React from 'react';
import { CalculationResult } from '../types';

interface BinaryViewProps {
  results: CalculationResult;
}

export const BinaryView: React.FC<BinaryViewProps> = ({ results }) => {
  // Helper to split binary string into octets for rendering
  const renderOctets = (binaryStr: string, maskBits: number, type: 'ip' | 'mask' | 'net') => {
    // Remove dots for indexing
    const rawBits = binaryStr.replace(/\./g, '');
    const octets = binaryStr.split('.');

    return (
      <div className="flex flex-wrap gap-2 font-mono text-sm md:text-base">
        {octets.map((octet, octetIndex) => (
          <div key={octetIndex} className="flex gap-[1px]">
            {octet.split('').map((bit, bitIndex) => {
               const globalIndex = octetIndex * 8 + bitIndex;
               let colorClass = 'text-slate-500'; // Default

               if (type === 'mask') {
                 colorClass = bit === '1' ? 'text-brand-400' : 'text-slate-600';
               } else {
                 // For IP and Network, color network portion vs host portion
                 if (globalIndex < maskBits) {
                   colorClass = 'text-brand-400 font-bold'; // Network portion
                 } else {
                    colorClass = 'text-green-400'; // Host portion
                 }
               }

               return (
                 <span key={bitIndex} className={`${colorClass}`}>
                   {bit}
                 </span>
               );
            })}
            {octetIndex < 3 && <span className="text-slate-700 mx-1">.</span>}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50 mt-6">
      <h4 className="text-slate-400 text-sm uppercase tracking-wider mb-4">Binary Visualization</h4>
      
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
           <span className="w-24 text-slate-500 text-xs md:text-sm">IP Address</span>
           {renderOctets(results.binaryIp, 32, 'ip')} 
           {/* Passing 32 to treat all as net portion just for generic color, or reuse mask logic for split? 
               Actually better to show Net/Host split on IP. */}
             <div className="hidden md:block ml-auto text-xs text-slate-600">
               <span className="text-brand-400">Network</span> / <span className="text-green-400">Host</span>
             </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-2">
           <span className="w-24 text-slate-500 text-xs md:text-sm">Subnet Mask</span>
           {renderOctets(results.binaryMask, 32, 'mask')}
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-2">
           <span className="w-24 text-slate-500 text-xs md:text-sm">Network ID</span>
           {renderOctets(results.binaryNetwork, 32, 'net')} 
        </div>
      </div>
    </div>
  );
};
