
import { Exercise, TrainingPlan, PlanDay } from './types';

// Image Constants for Training Plans (High Quality Unsplash)
const PLAN_IMAGES = {
    BEGINNER: "https://images.unsplash.com/photo-1577221084712-45b0445d2b00?q=80&w=1998&auto=format&fit=crop",
    INTERMEDIATE: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop",
    ADVANCED: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    EXPERT: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    ELITE: "https://images.unsplash.com/photo-1627483262268-9c96d8aa10d0?q=80&w=2070&auto=format&fit=crop"
};

// Helper to generate a graphic card for each exercise
const getExerciseImage = (name: string, category: string) => {
    let bg = '18181b'; // Default Zinc-950
    let text = 'ffffff';
    
    // Color Coding by Category
    if (category === 'Arm Wrestling') {
        bg = '7f1d1d'; // Red-900 for Armwrestling
    } else if (category === 'Strength') {
        bg = '1e3a8a'; // Blue-900 for Strength
    } else if (category === 'Hypertrophy') {
        bg = '581c87'; // Purple-900 for Hypertrophy
    } else if (category === 'Cardio') {
        bg = '064e3b'; // Emerald-900 for Cardio
    } else if (category === 'Plyometrics') {
        bg = '78350f'; // Amber-900 for Plyo
    }

    const encodedName = encodeURIComponent(name);
    return `https://placehold.co/800x600/${bg}/${text}.png?text=${encodedName}&font=roboto`;
};

export const ANGLE_BENEFITS: Record<string, string> = {
  '45': 'High posting, outside control, strong drag initiation.',
  '70': 'Balanced high leverage, moderate posting strength.',
  '90': 'Neutral, balanced position, maximum force transfer.',
  '100': 'Solid posting, better for pin defense and drag adjustment.',
  '110': 'Committing shoulder, isolating bicep.',
  '135': 'Deep leverage, strong defensive posting, closing hook lanes.'
};

export const VECTOR_BENEFITS: Record<string, string> = {
  'Front': 'Direct pull, simulates pushing opponent forward.',
  'High Front': 'High posting simulation, improves toproll defense.',
  'Low Front': 'Low drag control, simulates under-hook leverage.',
  'Middle Side': 'Lateral control, simulates side press or hook lane.',
  'Side': 'Lateral control, simulates side press or hook lane.',
  'High Side': 'Overhead angle, improves posting and defensive drag.',
  'Low Side': 'Under leverage, targets opponent\'s fingers.'
};

export const ELBOW_BENEFITS: Record<string, string> = {
  'Stomach': 'Short lever, max tightness, prevents opponent escape.',
  'Tight': 'Standard leverage, good balance of speed and power.',
  'Away': 'Long lever, more reach, stronger drag lane.',
  'Far': 'Maximum lever length, simulates defensive open-arm top roll.'
};

