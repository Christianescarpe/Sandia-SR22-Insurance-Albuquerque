const fs = require('fs');
const path = require('path');
const { processedBlogs } = require('./blog_data');
const {
  renderContactForm,
  buildHtmlDocument
} = require('./templates');

function generateBlogIndex() {
  const cardsHtml = processedBlogs.map((b, idx) => `
    <article class="blog-card reveal reveal-delay-${(idx % 3) + 1}">
      <div class="blog-thumb-wrap">
        <img src="/assets/images/${b.image}" alt="${b.title}" loading="lazy" width="380" height="220">
        <span class="blog-date-badge">${b.dateBadge}</span>
      </div>
      <div class="blog-card-body">
        <span class="blog-card-tag">${b.tag}</span>
        <h2 class="blog-card-title" style="font-size: 1.15rem; margin-bottom: 10px;">
          <a href="${b.url}">${b.title}</a>
        </h2>
        <p class="blog-card-excerpt">${b.excerpt}</p>
        <a href="${b.url}" class="blog-read-more">Read Full Article →</a>
      </div>
    </article>
  `).join('');

  const bodyContent = `
  <section class="subpage-hero">
    <div class="container">
      <h1>New Mexico SR-22 Insurance Articles &amp; Driver Guides</h1>
      <ul class="breadcrumb-list">
        <li><a href="/">Home</a></li>
        <li>/</li>
        <li class="active">Blog</li>
      </ul>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-header reveal">
        <span class="section-tag">Educational Library</span>
        <h2 class="section-title">Essential Guides for Albuquerque &amp; New Mexico Drivers</h2>
        <p>Explore in-depth articles on New Mexico MVD filing requirements, certificate costs, ignition interlock permits, and step-by-step license reinstatement.</p>
      </div>

      <div class="blog-grid">
        ${cardsHtml}
      </div>
    </div>
  </section>

  <!-- CALLOUT BANNER -->
  <section class="cta-banner">
    <div class="container reveal">
      <h2>Have a Specific SR-22 Question?</h2>
      <p>Speak directly with an Albuquerque specialist to get fast, accurate answers and free rate comparisons.</p>
      <a href="tel:+19842051805" class="cta-phone-link">📞 (984) 205-1805</a><br><br>
      <a href="/contact-us/" class="btn btn-primary">Speak With An Agent</a>
    </div>
  </section>

  <!-- CONTACT / QUOTE SECTION -->
  <section class="section section-alt">
    <div class="container">
      <div class="contact-grid">
        ${renderContactForm("REQUEST A FREE SR-22 QUOTE", "Get quick rate options and same-day electronic MVD submission across Albuquerque.")}
        <div class="contact-map-wrap reveal">
          <div class="contact-info-card">
            <h3>Sandia SR22 Insurance Albuquerque</h3>
            <ul class="contact-info-list">
              <li class="contact-info-item">
                <div class="contact-info-icon">📞</div>
                <div><strong>Phone:</strong> <a href="tel:+19842051805">(984) 205-1805</a></div>
              </li>
              <li class="contact-info-item">
                <div class="contact-info-icon">🏢</div>
                <div><strong>Processing HQ:</strong> 2400 Rio Grande Blvd NW Ste j, Albuquerque, NM 87104, United States</div>
              </li>
              <li class="contact-info-item">
                <div class="contact-info-icon">⚡</div>
                <div><strong>Filing Speed:</strong> Same-day electronic filing to New Mexico MVD</div>
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
    title: 'New Mexico SR-22 Insurance Articles & Driver Guides | Sandia SR22 Albuquerque',
    metaDesc: 'Explore comprehensive SR-22 insurance guides for Albuquerque and New Mexico drivers. Learn about costs, license reinstatement, non-owner filings, and MVD rules.',
    currentUrl: '/blog/',
    bodyContent
  });
}

function generateSingleBlog(blog) {
  const otherBlogs = processedBlogs.filter(b => b.url !== blog.url).slice(0, 5);
  const relatedLinksHtml = otherBlogs.map(b => `
    <li class="sidebar-post-item">
      <a href="${b.url}">
        <strong>${b.title}</strong>
      </a>
      <span style="font-size: 0.78rem; color: var(--primary-green); display: block; margin-top: 4px;">${b.tag} • ${b.dateBadge}</span>
    </li>
  `).join('');

  const bodyContent = `
  <section class="subpage-hero">
    <div class="container">
      <h1 style="font-size: 2rem;">${blog.title}</h1>
      <ul class="breadcrumb-list">
        <li><a href="/">Home</a></li>
        <li>/</li>
        <li><a href="/blog/">Blog</a></li>
        <li>/</li>
        <li class="active">${blog.tag}</li>
      </ul>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="blog-layout-grid">
        <!-- Main Article Content (Strictly From Sheet) -->
        <article class="blog-article-content">
          <div class="image-frame-container" style="margin-bottom: 30px;">
            <img src="/assets/images/${blog.image}" alt="${blog.title}" width="750" height="420">
          </div>
          ${blog.htmlContent}
        </article>

        <!-- Sidebar -->
        <aside class="blog-sidebar">
          <div class="blog-sidebar-card reveal">
            <h3>Need SR-22 Insurance?</h3>
            <p style="font-size: 0.92rem; color: var(--text-muted);">Sandia SR22 Insurance provides same-day electronic MVD filings for Albuquerque and New Mexico drivers.</p>
            <div style="margin: 18px 0;">
              <a href="tel:+19842051805" class="btn btn-primary btn-block btn-sm">📞 Call (984) 205-1805</a>
            </div>
            <a href="/contact-us/" class="btn btn-outline-white btn-block btn-sm" style="color: var(--dark-bg); border-color: var(--light-border);">Request Free Quote</a>
          </div>

          <div class="blog-sidebar-card reveal reveal-delay-1">
            <h3>Related Driver Guides</h3>
            <ul class="sidebar-post-list">
              ${relatedLinksHtml}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <!-- CALLOUT BANNER -->
  <section class="cta-banner">
    <div class="container reveal">
      <h2>Ready to Get Back on the Road?</h2>
      <p>Our experienced New Mexico insurance specialists submit your certificate directly to the state.</p>
      <a href="tel:+19842051805" class="cta-phone-link">📞 (984) 205-1805</a><br><br>
      <a href="/contact-us/" class="btn btn-primary">Contact Sandia SR22 Insurance</a>
    </div>
  </section>
  `;

  return buildHtmlDocument({
    title: blog.title,
    metaDesc: blog.metaDesc,
    currentUrl: blog.url,
    bodyContent
  });
}

function buildAllBlogs() {
  console.log('Building Blog Section...');
  // 1. Build blog index
  fs.mkdirSync('blog', { recursive: true });
  const indexHtml = generateBlogIndex();
  fs.writeFileSync(path.join('blog', 'index.html'), indexHtml, 'utf8');
  console.log(`Generated: blog/index.html (${indexHtml.length} bytes)`);

  // 2. Build each individual blog
  processedBlogs.forEach(b => {
    const slug = b.url.replace(/^\/blog\/|\/+$/g, '');
    const blogDir = path.join('blog', slug);
    fs.mkdirSync(blogDir, { recursive: true });
    const singleHtml = generateSingleBlog(b);
    fs.writeFileSync(path.join(blogDir, 'index.html'), singleHtml, 'utf8');
    console.log(`Generated: ${path.join(blogDir, 'index.html')} (${singleHtml.length} bytes)`);
  });
  console.log('All 10 blogs successfully generated!');
}

module.exports = {
  buildAllBlogs
};