import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Meta WhatsApp Webhook Handler
// Handles verification and incoming messages

Deno.serve(async (req) => {
  const url = new URL(req.url);
  
  // GET request = webhook verification from Meta
  if (req.method === 'GET') {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');
    
    const VERIFY_TOKEN = Deno.env.get('WHATSAPP_WEBHOOK_VERIFY_TOKEN');
    
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified');
      return new Response(challenge, { status: 200 });
    } else {
      console.log('Webhook verification failed');
      return new Response('Forbidden', { status: 403 });
    }
  }
  
  // POST request = incoming message or status update
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      console.log('Webhook received:', JSON.stringify(body, null, 2));
      
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      
      if (!value) {
        return Response.json({ status: 'no_value' });
      }
      
      // Handle incoming messages
      const messages = value.messages;
      if (messages && messages.length > 0) {
        const message = messages[0];
        const from = message.from; // User's WhatsApp number
        const messageBody = message.text?.body || '';
        const messageType = message.type;
        
        console.log(`Message from ${from}: ${messageBody}`);
        
        // Process the message
        await processIncomingMessage(from, messageBody, messageType);
      }
      
      // Handle status updates (delivered, read, etc.)
      const statuses = value.statuses;
      if (statuses && statuses.length > 0) {
        console.log('Status update:', statuses[0].status);
      }
      
      return Response.json({ status: 'received' });
      
    } catch (error) {
      console.error('Webhook error:', error.message);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
  
  return new Response('Method not allowed', { status: 405 });
});

async function processIncomingMessage(phoneNumber, messageBody, messageType) {
  const base44 = createServiceClient();
  
  try {
    // Find user by WhatsApp number
    const profiles = await base44.entities.PatientProfile.filter({
      whatsapp_number: phoneNumber
    });
    
    if (!profiles || profiles.length === 0) {
      // Unknown number - send opt-in instructions
      await sendWhatsAppMessage(phoneNumber, 
        "Welcome to GlucoVital! 🩺\n\nTo connect your account, please:\n1. Log in to the GlucoVital app\n2. Go to Profile > WhatsApp Settings\n3. Enter this number and verify\n\nVisit: https://glucovital.fit"
      );
      return;
    }
    
    const profile = profiles[0];
    const userEmail = profile.user_email;
    const language = profile.language_preference || 'english';
    
    // Parse the message for health data
    const lowerMessage = messageBody.toLowerCase().trim();
    
    // Check for sugar/glucose readings (e.g., "sugar 120", "glucose 145", "120 fasting")
    const sugarMatch = lowerMessage.match(/(?:sugar|glucose|शुगर|ब्लड शुगर)?\s*(\d{2,3})\s*(?:mg\/dl|fasting|after food|before food|random)?/i) ||
                       lowerMessage.match(/(\d{2,3})\s*(?:fasting|after|before|random|सुबह|खाने के बाद)?/i);
    
    if (sugarMatch) {
      const value = parseInt(sugarMatch[1]);
      if (value >= 50 && value <= 500) {
        // Determine time of day
        let timeOfDay = 'other';
        if (lowerMessage.includes('fasting') || lowerMessage.includes('सुबह')) {
          timeOfDay = 'morning_fasting';
        } else if (lowerMessage.includes('after') || lowerMessage.includes('बाद')) {
          timeOfDay = 'after_breakfast';
        } else if (lowerMessage.includes('before') || lowerMessage.includes('पहले')) {
          timeOfDay = 'before_breakfast';
        }
        
        // Log the reading
        await base44.entities.HealthLog.create({
          user_email: userEmail,
          log_type: 'sugar',
          value: `${value} mg/dL`,
          numeric_value: value,
          time_of_day: timeOfDay,
          source: 'whatsapp',
          status: 'active',
          measured_at: new Date().toISOString(),
          notes: `Logged via WhatsApp: "${messageBody}"`
        });
        
        // Send confirmation
        let response = language === 'hindi' 
          ? `✅ शुगर रीडिंग लॉग हो गई: ${value} mg/dL\n\nआपका ख्याल रखें! 💚`
          : `✅ Sugar reading logged: ${value} mg/dL\n\nTake care! 💚`;
        
        // Add warning for extreme values
        if (value < 70) {
          response += language === 'hindi'
            ? '\n\n⚠️ यह कम है। कृपया कुछ मीठा खाएं और डॉक्टर से संपर्क करें।'
            : '\n\n⚠️ This is low. Please have some glucose and contact your doctor if needed.';
        } else if (value > 300) {
          response += language === 'hindi'
            ? '\n\n⚠️ यह बहुत ज्यादा है। कृपया अपने डॉक्टर से संपर्क करें।'
            : '\n\n⚠️ This is very high. Please contact your doctor.';
        }
        
        await sendWhatsAppMessage(phoneNumber, response);
        return;
      }
    }
    
    // Check for medication confirmation
    if (lowerMessage.includes('taken') || lowerMessage.includes('done') || 
        lowerMessage.includes('ले ली') || lowerMessage.includes('हो गया') ||
        lowerMessage === 'yes' || lowerMessage === 'ok' || lowerMessage === 'हां') {
      
      // Log medication adherence
      await base44.entities.MedicationAdherence.create({
        user_email: userEmail,
        medication_name: 'Via WhatsApp confirmation',
        scheduled_time: new Date().toISOString(),
        status: 'taken',
        taken_at: new Date().toISOString(),
        confirmed_via: 'whatsapp'
      });
      
      const response = language === 'hindi'
        ? '✅ दवाई लेने की पुष्टि हो गई। बहुत अच्छे! 💪'
        : '✅ Medication confirmed. Great job! 💪';
      
      await sendWhatsAppMessage(phoneNumber, response);
      return;
    }
    
    // Default response - help message
    const helpMessage = language === 'hindi'
      ? `🩺 GlucoVital में आपका स्वागत है!\n\nआप भेज सकते हैं:\n• शुगर रीडिंग: "sugar 120" या "120 fasting"\n• दवाई की पुष्टि: "taken" या "done"\n\nमदद के लिए "help" भेजें।`
      : `🩺 Welcome to GlucoVital!\n\nYou can send:\n• Sugar readings: "sugar 120" or "120 fasting"\n• Medication confirmation: "taken" or "done"\n\nSend "help" for more options.`;
    
    await sendWhatsAppMessage(phoneNumber, helpMessage);
    
  } catch (error) {
    console.error('Process message error:', error.message);
  }
}

function createServiceClient() {
  // Create a service-level client for webhook processing
  const { Base44 } = eval("require")('npm:@base44/sdk@0.8.6');
  const client = new Base44({ appId: Deno.env.get('BASE44_APP_ID') });
  return client.asServiceRole;
}

async function sendWhatsAppMessage(to, message) {
  const ACCESS_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
  const PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');
  
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message }
      })
    }
  );
  
  const result = await response.json();
  console.log('Send message result:', result);
  return result;
}