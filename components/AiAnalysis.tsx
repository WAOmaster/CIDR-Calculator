import React, { useState } from 'react';
import { Brain, Loader2, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AiAnalysisResult } from '../types';
import { analyzeSubnetWithAi } from '../services/geminiService';

interface AiAnalysisProps {
  cidr: string;
  ipType: string;
}

export const AiAnalysis: React.FC<AiAnalysisProps> = ({ cidr, ipType }) => {
  const [analysis, setAnalysis] = useState<AiAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeSubnetWithAi(cidr, ipType);
      setAnalysis(result);
    } catch (err) {
      setError("Failed to analyze subnet. Please check your API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!process.env.API_KEY) {
     return (
        <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
            <p className="text-slate-500 text-sm">Configure <code className="text-brand-400">API_KEY</code> to enable AI analysis features.</p>
        </div>
     )
  }

  return (
    <div className="mt-8">
      {!analysis && !loading && (
        <button
          onClick={handleAnalyze}
          className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-brand-900/20"
        >
          <Brain size={20} />
          Analyze with Gemini AI
        </button>
      )}

      {loading && (
        <div className="w-full py-8 flex flex-col items-center justify-center bg-slate-800 rounded-xl border border-slate-700 animate-pulse">
          <Loader2 className="animate-spin text-brand-400 mb-2" size={32} />
          <p className="text-slate-400 text-sm">Analyzing subnet topology and security context...</p>
        </div>
      )}

      {error && (
         <div className="p-4 bg-red-900/20 border border-red-800 rounded-xl text-red-200 flex items-center gap-2 mt-4">
            <AlertTriangle size={20} />
            {error}
         </div>
      )}

      {analysis && !loading && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl shadow-black/50 mt-6 animation-fade-in">
          <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-brand-400 font-semibold flex items-center gap-2">
                <Brain size={18} /> Gemini Analysis
            </h3>
            <button onClick={() => setAnalysis(null)} className="text-xs text-slate-500 hover:text-slate-300">Clear</button>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
                <h4 className="text-slate-200 font-medium mb-2">Technical Summary</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{analysis.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-slate-200 font-medium mb-3 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500"/> Common Use Cases
                    </h4>
                    <ul className="space-y-2">
                        {analysis.useCases.map((useCase, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                                <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-slate-600 flex-shrink-0"></span>
                                {useCase}
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="bg-red-900/10 p-4 rounded-lg border border-red-900/30">
                    <h4 className="text-red-300 font-medium mb-2 flex items-center gap-2">
                        <Shield size={16} /> Security Considerations
                    </h4>
                    <p className="text-red-200/80 text-sm leading-relaxed">
                        {analysis.securityNotes}
                    </p>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
