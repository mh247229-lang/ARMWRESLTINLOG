import React from 'react';
import { Lock, ShieldCheck, Brain, Zap, Activity, Utensils, Droplet } from 'lucide-react';

const Secrets: React.FC = () => {
  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-black text-red-600 italic tracking-tighter">SECRETS</h2>
        <p className="text-zinc-400">The blueprint for table dominance.</p>
      </header>

      <div className="space-y-4">
        
        <SecretCard 
          icon="⚙️" 
          title="Technique – The Real Power"
          content={
            <ul className="list-disc pl-4 space-y-2 text-zinc-300 text-sm">
              <li>The key is <strong>hand and wrist control</strong>. If you lose your hand, you lose the match.</li>
              <li>Use <strong>Top Roll</strong> against stronger forearms, <strong>Hook</strong> when inside strength is dominant, and <strong>Press</strong> when you have a body advantage.</li>
              <li>Always pull, never push — beginners lose because they push forward.</li>
              <li>Practice being in losing positions so you can learn how to escape and recover.</li>
            </ul>
          }
        />

        <SecretCard 
          icon="🦾" 
          title="Strength & Body Control"
          content={
            <div className="space-y-3 text-zinc-300 text-sm">
              <p><strong>Hierarchy:</strong> Hand & Fingers → Wrist → Forearm → Shoulder & Lats → Biceps → Back.</p>
              <p>Real strength starts from the fingers, not the arm.</p>
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                <span className="text-red-400 font-bold block mb-1">Compactness Rules:</span>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Hand one fist away from shoulder.</li>
                  <li>Shoulder close to your hand, not behind it.</li>
                  <li>Shoulders level with the table, no leaning back too far.</li>
                </ul>
              </div>
            </div>
          }
        />

        <SecretCard 
          icon="🧩" 
          title="Mindset – Win with Focus"
          content={
            <ul className="list-disc pl-4 space-y-2 text-zinc-300 text-sm">
              <li>Never look at your opponent’s face — <strong>always watch your hand.</strong></li>
              <li>Don’t fear losing, use every loss to learn.</li>
              <li>Focus on the ref’s words “Ready… Go!” to time your hit perfectly.</li>
              <li>Consistency is the real secret — train smart, not random.</li>
            </ul>
          }
        />

        <SecretCard 
          icon="🩻" 
          title="Safety & Recovery"
          content={
            <div className="space-y-2 text-zinc-300 text-sm">
              <p>Don’t overtrain your tendons and joints. They grow slower than muscles.</p>
              <p><strong>Supplements:</strong> Cissus Rx (tendons), Fish Oil (joints), Vitamin D.</p>
              <p className="text-red-400">If something hurts, stop and rest — don’t push through sharp pain.</p>
              <p>Strengthen weak angles (like 90° or losing side) to reduce injury risk.</p>
            </div>
          }
        />

        <SecretCard 
          icon="🔗" 
          title="Grip & Strap Control"
          content={
            <ul className="list-disc pl-4 space-y-2 text-zinc-300 text-sm">
              <li>Practice with straps so you don’t panic in tournaments.</li>
              <li>When strapped, pull your elbow slightly back and keep your wrist high.</li>
              <li><strong>Suicide drills:</strong> switch from Top Roll to Hook for 60 seconds non-stop.</li>
            </ul>
          }
        />

        <SecretCard 
          icon="🔥" 
          title="Power-Pulling Secret"
          content={
            <div className="text-zinc-300 text-sm">
              <p className="mb-2">Train <strong>wrist vs wrist</strong> with a partner — no hand grip.</p>
              <p>This builds arm strength without joint stress and improves stopping power (the ability to hold your opponent mid-match).</p>
            </div>
          }
        />

        <SecretCard 
          icon="🧃" 
          title="Weight Cut & Preparation"
          content={
            <ul className="list-disc pl-4 space-y-2 text-zinc-300 text-sm">
              <li>Reduce calories slowly (6–8 weeks out).</li>
              <li>Lower carbs/sodium, increase water (5L) early, then reduce before weigh-ins.</li>
              <li>On final day, drink less (1L max).</li>
              <li>Rehydrate with Pedialyte or Coconut Water immediately after weigh-in.</li>
            </ul>
          }
        />

        <SecretCard 
          icon="🥗" 
          title="Simple Nutrition Plan"
          content={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-zinc-300">
              <div>
                <strong className="text-zinc-100 block mb-1">Daily Routine:</strong>
                <ul className="space-y-1 text-xs text-zinc-400">
                  <li>6am – Coconut oil + Protein</li>
                  <li>7am – Coffee + Oats</li>
                  <li>12pm – Salad (Chicken/Fish)</li>
                  <li>5pm – Dinner (Meat + Side)</li>
                </ul>
              </div>
              <div>
                <strong className="text-zinc-100 block mb-1">Quick Meals:</strong>
                <ul className="space-y-1 text-xs text-zinc-400">
                  <li><strong>Protein Balls:</strong> almond flour, pb, cocoa, honey.</li>
                  <li><strong>Oats Mix:</strong> cocoa, almond milk, fruits, hemp.</li>
                  <li><strong>Yogurt Mix:</strong> chia, pumpkin seeds, hemp.</li>
                </ul>
              </div>
            </div>
          }
        />

        <SecretCard 
          icon="🧘‍♂️" 
          title="Golden Tips"
          content={
            <div className="text-zinc-300 text-sm space-y-2">
              <p>Use the full pad — move your elbow, don’t stay locked.</p>
              <p>Train your weakest angle more than your strongest.</p>
              <div className="mt-3 p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-center italic text-red-200">
                “Armwrestling is 80% pulling and 20% mindset.”
              </div>
            </div>
          }
        />

      </div>
    </div>
  );
};

const SecretCard: React.FC<{ icon: string; title: string; content: React.ReactNode }> = ({ icon, title, content }) => (
  <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 shadow-lg hover:border-zinc-700 transition-all">
    <div className="flex items-center gap-3 mb-4 border-b border-zinc-800 pb-3">
      <span className="text-2xl">{icon}</span>
      <h3 className="text-lg font-bold text-white">{title}</h3>
    </div>
    <div>{content}</div>
  </div>
);

export default Secrets;