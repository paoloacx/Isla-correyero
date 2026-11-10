(() => {
  const englishPages = {
    'index.html': 'index.html',
    'biografia.html': 'biografia.html',
    'poemas.html': 'poemas.html',
    'critica.html': 'critica.html',
    'videos.html': 'videos.html'
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
      window.location.replace(page === 'index.html' ? '/en/' : `/en/${englishPages[page]}`);
      return;
    }
  }

  document.querySelectorAll('a[href]').forEach((link) => {
    const destination = new URL(link.href, window.location.href);
    if (destination.origin === window.location.origin && /\/index\.html$/.test(destination.pathname)) {
      destination.pathname = destination.pathname.replace(/index\.html$/, '');
      link.href = destination.href;
    }
  });

  const navigation = document.querySelector('header nav ul');
  if (navigation && !navigation.querySelector('a[href="videos.html"]')) {
    const item = document.createElement('li');
    const videoLink = document.createElement('a');
    videoLink.href = 'videos.html';
    videoLink.textContent = isEnglishPage ? 'Videos' : 'Vídeos';
    if (page === 'videos.html') videoLink.className = 'active';
    item.appendChild(videoLink);
    navigation.appendChild(item);
  }

  const switchLink = document.querySelector('.language-switch');
  if (!switchLink) return;

  const target = page === 'index.html' ? (isEnglishPage ? '/' : '/en/') : (isEnglishPage ? `/${page}` : `/en/${page}`);
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
