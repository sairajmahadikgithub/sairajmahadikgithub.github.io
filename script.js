// ===== PARTICLE BACKGROUND =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = ['#ff8c00','#ff4500','#ffd700'][Math.floor(Math.random()*3)];
  }
  update() {
    this.x += this.speedX; this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.save(); ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color; ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill(); ctx.restore();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  // Draw connecting lines
  particles.forEach((a, i) => {
    particles.slice(i + 1).forEach(b => {
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 100) {
        ctx.save(); ctx.globalAlpha = (1 - dist / 100) * 0.15;
        ctx.strokeStyle = '#ff8c00'; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        ctx.restore();
      }
    });
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== TYPING ANIMATION =====
const roles = [
  'Web Developer',
  'Python Programmer',
  'Generative AI Developer',
  'C++ Coder',
  'AI Content Creator',
  'MCA Student',
  'Problem Solver'
];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typedText');

function typeEffect() {
  const current = roles[roleIndex];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex--);
    if (charIndex < 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; setTimeout(typeEffect, 400); return; }
  } else {
    typedEl.textContent = current.substring(0, charIndex++);
    if (charIndex > current.length) { isDeleting = true; setTimeout(typeEffect, 1800); return; }
  }
  setTimeout(typeEffect, isDeleting ? 60 : 100);
}
typeEffect();

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open'); navLinks.classList.remove('open');
}));

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

themeToggle.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  themeIcon.className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  localStorage.setItem('theme', next);
});

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== SKILL BARS =====
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skills-category').forEach(el => barObserver.observe(el));

// ===== COUNTER ANIMATION =====
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-number').forEach(el => {
        const target = +el.dataset.target;
        const isDecimal = el.dataset.decimal === 'true';
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { start = target; clearInterval(timer); }
          el.textContent = isDecimal ? (start / 100).toFixed(2) : Math.floor(start);
        }, 25);
      });
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.about-stats').forEach(el => counterObserver.observe(el));

// ===== PROJECT FILTER =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
      if (show) { card.style.animation = 'fadeInUp 0.4s ease both'; }
    });
  });
});

// ===== CERTIFICATE MODAL =====
function openCert(img, title, platform) {
  document.getElementById('certModalImg').src = img;
  document.getElementById('certModalTitle').textContent = title;
  document.getElementById('certModalPlatform').textContent = platform;
  document.getElementById('certModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCert() {
  document.getElementById('certModal').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCert(); });

// ===== CONTACT FORM (LocalStorage) =====
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('.btn-submit');
  btn.classList.add('loading');

  const data = {
    name: form.name.value,
    email: form.email.value,
    subject: form.subject.value,
    message: form.message.value,
    timestamp: new Date().toISOString()
  };

  // Save to localStorage
  const messages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
  messages.push(data);
  localStorage.setItem('portfolio_messages', JSON.stringify(messages));

  setTimeout(() => {
    btn.classList.remove('loading');
    form.style.display = 'none';
    formSuccess.classList.add('show');
  }, 1200);
});

function resetForm() {
  form.reset();
  form.style.display = 'flex';
  formSuccess.classList.remove('show');
}

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== SMOOTH HOVER TILT on project cards =====
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    card.style.transform = `translateY(-8px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== GRAPHIC DESIGN FILTER =====
document.querySelectorAll('.design-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.design-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    document.querySelectorAll('.design-card').forEach(card => {
      const show = cat === 'all' || card.dataset.dcat === cat;
      card.classList.toggle('d-hidden', !show);
      if (show) card.style.animation = 'fadeInUp 0.4s ease both';
    });
  });
});

// ===== DESIGN LIGHTBOX =====
function openDesign(img, title, sub) {
  document.getElementById('designModalImg').src = img;
  document.getElementById('designModalTitle').textContent = title;
  document.getElementById('designModalSub').textContent = sub;
  document.getElementById('designModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDesign() {
  document.getElementById('designModal').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeCert(); closeDesign(); } });
