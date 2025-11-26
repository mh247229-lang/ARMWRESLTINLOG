import React, { useState } from 'react';
import { WorkoutSession, ArmWrestlingConfig, Exercise } from '../types';
import { generateTrainingAdvice, getExerciseTechnicalBreakdown } from '../services/geminiService';
import { Brain, Loader2, Send, Sparkles, BookOpen, Settings2 } from 'lucide-react';
import { DEFAULT_EXERCISES } from '../constants';

interface AICoachProps {
  workouts: WorkoutSession[];
  exercises?: Exercise[];
  t?: (key: string) => string;
}

type CoachMode = 'COACH' | 'TECH_LAB';

const AICoach: React.FC<AICoachProps> = ({ workouts, exercises = [], t }) => {
  const [mode, setMode] = useState<CoachMode>('COACH');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Use passed exercises or fallback
  const allExercises = exercises.length > 0 ? exercises : DEFAULT_EXERCISES;
  
  // Coach State
  const [userQuery, setUserQuery] = useState('');

  // Tech Lab State
  const [techExerciseId, setTechExerciseId] = useState('');
  const [techConfig, setTechConfig] = useState<ArmWrestlingConfig>({
      vector: 'Front',
      angle: '90',
      handleThickness: 4,
      strap: false,
      elbowPosition: 'Tight'
  });

  const handleCoachGenerate = async () => {
    setLoading(true);
    const advice = await generateTrainingAdvice(workouts, userQuery);
    setResponse(advice);
    setLoading(false);
  };

  const handleTechGenerate = async () => {
      if (!techExerciseId) return;
      setLoading(true);
      const exName = allExercises.find(e => e.id === techExerciseId)?.name || 'Exercise';
      const breakdown = await getExerciseTechnicalBreakdown(exName, techConfig);
      setResponse(breakdown);
      setLoading(false);
  };

  const awExercises = allExercises.filter(e => e.category === 'Arm Wrestling');

  return (
    <div className="space-y-6 pb-24">
       <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
         <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-2xl">
                <Brain className="text-purple-400" size={32} />
            </div>
            <div>
                <h2 className="text-3xl font-bold text-white">AI Lab</h2>
                <p className="text-zinc-400">Coach & Biomechanics</p>
            </div>
         </div>
         
         <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
             <button 
                onClick={() => { setMode('COACH'); setResponse(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'COACH' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
             >
                 Coach
             </button>
             <button 
                onClick={() => { setMode('TECH_LAB'); setResponse(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'TECH_LAB' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
             >
                 Tech Lab
             </button>
         </div>
      </header>

      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
        
        {/* COACH MODE INPUTS */}
        {mode === 'COACH' && (
            <div className="mb-6 animate-in fade-in">
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
                onClick={handleCoachGenerate}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-xl transition-colors disabled:opacity-50"
                >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                </button>
            </div>
            </div>
        )}

        {/* TECH LAB INPUTS */}
        {mode === 'TECH_LAB' && (
            <div className="mb-6 space-y-4 animate-in fade-in">
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Select Exercise to Analyze</label>
                    <select 
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                        value={techExerciseId}
                        onChange={(e) => setTechExerciseId(e.target.value)}
                    >
                        <option value="">-- Choose Exercise --</option>
                        {awExercises.map(e => (
                            <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                    </select>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase">Cable Vector</label>
                        <select 
                            className="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                            value={techConfig.vector}
                            onChange={(e) => setTechConfig({...techConfig, vector: e.target.value as any})}
                        >
                            <option>Front</option>
                            <option>High Front</option>
                            <option>Low Front</option>
                            <option>Side</option>
                            <option>High Side</option>
                            <option>Low Side</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase">Angle</label>
                        <select 
                            className="w-full mt-1 bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                            value={techConfig.angle}
                            onChange={(e) => setTechConfig({...techConfig, angle: e.target.value as any})}
                        >
                            <option>45</option>
                            <option>70</option>
                            <option>80</option>
                            <option>90</option>
                            <option>100</option>
                            <option>110</option>
                            <option>135</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase">Handle: {techConfig.handleThickness}cm</label>
                        <input 
                             type="range" min="1" max="8" step="0.5"
                             value={techConfig.handleThickness}
                             onChange={(e) => setTechConfig({...techConfig, handleThickness: parseFloat(e.target.value)})}
                             className="w-full mt-3 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                    </div>
                    <div className="flex items-end">
                         <button 
                            onClick={() => setTechConfig({...techConfig, strap: !techConfig.strap})}
                            className={`w-full py-2 rounded-lg text-sm font-bold transition-colors ${techConfig.strap ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}
                         >
                             Strap: {techConfig.strap ? 'YES' : 'NO'}
                         </button>
                    </div>
                </div>

                <button 
                onClick={handleTechGenerate}
                disabled={loading || !techExerciseId}
                className="w-full bg-white text-black font-bold p-3 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                {loading ? <Loader2 className="animate-spin" /> : <><BookOpen size={20}/> Generate Technical Breakdown</>}
                </button>
            </div>
        )}

        {/* EMPTY STATE */}
        {!response && !loading && mode === 'COACH' && (
          <div className="text-center py-12">
             <Sparkles className="mx-auto text-zinc-600 mb-4" size={48} />
             <h3 className="text-zinc-300 font-medium text-lg">Ready to Analyze</h3>
             <button 
               onClick={handleCoachGenerate}
               className="mt-6 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-colors"
             >
               Analyze My Training
             </button>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && !response && (
          <div className="text-center py-20">
            <Loader2 className="animate-spin mx-auto text-purple-500 mb-4" size={48} />
            <p className="text-zinc-400 animate-pulse">
                {mode === 'COACH' ? "Consulting the table gods..." : "Analyzing biomechanics..."}
            </p>
          </div>
        )}

        {/* RESPONSE DISPLAY */}
        {response && (
          <div className="prose prose-invert prose-purple max-w-none animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-zinc-950/50 p-6 rounded-xl border border-zinc-800/50">
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