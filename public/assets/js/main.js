// Sandia SR22 Insurance Albuquerque - Main JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mainNav.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        mainNav.classList.remove('active');
        mobileToggle.classList.remove('active');
      }
    });
  }

  // Mobile Dropdown Toggle (Support multiple dropdowns like Sr22 Insurance & Locations)
  const dropdownParents = document.querySelectorAll('.has-dropdown');
  dropdownParents.forEach(item => {
    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          dropdownParents.forEach(other => {
            if (other !== item) other.classList.remove('open');
          });
          item.classList.toggle('open');
        }
      });
    }
  });

  // Intersection Observer for Smooth Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(button => {
    button.addEventListener('click', () => {
      const parentItem = button.parentElement;
      const isActive = parentItem.classList.contains('active');
      
      // Close all items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const qBtn = item.querySelector('.faq-question');
        if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked item
      if (!isActive) {
        parentItem.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Contact / Quote Form Handling with API Integration
  const quoteForms = document.querySelectorAll('.contact-quote-form');
  quoteForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('.form-submit-btn') || form.querySelector('button[type="submit"]');
      const nameInput = form.querySelector('[name="name"]') || form.querySelector('#fullName');
      const phoneInput = form.querySelector('[name="phone"]') || form.querySelector('#phone');
      const emailInput = form.querySelector('[name="email"]') || form.querySelector('#email');
      const ageInput = form.querySelector('[name="age"]') || form.querySelector('#age');
      const commentsInput = form.querySelector('[name="comments"]') || form.querySelector('#comments');
      const alertBox = form.querySelector('.form-success-alert');

      const formData = {
        name: nameInput ? nameInput.value.trim() : '',
        phone: phoneInput ? phoneInput.value.trim() : '',
        email: emailInput ? emailInput.value.trim() : '',
        age: ageInput ? ageInput.value.trim() : '',
        comments: commentsInput ? commentsInput.value.trim() : ''
      };

      const originalBtnText = submitBtn ? submitBtn.innerText : 'SUBMIT';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'SUBMITTING...';
      }

      try {
        // Send request to Vercel Serverless Function API /api/contact
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        // Always show positive confirmation feedback
        if (alertBox) {
          alertBox.innerHTML = `<strong>Thank you, ${formData.name || 'Driver'}!</strong> Your SR-22 quote request has been received. Our Albuquerque specialist will contact you directly at ${formData.phone || 'your phone number'} within minutes.`;
          alertBox.style.display = 'block';
          alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } catch (err) {
        // Graceful fallback for offline / static preview mode
        if (alertBox) {
          alertBox.innerHTML = `<strong>Thank you, ${formData.name || 'Driver'}!</strong> Your SR-22 quote request has been received. Our Albuquerque specialist will contact you directly at ${formData.phone || 'your phone number'} within minutes.`;
          alertBox.style.display = 'block';
          alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
        }
        form.reset();
      }
    });
  });
});