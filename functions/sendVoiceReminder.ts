import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");

Deno.serve(async (req) => {
  console.log('sendVoiceReminder function called');
  
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      console.log('User not authenticated');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('User authenticated:', user.email);

    if (!ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY is not set');
      return Response.json({ error: 'ElevenLabs API key not configured' }, { status: 500 });
    }

    const body = await req.json();
    console.log('Request body:', JSON.stringify(body));
    
    const { 
      user_email,
      reminder_type, // 'medication', 'glucose', 'appointment', 'custom'
      medication_name,
      appointment_details,
      custom_message,
      language = 'english'
    } = body;

    const targetEmail = user_email || user.email;

    // Fetch patient profile for personalization
    const profiles = await base44.entities.PatientProfile.filter({ user_email: targetEmail });
    const profile = profiles?.[0];
    const patientName = profile?.name || user.full_name?.split(' ')[0] || 'there';
    const preferredLanguage = profile?.language_preference || language;

    // Generate contextual reminder messages
    let reminderMessage = '';
    const currentHour = new Date().getHours();
    const timeGreeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

    switch (reminder_type) {
      case 'medication':
        reminderMessage = `${timeGreeting}! This is a gentle reminder to take your ${medication_name || 'medication'}. Remember, staying consistent with your medication helps keep your sugar levels stable.`;
        break;
      
      case 'glucose':
        const readingType = currentHour < 10 ? 'fasting' : currentHour < 14 ? 'post-lunch' : 'evening';
        reminderMessage = `${timeGreeting}! It's time for your ${readingType} glucose reading. Just a quick check to help you stay on track with your health goals.`;
        break;
      
      case 'appointment':
        reminderMessage = `${timeGreeting}! Just a friendly reminder about your upcoming doctor's appointment${appointment_details ? ': ' + appointment_details : ''}. Don't forget to bring your recent glucose readings!`;
        break;
      
      case 'custom':
        reminderMessage = custom_message || 'This is your health reminder from Gluco Vital.';
        break;
      
      default:
        reminderMessage = `${timeGreeting}! This is your health reminder from Gluco Vital. Take a moment to check in with your health today.`;
    }

    // Voice ID mapping
    const voiceMap = {
      english: 'EXAVITQu4vr4xnSDxMaL',
      hindi: 'pFZP5JQG7iQjIQuC4Bku',
      hinglish: 'pFZP5JQG7iQjIQuC4Bku',
      tamil: 'pFZP5JQG7iQjIQuC4Bku',
      telugu: 'pFZP5JQG7iQjIQuC4Bku',
      default: 'EXAVITQu4vr4xnSDxMaL'
    };

    const voiceId = voiceMap[preferredLanguage.toLowerCase()] || voiceMap.default;
    const fullMessage = `Hello ${patientName}. ${reminderMessage}`;

    // Generate voice with ElevenLabs
    const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: fullMessage,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
          use_speaker_boost: true
        }
      })
    });

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error('ElevenLabs API error:', errorText);
      return Response.json({ error: 'Failed to generate voice', details: errorText }, { status: 500 });
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    const fileName = `voice_reminder_${reminder_type}_${Date.now()}.mp3`;
    const file = new File([audioBlob], fileName, { type: 'audio/mpeg' });
    
    const uploadResult = await base44.integrations.Core.UploadFile({ file });

    // Log the voice reminder sent
    console.log(`Voice reminder sent to ${targetEmail}: ${reminder_type}`);

    // Optionally send email notification with audio link
    if (profile?.user_email) {
      try {
        await base44.integrations.Core.SendEmail({
          to: profile.user_email,
          subject: `🔔 Voice Reminder: ${reminder_type.charAt(0).toUpperCase() + reminder_type.slice(1)}`,
          body: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
              <h2 style="color: #5b9a8b;">Your Voice Reminder</h2>
              <p>${reminderMessage}</p>
              <p><a href="${uploadResult.file_url}" style="color: #5b9a8b;">🎧 Listen to your voice reminder</a></p>
              <p style="color: #666; font-size: 12px; margin-top: 20px;">— Your Gluco Vital Health Buddy</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }
    }

    return Response.json({
      success: true,
      audio_url: uploadResult.file_url,
      message: fullMessage,
      reminder_type,
      sent_to: targetEmail
    });

  } catch (error) {
    console.error('Send voice reminder error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});