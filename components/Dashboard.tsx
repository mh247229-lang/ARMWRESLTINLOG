import React, { useMemo, useState } from 'react';
import { WorkoutSession, UserProfile, Exercise } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Dumbbell, Trophy, Activity, Brain, Loader2, Send, Scale, Flame, Ruler, BookOpen, ShieldCheck, Zap, Utensils, History as HistoryIcon, Calculator, Lock } from 'lucide-react';
import { generateTrainingAdvice } from '../services/geminiService';
import History from './History';
import Secrets from './Secrets';

interface DashboardProps {
  workouts: WorkoutSession[];
  userProfile: UserProfile | null;
  onEditLog: (workout: WorkoutSession) => void;
  exercises?: Exercise[];
  t?: (key: string) => string;
}

const Dashboard: React.FC<DashboardProps> = ({ workouts, userProfile, onEditLog, exercises = [], t }) => {
  const [activeTab, setActiveTab] = useState<'CALCULATE' | 'SECRETS' | 'HISTORY'>('CALCULATE');
  
  // PR Widget State - Manual Only
  const [manualWeight, setManualWeight] = useState<string>('');
  const [manualReps, setManualReps] = useState<string>('');
  
  // Body Comp State
  const [waist, setWaist] = useState<string>('');
  const [neck, setNeck] = useState<string>('');
  const [calcUnit, setCalcUnit] = useState<'cm'|'in'>('cm'); // Local unit for calculator
  const [activityLevel, setActivityLevel] = useState<number>(1.55); // Moderate default

  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleQuickAsk = async () => {
    if(!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResponse('');
    const response = await generateTrainingAdvice(workouts, aiQuery);
    setAiResponse(response);
    setAiLoading(false);
  };

  const stats = useMemo(() => {
    let totalVolume = 0;
    let totalSets = 0;
    let maxWeight = 0;
    workouts.forEach(w => {
      w.exercises.forEach(e => {
        e.sets.forEach(s => {
          if (s.completed) {
            totalVolume += s.weight * s.reps;
            totalSets += 1;
            if (s.weight > maxWeight) maxWeight = s.weight;
          }
        });
      });
    });
    return { totalVolume, totalSets, maxWeight };
  }, [workouts]);

  const volumeData = useMemo(() => {
    const data: any[] = [];
    const recent = [...workouts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7);
    recent.forEach(w => {
      let leftVol = 0, rightVol = 0, gymVol = 0;
      w.exercises.forEach(e => {
        e.sets.forEach(s => {
           const vol = s.weight * s.reps;
           if (s.hand === 'LEFT') leftVol += vol;
           else if (s.hand === 'RIGHT') rightVol += vol;
           else gymVol += vol;
        });
      });
      data.push({
        date: new Date(w.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        Left: leftVol, Right: rightVol, General: gymVol
      });
    });
    return data;
  }, [workouts]);

  // Epley Formula Logic
  const calculate1RM = (weight: number, reps: number) => {
    if (reps < 1) return 0;
    if (reps === 1) return weight;
    return Math.round(weight * (1 + reps / 30));
  };

  const manualResult = useMemo(() => {
      const w = parseFloat(manualWeight);
      const r = parseFloat(manualReps);
      if(!w || isNaN(w)) return 0;
      if(!r || isNaN(r)) return w; // Assume 1 rep if reps is invalid but weight exists
      return calculate1RM(w, r);
  }, [manualWeight, manualReps]);

  const prBreakdown = useMemo(() => {
      if (!manualResult) return [];
      const data = [
          { pct: 100, reps: 1 },
          { pct: 95, reps: 2 },
          { pct: 93, reps: 3 },
          { pct: 90, reps: 4 },
          { pct: 87, reps: 5 },
          { pct: 85, reps: 6 },
          { pct: 80, reps: 8 },
          { pct: 75, reps: 10 },
          { pct: 70, reps: 12 },
          { pct: 65, reps: 15 },
          { pct: 60, reps: 20 },
          { pct: 50, reps: 25 },
      ];
      return data.map(d => ({
          ...d,
          weight: Math.round(manualResult * (d.pct / 100))
      }));
  }, [manualResult]);

  // --- BODY COMPOSITION CALCULATOR LOGIC ---
  const bodyStats = useMemo(() => {
      if (!userProfile || !waist || !neck) return null;
      
      // 1. Standardize Height to CM
      let heightCm = parseFloat(userProfile.height);
      if (userProfile.heightUnit === 'ft') {
          heightCm = heightCm * 30.48; 
      }
      
      // 2. Standardize Weight to KG
      let weightKg = parseFloat(userProfile.weight);
      if (userProfile.weightUnit === 'lbs') {
          weightKg = weightKg * 0.453592;
      }

      // 3. Standardize Waist/Neck to CM
      let waistCm = parseFloat(waist);
      let neckCm = parseFloat(neck);
      
      if (calcUnit === 'in') {
          waistCm = waistCm * 2.54;
          neckCm = neckCm * 2.54;
      }

      if (isNaN(waistCm) || isNaN(neckCm) || isNaN(heightCm) || heightCm <= 0 || waistCm - neckCm <= 0) return null;

      // 4. US Navy Formula (Men) - Metric
      let bodyFat = 0;
      try {
          const logWaistNeck = Math.log10(waistCm - neckCm);
          const logHeight = Math.log10(heightCm);
          bodyFat = 495 / (1.0324 - 0.19077 * logWaistNeck + 0.1554 * logHeight) - 450;
      } catch (e) { bodyFat = 0; }

      if (bodyFat < 2) bodyFat = 2; // Floor

      // 5. Muscle Mass
      const fatMass = weightKg * (bodyFat / 100);
      const leanMass = weightKg - fatMass;

      // 6. BMR (Mifflin-St Jeor) - Men
      const age = parseFloat(userProfile.age);
      const bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
      const tdee = bmr * activityLevel;

      // 7. Frame Size
      let wristCm = parseFloat(userProfile.wrist);
      if (userProfile.heightUnit === 'ft') wristCm = wristCm * 2.54; 

      let frame = 'Medium';
      if (wristCm < 16.5) frame = 'Small';
      else if (wristCm > 19.5) frame = 'Large (Elite)';

      return {
          bodyFat: bodyFat.toFixed(1),
          leanMass: leanMass.toFixed(1),
          fatMass: fatMass.toFixed(1),
          tdee: Math.round(tdee),
          frame
      };

  }, [userProfile, waist, neck, activityLevel, calcUnit]);

  return (
    <div className="pb-24 pt-4 px-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-2">
         <h1 className="text-3xl font-black text-red-600 uppercase tracking-tight italic">Top Secret</h1>
         <div className="bg-zinc-100 p-1 rounded-xl flex gap-1 overflow-x-auto no-scrollbar">
             <button 
                onClick={() => setActiveTab('CALCULATE')}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'CALCULATE' ? 'bg-white shadow-sm text-black' : 'text-zinc-500'}`}
             >
                 Calculate
             </button>
             <button 
                onClick={() => setActiveTab('SECRETS')}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'SECRETS' ? 'bg-white shadow-sm text-black' : 'text-zinc-500'}`}
             >
                 Armwrestling Secret
             </button>
             <button 
                onClick={() => setActiveTab('HISTORY')}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === 'HISTORY' ? 'bg-white shadow-sm text-black' : 'text-zinc-500'}`}
             >
                 History
             </button>
         </div>
      </div>

      {activeTab === 'CALCULATE' && (
        <>
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 text-center">
                    <Activity className="mx-auto text-red-500 mb-2" size={20} />
                    <h3 className="font-bold text-lg text-zinc-900">{stats.totalVolume >= 1000 ? (stats.totalVolume/1000).toFixed(1)+'k' : stats.totalVolume}</h3>
                    <p className="text-[10px] text-zinc-400 uppercase font-bold">Volume</p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 text-center">
                    <Dumbbell className="mx-auto text-red-500 mb-2" size={20} />
                    <h3 className="font-bold text-lg text-zinc-900">{stats.totalSets}</h3>
                    <p className="text-[10px] text-zinc-400 uppercase font-bold">Sets</p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 text-center">
                    <Trophy className="mx-auto text-amber-500 mb-2" size={20} />
                    <h3 className="font-bold text-lg text-zinc-900">{stats.maxWeight}</h3>
                    <p className="text-[10px] text-zinc-400 uppercase font-bold">Max Kg</p>
                </div>
            </div>

            {/* 1RM Widget */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                        <Trophy size={18} className="text-amber-500"/> 
                        1RM PR Calculator
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Lifted Weight</label>
                        <div className="relative">
                            <input 
                                type="number" placeholder="0" value={manualWeight}
                                onChange={(e) => setManualWeight(e.target.value)}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-lg font-mono font-bold text-zinc-900 outline-none focus:border-amber-500"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">kg</span>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Reps Performed</label>
                        <div className="relative">
                            <input 
                                type="number" placeholder="0" value={manualReps}
                                onChange={(e) => setManualReps(e.target.value)}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-lg font-mono font-bold text-zinc-900 outline-none focus:border-amber-500"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">reps</span>
                        </div>
                    </div>
                </div>
                {manualResult > 0 && (
                    <div className="animate-in slide-in-from-bottom-2 mt-4">
                        <div className="flex items-center justify-between bg-amber-50 p-3 rounded-xl mb-3 border border-amber-100">
                             <span className="text-xs font-bold text-amber-800 uppercase">Est. Max</span>
                             <span className="text-2xl font-black text-amber-600">{manualResult} <span className="text-sm">kg</span></span>
                        </div>
                        <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider mb-2">Training Zones</h4>
                        <div className="bg-zinc-50 rounded-xl border border-zinc-200 overflow-hidden">
                            <div className="grid grid-cols-3 bg-zinc-100 p-2.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-center border-b border-zinc-200">
                                <div>% 1RM</div>
                                <div>Weight</div>
                                <div>Reps</div>
                            </div>
                            <div className="divide-y divide-zinc-100 max-h-40 overflow-y-auto">
                                {prBreakdown.map((row) => (
                                    <div key={row.pct} className="grid grid-cols-3 p-2.5 text-sm text-center text-zinc-700 hover:bg-white">
                                        <div className="font-bold text-blue-600">{row.pct}%</div>
                                        <div className="font-mono font-bold">{row.weight}kg</div>
                                        <div className="text-zinc-400 text-xs">{row.reps}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* BODY COMP & NUTRITION WIDGET */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                        <Scale size={18} className="text-blue-500"/> 
                        Body Comp & Nutrition
                    </h3>
                    {/* Unit Toggle */}
                    <div className="bg-zinc-100 p-0.5 rounded-lg flex text-[10px] font-bold">
                        <button 
                           onClick={() => setCalcUnit('cm')}
                           className={`px-2 py-1 rounded-md transition-all ${calcUnit === 'cm' ? 'bg-white shadow text-blue-600' : 'text-zinc-400'}`}
                        >
                            CM
                        </button>
                        <button 
                           onClick={() => setCalcUnit('in')}
                           className={`px-2 py-1 rounded-md transition-all ${calcUnit === 'in' ? 'bg-white shadow text-blue-600' : 'text-zinc-400'}`}
                        >
                            IN
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                     <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Waist (Belly)</label>
                        <div className="relative">
                            <input 
                                type="number" placeholder="at navel" value={waist}
                                onChange={(e) => setWaist(e.target.value)}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-lg font-mono font-bold text-zinc-900 outline-none focus:border-blue-500"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">{calcUnit}</span>
                        </div>
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Neck</label>
                        <div className="relative">
                            <input 
                                type="number" placeholder="narrowest" value={neck}
                                onChange={(e) => setNeck(e.target.value)}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-lg font-mono font-bold text-zinc-900 outline-none focus:border-blue-500"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">{calcUnit}</span>
                        </div>
                     </div>
                </div>
                
                <div className="mb-4">
                     <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1">Activity Level</label>
                     <select 
                        value={activityLevel} 
                        onChange={(e) => setActivityLevel(parseFloat(e.target.value))}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm font-bold text-zinc-700 outline-none focus:border-blue-500"
                     >
                         <option value={1.2}>Sedentary (Office job)</option>
                         <option value={1.375}>Light (1-3 days/week)</option>
                         <option value={1.55}>Moderate (3-5 days/week)</option>
                         <option value={1.725}>Active (6-7 days/week)</option>
                         <option value={1.9}>Athlete (2x per day)</option>
                     </select>
                </div>

                {bodyStats ? (
                    <div className="animate-in zoom-in duration-300 space-y-3">
                         {/* BF & Muscle */}
                         <div className="grid grid-cols-2 gap-3">
                             <div className="bg-zinc-900 rounded-2xl p-4 text-white text-center">
                                 <div className="text-xs text-zinc-400 font-bold uppercase mb-1">Body Fat</div>
                                 <div className="text-2xl font-black text-blue-400">{bodyStats.bodyFat}%</div>
                                 <div className="text-[10px] text-zinc-500">{bodyStats.fatMass} kg fat</div>
                             </div>
                             <div className="bg-blue-600 rounded-2xl p-4 text-white text-center">
                                 <div className="text-xs text-blue-200 font-bold uppercase mb-1">Lean Mass</div>
                                 <div className="text-2xl font-black">{bodyStats.leanMass}</div>
                                 <div className="text-[10px] text-blue-200">kg muscle+bone</div>
                             </div>
                         </div>

                         {/* Calories */}
                         <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-4 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <div className="bg-orange-500 text-white p-2 rounded-lg">
                                     <Flame size={20} />
                                 </div>
                                 <div>
                                     <div className="font-bold text-orange-900 text-sm">Daily Calories</div>
                                     <div className="text-[10px] text-orange-700 font-medium">To maintain weight</div>
                                 </div>
                             </div>
                             <div className="text-2xl font-black text-orange-600">{bodyStats.tdee}</div>
                         </div>

                         {/* Frame Analysis */}
                         <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex items-center gap-3">
                             <Ruler className="text-zinc-400" size={20} />
                             <div>
                                 <div className="font-bold text-zinc-900 text-sm">Armwrestling Frame</div>
                                 <div className="text-xs text-zinc-500">
                                     Based on wrist: <strong className="text-zinc-900">{bodyStats.frame}</strong>
                                 </div>
                             </div>
                         </div>
                    </div>
                ) : (
                    <div className="text-center py-4 text-zinc-400 text-xs">
                        Enter Waist and Neck size to calculate stats.
                    </div>
                )}
            </div>

            {/* Charts */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-100">
                <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><Activity size={18} className="text-zinc-400"/> Volume Trend</h3>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={volumeData}>
                        <XAxis dataKey="date" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{fill: '#f4f4f5'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                        <Bar dataKey="Left" fill="#ef4444" stackId="a" radius={[0,0,0,0]} />
                        <Bar dataKey="Right" fill="#3b82f6" stackId="a" radius={[0,0,0,0]} />
                        <Bar dataKey="General" fill="#10b981" stackId="a" radius={[4,4,0,0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AI Coach */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-3xl shadow-sm border border-purple-100">
                <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2"><Brain size={18}/> AI Insight</h3>
                <div className="flex gap-2 mb-4">
                    <input 
                        value={aiQuery} 
                        onChange={(e)=>setAiQuery(e.target.value)} 
                        placeholder="Ask..." 
                        className="flex-1 bg-white border border-purple-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />
                    <button onClick={handleQuickAsk} disabled={aiLoading} className="bg-purple-600 text-white p-2 rounded-xl">
                        {aiLoading ? <Loader2 className="animate-spin" size={20}/> : <Send size={20}/>}
                    </button>
                </div>
                {aiResponse && <p className="text-sm text-purple-800 bg-white/50 p-3 rounded-xl">{aiResponse}</p>}
            </div>
        </>
      )}
      
      {activeTab === 'SECRETS' && (
          <Secrets />
      )}

      {activeTab === 'HISTORY' && (
        <div className="bg-zinc-900 rounded-3xl p-6 min-h-[500px]">
           <History workouts={workouts} onEditLog={onEditLog} exercises={exercises} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;