
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ChevronRight, Ruler, Weight, Activity, CheckCircle2, User, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  t: (key: string) => string;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, t }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    gender: 'Male',
    age: '',
    weight: '',
    targetWeight: '',
    weightUnit: 'kg',
    height: '',
    heightUnit: 'cm',
    bicepRight: '',
    bicepLeft: '',
    forearmRight: '',
    forearmLeft: '',
    wrist: '',
    language: 'en',
    goal: 'Get Stronger',
    focusArea: 'Full Body',
    equipment: [],
    prs: {
      pronation: '',
      supination: '',
      sidePressure: '',
      backPressure: '',
      rising: '',
      cupping: '',
      gripCurl: '',
      sideHammer: '',
      benchPress: '',
      squat: '',
      deadlift: '',
      latPulldown: ''
    },
    settings: {
      soundEffects: true,
      restTimer: 0,
      firstWeekday: 'Sunday'
    },
    isSetup: false
  });

  const totalSteps = 7;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete({ ...profile, isSetup: true });
    }
  };

  const handleChange = (field: keyof UserProfile, value: any) => {
    setProfile({ ...profile, [field]: value });
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return profile.name.length > 0;
      case 2: return profile.age.length > 0 && profile.weight.length > 0;
      case 3: return profile.height.length > 0;
      case 4: return profile.bicepRight.length > 0 && profile.bicepLeft.length > 0;
      case 5: return profile.forearmRight.length > 0 && profile.forearmLeft.length > 0;
      case 6: return profile.wrist.length > 0;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        
        {/* Progress Indicator (Hidden on last step) */}
        {step < 7 && (
          <div className="mb-8">
            <div className="flex justify-between text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">
              <span>Profile Setup</span>
              <span>{step} of {totalSteps}</span>
            </div>
            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* STEP 1: NAME & GENDER */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <h1 className="text-3xl font-bold text-white mb-2">{t('onboarding.welcome')}</h1>
            <p className="text-zinc-400 mb-8">Who are we training today?</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                    placeholder="John Doe"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Gender</label>
                <div className="grid grid-cols-2 gap-3">
                    {['Male', 'Female'].map(g => (
                        <button
                            key={g}
                            onClick={() => handleChange('gender', g)}
                            className={`py-4 rounded-xl font-bold text-sm transition-all ${profile.gender === g ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:bg-zinc-800'}`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: AGE & WEIGHT */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <h1 className="text-3xl font-bold text-white mb-2">{t('onboarding.stats')}</h1>
            <p className="text-zinc-400 mb-8">Tell us a bit about your build.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Age</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white text-center text-2xl font-mono focus:border-red-500 outline-none"
                  placeholder="25"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-zinc-300">Weight</label>
                    <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                        <button 
                            onClick={() => handleChange('weightUnit', 'kg')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${profile.weightUnit === 'kg' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}
                        >
                            KG
                        </button>
                        <button 
                            onClick={() => handleChange('weightUnit', 'lbs')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${profile.weightUnit === 'lbs' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}
                        >
                            LBS
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <Weight className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <input
                    type="number"
                    value={profile.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white text-lg focus:border-red-500 outline-none"
                    placeholder="80"
                    />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: HEIGHT */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <h1 className="text-3xl font-bold text-white mb-2">{t('onboarding.height')}</h1>
            <p className="text-zinc-400 mb-8">How tall do you stand?</p>

            <div className="space-y-6">
                 <div className="flex justify-center mb-4">
                    <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                        <button 
                            onClick={() => handleChange('heightUnit', 'cm')}
                            className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${profile.heightUnit === 'cm' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}
                        >
                            CM
                        </button>
                        <button 
                            onClick={() => handleChange('heightUnit', 'ft')}
                            className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${profile.heightUnit === 'ft' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}
                        >
                            FT
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={24} />
                    <input
                    type="number"
                    value={profile.height}
                    onChange={(e) => handleChange('height', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-6 pl-14 pr-4 text-white text-3xl font-mono text-center focus:border-red-500 outline-none"
                    placeholder={profile.heightUnit === 'cm' ? '180' : '5.9'}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">
                        {profile.heightUnit}
                    </span>
                </div>
            </div>
          </div>
        )}

        {/* STEP 4: BICEP */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <h1 className="text-3xl font-bold text-white mb-2">Bicep Size</h1>
            <p className="text-zinc-400 mb-8">Measure flexed arm.</p>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-6 flex justify-center">
                 <div className="w-32 h-32 bg-zinc-800 rounded-full flex items-center justify-center border-4 border-zinc-700 relative">
                    <Activity size={64} className="text-red-500" />
                 </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-zinc-400 mb-1">{t('onboarding.bicep_r')}</label>
                    <div className="relative">
                        <input
                        type="number"
                        value={profile.bicepRight}
                        onChange={(e) => handleChange('bicepRight', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-4 text-white text-center text-2xl font-mono focus:border-red-500 outline-none"
                        placeholder="35"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">
                            {profile.heightUnit === 'cm' ? 'cm' : 'in'}
                        </span>
                    </div>
                </div>
                <div>
                    <label className="block text-sm text-zinc-400 mb-1">{t('onboarding.bicep_l')}</label>
                    <div className="relative">
                        <input
                        type="number"
                        value={profile.bicepLeft}
                        onChange={(e) => handleChange('bicepLeft', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-4 text-white text-center text-2xl font-mono focus:border-red-500 outline-none"
                        placeholder="35"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">
                            {profile.heightUnit === 'cm' ? 'cm' : 'in'}
                        </span>
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* STEP 5: FOREARM */}
        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <h1 className="text-3xl font-bold text-white mb-2">Forearm Size</h1>
            <p className="text-zinc-400 mb-8">Measure thickest part.</p>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-6 flex justify-center">
                 <div className="w-32 h-32 bg-zinc-800 rounded-full flex items-center justify-center border-4 border-zinc-700">
                    <Activity size={64} className="text-blue-500 rotate-90" />
                 </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-zinc-400 mb-1">{t('onboarding.forearm_r')}</label>
                    <div className="relative">
                        <input
                        type="number"
                        value={profile.forearmRight}
                        onChange={(e) => handleChange('forearmRight', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-4 text-white text-center text-2xl font-mono focus:border-red-500 outline-none"
                        placeholder="30"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">
                            {profile.heightUnit === 'cm' ? 'cm' : 'in'}
                        </span>
                    </div>
                </div>
                <div>
                    <label className="block text-sm text-zinc-400 mb-1">{t('onboarding.forearm_l')}</label>
                    <div className="relative">
                        <input
                        type="number"
                        value={profile.forearmLeft}
                        onChange={(e) => handleChange('forearmLeft', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-4 text-white text-center text-2xl font-mono focus:border-red-500 outline-none"
                        placeholder="30"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">
                            {profile.heightUnit === 'cm' ? 'cm' : 'in'}
                        </span>
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* STEP 6: WRIST */}
        {step === 6 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <h1 className="text-3xl font-bold text-white mb-2">{t('onboarding.wrist')}</h1>
            <p className="text-zinc-400 mb-8">Measure just below the wrist bone.</p>
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-6 flex justify-center">
                 <div className="w-32 h-32 bg-zinc-800 rounded-full flex items-center justify-center border-4 border-zinc-700">
                    <div className="w-16 h-16 rounded-full border-4 border-dashed border-zinc-500 flex items-center justify-center">
                        <span className="text-xs text-zinc-500">Bone</span>
                    </div>
                 </div>
            </div>

            <div className="relative">
                <input
                type="number"
                value={profile.wrist}
                onChange={(e) => handleChange('wrist', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-4 text-white text-center text-2xl font-mono focus:border-red-500 outline-none"
                placeholder="18"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">
                    {profile.heightUnit === 'cm' ? 'cm' : 'in'}
                </span>
            </div>
          </div>
        )}

        {/* STEP 7: COMPLETION */}
        {step === 7 && (
          <div className="text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                <CheckCircle2 size={48} />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">{t('onboarding.complete')}</h1>
            <p className="text-zinc-400 mb-8">You are all set to start your journey to table dominance.</p>

            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 mb-8 text-left">
                <div className="flex justify-between border-b border-zinc-800 pb-2 mb-2">
                    <span className="text-zinc-500">Name</span>
                    <span className="text-white font-bold">{profile.name}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-2 mb-2">
                    <span className="text-zinc-500">Gender</span>
                    <span className="text-white font-bold">{profile.gender}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-zinc-500">Stats</span>
                    <span className="text-white font-mono text-xs">
                        {profile.height}{profile.heightUnit} • {profile.weight}{profile.weightUnit}
                    </span>
                </div>
            </div>
            
            <button 
                onClick={handleNext}
                className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-white/10"
            >
                {t('btn.start')} <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* NEXT BUTTON (For steps 1-6) */}
        {step < 7 && (
          <div className="mt-8 flex justify-end">
            <button 
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-red-900/20 flex items-center gap-2 transition-all"
            >
              {t('btn.next')} <ChevronRight size={20} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Onboarding;
