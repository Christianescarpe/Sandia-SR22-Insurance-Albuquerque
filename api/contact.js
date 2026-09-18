function sendJson(res, statusCode, data) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(data);
  }
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

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
    if (typeof res.status === 'function') {
      res.status(200).end();
    } else {
      res.writeHead(200);
      res.end();
    }
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return sendJson(res, 405, {
      success: false,
      error: 'Method Not Allowed. Only POST requests are supported.'
    });
  }

  try {
    // Parse body
    let body = req.body;
    if (!body && typeof req[Symbol.asyncIterator] === 'function') {
      let raw = '';
      for await (const chunk of req) {
        raw += chunk;
      }
      try {
        body = JSON.parse(raw);
      } catch (e) {
        body = {};
      }
    } else if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    } else if (!body) {
      body = {};
    }

    const name = (body.name || body.fullName || '').trim();
    const phone = (body.phone || body.phoneNumber || '').trim();
    const email = (body.email || '').trim();
    const age = (body.age || '').trim();
    const comments = (body.comments || body.message || '').trim();

    // Basic Validation
    if (!name || !phone) {
      return sendJson(res, 400, {
        success: false,
        error: 'Missing required fields: Name and Phone Number are required.'
      });
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
    return sendJson(res, 200, {
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
    return sendJson(res, 500, {
      success: false,
      error: 'An internal server error occurred while processing your request.'
    });
  }
};