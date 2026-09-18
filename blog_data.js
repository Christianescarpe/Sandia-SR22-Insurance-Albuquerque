const fs = require('fs');
const blogsRaw = JSON.parse(fs.readFileSync('clean_blogs.json', 'utf8'));

const blogImageMap = {
  '/blog/new-mexico-sr22-insurance-cost/': {
    image: 'car-insurance-and-finance-with-blue-toy-car-2026-03-17-20-04-52-utc.webp',
    dateBadge: '15 MAR',
    tag: 'Cost & Rates'
  },
  '/blog/how-to-reinstate-suspended-license-new-mexico/': {
    image: 'car-insurance-agreement-with-toy-car-and-keys-2026-01-08-07-27-34-utc.webp',
    dateBadge: '12 MAR',
    tag: 'License Restoration'
  },
  '/blog/non-owner-vs-owner-sr22-new-mexico/': {
    image: 'car-insurance-concept-with-toy-car-and-umbrella-2026-01-08-08-12-26-utc.webp',
    dateBadge: '08 MAR',
    tag: 'Coverage Types'
  },
  '/blog/new-mexico-dwi-diversion-sr22-insurance/': {
    image: 'car-insurance-concept-with-umbrella-and-toy-car-2026-03-19-09-17-20-utc (1).webp',
    dateBadge: '02 MAR',
    tag: 'Legal Compliance'
  },
  '/blog/what-happens-when-sr22-lapses-new-mexico/': {
    image: 'car-insurance-coverage-with-protection-concept-2026-01-08-08-12-25-utc.webp',
    dateBadge: '25 FEB',
    tag: 'MVD Warnings'
  },
  '/blog/new-mexico-interlock-license-guide/': {
    image: 'car-insurance-concept-toy-car-covered-by-umbrella-2026-03-26-23-19-45-utc.webp',
    dateBadge: '20 FEB',
    tag: 'Interlock Rules'
  },
  '/blog/motorcycle-sr22-insurance-new-mexico/': {
    image: 'car-and-motorcycle-crash-on-a-city-street-2026-03-10-04-00-40-utc.webp',
    dateBadge: '14 FEB',
    tag: 'Motorcycle Filing'
  },
  '/blog/moving-to-new-mexico-with-out-of-state-sr22/': {
    image: 'car-insurance-form-on-a-tablet-device-2026-01-08-07-15-09-utc.webp',
    dateBadge: '09 FEB',
    tag: 'State Transfer'
  },
  '/blog/how-to-cancel-sr22-new-mexico/': {
    image: 'car-insurance-form-on-clipboard-pen-desk-2026-01-08-06-24-10-utc.webp',
    dateBadge: '03 FEB',
    tag: 'Reinstatement End'
  },
  '/blog/sr22-insurance-uninsured-accident-new-mexico/': {
    image: 'insurance-adjuster-inspecting-damage-after-car-cra-2026-01-05-05-08-40-utc.webp',
    dateBadge: '28 JAN',
    tag: 'Accident Recovery'
  }
};

const processedBlogs = blogsRaw.map(b => {
  const url = b['Page URL'];
  const meta = blogImageMap[url] || {
    image: 'car-insurance-concept-with-toy-car-and-umbrella-2026-01-08-08-12-26-utc.webp',
    dateBadge: 'GUIDE',
    tag: 'SR-22 Filing'
  };

  // Excerpt from meta description or first paragraph
  const excerpt = b['Meta Description'] || '';

  return {
    pageName: b.Page,
    url: b['Page URL'],
    title: b['SEO Title'],
    metaDesc: b['Meta Description'],
    htmlContent: b['Page Content (HTML)'],
    image: meta.image,
    dateBadge: meta.dateBadge,
    tag: meta.tag,
    excerpt
  };
});

module.exports = {
  processedBlogs
};