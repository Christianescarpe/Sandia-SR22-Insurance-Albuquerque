const locationsList = [
  { name: 'Rio Rancho, NM', url: '/rio-rancho-nm/' },
  { name: 'South Valley, NM', url: '/south-valley-nm/' },
  { name: 'North Valley, NM', url: '/north-valley-nm/' },
  { name: 'Los Ranchos de Albuquerque, NM', url: '/los-ranchos-de-albuquerque-nm/' },
  { name: 'Corrales, NM', url: '/corrales-nm/' },
  { name: 'Bernalillo, NM', url: '/bernalillo-nm/' },
  { name: 'Los Lunas, NM', url: '/los-lunas-nm/' },
  { name: 'Belen, NM', url: '/belen-nm/' },
  { name: 'Sandia Heights, NM', url: '/sandia-heights-nm/' },
  { name: 'Tijeras, NM', url: '/tijeras-nm/' }
];

function getShieldSvg() {
  return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4L6 11V22C6 33.1 13.7 43.4 24 46C34.3 43.4 42 33.1 42 22V11L24 4Z" fill="#78b82e"/>
    <path d="M24 4V46C34.3 43.4 42 33.1 42 22V11L24 4Z" fill="#68a324"/>
    <path d="M24 10L12 15V22C12 30.2 17.1 37.8 24 40V10Z" fill="#ffffff" fill-opacity="0.25"/>
    <path d="M21 24L17 20L14 23L21 30L34 17L31 14L21 24Z" fill="#ffffff"/>
  </svg>`;
}

function renderTopBar() {
  return `
  <div class="top-bar">
    <div class="container">
      <div class="top-bar-info">
        <span>📍 Albuquerque &amp; Bernalillo County, New Mexico</span>
        <a href="tel:+15054608649">📞 Call Specialist: <strong>(505) 460-8649</strong></a>
      </div>
      <div class="top-bar-info">
        <span>Office: 2400 Rio Grande Blvd NW Ste j, Albuquerque, NM 87104</span>
        <span class="top-bar-badge">Same-Day MVD Filing</span>
      </div>
    </div>
  </div>`;
}

function renderHeader(currentUrl) {
  const isHome = currentUrl === '/';
  const isWhatIs = currentUrl === '/what-is-sr22/';
  const isHowTo = currentUrl === '/how-to-get-an-sr22-in-albuquerque/';
  const isNonOwners = currentUrl === '/non-owners-sr22-insurance/';
  const isSr22Services = isWhatIs || isHowTo || isNonOwners;
  const isBlog = currentUrl.startsWith('/blog');
  const isFaq = currentUrl === '/faq/';
  const isContact = currentUrl === '/contact-us/';
  const isLocation = locationsList.some(l => l.url === currentUrl);

  const locsHtml = locationsList.map(loc => `
    <li class="dropdown-item ${loc.url === currentUrl ? 'active' : ''}">
      <a href="${loc.url}">${loc.name}</a>
    </li>
  `).join('');

  return `
  ${renderTopBar()}
  <header class="site-header">
    <div class="container">
      <a href="/" class="brand-logo" aria-label="Sandia SR22 Insurance Albuquerque">
        ${getShieldSvg()}
        <div class="brand-text">
          <div class="brand-title">SANDIA SR22 <span>INSURANCE</span></div>
          <div class="brand-subtitle">ALBUQUERQUE, NM</div>
        </div>
      </a>

      <nav class="main-nav" aria-label="Main Navigation">
        <ul class="nav-menu">
          <li class="nav-item ${isHome ? 'active' : ''}"><a href="/" class="nav-link">Home</a></li>
          
          <!-- DROPDOWN: Sr22 Insurance & Services -->
          <li class="nav-item has-dropdown ${isSr22Services ? 'active' : ''}">
            <a href="/what-is-sr22/" class="nav-link">Sr22 Insurance ▾</a>
            <ul class="dropdown-menu">
              <li class="dropdown-item ${isWhatIs ? 'active' : ''}"><a href="/what-is-sr22/">What is SR-22?</a></li>
              <li class="dropdown-item ${isHowTo ? 'active' : ''}"><a href="/how-to-get-an-sr22-in-albuquerque/">How to Get an SR-22</a></li>
              <li class="dropdown-item ${isNonOwners ? 'active' : ''}"><a href="/non-owners-sr22-insurance/">Non-Owners SR-22 Insurance</a></li>
            </ul>
          </li>

          <!-- DROPDOWN: Locations -->
          <li class="nav-item has-dropdown ${isLocation ? 'active' : ''}">
            <a href="/rio-rancho-nm/" class="nav-link">Locations ▾</a>
            <ul class="dropdown-menu">
              ${locsHtml}
            </ul>
          </li>

          <!-- Blog Link -->
          <li class="nav-item ${isBlog ? 'active' : ''}"><a href="/blog/" class="nav-link">Blog</a></li>

          <li class="nav-item ${isFaq ? 'active' : ''}"><a href="/faq/" class="nav-link">FAQ</a></li>
          <li class="nav-item ${isContact ? 'active' : ''}"><a href="/contact-us/" class="nav-link">Contact Us</a></li>
        </ul>
      </nav>

      <div class="header-cta">
        <a href="tel:+15054608649" class="btn btn-primary btn-sm">Call (505) 460-8649</a>
      </div>

      <button class="mobile-toggle" aria-label="Toggle navigation menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>`;
}

