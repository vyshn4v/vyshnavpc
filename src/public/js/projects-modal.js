document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const closeBtns = modal.querySelectorAll('[data-close-modal]');
  const cards = document.querySelectorAll('.project-card--clickable');
  
  // Modal Elements
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalImageContainer = document.getElementById('modalImageContainer');
  const modalTechList = document.getElementById('modalTechList');
  const modalGithub = document.getElementById('modalGithub');
  const modalLive = document.getElementById('modalLive');

  // Open Modal
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Prevent opening if they actually clicked the link icons inside the card
      if (e.target.closest('a')) return;

      const title = card.getAttribute('data-title');
      const desc = card.getAttribute('data-desc');
      const image = card.getAttribute('data-image');
      const github = card.getAttribute('data-github');
      const live = card.getAttribute('data-live');
      const techStr = card.getAttribute('data-tech');

      // Populate content
      modalTitle.textContent = title;
      modalDesc.textContent = desc;

      if (image) {
        modalImageContainer.innerHTML = `<img src="${image}" alt="${title}" loading="lazy" />`;
        modalImageContainer.style.display = 'block';
      } else {
        modalImageContainer.innerHTML = '';
        modalImageContainer.style.display = 'none';
      }

      // Tech Stack
      modalTechList.innerHTML = '';
      if (techStr) {
        const techs = techStr.split(',');
        techs.forEach(tech => {
          if (!tech.trim()) return;
          const li = document.createElement('li');
          li.textContent = tech.trim();
          modalTechList.appendChild(li);
        });
      }

      // Buttons
      if (github) {
        modalGithub.href = github;
        modalGithub.style.display = 'flex';
      } else {
        modalGithub.style.display = 'none';
      }

      if (live) {
        modalLive.href = live;
        modalLive.style.display = 'flex';
      } else {
        modalLive.style.display = 'none';
      }

      // Show Modal
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
  });

  // Close Modal
  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
});
