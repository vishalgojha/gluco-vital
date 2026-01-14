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
        const imageId = message.image?.id;
        const imageCaption = message.image?.caption || '';
        
        console.log(`Message from ${from}: ${messageBody} (type: ${messageType})`);
        
        // Process the message (with image support)
        await processIncomingMessage(from, messageBody, messageType, imageId, imageCaption);
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

async function processIncomingMessage(phoneNumber, messageBody, messageType, imageId = null, imageCaption = '') {
  const base44 = createServiceClient();
  
  try {
    // Find or create user by WhatsApp number (WhatsApp-first approach)
    let profiles = await base44.entities.PatientProfile.filter({});
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    let profile = profiles.find(p => {
      const profilePhone = (p.whatsapp_number || '').replace(/\D/g, '');
      return profilePhone === cleanPhone || 
             profilePhone.endsWith(cleanPhone.slice(-10)) ||
             cleanPhone.endsWith(profilePhone.slice(-10));
    });
    
    // WhatsApp-first: Auto-create profile for new users
    if (!profile) {
      const userEmail = `wa_${cleanPhone}@whatsapp.glucovital.fit`;
      profile = await base44.entities.PatientProfile.create({
        user_email: userEmail,
        name: `WhatsApp User`,
        whatsapp_number: cleanPhone,
        whatsapp_connected: true,
        whatsapp_reminders_enabled: true,
        language_preference: 'hinglish',
        timezone: 'Asia/Kolkata'
      });
      console.log('Created new WhatsApp profile:', profile.id);
      
      await sendWhatsAppMessage(phoneNumber, 
        "🩺 Welcome to GlucoVital!\n\nYour account is set up. Start logging:\n• Sugar: \"120 fasting\" or \"sugar 150\"\n• BP: \"130/85\"\n• Prescription: Send a photo 📸\n\nLet's track your health! 💚"
      );
    }
    
    const userEmail = profile.user_email;
    const language = profile.language_preference || 'english';
    
    // Handle IMAGE messages (prescription, lab reports)
    if (messageType === 'image' && imageId) {
      console.log('Processing image message:', imageId);
      await processImageMessage(phoneNumber, userEmail, imageId, imageCaption, language, base44);
      return;
    }
    
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
  const { createClient } = require('npm:@base44/sdk@0.8.6');
  const client = createClient({
    appId: Deno.env.get('BASE44_APP_ID'),
    apiKey: Deno.env.get('BASE44_SERVICE_ROLE_KEY')
  });
  return client;
}

// Process image messages (prescriptions, lab reports)
async function processImageMessage(phoneNumber, userEmail, imageId, caption, language, base44) {
  const ACCESS_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
  
  try {
    // Step 1: Get media URL from WhatsApp
    console.log('Fetching media URL for:', imageId);
    const mediaRes = await fetch(`https://graph.facebook.com/v18.0/${imageId}`, {
      headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
    });
    const mediaData = await mediaRes.json();
    console.log('Media data:', JSON.stringify(mediaData));
    
    if (!mediaData.url) {
      await sendWhatsAppMessage(phoneNumber, '❌ Could not process image. Please try again.');
      return;
    }
    
    // Step 2: Download the image
    const imageRes = await fetch(mediaData.url, {
      headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
    });
    const imageBuffer = await imageRes.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
    const mimeType = mediaData.mime_type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64Image}`;
    
    // Step 3: Upload to Base44 storage
    const blob = new Blob([imageBuffer], { type: mimeType });
    const file = new File([blob], `prescription_${Date.now()}.jpg`, { type: mimeType });
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    console.log('Uploaded to:', file_url);
    
    // Notify user processing started
    await sendWhatsAppMessage(phoneNumber, 
      language === 'hindi' 
        ? '📸 तस्वीर मिल गई! प्रिस्क्रिप्शन पढ़ रहे हैं... कृपया रुकें।'
        : '📸 Got it! Reading your prescription... Please wait.'
    );
    
    // Step 4: Extract data using AI Vision
    const extractionResult = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze this medical prescription/document image carefully. Extract ALL information you can find.

If it's a PRESCRIPTION, extract:
- Doctor's name, clinic, phone, registration number
- Patient name (if visible)
- All medications with: name, dosage, frequency, timing, duration
- Diagnosis if mentioned
- Date of prescription
- Any special instructions

If it's a LAB REPORT, extract:
- Test names and values
- Reference ranges
- Date of test
- Lab name

Be very accurate with medication names and dosages. If something is unclear, mention it.
Respond in a structured way.`,
      file_urls: [file_url],
      response_json_schema: {
        type: "object",
        properties: {
          document_type: { type: "string", enum: ["prescription", "lab_report", "other", "unclear"] },
          doctor_name: { type: "string" },
          doctor_phone: { type: "string" },
          doctor_registration_no: { type: "string" },
          clinic_name: { type: "string" },
          clinic_address: { type: "string" },
          patient_name: { type: "string" },
          diagnosis: { type: "string" },
          prescription_date: { type: "string" },
          medications: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                dosage: { type: "string" },
                frequency: { type: "string" },
                timing: { type: "string" },
                duration: { type: "string" },
                notes: { type: "string" }
              }
            }
          },
          lab_results: {
            type: "array",
            items: {
              type: "object",
              properties: {
                test_name: { type: "string" },
                value: { type: "string" },
                unit: { type: "string" },
                reference_range: { type: "string" },
                status: { type: "string" }
              }
            }
          },
          special_instructions: { type: "string" },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
          notes: { type: "string" }
        }
      }
    });
    
    console.log('Extraction result:', JSON.stringify(extractionResult));
    
    // Step 5: Save extracted data
    if (extractionResult.document_type === 'prescription') {
      // Update patient profile with doctor & prescription info
      const updateData = {
        prescription_image_url: file_url,
        prescription_date: extractionResult.prescription_date || new Date().toISOString().split('T')[0]
      };
      
      if (extractionResult.doctor_name) updateData.doctor_name = extractionResult.doctor_name;
      if (extractionResult.doctor_phone) updateData.doctor_phone = extractionResult.doctor_phone;
      if (extractionResult.doctor_registration_no) updateData.doctor_registration_no = extractionResult.doctor_registration_no;
      if (extractionResult.clinic_name) updateData.prescription_clinic = extractionResult.clinic_name;
      if (extractionResult.clinic_address) updateData.prescription_clinic_address = extractionResult.clinic_address;
      if (extractionResult.diagnosis) updateData.prescription_diagnosis = extractionResult.diagnosis;
      if (extractionResult.medications?.length > 0) updateData.prescription_extracted_meds = extractionResult.medications;
      if (extractionResult.special_instructions) updateData.prescription_notes = extractionResult.special_instructions;
      
      // Find and update profile
      const profiles = await base44.entities.PatientProfile.filter({ user_email: userEmail });
      if (profiles.length > 0) {
        await base44.entities.PatientProfile.update(profiles[0].id, updateData);
      }
      
      // Create medication reminders
      if (extractionResult.medications?.length > 0) {
        for (const med of extractionResult.medications) {
          await base44.entities.MedicationReminder.create({
            user_email: userEmail,
            medication_name: med.name,
            dosage: med.dosage || '',
            frequency: mapFrequency(med.frequency),
            timing_type: mapTiming(med.timing),
            notes: `${med.timing || ''} ${med.notes || ''} (From prescription)`.trim(),
            is_active: true
          });
        }
      }
      
      // Send confirmation with extracted info
      let response = language === 'hindi'
        ? `✅ प्रिस्क्रिप्शन सेव हो गया!\n\n`
        : `✅ Prescription saved!\n\n`;
      
      if (extractionResult.doctor_name) {
        response += `👨‍⚕️ Dr. ${extractionResult.doctor_name}\n`;
      }
      if (extractionResult.clinic_name) {
        response += `🏥 ${extractionResult.clinic_name}\n`;
      }
      
      if (extractionResult.medications?.length > 0) {
        response += language === 'hindi' ? `\n💊 दवाइयां:\n` : `\n💊 Medications:\n`;
        extractionResult.medications.forEach((med, i) => {
          response += `${i+1}. ${med.name}`;
          if (med.dosage) response += ` - ${med.dosage}`;
          if (med.frequency) response += ` (${med.frequency})`;
          response += '\n';
        });
        response += language === 'hindi' 
          ? `\n⏰ रिमाइंडर सेट हो गए!`
          : `\n⏰ Reminders have been set!`;
      }
      
      if (extractionResult.confidence === 'low') {
        response += language === 'hindi'
          ? `\n\n⚠️ कुछ जानकारी साफ नहीं दिखी। कृपया ऐप में जाकर चेक करें।`
          : `\n\n⚠️ Some info was unclear. Please verify in the app.`;
      }
      
      await sendWhatsAppMessage(phoneNumber, response);
      
    } else if (extractionResult.document_type === 'lab_report') {
      // Save lab results
      if (extractionResult.lab_results?.length > 0) {
        for (const result of extractionResult.lab_results) {
          await base44.entities.LabResult.create({
            user_email: userEmail,
            test_type: mapTestType(result.test_name),
            test_name: result.test_name,
            value: parseFloat(result.value) || null,
            value_text: result.value,
            unit: result.unit || '',
            reference_range_text: result.reference_range || '',
            status: result.status || 'unknown',
            test_date: new Date().toISOString().split('T')[0],
            source: 'extracted'
          });
        }
      }
      
      let response = language === 'hindi'
        ? `✅ लैब रिपोर्ट सेव हो गई!\n\n📋 टेस्ट:\n`
        : `✅ Lab report saved!\n\n📋 Results:\n`;
      
      extractionResult.lab_results?.forEach((r, i) => {
        response += `${i+1}. ${r.test_name}: ${r.value} ${r.unit || ''}\n`;
      });
      
      await sendWhatsAppMessage(phoneNumber, response);
      
    } else {
      await sendWhatsAppMessage(phoneNumber, 
        language === 'hindi'
          ? `📸 तस्वीर मिली लेकिन यह प्रिस्क्रिप्शन नहीं लग रही। कृपया साफ फोटो भेजें।`
          : `📸 Got the image but couldn't identify it as a prescription. Please send a clearer photo.`
      );
    }
    
  } catch (error) {
    console.error('Image processing error:', error);
    await sendWhatsAppMessage(phoneNumber, 
      language === 'hindi'
        ? `❌ तस्वीर पढ़ने में दिक्कत हुई। कृपया दोबारा भेजें।`
        : `❌ Error reading image. Please try again.`
    );
  }
}

