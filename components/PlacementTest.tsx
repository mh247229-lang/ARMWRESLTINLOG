
import React, { useState } from 'react';
import { Trophy, Activity, X, Lock, Dumbbell, Brain, Loader2, Settings2, ChevronDown, ChevronUp, Sword, Shield } from 'lucide-react';
import { TrainingPlan, ArmWrestlingPRs, DefenseStats, ArmWrestlingLevel, TestConfig } from '../types';
import { generateCustomProgram } from '../services/geminiService';

interface PlacementTestProps {
    onComplete: (defenseStats: DefenseStats, prs: ArmWrestlingPRs, program: TrainingPlan) => void;
    onClose: () => void;
}

type LiftInput = { weight: string, reps: string };
type HandData = { right: LiftInput, left: LiftInput };

const PlacementTest: React.FC<PlacementTestProps> = ({ onComplete, onClose }) => {
    const [step, setStep] = useState<'AW_LIFTS' | 'GYM_LIFTS' | 'GENERATING' | 'RESULT'>('AW_LIFTS');
    
    // Armwrestling Specific Lifts
    const [awLifts, setAwLifts] = useState<Record<string, HandData>>({
        pronation: { right: { weight: '', reps: '' }, left: { weight: '', reps: '' } },
        rising: { right: { weight: '', reps: '' }, left: { weight: '', reps: '' } },
        cupping: { right: { weight: '', reps: '' }, left: { weight: '', reps: '' } },
        supination: { right: { weight: '', reps: '' }, left: { weight: '', reps: '' } },
        side: { right: { weight: '', reps: '' }, left: { weight: '', reps: '' } },
        hammer: { right: { weight: '', reps: '' }, left: { weight: '', reps: '' } },
        grip: { right: { weight: '', reps: '' }, left: { weight: '', reps: '' } }, 
    });

    // Configuration for each AW Lift
    const [awConfigs, setAwConfigs] = useState<Record<string, TestConfig>>({
        pronation: { isStatic: false, mechanic: 'FREE_WEIGHT', angle: '90', elbow: 'Tight', vector: 'Front' },
        rising: { isStatic: false, mechanic: 'FREE_WEIGHT', angle: '90', elbow: 'Tight', vector: 'Front' },
        cupping: { isStatic: false, mechanic: 'FREE_WEIGHT', angle: '90', elbow: 'Tight', vector: 'Front' },
        supination: { isStatic: false, mechanic: 'FREE_WEIGHT', angle: '90', elbow: 'Tight', vector: 'Front' },
        side: { isStatic: false, mechanic: 'CABLE', angle: '90', elbow: 'Tight', vector: 'Side' },
        hammer: { isStatic: false, mechanic: 'FREE_WEIGHT', angle: '90', elbow: 'Tight', vector: 'Front' },
        grip: { isStatic: false, mechanic: 'FREE_WEIGHT', angle: '90', elbow: 'Tight', vector: 'Front' },
    });

    // Expanded state for UI
    const [expandedConfig, setExpandedConfig] = useState<string | null>(null);

    // Gym Specific Lifts (Single input)
    const [gymLifts, setGymLifts] = useState({
        bench: { weight: '', reps: '' },
        squat: { weight: '', reps: '' },
        deadlift: { weight: '', reps: '' },
        latpull: { weight: '', reps: '' }
    });
    
    const [finalStats, setFinalStats] = useState<DefenseStats | null>(null);
    const [finalPRs, setFinalPRs] = useState<ArmWrestlingPRs | null>(null);
    const [generatedPlan, setGeneratedPlan] = useState<TrainingPlan | null>(null);

    const updateAwLift = (key: string, hand: 'left' | 'right', field: 'weight' | 'reps', value: string) => {
        setAwLifts(prev => ({
            ...prev,
            [key]: { ...prev[key], [hand]: { ...prev[key][hand], [field]: value } }
        }));
    };

    const updateAwConfig = (key: string, field: keyof TestConfig, value: any) => {
        setAwConfigs(prev => ({
            ...prev,
            [key]: { ...prev[key], [field]: value }
        }));
    };

    const updateGymLift = (key: string, field: 'weight' | 'reps', value: string) => {
        setGymLifts(prev => ({
            ...prev,
            [key]: { ...prev[key], [field]: value }
        }));
    };

    const calculateOneRepMax = (weight: number, reps: number) => {
        if (!weight) return 0;
        if (reps === 0) return 0;
        if (reps === 1) return weight;
        return weight * (1 + reps / 30);
    };

    const getLevelFromWeight = (weight: number): ArmWrestlingLevel => {
        if (weight >= 70) return 'Extreme Elite';
        if (weight >= 60) return 'Elite';
        if (weight >= 50) return 'Adv. Expert';
        if (weight >= 40) return 'Expert';
        if (weight >= 30) return 'Advanced';
        if (weight >= 20) return 'Intermediate';
        return 'Beginner';
    };

    const processResults = async () => {
        setStep('GENERATING');
        
        // 1. Calculate Armwrestling PRs (Best of Left/Right)
        const calcAw: Record<string, number> = {};
        const detailedStats: Record<string, { weight: number, config: TestConfig }> = {};

        Object.keys(awLifts).forEach(key => {
            const lift = awLifts[key];
            const rMax = calculateOneRepMax(parseFloat(lift.right.weight) || 0, parseFloat(lift.right.reps) || 0);
            const lMax = calculateOneRepMax(parseFloat(lift.left.weight) || 0, parseFloat(lift.left.reps) || 0);
            const bestMax = Math.round(Math.max(rMax, lMax));
            
            calcAw[key] = bestMax;
            detailedStats[key] = {
                weight: bestMax,
                config: awConfigs[key]
            };
        });

        // 2. Calculate Gym PRs
        const calcGym: Record<string, number> = {};
        Object.keys(gymLifts).forEach(key => {
            // @ts-ignore
            const lift = gymLifts[key];
            calcGym[key] = Math.round(calculateOneRepMax(parseFloat(lift.weight) || 0, parseFloat(lift.reps) || 0));
        });

        // 3. Determine Levels
        // Defense: Control based
        const insideDefAvg = (calcAw['cupping'] + calcAw['supination'] + calcAw['side']) / 3;
        const insideDefenseLevel = getLevelFromWeight(insideDefAvg);

        const outsideDefAvg = (calcAw['pronation'] + calcAw['rising'] + calcAw['hammer']) / 3;
        const outsideDefenseLevel = getLevelFromWeight(outsideDefAvg);

        // Attack: Power based
        // Inside Attack: Cup + Side + Pushing Power (Bench)
        const insideAtkAvg = (calcAw['cupping'] + calcAw['side'] + calcGym['bench']) / 3;
        const insideAttackLevel = getLevelFromWeight(insideAtkAvg);

        // Outside Attack: Pronation + Rise + Dragging Power (Lat Pull)
        const outsideAtkAvg = (calcAw['pronation'] + calcAw['rising'] + calcGym['latpull']) / 3;
        const outsideAttackLevel = getLevelFromWeight(outsideAtkAvg);

        const totalAvg = (insideDefAvg + outsideDefAvg + insideAtkAvg + outsideAtkAvg) / 4;
        const overallLevel = getLevelFromWeight(totalAvg);

        const defenseStats: DefenseStats = {
            insideDefenseLevel,
            outsideDefenseLevel,
            insideAttackLevel,
            outsideAttackLevel,
            overallLevel,
            lastTestDate: new Date().toISOString()
        };

        const prsObj: ArmWrestlingPRs = {
            pronation: calcAw['pronation'].toString(),
            rising: calcAw['rising'].toString(),
            cupping: calcAw['cupping'].toString(),
            supination: calcAw['supination'].toString(),
            sidePressure: calcAw['side'].toString(),
            sideHammer: calcAw['hammer'].toString(),
            gripCurl: calcAw['grip'].toString(),
            backPressure: calcAw['hammer'].toString(),
            benchPress: calcGym['bench'].toString(),
            squat: calcGym['squat'].toString(),
            deadlift: calcGym['deadlift'].toString(),
            latPulldown: calcGym['latpull'].toString(),
        };

        setFinalStats(defenseStats);
        setFinalPRs(prsObj);

        // 4. Generate AI Program with detailed Biomechanics
        const plan = await generateCustomProgram(prsObj, detailedStats);
        
        if (plan) {
            setGeneratedPlan(plan);
            setStep('RESULT');
        } else {
            alert("AI Generation timed out. Using standard plan.");
            setStep('RESULT'); 
        }
    };

    const awLabels: Record<string, string> = {
        pronation: 'Pronation',
        rising: 'Rising',
        cupping: 'Cupping',
        supination: 'Supination',
        side: 'Side Pressure',
        hammer: 'Hammer',
        grip: 'Finger Grip'
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 relative overflow-hidden shadow-2xl flex flex-col h-[85vh]">
                
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 z-10">
                    <X size={20} />
                </button>

                {/* --- STEP 1: ARMWRESTLING LIFTS --- */}
                {step === 'AW_LIFTS' && (
                    <div className="flex flex-col h-full pt-4">
                        <div className="flex items-center gap-3 mb-4 shrink-0">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                <Activity className="text-red-600" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-zinc-900 leading-none">Table Strength</h2>
                                <p className="text-xs text-zinc-500 font-bold uppercase">Step 1 of 2: Setup & PRs</p>
                            </div>
                        </div>

                        <div className="overflow-y-auto pr-1 flex-1 space-y-4 pb-20 min-h-0 scrollbar-hide">
                            {Object.keys(awLifts).map((key) => {
                                const cfg = awConfigs[key];
                                return (
                                <div key={key} className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 shadow-sm relative transition-all">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="block text-sm font-black text-zinc-800 uppercase ml-1 tracking-wide">{awLabels[key]}</label>
                                        <button 
                                            onClick={() => setExpandedConfig(expandedConfig === key ? null : key)}
                                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase border transition-all ${expandedConfig === key ? 'bg-red-600 text-white border-red-600' : 'bg-white text-zinc-500 border-zinc-200'}`}
                                        >
                                            <Settings2 size={12} /> {cfg.angle}° {cfg.mechanic === 'CABLE' ? 'Cable' : 'Free'}
                                            {expandedConfig === key ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                                        </button>
                                    </div>
                                    
                                    {/* Config Panel */}
                                    {expandedConfig === key && (
                                        <div className="bg-white border border-zinc-200 rounded-lg p-3 mb-3 animate-in slide-in-from-top-2 grid grid-cols-2 gap-3">
                                            <div>
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase">Type</span>
                                                <select 
                                                    value={cfg.isStatic ? 'Static' : 'Dynamic'} 
                                                    onChange={(e) => updateAwConfig(key, 'isStatic', e.target.value === 'Static')}
                                                    className="w-full text-xs font-bold p-1 bg-zinc-50 rounded border border-zinc-200 mt-1"
                                                >
                                                    <option value="Dynamic">Reps (Dynamic)</option>
                                                    <option value="Static">Static Hold</option>
                                                </select>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase">Tool</span>
                                                <select 
                                                    value={cfg.mechanic} 
                                                    onChange={(e) => updateAwConfig(key, 'mechanic', e.target.value)}
                                                    className="w-full text-xs font-bold p-1 bg-zinc-50 rounded border border-zinc-200 mt-1"
                                                >
                                                    <option value="FREE_WEIGHT">Free Weight</option>
                                                    <option value="CABLE">Cable</option>
                                                </select>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase">Angle</span>
                                                <select 
                                                    value={cfg.angle} 
                                                    onChange={(e) => updateAwConfig(key, 'angle', e.target.value)}
                                                    className="w-full text-xs font-bold p-1 bg-zinc-50 rounded border border-zinc-200 mt-1"
                                                >
                                                    <option value="45">45°</option>
                                                    <option value="70">70°</option>
                                                    <option value="90">90°</option>
                                                    <option value="110">110°</option>
                                                    <option value="135">135°</option>
                                                </select>
                                            </div>
                                            <div>
                                                {cfg.mechanic === 'CABLE' ? (
                                                    <>
                                                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Vector</span>
                                                        <select 
                                                            value={cfg.vector} 
                                                            onChange={(e) => updateAwConfig(key, 'vector', e.target.value)}
                                                            className="w-full text-xs font-bold p-1 bg-zinc-50 rounded border border-zinc-200 mt-1"
                                                        >
                                                            <option value="Front">Front</option>
                                                            <option value="High Front">High Front</option>
                                                            <option value="Low Front">Low Front</option>
                                                            <option value="Side">Side</option>
                                                            <option value="High Side">High Side</option>
                                                            <option value="Low Side">Low Side</option>
                                                        </select>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Elbow</span>
                                                        <select 
                                                            value={cfg.elbow} 
                                                            onChange={(e) => updateAwConfig(key, 'elbow', e.target.value)}
                                                            className="w-full text-xs font-bold p-1 bg-zinc-50 rounded border border-zinc-200 mt-1"
                                                        >
                                                            <option value="Stomach">Stomach</option>
                                                            <option value="Tight">Tight</option>
                                                            <option value="Away">Away</option>
                                                        </select>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Right Hand */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 shrink-0 flex flex-col items-center">
                                            <div className="w-3 h-3 rounded-full bg-red-600 mb-1"></div>
                                            <span className="text-[10px] font-bold text-red-600">R</span>
                                        </div>
                                        <input 
                                            type="number" 
                                            value={awLifts[key].right.weight} 
                                            onChange={(e) => updateAwLift(key, 'right', 'weight', e.target.value)}
                                            className="w-full bg-white border border-red-100 rounded-lg p-2 font-bold text-sm text-center focus:ring-2 focus:ring-red-200 outline-none"
                                            placeholder="kg"
                                        />
                                        <input 
                                            type="number" 
                                            value={awLifts[key].right.reps} 
                                            onChange={(e) => updateAwLift(key, 'right', 'reps', e.target.value)}
                                            className="w-20 bg-white border border-red-100 rounded-lg p-2 font-bold text-sm text-center focus:ring-2 focus:ring-red-200 outline-none"
                                            placeholder={cfg.isStatic ? 'sec' : 'reps'}
                                        />
                                    </div>

                                    {/* Left Hand */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 shrink-0 flex flex-col items-center">
                                            <div className="w-3 h-3 rounded-full bg-blue-600 mb-1"></div>
                                            <span className="text-[10px] font-bold text-blue-600">L</span>
                                        </div>
                                        <input 
                                            type="number" 
                                            value={awLifts[key].left.weight} 
                                            onChange={(e) => updateAwLift(key, 'left', 'weight', e.target.value)}
                                            className="w-full bg-white border border-blue-100 rounded-lg p-2 font-bold text-sm text-center focus:ring-2 focus:ring-blue-200 outline-none"
                                            placeholder="kg"
                                        />
                                        <input 
                                            type="number" 
                                            value={awLifts[key].left.reps} 
                                            onChange={(e) => updateAwLift(key, 'left', 'reps', e.target.value)}
                                            className="w-20 bg-white border border-blue-100 rounded-lg p-2 font-bold text-sm text-center focus:ring-2 focus:ring-blue-200 outline-none"
                                            placeholder={cfg.isStatic ? 'sec' : 'reps'}
                                        />
                                    </div>
                                </div>
                                );
                            })}
                        </div>

                        <div className="shrink-0 pt-4 border-t border-gray-100">
                            <button 
                                onClick={() => setStep('GYM_LIFTS')}
                                className="w-full bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-red-700 transition-all"
                            >
                                Next: Gym Stats
                            </button>
                        </div>
                    </div>
                )}

                {/* --- STEP 2: GYM LIFTS --- */}
                {step === 'GYM_LIFTS' && (
                    <div className="flex flex-col h-full pt-4 animate-in slide-in-from-right">
                         <div className="flex items-center gap-3 mb-4 shrink-0">
                            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center">
                                <Dumbbell className="text-zinc-600" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-zinc-900 leading-none">Gym Power</h2>
                                <p className="text-xs text-zinc-500 font-bold uppercase">Step 2 of 2: General Strength</p>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1 overflow-y-auto pb-10 min-h-0">
                            {[
                                { id: 'bench', label: 'Bench Press' },
                                { id: 'squat', label: 'Back Squat' },
                                { id: 'deadlift', label: 'Deadlift' },
                                { id: 'latpull', label: 'Lat Pulldown' }
                            ].map((lift) => (
                                <div key={lift.id} className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
                                    <span className="font-bold text-zinc-800">{lift.label}</span>
                                    <div className="flex gap-2 w-48">
                                        <input 
                                            type="number" 
                                            // @ts-ignore
                                            value={gymLifts[lift.id].weight} 
                                            // @ts-ignore
                                            onChange={(e) => updateGymLift(lift.id, 'weight', e.target.value)}
                                            className="w-full bg-white border border-zinc-200 rounded-lg p-2 font-bold text-sm text-center focus:border-red-500 outline-none"
                                            placeholder="kg"
                                        />
                                        <input 
                                            type="number" 
                                            // @ts-ignore
                                            value={gymLifts[lift.id].reps} 
                                            // @ts-ignore
                                            onChange={(e) => updateGymLift(lift.id, 'reps', e.target.value)}
                                            className="w-20 bg-white border border-zinc-200 rounded-lg p-2 font-bold text-sm text-center focus:border-red-500 outline-none"
                                            placeholder="reps"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 mt-4 shrink-0 border-t border-gray-100 pt-4">
                            <button 
                                onClick={() => setStep('AW_LIFTS')}
                                className="flex-1 bg-gray-100 text-gray-500 font-bold py-4 rounded-xl hover:bg-gray-200"
                            >
                                Back
                            </button>
                            <button 
                                onClick={processResults}
                                className="flex-[2] bg-black text-white font-bold py-4 rounded-xl shadow-lg hover:bg-zinc-800"
                            >
                                Analyze & Generate
                            </button>
                        </div>
                    </div>
                )}

                {/* --- GENERATING STATE --- */}
                {step === 'GENERATING' && (
                    <div className="flex flex-col items-center justify-center h-full text-center animate-in zoom-in">
                        <Loader2 className="w-16 h-16 text-red-600 animate-spin mb-6" />
                        <h2 className="text-2xl font-black text-zinc-900 mb-2">Analyzing Biomechanics</h2>
                        <p className="text-zinc-500 text-sm max-w-xs">
                            The AI is evaluating your Inside vs. Outside strength ratios, technical vectors, and building a custom 30-day program...
                        </p>
                    </div>
                )}

                {/* --- RESULT STEP --- */}
                {step === 'RESULT' && finalStats && generatedPlan && (
                    <div className="flex flex-col h-full text-center animate-in zoom-in pt-4">
                        <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-2" />
                        <h2 className="text-3xl font-black text-zinc-900 mb-1">Analysis Complete</h2>
                        <p className="text-zinc-400 text-xs mb-6 font-medium">Program Generated Successfully</p>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {/* Inside Defense */}
                            <div className="bg-red-50 border border-red-100 p-2 rounded-xl">
                                <div className="flex justify-center mb-1 text-red-400"><Shield size={16}/></div>
                                <div className="text-[10px] font-bold text-red-400 uppercase">Inside Def</div>
                                <div className="text-sm font-black text-red-700">{finalStats.insideDefenseLevel}</div>
                            </div>
                            {/* Outside Defense */}
                            <div className="bg-blue-50 border border-blue-100 p-2 rounded-xl">
                                <div className="flex justify-center mb-1 text-blue-400"><Shield size={16}/></div>
                                <div className="text-[10px] font-bold text-blue-400 uppercase">Outside Def</div>
                                <div className="text-sm font-black text-blue-700">{finalStats.outsideDefenseLevel}</div>
                            </div>
                             {/* Inside Attack */}
                             <div className="bg-orange-50 border border-orange-100 p-2 rounded-xl">
                                <div className="flex justify-center mb-1 text-orange-400"><Sword size={16}/></div>
                                <div className="text-[10px] font-bold text-orange-400 uppercase">Inside Atk</div>
                                <div className="text-sm font-black text-orange-700">{finalStats.insideAttackLevel}</div>
                            </div>
                            {/* Outside Attack */}
                            <div className="bg-purple-50 border border-purple-100 p-2 rounded-xl">
                                <div className="flex justify-center mb-1 text-purple-400"><Sword size={16}/></div>
                                <div className="text-[10px] font-bold text-purple-400 uppercase">Outside Atk</div>
                                <div className="text-sm font-black text-purple-700">{finalStats.outsideAttackLevel}</div>
                            </div>
                        </div>

                        <div className="bg-zinc-900 text-white p-4 rounded-2xl flex items-center gap-4 text-left shadow-xl">
                             <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                                 <Brain size={24} className="text-purple-400" />
                             </div>
                             <div>
                                 <div className="text-xs text-zinc-400 uppercase font-bold">Your New Plan</div>
                                 <div className="font-bold text-lg">{generatedPlan.name}</div>
                                 <div className="text-xs text-zinc-500">30-Day Auto-Periodization</div>
                             </div>
                        </div>

                        <button 
                            onClick={() => onComplete(finalStats, finalPRs!, generatedPlan)}
                            className="w-full mt-auto bg-red-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-600/30"
                        >
                            Start 30-Day Cycle <Lock size={18} className="opacity-50" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlacementTest;
