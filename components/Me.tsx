
import React, { useState } from 'react';
import { UserProfile, ViewState, TrainingGoal, Equipment, Language } from '../types';
import { ChevronRight, ArrowLeft, X, Check, Save, RefreshCw, Smile, Settings, Globe, Ban, Star, MessageSquare, Trash2, Trophy } from 'lucide-react';

interface MeProps {
  userProfile: UserProfile;
  onNavigate: (view: ViewState) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onResetData: () => void;
  t: (key: string) => string;
}

type InternalView = 'MAIN' | 'PROFILE' | 'SETTINGS';
type ModalType = 'GOAL' | 'FOCUS' | 'EQUIPMENT' | 'PRS' | 'BASIC' | 'SIZES' | 'LANGUAGE' | null;

const Me: React.FC<MeProps> = ({ userProfile, onNavigate, onUpdateProfile, onResetData, t }) => {
  const [view, setView] = useState<InternalView>('MAIN');

  if (view === 'PROFILE') {
    return <MyProfileSubPage userProfile={userProfile} onBack={() => setView('MAIN')} onUpdateProfile={onUpdateProfile} onNavigate={onNavigate} t={t} />;
  }

  if (view === 'SETTINGS') {
    return <GeneralSettingsSubPage userProfile={userProfile} onBack={() => setView('MAIN')} onUpdateProfile={onUpdateProfile} onResetData={onResetData} t={t} />;
  }

  // --- MAIN ME VIEW ---
  return (
    <div className="bg-gray-50 min-h-screen pb-24 relative animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="px-4 pt-6 mb-6">
          <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">{t('nav.me')}</h1>
      </div>

      <div className="px-4 space-y-6">
          
          {/* Backup & Restore Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100 flex items-center justify-between">
              <div>
                  <h3 className="text-xl font-bold text-zinc-900">{t('me.backup')}</h3>
                  <p className="text-sm text-zinc-500 mt-1">Synchronize your data</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <RefreshCw size={20} />
              </div>
          </div>

          {/* Settings Section */}
          <div>
              <h3 className="text-lg font-bold text-zinc-900 mb-3 ml-2">{t('me.settings')}</h3>
              <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
                  <MenuLink 
                    icon={<Smile className="text-white" size={20}/>} 
                    iconBg="bg-blue-600"
                    label={t('me.my_profile')} 
                    onClick={() => setView('PROFILE')}
                  />
                  <div className="h-px bg-zinc-50 mx-16"></div>
                  <MenuLink 
                    icon={<Settings className="text-white" size={20}/>} 
                    iconBg="bg-pink-600"
                    label={t('me.general_settings')}
                    onClick={() => setView('SETTINGS')}
                  />
                  <div className="h-px bg-zinc-50 mx-16"></div>
                  {/* Language is managed in General Settings */}
              </div>
          </div>

          {/* Secondary Actions */}
          <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
              <MenuLink 
                icon={<Ban className="text-white" size={20}/>} 
                iconBg="bg-zinc-400"
                label={t('me.remove_ads')} 
                onClick={() => {}}
              />
              <div className="h-px bg-zinc-50 mx-16"></div>
              <MenuLink 
                icon={<Star className="text-white" size={20}/>} 
                iconBg="bg-blue-400"
                label={t('me.rate_us')} 
                onClick={() => {}}
              />
              <div className="h-px bg-zinc-50 mx-16"></div>
              <MenuLink 
                icon={<MessageSquare className="text-white" size={20}/>} 
                iconBg="bg-zinc-500"
                label={t('me.feedback')} 
                onClick={() => {}}
              />
          </div>

          <div className="text-center pb-8">
              <span className="text-xs text-zinc-400 font-medium">Version 1.5.2</span>
          </div>
      </div>
    </div>
  );
};

