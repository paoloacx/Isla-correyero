(() => {
  const englishPages = {
    'index.html': 'index.html',
    'biografia.html': 'biografia.html',
    'poemas.html': 'poemas.html',
    'critica.html': 'critica.html'
  };
  const path = window.location.pathname;
  const isEnglishPage = /\/en\//.test(path);
  const page = path.split('/').pop() || 'index.html';
  let preferredLanguage = null;

  try {
    preferredLanguage = window.localStorage.getItem('isla-language');
  } catch (_) {
    // Language detection still works when browser storage is unavailable.
  }

  if (!isEnglishPage && preferredLanguage !== 'es') {
    const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
    const firstSupportedLanguage = browserLanguages.find((language) => /^(en|es)(?:-|$)/i.test(language));
    const prefersEnglish = preferredLanguage === 'en' || /^en(?:-|$)/i.test(firstSupportedLanguage || '');
    if (prefersEnglish && englishPages[page]) {
      window.location.replace(`en/${englishPages[page]}`);
      return;
    }
  }

  const switchLink = document.querySelector('.language-switch');
  if (!switchLink) return;

  const target = isEnglishPage ? `../${page}` : `en/${page}`;
  switchLink.href = target;
  switchLink.textContent = isEnglishPage ? 'ES' : 'EN';
  switchLink.lang = isEnglishPage ? 'es' : 'en';
  switchLink.hreflang = switchLink.lang;
  switchLink.setAttribute('aria-label', isEnglishPage ? 'Ver esta página en español' : 'View this page in English');
  switchLink.addEventListener('click', () => {
    try {
      window.localStorage.setItem('isla-language', isEnglishPage ? 'es' : 'en');
    } catch (_) {
      // Navigation continues even when browser storage is unavailable.
    }
  });
})();
