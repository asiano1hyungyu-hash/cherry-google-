import cherryHomeThaiImage from './src/assets/cherryhomethai.png';

/**
 * 체리출장마사지 - 수도권출장마사지 Interactive Script (script.js)
 * Vanilla JS - No external libraries required.
 */

// 1. Hero Image Loader
const setHeroImageSrc = () => {
  const heroBackgroundImage = document.getElementById('heroBackgroundImage');

  if (heroBackgroundImage && !heroBackgroundImage.src) {
    heroBackgroundImage.src = cherryHomeThaiImage;

    heroBackgroundImage.addEventListener('load', () => {
      console.log('HERO IMAGE SUCCESS', {
        currentSrc: heroBackgroundImage.currentSrc,
        naturalWidth: heroBackgroundImage.naturalWidth,
        naturalHeight: heroBackgroundImage.naturalHeight
      });
    });

    heroBackgroundImage.addEventListener('error', () => {
      console.error(
        'HERO IMAGE FAILED',
        heroBackgroundImage.currentSrc
      );
    });
  }
};

// 2. Dark / Light Theme Controller
const initThemeToggle = () => {
  const isDark = () => document.documentElement.classList.contains('dark');

  // Ensure button DOM exists in header
  let btn = document.getElementById('themeToggleBtn');
  if (!btn) {
    const actionGroup = document.querySelector('.header-action-group') || document.querySelector('.header-inner');
    if (actionGroup) {
      btn = document.createElement('button');
      btn.id = 'themeToggleBtn';
      btn.className = 'theme-toggle-btn';
      btn.type = 'button';
      actionGroup.appendChild(btn);
    }
  }

  if (!btn) return;

  const updateUI = () => {
    const darkState = isDark();
    if (darkState) {
      btn.innerHTML = '<span class="theme-icon" aria-hidden="true">☀️</span>';
      btn.setAttribute('aria-label', '라이트 모드로 변경');
      btn.setAttribute('title', '라이트 모드로 변경');
    } else {
      btn.innerHTML = '<span class="theme-icon" aria-hidden="true">🌙</span>';
      btn.setAttribute('aria-label', '다크 모드로 변경');
      btn.setAttribute('title', '다크 모드로 변경');
    }
  };

  // Sync button icon and labels with current html.dark class immediately
  updateUI();

  // Attach event listener once
  if (!btn.dataset.themeBound) {
    btn.dataset.themeBound = 'true';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const darkNow = isDark();
      const nextDark = !darkNow;

      if (nextDark) {
        document.documentElement.classList.add('dark');
        try { localStorage.setItem('theme', 'dark'); } catch (err) {}
      } else {
        document.documentElement.classList.remove('dark');
        try { localStorage.setItem('theme', 'light'); } catch (err) {}
      }

      updateUI();
    });
  }
};

// 3. Mobile Navigation Menu
const initMobileMenu = () => {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  if (mobileMenuBtn && navMenu) {
    if (!mobileMenuBtn.dataset.menuBound) {
      mobileMenuBtn.dataset.menuBound = 'true';
      mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isExpanded = navMenu.classList.contains('active');
        mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        mobileMenuBtn.innerHTML = isExpanded ? '✕' : '☰';
      });

      const navLinks = navMenu.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          mobileMenuBtn.innerHTML = '☰';
        });
      });
    }
  }
};

// 4. FAQ Accordion Logic
const initAccordion = () => {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer && !questionBtn.dataset.accordionBound) {
      questionBtn.dataset.accordionBound = 'true';
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) {
            otherAnswer.style.maxHeight = null;
          }
        });

        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstAnswer = firstItem.querySelector('.faq-answer');
    if (firstItem && firstAnswer) {
      firstItem.classList.add('active');
      firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
    }
  }
};

// 5. Phone Copy & Toast Notification
const initToastAndPhoneCopy = () => {
  const toast = document.getElementById('toastNotice');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  window.copyPhoneNumber = function(phoneNum) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(phoneNum).then(() => {
        showToast('전화번호(' + phoneNum + ')가 복사되었습니다. 바로 전화주세요!');
      }).catch(() => {
        fallbackCopyTextToClipboard(phoneNum);
      });
    } else {
      fallbackCopyTextToClipboard(phoneNum);
    }
  };

  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('전화번호(' + text + ')가 복사되었습니다!');
    } catch (err) {
      showToast('전화예약: ' + text);
    }
    document.body.removeChild(textArea);
  }
};

// 6. Highlight Table Row
const initTableHighlight = () => {
  const tableRows = document.querySelectorAll('.course-table tbody tr');
  tableRows.forEach(row => {
    if (!row.dataset.rowBound) {
      row.dataset.rowBound = 'true';
      row.addEventListener('click', () => {
        tableRows.forEach(r => r.style.backgroundColor = '');
        const isDark = document.documentElement.classList.contains('dark');
        row.style.backgroundColor = isDark ? '#3B2028' : '#FFF0F3';
        const courseName = row.cells[0]?.textContent?.trim() || '';
        const coursePrice = row.cells[2]?.textContent?.trim() || '';
        const toast = document.getElementById('toastNotice');
        if (toast) {
          toast.textContent = '선택 코스: ' + courseName + ' (' + coursePrice + ') - 전화/문자로 문의주세요!';
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 3000);
        }
      });
    }
  });
};

// 7. Smooth Scrolling
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (!anchor.dataset.scrollBound) {
      anchor.dataset.scrollBound = 'true';
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    }
  });
};

// Master App Initializer
const initApp = () => {
  setHeroImageSrc();
  initThemeToggle();
  initMobileMenu();
  initAccordion();
  initToastAndPhoneCopy();
  initTableHighlight();
  initSmoothScroll();
};

// Run as early as possible
if (document.readyState !== 'loading') {
  initApp();
} else {
  document.addEventListener('DOMContentLoaded', initApp);
}

// Safety net handlers for page restore / back-forward cache / async ready states
window.addEventListener('load', initThemeToggle);
window.addEventListener('pageshow', initThemeToggle);

// OS Theme preference change listener
try {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      initThemeToggle();
    }
  });
} catch (e) {}

// MutationObserver safety net to ensure themeToggleBtn is never missing from header
try {
  const mainHeader = document.querySelector('.main-header');
  if (mainHeader && typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      if (!document.getElementById('themeToggleBtn')) {
        initThemeToggle();
      }
    });
    observer.observe(mainHeader, { childList: true, subtree: true });
  }
} catch (e) {}

console.log('체리출장마사지 - 수도권출장마사지 Page Ready!');