function renderFooter() {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-top-logo">
        <a href="/" class="footer-logo-link">
          ${getShieldSvg()}
          <div class="footer-logo-title">Sandia SR22 <span>Insurance</span></div>
        </a>
      </div>
      <div class="footer-grid">
        <div class="footer-col">
          <h4>About Sandia SR22 Insurance</h4>
          <p>Sandia SR22 Insurance Albuquerque helps high-risk drivers and individuals dealing with suspended licenses secure affordable SR-22 coverage and file required certificates accurately with the New Mexico Motor Vehicle Division.</p>
          <p>Whether you need an owner policy, non-owner certificate, or reinstatement assistance across Bernalillo and surrounding counties, we provide prompt electronic filings.</p>
        </div>
        <div class="footer-col">
          <h4>Insurance Services &amp; Guides</h4>
          <ul class="footer-links">
            <li><a href="/what-is-sr22/">What Is an SR-22 Certificate?</a></li>
            <li><a href="/how-to-get-an-sr22-in-albuquerque/">Step-by-Step Reinstatement Guide</a></li>
            <li><a href="/non-owners-sr22-insurance/">Non-Owners SR-22 Insurance</a></li>
            <li><a href="/blog/">SR-22 Insurance Articles &amp; Insights</a></li>
            <li><a href="/faq/">Frequently Asked Questions</a></li>
            <li><a href="/rio-rancho-nm/">Rio Rancho SR-22 Service</a></li>
            <li><a href="/contact-us/">Contact Our Albuquerque Team</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Contact Information</h4>
          <div class="footer-contact-item">
            <span class="footer-contact-icon">📞</span>
            <div><strong>Direct Phone:</strong><br><a href="tel:+15054608649">(505) 460-8649</a></div>
          </div>
          <div class="footer-contact-item">
            <span class="footer-contact-icon">🏢</span>
            <div><strong>Processing Headquarters:</strong><br>2400 Rio Grande Blvd NW Ste j,<br>Albuquerque, NM 87104, United States</div>
          </div>
          <div class="footer-contact-item">
            <span class="footer-contact-icon">📍</span>
            <div><strong>Service Area:</strong><br>Albuquerque, NM &amp; Statewide New Mexico</div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>&copy; 2026 Sandia SR22 Insurance Albuquerque. All rights reserved. Providing fast, affordable SR-22 filings and driver license reinstatement support across New Mexico.</p>
      </div>
    </div>
  </footer>`;
}

function renderContactForm(title, subtitle) {
  return `
  <div class="contact-form-wrap reveal">
    <h3 class="contact-form-title">${title}</h3>
    <p class="contact-form-subtitle">${subtitle}</p>
    <div class="form-success-alert"></div>
    <form class="contact-quote-form" action="#" method="POST">
      <div class="form-row">
        <div class="form-group">
          <input type="text" id="fullName" name="name" class="form-control" placeholder="Full Name" required>
        </div>
        <div class="form-group">
          <input type="text" id="age" name="age" class="form-control" placeholder="Your Age / Policy Type" required>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <input type="tel" id="phone" name="phone" class="form-control" placeholder="Phone Number" required>
        </div>
        <div class="form-group">
          <input type="email" id="email" name="email" class="form-control" placeholder="Email Address" required>
        </div>
      </div>
      <div class="form-group">
        <textarea id="comments" name="comments" class="form-control" placeholder="Comments or Filing Requirements (e.g. MVD notice, DWI reinstatement, Non-Owner)" rows="4" required></textarea>
      </div>
      <button type="submit" class="form-submit-btn">SUBMIT</button>
    </form>
  </div>`;
}

function renderLatestNewsSection(blogs) {
  const topBlogs = blogs.slice(0, 3);
  const blogCardsHtml = topBlogs.map((b, idx) => `
    <article class="blog-card reveal reveal-delay-${idx + 1}">
      <div class="blog-thumb-wrap">
        <img src="/assets/images/${b.image}" alt="${b.title}" loading="lazy" width="380" height="220">
        <span class="blog-date-badge">${b.dateBadge || 'GUIDE'}</span>
      </div>
      <div class="blog-card-body">
        <span class="blog-card-tag">${b.tag || 'SR-22 Filing'}</span>
        <h3 class="blog-card-title">
          <a href="${b.url}">${b.title}</a>
        </h3>
        <p class="blog-card-excerpt">${b.excerpt}</p>
        <a href="${b.url}" class="blog-read-more">Read Full Article →</a>
      </div>
    </article>
  `).join('');

  return `
  <section class="section section-alt">
    <div class="container">
      <div class="section-header reveal">
        <span class="section-tag">Helpful Driver Resources</span>
        <h2 class="section-title">Latest News &amp; SR-22 Guides</h2>
        <p>Stay informed on New Mexico MVD rules, certificate costs, ignition interlock requirements, and license restoration.</p>
      </div>
      <div class="blog-grid">
        ${blogCardsHtml}
      </div>
      <div style="text-align: center; margin-top: 40px;" class="reveal">
        <a href="/blog/" class="btn btn-primary">View All SR-22 Articles</a>
      </div>
    </div>
  </section>`;
}

function buildHtmlDocument({ title, metaDesc, currentUrl, bodyContent }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${metaDesc}">
  <link rel="canonical" href="https://sandiasr22insurance.com${currentUrl}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
  ${renderHeader(currentUrl)}
  <main>
    ${bodyContent}
  </main>
  ${renderFooter()}
  <script src="/assets/js/main.js"></script>
</body>
</html>`;
}

module.exports = {
  locationsList,
  getShieldSvg,
  renderTopBar,
  renderHeader,
  renderFooter,
  renderContactForm,
  renderLatestNewsSection,
  buildHtmlDocument
};