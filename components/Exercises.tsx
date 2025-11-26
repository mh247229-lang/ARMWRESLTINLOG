
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Youtube, Info, Play, Plus, Check, Camera, Image as ImageIcon, Pencil, Save, Settings2, ChevronDown } from 'lucide-react';
import { generateId } from '../constants';
import { Exercise, BodyPart, Mechanic } from '../types';

interface ExercisesProps {
    exercises: Exercise[];
    onAddExercise?: (exercise: Exercise) => void;
    onEditExercise?: (exercise: Exercise) => void;
    customExercises?: Exercise[]; // Deprecated prop, keeping for compatibility if needed but using 'exercises'
    t?: (key: string) => string;
}

const Exercises: React.FC<ExercisesProps> = ({ exercises = [], onAddExercise, onEditExercise, t }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  
  // View Mode States
  const [viewAngle, setViewAngle] = useState('90');
  const [viewVector, setViewVector] = useState('Front');

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newExercise, setNewExercise] = useState<Partial<Exercise>>({
      name: '',
      category: 'Arm Wrestling',
      bodyPart: 'Forearm',
      mechanic: 'FREE_WEIGHT',
      imageUrl: '',
      videoUrl: '',
      defaultAngle: '90',
      defaultVector: 'Front'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Exercise | null>(null);
  
  // State for editing specific variations
  const [editingVariationKey, setEditingVariationKey] = useState('90'); 
  
  const editFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      if (selectedExercise) {
          setViewAngle(selectedExercise.defaultAngle || '90');
          setViewVector(selectedExercise.defaultVector || 'Front');
          
          // Reset editing key based on mechanic
          if (selectedExercise.mechanic === 'CABLE') {
              setEditingVariationKey(selectedExercise.defaultVector || 'Front');
          } else {
              setEditingVariationKey(selectedExercise.defaultAngle || '90');
          }
      }
  }, [selectedExercise]);

  const handleCreate = () => {
      if (newExercise.name && onAddExercise) {
          const ex: Exercise = {
              id: `custom_${generateId()}`,
              name: newExercise.name,
              category: newExercise.category as any,
              bodyPart: newExercise.bodyPart as any,
              mechanic: newExercise.mechanic as any,
              equipment: newExercise.equipment || 'Standard',
              imageUrl: newExercise.imageUrl,
              videoUrl: newExercise.videoUrl,
              defaultAngle: newExercise.defaultAngle,
              defaultVector: newExercise.defaultVector,
              mediaVariations: {}
          };
          onAddExercise(ex);
          setIsCreateOpen(false);
          setNewExercise({ 
              name: '', category: 'Arm Wrestling', bodyPart: 'Forearm', mechanic: 'FREE_WEIGHT', imageUrl: '', videoUrl: '',
              defaultAngle: '90', defaultVector: 'Front'
          });
      }
  };

  const handleSaveEdit = () => {
      if (editForm && onEditExercise) {
          onEditExercise(editForm);
          setSelectedExercise(editForm); // Update displayed detail
          setIsEditing(false);
      }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditMode = false) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const result = reader.result as string;
              if (isEditMode && editForm) {
                  // Update Base Image
                  setEditForm(prev => prev ? ({ ...prev, imageUrl: result }) : null);
              } else {
                  setNewExercise(prev => ({ ...prev, imageUrl: result }));
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const handleVariationImageUpload = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
      const file = e.target.files?.[0];
      if (file && editForm) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const result = reader.result as string;
              const currentVariations = editForm.mediaVariations || {};
              const currentData = currentVariations[key] || {};
              
              setEditForm({
                  ...editForm,
                  mediaVariations: {
                      ...currentVariations,
                      [key]: { ...currentData, imageUrl: result }
                  }
              });
          };
          reader.readAsDataURL(file);
      }
  };

  const updateVariationVideo = (key: string, url: string) => {
      if (!editForm) return;
      const currentVariations = editForm.mediaVariations || {};
      const currentData = currentVariations[key] || {};
      
      setEditForm({
          ...editForm,
          mediaVariations: {
              ...currentVariations,
              [key]: { ...currentData, videoUrl: url }
          }
      });
  };

  const filters = [
    'All', 
    'Pronation', 
    'Supination', 
    'Cup', 
    'Finger', 
    'Chest', 
    'Triceps', 
    'Biceps', 
    'Legs', 
    'Shoulder', 
    'Back', 
    'Sixpack'
  ];
  
  const filteredExercises = exercises.filter(ex => {
    // 1. Text Search Filter
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ex.bodyPart.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Category/BodyPart Filter
    let matchesFilter = true;
    if (activeFilter !== 'All') {
        const lowerName = ex.name.toLowerCase();
        switch (activeFilter) {
            case 'Pronation':
                matchesFilter = lowerName.includes('pronation');
                break;
            case 'Supination':
                matchesFilter = lowerName.includes('supination');
                break;
            case 'Cup':
                matchesFilter = lowerName.includes('cup') || lowerName.includes('wrist curl');
                break;
            case 'Finger':
                matchesFilter = lowerName.includes('finger') || lowerName.includes('roll') || lowerName.includes('grip');
                break;
            case 'Sixpack':
                matchesFilter = ex.bodyPart === 'Core';
                break;
            default:
                if (activeFilter === 'Biceps') matchesFilter = ex.bodyPart === 'Bicep';
                else if (activeFilter === 'Triceps') matchesFilter = ex.bodyPart === 'Tricep';
                else matchesFilter = ex.bodyPart === activeFilter;
        }
    }

    return matchesSearch && matchesFilter;
  });

  const bodyParts: BodyPart[] = ['Forearm', 'Hand', 'Bicep', 'Tricep', 'Shoulder', 'Chest', 'Back', 'Legs', 'Core', 'Full Body'];
  const angles = ['45', '70', '90', '100', '110', '135'];
  const vectors = ['Front', 'High Front', 'Low Front', 'Side', 'Middle Side', 'High Side', 'Low Side'];

  // Helper to get display data based on state
  const getDisplayMedia = (ex: Exercise) => {
      const isCable = ex.mechanic === 'CABLE';
      const key = isCable ? viewVector : viewAngle;
      const variation = ex.mediaVariations?.[key];
      return {
          image: variation?.imageUrl || ex.imageUrl,
          video: variation?.videoUrl || ex.videoUrl,
          key: key // return the active key for display logic
      };
  };

  return (
    <div className="pb-24 pt-6 px-4 bg-gray-50 min-h-screen relative">
      <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">EXERCISES</h1>
      </div>
      
      {/* Search Input */}
      <div className="relative mb-6">
        <input 
            type="text" 
            placeholder="Search exercises..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-full py-3 px-4 pl-12 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-red-500"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
          {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all ${
                    activeFilter === filter 
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20' 
                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-100'
                }`}
              >
                 {filter}
              </button>
          ))}
      </div>

      <div className="space-y-4">
          {filteredExercises.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                  No exercises found for "{activeFilter}"
              </div>
          ) : (
            filteredExercises.map(ex => (
                <div 
                    key={ex.id} 
                    onClick={() => { setSelectedExercise(ex); setIsEditing(false); setEditForm(null); }}
                    className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform"
                >
                    <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                        {ex.imageUrl ? (
                            <img src={ex.imageUrl} alt={ex.name} className="w-full h-full object-cover" />
                        ) : (
                            <img 
                                src={`https://ui-avatars.com/api/?name=${ex.name.substring(0,2)}&background=random&color=fff&size=128`} 
                                alt={ex.name}
                                className="w-full h-full object-cover opacity-80 mix-blend-multiply" 
                            />
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-base">{ex.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{ex.bodyPart} {ex.category === 'Arm Wrestling' ? '• Arm Wrestling' : ''}</p>
                    </div>
                </div>
            ))
          )}
      </div>

      {/* FLOATING ACTION BUTTON */}
      <button 
        onClick={() => setIsCreateOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-red-600 text-white rounded-full shadow-xl shadow-red-600/40 flex items-center justify-center hover:bg-red-700 hover:scale-105 transition-all z-40"
      >
          <Plus size={28} />
      </button>

      {/* CREATE EXERCISE MODAL */}
      {isCreateOpen && (
          <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-zinc-900">Create Exercise</h3>
                      <button onClick={() => setIsCreateOpen(false)} className="bg-zinc-100 p-2 rounded-full text-zinc-500"><X size={20}/></button>
                  </div>
                  
                  <div className="space-y-4">
                      {/* Image Upload */}
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-40 rounded-2xl bg-zinc-50 border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-100 transition-colors overflow-hidden relative"
                      >
                          {newExercise.imageUrl ? (
                              <img src={newExercise.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                              <>
                                <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center mb-2 text-zinc-400">
                                    <ImageIcon size={24} />
                                </div>
                                <p className="text-xs font-bold text-zinc-400">Tap to add photo</p>
                              </>
                          )}
                          <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => handleImageUpload(e, false)} className="hidden" />
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Name</label>
                          <input 
                              value={newExercise.name}
                              onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                              placeholder="e.g. Reverse Wrist Curl"
                              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 font-bold text-zinc-900 focus:ring-2 focus:ring-red-500 outline-none"
                          />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Category</label>
                              <select 
                                  value={newExercise.category}
                                  onChange={(e) => setNewExercise({...newExercise, category: e.target.value as any})}
                                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm font-bold text-zinc-900 outline-none"
                              >
                                  <option value="Arm Wrestling">Arm Wrestling</option>
                                  <option value="Strength">Strength</option>
                                  <option value="Hypertrophy">Hypertrophy</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Mechanic</label>
                              <select 
                                  value={newExercise.mechanic}
                                  onChange={(e) => setNewExercise({...newExercise, mechanic: e.target.value as any})}
                                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm font-bold text-zinc-900 outline-none"
                              >
                                  <option value="FREE_WEIGHT">Free Weight</option>
                                  <option value="CABLE">Cable</option>
                                  <option value="MACHINE">Machine</option>
                                  <option value="BODYWEIGHT">Bodyweight</option>
                              </select>
                          </div>
                      </div>
                      
                      {/* Technical Defaults */}
                      <div className="grid grid-cols-2 gap-4 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                          <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Default Angle</label>
                              <select 
                                  value={newExercise.defaultAngle}
                                  onChange={(e) => setNewExercise({...newExercise, defaultAngle: e.target.value})}
                                  className="w-full bg-white border border-zinc-200 rounded-lg p-2 text-xs font-bold text-zinc-900 outline-none"
                              >
                                  {angles.map(a => <option key={a} value={a}>{a}°</option>)}
                              </select>
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Default Vector</label>
                              <select 
                                  value={newExercise.defaultVector}
                                  onChange={(e) => setNewExercise({...newExercise, defaultVector: e.target.value})}
                                  className="w-full bg-white border border-zinc-200 rounded-lg p-2 text-xs font-bold text-zinc-900 outline-none"
                              >
                                  {vectors.map(v => <option key={v} value={v}>{v}</option>)}
                              </select>
                          </div>
                      </div>

                      <button onClick={handleCreate} disabled={!newExercise.name} className="w-full py-4 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition-all disabled:opacity-50 mt-2">
                          Create Exercise
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* EXERCISE DETAIL MODAL (WITH EDIT SUPPORT) */}
      {selectedExercise && (
          <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-in slide-in-from-bottom-full duration-300">
              {/* Determine which media to show based on current view state */}
              {(() => {
                  const media = getDisplayMedia(editForm || selectedExercise);
                  return (
                    <div className="relative h-72 bg-zinc-900">
                        {isEditing && editForm ? (
                            // Editable Image Area
                            <div 
                                onClick={() => editFileInputRef.current?.click()}
                                className="w-full h-full flex flex-col items-center justify-center cursor-pointer bg-black/50 hover:bg-black/40 transition-colors relative group"
                            >
                                <img 
                                    src={media.image || `https://ui-avatars.com/api/?name=${editForm.name}&background=18181b&color=fff&size=512&font-size=0.3`} 
                                    alt="Preview" 
                                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                                />
                                <div className="z-10 flex flex-col items-center text-white">
                                    <Camera size={32} className="mb-2" />
                                    <span className="font-bold text-sm">Change Base Photo</span>
                                </div>
                                <input type="file" accept="image/*" ref={editFileInputRef} onChange={(e) => handleImageUpload(e, true)} className="hidden" />
                            </div>
                        ) : (
                            // View Only Image
                            <>
                                <img 
                                    src={media.image || `https://ui-avatars.com/api/?name=${selectedExercise.name}&background=18181b&color=fff&size=512&font-size=0.3`} 
                                    alt={selectedExercise.name}
                                    className="w-full h-full object-cover opacity-50"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                            </>
                        )}
                        
                        <button 
                            onClick={() => { setSelectedExercise(null); setIsEditing(false); }}
                            className="absolute top-6 right-6 bg-black/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/40 transition-colors z-20"
                        >
                            <X size={24} />
                        </button>

                        {!isEditing && (
                            <button 
                                onClick={() => { 
                                    setIsEditing(true); 
                                    setEditForm(selectedExercise); 
                                    // Set initial editing key based on mechanic
                                    if (selectedExercise.mechanic === 'CABLE') {
                                        setEditingVariationKey(selectedExercise.defaultVector || 'Front');
                                    } else {
                                        setEditingVariationKey(selectedExercise.defaultAngle || '90');
                                    }
                                }}
                                className="absolute top-6 right-20 bg-black/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/40 transition-colors z-20"
                            >
                                <Pencil size={24} />
                            </button>
                        )}

                        {!isEditing && (
                            <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold uppercase rounded-md">
                                        {selectedExercise.category}
                                    </span>
                                    {/* Show relevant technical tag */}
                                    <span className="px-2 py-1 bg-zinc-800 text-zinc-300 text-[10px] font-bold uppercase rounded-md">
                                        {media.key}
                                    </span>
                                </div>
                                <h2 className="text-3xl font-black text-zinc-900 leading-tight mb-1">
                                    {selectedExercise.name}
                                </h2>
                                <p className="text-zinc-500 font-medium">{selectedExercise.bodyPart} • {selectedExercise.mechanic}</p>
                            </div>
                        )}
                    </div>
                  );
              })()}

              <div className="p-6 pb-24 space-y-6">
                  
                  {/* VIEW MODE: TABS (Angle or Vector) */}
                  {!isEditing && selectedExercise.category === 'Arm Wrestling' && (
                      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                          {selectedExercise.mechanic === 'CABLE' ? (
                              // SHOW VECTORS FOR CABLE
                              vectors.map(v => (
                                  <button 
                                    key={v}
                                    onClick={() => setViewVector(v)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
                                        viewVector === v 
                                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' 
                                        : 'bg-white text-zinc-500 border-zinc-200'
                                    }`}
                                  >
                                      {v}
                                  </button>
                              ))
                          ) : (
                              // SHOW ANGLES FOR FREE WEIGHT
                              angles.map(a => (
                                  <button 
                                    key={a}
                                    onClick={() => setViewAngle(a)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
                                        viewAngle === a 
                                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' 
                                        : 'bg-white text-zinc-500 border-zinc-200'
                                    }`}
                                  >
                                      {a}°
                                  </button>
                              ))
                          )}
                      </div>
                  )}

                  {/* EDIT MODE FORM */}
                  {isEditing && editForm ? (
                      <div className="space-y-6 animate-in fade-in">
                          
                          {/* Basic Info */}
                          <div className="space-y-4 border-b border-zinc-100 pb-6">
                              <div>
                                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Name</label>
                                  <input 
                                      value={editForm.name}
                                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 font-bold text-zinc-900 outline-none focus:ring-2 focus:ring-red-500"
                                  />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Mechanic</label>
                                      <select 
                                          value={editForm.mechanic}
                                          onChange={(e) => setEditForm({...editForm, mechanic: e.target.value as any})}
                                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm font-bold text-zinc-900 outline-none"
                                      >
                                          <option value="FREE_WEIGHT">Free Weight</option>
                                          <option value="CABLE">Cable</option>
                                          <option value="MACHINE">Machine</option>
                                      </select>
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Category</label>
                                      <select 
                                          value={editForm.category}
                                          onChange={(e) => setEditForm({...editForm, category: e.target.value as any})}
                                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm font-bold text-zinc-900 outline-none"
                                      >
                                          <option value="Arm Wrestling">Arm Wrestling</option>
                                          <option value="Strength">Strength</option>
                                          <option value="Hypertrophy">Hypertrophy</option>
                                      </select>
                                  </div>
                              </div>
                          </div>

                          {/* VARIATIONS EDITOR */}
                          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
                              <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-bold text-zinc-900 flex items-center gap-2">
                                      <Settings2 size={16} /> 
                                      {editForm.mechanic === 'CABLE' ? 'Vector Variations' : 'Angle Variations'}
                                  </h4>
                                  <select 
                                      value={editingVariationKey}
                                      onChange={(e) => setEditingVariationKey(e.target.value)}
                                      className="bg-white border border-zinc-200 rounded-lg px-2 py-1 text-xs font-bold outline-none"
                                  >
                                      {editForm.mechanic === 'CABLE' ? (
                                          vectors.map(v => <option key={v} value={v}>{v}</option>)
                                      ) : (
                                          angles.map(a => <option key={a} value={a}>{a}°</option>)
                                      )}
                                  </select>
                              </div>
                              
                              <div className="space-y-3">
                                  {/* Image for this variation */}
                                  <div className="flex items-center gap-3">
                                      <div className="w-16 h-16 bg-zinc-200 rounded-lg overflow-hidden shrink-0 relative">
                                          {editForm.mediaVariations?.[editingVariationKey]?.imageUrl ? (
                                              <img src={editForm.mediaVariations[editingVariationKey].imageUrl} className="w-full h-full object-cover" />
                                          ) : (
                                              <ImageIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-400" size={24}/>
                                          )}
                                      </div>
                                      <div className="flex-1">
                                          <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Photo for {editingVariationKey}</label>
                                          <input type="file" className="text-xs text-zinc-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-white file:text-zinc-700 hover:file:bg-zinc-100" 
                                            accept="image/*"
                                            onChange={(e) => handleVariationImageUpload(e, editingVariationKey)}
                                          />
                                      </div>
                                  </div>

                                  {/* Video for this variation */}
                                  <div>
                                      <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Video for {editingVariationKey}</label>
                                      <input 
                                          placeholder="https://youtube.com/..."
                                          value={editForm.mediaVariations?.[editingVariationKey]?.videoUrl || ''}
                                          onChange={(e) => updateVariationVideo(editingVariationKey, e.target.value)}
                                          className="w-full bg-white border border-zinc-200 rounded-lg p-2 text-xs outline-none focus:border-red-500"
                                      />
                                  </div>
                              </div>
                          </div>

                          <button onClick={handleSaveEdit} className="w-full py-4 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                              <Save size={20} /> Save Changes
                          </button>
                      </div>
                  ) : (
                      /* VIEW MODE: CONTENT */
                      <>
                        {/* Video Link Button (Dynamic based on angle/vector) */}
                        {(() => {
                            const media = getDisplayMedia(selectedExercise);
                            if (!media.video) return null;
                            return (
                                <a href={media.video} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-4 rounded-2xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
                                    <Youtube size={24} /> Watch Tutorial ({media.key})
                                </a>
                            );
                        })()}

                        {/* Default Instructions */}
                        <div className="p-6 bg-zinc-50 rounded-2xl text-center text-zinc-400 text-sm">
                            Detailed instructions for {selectedExercise.name} ({selectedExercise.mechanic === 'CABLE' ? 'Vector' : 'Angle'}: {selectedExercise.mechanic === 'CABLE' ? viewVector : viewAngle}°).
                        </div>
                      </>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default Exercises;
