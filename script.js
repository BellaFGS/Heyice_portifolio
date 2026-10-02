const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const toast = document.querySelector('.toast');

menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');
function applyFilter(filter) {
  portfolioCards.forEach((card) => {
    const categories = (card.dataset.category || '').split(' ');
    const visible = filter === 'all' || categories.includes(filter);
    card.classList.toggle('hidden', !visible);
  });
}
filterButtons.forEach((button) => button.addEventListener('click', () => {
  filterButtons.forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  applyFilter(button.dataset.filter);
}));
applyFilter('featured');

const previewCards = document.querySelectorAll('.portfolio-card');
previewCards.forEach((card) => {
  const video = card.querySelector('.card-preview');
  if (!video) return;
  card.addEventListener('mouseenter', () => {
    video.play().catch(() => {});
    card.classList.add('is-previewing');
  });
  card.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0;
    card.classList.remove('is-previewing');
  });
});

const showreelFrame = document.querySelector('.showreel-frame');
const showreelVideo = document.querySelector('.showreel-video');
showreelVideo?.addEventListener('play', () => showreelFrame?.classList.add('is-playing'));
showreelVideo?.addEventListener('pause', () => showreelFrame?.classList.remove('is-playing'));
showreelFrame?.addEventListener('click', () => {
  const video = showreelVideo;
  if (!video?.src || video.readyState === 0) {
    showToast('Adicione o arquivo assets/bianca-showreel.mp4 para ativar o showreel.');
    return;
  }
  video.play().catch(() => {});
});

const modal = document.querySelector('#project-modal');
const modalArt = document.querySelector('#modal-art');
const modalTitle = document.querySelector('#modal-title');
const modalCategory = document.querySelector('#modal-category');
const modalDesc = document.querySelector('#modal-desc');
let lastFocused = null;
function openModal(card) {
  lastFocused = document.activeElement;
  modalTitle.textContent = card.dataset.modalTitle || 'Projeto';
  modalCategory.textContent = card.dataset.modalCategory || 'Portfólio';
  modalDesc.textContent = card.dataset.modalDesc || 'Projeto selecionado do portfólio da Bianca.';
  const visual = card.querySelector('.portfolio-visual, .project-art');
  modalArt.className = `modal-art ${visual?.className || ''}`;
  modal.hidden = false;
  document.body.classList.add('modal-open');
  modal.querySelector('.modal-close').focus();
}
function closeModal() {
  modal.hidden = true;
  document.body.classList.remove('modal-open');
  lastFocused?.focus();
}
document.querySelectorAll('.project-card, .portfolio-card').forEach((card) => {
  card.addEventListener('click', (event) => {
    if (event.target.closest('video, .preview-label')) return;
    openModal(card);
  });
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openModal(card); }
  });
  card.setAttribute('tabindex', '0');
});
document.querySelectorAll('[data-close-modal]').forEach((element) => element.addEventListener('click', closeModal));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) closeModal(); });

document.querySelector('.contact-form')?.addEventListener('submit', () => showToast('Abrindo o seu aplicativo de e-mail.'));
const copyButton = document.querySelector('.copy-email');
copyButton?.addEventListener('click', async () => {
  const email = copyButton.dataset.email;
  try { await navigator.clipboard.writeText(email); showToast('E-mail copiado para a área de transferência.'); }
  catch { showToast(`E-mail: ${email}`); }
});
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2800);
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  document.querySelectorAll('.section-shell > *').forEach((element) => { element.classList.add('reveal'); observer.observe(element); });
}