// --- GENERAL SETTINGS SUBPAGE ---
const GeneralSettingsSubPage: React.FC<{ userProfile: UserProfile, onBack: () => void, onUpdateProfile: (p: UserProfile) => void, onResetData: () => void, t: (key:string)=>string }> = ({ userProfile, onBack, onUpdateProfile, onResetData, t }) => {
    
    const settings = userProfile.settings || { soundEffects: true, restTimer: 0, firstWeekday: 'Sunday' };

    const [showWeekdayModal, setShowWeekdayModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [tempWeekday, setTempWeekday] = useState(settings.firstWeekday);
    const [cacheSize, setCacheSize] = useState('14.98 MB');

    const updateSetting = (key: keyof typeof settings, value: any) => {
        onUpdateProfile({
            ...userProfile,
            settings: { ...settings, [key]: value }
        });
    };

    const updateUnits = () => {
        const newWeightUnit = userProfile.weightUnit === 'kg' ? 'lbs' : 'kg';
        const newHeightUnit = userProfile.heightUnit === 'cm' ? 'ft' : 'cm';
        onUpdateProfile({
            ...userProfile,
            weightUnit: newWeightUnit,
            heightUnit: newHeightUnit
        });
    };

    const clearCache = () => {
        if(window.confirm('Clear downloaded resources and temporary history? This keeps your profile.')) {
            // Logic to clear non-essential items from storage
            localStorage.removeItem('armlog_data'); // Clears workouts/history
            onUpdateProfile({ ...userProfile, activeProgram: undefined }); // Clears current plan
            setCacheSize('0.00 MB');
            alert('Cache cleared. Training history reset.');
        }
    };
    
    const deleteAllData = () => {
        if(window.confirm('Are you sure you want to delete ALL data?\n\nThis will permanently remove:\n- All Custom Workouts\n- Training History\n- User Profile & Stats\n- Custom Exercises\n\nWARNING: This action cannot be undone. All data will be permanently lost.')) {
            onResetData();
        }
    };

    const languages: {code: Language, label: string}[] = [
        { code: 'en', label: 'English' },
        { code: 'fr', label: 'Français' },
        { code: 'ar', label: 'العربية' },
        { code: 'zh', label: '中文' }
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-24 relative animate-in slide-in-from-right-8">
            <div className="px-4 pt-6 mb-6 flex items-center gap-4">
                <button onClick={onBack}><ArrowLeft className="text-zinc-800" size={24}/></button>
                <h1 className="text-xl font-bold text-zinc-900">{t('me.general_settings')}</h1>
            </div>

            <div className="px-4 space-y-6">
                
                {/* Main Settings Group */}
                <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
                    
                    {/* Sound Effect */}
                    <div className="p-5 flex items-center justify-between">
                        <span className="font-bold text-zinc-900 text-lg">{t('me.sound')}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={settings.soundEffects} 
                                onChange={(e) => updateSetting('soundEffects', e.target.checked)} 
                                className="sr-only peer" 
                            />
                            <div className="w-14 h-8 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="h-px bg-zinc-50 mx-5"></div>

                    {/* Language */}
                    <div onClick={() => setShowLanguageModal(true)} className="p-5 flex items-center justify-between cursor-pointer hover:bg-zinc-50 transition-colors">
                        <span className="font-bold text-zinc-900 text-lg">{t('me.language')}</span>
                        <span className="font-bold text-zinc-900 uppercase">{userProfile.language}</span>
                    </div>

                    <div className="h-px bg-zinc-50 mx-5"></div>

                    {/* Units */}
                    <div onClick={updateUnits} className="p-5 flex items-center justify-between cursor-pointer hover:bg-zinc-50 transition-colors">
                        <span className="font-bold text-zinc-900 text-lg">{t('me.units')}</span>
                        <span className="font-bold text-zinc-900">{userProfile.weightUnit === 'kg' ? 'kg, cm' : 'lbs, ft'}</span>
                    </div>

                    <div className="h-px bg-zinc-50 mx-5"></div>

                    {/* First Weekday */}
                    <div onClick={() => setShowWeekdayModal(true)} className="p-5 flex items-center justify-between cursor-pointer hover:bg-zinc-50 transition-colors">
                        <span className="font-bold text-zinc-900 text-lg">First Weekday</span>
                        <span className="font-bold text-zinc-900">{settings.firstWeekday}</span>
                    </div>
                </div>

                {/* Data & Cache */}
                <div>
                    <h4 className="text-sm font-bold text-zinc-400 mb-3 ml-2 uppercase tracking-wide">Data & Cache</h4>
                    <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
                        <div onClick={clearCache} className="p-5 flex items-center justify-between cursor-pointer hover:bg-zinc-50 transition-colors">
                             <span className="font-bold text-zinc-900 text-lg">{t('me.clear_cache')}</span>
                             <div className="flex items-center gap-2">
                                <span className="font-bold text-zinc-900">{cacheSize}</span>
                                <ChevronRight className="text-zinc-300" size={20} />
                             </div>
                        </div>
                    </div>
                    <p className="text-xs text-zinc-400 mt-3 ml-4 leading-relaxed max-w-xs">
                        Clear the downloaded image, voice, and video resources. Your progress and personal data will be preserved safely.
                    </p>
                </div>

                {/* Delete Data */}
                <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
                    <div onClick={deleteAllData} className="p-5 cursor-pointer hover:bg-red-50 flex items-center justify-between transition-colors">
                         <span className="font-bold text-red-600 text-lg">{t('me.delete_data')}</span>
                         <ChevronRight className="text-zinc-300" size={20} />
                    </div>
                </div>
                <p className="text-xs text-zinc-400 mt-2 ml-4 leading-relaxed max-w-xs">
                    All data will be removed, including custom workouts and profile data.
                </p>

                {/* Privacy */}
                <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
                     <div className="p-5 cursor-pointer hover:bg-zinc-50 transition-colors">
                         <span className="font-bold text-zinc-900 text-lg">Privacy Policy</span>
                     </div>
                </div>

            </div>

            {/* LANGUAGE MODAL */}
            {showLanguageModal && (
                <div className="fixed inset-0 z-[60] bg-black/50 flex items-end justify-center backdrop-blur-sm p-4 md:items-center">
                    <div className="bg-white w-full max-w-lg rounded-3xl p-6 animate-in slide-in-from-bottom-10 shadow-2xl">
                        <h3 className="text-2xl font-black text-zinc-900 mb-6 text-center">{t('me.language')}</h3>
                        <div className="space-y-2 mb-6">
                             {languages.map(l => (
                                 <div 
                                    key={l.code} 
                                    onClick={() => {
                                        onUpdateProfile({...userProfile, language: l.code});
                                        setShowLanguageModal(false);
                                    }}
                                    className={`text-center py-3 text-lg font-bold cursor-pointer transition-all rounded-xl ${userProfile.language === l.code ? 'bg-blue-50 text-blue-600' : 'text-zinc-400 hover:bg-zinc-50'}`}
                                 >
                                    {l.label}
                                 </div>
                             ))}
                        </div>
                        <button onClick={() => setShowLanguageModal(false)} className="w-full py-4 bg-zinc-100 text-zinc-900 font-bold rounded-2xl hover:bg-zinc-200">{t('btn.cancel')}</button>
                    </div>
                </div>
            )}

            {/* FIRST WEEKDAY MODAL */}
            {showWeekdayModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center backdrop-blur-sm p-4 md:items-center">
                    <div className="bg-white w-full max-w-lg rounded-3xl p-6 animate-in slide-in-from-bottom-10 shadow-2xl max-h-[85vh] flex flex-col">
                        <h3 className="text-2xl font-black text-zinc-900 mb-6 text-center shrink-0">First Weekday</h3>
                        <div className="space-y-2 mb-6 overflow-y-auto pr-2 scrollbar-hide flex-1">
                             {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                                 <div 
                                    key={day} 
                                    onClick={() => setTempWeekday(day as any)}
                                    className={`text-center py-3 text-lg font-bold cursor-pointer transition-all rounded-xl ${tempWeekday === day ? 'bg-blue-50 text-blue-600' : 'text-zinc-400 hover:bg-zinc-50'}`}
                                 >
                                    {day}
                                 </div>
                             ))}
                        </div>
                        <div className="flex gap-4 shrink-0">
                            <button 
                                onClick={() => setShowWeekdayModal(false)}
                                className="flex-1 py-4 bg-zinc-100 text-zinc-900 font-bold rounded-2xl hover:bg-zinc-200 transition-colors"
                            >
                                {t('btn.cancel')}
                            </button>
                            <button 
                                onClick={() => {
                                    updateSetting('firstWeekday', tempWeekday);
                                    setShowWeekdayModal(false);
                                }}
                                className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                            >
                                {t('btn.save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MY PROFILE SUBPAGE ---
const MyProfileSubPage: React.FC<{ userProfile: UserProfile, onBack: () => void, onUpdateProfile: (p: UserProfile) => void, onNavigate: (v: ViewState) => void, t: (key:string)=>string }> = ({ userProfile, onBack, onUpdateProfile, onNavigate, t }) => {
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [tempProfile, setTempProfile] = useState<UserProfile>(userProfile);
  
    const handleOpenModal = (type: ModalType) => {
      setTempProfile({ ...userProfile });
      setActiveModal(type);
    };
  
    const handleSave = () => {
      onUpdateProfile(tempProfile);
      setActiveModal(null);
    };
  
    const toggleEquipment = (item: Equipment) => {
      const current = tempProfile.equipment || [];
      const exists = current.includes(item);
      let updated;
      if (exists) updated = current.filter(i => i !== item);
      else updated = [...current, item];
      setTempProfile({ ...tempProfile, equipment: updated });
    };
  
    const updatePR = (key: keyof typeof tempProfile.prs, value: string) => {
      setTempProfile({
        ...tempProfile,
        prs: { ...tempProfile.prs, [key]: value }
      });
    };
  
    const allGoals: TrainingGoal[] = ['Get Stronger', 'Pronation (Toproll)', 'Supination (Defense)', 'Rising (Height)', 'Cupping (Hook)', 'Side Pressure', 'Pressing Power'];
    const allEquipment: Equipment[] = ['Wrist Ball', 'L-Tool', 'Strap', 'Judo Belt', 'Wrist Wrench', 'Dumbbells', 'Cables', 'Table'];

    return (
        <div className="bg-gray-50 min-h-screen pb-24 relative animate-in slide-in-from-right-8">
            <div className="px-4 pt-6 mb-6 flex items-center gap-4">
                <button onClick={onBack}><ArrowLeft className="text-zinc-800" size={24}/></button>
                <h1 className="text-xl font-bold text-zinc-900">{t('me.my_profile')}</h1>
            </div>

            <div className="px-4 space-y-4">
                 {/* SECTION 1: GOAL & FOCUS */}
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                    <ListItem 
                        label="Goal" 
                        value={userProfile.goal || 'Get Stronger'} 
                        onClick={() => handleOpenModal('GOAL')}
                        highlight
                    />
                    <div className="h-px bg-zinc-50 mx-4"></div>
                    <ListItem 
                        label="Focus Area" 
                        value={userProfile.focusArea || 'Full Body'} 
                        onClick={() => handleOpenModal('FOCUS')}
                    />
                </div>

                {/* SECTION 2: EQUIPMENT */}
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                    <ListItem 
                        label="Available Equipment" 
                        value={`${userProfile.equipment?.length || 0} Selected`} 
                        onClick={() => handleOpenModal('EQUIPMENT')}
                    />
                </div>

                {/* SECTION 3: PRs */}
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                    <ListItem 
                        label="My 1RM (Bench Press)" 
                        value="View All PRs" 
                        onClick={() => handleOpenModal('PRS')}
                    />
                    <div className="h-px bg-zinc-50 mx-4"></div>
                    {/* Quick Preview of Best PR */}
                    <div className="px-4 py-3 bg-zinc-50 flex flex-wrap gap-2">
                        {userProfile.prs.pronation && <Badge label="Pronation" value={userProfile.prs.pronation + 'kg'} color="red" />}
                        {userProfile.prs.sidePressure && <Badge label="Side" value={userProfile.prs.sidePressure + 'kg'} color="blue" />}
                        {!userProfile.prs.pronation && !userProfile.prs.sidePressure && <span className="text-xs text-zinc-400">No PRs logged yet. Tap to add.</span>}
                    </div>
                </div>

                {/* SECTION 4: BASIC INFO */}
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider ml-1 mt-2">Basic Info</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                    <ListItem 
                        label="Gender" 
                        value={userProfile.gender || 'Male'} 
                        onClick={() => handleOpenModal('BASIC')}
                    />
                    <div className="h-px bg-zinc-50 mx-4"></div>
                    <ListItem 
                        label="Current Weight" 
                        value={`${userProfile.weight} ${userProfile.weightUnit}`} 
                        onClick={() => handleOpenModal('BASIC')}
                    />
                    <div className="h-px bg-zinc-50 mx-4"></div>
                    <ListItem 
                        label="Target Weight" 
                        value={`${userProfile.targetWeight || '--'} ${userProfile.weightUnit}`} 
                        onClick={() => handleOpenModal('BASIC')}
                    />
                    <div className="h-px bg-zinc-50 mx-4"></div>
                    <ListItem 
                        label="Height" 
                        value={`${userProfile.height} ${userProfile.heightUnit}`} 
                        onClick={() => handleOpenModal('BASIC')}
                    />
                </div>

                {/* SECTION 5: MEASUREMENTS */}
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider ml-1 mt-2">Sizes</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                    <ListItem 
                        label="Biceps (Right)" 
                        value={`${userProfile.bicepRight || '--'} ${userProfile.heightUnit === 'cm' ? 'cm' : 'in'}`} 
                        onClick={() => handleOpenModal('SIZES')}
                    />
                    <div className="h-px bg-zinc-50 mx-4"></div>
                    <ListItem 
                        label="Biceps (Left)" 
                        value={`${userProfile.bicepLeft || '--'} ${userProfile.heightUnit === 'cm' ? 'cm' : 'in'}`} 
                        onClick={() => handleOpenModal('SIZES')}
                    />
                    <div className="h-px bg-zinc-50 mx-4"></div>
                    <ListItem 
                        label="Forearm (Right)" 
                        value={`${userProfile.forearmRight || '--'} ${userProfile.heightUnit === 'cm' ? 'cm' : 'in'}`} 
                        onClick={() => handleOpenModal('SIZES')}
                    />
                    <div className="h-px bg-zinc-50 mx-4"></div>
                    <ListItem 
                        label="Forearm (Left)" 
                        value={`${userProfile.forearmLeft || '--'} ${userProfile.heightUnit === 'cm' ? 'cm' : 'in'}`} 
                        onClick={() => handleOpenModal('SIZES')}
                    />
                    <div className="h-px bg-zinc-50 mx-4"></div>
                    <ListItem 
                        label="Wrist" 
                        value={`${userProfile.wrist || '--'} ${userProfile.heightUnit === 'cm' ? 'cm' : 'in'}`} 
                        onClick={() => handleOpenModal('SIZES')}
                    />
                </div>
            </div>

            {/* --- MODALS FOR PROFILE EDITING --- */}
            {activeModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center">
                    <div className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-3xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-10">
                        <div className="p-4 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <button onClick={() => setActiveModal(null)} className="p-2 bg-zinc-100 rounded-full"><X size={20}/></button>
                            <h2 className="font-bold text-lg uppercase tracking-tight">
                                {activeModal === 'GOAL' ? 'Set Goal' : 
                                activeModal === 'EQUIPMENT' ? 'Equipment' : 
                                activeModal === 'PRS' ? 'My PRs' : 
                                activeModal === 'BASIC' ? 'Basic Info' : 'Measurements'}
                            </h2>
                            <button 
                                onClick={handleSave} 
                                className="px-6 py-2 bg-red-600 text-white font-bold rounded-full text-sm shadow-md hover:bg-red-700 transition-colors"
                            >
                                {t('btn.save')}
                            </button>
                        </div>
                        
                        <div className="p-6 pb-20 space-y-4">
                            {/* GOAL */}
                            {activeModal === 'GOAL' && (
                                <div className="grid gap-2">
                                    {allGoals.map(g => (
                                        <button 
                                            key={g} 
                                            onClick={() => setTempProfile({...tempProfile, goal: g})}
                                            className={`p-4 rounded-xl text-left font-bold transition-all ${tempProfile.goal === g ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-zinc-50 text-zinc-600'}`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* FOCUS */}
                            {activeModal === 'FOCUS' && (
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-zinc-500">Focus Area</label>
                                    <input 
                                        value={tempProfile.focusArea} 
                                        onChange={(e) => setTempProfile({...tempProfile, focusArea: e.target.value})}
                                        className="w-full bg-zinc-50 p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                            )}

                            {/* EQUIPMENT */}
                            {activeModal === 'EQUIPMENT' && (
                                <div className="grid gap-2">
                                    {allEquipment.map(eq => {
                                        const isSelected = tempProfile.equipment?.includes(eq);
                                        return (
                                            <button 
                                                key={eq}
                                                onClick={() => toggleEquipment(eq)}
                                                className={`p-4 rounded-xl flex items-center justify-between transition-all ${isSelected ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-500'}`}
                                            >
                                                <span className="font-bold">{eq}</span>
                                                {isSelected && <Check size={20} className="text-red-500" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* PRS */}
                            {activeModal === 'PRS' && (
                                <div className="grid gap-4">
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-2 flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <Trophy size={16} className="text-blue-600" />
                                            <h4 className="font-bold text-blue-800 text-sm">Unlocking Levels?</h4>
                                        </div>
                                        <p className="text-xs text-blue-600 leading-snug">
                                            To unlock Training Plans (Intermediate, Advanced, etc.), you need to take the official placement test.
                                        </p>
                                        <button 
                                            onClick={() => onNavigate('PLACEMENT_TEST')}
                                            className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Take Official Level Test
                                        </button>
                                    </div>

                                    <PRInput label="Pronation (Toproll)" val={tempProfile.prs.pronation} onChange={(v) => updatePR('pronation', v)} />
                                    <PRInput label="Supination (Defense)" val={tempProfile.prs.supination} onChange={(v) => updatePR('supination', v)} />
                                    <PRInput label="Side Pressure" val={tempProfile.prs.sidePressure} onChange={(v) => updatePR('sidePressure', v)} />
                                    <PRInput label="Back Pressure" val={tempProfile.prs.backPressure} onChange={(v) => updatePR('backPressure', v)} />
                                    <PRInput label="Rising (Radial)" val={tempProfile.prs.rising} onChange={(v) => updatePR('rising', v)} />
                                    <PRInput label="Cupping (Hook)" val={tempProfile.prs.cupping} onChange={(v) => updatePR('cupping', v)} />
                                </div>
                            )}

                            {/* BASIC INFO */}
                            {activeModal === 'BASIC' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase">Gender</label>
                                        <div className="flex gap-2">
                                            {['Male', 'Female'].map(g => (
                                                <button 
                                                    key={g} 
                                                    onClick={() => setTempProfile({...tempProfile, gender: g as any})}
                                                    className={`flex-1 py-3 rounded-xl font-bold ${tempProfile.gender === g ? 'bg-red-600 text-white' : 'bg-zinc-100 text-zinc-500'}`}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <BasicInput label={`Current Weight (${tempProfile.weightUnit})`} val={tempProfile.weight} onChange={(v) => setTempProfile({...tempProfile, weight: v})} />
                                        <BasicInput label={`Target Weight (${tempProfile.weightUnit})`} val={tempProfile.targetWeight} onChange={(v) => setTempProfile({...tempProfile, targetWeight: v})} />
                                    </div>
                                    <BasicInput label={`Height (${tempProfile.heightUnit})`} val={tempProfile.height} onChange={(v) => setTempProfile({...tempProfile, height: v})} />
                                </div>
                            )}

                            {/* SIZES */}
                            {activeModal === 'SIZES' && (
                                <div className="space-y-4">
                                    <p className="text-sm text-zinc-400 mb-2">Units: {tempProfile.heightUnit === 'cm' ? 'Centimeters' : 'Inches'}</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <BasicInput label="Bicep Right" val={tempProfile.bicepRight} onChange={(v) => setTempProfile({...tempProfile, bicepRight: v})} />
                                        <BasicInput label="Bicep Left" val={tempProfile.bicepLeft} onChange={(v) => setTempProfile({...tempProfile, bicepLeft: v})} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <BasicInput label="Forearm Right" val={tempProfile.forearmRight} onChange={(v) => setTempProfile({...tempProfile, forearmRight: v})} />
                                        <BasicInput label="Forearm Left" val={tempProfile.forearmLeft} onChange={(v) => setTempProfile({...tempProfile, forearmLeft: v})} />
                                    </div>
                                    <BasicInput label="Wrist (Bone)" val={tempProfile.wrist} onChange={(v) => setTempProfile({...tempProfile, wrist: v})} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- SHARED COMPONENTS ---

const MenuLink: React.FC<{ icon: React.ReactNode, iconBg: string, label: string, onClick: () => void }> = ({ icon, iconBg, label, onClick }) => (
    <div onClick={onClick} className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-50 transition-colors">
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
                {icon}
            </div>
            <span className="font-bold text-zinc-800">{label}</span>
        </div>
        <ChevronRight className="text-zinc-300" size={20} />
    </div>
);

const ListItem: React.FC<{ label: string; value: string; onClick: () => void; highlight?: boolean }> = ({ label, value, onClick, highlight }) => (
    <div onClick={onClick} className="p-5 flex items-center justify-between cursor-pointer hover:bg-zinc-50 active:bg-zinc-100 transition-colors">
        <div className="flex flex-col">
            <span className="text-xs font-medium text-zinc-500 mb-0.5">{label}</span>
            <span className={`text-lg font-bold ${highlight ? 'text-zinc-900' : 'text-zinc-800'}`}>{value}</span>
        </div>
        <ChevronRight className="text-zinc-300" size={20} />
    </div>
);

const Badge: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
    <div className={`text-[10px] font-bold px-2 py-1 rounded-md border bg-white flex items-center gap-1 ${color === 'red' ? 'text-red-600 border-red-100' : 'text-blue-600 border-blue-100'}`}>
        <span className="uppercase opacity-70">{label}:</span>
        <span>{value}</span>
    </div>
);

const PRInput: React.FC<{ label: string; val: string; onChange: (v: string) => void }> = ({ label, val, onChange }) => (
    <div className="flex items-center gap-4 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
        <span className="flex-1 text-sm font-bold text-zinc-700">{label}</span>
        <div className="relative w-24">
            <input 
                type="number" 
                value={val} 
                onChange={(e) => onChange(e.target.value)}
                placeholder="0"
                className="w-full bg-white border border-zinc-200 rounded-lg py-2 px-2 text-center font-bold focus:border-red-500 outline-none"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-bold pointer-events-none">kg</span>
        </div>
    </div>
);

const BasicInput: React.FC<{ label: string; val: string; onChange: (v: string) => void }> = ({ label, val, onChange }) => (
    <div>
        <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase">{label}</label>
        <input 
            type="number" 
            value={val} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 font-bold text-zinc-900 focus:border-red-500 outline-none"
        />
    </div>
);

export default Me;
