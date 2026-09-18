const fs = require('fs');
const path = require('path');
const { processedBlogs } = require('./blog_data');
const {
  renderContactForm,
  renderLatestNewsSection,
  buildHtmlDocument
} = require('./templates');

const serviceImageMap = {
  '/what-is-sr22/': {
    hero: 'signing-auto-insurance-document-with-car-key-and-c-2026-01-06-09-05-16-utc.webp',
    overview: 'car-insurance-concept-with-toy-car-and-umbrella-2026-01-08-08-12-26-utc.webp',
    details: 'protecting-a-toy-car-with-hands-insurance-concept-2026-01-07-02-05-26-utc.webp'
  },
  '/how-to-get-an-sr22-in-albuquerque/': {
    hero: 'car-insurance-form-on-clipboard-pen-desk-2026-01-08-06-24-10-utc.webp',
    overview: 'insurance-agent-reviewing-car-coverage-with-custom-2026-01-08-07-32-47-utc.webp',
    details: 'car-insurance-form-on-a-tablet-device-2026-01-08-07-15-09-utc.webp'
  },
  '/non-owners-sr22-insurance/': {
    hero: 'car-insurance-coverage-with-protection-concept-2026-01-08-08-12-25-utc.webp',
    overview: 'car-insurance-and-finance-with-blue-toy-car-2026-03-17-20-04-52-utc.webp',
    details: 'car-insurance-agreement-with-toy-car-and-keys-2026-01-08-07-27-34-utc.webp'
  }
};

