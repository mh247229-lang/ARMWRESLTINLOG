import { Exercise } from './types';

export const DEFAULT_EXERCISES: Exercise[] = [
  // --- ARM WRESTLING: CABLE WORK ---
  { id: 'aw_pro_cable', name: 'Pronation (Cable)', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Cable', mechanic: 'CABLE' },
  { id: 'aw_rise_cable', name: 'Rising (Cable)', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Cable', mechanic: 'CABLE' },
  { id: 'aw_cup_cable', name: 'Cupping (Cable)', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Cable', mechanic: 'CABLE' },
  { id: 'aw_roll_cable', name: 'Finger Roll (Cable)', category: 'Arm Wrestling', bodyPart: 'Hand', equipment: 'Cable', mechanic: 'CABLE' },
  { id: 'aw_supination_cable', name: 'Supination (Cable)', category: 'Arm Wrestling', bodyPart: 'Bicep', equipment: 'Cable', mechanic: 'CABLE' },
  { id: 'aw_side_pressure_cable', name: 'Side Pressure (Cable)', category: 'Arm Wrestling', bodyPart: 'Shoulder', equipment: 'Cable', mechanic: 'CABLE' },
  { id: 'aw_back_pressure_cable', name: 'Back Pressure (Cable)', category: 'Arm Wrestling', bodyPart: 'Back', equipment: 'Cable', mechanic: 'CABLE' },
  { id: 'aw_kickback_cable', name: 'Tricep Kickback / Press (Cable)', category: 'Arm Wrestling', bodyPart: 'Tricep', equipment: 'Cable', mechanic: 'CABLE' },

  // --- ARM WRESTLING: FREE WEIGHT / STATIC ---
  { id: 'aw_pro_belt_lift', name: 'Pronation Lift (Belt/Floor)', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Free Weight', mechanic: 'FREE_WEIGHT' },
  { id: 'aw_rise_static', name: 'Rising (Static Hold)', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Free Weight', mechanic: 'FREE_WEIGHT' },
  { id: 'aw_cup_db', name: 'Wrist Curl (Dumbbell)', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT' },
  { id: 'aw_hammer_curl_partial', name: 'Partial Hammer Curl', category: 'Arm Wrestling', bodyPart: 'Bicep', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT' },
  { id: 'aw_devon_lift', name: 'Devon Larratt Pronation Lift', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Belt/Weight', mechanic: 'FREE_WEIGHT' },
  
  // --- ARM WRESTLING: TABLE SPECIFIC ---
  { id: 'aw_table_sparring', name: 'Table Sparring (Ready Go)', category: 'Arm Wrestling', bodyPart: 'Full Body', equipment: 'Table', mechanic: 'TABLE' },
  { id: 'aw_table_hook', name: 'Deep Hook Sparring', category: 'Arm Wrestling', bodyPart: 'Full Body', equipment: 'Table', mechanic: 'TABLE' },
  { id: 'aw_table_toproll', name: 'Toproll Sparring', category: 'Arm Wrestling', bodyPart: 'Full Body', equipment: 'Table', mechanic: 'TABLE' },
  { id: 'aw_table_press', name: 'Press Sparring', category: 'Arm Wrestling', bodyPart: 'Tricep', equipment: 'Table', mechanic: 'TABLE' },

  // --- GYM: CHEST ---
  { id: 'gym_bench_bb', name: 'Bench Press (Barbell)', category: 'Strength', bodyPart: 'Chest', equipment: 'Barbell', mechanic: 'FREE_WEIGHT' },
  { id: 'gym_bench_db', name: 'Bench Press (Dumbbell)', category: 'Hypertrophy', bodyPart: 'Chest', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT' },
  { id: 'gym_incline_bb', name: 'Incline Bench (Barbell)', category: 'Strength', bodyPart: 'Chest', equipment: 'Barbell', mechanic: 'FREE_WEIGHT' },
  { id: 'gym_incline_db', name: 'Incline Press (Dumbbell)', category: 'Hypertrophy', bodyPart: 'Chest', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT' },
  { id: 'gym_chest_fly', name: 'Chest Fly', category: 'Hypertrophy', bodyPart: 'Chest', equipment: 'Cable/Machine', mechanic: 'CABLE' },
  { id: 'gym_pushups', name: 'Pushups', category: 'Strength', bodyPart: 'Chest', equipment: 'Bodyweight', mechanic: 'BODYWEIGHT' },
  { id: 'gym_dips', name: 'Weighted Dips', category: 'Strength', bodyPart: 'Tricep', equipment: 'Bodyweight', mechanic: 'BODYWEIGHT' },

  // --- GYM: BACK ---
  { id: 'gym_deadlift', name: 'Deadlift', category: 'Strength', bodyPart: 'Back', equipment: 'Barbell', mechanic: 'FREE_WEIGHT' },
  { id: 'gym_pullups', name: 'Pull Ups', category: 'Strength', bodyPart: 'Back', equipment: 'Bodyweight', mechanic: 'BODYWEIGHT' },
  { id: 'gym_row_bb', name: 'Barbell Row', category: 'Strength', bodyPart: 'Back', equipment: 'Barbell', mechanic: 'FREE_WEIGHT' },
  { id: 'gym_row_db', name: 'Dumbbell Row', category: 'Hypertrophy', bodyPart: 'Back', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT' },
  { id: 'gym_lat_pulldown', name: 'Lat Pulldown', category: 'Hypertrophy', bodyPart: 'Back', equipment: 'Cable', mechanic: 'CABLE' },
  { id: 'gym_seated_row', name: 'Seated Cable Row', category: 'Hypertrophy', bodyPart: 'Back', equipment: 'Cable', mechanic: 'CABLE' },
  { id: 'gym_face_pulls', name: 'Face Pulls', category: 'Hypertrophy', bodyPart: 'Shoulder', equipment: 'Cable', mechanic: 'CABLE' },

  // --- GYM: SHOULDERS ---
  { id: 'gym_ohp', name: 'Overhead Press (Barbell)', category: 'Strength', bodyPart: 'Shoulder', equipment: 'Barbell', mechanic: 'FREE_WEIGHT' },
  { id: 'gym_ohp_db', name: 'Shoulder Press (Dumbbell)', category: 'Hypertrophy', bodyPart: 'Shoulder', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT' },
  { id: 'gym_lat_raise', name: 'Lateral Raise', category: 'Hypertrophy', bodyPart: 'Shoulder', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT' },
  { id: 'gym_front_raise', name: 'Front Raise', category: 'Hypertrophy', bodyPart: 'Shoulder', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT' },
  { id: 'gym_rear_delt', name: 'Rear Delt Fly', category: 'Hypertrophy', bodyPart: 'Shoulder', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT' },

  // --- GYM: ARMS ---
  { id: 'gym_bicep_curl_bb', name: 'Barbell Curl', category: 'Hypertrophy', bodyPart: 'Bicep', equipment: 'Barbell', mechanic: 'FREE_WEIGHT' },
  { id: 'gym_bicep_curl_db', name: 'Dumbbell Curl', category: 'Hypertrophy', bodyPart: 'Bicep', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT' },
  { id: 'gym_hammer_curl', name: 'Hammer Curl', category: 'Hypertrophy', bodyPart: 'Bicep', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT' },
  { id: 'gym_preacher_curl', name: 'Preacher Curl', category: 'Hypertrophy', bodyPart: 'Bicep', equipment: 'Machine/Bar', mechanic: 'MACHINE' },
  { id: 'gym_tricep_pushdown', name: 'Tricep Pushdown', category: 'Hypertrophy', bodyPart: 'Tricep', equipment: 'Cable', mechanic: 'CABLE' },
  { id: 'gym_skullcrushers', name: 'Skullcrushers', category: 'Hypertrophy', bodyPart: 'Tricep', equipment: 'Barbell', mechanic: 'FREE_WEIGHT' },
  { id: 'gym_oh_tricep', name: 'Overhead Tricep Ext', category: 'Hypertrophy', bodyPart: 'Tricep', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT' },

  // --- GYM: LEGS ---
  { id: 'gym_squat', name: 'Squat (Back)', category: 'Strength', bodyPart: 'Legs', equipment: 'Barbell', mechanic: 'FREE_WEIGHT' },
  { id: 'gym_squat_front', name: 'Squat (Front)', category: 'Strength', bodyPart: 'Legs', equipment: 'Barbell', mechanic: 'FREE_WEIGHT' },
  { id: 'gym_leg_press', name: 'Leg Press', category: 'Hypertrophy', bodyPart: 'Legs', equipment: 'Machine', mechanic: 'MACHINE' },
  { id: 'gym_rdl', name: 'Romanian Deadlift', category: 'Strength', bodyPart: 'Legs', equipment: 'Barbell', mechanic: 'FREE_WEIGHT' },
  { id: 'gym_lunges', name: 'Walking Lunges', category: 'Hypertrophy', bodyPart: 'Legs', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT' },
  { id: 'gym_leg_ext', name: 'Leg Extension', category: 'Hypertrophy', bodyPart: 'Legs', equipment: 'Machine', mechanic: 'MACHINE' },
  { id: 'gym_leg_curl', name: 'Leg Curl', category: 'Hypertrophy', bodyPart: 'Legs', equipment: 'Machine', mechanic: 'MACHINE' },
  { id: 'gym_calf_raise', name: 'Calf Raises', category: 'Hypertrophy', bodyPart: 'Legs', equipment: 'Machine', mechanic: 'MACHINE' },

  // --- CORE ---
  { id: 'gym_plank', name: 'Plank', category: 'Strength', bodyPart: 'Core', equipment: 'Bodyweight', mechanic: 'BODYWEIGHT' },
  { id: 'gym_leg_raise', name: 'Hanging Leg Raise', category: 'Strength', bodyPart: 'Core', equipment: 'Barbell', mechanic: 'BODYWEIGHT' },
  { id: 'gym_cable_crunch', name: 'Cable Crunch', category: 'Hypertrophy', bodyPart: 'Core', equipment: 'Cable', mechanic: 'CABLE' },
];

// Helper to generate IDs
export const generateId = () => Math.random().toString(36).substring(2, 9);