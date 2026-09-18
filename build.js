const fs = require('fs');
const path = require('path');
const { processedBlogs } = require('./blog_data');
const { buildAllLocations } = require('./build_locations');
const { buildAllServices } = require('./build_services');
const { buildAllBlogs } = require('./build_blogs');
const {
  locationsList,
  renderContactForm,
  renderLatestNewsSection,
  buildHtmlDocument
} = require('./templates');

const pages = JSON.parse(fs.readFileSync('clean_pages.json', 'utf8'));

const imageMap = {
  '/': {
    hero: 'insurance-agent-reviewing-car-coverage-with-custom-2026-01-08-07-32-47-utc.webp',
    about: 'car-insurance-concept-with-toy-car-and-umbrella-2026-01-08-08-12-26-utc.webp',
    options: 'protecting-a-toy-car-with-hands-insurance-concept-2026-01-07-02-05-26-utc.webp',
    filings: 'car-insurance-form-on-a-tablet-device-2026-01-08-07-15-09-utc.webp',
    apart: 'signing-auto-insurance-document-with-car-key-and-c-2026-01-06-09-05-16-utc.webp'
  },
  '/faq/': 'man-holding-insurance-document-in-a-corporate-sett-2026-01-09-11-36-08-utc.webp',
  '/contact-us/': 'car-insurance-form-on-a-tablet-device-2026-01-08-07-15-09-utc.webp'
};

function generateHomePage(page) {
  const html = page['Page Content (HTML)'];
  const sections = html.split(/<h2[^>]*>/i);
  const introHtml = sections[0].replace(/<h1[^>]*>.*?<\/h1>/i, '').trim();

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
  const s6 = getSec(6);
  const s7 = getSec(7);

  const locsHtml = locationsList.map(loc => `
    <a href="${loc.url}" class="location-card reveal">
      <span class="location-name">${loc.name}</span>
      <span class="location-arrow">→</span>
    </a>
  `).join('');

  const bodyContent = `
  <section class="hero-section">
    <div class="container">
      <div class="hero-grid">
        <div class="hero-content">
          <div class="hero-badge-tag">
            <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
            Official New Mexico MVD Filing Provider
          </div>
          <h1>SR-22 Insurance in Albuquerque, New Mexico</h1>
          ${introHtml}
          <div class="hero-cta-group">
            <a href="tel:+15054608649" class="btn btn-primary">Call (505) 460-8649</a>
            <a href="#quote-section" class="btn btn-outline-white">Get a Free Quote</a>
          </div>
        </div>
        <div class="hero-image-wrap">
          <img src="/assets/images/${imageMap['/'].hero}" alt="Sandia SR22 Insurance specialist assisting Albuquerque client" width="600" height="380">
        </div>
      </div>
    </div>
  </section>

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

  <section class="section">
    <div class="container">
      <div class="two-col-grid">
        <div class="content-block reveal">
          <span class="section-tag">Dedicated Focus</span>
          <h2>${s1.heading}</h2>
          ${s1.body}
        </div>
        <div class="image-frame-container reveal reveal-delay-1">
          <img src="/assets/images/${imageMap['/'].about}" alt="Albuquerque SR-22 insurance protection" width="550" height="400">
        </div>
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <div class="two-col-grid reverse">
        <div class="content-block reveal">
          <span class="section-tag">State Requirements</span>
          <h2>${s2.heading}</h2>
          ${s2.body}
        </div>
        <div class="image-frame-container reveal reveal-delay-1">
          <img src="/assets/images/${imageMap['/'].options}" alt="Protecting drivers and vehicles with SR-22 filings" width="550" height="400">
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="two-col-grid">
        <div class="content-block reveal">
          <span class="section-tag">Tailored Policies</span>
          <h2>${s3.heading}</h2>
          ${s3.body}
        </div>
        <div class="content-block reveal reveal-delay-1">
          <span class="section-tag">MVD Compliance</span>
          <h2>${s4.heading}</h2>
          ${s4.body}
        </div>
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <div class="two-col-grid">
        <div class="content-block reveal">
          <span class="section-tag">The Sandia Difference</span>
          <h2>${s7.heading}</h2>
          ${s7.body}
        </div>
        <div class="image-frame-container reveal reveal-delay-1">
          <img src="/assets/images/${imageMap['/'].apart}" alt="Signing auto insurance agreement" width="550" height="400">
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-header reveal">
        <span class="section-tag">Coverage Map</span>
        <h2 class="section-title">${s5.heading}</h2>
        ${s5.body}
      </div>
      <div class="locations-grid">
        ${locsHtml}
      </div>
    </div>
  </section>

  <!-- LATEST NEWS & BLOGS -->
  ${renderLatestNewsSection(processedBlogs)}

  <section class="cta-banner">
    <div class="container reveal">
      <h2>${s6.heading}</h2>
      ${s6.body}
      <div>
        <a href="tel:+15054608649" class="cta-phone-link">📞 (505) 460-8649</a>
      </div>
      <a href="#quote-section" class="btn btn-primary">Request a Free SR-22 Quote</a>
    </div>
  </section>

  <section class="section" id="quote-section">
    <div class="container">
      <div class="contact-grid">
        ${renderContactForm("CONTACT WITH US", "Fill out the quick quote form below or call (505) 460-8649 to speak directly with an Albuquerque specialist.")}
        <div class="contact-map-wrap reveal">
          <div class="contact-info-card">
            <h3>Sandia SR22 Insurance Albuquerque</h3>
            <ul class="contact-info-list">
              <li class="contact-info-item">
                <div class="contact-info-icon">📞</div>
                <div><strong>Phone Number:</strong><br><a href="tel:+15054608649" style="color: var(--text-dark); font-weight: 700;">(505) 460-8649</a></div>
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
          <iframe class="map-embed-container" title="Sandia SR22 Insurance Albuquerque Map" src="https://maps.google.com/maps?q=Sandia+SR22+Insurance+Albuquerque,+2400+Rio+Grande+Blvd+NW+Ste+j,+Albuquerque,+NM+87104&t=&z=16&ie=UTF8&iwloc=&output=embed" loading="lazy"></iframe>
        </div>
      </div>
    </div>
  </section>
  `;

  return buildHtmlDocument({
    title: page['SEO Title'],
    metaDesc: page['Meta Description'],
    currentUrl: '/',
    bodyContent
  });
}

