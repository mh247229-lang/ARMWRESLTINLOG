
import React, { useState, useEffect, useMemo } from 'react';
import { ViewState, WorkoutSession, UserProfile, Exercise, Language } from './types';
import Custom from './components/Custom';
import Exercises from './components/Exercises';
import Dashboard from './components/Dashboard'; // Now acts as "Secret" Tab
import Me from './components/Me';
import WorkoutLogger from './components/WorkoutLogger';
import Onboarding from './components/Onboarding';
import AICoach from './components/AICoach';
import Home from './components/Home';
import { Dumbbell, PenTool, Layout, Lock, User } from 'lucide-react';
import { DEFAULT_EXERCISES, TRANSLATIONS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [returnView, setReturnView] = useState<ViewState>('HOME');
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutSession | null>(null);
  
  // Exercise Management
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
  const [exerciseEdits, setExerciseEdits] = useState<Record<string, Partial<Exercise>>>({});

  // Translation Helper
  const currentLang: Language = userProfile?.language || 'en';
  const t = (key: string) => {
      // @ts-ignore
      return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS['en'][key] || key;
  };

  useEffect(() => {
    const savedWorkouts = localStorage.getItem('armlog_data');
    const savedProfile = localStorage.getItem('armlog_profile');
    const savedCustomEx = localStorage.getItem('armlog_custom_exercises');
    const savedEdits = localStorage.getItem('armlog_exercise_edits');

    if (savedWorkouts) try { setWorkouts(JSON.parse(savedWorkouts)); } catch (e) {}
    if (savedCustomEx) try { setCustomExercises(JSON.parse(savedCustomEx)); } catch (e) {}
    if (savedEdits) try { setExerciseEdits(JSON.parse(savedEdits)); } catch (e) {}
    
    if (savedProfile) {
        try { 
            const parsed = JSON.parse(savedProfile);
            // Ensure migration for old profiles
            if (!parsed.prs) parsed.prs = {};
            if (!parsed.defenseStats) parsed.defenseStats = undefined;
            if (!parsed.activeProgram) parsed.activeProgram = undefined;
            if (!parsed.language) parsed.language = 'en';
            
            // Migration for measurements
            if (parsed.bicep && !parsed.bicepRight) {
                parsed.bicepRight = parsed.bicep;
                parsed.bicepLeft = parsed.bicep;
            }
            if (parsed.forearm && !parsed.forearmRight) {
                parsed.forearmRight = parsed.forearm;
                parsed.forearmLeft = parsed.forearm;
            }
            
            if (!parsed.equipment) parsed.equipment = [];
            if (!parsed.targetWeight) parsed.targetWeight = '';
            if (!parsed.gender) parsed.gender = 'Male';
            if (!parsed.focusArea) parsed.focusArea = 'Full Body';
            if (!parsed.settings) parsed.settings = { soundEffects: true, restTimer: 0, firstWeekday: 'Sunday' };
            setUserProfile(parsed); 
        } catch (e) {}
    }
  }, []);

  useEffect(() => { localStorage.setItem('armlog_data', JSON.stringify(workouts)); }, [workouts]);
  useEffect(() => { localStorage.setItem('armlog_profile', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('armlog_custom_exercises', JSON.stringify(customExercises)); }, [customExercises]);
  useEffect(() => { localStorage.setItem('armlog_exercise_edits', JSON.stringify(exerciseEdits)); }, [exerciseEdits]);

  // Computed Master List of Exercises
  const allExercises = useMemo(() => {
      const processedDefaults = DEFAULT_EXERCISES.map(def => {
          if (exerciseEdits[def.id]) {
              return { ...def, ...exerciseEdits[def.id] };
          }
          return def;
      });
      return [...customExercises, ...processedDefaults];
  }, [customExercises, exerciseEdits]);

  const handleSaveWorkout = (workout: WorkoutSession) => {
    if (editingWorkout) {
      // Check if we are updating an existing one in the array (edit mode)
      const exists = workouts.find(w => w.id === workout.id);
      if (exists) {
         setWorkouts(workouts.map(w => w.id === workout.id ? workout : w));
      } else {
         // This was a "Start Plan" session (new ID)
         setWorkouts([workout, ...workouts]);
      }
      setEditingWorkout(null);
    } else {
      // Create new workout
      setWorkouts([workout, ...workouts]);
    }
    setView(returnView);
  };

  const handleEditWorkout = (workout: WorkoutSession) => {
    setEditingWorkout(workout);
    setReturnView(view); 
    setView('LOG_WORKOUT');
  };

  const handleStartPlan = (session: WorkoutSession) => {
      setEditingWorkout(session); // Pre-fill the logger with the plan session
      setReturnView('HOME');
      setView('LOG_WORKOUT');
  };

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setView('HOME');
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
      setUserProfile(updatedProfile);
  };

  const handleAddCustomExercise = (exercise: Exercise) => {
      setCustomExercises([...customExercises, exercise]);
  };

  const handleEditExercise = (updatedExercise: Exercise) => {
      // Check if it's a custom exercise or a default one
      const isCustom = updatedExercise.id.startsWith('custom_');
      
      if (isCustom) {
          setCustomExercises(prev => prev.map(ex => ex.id === updatedExercise.id ? updatedExercise : ex));
      } else {
          // It's a default exercise, store the override
          setExerciseEdits(prev => ({
              ...prev,
              [updatedExercise.id]: updatedExercise
          }));
      }
  };

  const handleResetData = () => {
    localStorage.clear(); // Clears EVERYTHING including cached image keys if stored
    setWorkouts([]);
    setCustomExercises([]);
    setExerciseEdits({});
    setUserProfile(null); 
    setEditingWorkout(null);
    setView('HOME');
    // Force reload to ensure clean state if needed, though React state reset handles most
    window.location.reload();
  };

  if (!userProfile?.isSetup) return <Onboarding onComplete={handleProfileComplete} t={t} />;

  if (view === 'LOG_WORKOUT') return <WorkoutLogger initialWorkout={editingWorkout} exercises={allExercises} onSave={handleSaveWorkout} onCancel={() => { setEditingWorkout(null); setView(returnView); }} t={t} />;

  return (
    <div className={`min-h-screen bg-white flex flex-col md:flex-row max-w-lg mx-auto shadow-2xl relative font-sans ${currentLang === 'ar' ? 'dir-rtl' : ''}`}>
      <main className="flex-1 w-full pb-20 overflow-y-auto h-screen scrollbar-hide">
        {view === 'HOME' && <Home userProfile={userProfile} workouts={workouts} exercises={allExercises} onChangeView={(v) => { if(v === 'LOG_WORKOUT') setReturnView('HOME'); setView(v); }} onStartPlan={handleStartPlan} onUpdateProfile={handleUpdateProfile} t={t} />}
        {view === 'CUSTOM' && <Custom workouts={workouts} onStartLog={() => { setReturnView('CUSTOM'); setView('LOG_WORKOUT'); }} onEditLog={handleEditWorkout} t={t} />}
        {view === 'EXERCISES' && <Exercises exercises={allExercises} onAddExercise={handleAddCustomExercise} onEditExercise={handleEditExercise} t={t} />}
        {view === 'REPORT' && <Dashboard workouts={workouts} userProfile={userProfile} onEditLog={handleEditWorkout} exercises={allExercises} t={t} />}
        {view === 'ME' && <Me userProfile={userProfile} onNavigate={setView} onUpdateProfile={handleUpdateProfile} onResetData={handleResetData} t={t} />}
        {view === 'AI_COACH' && <AICoach workouts={workouts} exercises={allExercises} t={t} />}
        {view === 'PLACEMENT_TEST' && <Home userProfile={userProfile} workouts={workouts} exercises={allExercises} onChangeView={setView} onStartPlan={handleStartPlan} onUpdateProfile={handleUpdateProfile} initialTestOpen={true} t={t} />} 
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around p-3 pb-safe z-40 max-w-lg mx-auto">
         <NavBtn active={view === 'HOME'} onClick={() => setView('HOME')} icon={<Dumbbell size={24} />} label={t('nav.training')} />
         <NavBtn active={view === 'CUSTOM'} onClick={() => setView('CUSTOM')} icon={<PenTool size={24} />} label={t('nav.custom')} />
         <NavBtn active={view === 'EXERCISES'} onClick={() => setView('EXERCISES')} icon={<Layout size={24} />} label={t('nav.exercises')} />
         <NavBtn active={view === 'REPORT'} onClick={() => setView('REPORT')} icon={<Lock size={24} />} label={t('nav.secret')} />
         <NavBtn active={view === 'ME'} onClick={() => setView('ME')} icon={<User size={24} />} label={t('nav.me')} />
      </nav>
    </div>
  );
};

const NavBtn: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-red-600' : 'text-gray-400'}`}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;
