import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { client_email, client_name, message } = await req.json();

    if (!client_email) {
      return Response.json({ error: 'Client email is required' }, { status: 400 });
    }

    // Check if connection already exists
    const existingConnections = await base44.asServiceRole.entities.CoachConnection.filter({
      coach_email: user.email,
      client_email: client_email
    });

    if (existingConnections && existingConnections.length > 0) {
      const existing = existingConnections[0];
      if (existing.status === 'active') {
        return Response.json({ error: 'You are already connected to this client' }, { status: 400 });
      }
      if (existing.status === 'pending') {
        return Response.json({ error: 'An invitation is already pending for this client' }, { status: 400 });
      }
      // If status is revoked or expired, allow re-invite
      if (existing.status === 'revoked' || existing.status === 'expired') {
        const updated = await base44.asServiceRole.entities.CoachConnection.update(existing.id, {
          status: 'pending',
          client_name: client_name || existing.client_name,
          invited_at: new Date().toISOString()
        });
        
        // Send email for re-invite
        try {
          await sendInviteEmail(base44, user, client_email, client_name, message);
        } catch (err) {
          console.error('Email error on re-invite:', err);
        }
        
        return Response.json({ 
          success: true, 
          connection: updated,
          message: 'Re-invitation sent',
          emailSent: true
        });
      }
    }

    // Create a pending connection (coach-initiated)
    const connection = await base44.asServiceRole.entities.CoachConnection.create({
      client_email: client_email,
      client_name: client_name || client_email,
      coach_email: user.email,
      coach_name: user.full_name,
      status: 'pending',
      permissions: ['view_logs', 'view_reports', 'view_insights'],
      invited_at: new Date().toISOString()
    });

    // Send invitation email
    let emailSent = false;
    let emailError = null;
    
    try {
      await sendInviteEmail(base44, user, client_email, client_name, message);
      emailSent = true;
    } catch (err) {
      console.error('Email send error:', err);
      emailError = err.message || String(err);
    }

    return Response.json({ 
      success: true, 
      connection: connection,
      message: emailSent ? 'Invitation sent successfully' : 'Connection created but email failed',
      emailSent,
      emailError
    });
  } catch (error) {
    console.error('Invite client error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function sendInviteEmail(base44, user, client_email, client_name, message) {
  const emailBody = `
Hello${client_name ? ' ' + client_name : ''},

${user.full_name} has invited you to connect on Gluco Vital for personalized health coaching.

${message ? 'Message from your coach: ' + message + '\n\n' : ''}

To accept this invitation:
1. Sign up or log in at https://glucovital.fit
2. Go to "Share with Coach" in the menu
3. You'll see the pending invitation from ${user.full_name}
4. Click "Accept" to share your health data

Benefits of connecting:
• Your coach can view your health logs and trends
• Get personalized guidance and feedback
• Track your progress together

If you did not expect this invitation, you can safely ignore this email.

Best regards,
Gluco Vital Team
  `.trim();

  await base44.asServiceRole.integrations.Core.SendEmail({
    to: client_email,
    subject: `${user.full_name} invites you to connect on Gluco Vital`,
    body: emailBody,
    from_name: "Gluco Vital"
  });
}