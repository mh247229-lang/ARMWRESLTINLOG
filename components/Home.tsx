import React, { useState } from 'react';
import { WorkoutSession, UserProfile, ViewState, TrainingPlan, PlanDay, ArmWrestlingPRs, DefenseStats, Exercise } from '../types';
import { Lock, ChevronDown, ChevronUp, Play, Info, Activity, Trophy, Calendar, ShieldCheck, RefreshCw, Sword } from 'lucide-react';
import { generateId, DEFAULT_EXERCISES } from '../constants';
import PlacementTest from './PlacementTest';

interface HomeProps {
  userProfile: UserProfile;
  workouts: WorkoutSession[];
  onChangeView: (view: ViewState) => void;
  onStartPlan: (session: WorkoutSession) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  initialTestOpen?: boolean;
  exercises?: Exercise[]; // Master list
  customExercises?: Exercise[]; // Deprecated
  t?: (key: string) => string;
}

const Home: React.FC<HomeProps> = ({ userProfile, workouts, onChangeView, onStartPlan, onUpdateProfile, initialTestOpen = false, exercises = [], t }) => {
  const [activeTab, setActiveTab] = useState<'PLAN' | 'TRAINING'>('PLAN');
  const [activeWeek, setActiveWeek] = useState(1);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [showPlacementTest, setShowPlacementTest] = useState(initialTestOpen);
  
  // Use the passed master list, fallback to just defaults if missing (but App.tsx passes it)
  const allExercises = exercises.length > 0 ? exercises : DEFAULT_EXERCISES;

  // Active AI Program from Profile
  const activePlan = userProfile.activeProgram;
  const defenseStats = userProfile.defenseStats;

  const getDayStatus = (planName: string, dayTitle: string) => {
      // Check if this specific day has been completed in history
      return workouts.some(w => w.name.includes(planName) && w.name.includes(dayTitle));
  };
  
  // DYNAMIC WEIGHT CALCULATOR
  const calculateTargetLoad = (exerciseId: string | undefined, intensity: string | undefined) => {
      if (!intensity || !userProfile.prs) return intensity; // Fallback to raw string
      
      let prValue = 0;
      const id = exerciseId || '';
      const prs = userProfile.prs as any; // Allow dynamic access

      // Fuzzy Map Exercises to PRs
      if (id.includes('pronation')) prValue = parseFloat(prs.pronation);
      else if (id.includes('rise')) prValue = parseFloat(prs.rising);
      else if (id.includes('supination')) prValue = parseFloat(prs.supination);
      else if (id.includes('cup') || id.includes('wrist')) prValue = parseFloat(prs.cupping);
      else if (id.includes('side')) prValue = parseFloat(prs.sidePressure);
      else if (id.includes('back')) prValue = parseFloat(prs.backPressure);
      else if (id.includes('bench')) prValue = parseFloat(prs.benchPress);
      else if (id.includes('squat')) prValue = parseFloat(prs.squat);
      else if (id.includes('deadlift')) prValue = parseFloat(prs.deadlift);

      if (!prValue) return intensity; // No PR found

      // Parse Intensity
      let percentage = 0;
      if (intensity.toLowerCase().includes('rpe 10')) percentage = 1.0;
      else if (intensity.toLowerCase().includes('rpe 9')) percentage = 0.95;
      else if (intensity.toLowerCase().includes('rpe 8')) percentage = 0.90;
      else if (intensity.toLowerCase().includes('rpe 7')) percentage = 0.85;
      else if (intensity.includes('%')) {
          const match = intensity.match(/(\d+)%/);
          if (match) percentage = parseInt(match[1]) / 100;
      }

      if (percentage > 0) {
          const calcWeight = Math.round(prValue * percentage);
          return `${calcWeight}kg (${intensity})`;
      }

      return intensity;
  };
  
  const startDayWorkout = (day: PlanDay) => {
    if (!activePlan) return;

    const exercises = day.exercises.map(ex => {
        // 1. Try to find exercise by ID first
        let exDef = allExercises.find(e => e.id === ex.exerciseId);
        
        // 2. If not found (AI hallucinated ID), try to find by Exact Name
        if (!exDef) {
            exDef = allExercises.find(e => e.name.toLowerCase() === ex.name.toLowerCase());
        }
        
        // 3. If still not found, try fuzzy search (Bidirectional)
        if (!exDef) {
             const searchName = ex.name.toLowerCase();
             exDef = allExercises.find(e => {
                 const dbName = e.name.toLowerCase();
                 return dbName.includes(searchName) || searchName.includes(dbName);
             });
        }

        // Use the found ID or generate a custom one if no match found
        const resolvedId = exDef?.id || `custom_${generateId()}`; 
        const resolvedName = exDef ? undefined : ex.name;

        // Check if it's an Arm Wrestling exercise (usually unilateral)
        // ROBUST CHECK: Use category OR keywords in the name if category is unknown
        let isArmWrestling = exDef?.category === 'Arm Wrestling'; 
        
        if (exDef === undefined) {
            const lowerName = ex.name.toLowerCase();
            const awKeywords = [
                'pronation', 'supination', 'rise', 'rising', 'cup', 'cupping', 
                'roll', 'pressure', 'hook', 'toproll', 'wrist', 'hammer', 'thumb', 
                'finger', 'grip', 'deviator', 'containment'
            ];
            
            // Exclude common gym terms that might overlap (like "Bench Press" having "Press")
            const gymExclusions = ['bench', 'squat', 'deadlift', 'leg', 'press (barbell)', 'press (dumbbell)'];
            
            if (awKeywords.some(k => lowerName.includes(k)) && !gymExclusions.some(k => lowerName.includes(k))) {
                isArmWrestling = true;
            }
        }

        const calculatedLoad = calculateTargetLoad(resolvedId, ex.intensity);
        let prefilledWeight = 0;
        if (typeof calculatedLoad === 'string' && calculatedLoad.includes('kg')) {
             prefilledWeight = parseFloat(calculatedLoad) || 0;
        }

        // For AW: Double the sets (Sets per hand). For Gym: Keep sets (Total sets).
        const setsToGenerate = isArmWrestling ? (ex.sets * 2) : ex.sets;

        return {
            id: generateId(),
            exerciseId: resolvedId,
            customName: resolvedName,
            sets: Array.from({ length: setsToGenerate }).map((_, i) => ({
                id: generateId(),
                // Alternate Right/Left for AW. Use BOTH for Gym.
                hand: isArmWrestling ? (i % 2 === 0 ? 'RIGHT' : 'LEFT') : 'BOTH',
                weight: prefilledWeight,
                reps: parseInt(ex.reps) || 0,
                completed: false
            })),
            config: { 
                angle: '90', 
                vector: exDef?.mechanic === 'CABLE' ? 'Front' : undefined,
                elbowPosition: exDef?.mechanic === 'FREE_WEIGHT' ? 'Tight' : undefined
            }
        };
    });

    const session: WorkoutSession = {
        id: generateId(),
        date: new Date().toISOString(),
        name: `${activePlan.name} - ${day.title}`,
        exercises: exercises as any,
    };

    onStartPlan(session);
  };

  const handleTestComplete = (defenseStats: DefenseStats, prs: ArmWrestlingPRs, program: TrainingPlan) => {
      onUpdateProfile({ 
          ...userProfile, 
          defenseStats, 
          prs: { ...userProfile.prs, ...prs }, // Merge new with old just in case
          activeProgram: program 
      });
      setShowPlacementTest(false);
  };

  // Helper to get week days
  const weekDays = activePlan?.days.filter(d => d.week === activeWeek) || [];

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header Tabs */}
      <div className="bg-white px-4 pt-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-10">
        <div className="flex gap-6">
            <button 
                onClick={() => setActiveTab('PLAN')}
                className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'PLAN' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-400'}`}
            >
                My Program
            </button>
            <button 
                onClick={() => setActiveTab('TRAINING')}
                className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'TRAINING' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-400'}`}
            >
                Feed
            </button>
        </div>
      </div>

      {activeTab === 'PLAN' ? (
        <div className="pb-24 animate-in fade-in slide-in-from-right-4 duration-300">
             
             {/* NO PLAN STATE */}
             {!activePlan ? (
                 <div className="p-6 text-center mt-10">
                     <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600 animate-pulse">
                         <Activity size={48} />
                     </div>
                     <h2 className="text-2xl font-black text-zinc-900 mb-2">No Active Plan</h2>
                     <p className="text-zinc-500 mb-8 max-w-xs mx-auto">
                         Take the comprehensive assessment to generate your custom AI 30-day cycle.
                     </p>
                     <button 
                        onClick={() => setShowPlacementTest(true)}
                        className="bg-red-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-red-600/30 hover:bg-red-700 transition-transform active:scale-95"
                     >
                         Start Assessment
                     </button>
                 </div>
             ) : (
                 /* ACTIVE PLAN DASHBOARD */
                 <div className="space-y-6 pt-6">
                     
                     {/* Defense & Attack Stats Cards */}
                     {defenseStats && (
                         <div className="px-4 grid grid-cols-2 gap-3">
                             <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-3 text-white shadow-lg shadow-red-900/20 relative overflow-hidden">
                                 <ShieldCheck className="absolute right-2 top-2 text-white/20" size={32} />
                                 <div className="relative z-10">
                                     <p className="text-[9px] font-bold uppercase opacity-80 mb-0.5">Inside Defense</p>
                                     <h3 className="text-sm font-black leading-tight">{defenseStats.insideDefenseLevel}</h3>
                                 </div>
                             </div>
                             <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-3 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden">
                                 <ShieldCheck className="absolute right-2 top-2 text-white/20" size={32} />
                                 <div className="relative z-10">
                                     <p className="text-[9px] font-bold uppercase opacity-80 mb-0.5">Outside Defense</p>
                                     <h3 className="text-sm font-black leading-tight">{defenseStats.outsideDefenseLevel}</h3>
                                 </div>
                             </div>
                             <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-3 text-white shadow-lg shadow-orange-900/20 relative overflow-hidden">
                                 <Sword className="absolute right-2 top-2 text-white/20" size={32} />
                                 <div className="relative z-10">
                                     <p className="text-[9px] font-bold uppercase opacity-80 mb-0.5">Inside Attack</p>
                                     <h3 className="text-sm font-black leading-tight">{defenseStats.insideAttackLevel}</h3>
                                 </div>
                             </div>
                             <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-3 text-white shadow-lg shadow-purple-900/20 relative overflow-hidden">
                                 <Sword className="absolute right-2 top-2 text-white/20" size={32} />
                                 <div className="relative z-10">
                                     <p className="text-[9px] font-bold uppercase opacity-80 mb-0.5">Outside Attack</p>
                                     <h3 className="text-sm font-black leading-tight">{defenseStats.outsideAttackLevel}</h3>
                                 </div>
                             </div>
                         </div>
                     )}

                     {/* Plan Header */}
                     <div className="px-4">
                        <div className="bg-zinc-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-2xl font-black italic uppercase">{activePlan.name}</h2>
                                        <p className="text-zinc-400 text-sm">30-Day AI Cycle</p>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            if (confirm("Retaking the test will replace your current program. Continue?")) {
                                                setShowPlacementTest(true);
                                            }
                                        }}
                                        className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 text-zinc-400"
                                    >
                                        <RefreshCw size={16} />
                                    </button>
                                </div>
                                {/* Week Selector */}
                                <div className="flex bg-zinc-800 p-1 rounded-xl">
                                    {[1, 2, 3, 4].map(w => (
                                        <button 
                                            key={w}
                                            onClick={() => setActiveWeek(w)}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeWeek === w ? 'bg-white text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                                        >
                                            Week {w}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                     </div>

                     {/* Days List */}
                     <div className="px-4 pb-10 space-y-4">
                         <h3 className="font-bold text-zinc-900 text-lg ml-1">Week {activeWeek} Schedule</h3>
                         {weekDays.map((day, idx) => {
                             const completed = getDayStatus(activePlan.name, day.title);
                             
                             return (
                                <div 
                                    key={idx} 
                                    className={`rounded-2xl border transition-all duration-300 overflow-hidden relative ${
                                        expandedDay === idx 
                                        ? 'bg-white border-red-200 shadow-lg shadow-red-100' 
                                        : day.isRest 
                                            ? 'bg-gray-100 border-transparent opacity-70' 
                                            : completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100 shadow-sm'
                                    }`}
                                >
                                    <div 
                                        onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
                                        className="p-5 flex items-center justify-between cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-sm ${
                                                completed ? 'bg-green-100 text-green-600' :
                                                day.isRest ? 'bg-gray-200 text-gray-400' : 'bg-red-50 text-red-600'
                                            }`}>
                                                <span className="text-[10px] uppercase opacity-70">Day</span>
                                                {day.day}
                                            </div>
                                            <div>
                                                <h3 className={`font-bold text-lg ${day.isRest ? 'text-gray-400' : 'text-gray-900'}`}>{day.title}</h3>
                                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{day.focus}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {expandedDay === idx ? <ChevronUp className="text-red-500" size={20}/> : <ChevronDown className="text-gray-300" size={20}/>}
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {expandedDay === idx && !day.isRest && (
                                        <div className="px-5 pb-5 animate-in slide-in-from-top-2">
                                            <div className="border-t border-gray-100 pt-4 space-y-3">
                                                {day.exercises.map((ex, exIdx) => (
                                                    <div key={exIdx} className="flex justify-between items-start text-sm">
                                                        <div className="flex-1 pr-4">
                                                            <div className="font-semibold text-gray-800">{ex.name}</div>
                                                            <div className="flex flex-col gap-1 mt-1">
                                                                <div className="text-xs text-amber-600 font-bold flex items-center gap-1">
                                                                    <Activity size={10} /> {calculateTargetLoad(ex.exerciseId, ex.intensity)}
                                                                </div>
                                                                {ex.note && (
                                                                    <div className="text-xs text-gray-500 italic flex items-center gap-1">
                                                                        <Info size={10}/> {ex.note}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right whitespace-nowrap">
                                                            <div className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">{ex.sets} x {ex.reps}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    startDayWorkout(day);
                                                }}
                                                className="w-full mt-6 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Play size={18} fill="currentColor" /> {completed ? 'Do it Again' : 'Start Workout'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                             );
                         })}
                     </div>
                 </div>
             )}

        </div>
      ) : (
        <div className="p-4 animate-in fade-in slide-in-from-left-4 duration-300">
             <div className="text-center py-20">
                 <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="text-gray-400" size={24} />
                 </div>
                 <h2 className="text-xl font-bold text-gray-300">Training Feed</h2>
                 <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">
                    Complete your first workout to see your history here.
                 </p>
             </div>
        </div>
      )}

      {/* PLACEMENT TEST MODAL */}
      {showPlacementTest && (
          <PlacementTest 
            onClose={() => setShowPlacementTest(false)}
            onComplete={handleTestComplete} 
          />
      )}
    </div>
  );
};

export default Home;