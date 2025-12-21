import { subDays, format, addHours, setHours, setMinutes } from "date-fns";

// Generate 30 days of realistic demo data for "Mr. Gluco"
export function generateDemoData() {
  const now = new Date();
  const logs = [];
  const medications = [];
  const adherenceRecords = [];
  const labResults = [];
  const habits = [];
  
  // Demo user profile
  const profile = {
    user_email: "demo@glucovital.fit",
    name: "Mr. Gluco",
    age: 52,
    gender: "male",
    timezone: "Asia/Kolkata",
    conditions: ["type2_diabetes", "hypertension"],
    is_on_insulin: false,
    language_preference: "english",
    target_sugar_fasting: 100,
    target_sugar_post_meal: 140,
    target_bp_systolic: 130,
    target_bp_diastolic: 85,
    doctor_name: "Dr. Priya Sharma",
    doctor_specialization: "Diabetologist",
    prescription_clinic: "HealthFirst Diabetes Center",
    prescription_clinic_address: "456 MG Road, Bangalore 560001",
    whatsapp_connected: true,
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "twice_daily", timing: "after meals" },
      { name: "Glimepiride", dosage: "1mg", frequency: "once_daily", timing: "before breakfast" },
      { name: "Telmisartan", dosage: "40mg", frequency: "once_daily", timing: "morning" }
    ]
  };

  // Demo achievements
  const achievements = {
    user_email: "demo@glucovital.fit",
    total_points: 1250,
    current_streak: 12,
    longest_streak: 18,
    badges: ["first_log", "week_streak", "consistent_logger", "meal_tracker", "medication_master"],
    logs_count: 127,
    targets_hit_count: 89,
    weekly_challenge_progress: 5,
    show_on_leaderboard: true,
    display_name: "Mr. Gluco"
  };

  // Generate 30 days of health logs
  for (let daysAgo = 29; daysAgo >= 0; daysAgo--) {
    const date = subDays(now, daysAgo);
    
    // Fasting sugar (morning, 7-8 AM)
    const fastingTime = setMinutes(setHours(date, 7 + Math.floor(Math.random() * 1)), Math.floor(Math.random() * 60));
    const fastingSugar = 95 + Math.floor(Math.random() * 35) - (daysAgo > 15 ? 0 : Math.floor((15 - daysAgo) * 0.5)); // Improving trend
    logs.push({
      id: `demo-sugar-fasting-${daysAgo}`,
      user_email: "demo@glucovital.fit",
      created_by: "demo@glucovital.fit",
      log_type: "sugar",
      value: `${fastingSugar} mg/dL`,
      numeric_value: fastingSugar,
      time_of_day: "morning_fasting",
      measured_at: fastingTime.toISOString(),
      created_date: fastingTime.toISOString(),
      status: "active",
      source: daysAgo % 3 === 0 ? "whatsapp" : "manual",
      notes: fastingSugar > 110 ? "Missed evening walk yesterday" : null
    });

    // Post-breakfast sugar (10-11 AM)
    if (Math.random() > 0.2) { // 80% chance
      const postBreakfastTime = setMinutes(setHours(date, 10 + Math.floor(Math.random() * 1)), Math.floor(Math.random() * 60));
      const postBreakfastSugar = 130 + Math.floor(Math.random() * 40) - (daysAgo > 15 ? 0 : Math.floor((15 - daysAgo) * 0.8));
      logs.push({
        id: `demo-sugar-pb-${daysAgo}`,
        user_email: "demo@glucovital.fit",
        created_by: "demo@glucovital.fit",
        log_type: "sugar",
        value: `${postBreakfastSugar} mg/dL`,
        numeric_value: postBreakfastSugar,
        time_of_day: "after_breakfast",
        measured_at: postBreakfastTime.toISOString(),
        created_date: postBreakfastTime.toISOString(),
        status: "active",
        source: "whatsapp"
      });
    }

    // Post-lunch sugar (2-3 PM)
    if (Math.random() > 0.3) { // 70% chance
      const postLunchTime = setMinutes(setHours(date, 14 + Math.floor(Math.random() * 1)), Math.floor(Math.random() * 60));
      const postLunchSugar = 140 + Math.floor(Math.random() * 45) - (daysAgo > 15 ? 0 : Math.floor((15 - daysAgo) * 0.7));
      logs.push({
        id: `demo-sugar-pl-${daysAgo}`,
        user_email: "demo@glucovital.fit",
        created_by: "demo@glucovital.fit",
        log_type: "sugar",
        value: `${postLunchSugar} mg/dL`,
        numeric_value: postLunchSugar,
        time_of_day: "after_lunch",
        measured_at: postLunchTime.toISOString(),
        created_date: postLunchTime.toISOString(),
        status: "active",
        source: "manual"
      });
    }

    // Post-dinner sugar (9-10 PM)
    if (Math.random() > 0.25) { // 75% chance
      const postDinnerTime = setMinutes(setHours(date, 21 + Math.floor(Math.random() * 1)), Math.floor(Math.random() * 60));
      const postDinnerSugar = 145 + Math.floor(Math.random() * 50) - (daysAgo > 15 ? 0 : Math.floor((15 - daysAgo) * 0.6));
      logs.push({
        id: `demo-sugar-pd-${daysAgo}`,
        user_email: "demo@glucovital.fit",
        created_by: "demo@glucovital.fit",
        log_type: "sugar",
        value: `${postDinnerSugar} mg/dL`,
        numeric_value: postDinnerSugar,
        time_of_day: "after_dinner",
        measured_at: postDinnerTime.toISOString(),
        created_date: postDinnerTime.toISOString(),
        status: "active",
        source: "whatsapp",
        notes: postDinnerSugar > 170 ? "Had sweets at dinner party" : null
      });
    }

    // Blood Pressure (once daily, morning)
    if (Math.random() > 0.4) { // 60% chance
      const bpTime = setMinutes(setHours(date, 8), Math.floor(Math.random() * 30));
      const systolic = 125 + Math.floor(Math.random() * 20) - (daysAgo > 15 ? 0 : Math.floor((15 - daysAgo) * 0.3));
      const diastolic = 80 + Math.floor(Math.random() * 10);
      logs.push({
        id: `demo-bp-${daysAgo}`,
        user_email: "demo@glucovital.fit",
        created_by: "demo@glucovital.fit",
        log_type: "blood_pressure",
        value: `${systolic}/${diastolic} mmHg`,
        time_of_day: "morning_fasting",
        measured_at: bpTime.toISOString(),
        created_date: bpTime.toISOString(),
        status: "active",
        source: "manual"
      });
    }

    // Meals (2-3 per day)
    const meals = [
      { time: 8, name: "breakfast", foods: ["Idli sambar", "Upma with vegetables", "Poha", "Dosa with chutney", "Oats porridge"] },
      { time: 13, name: "lunch", foods: ["Rice, dal, sabzi", "Roti, chicken curry", "Curd rice", "Biryani (small portion)", "Khichdi"] },
      { time: 20, name: "dinner", foods: ["Chapati, dal, salad", "Vegetable soup", "Grilled fish, rice", "Mixed veg curry, roti", "Paneer tikka, salad"] }
    ];

    meals.forEach((meal, idx) => {
      if (Math.random() > 0.3) {
        const mealTime = setMinutes(setHours(date, meal.time + Math.floor(Math.random() * 1)), Math.floor(Math.random() * 45));
        const food = meal.foods[Math.floor(Math.random() * meal.foods.length)];
        logs.push({
          id: `demo-meal-${daysAgo}-${idx}`,
          user_email: "demo@glucovital.fit",
          created_by: "demo@glucovital.fit",
          log_type: "meal",
          value: food,
          time_of_day: meal.name === "breakfast" ? "after_breakfast" : meal.name === "lunch" ? "after_lunch" : "after_dinner",
          measured_at: mealTime.toISOString(),
          created_date: mealTime.toISOString(),
          status: "active",
          source: "whatsapp",
          notes: `${meal.name.charAt(0).toUpperCase() + meal.name.slice(1)}`
        });
      }
    });

    // Medication logs (2-3 per day)
    if (Math.random() > 0.15) { // 85% adherence
      const medTime = setMinutes(setHours(date, 8), 30);
      logs.push({
        id: `demo-med-morning-${daysAgo}`,
        user_email: "demo@glucovital.fit",
        created_by: "demo@glucovital.fit",
        log_type: "medication",
        value: "Metformin 500mg, Glimepiride 1mg",
        time_of_day: "after_breakfast",
        measured_at: medTime.toISOString(),
        created_date: medTime.toISOString(),
        status: "active",
        source: "whatsapp"
      });

      adherenceRecords.push({
        id: `demo-adh-morning-${daysAgo}`,
        user_email: "demo@glucovital.fit",
        medication_name: "Metformin 500mg",
        scheduled_time: medTime.toISOString(),
        status: "taken",
        taken_at: medTime.toISOString(),
        confirmed_via: "whatsapp"
      });
    }

    if (Math.random() > 0.2) { // 80% evening adherence
      const eveningMedTime = setMinutes(setHours(date, 20), 30);
      logs.push({
        id: `demo-med-evening-${daysAgo}`,
        user_email: "demo@glucovital.fit",
        created_by: "demo@glucovital.fit",
        log_type: "medication",
        value: "Metformin 500mg, Telmisartan 40mg",
        time_of_day: "after_dinner",
        measured_at: eveningMedTime.toISOString(),
        created_date: eveningMedTime.toISOString(),
        status: "active",
        source: "manual"
      });
    }

    // Exercise (3-4 times a week)
    if (daysAgo % 2 === 0 && Math.random() > 0.3) {
      const exerciseTime = setMinutes(setHours(date, 6 + Math.floor(Math.random() * 2)), Math.floor(Math.random() * 30));
      const exercises = ["30 min morning walk", "20 min yoga", "45 min walk in park", "15 min stretching", "30 min cycling"];
      logs.push({
        id: `demo-exercise-${daysAgo}`,
        user_email: "demo@glucovital.fit",
        created_by: "demo@glucovital.fit",
        log_type: "exercise",
        value: exercises[Math.floor(Math.random() * exercises.length)],
        measured_at: exerciseTime.toISOString(),
        created_date: exerciseTime.toISOString(),
        status: "active",
        source: "whatsapp"
      });
    }

    // Occasional symptoms
    if (Math.random() > 0.9) {
      const symptomTime = setMinutes(setHours(date, 15), Math.floor(Math.random() * 60));
      const symptoms = ["Mild headache", "Feeling tired", "Slightly dizzy", "Thirsty"];
      logs.push({
        id: `demo-symptom-${daysAgo}`,
        user_email: "demo@glucovital.fit",
        created_by: "demo@glucovital.fit",
        log_type: "symptom",
        value: symptoms[Math.floor(Math.random() * symptoms.length)],
        measured_at: symptomTime.toISOString(),
        created_date: symptomTime.toISOString(),
        status: "active",
        source: "whatsapp",
        notes: "After skipping lunch"
      });
    }
  }

  // Lab results (HbA1c every 3 months)
  labResults.push(
    {
      id: "demo-lab-1",
      user_email: "demo@glucovital.fit",
      test_type: "hba1c",
      test_name: "HbA1c",
      value: 7.8,
      unit: "%",
      reference_range_low: 4,
      reference_range_high: 5.6,
      status: "high",
      test_date: format(subDays(now, 90), "yyyy-MM-dd"),
      lab_name: "Apollo Diagnostics",
      verified: true
    },
    {
      id: "demo-lab-2",
      user_email: "demo@glucovital.fit",
      test_type: "hba1c",
      test_name: "HbA1c",
      value: 7.2,
      unit: "%",
      reference_range_low: 4,
      reference_range_high: 5.6,
      status: "high",
      test_date: format(subDays(now, 7), "yyyy-MM-dd"),
      lab_name: "Apollo Diagnostics",
      verified: true,
      ai_insight: "Your HbA1c has improved by 0.6% in 3 months. Keep up the good work!"
    },
    {
      id: "demo-lab-3",
      user_email: "demo@glucovital.fit",
      test_type: "fasting_glucose",
      test_name: "Fasting Glucose",
      value: 118,
      unit: "mg/dL",
      reference_range_low: 70,
      reference_range_high: 100,
      status: "high",
      test_date: format(subDays(now, 7), "yyyy-MM-dd"),
      lab_name: "Apollo Diagnostics",
      verified: true
    }
  );

  // Medication reminders
  medications.push(
    {
      id: "demo-reminder-1",
      user_email: "demo@glucovital.fit",
      medication_name: "Metformin",
      dosage: "500mg",
      timing_type: "after_meal",
      frequency: "twice_daily",
      specific_times: ["08:30", "20:30"],
      is_active: true,
      pills_remaining: 45,
      refill_threshold: 7
    },
    {
      id: "demo-reminder-2",
      user_email: "demo@glucovital.fit",
      medication_name: "Glimepiride",
      dosage: "1mg",
      timing_type: "before_meal",
      frequency: "once_daily",
      specific_times: ["07:30"],
      is_active: true,
      pills_remaining: 22
    },
    {
      id: "demo-reminder-3",
      user_email: "demo@glucovital.fit",
      medication_name: "Telmisartan",
      dosage: "40mg",
      timing_type: "specific_time",
      frequency: "once_daily",
      specific_times: ["08:00"],
      is_active: true,
      pills_remaining: 18
    }
  );

  // Sort logs by date descending
  logs.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

  return {
    profile,
    achievements,
    logs,
    medications,
    adherenceRecords,
    labResults,
    user: {
      email: "demo@glucovital.fit",
      full_name: "Mr. Gluco",
      role: "user"
    }
  };
}

export const DEMO_USER_EMAIL = "demo@glucovital.fit";