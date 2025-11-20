import React from 'react';
import { CalculationResult } from '../types';
import { BinaryView } from './BinaryView';
import { Copy } from 'lucide-react';

interface ResultsDashboardProps {
  results: CalculationResult;
}

const InfoCard: React.FC<{ label: string; value: string | number; copyable?: boolean; highlight?: boolean }> = ({ label, value, copyable, highlight }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`p-4 rounded-xl border ${highlight ? 'bg-brand-900/20 border-brand-500/50' : 'bg-slate-800 border-slate-700'} relative group`}>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-center justify-between">
        <p className={`font-mono text-lg ${highlight ? 'text-brand-400' : 'text-slate-200'} truncate`}>{value}</p>
        {copyable && (
          <button 
            onClick={handleCopy} 
            className="text-slate-500 hover:text-brand-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
            title="Copy to clipboard"
          >
            {copied ? <span className="text-green-500 text-xs">Copied</span> : <Copy size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard label="CIDR Notation" value={results.cidrNotation} copyable highlight />
        <InfoCard label="Subnet Mask" value={results.subnetMask} copyable />
        <InfoCard label="Wildcard Mask" value={results.wildcardMask} copyable />
        <InfoCard label="Total Hosts" value={results.totalHosts.toLocaleString()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-slate-300 font-medium mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> Host Range
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <span className="text-slate-400 text-sm">First Usable</span>
                <span className="font-mono text-green-400">{results.firstUsable}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <span className="text-slate-400 text-sm">Last Usable</span>
                <span className="font-mono text-green-400">{results.lastUsable}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400 text-sm">Usable Count</span>
                <span className="font-mono text-slate-200">{results.usableHosts.toLocaleString()}</span>
              </div>
            </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-slate-300 font-medium mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Network Properties
            </h3>
             <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <span className="text-slate-400 text-sm">Network Address</span>
                <span className="font-mono text-blue-400">{results.networkAddress}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <span className="text-slate-400 text-sm">Broadcast Address</span>
                <span className="font-mono text-purple-400">{results.broadcastAddress}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-400 text-sm">IP Type</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-200">
                  {results.ipType} Class {results.ipClass}
                </span>
              </div>
            </div>
        </div>
      </div>

      <BinaryView results={results} />
    </div>
  );
};
