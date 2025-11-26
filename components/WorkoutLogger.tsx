import React, { useState, useMemo } from 'react';
import { WorkoutSession, WorkoutExercise, ExerciseSet, Hand, ArmWrestlingConfig, Exercise } from '../types';
import { generateId, ANGLE_BENEFITS, VECTOR_BENEFITS, ELBOW_BENEFITS } from '../constants';
import { Plus, Trash2, CheckCircle2, Circle, X, Search, ArrowLeft, Pencil, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface WorkoutLoggerProps {
  initialWorkout?: WorkoutSession | null;
  onSave: (workout: WorkoutSession) => void;
  onCancel: () => void;
  exercises?: Exercise[]; // Master list of exercises
  customExercises?: Exercise[]; // Deprecated
  t?: (key: string) => string;
}

const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({ initialWorkout, onSave, onCancel, exercises = [], t }) => {
  // Initialize with existing data if editing
  const [sessionName, setSessionName] = useState(initialWorkout?.name || 'New training 1');
  const [activeExercises, setActiveExercises] = useState<WorkoutExercise[]>(
      initialWorkout?.exercises ? JSON.parse(JSON.stringify(initialWorkout.exercises)) : []
  );
  
  // Visibility state for config sections
  const [isConfigOpen, setIsConfigOpen] = useState<Record<string, boolean>>({});

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');

  // Using the passed exercises prop which includes all edits
  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => 
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ex.bodyPart.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, exercises]);

  const addExercise = () => {
    if (!selectedExerciseId) return;
    const exDetails = exercises.find(e => e.id === selectedExerciseId);
    const isArmWrestling = exDetails?.category === 'Arm Wrestling';
    
    let defaultConfig: ArmWrestlingConfig | undefined = undefined;
    if (isArmWrestling) {
        defaultConfig = {
            angle: '90',
            handleThickness: 4,
            strap: false,
            vector: exDetails?.mechanic === 'CABLE' ? 'Front' : undefined,
            elbowPosition: exDetails?.mechanic === 'FREE_WEIGHT' ? 'Tight' : undefined
        };
    }

    const newExerciseId = generateId();
    
    // Automatically create Right/Left pair for Arm Wrestling, or single BOTH set for others
    const initialSets: ExerciseSet[] = [];
    if (isArmWrestling) {
        initialSets.push({
            id: generateId(),
            hand: 'RIGHT',
            weight: 0,
            reps: 0,
            completed: false
        });
        initialSets.push({
            id: generateId(),
            hand: 'LEFT',
            weight: 0,
            reps: 0,
            completed: false
        });
    } else {
        initialSets.push({
            id: generateId(),
            hand: 'BOTH',
            weight: 0,
            reps: 0,
            completed: false
        });
    }

    const newExercise: WorkoutExercise = {
      id: newExerciseId,
      exerciseId: selectedExerciseId,
      config: defaultConfig,
      sets: initialSets
    };

    setActiveExercises([...activeExercises, newExercise]);
    // Default open configuration for new exercise
    setIsConfigOpen(prev => ({...prev, [newExerciseId]: true}));

    setIsModalOpen(false);
    setSelectedExerciseId('');
    setSearchTerm('');
  };

  const toggleConfig = (id: string) => {
    setIsConfigOpen(prev => ({...prev, [id]: !prev[id]}));
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof ExerciseSet, value: any) => {
    const updated = [...activeExercises];
    updated[exerciseIndex].sets[setIndex] = { ...updated[exerciseIndex].sets[setIndex], [field]: value };
    setActiveExercises(updated);
  };

  const updateConfig = (exerciseIndex: number, field: keyof ArmWrestlingConfig, value: any) => {
    const updated = [...activeExercises];
    if (!updated[exerciseIndex].config) updated[exerciseIndex].config = {};
    updated[exerciseIndex].config = { ...updated[exerciseIndex].config, [field]: value };
    setActiveExercises(updated);
  };

  const addSet = (exerciseIndex: number) => {
    const updated = [...activeExercises];
    const exercise = updated[exerciseIndex];
    const details = exercises.find(e => e.id === exercise.exerciseId);
    const isArmWrestling = details?.category === 'Arm Wrestling';
    
    const previousSet = exercise.sets[exercise.sets.length - 1];
    
    let nextHand: Hand = 'RIGHT';
    if (previousSet) {
        if (isArmWrestling) {
             // Alternate hands for arm wrestling
             nextHand = previousSet.hand === 'RIGHT' ? 'LEFT' : 'RIGHT';
        } else {
             // Copy previous hand for regular exercises (BOTH stays BOTH)
             nextHand = previousSet.hand;
        }
    } else {
        nextHand = isArmWrestling ? 'RIGHT' : 'BOTH';
    }

    updated[exerciseIndex].sets.push({
      id: generateId(),
      hand: nextHand,
      weight: previousSet ? previousSet.weight : 0,
      reps: previousSet ? previousSet.reps : 0,
      completed: false
    });
    setActiveExercises(updated);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updated = [...activeExercises];
    updated[exerciseIndex].sets.splice(setIndex, 1);
    if (updated[exerciseIndex].sets.length === 0) updated.splice(exerciseIndex, 1);
    setActiveExercises(updated);
  };

  const removeExercise = (index: number) => {
    const updated = [...activeExercises];
    updated.splice(index, 1);
    setActiveExercises(updated);
  };

  const handleSave = () => {
    if (activeExercises.length === 0) {
      alert("Add at least one exercise to save.");
      return;
    }
    const workout: WorkoutSession = {
      id: initialWorkout?.id || generateId(), // Keep existing ID if editing
      date: initialWorkout?.date || new Date().toISOString(), // Keep original date if editing
      name: sessionName,
      exercises: activeExercises
    };
    onSave(workout);
  };

  const getExerciseDetails = (id: string) => exercises.find(e => e.id === id);

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto">
      {/* Header Red Theme */}
      <div className="bg-red-600 p-6 pb-8 text-white shadow-md">
         <div className="flex items-center gap-4 mb-2">
             <button onClick={onCancel}><ArrowLeft size={24}/></button>
             <div className="flex items-center gap-2">
                 <input 
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    className="bg-transparent text-xl font-bold placeholder:text-red-200 focus:outline-none max-w-[200px]"
                 />
                 <Pencil size={16} className="text-red-200"/>
             </div>
         </div>
         <p className="text-red-100 text-sm ml-10">{initialWorkout ? 'Editing Workout' : 'New Workout'}</p>
      </div>

      <div className="px-4 -mt-4 pb-24">
         {/* Add Exercise Bar */}
         <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-white rounded-3xl py-4 flex items-center justify-center gap-2 text-red-600 font-bold shadow-lg mb-6 hover:bg-red-50 transition-colors"
         >
             <Plus size={20} /> Add exercises
         </button>

         {/* Empty State */}
         {activeExercises.length === 0 && (
             <div className="text-center text-gray-400 mt-20">
                 Please add your first exercise
             </div>
         )}

         {/* Exercise Cards */}
         <div className="space-y-4">
            {activeExercises.map((ex, exIdx) => {
                const details = getExerciseDetails(ex.exerciseId);
                const isArmWrestling = details?.category === 'Arm Wrestling';
                const isCable = details?.mechanic === 'CABLE';

                return (
                    <div key={ex.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-2">
                            <div className="flex items-center gap-3">
                                {/* Show updated image if available */}
                                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                                    {details?.imageUrl ? <img src={details.imageUrl} className="w-full h-full object-cover" /> : null}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{ex.customName || details?.name || 'Custom Exercise'}</h3>
                                    <p className="text-xs text-gray-400">{details?.bodyPart || 'General'}</p>
                                </div>
                            </div>
                            <button onClick={() => removeExercise(exIdx)} className="text-gray-300 hover:text-red-500"><Trash2 size={18}/></button>
                        </div>

                        {/* Arm Wrestling Specific Config Selectors */}
                        {isArmWrestling && ex.config && (
                            <div className="mb-4 bg-zinc-50 rounded-xl border border-zinc-100 overflow-hidden">
                                <div 
                                    onClick={() => toggleConfig(ex.id)}
                                    className="p-3 flex items-center justify-between cursor-pointer bg-zinc-50 hover:bg-zinc-100 transition-colors"
                                >
                                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase">Technical Setup</h4>
                                    {isConfigOpen[ex.id] ? <ChevronUp size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
                                </div>
                                
                                {isConfigOpen[ex.id] && (
                                    <div className="p-3 pt-0 animate-in slide-in-from-top-2">
                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Angle Selector - VISIBLE FOR ALL ARM WRESTLING */}
                                            <div>
                                                <label className="text-[10px] font-bold text-red-500 uppercase block mb-1">Angle</label>
                                                <div className="relative">
                                                    <select 
                                                        value={ex.config.angle || '90'}
                                                        onChange={(e) => updateConfig(exIdx, 'angle', e.target.value)}
                                                        className="w-full appearance-none bg-white border border-zinc-200 text-zinc-900 text-xs font-bold py-2 px-3 rounded-lg focus:border-red-500 outline-none"
                                                    >
                                                        <option value="45">45° (Open/Defensive)</option>
                                                        <option value="70">70° (High Post)</option>
                                                        <option value="90">90° (Neutral)</option>
                                                        <option value="100">100° (Posting)</option>
                                                        <option value="110">110° (Inside)</option>
                                                        <option value="135">135° (Deep Hook)</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={14} />
                                                </div>
                                            </div>
                                            
                                            {/* Vector Selector - SHOWN ONLY IF CABLE */}
                                            {isCable && (
                                                <div>
                                                    <label className="text-[10px] font-bold text-red-500 uppercase block mb-1">Cable Vector</label>
                                                    <div className="relative">
                                                        <select 
                                                            value={ex.config.vector || 'Front'}
                                                            onChange={(e) => updateConfig(exIdx, 'vector', e.target.value)}
                                                            className="w-full appearance-none bg-white border border-zinc-200 text-zinc-900 text-xs font-bold py-2 px-3 rounded-lg focus:border-red-500 outline-none"
                                                        >
                                                            <option value="Front">Front</option>
                                                            <option value="High Front">High Front</option>
                                                            <option value="Low Front">Low Front</option>
                                                            <option value="Middle Side">Middle Side</option>
                                                            <option value="High Side">High Side</option>
                                                            <option value="Low Side">Low Side</option>
                                                        </select>
                                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={14} />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Elbow Position - SHOWN ONLY IF REGULAR (NOT CABLE) */}
                                            {!isCable && (
                                                 <div>
                                                    <label className="text-[10px] font-bold text-red-500 uppercase block mb-1">Elbow Pos</label>
                                                    <div className="relative">
                                                        <select 
                                                            value={ex.config.elbowPosition || 'Tight'}
                                                            onChange={(e) => updateConfig(exIdx, 'elbowPosition', e.target.value)}
                                                            className="w-full appearance-none bg-white border border-zinc-200 text-zinc-900 text-xs font-bold py-2 px-3 rounded-lg focus:border-red-500 outline-none"
                                                        >
                                                            <option value="Stomach">On Stomach</option>
                                                            <option value="Tight">Close to Body</option>
                                                            <option value="Away">Slightly Away</option>
                                                            <option value="Far">Far (Long Lever)</option>
                                                        </select>
                                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={14} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Handle & Strap Settings */}
                                        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-zinc-100 pt-3">
                                            <div>
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Handle: {ex.config.handleThickness || 4}cm</label>
                                                <input 
                                                    type="range" min="1" max="8" step="0.5"
                                                    value={ex.config.handleThickness || 4}
                                                    onChange={(e) => updateConfig(exIdx, 'handleThickness', parseFloat(e.target.value))}
                                                    className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                                                />
                                            </div>
                                            <div className="flex items-center justify-end">
                                                <button 
                                                    onClick={() => updateConfig(exIdx, 'strap', !ex.config?.strap)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${ex.config?.strap ? 'bg-zinc-800 text-white border-zinc-800' : 'bg-white text-zinc-400 border-zinc-200'}`}
                                                >
                                                    STRAP: {ex.config?.strap ? 'ON' : 'OFF'}
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Benefit Text - Shows immediately */}
                                        {(ex.config.angle || ex.config.vector || ex.config.elbowPosition) && (
                                            <div className="mt-3 text-xs text-zinc-600 bg-white p-2 rounded border border-zinc-100 flex gap-2 items-start">
                                                <Info size={14} className="text-red-500 shrink-0 mt-0.5" />
                                                <div>
                                                    {ex.config.angle && ANGLE_BENEFITS[ex.config.angle] && (
                                                        <p className="mb-1"><strong>{ex.config.angle}°:</strong> {ANGLE_BENEFITS[ex.config.angle]}</p>
                                                    )}
                                                    {isCable && ex.config.vector && VECTOR_BENEFITS[ex.config.vector] && (
                                                        <p><strong>{ex.config.vector}:</strong> {VECTOR_BENEFITS[ex.config.vector]}</p>
                                                    )}
                                                    {!isCable && ex.config.elbowPosition && ELBOW_BENEFITS[ex.config.elbowPosition] && (
                                                        <p><strong>{ex.config.elbowPosition}:</strong> {ELBOW_BENEFITS[ex.config.elbowPosition]}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            {ex.sets.map((set, setIdx) => (
                                <div key={set.id} className="grid grid-cols-10 gap-2 items-center">
                                    <div className="col-span-1 text-xs text-gray-400 font-bold text-center">{setIdx + 1}</div>
                                    <div className="col-span-3">
                                        <button 
                                            onClick={() => {
                                                if (set.hand !== 'BOTH') {
                                                    updateSet(exIdx, setIdx, 'hand', set.hand === 'RIGHT' ? 'LEFT' : 'RIGHT');
                                                }
                                            }}
                                            disabled={set.hand === 'BOTH'}
                                            className={`w-full py-1.5 text-[10px] font-bold rounded transition-colors ${
                                                set.hand === 'RIGHT' ? 'bg-red-50 text-red-600' : 
                                                set.hand === 'LEFT' ? 'bg-blue-50 text-blue-600' : 
                                                'bg-zinc-100 text-zinc-500 cursor-default'
                                            }`}
                                        >
                                            {set.hand === 'BOTH' ? 'SET' : set.hand}
                                        </button>
                                    </div>
                                    <div className="col-span-2">
                                        <input type="number" placeholder="kg" value={set.weight || ''} onChange={(e) => updateSet(exIdx, setIdx, 'weight', parseFloat(e.target.value))} className="w-full bg-gray-50 rounded p-1 text-center text-sm font-bold text-gray-900"/>
                                    </div>
                                    <div className="col-span-2">
                                        <input type="number" placeholder="reps" value={set.reps || ''} onChange={(e) => updateSet(exIdx, setIdx, 'reps', parseFloat(e.target.value))} className="w-full bg-gray-50 rounded p-1 text-center text-sm font-bold text-gray-900"/>
                                    </div>
                                    <div className="col-span-2 flex justify-end gap-2">
                                         <button onClick={() => updateSet(exIdx, setIdx, 'completed', !set.completed)} className={set.completed ? 'text-green-500' : 'text-gray-300'}>
                                             {set.completed ? <CheckCircle2 size={20}/> : <Circle size={20}/>}
                                         </button>
                                         <button onClick={() => removeSet(exIdx, setIdx)} className="text-gray-300"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => addSet(exIdx)} className="w-full mt-3 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">+ Add Set</button>
                    </div>
                );
            })}
         </div>

         {/* Save Button */}
         {activeExercises.length > 0 && (
             <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-50">
                 <button onClick={handleSave} className="w-full bg-red-600 text-white font-bold py-4 rounded-full shadow-lg hover:bg-red-700 transition-colors">Save</button>
             </div>
         )}
      </div>
      
       {/* EXERCISE SELECTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg max-h-[85vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Select Exercise</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-4 bg-gray-50">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" placeholder="Search..." 
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:border-red-500"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredExercises.map(ex => (
                    <button
                        key={ex.id}
                        onClick={() => setSelectedExerciseId(ex.id)}
                        className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${selectedExerciseId === ex.id ? 'bg-red-50 border border-red-200' : 'hover:bg-gray-50'}`}
                    >
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative">
                             {ex.imageUrl ? (
                                <img src={ex.imageUrl} alt={ex.name} className="w-full h-full object-cover" />
                             ) : (
                                <span className="text-xs font-bold text-gray-400">{ex.name.substring(0,2)}</span>
                             )}
                        </div>
                        <div className="flex-1">
                            <div className={`font-bold text-sm ${selectedExerciseId === ex.id ? 'text-red-700' : 'text-gray-900'}`}>{ex.name}</div>
                            <div className="text-xs text-gray-400">{ex.bodyPart} • {ex.mechanic || 'Standard'}</div>
                        </div>
                        {selectedExerciseId === ex.id && <CheckCircle2 className="text-red-600" size={20} />}
                    </button>
                ))}
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-white">
                <button 
                    onClick={addExercise}
                    disabled={!selectedExerciseId}
                    className="w-full bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-red-600/20 disabled:shadow-none"
                >
                    Add Selected Exercise
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutLogger;