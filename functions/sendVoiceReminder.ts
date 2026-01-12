import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { encode as base64Encode } from "https://deno.land/std@0.208.0/encoding/base64.ts";

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

    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    console.log('API Key exists:', !!ELEVENLABS_API_KEY);
    console.log('API Key length:', ELEVENLABS_API_KEY?.length || 0);
    
    if (!ELEVENLABS_API_KEY) {
      return Response.json({ error: 'ElevenLabs API key not configured' }, { status: 500 });
    }

    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      console.log('No body or invalid JSON, using defaults');
    }
    
    const { 
      reminder_type = 'general',
      medication_name = 'medication'
    } = body;

    const patientName = user.full_name?.split(' ')[0] || 'friend';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    let message = `${greeting} ${patientName}! `;
    if (reminder_type === 'medication') {
      message += `Time to take your ${medication_name}.`;
    } else if (reminder_type === 'glucose') {
      message += `Time for your glucose check.`;
    } else if (reminder_type === 'appointment') {
      message += `Don't forget your doctor appointment.`;
    } else {
      message += `This is your health reminder.`;
    }

    console.log('Message:', message);
    
    const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: message,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    console.log('ElevenLabs status:', ttsResponse.status);

    if (!ttsResponse.ok) {
      const errText = await ttsResponse.text();
      console.error('ElevenLabs error:', errText);
      return Response.json({ error: 'ElevenLabs failed', details: errText }, { status: 500 });
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    console.log('Audio size:', audioBuffer.byteLength);
    
    const base64Audio = base64Encode(new Uint8Array(audioBuffer));
    console.log('Base64 length:', base64Audio.length);

    return Response.json({
      success: true,
      audio_base64: base64Audio,
      message: message
    });

  } catch (error) {
    console.error('Error:', error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
});