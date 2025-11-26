import React, { useState } from 'react';
import { WorkoutSession } from '../types';
import { generateTrainingAdvice } from '../services/geminiService';
import { Brain, Loader2, Send, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AICoachProps {
  workouts: WorkoutSession[];
}

const AICoach: React.FC<AICoachProps> = ({ workouts }) => {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userQuery, setUserQuery] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    const advice = await generateTrainingAdvice(workouts, userQuery);
    setResponse(advice);
    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-24">
       <header className="flex items-center gap-3 mb-6">
         <div className="p-3 bg-purple-500/20 rounded-2xl">
           <Brain className="text-purple-400" size={32} />
         </div>
         <div>
          <h2 className="text-3xl font-bold text-white">AI Coach</h2>
          <p className="text-zinc-400">Powered by Gemini 2.5</p>
         </div>
      </header>

      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-400 mb-2">Ask your coach (Optional)</label>
          <div className="flex gap-2">
            <input 
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="e.g. My side pressure is stuck, what should I do?"
              className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>

        {!response && !loading && (
          <div className="text-center py-12">
             <Sparkles className="mx-auto text-zinc-600 mb-4" size={48} />
             <h3 className="text-zinc-300 font-medium text-lg">Ready to Analyze</h3>
             <p className="text-zinc-500 max-w-md mx-auto mt-2">
               I will analyze your last 5 workouts, look for volume imbalances between your left and right arm, and suggest a progression plan.
             </p>
             <button 
               onClick={handleGenerate}
               className="mt-6 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-colors"
             >
               Analyze My Training
             </button>
          </div>
        )}

        {loading && !response && (
          <div className="text-center py-20">
            <Loader2 className="animate-spin mx-auto text-purple-500 mb-4" size={48} />
            <p className="text-zinc-400 animate-pulse">Consulting the table gods...</p>
          </div>
        )}

        {response && (
          <div className="prose prose-invert prose-purple max-w-none">
            <div className="bg-zinc-950/50 p-6 rounded-xl border border-zinc-800/50">
              {/* Rendering Markdown explicitly safely since ReactMarkdown handles sanitation */}
              {/* Just splitting by newline to render paragraphs for simple display if markdown lib wasn't available, 
                  but here we assume plain text or basic formatting. For better rendering I'll use a simple parser logic 
                  or just whitespace pre-wrap */}
              <div className="whitespace-pre-wrap font-sans text-zinc-300 leading-relaxed">
                {response}
              </div>
            </div>
            <div className="mt-4 text-right">
               <button onClick={() => setResponse(null)} className="text-sm text-zinc-500 hover:text-white underline">
                 Clear Analysis
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICoach;