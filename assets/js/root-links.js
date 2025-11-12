// assets/js/root-links.js
// Converts header nav links that are relative (e.g. "worksheets.html") into root-absolute ("/worksheets.html")
// Safe: ignores absolute URLs, hash links, mailto, javascript.

(function(){
  function fixHeaderLinks() {
    try {
      const headerRoot = document.querySelector('header.main-header') || document.getElementById('header');
      if (!headerRoot) return;
      const anchors = headerRoot.querySelectorAll('a[href]');
      anchors.forEach(a => {
        const href = (a.getAttribute('href') || '').trim();
        if (!href) return;
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('javascript:') || href.startsWith('http') || href.startsWith('/')) return;
        a.setAttribute('href', '/' + href.replace(/^\.\//,''));
      });
      const logo = headerRoot.querySelector('.logo-link');
      if (logo) logo.setAttribute('href','/index.html');
    } catch(e){ /* silent */ }
  }

  // header may be loaded dynamically. Run on DOMContentLoaded and also after short delay.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(fixHeaderLinks, 60); // small delay to allow header injection
    });
  } else {
    setTimeout(fixHeaderLinks, 60);
  }

  // extra: listen for custom event if header loader emits one (optional)
  document.addEventListener('endue:headerLoaded', fixHeaderLinks);
})();
