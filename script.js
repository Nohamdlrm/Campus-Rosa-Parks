/* =========================================================
   CAMPUS ROSA PARKS — SCRIPT PRINCIPAL
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1) Navigation flottante — état "scrolled" + menu mobile
     --------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* ---------------------------------------------------------
     2) Reveal on scroll — IntersectionObserver
     --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => {
    // On ne cache l'élément qu'une fois sûr que le JS tourne et que
    // l'observer va bien le reprendre en charge juste après.
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    revealObserver.observe(el);
  });

  /* ---------------------------------------------------------
     3) Compteurs animés
     --------------------------------------------------------- */
  const counters = document.querySelectorAll('.counter');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------------------------------------------------------
     4) Carrousel d'avis
     --------------------------------------------------------- */
  const track = document.getElementById('carouselTrack');
  const dotsWrap = document.getElementById('carouselDots');
  const slides = track ? Array.from(track.children) : [];
  let currentSlide = 0;

  if (track && slides.length) {
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    });

    function goToSlide(index) {
      currentSlide = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      Array.from(dotsWrap.children).forEach((d, i) => {
        d.classList.toggle('active', i === currentSlide);
      });
    }

    document.getElementById('prevSlide').addEventListener('click', () => goToSlide(currentSlide - 1));
    document.getElementById('nextSlide').addEventListener('click', () => goToSlide(currentSlide + 1));
  }

  /* ---------------------------------------------------------
     5) FAQ accordéon
     --------------------------------------------------------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
    });
  });

  /* ---------------------------------------------------------
     6) Cookies — accepter / refuser / rouvrir
     --------------------------------------------------------- */
  const cookieBanner = document.getElementById('cookieBanner');
  const refusedOverlay = document.getElementById('refusedOverlay');
  const body = document.body;

  function applyCookieChoice(choice) {
    if (choice === 'accepted') {
      cookieBanner.style.display = 'none';
      refusedOverlay.style.display = 'none';
      body.style.filter = 'none';
    } else if (choice === 'refused') {
      cookieBanner.style.display = 'none';
      refusedOverlay.style.display = 'flex';
      body.style.filter = 'blur(6px)';
    }
  }

  try {
    const saved = localStorage.getItem('crp-cookie-choice');
    if (saved) applyCookieChoice(saved);
  } catch (e) { /* stockage indisponible : on laisse la bannière visible */ }

  document.getElementById('cookieAccept').addEventListener('click', () => {
    try { localStorage.setItem('crp-cookie-choice', 'accepted'); } catch (e) {}
    applyCookieChoice('accepted');
  });

  document.getElementById('cookieRefuse').addEventListener('click', () => {
    try { localStorage.setItem('crp-cookie-choice', 'refused'); } catch (e) {}
    applyCookieChoice('refused');
  });

  document.getElementById('reopenBanner').addEventListener('click', () => {
    refusedOverlay.style.display = 'none';
    body.style.filter = 'none';
    cookieBanner.style.display = 'flex';
  });

  const reopenFooter = document.getElementById('reopenCookiesFooter');
  if (reopenFooter) {
    reopenFooter.addEventListener('click', () => {
      body.style.filter = 'none';
      refusedOverlay.style.display = 'none';
      cookieBanner.style.display = 'flex';
    });
  }

  /* ---------------------------------------------------------
     7) Bouton retour en haut
     --------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
