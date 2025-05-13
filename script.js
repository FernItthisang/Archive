// Smooth scroll on click
document.querySelectorAll('header a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
      }
  });
});

document.querySelectorAll('.box').forEach(box => {
  box.classList.add('expanded');
});

// Collapse/expand boxes only when clicking the title
document.querySelectorAll('.box-title').forEach(title => {
  title.addEventListener('click', function(e) {
      // Prevent click from bubbling up if there are nested clickable elements
      e.stopPropagation();
      this.parentElement.classList.toggle('collapsed');
      this.parentElement.classList.toggle('expanded');
  });
});

// Project card expansion functionality
document.addEventListener('DOMContentLoaded', function() {
  const projectCards = document.querySelectorAll('.project-card');

  // Show the back button when any card is expanded
  function updateBackBtnVisibility() {
      const anyExpanded = Array.from(projectCards).some(card => card.classList.contains('expanded') && card.classList.contains('active'));
      backBtn.style.display = anyExpanded ? 'block' : 'none';
  }

  // Collapse all cards and scroll to top when back is clicked
  backBtn.addEventListener('click', function() {
      projectCards.forEach(card => {
          card.classList.remove('expanded', 'active');
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      updateBackBtnVisibility();
      document.getElementById('project-details').style.display = 'none';
      document.getElementById('project-container').style.display = 'grid';
      backBtn.style.display = 'none';
  });

  // Update back button visibility on card expand/collapse
  projectCards.forEach(card => {
      card.addEventListener('click', function(e) {
          // Expand all cards
          projectCards.forEach(c => c.classList.add('expanded', 'active'));
          // Scroll the clicked card into view within the project-container
          const container = card.closest('.column-large');
          if (container) {
              const cardRect = card.getBoundingClientRect();
              const containerRect = container.getBoundingClientRect();
              // Calculate the offset to center the card
              const offset = cardRect.top - containerRect.top;
              container.scrollBy({ top: offset, behavior: 'smooth' });
          } else {
              // fallback to default scrollIntoView
              card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          setTimeout(updateBackBtnVisibility, 100);
          e.stopPropagation();
      });
  });

  // Also update on Escape key
  document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
          setTimeout(updateBackBtnVisibility, 100);
      }
  });
});

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', function() {
      document.getElementById('project-container').style.display = 'none';
      document.getElementById('project-details').style.display = 'grid';
      backBtn.style.display = 'block';

      // Scroll to the corresponding project-card-details
      const projectId = card.getAttribute('data-project');
      const detail = document.querySelector('.project-card-details[data-project=\"' + projectId + '\"]');
      if (detail) {
          setTimeout(() => {
              detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
      }
  });
});

document.getElementById('project-details').addEventListener('click', function(e) {
  // ถ้าคลิกที่ project-details โดยตรง (ไม่ใช่ลูกหลาน)
  if (e.target === this) {
      this.style.display = 'none';
      document.getElementById('project-container').style.display = 'grid';
      document.getElementById('back-btn').style.display = 'none';
  }
});