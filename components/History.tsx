
import React from 'react';
import { WorkoutSession, Exercise } from '../types';
import { Calendar, Dumbbell, Pencil } from 'lucide-react';
import { DEFAULT_EXERCISES } from '../constants';

interface HistoryProps {
  workouts: WorkoutSession[];
  onEditLog: (workout: WorkoutSession) => void;
  exercises?: Exercise[];
}

const History: React.FC<HistoryProps> = ({ workouts, onEditLog, exercises = [] }) => {
  const allExercises = exercises.length > 0 ? exercises : DEFAULT_EXERCISES;
  const getExerciseName = (id: string) => allExercises.find(e => e.id === id)?.name || 'Unknown';

  // Sort by date descending
  const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 pb-20">
       <header>
        <h2 className="text-3xl font-bold text-white">History</h2>
        <p className="text-zinc-400">Your path to table dominance.</p>
      </header>

      <div className="space-y-4">
        {sortedWorkouts.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900 rounded-2xl border border-zinc-800">
            <Dumbbell className="mx-auto text-zinc-700 mb-4" size={48} />
            <p className="text-zinc-500">No workouts logged yet.</p>
          </div>
        ) : (
          sortedWorkouts.map((workout) => (
            <div key={workout.id} className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 hover:border-zinc-700 transition-colors group relative">
              <div className="flex justify-between items-start mb-4 border-b border-zinc-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{workout.name}</h3>
                  <div className="flex items-center gap-2 text-zinc-500 text-sm mt-1">
                    <Calendar size={14} />
                    {new Date(workout.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => onEditLog(workout)}
                        className="p-2 bg-zinc-800 text-zinc-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                        title="Edit Workout"
                    >
                        <Pencil size={14} />
                    </button>
                    <div className="text-xs font-mono bg-zinc-800 text-zinc-400 px-2 py-1 rounded">
                        {workout.exercises.length} Ex
                    </div>
                </div>
              </div>

              <div className="space-y-3 opacity-80 group-hover:opacity-100 transition-opacity">
                {workout.exercises.map((ex) => {
                  const maxWeight = Math.max(...ex.sets.map(s => s.weight));
                  const totalReps = ex.sets.reduce((acc, s) => acc + s.reps, 0);
                  
                  // determine hand summary
                  const uniqueHands = Array.from(new Set(ex.sets.map(s => s.hand)));
                  const handLabel = uniqueHands.length > 1 ? 'MIXED' : uniqueHands[0] || 'RIGHT';

                  // Format config string
                  const configParts = [];
                  if (ex.config?.vector) configParts.push(ex.config.vector);
                  if (ex.config?.elbowPosition) configParts.push(ex.config.elbowPosition);
                  if (ex.config?.angle) configParts.push(`${ex.config.angle}°`);
                  if (ex.config?.handleThickness) configParts.push(`${ex.config.handleThickness}cm`);
                  if (ex.config?.strap) configParts.push('Strap');

                  return (
                    <div key={ex.id} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2">
                      <div className="flex flex-col">
                         <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${handLabel === 'LEFT' ? 'bg-blue-500' : handLabel === 'RIGHT' ? 'bg-red-500' : handLabel === 'MIXED' ? 'bg-purple-500' : 'bg-green-500'}`}></span>
                            <span className="text-zinc-300 font-medium">{getExerciseName(ex.exerciseId)}</span>
                            <span className="text-[10px] text-zinc-500 uppercase">({handLabel})</span>
                         </div>
                         {configParts.length > 0 && (
                             <div className="text-xs text-red-400/80 ml-3.5 mt-0.5">
                                 {configParts.join(' • ')}
                             </div>
                         )}
                      </div>
                      <div className="text-zinc-500 font-mono text-xs ml-3.5 sm:ml-0">
                        {ex.sets.length} sets • Best: <span className="text-white">{maxWeight}kg</span> • Vol: {totalReps}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
