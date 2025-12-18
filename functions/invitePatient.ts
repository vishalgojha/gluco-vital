import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { patient_email, patient_name, message } = await req.json();

    if (!patient_email) {
      return Response.json({ error: 'Patient email is required' }, { status: 400 });
    }

    // Check if connection already exists
    const existingConnections = await base44.asServiceRole.entities.DoctorConnection.filter({
      doctor_email: user.email,
      patient_email: patient_email
    });

    if (existingConnections && existingConnections.length > 0) {
      const existing = existingConnections[0];
      if (existing.status === 'active') {
        return Response.json({ error: 'Already connected to this patient' }, { status: 400 });
      }
      if (existing.status === 'pending') {
        return Response.json({ error: 'Invitation already pending' }, { status: 400 });
      }
    }

    // Create a pending connection (doctor-initiated)
    const connection = await base44.asServiceRole.entities.DoctorConnection.create({
      patient_email: patient_email,
      patient_name: patient_name || patient_email,
      doctor_email: user.email,
      doctor_name: user.full_name,
      status: 'pending',
      permissions: ['view_logs', 'view_reports', 'view_insights'],
      invited_at: new Date().toISOString()
    });

    // Send invitation email
    const emailBody = `
Hello${patient_name ? ' ' + patient_name : ''},

Dr. ${user.full_name} has invited you to connect on Gluco Vital for better diabetes care management.

${message ? 'Message from your doctor: ' + message + '\n\n' : ''}

To accept this invitation:
1. Sign up or log in at https://glucovital.fit
2. Go to "Share with Doctor" in the menu
3. You'll see the pending invitation from Dr. ${user.full_name}
4. Click "Accept" to share your health data

Benefits of connecting:
• Your doctor can view your health logs and trends
• Get personalized feedback directly in the app
• Better coordinated care

If you did not expect this invitation, you can safely ignore this email.

Best regards,
Gluco Vital Team
    `.trim();

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: patient_email,
      subject: `Dr. ${user.full_name} invites you to connect on Gluco Vital`,
      body: emailBody,
      from_name: "Gluco Vital"
    });

    return Response.json({ 
      success: true, 
      connection: connection,
      message: 'Invitation sent successfully' 
    });
  } catch (error) {
    console.error('Invite patient error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});