function generateFaqPage(page) {
  const html = page['Page Content (HTML)'];
  const sections = html.split(/<h2[^>]*>/i);
  const introHtml = sections[0].replace(/<h1[^>]*>.*?<\/h1>/i, '').trim();

  let faqHtml = '';
  for (let i = 1; i < sections.length; i++) {
    const hEnd = sections[i].indexOf('</h2>');
    const question = sections[i].substring(0, hEnd).trim();
    const answer = sections[i].substring(hEnd + 5).trim();
    faqHtml += `
    <div class="faq-item ${i === 1 ? 'active' : ''} reveal">
      <button class="faq-question" type="button" aria-expanded="${i === 1 ? 'true' : 'false'}">
        <span>${question}</span>
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-answer">${answer}</div>
    </div>`;
  }

  const bodyContent = `
  <section class="subpage-hero">
    <div class="container">
      <h1>Frequently Asked Questions About SR-22 Insurance</h1>
      <ul class="breadcrumb-list">
        <li><a href="/">Home</a></li>
        <li>/</li>
        <li class="active">FAQ</li>
      </ul>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="two-col-grid" style="margin-bottom: 50px;">
        <div class="content-block reveal">
          <span class="section-tag">Clear Answers</span>
          <h2>Helpful Guidance for Albuquerque Drivers</h2>
          ${introHtml}
        </div>
        <div class="image-frame-container reveal reveal-delay-1">
          <img src="/assets/images/${imageMap['/faq/']}" alt="SR-22 insurance consultation" width="550" height="380">
        </div>
      </div>
      <div class="faq-container">
        ${faqHtml}
      </div>
    </div>
  </section>

  ${renderLatestNewsSection(processedBlogs)}

  <section class="section section-alt">
    <div class="container">
      <div class="contact-grid">
        ${renderContactForm("STILL HAVE QUESTIONS?", "Reach out to our Albuquerque team for immediate answers and personalized rate estimates.")}
        <div class="contact-map-wrap reveal">
          <div class="contact-info-card">
            <h3>Sandia SR22 Insurance Support</h3>
            <p>Our specialists answer questions daily about New Mexico MVD requirements, non-owner filings, and DWI license reinstatement timelines.</p>
            <ul class="contact-info-list">
              <li class="contact-info-item">
                <div class="contact-info-icon">📞</div>
                <div><strong>Phone:</strong> <a href="tel:+15054608649">(505) 460-8649</a></div>
              </li>
              <li class="contact-info-item">
                <div class="contact-info-icon">🏢</div>
                <div><strong>Office:</strong> 2400 Rio Grande Blvd NW Ste j, Albuquerque, NM 87104, United States</div>
              </li>
            </ul>
          </div>
          <iframe class="map-embed-container" title="Office Location" src="https://maps.google.com/maps?q=Sandia+SR22+Insurance+Albuquerque,+2400+Rio+Grande+Blvd+NW+Ste+j,+Albuquerque,+NM+87104&t=&z=13&ie=UTF8&iwloc=&output=embed" loading="lazy"></iframe>
        </div>
      </div>
    </div>
  </section>
  `;

  return buildHtmlDocument({
    title: page['SEO Title'],
    metaDesc: page['Meta Description'],
    currentUrl: '/faq/',
    bodyContent
  });
}

