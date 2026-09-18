const fs = require('fs');
const path = require('path');
const { processedBlogs } = require('./blog_data');
const {
  locationsList,
  renderContactForm,
  renderLatestNewsSection,
  buildHtmlDocument
} = require('./templates');

const locationImageMap = {
  '/rio-rancho-nm/': {
    hero: 'insurance-concept-of-person-protecting-blue-car-wi-2026-08-04-06-18-31-utc.webp',
    about: 'car-insurance-concept-with-toy-car-and-umbrella-2026-01-08-08-12-26-utc.webp',
    options: 'protecting-a-toy-car-with-hands-insurance-concept-2026-01-07-02-05-26-utc.webp'
  },
  '/south-valley-nm/': {
    hero: 'car-insurance-agreement-with-toy-car-and-keys-2026-01-08-07-27-34-utc.webp',
    about: 'car-insurance-coverage-with-protection-concept-2026-01-08-08-12-25-utc.webp',
    options: 'signing-auto-insurance-document-with-car-key-and-c-2026-01-06-09-05-16-utc.webp'
  },
  '/north-valley-nm/': {
    hero: 'car-insurance-and-finance-with-blue-toy-car-2026-03-17-20-04-52-utc.webp',
    about: 'car-insurance-concept-toy-car-covered-by-umbrella-2026-03-26-23-19-45-utc.webp',
    options: 'insurance-agent-reviewing-car-coverage-with-custom-2026-01-08-07-32-47-utc.webp'
  },
  '/los-ranchos-de-albuquerque-nm/': {
    hero: 'insurance-adjuster-inspecting-damage-after-car-cra-2026-01-05-05-08-40-utc.webp',
    about: 'car-insurance-form-on-a-tablet-device-2026-01-08-07-15-09-utc.webp',
    options: 'car-insurance-concept-with-toy-car-and-umbrella-2026-01-08-08-12-26-utc.webp'
  },
  '/corrales-nm/': {
    hero: 'woman-inspecting-damage-car-after-auto-accident-2026-03-27-03-00-53-utc.webp',
    about: 'car-insurance-coverage-with-protection-concept-2026-01-08-08-12-25-utc.webp',
    options: 'protecting-a-toy-car-with-hands-insurance-concept-2026-01-07-02-05-26-utc.webp'
  },
  '/bernalillo-nm/': {
    hero: 'car-insurance-concept-toy-car-covered-by-umbrella-2026-03-26-23-19-45-utc.webp',
    about: 'insurance-concept-of-person-protecting-blue-car-wi-2026-08-04-06-18-31-utc.webp',
    options: 'signing-auto-insurance-document-with-car-key-and-c-2026-01-06-09-05-16-utc.webp'
  },
  '/los-lunas-nm/': {
    hero: 'insurance-adjuster-inspecting-damage-on-wrecked-ca-2026-03-27-02-57-59-utc.webp',
    about: 'car-insurance-form-on-clipboard-pen-desk-2026-01-08-06-24-10-utc.webp',
    options: 'car-insurance-concept-with-toy-car-and-umbrella-2026-01-08-08-12-26-utc.webp'
  },
  '/belen-nm/': {
    hero: 'family-protection-and-insurance-concept-with-woode-2026-03-17-14-38-34-utc.webp',
    about: 'car-insurance-and-finance-with-blue-toy-car-2026-03-17-20-04-52-utc.webp',
    options: 'insurance-agent-reviewing-car-coverage-with-custom-2026-01-08-07-32-47-utc.webp'
  },
  '/sandia-heights-nm/': {
    hero: 'car-insurance-protection-covered-by-an-umbrella-2026-01-08-08-12-25-utc.webp',
    about: 'protecting-a-toy-car-with-hands-insurance-concept-2026-01-07-02-05-26-utc.webp',
    options: 'signing-auto-insurance-document-with-car-key-and-c-2026-01-06-09-05-16-utc.webp'
  },
  '/tijeras-nm/': {
    hero: 'car-and-motorcycle-crash-on-a-city-street-2026-03-10-04-00-40-utc.webp',
    about: 'car-insurance-agreement-with-toy-car-and-keys-2026-01-08-07-27-34-utc.webp',
    options: 'car-insurance-concept-toy-car-covered-by-umbrella-2026-03-26-23-19-45-utc.webp'
  }
};

