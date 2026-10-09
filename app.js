'use strict';

document.documentElement.classList.add('js');

// Navigation and behavior shared by the four static pages.
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const mobileMenu = window.matchMedia('(max-width: 768px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function setMenu(open) {
  navLinks.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  document.body.classList.toggle('menu-open', open);
  navLinks.inert = mobileMenu.matches && !open;
}

hamburger.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
mobileMenu.addEventListener('change', () => setMenu(false));
setMenu(false);
document.addEventListener('keydown', event => {
  if (!navLinks.classList.contains('open')) return;
  if (event.key === 'Escape') {
    setMenu(false);
    hamburger.focus();
  }
  if (event.key === 'Tab') {
    const items = [...navLinks.querySelectorAll('a'), hamburger];
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

if (document.getElementById('hero')) {
  const updateNavbar = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
}

// Content remains visible if JavaScript or IntersectionObserver is unavailable.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(element => {
    element.classList.add('reveal-ready');
    observer.observe(element);
  });
}

const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const fields = ['nombre', 'email', 'asunto', 'origen', 'destino', 'mensaje'];
    const labels = ['Nombre', 'Correo', 'Servicio', 'Origen', 'Destino', 'Detalles'];
    const lines = ['Hola CorreKaminos, me gustaría solicitar una cotización.', ''];
    fields.forEach((id, index) => {
      const value = document.getElementById(id).value.trim();
      if (value) lines.push(`${labels[index]}: ${value}`);
    });
    window.location.assign(`https://wa.me/16197432209?text=${encodeURIComponent(lines.join('\n'))}`);
  });
}

// Stream one optimized video rather than downloading a second complete blob.
const video = document.getElementById('heroVideo');
const hero = document.getElementById('hero');
if (video && hero) {
  const fallback = document.getElementById('heroFallback');
  const showFallback = () => {
    video.pause();
    video.style.display = 'none';
    fallback.style.display = 'block';
  };
  video.addEventListener('error', showFallback);
  video.querySelector('source').addEventListener('error', showFallback);
  const compactLayout = window.matchMedia('(max-width: 768px), (orientation: portrait) and (max-width: 1024px)');
  const dataSaver = navigator.connection?.saveData;
  if (reducedMotion.matches || dataSaver) {
    showFallback();
    hero.classList.add('hero-static');
    video.removeAttribute('src');
    video.querySelector('source').removeAttribute('src');
    video.load();
  } else {
    let frame = null;
    const scrub = () => {
      frame = null;
      if (compactLayout.matches || !Number.isFinite(video.duration) || video.readyState < 2 || video.seeking) return;
      const distance = hero.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / Math.max(1, distance)));
      const time = progress * Math.max(0, video.duration - 0.05);
      if (Math.abs(video.currentTime - time) > 0.05) video.currentTime = time;
    };
    const play = () => video.play().catch(() => {});
    const configureVideo = () => {
      video.loop = compactLayout.matches;
      if (compactLayout.matches) play();
      else { video.pause(); scrub(); }
    };
    compactLayout.addEventListener('change', configureVideo);
    video.addEventListener('loadeddata', configureVideo);
    video.addEventListener('seeked', () => {
      if (!compactLayout.matches && !frame) frame = requestAnimationFrame(scrub);
    });
    window.addEventListener('scroll', () => {
      if (!compactLayout.matches && !frame) frame = requestAnimationFrame(scrub);
      const hint = document.querySelector('.hero-scroll-hint');
      if (hint) hint.style.opacity = window.scrollY > 100 ? '0' : '';
    }, { passive: true });
    window.addEventListener('resize', () => {
      if (!frame) frame = requestAnimationFrame(scrub);
    }, { passive: true });
    window.addEventListener('touchstart', () => { if (compactLayout.matches) play(); }, { once: true, passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) video.pause();
      else configureVideo();
    });
    video.preload = 'auto';
    configureVideo();
  }
}