function generateContactPage(page) {
  const html = page['Page Content (HTML)'];
  const sections = html.split(/<h2[^>]*>/i);
  const introHtml = sections[0].replace(/<h1[^>]*>.*?<\/h1>/i, '').trim();

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
  const s6 = getSec(6);

  const bodyContent = `
  <section class="subpage-hero">
    <div class="container">
      <h1>CONTACT US</h1>
      <ul class="breadcrumb-list">
        <li><a href="/">Home</a></li>
        <li>/</li>
        <li class="active">Contact</li>
      </ul>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="contact-grid">
        <div>
          ${renderContactForm("CONTACT WITH US", introHtml)}
        </div>
        <div class="contact-map-wrap reveal">
          <div class="contact-info-card">
            <h3>Sandia SR22 Insurance Albuquerque</h3>
            <ul class="contact-info-list">
              <li class="contact-info-item">
                <div class="contact-info-icon">📞</div>
                <div><strong>Phone:</strong><br><a href="tel:+15054608649" style="color: var(--text-dark); font-weight: 700;">(505) 460-8649</a></div>
              </li>
              <li class="contact-info-item">
                <div class="contact-info-icon">📍</div>
                <div>
                  <strong>Albuquerque Office:</strong><br>
                  2400 Rio Grande Blvd NW Ste j,<br>Albuquerque, NM 87104, United States<br>
                  <a href="https://maps.app.goo.gl/ZAe7dAqF8GjL8nBN6" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 4px; color: var(--primary-green); font-weight: 700; margin-top: 6px; font-size: 0.88rem;">
                    🗺️ View on Google Maps ↗
                  </a>
                </div>
              </li>
              <li class="contact-info-item">
                <div class="contact-info-icon">⏱️</div>
                <div><strong>Electronic Processing:</strong><br>Same-day submission to New Mexico MVD</div>
              </li>
            </ul>
          </div>
          <iframe class="map-embed-container" title="Sandia SR22 Insurance Albuquerque Map" src="https://maps.google.com/maps?q=Sandia+SR22+Insurance+Albuquerque,+2400+Rio+Grande+Blvd+NW+Ste+j,+Albuquerque,+NM+87104&t=&z=16&ie=UTF8&iwloc=&output=embed" loading="lazy"></iframe>
        </div>
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <div class="two-col-grid">
        <div class="content-block reveal">
          <span class="section-tag">Preparation</span>
          <h2>${s1.heading}</h2>
          ${s1.body}
          <div class="highlight-box">
            <h3>${s2.heading}</h3>
            ${s2.body}
          </div>
        </div>
        <div class="image-frame-container reveal reveal-delay-1">
          <img src="/assets/images/${imageMap['/contact-us/']}" alt="Completing SR-22 insurance paperwork" width="550" height="420">
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="two-col-grid">
        <div class="content-block reveal">
          <span class="section-tag">Driver Guidance</span>
          <h2>${s4.heading}</h2>
          ${s4.body}
          <h2>${s5.heading}</h2>
          ${s5.body}
        </div>
        <div class="content-block reveal reveal-delay-1">
          <span class="section-tag">Service Territory</span>
          <h2>${s3.heading}</h2>
          ${s3.body}
          <div class="highlight-box">
            <h3>${s6.heading}</h3>
            ${s6.body}
          </div>
        </div>
      </div>
    </div>
  </section>

  ${renderLatestNewsSection(processedBlogs)}
  `;

  return buildHtmlDocument({
    title: page['SEO Title'],
    metaDesc: page['Meta Description'],
    currentUrl: '/contact-us/',
    bodyContent
  });
}

console.log('=== STARTING REBUILD WITH UPDATED CONTENT & SERVICE DESIGN ===');

// 1. Generate Home
const homePage = pages.find(p => p['Page URL'] === '/');
const homeHtml = generateHomePage(homePage);
fs.writeFileSync('index.html', homeHtml, 'utf8');
console.log('Generated index.html');

// 2. Generate FAQ & Contact
const faqPage = pages.find(p => p['Page URL'] === '/faq/');
fs.writeFileSync(path.join('faq', 'index.html'), generateFaqPage(faqPage), 'utf8');
console.log('Generated faq/index.html');

const contactPage = pages.find(p => p['Page URL'] === '/contact-us/');
fs.writeFileSync(path.join('contact-us', 'index.html'), generateContactPage(contactPage), 'utf8');
console.log('Generated contact-us/index.html');

// 3. Generate Service pages using template design (media_1789746736299.jpg)
buildAllServices(pages);

// 4. Generate Location pages with Homepage design
buildAllLocations(pages);

// 5. Generate Blog hub and all 10 blog posts
buildAllBlogs();

console.log('=== FULL REBUILD COMPLETED SUCCESSFULLY! ===');