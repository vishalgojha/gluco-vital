import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

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
    if (!ELEVENLABS_API_KEY) {
      console.error('ELEVENLABS_API_KEY is not set');
      return Response.json({ error: 'ElevenLabs API key not configured. Please add it in Dashboard > Settings > Environment Variables.' }, { status: 500 });
    }

    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    console.log('Request body:', JSON.stringify(body));
    
    const { 
      reminder_type = 'general',
      medication_name,
      appointment_details,
      custom_message,
      language = 'english'
    } = body;

    // Get user name for personalization
    const patientName = user.full_name?.split(' ')[0] || 'there';

    // Generate contextual reminder messages
    let reminderMessage = '';
    const currentHour = new Date().getHours();
    const timeGreeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

    switch (reminder_type) {
      case 'medication':
        reminderMessage = `${timeGreeting}! This is a gentle reminder to take your ${medication_name || 'medication'}. Staying consistent helps keep your sugar levels stable.`;
        break;
      
      case 'glucose':
        const readingType = currentHour < 10 ? 'fasting' : currentHour < 14 ? 'post-lunch' : 'evening';
        reminderMessage = `${timeGreeting}! It's time for your ${readingType} glucose reading. A quick check helps you stay on track.`;
        break;
      
      case 'appointment':
        reminderMessage = `${timeGreeting}! A friendly reminder about your upcoming doctor's appointment${appointment_details ? ': ' + appointment_details : ''}. Bring your recent glucose readings!`;
        break;
      
      case 'custom':
        reminderMessage = custom_message || 'This is your health reminder from Gluco Vital.';
        break;
      
      default:
        reminderMessage = `${timeGreeting}! This is your health reminder from Gluco Vital.`;
    }

    const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Rachel voice
    const fullMessage = `Hello ${patientName}. ${reminderMessage}`;

    console.log('Calling ElevenLabs API...');
    console.log('Message length:', fullMessage.length);
    
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
          similarity_boost: 0.75
        }
      })
    });

    console.log('ElevenLabs response status:', ttsResponse.status);

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error('ElevenLabs API error:', errorText);
      return Response.json({ 
        error: 'Failed to generate voice', 
        details: errorText,
        status: ttsResponse.status 
      }, { status: 500 });
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    console.log('Audio buffer size:', audioBuffer.byteLength);
    
    if (audioBuffer.byteLength === 0) {
      return Response.json({ error: 'Empty audio returned from ElevenLabs' }, { status: 500 });
    }
    
    // Convert to base64
    const uint8Array = new Uint8Array(audioBuffer);
    const chunkSize = 8192;
    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, i + chunkSize);
      binaryString += String.fromCharCode.apply(null, chunk);
    }
    const base64Audio = btoa(binaryString);

    console.log('Voice reminder generated successfully');

    return Response.json({
      success: true,
      audio_base64: base64Audio,
      message: fullMessage,
      reminder_type
    });

  } catch (error) {
    console.error('Send voice reminder error:', error.message, error.stack);
    return Response.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
});