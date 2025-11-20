import React, { useState, useEffect, useMemo } from 'react';
import { Network } from 'lucide-react';
import { CidrData } from './types';
import { calculateSubnet } from './utils/ipMath';
import { InputControl } from './components/InputControl';
import { ResultsDashboard } from './components/ResultsDashboard';
import { AiAnalysis } from './components/AiAnalysis';

const App: React.FC = () => {
  const [data, setData] = useState<CidrData>({
    ipAddress: '192.168.1.1',
    maskBits: 24
  });

  // Memoize results to prevent unnecessary recalculations
  const results = useMemo(() => {
    return calculateSubnet(data.ipAddress, data.maskBits);
  }, [data.ipAddress, data.maskBits]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-brand-500/30">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/10 rounded-lg">
                <Network className="text-brand-500" size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-blue-500">
              Smart CIDR
            </h1>
          </div>
          <div className="text-xs text-slate-500 font-mono">v1.0.0</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">IPv4 Subnet Calculator</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Calculate network details, host ranges, and masks with precision. 
            Visualize binary bits and analyze subnets with AI.
          </p>
        </div>

        <InputControl data={data} onChange={setData} />

        {results ? (
          <div className="animate-fade-in">
             <ResultsDashboard results={results} />
             <AiAnalysis cidr={results.cidrNotation} ipType={results.ipType} />
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
             <p className="text-slate-500 text-lg">Enter a valid IP address to see results.</p>
             <p className="text-slate-600 text-sm mt-2">Example: 192.168.1.1, 10.0.0.5, 172.16.0.1</p>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 bg-slate-900 py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Smart CIDR Calculator. Built with React, Tailwind & Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