// Helper: Map frequency string to enum
function mapFrequency(freq) {
  if (!freq) return 'once_daily';
  const lower = freq.toLowerCase();
  if (lower.includes('twice') || lower.includes('bd') || lower.includes('2')) return 'twice_daily';
  if (lower.includes('thrice') || lower.includes('tds') || lower.includes('3')) return 'thrice_daily';
  if (lower.includes('four') || lower.includes('qid') || lower.includes('4')) return 'four_times';
  if (lower.includes('week')) return 'weekly';
  if (lower.includes('need') || lower.includes('sos')) return 'as_needed';
  return 'once_daily';
}

// Helper: Map timing to enum
function mapTiming(timing) {
  if (!timing) return 'specific_time';
  const lower = timing.toLowerCase();
  if (lower.includes('before') && lower.includes('meal')) return 'before_meal';
  if (lower.includes('after') && lower.includes('meal')) return 'after_meal';
  if (lower.includes('with') && lower.includes('meal')) return 'with_meal';
  if (lower.includes('bed') || lower.includes('night')) return 'bedtime';
  if (lower.includes('morning') || lower.includes('wake')) return 'wakeup';
  return 'specific_time';
}

// Helper: Map test name to enum
function mapTestType(testName) {
  if (!testName) return 'other';
  const lower = testName.toLowerCase();
  if (lower.includes('hba1c') || lower.includes('a1c')) return 'hba1c';
  if (lower.includes('fasting') && lower.includes('glucose')) return 'fasting_glucose';
  if (lower.includes('cholesterol')) return 'total_cholesterol';
  if (lower.includes('ldl')) return 'ldl';
  if (lower.includes('hdl')) return 'hdl';
  if (lower.includes('triglyceride')) return 'triglycerides';
  if (lower.includes('creatinine')) return 'creatinine';
  if (lower.includes('hemoglobin') && !lower.includes('a1c')) return 'hemoglobin';
  if (lower.includes('tsh')) return 'tsh';
  if (lower.includes('vitamin d')) return 'vitamin_d';
  if (lower.includes('b12')) return 'vitamin_b12';
  return 'other';
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