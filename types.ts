
export type Hand = 'LEFT' | 'RIGHT' | 'BOTH';

export type BodyPart = 
  | 'Forearm' 
  | 'Hand' 
  | 'Bicep' 
  | 'Tricep' 
  | 'Shoulder' 
  | 'Chest' 
  | 'Back' 
  | 'Legs' 
  | 'Core' 
  | 'Full Body';

export type Mechanic = 'CABLE' | 'FREE_WEIGHT' | 'MACHINE' | 'BODYWEIGHT' | 'TABLE' | 'OTHER';

export interface ExerciseDetails {
  preparation: string[];
  execution: string[];
}

export interface Exercise {
  id: string;
  name: string;
  category: 'Arm Wrestling' | 'Strength' | 'Hypertrophy' | 'Cardio' | 'Plyometrics';
  bodyPart: BodyPart;
  equipment?: string;
  mechanic?: Mechanic;
  instructions?: ExerciseDetails;
  tips?: string[];
  imageUrl?: string;
  videoUrl?: string;
  
  // Technical Defaults & Variations
  defaultAngle?: string;
  defaultVector?: string;
  mediaVariations?: Record<string, { imageUrl?: string, videoUrl?: string }>;
}

export interface ArmWrestlingConfig {
  vector?: 'Front' | 'High Front' | 'Low Front' | 'Middle Side' | 'High Side' | 'Low Side';
  elbowPosition?: 'Stomach' | 'Tight' | 'Away' | 'Far';
  angle?: '45' | '70' | '90' | '100' | '110' | '135';
  handleThickness?: number; // 1-8 cm
  strap?: boolean;
}

export interface TestConfig {
  isStatic: boolean;
  mechanic: 'CABLE' | 'FREE_WEIGHT';
  angle: '45' | '70' | '90' | '110' | '135';
  elbow: 'Stomach' | 'Tight' | 'Away';
  vector: 'Front' | 'High Front' | 'Low Front' | 'Side' | 'High Side' | 'Low Side';
}

export interface ExerciseSet {
  id: string;
  hand: Hand; 
  weight: number;
  reps: number;
  rpe?: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  customName?: string; // Fallback name if ID not found in DB
  sets: ExerciseSet[];
  config?: ArmWrestlingConfig;
}

export interface WorkoutSession {
  id: string;
  date: string; // ISO string
  name: string;
  exercises: WorkoutExercise[];
  notes?: string;
}

export type TrainingGoal = 
  | 'Get Stronger'
  | 'Pronation (Toproll)' 
  | 'Supination (Defense)' 
  | 'Rising (Height)' 
  | 'Cupping (Hook)' 
  | 'Side Pressure' 
  | 'Pressing Power';

export type Equipment = 
  | 'Wrist Ball' 
  | 'L-Tool' 
  | 'Strap' 
  | 'Judo Belt' 
  | 'Wrist Wrench' 
  | 'Dumbbells' 
  | 'Cables' 
  | 'Table';

export interface ArmWrestlingPRs {
  // Arm Wrestling Specific
  pronation: string;
  rising: string;
  cupping: string;
  sidePressure: string;
  backPressure: string; 
  supination: string;
  gripCurl: string; 
  sideHammer: string;
  
  // Gym Specific
  benchPress: string;
  squat: string;
  deadlift: string;
  latPulldown: string;
}

export type ArmWrestlingLevel = 
  | 'Beginner' 
  | 'Intermediate' 
  | 'Advanced' 
  | 'Expert' 
  | 'Adv. Expert' 
  | 'Elite' 
  | 'Extreme Elite';

export interface DefenseStats {
  insideDefenseLevel: ArmWrestlingLevel;
  outsideDefenseLevel: ArmWrestlingLevel;
  insideAttackLevel: ArmWrestlingLevel;
  outsideAttackLevel: ArmWrestlingLevel;
  overallLevel: ArmWrestlingLevel;
  lastTestDate: string;
}

export type Weekday = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface AppSettings {
  soundEffects: boolean;
  restTimer: number; // 0 = No timer
  firstWeekday: Weekday;
}

// Plan Specific Types
export interface PlanExerciseDetail {
  name: string;
  sets: number;
  reps: string;
  intensity?: string; // New field for weight guidance (e.g. "75% 1RM", "RPE 8")
  note?: string; // e.g. "Cable High, 90 degree elbow"
  exerciseId?: string; // Optional ID map to DB
}

export interface PlanDay {
  day: number;
  week: number; // 1-4
  title: string;
  focus: string;
  exercises: PlanExerciseDetail[];
  isRest?: boolean;
}

export interface TrainingPlan {
  id: string;
  name: string;
  level: string;
  duration: string;
  image: string;
  days: PlanDay[];
  generatedDate?: string;
}

export type Language = 'en' | 'fr' | 'ar' | 'zh';

export interface UserProfile {
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  age: string;
  language: Language;
  
  // Weights
  weight: string;
  targetWeight: string;
  weightUnit: 'kg' | 'lbs';
  
  // Height
  height: string;
  heightUnit: 'cm' | 'ft';
  
  // Measurements (Split Right/Left)
  bicepRight: string;
  bicepLeft: string;
  forearmRight: string;
  forearmLeft: string;
  wrist: string;
  
  // Preferences
  goal: TrainingGoal;
  focusArea: string;
  equipment: Equipment[];
  prs: ArmWrestlingPRs;
  
  // App Settings
  settings: AppSettings;
  
  // Training Level & Program
  level?: string; // Legacy field
  defenseStats?: DefenseStats;
  activeProgram?: TrainingPlan;
  
  isSetup: boolean;
}

export type ViewState = 'HOME' | 'CUSTOM' | 'EXERCISES' | 'REPORT' | 'ME' | 'LOG_WORKOUT' | 'AI_COACH' | 'PLACEMENT_TEST';