// TRANSLATIONS
export const TRANSLATIONS = {
  en: {
    'nav.training': 'Training',
    'nav.custom': 'Custom',
    'nav.exercises': 'Exercises',
    'nav.secret': 'Secret',
    'nav.me': 'Me',
    'home.my_program': 'My Program',
    'home.feed': 'Feed',
    'home.no_plan': 'No Active Plan',
    'home.start_assessment': 'Start Assessment',
    'home.inside_def': 'Inside Defense',
    'home.outside_def': 'Outside Defense',
    'home.inside_atk': 'Inside Attack',
    'home.outside_atk': 'Outside Attack',
    'custom.create_new': 'Create New Workout',
    'custom.recent': 'Recent Logs',
    'custom.start_new': 'START NEW',
    'exercises.search': 'Search exercises...',
    'exercises.create': 'Create Exercise',
    'me.backup': 'Backup & Restore',
    'me.settings': 'Settings',
    'me.my_profile': 'My Profile',
    'me.general_settings': 'General Settings',
    'me.language': 'Language',
    'me.remove_ads': 'Remove Ads',
    'me.rate_us': 'Rate us',
    'me.feedback': 'Feedback',
    'me.delete_data': 'Delete all data',
    'me.clear_cache': 'Clear caches',
    'me.units': 'Units',
    'me.sound': 'Sound Effect',
    'onboarding.welcome': "Let's Get Started",
    'onboarding.stats': 'Basic Stats',
    'onboarding.height': 'Height',
    'onboarding.bicep_r': 'Right Bicep',
    'onboarding.bicep_l': 'Left Bicep',
    'onboarding.forearm_r': 'Right Forearm',
    'onboarding.forearm_l': 'Left Forearm',
    'onboarding.wrist': 'Wrist Size',
    'onboarding.complete': 'Profile Complete!',
    'btn.save': 'Save',
    'btn.cancel': 'Cancel',
    'btn.next': 'Next',
    'btn.start': 'Start Training',
    'dashboard.calculate': 'Calculate',
    'dashboard.secret': 'Armwrestling Secret',
    'dashboard.history': 'History',
    'history.no_logs': 'No workouts logged yet.',
  },
  fr: {
    'nav.training': 'Entraînement',
    'nav.custom': 'Perso',
    'nav.exercises': 'Exercices',
    'nav.secret': 'Secret',
    'nav.me': 'Moi',
    'home.my_program': 'Mon Programme',
    'home.feed': 'Fil',
    'home.no_plan': 'Aucun plan actif',
    'home.start_assessment': 'Lancer l\'évaluation',
    'home.inside_def': 'Défense Intérieure',
    'home.outside_def': 'Défense Extérieure',
    'home.inside_atk': 'Attaque Intérieure',
    'home.outside_atk': 'Attaque Extérieure',
    'custom.create_new': 'Créer un entraînement',
    'custom.recent': 'Logs récents',
    'custom.start_new': 'NOUVEAU',
    'exercises.search': 'Rechercher...',
    'exercises.create': 'Créer Exercice',
    'me.backup': 'Sauvegarde & Restauration',
    'me.settings': 'Paramètres',
    'me.my_profile': 'Mon Profil',
    'me.general_settings': 'Réglages Généraux',
    'me.language': 'Langue',
    'me.remove_ads': 'Supprimer pubs',
    'me.rate_us': 'Notez-nous',
    'me.feedback': 'Avis',
    'me.delete_data': 'Supprimer toutes les données',
    'me.clear_cache': 'Vider le cache',
    'me.units': 'Unités',
    'me.sound': 'Effet Sonore',
    'onboarding.welcome': 'Commençons',
    'onboarding.stats': 'Stats de base',
    'onboarding.height': 'Taille',
    'onboarding.bicep_r': 'Biceps Droit',
    'onboarding.bicep_l': 'Biceps Gauche',
    'onboarding.forearm_r': 'Avant-bras Droit',
    'onboarding.forearm_l': 'Avant-bras Gauche',
    'onboarding.wrist': 'Taille Poignet',
    'onboarding.complete': 'Profil Complet !',
    'btn.save': 'Enregistrer',
    'btn.cancel': 'Annuler',
    'btn.next': 'Suivant',
    'btn.start': 'Commencer',
    'dashboard.calculate': 'Calculer',
    'dashboard.secret': 'Secret Bras de Fer',
    'dashboard.history': 'Historique',
    'history.no_logs': 'Aucun entraînement enregistré.',
  },
  ar: {
    'nav.training': 'تدريب',
    'nav.custom': 'مخصص',
    'nav.exercises': 'تمارين',
    'nav.secret': 'سر',
    'nav.me': 'أنا',
    'home.my_program': 'برنامجي',
    'home.feed': 'الأنشطة',
    'home.no_plan': 'لا توجد خطة نشطة',
    'home.start_assessment': 'بدء التقييم',
    'home.inside_def': 'دفاع داخلي',
    'home.outside_def': 'دفاع خارجي',
    'home.inside_atk': 'هجوم داخلي',
    'home.outside_atk': 'هجوم خارجي',
    'custom.create_new': 'إنشاء تمرين جديد',
    'custom.recent': 'السجلات الأخيرة',
    'custom.start_new': 'بدء جديد',
    'exercises.search': 'بحث عن تمارين...',
    'exercises.create': 'إنشاء تمرين',
    'me.backup': 'نسخ احتياطي واستعادة',
    'me.settings': 'الإعدادات',
    'me.my_profile': 'ملفي الشخصي',
    'me.general_settings': 'إعدادات عامة',
    'me.language': 'اللغة',
    'me.remove_ads': 'إزالة الإعلانات',
    'me.rate_us': 'قيمنا',
    'me.feedback': 'ملاحظات',
    'me.delete_data': 'حذف جميع البيانات',
    'me.clear_cache': 'مسح التخزين المؤقت',
    'me.units': 'الوحدات',
    'me.sound': 'تأثير الصوت',
    'onboarding.welcome': 'لنبدأ',
    'onboarding.stats': 'الإحصائيات الأساسية',
    'onboarding.height': 'الطول',
    'onboarding.bicep_r': 'عضلة الباي اليمنى',
    'onboarding.bicep_l': 'عضلة الباي اليسرى',
    'onboarding.forearm_r': 'الساعد الأيمن',
    'onboarding.forearm_l': 'الساعد الأيسر',
    'onboarding.wrist': 'حجم المعصم',
    'onboarding.complete': 'اكتمل الملف!',
    'btn.save': 'حفظ',
    'btn.cancel': 'إلغاء',
    'btn.next': 'التالي',
    'btn.start': 'ابدأ التدريب',
    'dashboard.calculate': 'حساب',
    'dashboard.secret': 'سر المصارعة',
    'dashboard.history': 'تاريخ',
    'history.no_logs': 'لا توجد تمارين مسجلة.',
  },
  zh: {
    'nav.training': '训练',
    'nav.custom': '自定义',
    'nav.exercises': '练习',
    'nav.secret': '秘诀',
    'nav.me': '我',
    'home.my_program': '我的计划',
    'home.feed': '动态',
    'home.no_plan': '无活跃计划',
    'home.start_assessment': '开始评估',
    'home.inside_def': '内侧防御',
    'home.outside_def': '外侧防御',
    'home.inside_atk': '内侧攻击',
    'home.outside_atk': '外侧攻击',
    'custom.create_new': '创建新训练',
    'custom.recent': '最近记录',
    'custom.start_new': '开始新训练',
    'exercises.search': '搜索练习...',
    'exercises.create': '创建练习',
    'me.backup': '备份与恢复',
    'me.settings': '设置',
    'me.my_profile': '我的资料',
    'me.general_settings': '通用设置',
    'me.language': '语言',
    'me.remove_ads': '移除广告',
    'me.rate_us': '评价我们',
    'me.feedback': '反馈',
    'me.delete_data': '删除所有数据',
    'me.clear_cache': '清除缓存',
    'me.units': '单位',
    'me.sound': '音效',
    'onboarding.welcome': '让我们开始吧',
    'onboarding.stats': '基本统计',
    'onboarding.height': '身高',
    'onboarding.bicep_r': '右二头肌',
    'onboarding.bicep_l': '左二头肌',
    'onboarding.forearm_r': '右前臂',
    'onboarding.forearm_l': '左前臂',
    'onboarding.wrist': '手腕尺寸',
    'onboarding.complete': '资料完成！',
    'btn.save': '保存',
    'btn.cancel': '取消',
    'btn.next': '下一步',
    'btn.start': '开始训练',
    'dashboard.calculate': '计算',
    'dashboard.secret': '掰手腕秘诀',
    'dashboard.history': '历史',
    'history.no_logs': '暂无训练记录。',
  }
};

