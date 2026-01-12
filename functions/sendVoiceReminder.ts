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

    // Voice ID mapping - using ElevenLabs multilingual voices
    // Sarah (EXAVITQu4vr4xnSDxMaL) - natural English female voice
    // Rachel (21m00Tcm4TlvDq8ikWAM) - clear English female voice
    // For Hindi/Hinglish, the multilingual model handles it well with any voice
    const voiceMap = {
      english: '21m00Tcm4TlvDq8ikWAM', // Rachel - clear and warm
      hindi: '21m00Tcm4TlvDq8ikWAM',
      hinglish: '21m00Tcm4TlvDq8ikWAM',
      tamil: '21m00Tcm4TlvDq8ikWAM',
      telugu: '21m00Tcm4TlvDq8ikWAM',
      default: '21m00Tcm4TlvDq8ikWAM'
    };
    
    console.log('Voice map lookup for language:', preferredLanguage.toLowerCase());

    const voiceId = voiceMap[preferredLanguage.toLowerCase()] || voiceMap.default;
    const fullMessage = `Hello ${patientName}. ${reminderMessage}`;

    // Generate voice with ElevenLabs
    console.log('Calling ElevenLabs API with voice:', voiceId);
    console.log('Message:', fullMessage);
    
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

    console.log('ElevenLabs response status:', ttsResponse.status);

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error('ElevenLabs API error:', errorText);
      return Response.json({ error: 'Failed to generate voice', details: errorText }, { status: 500 });
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    console.log('Audio buffer size:', audioBuffer.byteLength);
    
    // Convert to base64 for reliable delivery
    const uint8Array = new Uint8Array(audioBuffer);
    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }
    const base64Audio = btoa(binaryString);
    
    // Try to upload, but always return base64 as fallback
    let uploadResult = null;
    try {
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const fileName = `voice_reminder_${reminder_type}_${Date.now()}.mp3`;
      const file = new File([audioBlob], fileName, { type: 'audio/mpeg' });
      
      console.log('Uploading audio file...');
      uploadResult = await base44.integrations.Core.UploadFile({ file });
      console.log('Upload result:', JSON.stringify(uploadResult));
    } catch (uploadError) {
      console.error('Upload error:', uploadError);
      // Continue with base64 fallback
    }

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
      audio_url: uploadResult?.file_url || null,
      audio_base64: base64Audio,
      message: fullMessage,
      reminder_type,
      sent_to: targetEmail
    });

  } catch (error) {
    console.error('Send voice reminder error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});