function generateLocationPage(page) {
  const currentUrl = page['Page URL'];
  const html = page['Page Content (HTML)'];
  const sections = html.split(/<h2[^>]*>/i);
  const introHtml = sections[0].replace(/<h1[^>]*>.*?<\/h1>/i, '').trim();

  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const h1Title = h1Match ? h1Match[1] : page.Page;

  const images = locationImageMap[currentUrl] || {
    hero: 'insurance-concept-of-person-protecting-blue-car-wi-2026-08-04-06-18-31-utc.webp',
    about: 'car-insurance-concept-with-toy-car-and-umbrella-2026-01-08-08-12-26-utc.webp',
    options: 'protecting-a-toy-car-with-hands-insurance-concept-2026-01-07-02-05-26-utc.webp'
  };

  function getSec(idx) {
    if (!sections[idx]) return { heading: '', body: '' };
    const hEnd = sections[idx].indexOf('</h2>');
    return {
      heading: sections[idx].substring(0, hEnd).trim(),
      body: sections[idx].substring(hEnd + 5).trim()
    };
  }

  const s1 = getSec(1);
  const s2 = getSec(2);
  const s3 = getSec(3);
  const s4 = getSec(4);
  const s5 = getSec(5);

  // Other locations grid
  const otherLocations = locationsList.filter(l => l.url !== currentUrl);
  const otherLocationsHtml = otherLocations.map(l => `
    <a href="${l.url}" class="location-card reveal">
      <span class="location-name">${l.name}</span>
      <span class="location-arrow">→</span>
    </a>
  `).join('');

  const bodyContent = `
  <!-- HERO SECTION (HOMEPAGE DESIGN MATCH) -->
  <section class="hero-section">
    <div class="container">
      <div class="hero-grid">
        <div class="hero-content">
          <div class="hero-badge-tag">
            <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
            Official New Mexico MVD Filing Provider
          </div>
          <h1>${h1Title}</h1>
          ${introHtml}
          <div class="hero-cta-group">
            <a href="tel:+19842051805" class="btn btn-primary">Call (984) 205-1805</a>
            <a href="#quote-section" class="btn btn-outline-white">Get a Free Quote</a>
          </div>
        </div>
        <div class="hero-image-wrap">
          <img src="/assets/images/${images.hero}" alt="${h1Title}" width="600" height="380">
        </div>
      </div>
    </div>
  </section>

  <!-- FEATURES STRIP (HOMEPAGE DESIGN MATCH) -->
  <section class="features-strip">
    <div class="container">
      <div class="feature-cards-grid">
        <div class="feature-card reveal reveal-delay-1">
          <div class="feature-icon-box">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
          </div>
          <h3>Owner &amp; Non-Owner</h3>
          <p>Flexible policies tailored whether you own an automobile, ride motorcycles, or commute without a car.</p>
        </div>
        <div class="feature-card reveal reveal-delay-2">
          <div class="feature-icon-box">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          </div>
          <h3>Same-Day MVD Filing</h3>
          <p>Instant digital certificate submission directly to the New Mexico Motor Vehicle Division database.</p>
        </div>
        <div class="feature-card reveal reveal-delay-3">
          <div class="feature-icon-box">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
          </div>
          <h3>Low-Cost Rates</h3>
          <p>Specialized access to insurance carriers offering competitive rates for high-risk drivers and suspensions.</p>
        </div>
        <div class="feature-card reveal reveal-delay-4">
          <div class="feature-icon-box">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
          </div>
          <h3>State Compliance</h3>
          <p>We monitor continuous coverage terms (25/50/10) to prevent costly license revocations and delays.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 1: Why Drivers Choose Us (Two-Col with Green Border Image) -->
  <section class="section">
    <div class="container">
      <div class="two-col-grid">
        <div class="content-block reveal">
          <span class="section-tag">Dedicated Focus</span>
          <h2>${s1.heading}</h2>
          ${s1.body}
        </div>
        <div class="image-frame-container reveal reveal-delay-1">
          <img src="/assets/images/${images.about}" alt="${s1.heading}" width="550" height="400">
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 2: Owner and Non-Owner Options (Two-Col Reverse) -->
  <section class="section section-alt">
    <div class="container">
      <div class="two-col-grid reverse">
        <div class="content-block reveal">
          <span class="section-tag">Flexible Coverage</span>
          <h2>${s2.heading}</h2>
          ${s2.body}
        </div>
        <div class="image-frame-container reveal reveal-delay-1">
          <img src="/assets/images/${images.options}" alt="${s2.heading}" width="550" height="400">
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 3 & 4: Triggers & Reinstatement Roadmap -->
  <section class="section">
    <div class="container">
      <div class="two-col-grid">
        <div class="content-block reveal">
          <span class="section-tag">State Guidelines</span>
          <h2>${s3.heading}</h2>
          ${s3.body}
        </div>
        <div class="content-block reveal reveal-delay-1">
          <span class="section-tag">Step-by-Step</span>
          <h2>${s4.heading}</h2>
          ${s4.body}
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 5: Helpful Resources / Q&A -->
  <section class="section section-alt">
    <div class="container">
      <div class="content-block reveal" style="max-width: 850px; margin: 0 auto; text-align: center;">
        <span class="section-tag">Local Expertise</span>
        <h2>${s5.heading}</h2>
        ${s5.body}
      </div>
    </div>
  </section>

  <!-- SECTION 6: Metropolitan Area Locations Grid -->
  <section class="section">
    <div class="container">
      <div class="section-header reveal">
        <span class="section-tag">Coverage Area</span>
        <h2 class="section-title">Neighboring New Mexico Communities We Serve</h2>
        <p>Sandia SR22 Insurance Albuquerque provides fast, discreet electronic filing support across Bernalillo, Sandoval, and Valencia counties:</p>
      </div>
      <div class="locations-grid">
        ${otherLocationsHtml}
      </div>
    </div>
  </section>

  <!-- SECTION 7: LATEST NEWS & BLOGS (TEMPLATE MATCH) -->
  ${renderLatestNewsSection(processedBlogs)}

  <!-- SECTION 8: CALLOUT BANNER -->
  <section class="cta-banner">
    <div class="container reveal">
      <h2>Need an SR-22 in New Mexico?</h2>
      <p>Speak directly with our Albuquerque specialists for instant rate comparison and same-day electronic filing.</p>
      <div>
        <a href="tel:+19842051805" class="cta-phone-link">📞 (984) 205-1805</a>
      </div>
      <a href="#quote-section" class="btn btn-primary">Request a Free SR-22 Quote</a>
    </div>
  </section>

  <!-- SECTION 9: CONTACT / QUOTE SECTION (HOMEPAGE DESIGN MATCH) -->
  <section class="section" id="quote-section">
    <div class="container">
      <div class="contact-grid">
        ${renderContactForm("CONTACT WITH US", "Fill out the quick quote form below or call (984) 205-1805 to speak directly with an Albuquerque specialist.")}
        <div class="contact-map-wrap reveal">
          <div class="contact-info-card">
            <h3>Sandia SR22 Insurance Albuquerque</h3>
            <ul class="contact-info-list">
              <li class="contact-info-item">
                <div class="contact-info-icon">📞</div>
                <div><strong>Phone Number:</strong><br><a href="tel:+19842051805" style="color: var(--text-dark); font-weight: 700;">(984) 205-1805</a></div>
              </li>
              <li class="contact-info-item">
                <div class="contact-info-icon">🏢</div>
                <div><strong>Processing Headquarters:</strong><br>2400 Rio Grande Blvd NW Ste j, Albuquerque, NM 87104, United States</div>
              </li>
              <li class="contact-info-item">
                <div class="contact-info-icon">⏱️</div>
                <div><strong>Filing Speed:</strong><br>Same-Day Electronic Submission to New Mexico MVD</div>
              </li>
            </ul>
          </div>
          <iframe class="map-embed-container" title="Office Location Map" src="https://maps.google.com/maps?q=Sandia+SR22+Insurance+Albuquerque,+2400+Rio+Grande+Blvd+NW+Ste+j,+Albuquerque,+NM+87104&t=&z=13&ie=UTF8&iwloc=&output=embed" loading="lazy"></iframe>
        </div>
      </div>
    </div>
  </section>
  `;

  return buildHtmlDocument({
    title: page['SEO Title'],
    metaDesc: page['Meta Description'],
    currentUrl,
    bodyContent
  });
}

function buildAllLocations(pages) {
  console.log('Building Location Pages (Identical to Homepage Design)...');
  const locationPages = pages.filter(p => p.Page.includes('Location Page'));
  locationPages.forEach(p => {
    const dir = p['Page URL'].replace(/^\/+|\/+$/g, '');
    fs.mkdirSync(dir, { recursive: true });
    const html = generateLocationPage(p);
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
    console.log(`Generated location: ${path.join(dir, 'index.html')} (${html.length} bytes)`);
  });
  console.log(`All ${locationPages.length} location pages successfully generated!`);
}

module.exports = {
  buildAllLocations
};