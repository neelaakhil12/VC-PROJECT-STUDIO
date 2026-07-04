const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  // Allow GET for cron triggers, OPTIONS for CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({ ok: false, error: 'Missing Supabase env vars' });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Lightweight ping: fetch 1 row from admin_credentials (no data exposed)
    const { error } = await supabase
      .from('admin_credentials')
      .select('id')
      .limit(1);

    if (error) throw error;

    const now = new Date().toISOString();
    console.log(`[keep-alive] Supabase pinged at ${now}`);

    return res.status(200).json({
      ok: true,
      pinged_at: now,
      message: 'Supabase keep-alive ping successful'
    });

  } catch (error) {
    console.error('[keep-alive] Ping failed:', error);
    return res.status(500).json({ ok: false, error: error.message });
  }
};
