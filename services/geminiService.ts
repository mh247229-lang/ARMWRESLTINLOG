
import { GoogleGenAI } from "@google/genai";
import { WorkoutSession, Exercise, ArmWrestlingConfig, ArmWrestlingPRs, TrainingPlan, PlanDay, TestConfig } from '../types';
import { DEFAULT_EXERCISES } from '../constants';

const apiKey = process.env.API_KEY || '';

const getAI = () => new GoogleGenAI({ apiKey });

// The EXACT PROMPT Template provided by user, enhanced for specific angles/vectors
const AW_TECH_PROMPT_TEMPLATE = `
I want you to demonstrate only one armwrestling exercise according to the following template. The demonstration is required before the athlete chooses any angle or direction, and it must cover all possible scenarios. Follow the rules precisely.

---

## 0) General Information
* **Exercise Name:** {{EXERCISE_NAME}}
* **Exercise Type:** {{CATEGORY}}

---

## 1) Resistance — Cable Vector Analysis
* **Selected Vector:** {{DIRECTION}}

**Biomechanics of this Vector:**
* Why is this specific direction (e.g., High Front vs Low Side) beneficial?
* **Anatomy:** Which specific muscle fibers (pronator teres, brachioradialis, lats, pecs) does this vector target most?
* **Table Transfer:** How does this specific line of force translate to a real match scenario (e.g. toproll defense, hook entry)?

---

## 2) Resistance — Free Weight or Table (if not cable)
* **Selected Position:** {{ELBOW_POS}}

**For this position, state:**
* What mechanical strengths does this position provide?
* How does it affect torque, lever, and containment?

---

## 3) Handle and Strap Thickness
* **Handle Thickness:** {{HANDLE_SIZE}}cm
* **Strap:** {{STRAP}}
* Explain: How does the presence of a strap (on the back of the hand) change tactics, power, and control?

---

## 4) Angle Specifics (CRITICAL)
* **Selected Angle:** {{ANGLE}}°

**Mechanical Benefit of {{ANGLE}}°:**
* **45° (Open Arm/Defensive):** If selected, explain benefits for King's Move or desperate defense.
* **70°-80° (Tall/Posting):** If selected, explain benefits for height and leverage.
* **90° (Optimal Power):** If selected, explain why this is the peak torque position.
* **110°-135° (Deep Hook/Inside):** If selected, explain benefits for committing shoulder and isolating bicep/chest.
* **Anatomy at this Angle:** How does the load shift between tendon and muscle at this specific degree?

---

## 5) Technical Breakdown
Explain practically and directly:
* How to perform the exercise step by step (start → midpoint → end).
* Position of the wrist, forearm, shoulder, and body.
* Direction of force application (vector).
* Where should the knuckles, thumb, and elbow be positioned during the movement?
* The effect of the exercise on grip, containment, and finger security.

---

## 6) Match Utility
* Is this exercise useful against: Top Rollers? Hookers? Pressers? Rising opponents? Explain how and why.
* Which position (Start/Mid/Defense/Finish) is most useful?
* Does it give an advantage to attack, defense, or escape? Briefly state.

---

## 7) What prevents the opponent from doing it? (Prevention)
Clearly define what this exercise prevents in terms of opponent behaviors.

---

## 8) Common Mistakes
List 3 to 6 practical mistakes associated with this exercise.

---

## 10) Short Concluding Sentence (Summary Advantage)
Write a single sentence summarizing the ultimate tactical benefit of the exercise in the context of the choices.
`;

