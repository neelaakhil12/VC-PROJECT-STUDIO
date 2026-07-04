const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  // Set CORS headers for local development if accessed from other ports
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://clzpvsmvzbgaiggcmcyf.supabase.co';
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseAnonKey) {
      return res.status(500).json({ error: 'Database key is not configured in the environment.' });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Query if email exists in admin_credentials custom table
    const { data: user, error: findError } = await supabase
      .from('admin_credentials')
      .select('id')
      .eq('email', email.trim())
      .single();

    if (findError || !user) {
      return res.status(404).json({ error: 'Email address not found in system.' });
    }

    // Generate secure recovery token (6-digits) and 15 minute expiry
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // Save token to database
    const { error: updateError } = await supabase
      .from('admin_credentials')
      .update({
        reset_token: token,
        token_expiry: expiry
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // SMTP credentials from env
    const host = process.env.VITE_SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.VITE_SMTP_PORT || '587', 10);
    const userMail = process.env.VITE_SMTP_USER || 'vcprojectstudio@gmail.com';
    const pass = process.env.VITE_SMTP_PASSWORD || 'lvenefwlnrkqvktu';
    const from = process.env.VITE_SMTP_FROM || `"VC Project Studio" <${userMail}>`;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user: userMail,
        pass: pass
      }
    });

    // Resolve redirection URL back to local/live admin dashboard
    const origin = req.headers.origin || `http://${req.headers.host}`;
    const resetLink = `${origin}/admin?reset_token=${token}&email=${encodeURIComponent(email.trim())}`;

    await transporter.sendMail({
      from,
      to: email.trim(),
      subject: 'VC Project Studio Admin - Password Reset Link',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 8px; color: #333;">
          <h2 style="color: #d4af37; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-top: 0;">VC Project Studio</h2>
          <p style="font-size: 14px; line-height: 1.5;">Hello,</p>
          <p style="font-size: 14px; line-height: 1.5;">We received a request to reset the administrator password for the VC Project Studio CMS Control Room.</p>
          <p style="font-size: 14px; line-height: 1.5; margin-top: 20px;">Please click the secure button below to choose a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 12px 30px; color: #000; background: linear-gradient(135deg, #d4af37, #f3e5ab); border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(212,175,55,0.25);">Reset Password</a>
          </div>
          <p style="font-size: 12px; color: #64748b; line-height: 1.5;">If the button above does not work, copy and paste this link into your web browser:</p>
          <p style="font-size: 11px; word-break: break-all; color: #0284c7; background-color: #f8fafc; padding: 10px; border-radius: 4px; border: 1px solid #cbd5e1; margin: 10px 0;">${resetLink}</p>
          <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-top: 25px;">This verification link is valid for 15 minutes. If you did not make this request, you can safely ignore this email.</p>
        </div>
      `
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('SMTP Mailer Server Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
