import React from 'react';
import { Plus, Calendar, ChevronRight } from 'lucide-react';
import { WorkoutSession } from '../types';

interface CustomProps {
  workouts: WorkoutSession[];
  onStartLog: () => void; 
  onEditLog: (workout: WorkoutSession) => void;
  t?: (key: string) => string;
}

const Custom: React.FC<CustomProps> = ({ workouts, onStartLog, onEditLog, t }) => {
  return (
    <div className="pb-24 px-4 pt-6 bg-gray-50 min-h-screen flex flex-col">
      <h1 className="text-2xl font-black text-red-600 mb-6 uppercase tracking-tight">CUSTOM</h1>

      <div className="flex flex-col items-center justify-center space-y-6 mb-8">
         <div className="p-8 bg-white rounded-3xl shadow-sm border border-red-100 text-center max-w-sm w-full">
             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                 <Plus size={32} strokeWidth={3} />
             </div>
             <h3 className="text-xl font-bold text-zinc-900 mb-2">Create New Workout</h3>
             <p className="text-zinc-500 text-sm mb-6">
                 Build a fully custom session with specific angles, cable vectors, and exercises.
             </p>
             <button 
                onClick={onStartLog} 
                className="w-full bg-red-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
             >
                <Plus size={20} /> START NEW
             </button>
         </div>
      </div>

      {/* Recent Logs Section */}
      <div className="w-full max-w-sm mx-auto">
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3 ml-1">Recent Logs</h2>
        
        {workouts.length === 0 ? (
          <div className="text-center py-8 text-zinc-400 bg-white rounded-2xl border border-zinc-100 border-dashed">
            No custom logs yet.
          </div>
        ) : (
          <div className="space-y-3 animate-in slide-in-from-bottom-2">
            {workouts.slice(0, 5).map((workout) => (
              <div 
                key={workout.id} 
                onClick={() => onEditLog(workout)}
                className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-red-200 transition-all"
              >
                <div>
                   <h3 className="font-bold text-zinc-900">{workout.name}</h3>
                   <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                      <Calendar size={12} />
                      {new Date(workout.date).toLocaleDateString()} • {workout.exercises.length} Exercises
                   </div>
                </div>
                <div className="w-8 h-8 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300 group-hover:text-red-500">
                  <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Custom;