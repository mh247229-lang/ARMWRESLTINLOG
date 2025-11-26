import React from 'react';
import { Lock } from 'lucide-react';

const Plan: React.FC<{ onStartLog: () => void }> = ({ onStartLog }) => {
  return (
    <div className="pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Card */}
      <div className="relative h-64 mx-4 mt-4 rounded-3xl overflow-hidden shadow-lg group">
         <img 
           src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop" 
           alt="Muscle Building" 
           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
             <h2 className="text-3xl font-black text-white uppercase italic">Muscle Building</h2>
             <p className="text-zinc-300 font-medium">30 Days • Arm Wrestling Focus</p>
         </div>
      </div>

      <div className="px-4 mt-6 space-y-4">
        {/* Day 1 - Active */}
        <div className="bg-red-600 rounded-2xl p-6 text-white shadow-lg shadow-red-600/20 flex items-center justify-between">
            <div>
                <h3 className="text-2xl font-bold">Day 1</h3>
                <p className="text-red-100">Chest & Side Pressure</p>
            </div>
            <button 
              onClick={onStartLog}
              className="bg-white text-red-600 px-6 py-2.5 rounded-full font-bold shadow-sm hover:bg-red-50 transition-colors"
            >
                Start
            </button>
        </div>

        {/* Day 2 - Locked */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 flex items-center justify-between">
            <div>
                <h3 className="text-2xl font-bold text-zinc-900">Day 2</h3>
                <p className="text-zinc-500">Back & Pronation</p>
            </div>
            <Lock className="text-zinc-300" size={24} />
        </div>

        {/* Day 3 - Locked */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 flex items-center justify-between">
            <div>
                <h3 className="text-2xl font-bold text-zinc-900">Day 3</h3>
                <p className="text-zinc-500">Lower Body & Core</p>
            </div>
            <Lock className="text-zinc-300" size={24} />
        </div>
        
        {/* Rest Day */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 flex items-center justify-between">
            <div>
                <h3 className="text-2xl font-bold text-zinc-900">Rest Day</h3>
                <p className="text-zinc-500">Active Recovery</p>
            </div>
            <Lock className="text-zinc-300" size={24} />
        </div>

        {/* Day 5 - Locked */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 flex items-center justify-between">
            <div>
                <h3 className="text-2xl font-bold text-zinc-900">Day 5</h3>
                <p className="text-zinc-500">Shoulders & Rising</p>
            </div>
            <Lock className="text-zinc-300" size={24} />
        </div>
      </div>
    </div>
  );
};

export default Plan;