export const DEFAULT_EXERCISES: Exercise[] = [
  // ... (Keeping all existing exercises exactly as they were in previous file)
  { id: 'aw_rise_index', name: 'Rise Index', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Belt', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Rise Index', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Rise+Index+Armwrestling' },
  { id: 'aw_rise_between_index', name: 'Rise Between Index', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Belt', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Rise Between Index', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Rise+Between+Knuckles+Armwrestling' },
  { id: 'aw_pronation', name: 'Pronation', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Belt', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Pronation', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Pronation+Exercise+Armwrestling' },
  { id: 'aw_back_pressure', name: 'Back Pressure', category: 'Arm Wrestling', bodyPart: 'Back', equipment: 'Belt', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Back Pressure', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Back+Pressure+Armwrestling' },
  { id: 'aw_low_hand_toproll', name: 'Low Hand Top Roll', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Belt', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Low Hand Top Roll', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Low+Hand+Toproll+Training' },
  { id: 'aw_isolated_pronation', name: 'Isolated Pronation', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Belt', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Isolated Pronation', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Isolated+Pronation' },
  { id: 'aw_thumb_pronation', name: 'Thumb Pronation', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Belt', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Thumb Pronation', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Thumb+Pronation+Armwrestling' },
  { id: 'aw_isolated_thumb_pronation', name: 'Isolated Thumb Pronation', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Belt', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Isolated Thumb Pronation', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Isolated+Thumb+Pronation' },
  { id: 'aw_supination', name: 'Supination', category: 'Arm Wrestling', bodyPart: 'Bicep', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Supination', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Supination+Armwrestling' },
  { id: 'aw_db_hammer', name: 'Dumbbell Hammer', category: 'Arm Wrestling', bodyPart: 'Bicep', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Dumbbell Hammer', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Dumbbell+Hammer+Curl' },
  { id: 'aw_db_curl', name: 'Dumbbell Curl', category: 'Arm Wrestling', bodyPart: 'Bicep', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Dumbbell Curl', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Dumbbell+Curl' },
  { id: 'aw_side_curl', name: 'Side Curl', category: 'Arm Wrestling', bodyPart: 'Bicep', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Side Curl', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Side+Pressure+Curl' },
  { id: 'aw_side_hammer', name: 'Side Hammer', category: 'Arm Wrestling', bodyPart: 'Bicep', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Side Hammer', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Side+Pressure+Hammer+Curl' },
  { id: 'aw_pronation_backpressure_devon', name: 'Pronation Backpressure (Devon Left)', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Belt', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Pronation Backpressure', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Devon+Larratt+Pronation+Lift' },
  { id: 'aw_cable_side_pressure', name: 'Side Pressure (Cable)', category: 'Arm Wrestling', bodyPart: 'Shoulder', equipment: 'Cable', mechanic: 'CABLE', imageUrl: getExerciseImage('Side Pressure Cable', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Cable+Side+Pressure+Armwrestling' },
  { id: 'aw_cable_supination_table', name: 'Cable Supination (Table)', category: 'Arm Wrestling', bodyPart: 'Bicep', equipment: 'Cable', mechanic: 'CABLE', imageUrl: getExerciseImage('Table Supination', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Table+Supination+Cable' },
  { id: 'aw_cable_pronation', name: 'Pronation (Cable)', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Cable', mechanic: 'CABLE', imageUrl: getExerciseImage('Cable Pronation', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Cable+Pronation+Armwrestling' },
  { id: 'aw_cable_pronation_thumb', name: 'Pronation Thumb (Cable)', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Cable', mechanic: 'CABLE', imageUrl: getExerciseImage('Cable Pronation Thumb', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Cable+Pronation+Through+Thumb' },
  { id: 'aw_cable_supination_thumb', name: 'Supination Thumb (Cable)', category: 'Arm Wrestling', bodyPart: 'Bicep', equipment: 'Cable', mechanic: 'CABLE', imageUrl: getExerciseImage('Cable Supination Thumb', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Cable+Supination+Through+Thumb' },
  { id: 'aw_wrist_wrench_side', name: 'Wrist Wrench Side Pressure', category: 'Arm Wrestling', bodyPart: 'Shoulder', equipment: 'Wrist Wrench', mechanic: 'CABLE', imageUrl: getExerciseImage('Wrist Wrench Side', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Wrist+Wrench+Side+Pressure' },
  { id: 'aw_isolated_rise_index', name: 'Isolated Rise Index', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Belt', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Isolated Rise Index', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Isolated+Rising+Exercise' },
  { id: 'aw_isolated_rise_between', name: 'Isolated Rise Between Index', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Belt', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Rise Between Index', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Rise+Between+Knuckles' },
  { id: 'aw_cup_isolated', name: 'Cup Isolated', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Cup Isolated', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Isolated+Cupping' },
  { id: 'aw_wrist_wrench_isolated', name: 'Wrist Wrench Isolated', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Wrist Wrench', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Wrist Wrench Isolated', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Wrist+Wrench+Lift' },
  { id: 'aw_cable_cup_wrench', name: 'Cable Cup Wrist Wrench', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Wrist Wrench', mechanic: 'CABLE', imageUrl: getExerciseImage('Cable Cup Wrench', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Wrist+Wrench+Cable+Cup' },
  { id: 'aw_cable_cup_ltools', name: 'Cable Cup L-Tools', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'L-Tool', mechanic: 'CABLE', imageUrl: getExerciseImage('Cable Cup L-Tools', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=L+Tool+Cupping' },
  { id: 'aw_samoray_pronation', name: 'Screwdriver Pronation (Samoray)', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Belt', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Samoray Pronation', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Samoray+Pronation+Roll' },
  { id: 'aw_multispiner_cup_pro', name: 'Multi-Spinner Cup (Pronation)', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Multi-Spinner', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Multi-Spinner Pronation', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Multi+Spinner+Pronation' },
  { id: 'aw_multispiner_cup_sup', name: 'Multi-Spinner Cup (Supination)', category: 'Arm Wrestling', bodyPart: 'Bicep', equipment: 'Multi-Spinner', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Multi-Spinner Supination', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Multi+Spinner+Supination' },
  { id: 'aw_cable_table_multi_pro', name: 'Cable Table Multi-Spinner (Pronation)', category: 'Arm Wrestling', bodyPart: 'Forearm', equipment: 'Multi-Spinner', mechanic: 'CABLE', imageUrl: getExerciseImage('Table Multi Pronation', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Table+Multi+Spinner+Pronation' },
  { id: 'aw_cable_table_multi_sup', name: 'Cable Table Multi-Spinner (Supination)', category: 'Arm Wrestling', bodyPart: 'Bicep', equipment: 'Multi-Spinner', mechanic: 'CABLE', imageUrl: getExerciseImage('Table Multi Supination', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Table+Multi+Spinner+Supination' },
  { id: 'aw_wrist_max_ermes', name: 'Wrist Max (Ermes)', category: 'Arm Wrestling', bodyPart: 'Hand', equipment: 'Wrist Max', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Wrist Max', 'Arm Wrestling'), tips: ['Use weights: 50lb, 100lb, 150lb... 350lb'], videoUrl: 'https://www.youtube.com/results?search_query=Wrist+Max+Exercise' },
  { id: 'aw_finger_grip', name: 'Finger Grip', category: 'Arm Wrestling', bodyPart: 'Hand', equipment: 'Gripper', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Finger Grip', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Finger+Grip+Training' },
  { id: 'aw_thumb_exercise', name: 'Thumb Exercise', category: 'Arm Wrestling', bodyPart: 'Hand', equipment: 'Band', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Thumb Exercise', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Thumb+War+Training' },
  { id: 'aw_fingertip_grip', name: 'Fingertip Grip', category: 'Arm Wrestling', bodyPart: 'Hand', equipment: 'Gripper', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Fingertip Grip', 'Arm Wrestling'), videoUrl: 'https://www.youtube.com/results?search_query=Fingertip+Grip+Training' },
  
  // --- GYM: CHEST ---
  { id: 'gym_bench_bb', name: 'Bench Press (Barbell)', category: 'Strength', bodyPart: 'Chest', equipment: 'Barbell', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Bench Press', 'Strength'), videoUrl: 'https://www.youtube.com/results?search_query=Barbell+Bench+Press+Form' },
  { id: 'gym_bench_db', name: 'Bench Press (Dumbbell)', category: 'Hypertrophy', bodyPart: 'Chest', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('DB Bench Press', 'Hypertrophy'), videoUrl: 'https://www.youtube.com/results?search_query=Dumbbell+Bench+Press+Form' },
  { id: 'gym_incline_bb', name: 'Incline Bench (Barbell)', category: 'Strength', bodyPart: 'Chest', equipment: 'Barbell', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Incline Bench', 'Strength'), videoUrl: 'https://www.youtube.com/results?search_query=Incline+Barbell+Bench+Press' },
  { id: 'gym_incline_db', name: 'Incline Press (Dumbbell)', category: 'Hypertrophy', bodyPart: 'Chest', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Incline DB Press', 'Hypertrophy'), videoUrl: 'https://www.youtube.com/results?search_query=Incline+Dumbbell+Press' },
  { id: 'gym_chest_fly', name: 'Chest Fly', category: 'Hypertrophy', bodyPart: 'Chest', equipment: 'Cable/Machine', mechanic: 'CABLE', imageUrl: getExerciseImage('Chest Fly', 'Hypertrophy'), videoUrl: 'https://www.youtube.com/results?search_query=Cable+Chest+Fly' },
  { id: 'gym_pushups', name: 'Pushups', category: 'Strength', bodyPart: 'Chest', equipment: 'Bodyweight', mechanic: 'BODYWEIGHT', imageUrl: getExerciseImage('Pushups', 'Strength'), videoUrl: 'https://www.youtube.com/results?search_query=Perfect+Pushup+Form' },
  { id: 'gym_dips', name: 'Weighted Dips', category: 'Strength', bodyPart: 'Tricep', equipment: 'Bodyweight', mechanic: 'BODYWEIGHT', imageUrl: getExerciseImage('Weighted Dips', 'Strength'), videoUrl: 'https://www.youtube.com/results?search_query=Weighted+Dips+Form' },
  { id: 'gym_jm_press', name: 'JM Press', category: 'Strength', bodyPart: 'Tricep', equipment: 'Barbell', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('JM Press', 'Strength'), videoUrl: 'https://www.youtube.com/results?search_query=JM+Press+Exercise' },

  // --- GYM: BACK ---
  { id: 'gym_deadlift', name: 'Deadlift', category: 'Strength', bodyPart: 'Back', equipment: 'Barbell', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Deadlift', 'Strength'), videoUrl: 'https://www.youtube.com/results?search_query=Deadlift+Form' },
  { id: 'gym_pullups', name: 'Pull Ups', category: 'Strength', bodyPart: 'Back', equipment: 'Bodyweight', mechanic: 'BODYWEIGHT', imageUrl: getExerciseImage('Pull Ups', 'Strength'), videoUrl: 'https://www.youtube.com/results?search_query=Pullup+Form' },
  { id: 'gym_lat_pull', name: 'Lat Pulldown', category: 'Hypertrophy', bodyPart: 'Back', equipment: 'Cable', mechanic: 'CABLE', imageUrl: getExerciseImage('Lat Pulldown', 'Hypertrophy'), videoUrl: 'https://www.youtube.com/results?search_query=Lat+Pulldown+Form' },
  { id: 'gym_row_bb', name: 'Barbell Row', category: 'Strength', bodyPart: 'Back', equipment: 'Barbell', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Barbell Row', 'Strength'), videoUrl: 'https://www.youtube.com/results?search_query=Barbell+Row+Form' },
  { id: 'gym_row_db', name: 'Dumbbell Row', category: 'Hypertrophy', bodyPart: 'Back', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Dumbbell Row', 'Hypertrophy'), videoUrl: 'https://www.youtube.com/results?search_query=One+Arm+Dumbbell+Row' },
  
  // --- GYM: SHOULDERS ---
  { id: 'gym_ohp', name: 'Overhead Press (Barbell)', category: 'Strength', bodyPart: 'Shoulder', equipment: 'Barbell', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Overhead Press', 'Strength'), videoUrl: 'https://www.youtube.com/results?search_query=Overhead+Press+Form' },
  { id: 'gym_lat_raise', name: 'Lateral Raise', category: 'Hypertrophy', bodyPart: 'Shoulder', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Lateral Raise', 'Hypertrophy'), videoUrl: 'https://www.youtube.com/results?search_query=Lateral+Raise+Form' },
  
  // --- GYM: LEGS ---
  { id: 'gym_squat', name: 'Back Squat', category: 'Strength', bodyPart: 'Legs', equipment: 'Barbell', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Back Squat', 'Strength'), videoUrl: 'https://www.youtube.com/results?search_query=Back+Squat+Form' },
  { id: 'gym_lunge', name: 'Walking Lunges', category: 'Hypertrophy', bodyPart: 'Legs', equipment: 'Dumbbell', mechanic: 'FREE_WEIGHT', imageUrl: getExerciseImage('Walking Lunges', 'Hypertrophy'), videoUrl: 'https://www.youtube.com/results?search_query=Walking+Lunges+Form' },
  
  // --- RECOVERY / MOBILITY ---
  { id: 'rec_chest_stretch', name: 'Chest Stretch (Doorway)', category: 'Cardio', bodyPart: 'Chest', equipment: 'Bodyweight', mechanic: 'OTHER', imageUrl: getExerciseImage('Chest Stretch', 'Cardio'), videoUrl: 'https://www.youtube.com/results?search_query=Chest+Stretch+Doorway' },
  { id: 'rec_wrist_stretch', name: 'Wrist Flexor Stretch', category: 'Cardio', bodyPart: 'Forearm', equipment: 'Bodyweight', mechanic: 'OTHER', imageUrl: getExerciseImage('Wrist Stretch', 'Cardio'), videoUrl: 'https://www.youtube.com/results?search_query=Wrist+Flexor+Stretch' },
  { id: 'rec_shoulder_band', name: 'Shoulder Dislocates (Band)', category: 'Cardio', bodyPart: 'Shoulder', equipment: 'Band', mechanic: 'OTHER', imageUrl: getExerciseImage('Shoulder Mobility', 'Cardio'), videoUrl: 'https://www.youtube.com/results?search_query=Shoulder+Dislocates+Band' },
  { id: 'rec_foam_roll', name: 'Foam Rolling (Back)', category: 'Cardio', bodyPart: 'Back', equipment: 'Other', mechanic: 'OTHER', imageUrl: getExerciseImage('Foam Rolling', 'Cardio'), videoUrl: 'https://www.youtube.com/results?search_query=Upper+Back+Foam+Rolling' },

  // --- CARDIO ---
  { id: 'cardio_row', name: 'Rowing Machine', category: 'Cardio', bodyPart: 'Full Body', equipment: 'Machine', mechanic: 'MACHINE', imageUrl: getExerciseImage('Rowing Machine', 'Cardio'), videoUrl: 'https://www.youtube.com/results?search_query=Rowing+Machine+Form' },
  { id: 'cardio_jump', name: 'Jump Rope', category: 'Cardio', bodyPart: 'Legs', equipment: 'Other', mechanic: 'BODYWEIGHT', imageUrl: getExerciseImage('Jump Rope', 'Cardio'), videoUrl: 'https://www.youtube.com/results?search_query=Jump+Rope+Workout' }
];

export const generateId = () => Math.random().toString(36).substring(2, 9);

// Helper to generate 4 weeks of plans
const generate4WeekPlan = (baseDays: PlanDay[]): PlanDay[] => {
    // ... (keeping logic same as before, omitting for brevity in this block but assuming it stays)
    const fullPlan: PlanDay[] = [];
    baseDays.forEach(d => {
        fullPlan.push({ ...d, week: 1, day: d.day, title: d.title.replace('Day', 'W1 Day') });
    });
    baseDays.forEach(d => {
        const upgradedExercises = d.exercises.map(e => ({ ...e, sets: e.sets + 1, intensity: e.intensity ? e.intensity.replace('RPE 7', 'RPE 8').replace('RPE 8', 'RPE 9') : 'Higher' }));
        fullPlan.push({ ...d, week: 2, day: d.day + 7, title: d.title.replace('Day', 'W2 Day'), exercises: upgradedExercises });
    });
    baseDays.forEach(d => {
        const peakExercises = d.exercises.map(e => ({ ...e, sets: Math.max(2, e.sets - 1), intensity: 'Near Max / RPE 9.5' }));
        fullPlan.push({ ...d, week: 3, day: d.day + 14, title: d.title.replace('Day', 'W3 Day'), exercises: peakExercises });
    });
    baseDays.forEach(d => {
        const deloadExercises = d.exercises.map(e => ({ ...e, sets: 2, intensity: 'Light / Recovery' }));
        fullPlan.push({ ...d, week: 4, day: d.day + 21, title: d.title.replace('Day', 'W4 Day'), exercises: deloadExercises });
    });
    return fullPlan;
};

// Base Templates for 5 Levels (Re-including basic structure to prevent breakage)
const BASE_BEGINNER_DAYS: PlanDay[] = [
    { day: 1, week: 1, title: 'Day 1: Fundamentals', focus: 'Forearm & Bicep', exercises: [ { name: 'Wrist Curl (Dumbbell)', sets: 4, reps: '15', intensity: 'RPE 7', exerciseId: 'aw_cup_db' } ] },
];
const BASE_INTERMEDIATE_DAYS: PlanDay[] = [{ day: 1, week: 1, title: 'Day 1', focus: 'Power', exercises: [] }];
const BASE_ADVANCED_DAYS: PlanDay[] = [{ day: 1, week: 1, title: 'Day 1', focus: 'Specialist', exercises: [] }];
const BASE_EXPERT_DAYS: PlanDay[] = [{ day: 1, week: 1, title: 'Day 1', focus: 'Conjugate', exercises: [] }];
const BASE_ELITE_DAYS: PlanDay[] = [{ day: 1, week: 1, title: 'Day 1', focus: 'Peaking', exercises: [] }];

export const TRAINING_PLANS: TrainingPlan[] = [
  { id: 'plan_beginner', name: 'Beginner Foundations', level: 'Beginner', duration: '30 Days', image: PLAN_IMAGES.BEGINNER, days: generate4WeekPlan(BASE_BEGINNER_DAYS) },
  { id: 'plan_intermediate', name: 'Intermediate Power', level: 'Intermediate', duration: '30 Days', image: PLAN_IMAGES.INTERMEDIATE, days: generate4WeekPlan(BASE_INTERMEDIATE_DAYS) },
  { id: 'plan_advanced', name: 'Advanced Specialist', level: 'Advanced', duration: '30 Days', image: PLAN_IMAGES.ADVANCED, days: generate4WeekPlan(BASE_ADVANCED_DAYS) },
  { id: 'plan_expert', name: 'Expert Conjugate', level: 'Expert', duration: '30 Days', image: PLAN_IMAGES.EXPERT, days: generate4WeekPlan(BASE_EXPERT_DAYS) },
  { id: 'plan_elite', name: 'Elite Peaking', level: 'Elite', duration: '30 Days', image: PLAN_IMAGES.ELITE, days: generate4WeekPlan(BASE_ELITE_DAYS) },
];
