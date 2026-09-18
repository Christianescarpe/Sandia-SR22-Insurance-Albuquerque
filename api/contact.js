// Vercel Serverless Function: POST /api/contact
// Handles quote and contact form submissions

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Only POST requests are supported.'
    });
    return;
  }

  try {
    // Parse body
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // Fallback for form-urlencoded or raw text
        body = {};
      }
    }

    const name = (body.name || body.fullName || '').trim();
    const phone = (body.phone || body.phoneNumber || '').trim();
    const email = (body.email || '').trim();
    const age = (body.age || '').trim();
    const comments = (body.comments || body.message || '').trim();

    // Basic Validation
    if (!name || !phone) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: Name and Phone Number are required.'
      });
      return;
    }

    // Optional notification webhook (e.g. Slack / Discord / Zapier) via environment variable
    const webhookUrl = process.env.WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const https = require('https');
        const urlObj = new URL(webhookUrl);
        const payload = JSON.stringify({
          text: `New SR-22 Quote Request:\n- Name: ${name}\n- Phone: ${phone}\n- Email: ${email || 'N/A'}\n- Type/Age: ${age || 'N/A'}\n- Notes: ${comments || 'N/A'}`
        });

        const postReq = https.request({
          hostname: urlObj.hostname,
          port: 443,
          path: urlObj.pathname + urlObj.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          }
        });
        postReq.on('error', (err) => console.error('Webhook notification error:', err.message));
        postReq.write(payload);
        postReq.end();
      } catch (err) {
        console.error('Webhook processing error:', err.message);
      }
    }

    // Success response
    res.status(200).json({
      success: true,
      message: 'Quote request received successfully. Our Albuquerque specialist will contact you shortly.',
      data: {
        name,
        phone,
        submittedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your request.'
    });
  }
};