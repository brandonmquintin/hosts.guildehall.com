// GuildeHall Accordion Navigation Script

(function() {
  'use strict';

  const sections = document.querySelectorAll('.signal');
  const nextBtn = document.getElementById('next-btn');
  const navNext = document.querySelector('.nav-next');

  let currentIndex = 0;

  // Get section index from hash (e.g., #00 -> 0, #01 -> 1)
  function getIndexFromHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const index = parseInt(hash, 10);
      if (!isNaN(index) && index >= 0 && index < sections.length) {
        return index;
      }
    }
    return 0; // Default to first section
  }

  // Update opacity fade for section numbers and titles based on distance from active
  function updateSectionFade(activeIndex) {
    sections.forEach((section, index) => {
      const numberSpan = section.querySelector('.signal__header h2 span');
      const titleStrong = section.querySelector('.signal__header h2 strong');
      if (!numberSpan) return;

      // Calculate distance from active section
      const distance = Math.abs(index - activeIndex);

      // Apply fade: closer = more visible, further = more faded
      // Active section is handled by CSS (.active class)
      if (index === activeIndex) {
        numberSpan.style.opacity = '';
        if (titleStrong) titleStrong.style.opacity = '';
      } else {
        // Fade out progressively: each step away reduces opacity
        // Start at 0.4375 (base muted), fade further with distance
        const baseOpacity = 0.4375;
        const fadePerStep = 0.08;
        const opacity = Math.max(0.15, baseOpacity - (distance * fadePerStep));
        numberSpan.style.opacity = opacity;
        if (titleStrong) titleStrong.style.opacity = opacity;
      }
    });
  }

  // Set the active section
  function setActiveSection(index) {
    if (index < 0 || index >= sections.length) return;

    currentIndex = index;

    // Remove active class from all sections
    sections.forEach(section => section.classList.remove('active'));

    // Add active class to current section
    sections[index].classList.add('active');

    // Update fade effect
    updateSectionFade(index);

    // Update URL hash without scrolling
    const newHash = '#' + String(index).padStart(2, '0');
    if (window.location.hash !== newHash) {
      history.pushState(null, '', newHash);
    }

    // Update page title
    const title = sections[index].dataset.title;
    document.title = title ? `GuildeHall — ${title}` : 'GuildeHall';

    // Update next button visibility
    updateNextButtonVisibility();
  }

  // Update next button visibility
  function updateNextButtonVisibility() {
    if (currentIndex >= sections.length - 1) {
      navNext.classList.add('hidden');
    } else {
      navNext.classList.remove('hidden');
    }
  }

  // Go to next section
  function goToNextSection() {
    if (currentIndex < sections.length - 1) {
      setActiveSection(currentIndex + 1);
    }
  }

  // Go to previous section
  function goToPrevSection() {
    if (currentIndex > 0) {
      setActiveSection(currentIndex - 1);
    }
  }

  // Handle click on section headers
  sections.forEach((section, index) => {
    const header = section.querySelector('.signal__header');
    if (header) {
      header.addEventListener('click', function(e) {
        e.preventDefault();
        setActiveSection(index);
      });
    }
  });

  // Handle next button click
  nextBtn.addEventListener('click', goToNextSection);

  // Handle hash change (browser back/forward)
  window.addEventListener('hashchange', function() {
    const index = getIndexFromHash();
    setActiveSection(index);
  });

  // Handle keyboard navigation
  document.addEventListener('keydown', function(e) {
    // Don't capture if user is in an input field
    if (document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA') {
      return;
    }

    switch(e.key) {
      case 'ArrowDown':
      case ' ':
      case 'j':
        e.preventDefault();
        goToNextSection();
        break;
      case 'ArrowUp':
      case 'k':
        e.preventDefault();
        goToPrevSection();
        break;
      case 'Home':
        e.preventDefault();
        setActiveSection(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveSection(sections.length - 1);
        break;
    }
  });

  // Initialize - set active section based on URL hash or default to 00
  const initialIndex = getIndexFromHash();
  setActiveSection(initialIndex);

})();