export const getExerciseTechnicalBreakdown = async (
    exerciseName: string,
    config: ArmWrestlingConfig
): Promise<string> => {
    try {
        const ai = getAI();
        const model = 'gemini-2.5-flash';

        let filledPrompt = AW_TECH_PROMPT_TEMPLATE
            .replace('{{EXERCISE_NAME}}', exerciseName)
            .replace('{{CATEGORY}}', 'Arm Wrestling Specific')
            .replace('{{DIRECTION}}', config.vector || 'Not Applicable (Free Weight)')
            .replace('{{ELBOW_POS}}', config.elbowPosition || 'Not Applicable (Cable)')
            .replace('{{HANDLE_SIZE}}', config.handleThickness?.toString() || 'Standard')
            .replace('{{STRAP}}', config.strap ? 'YES' : 'NO')
            .replace('{{ANGLE}}', config.angle || '90');

        const response = await ai.models.generateContent({
            model,
            contents: filledPrompt,
        });

        return response.text || "Unable to generate technical breakdown.";

    } catch (error) {
        console.error("Gemini Tech Error:", error);
        return "Error retrieving technical data.";
    }
};

export const generateTrainingAdvice = async (
  recentWorkouts: WorkoutSession[],
  userQuery?: string
): Promise<string> => {
  try {
    const ai = getAI();
    const model = 'gemini-2.5-flash';
    
    const exerciseMap = DEFAULT_EXERCISES.reduce((acc, ex) => {
      acc[ex.id] = `${ex.name} (${ex.category})`;
      return acc;
    }, {} as Record<string, string>);

    // Format history for the AI with config details
    const historySummary = recentWorkouts.slice(0, 5).map(w => {
      return `
      Date: ${new Date(w.date).toLocaleDateString()}
      Exercises:
      ${w.exercises.map(e => {
         const details = [];
         if (e.config?.vector) details.push(e.config.vector);
         if (e.config?.angle) details.push(`${e.config.angle} deg`);
         const detailStr = details.length ? `[${details.join(', ')}]` : '';
         return `- ${exerciseMap[e.exerciseId] || 'Unknown'} ${detailStr}: ${Math.max(...e.sets.map(s => s.weight))}kg max`;
      }).join('\n')}
      `;
    }).join('\n---\n');

    const prompt = `
    You are an elite Strength & Conditioning Coach for a hybrid athlete (Arm Wrestling + Gym).
    
    History:
    ${historySummary}

    User Question: ${userQuery || "Analyze my volume and structure."}
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "No advice generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to the AI Coach.";
  }
};

export const generateCustomProgram = async (
    prs: ArmWrestlingPRs,
    detailedStats?: Record<string, { weight: number, config: TestConfig }>,
    leftRightStats?: string
): Promise<TrainingPlan | null> => {
    try {
        const ai = getAI();
        const model = 'gemini-2.5-flash';

        const exerciseList = DEFAULT_EXERCISES.map(e => `${e.id}: ${e.name}`).join('\n');
        
        // Construct detailed stats string with STRICT technical parameters
        let detailsStr = '';
        if (detailedStats) {
            detailsStr = Object.entries(detailedStats).map(([key, data]) => {
                const c = data.config;
                return `- ${key.toUpperCase()}: ${data.weight}kg
                  * Angle: ${c.angle}°
                  * Tool: ${c.mechanic}
                  * Type: ${c.isStatic ? 'Static Hold' : 'Dynamic Reps'}
                  * Elbow Pos: ${c.elbow} (if Free Weight)
                  * Vector: ${c.vector} (if Cable)`;
            }).join('\n');
        }

        const prompt = `
        You are an ELITE Armwrestling Coach (Devon Larratt / John Brzenk methodology). 
        Create a strict, mathematical 30-Day Training Plan based on the athlete's EXACT 1RM stats.

        **ATHLETE PRs (Use these for calculations):**
        - Pronation: ${prs.pronation}kg
        - Rising: ${prs.rising}kg
        - Cup: ${prs.cupping}kg
        - Side Pressure: ${prs.sidePressure}kg
        - Back Pressure: ${prs.backPressure}kg
        - Bench: ${prs.benchPress}kg
        
        **LEFT VS RIGHT IMBALANCE:**
        ${leftRightStats || 'No specific imbalance data.'}

        **TECHNICAL BIOMECHANICS (Tested Angles):**
        ${detailsStr}

        **INSTRUCTIONS FOR PROFESSIONAL PROGRAMMING:**
        1. **CALCULATED LOADS:** Do NOT write "Heavy" or "RPE 8". You MUST calculate the specific weight.
           - Example: If Pronation PR is 40kg and you want 80% intensity, write "32kg" in the intensity field.
           - If the set is "Partials", add 10-15% to the weight (e.g., "36kg (Partial)").
           - If the set is "Static", use 90-100% of 1RM (e.g., "40kg (Static Hold)").

        2. **EXERCISE VARIATIONS (Mandatory):**
           - **Statics:** You MUST include isometric holds for tendon stiffness (e.g., "Pronation Static Hold").
           - **Partials:** You MUST include partial range reps for lock power.
           - **Full ROM:** Use for conditioning and hypertrophy.

        3. **LOGIC - Angle Specificity:** 
           - If user tested 90° Pronation, prescribe "Pronation" at 90°.
           - If user tested 45° Rise, prescribe "Rise" at 45°.
           - Use the "note" field to specify: "Statics at 90 deg", "Partials top half", etc.

        4. **PERIODIZATION (30 Days):**
           - **Week 1 (Volume):** 60-70% loads, higher reps (12-15). Focus on blood flow.
           - **Week 2 (Hypertrophy/Partials):** 75-85% loads, moderate reps (8-10). Intro heavy partials.
           - **Week 3 (Strength/Statics):** 90-100% loads, low reps (1-5) or max effort Holds.
           - **Week 4 (Deload):** 50% loads, recovery work.

        5. **RECOVERY PROTOCOL (Strict):**
           - If a day is titled "Recovery", "Active Rest", or "Mobility", you must NOT prescribe heavy compound lifts like Bench Press or Deadlifts.
           - REPLACE Bench Press with "Chest Stretch (Doorway)" (ID: rec_chest_stretch) or "Shoulder Dislocates" (ID: rec_shoulder_band).
           - REPLACE Armwrestling with "Wrist Flexor Stretch" (ID: rec_wrist_stretch) or "Light Band Work".
           - Do NOT leave recovery days empty, provide stretching protocols.

        6. **FORMAT:** Output STRICT JSON. Use existing exercise IDs where possible.

        JSON Schema:
        {
          "name": "Pro Vector Cycle",
          "level": "Elite Math-Based",
          "duration": "30 Days",
          "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
          "days": [
            {
              "day": 1,
              "week": 1,
              "title": "Day 1: Toproll Volume",
              "focus": "Endurance",
              "exercises": [
                { 
                  "name": "Pronation (Dynamic)", 
                  "sets": 4, 
                  "reps": "12", 
                  "intensity": "25kg (60%)", 
                  "exerciseId": "aw_pronation", 
                  "note": "Full ROM, control eccentric" 
                },
                { 
                  "name": "Rise (Static Hold)", 
                  "sets": 3, 
                  "reps": "15s", 
                  "intensity": "28kg (Hold)", 
                  "exerciseId": "aw_rise_static", 
                  "note": "Hold at 90 degrees failure" 
                }
              ]
            },
            {
              "day": 4, 
              "week": 1,
              "title": "Day 4: Active Recovery",
              "focus": "Mobility",
              "exercises": [
                 {
                    "name": "Chest Stretch (Doorway)",
                    "sets": 3,
                    "reps": "30s",
                    "intensity": "Stretch",
                    "exerciseId": "rec_chest_stretch"
                 }
              ]
            }
            ... (Repeat for 4 weeks)
          ]
        }
        `;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        if (response.text) {
            const plan = JSON.parse(response.text);
            return {
                ...plan,
                id: `ai_plan_${Date.now()}`,
                generatedDate: new Date().toISOString()
            };
        }
        return null;

    } catch (error) {
        console.error("Gemini Program Gen Error:", error);
        return null;
    }
};