function generateServicePage(page) {
  const currentUrl = page['Page URL'];
  const html = page['Page Content (HTML)'];
  const sections = html.split(/<h2[^>]*>/i);
  const introHtml = sections[0].replace(/<h1[^>]*>.*?<\/h1>/i, '').trim();

  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const h1Title = h1Match ? h1Match[1] : page.Page;

  const images = serviceImageMap[currentUrl] || {
    hero: 'signing-auto-insurance-document-with-car-key-and-c-2026-01-06-09-05-16-utc.webp',
    overview: 'car-insurance-concept-with-toy-car-and-umbrella-2026-01-08-08-12-26-utc.webp',
    details: 'protecting-a-toy-car-with-hands-insurance-concept-2026-01-07-02-05-26-utc.webp'
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

  // Remaining sections
  let additionalSectionsHtml = '';
  const isHowTo = currentUrl.includes('how-to-get');

  if (isHowTo) {
    let stepsCards = '';
    let otherContent = '';

    for (let i = 1; i < sections.length; i++) {
      const hEnd = sections[i].indexOf('</h2>');
      const heading = sections[i].substring(0, hEnd).trim();
      const body = sections[i].substring(hEnd + 5).trim();

      if (heading.toLowerCase().startsWith('step')) {
        const stepNum = heading.split(':')[0].replace(/[^0-9]/g, '');
        const stepTitle = heading.includes(':') ? heading.split(':')[1].trim() : heading;
        stepsCards += `
        <div class="step-card reveal">
          <div class="step-badge">${stepNum || i}</div>
          <h3>${stepTitle}</h3>
          ${body}
        </div>`;
      } else {
        otherContent += `
        <div class="content-block reveal" style="margin-top: 35px;">
          <h2>${heading}</h2>
          ${body}
        </div>`;
      }
    }

    additionalSectionsHtml = `
    <section class="section section-alt">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-tag">Step-by-Step Walkthrough</span>
          <h2 class="section-title">Reinstatement Filing Roadmap</h2>
        </div>
        <div class="steps-grid">
          ${stepsCards}
        </div>
        <div class="two-col-grid" style="margin-top: 50px;">
          <div>${otherContent}</div>
          <div class="image-frame-container reveal">
            <img src="/assets/images/${images.details}" alt="${h1Title}" width="550" height="400">
          </div>
        </div>
      </div>
    </section>`;
  } else {
    // Normal content cards for other service pages
    let cardsContent = '';
    for (let i = 3; i < sections.length; i++) {
      const hEnd = sections[i].indexOf('</h2>');
      const heading = sections[i].substring(0, hEnd).trim();
      const body = sections[i].substring(hEnd + 5).trim();

      cardsContent += `
      <div class="content-block reveal" style="margin-bottom: 35px;">
        <h2>${heading}</h2>
        ${body}
      </div>`;
    }

    additionalSectionsHtml = `
    <section class="section section-alt">
      <div class="container">
        <div class="two-col-grid">
          <div class="content-block reveal">
            <span class="section-tag">Regulations &amp; Rules</span>
            <h2>${s2.heading}</h2>
            ${s2.body}
          </div>
          <div class="image-frame-container reveal reveal-delay-1">
            <img src="/assets/images/${images.details}" alt="${s2.heading}" width="550" height="400">
          </div>
        </div>
        <div style="margin-top: 40px;">
          ${cardsContent}
        </div>
      </div>
    </section>`;
  }

  const bodyContent = `
  <!-- SERVICE HERO (MATCHING media_1789746736299.jpg) -->
  <section class="hero-section">
    <div class="container">
      <div class="hero-centered">
        <div class="hero-emblem reveal">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
        </div>
        <h1 class="reveal">${h1Title}</h1>
        <div class="reveal" style="font-size: 1.1rem; color: #d1d5db; line-height: 1.7; margin-bottom: 24px;">
          ${introHtml}
        </div>
        <div class="hero-cta-group reveal" style="justify-content: center;">
          <a href="tel:+15054608649" class="btn btn-primary">Call (505) 460-8649</a>
          <a href="#quote-section" class="btn btn-outline-white">Get a Free Quote</a>
        </div>

        <!-- 4-ICON CIRCLE ROW (TEMPLATE MATCH) -->
        <div class="hero-icon-strip reveal">
          <div class="hero-icon-circle" title="Protection">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
          </div>
          <div class="hero-icon-circle" title="Auto Insurance">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
          </div>
          <div class="hero-icon-circle" title="Electronic Filing">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          </div>
          <div class="hero-icon-circle" title="State MVD Compliance">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 4-CARD FEATURE STRIP (TEMPLATE MATCH) -->
  <section class="features-strip">
    <div class="container">
      <div class="feature-cards-grid">
        <div class="feature-card reveal reveal-delay-1">
          <div class="feature-icon-box" style="color: #e91e63; background-color: #fce4ec;">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          <h3>Certificate Filing</h3>
          <p>Official verification of financial responsibility submitted directly to the New Mexico MVD.</p>
        </div>
        <div class="feature-card reveal reveal-delay-2">
          <div class="feature-icon-box" style="color: #ff9800; background-color: #fff3e0;">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          </div>
          <h3>Owner &amp; Non-Owner</h3>
          <p>Policies tailored whether you own your vehicle or need a low-cost driver-only certificate.</p>
        </div>
        <div class="feature-card reveal reveal-delay-3">
          <div class="feature-icon-box" style="color: #f44336; background-color: #ffebee;">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
          </div>
          <h3>MVD Minimums</h3>
          <p>Full statutory compliance satisfying New Mexico's mandatory 25/50/10 liability thresholds.</p>
        </div>
        <div class="feature-card reveal reveal-delay-4">
          <div class="feature-icon-box" style="color: #2196f3; background-color: #e3f2fd;">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
          </div>
          <h3>Same-Day Reinstatement</h3>
          <p>Rapid electronic submission allowing immediate license recovery without state office delays.</p>
        </div>
      </div>
      <div style="text-align: center; margin-top: 30px;" class="reveal">
        <a href="#overview-section" class="btn btn-primary btn-sm">OUR SERVICES &amp; DETAILS</a>
      </div>
    </div>
  </section>

  <!-- ABOUT / SERVICE OVERVIEW (MATCHING "ABOUT US" IN media_1789746736299.jpg) -->
  <section class="section" id="overview-section">
    <div class="container">
      <div class="two-col-grid">
        <div class="content-block reveal">
          <span class="section-tag">Dedicated Focus</span>
          <h2>${s1.heading}</h2>
          ${s1.body}
          <div style="margin-top: 24px;">
            <a href="tel:+15054608649" class="btn btn-primary">Call (505) 460-8649</a>
          </div>
        </div>
        <div class="image-frame-container reveal reveal-delay-1">
          <img src="/assets/images/${images.overview}" alt="${s1.heading}" width="550" height="400">
        </div>
      </div>
    </div>
  </section>

  <!-- ADDITIONAL STRUCTURED SECTIONS -->
  ${additionalSectionsHtml}

  <!-- LATEST NEWS / BLOGS (TEMPLATE MATCH) -->
  ${renderLatestNewsSection(processedBlogs)}

  <!-- CALLOUT BANNER -->
  <section class="cta-banner">
    <div class="container reveal">
      <h2>Need Help with Your SR-22 in New Mexico?</h2>
      <p>Speak directly with our Albuquerque specialists for instant rate comparison and same-day electronic filing.</p>
      <a href="tel:+15054608649" class="cta-phone-link">📞 (505) 460-8649</a><br><br>
      <a href="/contact-us/" class="btn btn-primary">Contact Our Specialists</a>
    </div>
  </section>

  <!-- CONTACT / QUOTE SECTION (TEMPLATE MATCH) -->
  <section class="section section-alt" id="quote-section">
    <div class="container">
      <div class="contact-grid">
        ${renderContactForm("REQUEST AN SR-22 QUOTE", "Submit your details below to get a prompt, affordable quote for your New Mexico filing requirement.")}
        <div class="contact-map-wrap reveal">
          <div class="contact-info-card">
            <h3>Sandia SR22 Insurance Albuquerque</h3>
            <ul class="contact-info-list">
              <li class="contact-info-item">
                <div class="contact-info-icon">📞</div>
                <div><strong>Phone:</strong> <a href="tel:+15054608649">(505) 460-8649</a></div>
              </li>
              <li class="contact-info-item">
                <div class="contact-info-icon">🏢</div>
                <div><strong>Headquarters:</strong> 2400 Rio Grande Blvd NW Ste j, Albuquerque, NM 87104, United States</div>
              </li>
              <li class="contact-info-item">
                <div class="contact-info-icon">⚡</div>
                <div><strong>Processing:</strong> Instant electronic filing to New Mexico MVD</div>
              </li>
            </ul>
          </div>
          <iframe class="map-embed-container" title="Sandia SR22 Processing Center" src="https://maps.google.com/maps?q=Sandia+SR22+Insurance+Albuquerque,+2400+Rio+Grande+Blvd+NW+Ste+j,+Albuquerque,+NM+87104&t=&z=13&ie=UTF8&iwloc=&output=embed" loading="lazy"></iframe>
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

function buildAllServices(pages) {
  console.log('Building Service Pages (Matching media_1789746736299.jpg template)...');
  const serviceUrls = ['/what-is-sr22/', '/how-to-get-an-sr22-in-albuquerque/', '/non-owners-sr22-insurance/'];
  const servicePages = pages.filter(p => serviceUrls.includes(p['Page URL']));

  servicePages.forEach(p => {
    const dir = p['Page URL'].replace(/^\/+|\/+$/g, '');
    fs.mkdirSync(dir, { recursive: true });
    const html = generateServicePage(p);
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
    console.log(`Generated service page: ${path.join(dir, 'index.html')} (${html.length} bytes)`);
  });
  console.log('All service pages successfully generated!');
}

module.exports = {
  buildAllServices
};