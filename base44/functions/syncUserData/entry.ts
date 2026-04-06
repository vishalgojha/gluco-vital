import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { syncType } = await req.json().catch(() => ({}));

    // Get user's profile
    const profiles = await base44.entities.PatientProfile.filter({ user_email: user.email });
    const profile = profiles?.[0];

    const results = {
      synced: [],
      errors: [],
      profile_found: !!profile
    };

    // Sync health logs - update user_email if created_by matches but user_email doesn't
    if (!syncType || syncType === 'logs') {
      const allLogs = await base44.asServiceRole.entities.HealthLog.list('-created_date', 1000);
      const userLogs = allLogs.filter(log => 
        log.created_by === user.email && log.user_email !== user.email
      );

      for (const log of userLogs) {
        try {
          await base44.asServiceRole.entities.HealthLog.update(log.id, {
            user_email: user.email
          });
          results.synced.push({ type: 'log', id: log.id });
        } catch (e) {
          results.errors.push({ type: 'log', id: log.id, error: e.message });
        }
      }
    }

    // Sync medication reminders
    if (!syncType || syncType === 'medications') {
      const allReminders = await base44.asServiceRole.entities.MedicationReminder.list('-created_date', 500);
      const userReminders = allReminders.filter(r => 
        r.created_by === user.email && r.user_email !== user.email
      );

      for (const reminder of userReminders) {
        try {
          await base44.asServiceRole.entities.MedicationReminder.update(reminder.id, {
            user_email: user.email
          });
          results.synced.push({ type: 'medication_reminder', id: reminder.id });
        } catch (e) {
          results.errors.push({ type: 'medication_reminder', id: reminder.id, error: e.message });
        }
      }
    }

    // Sync medication adherence records
    if (!syncType || syncType === 'adherence') {
      const allAdherence = await base44.asServiceRole.entities.MedicationAdherence.list('-scheduled_time', 500);
      const userAdherence = allAdherence.filter(a => 
        a.created_by === user.email && a.user_email !== user.email
      );

      for (const record of userAdherence) {
        try {
          await base44.asServiceRole.entities.MedicationAdherence.update(record.id, {
            user_email: user.email
          });
          results.synced.push({ type: 'adherence', id: record.id });
        } catch (e) {
          results.errors.push({ type: 'adherence', id: record.id, error: e.message });
        }
      }
    }

    // Sync achievements
    if (!syncType || syncType === 'achievements') {
      const allAchievements = await base44.asServiceRole.entities.UserAchievements.list('-created_date', 100);
      const userAchievements = allAchievements.filter(a => 
        a.created_by === user.email && a.user_email !== user.email
      );

      for (const achievement of userAchievements) {
        try {
          await base44.asServiceRole.entities.UserAchievements.update(achievement.id, {
            user_email: user.email
          });
          results.synced.push({ type: 'achievement', id: achievement.id });
        } catch (e) {
          results.errors.push({ type: 'achievement', id: achievement.id, error: e.message });
        }
      }
    }

    // Create profile if doesn't exist
    if (!profile && (!syncType || syncType === 'profile')) {
      try {
        await base44.entities.PatientProfile.create({
          user_email: user.email,
          name: user.full_name || '',
          timezone: 'Asia/Kolkata',
          language_preference: 'english'
        });
        results.synced.push({ type: 'profile', action: 'created' });
      } catch (e) {
        results.errors.push({ type: 'profile', error: e.message });
      }
    }

    return Response.json({
      success: true,
      user_email: user.email,
      timezone: profile?.timezone || 'Asia/Kolkata',
      ...results
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});