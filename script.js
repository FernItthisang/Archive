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

// --- Firebase Modular SDK ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getDatabase, ref, set, onChildAdded, get, child } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDuDF3ifxfk-4ycUY4Zs9UkFVpC8ak0F-w",
    authDomain: "fern-talk.firebaseapp.com",
    databaseURL: "https://fern-talk-default-rtdb.firebaseio.com/",
    projectId: "fern-talk",
    storageBucket: "fern-talk.firebasestorage.app",
    messagingSenderId: "90593260296",
    appId: "1:90593260296:web:8e691c77499dd7d516b2bd",
    measurementId: "G-66QKYCPMR0"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const chatBox = document.getElementById('chat');
const messageInput = document.getElementById('message');
const usernameInput = document.getElementById('username');
const sendButton = document.getElementById('send');

// Function to add a message to the chat box
function addMessage(username, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `<span class="username">${username}:</span> ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Load existing messages when the page loads
get(child(ref(database), 'messages')).then((snapshot) => {
    if (snapshot.exists()) {
        const messages = snapshot.val();
        // Iterate over the messages and display them
        Object.keys(messages).sort().forEach((key) => {
            const { username, message } = messages[key];
            addMessage(username, message);
        });
    } else {
        console.log("No previous messages found.");
    }
}).catch((error) => {
    console.error("Error loading messages: ", error);
});

// Send message to Firebase
sendButton.addEventListener('click', () => {
    const username = usernameInput.value || "Anonymous";
    const message = messageInput.value;
    if (message) {
        const timestamp = Date.now();
        set(ref(database, 'messages/' + timestamp), {
            username: username,
            message: message
        });
        messageInput.value = '';
    }
});

// Listen for new messages and update the chat box
onChildAdded(ref(database, 'messages'), (snapshot) => {
    const data = snapshot.val();
    addMessage(data.username, data.message);
});

document.querySelectorAll('.project-images-carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const left = carousel.querySelector('.carousel-arrow.left');
    const right = carousel.querySelector('.carousel-arrow.right');
    const getScrollAmount = () => {
        // Use the width of the first image + gap, or fallback
        const img = track.querySelector('img');
        const gap = parseInt(getComputedStyle(track).gap) || 16;
        return img ? img.offsetWidth + gap : 260;
    };

    function updateArrows() {
        // Only show arrows if content is overflowing
        if (track.scrollWidth > track.clientWidth + 1) {
            left.style.display = track.scrollLeft <= 0 ? 'none' : '';
            right.style.display = (track.scrollLeft + track.clientWidth >= track.scrollWidth - 1) ? 'none' : '';
        } else {
            left.style.display = 'none';
            right.style.display = 'none';
        }
    }

    left.addEventListener('click', () => {
        track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });
    right.addEventListener('click', () => {
        track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    // Update arrows on scroll, resize, and after images load
    track.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);

    // If images are loading, update after all images are loaded
    const imgs = track.querySelectorAll('img');
    let loaded = 0;
    if (imgs.length) {
        imgs.forEach(img => {
            if (img.complete) {
                loaded++;
            } else {
                img.addEventListener('load', () => {
                    loaded++;
                    if (loaded === imgs.length) updateArrows();
                });
            }
        });
        if (loaded === imgs.length) updateArrows();
    } else {
        updateArrows();
    }
});

// Replace with your published CSV URL
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-TsRXKIMa5NTXFGEA5A34LZTU86y5OYlEMKopDaNnS0P4_-MMJ7_olxMLCF-xNrtTlI-_9zw3J-6D/pub?gid=0&single=true&output=csv';

fetch(SHEET_URL)
  .then(response => response.text())
  .then(csvText => {
    const rows = csvText.split('\n').map(row => row.split(','));
    const headers = rows[0];
    const projects = rows.slice(1)
      .map(row => {
        let obj = {};
        headers.forEach((header, i) => obj[header.trim()] = row[i]);
        return obj;
      })
      .filter(project => project.id && project.title); // Filter out empty rows
    renderProjects(projects);
  });

function renderProjects(projects) {
  const grid = document.querySelector('.project-grid');
  grid.innerHTML = '';
  grid.style.display = '';

  // Predefined positions (tweak as needed for your taste)
  const positions = [
    { left: 40, top: 40 },
    { left: 400, top: 60 },
    { left: 800, top: 120 },
    { left: 200, top: 350 },
    { left: 600, top: 400 },
    { left: 1000, top: 300 },
    { left: 300, top: 600 },
    { left: 700, top: 650 },
    { left: 1100, top: 500 }
  ];

  projects.forEach((project, i) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-project', project.id);
    card.innerHTML = `
      <div class="project-title">${project.title}</div>
      <img src="${project.thumbnail}" alt="Project Thumbnail" />
    `;

    // Use predefined position, or random if more cards than positions
    let pos = positions[i] || {
      left: Math.random() * (grid.offsetWidth - 340),
      top: Math.random() * (grid.offsetHeight - 320)
    };
    // Add a little jitter for organic feel
    const jitter = () => (Math.random() - 0.5) * 30;
    card.style.left = `${pos.left + jitter()}px`;
    card.style.top = `${pos.top + jitter()}px`;

    card.addEventListener('click', () => showAllProjectsDetailView(projects));
    grid.appendChild(card);
  });

  // Hide detail view
  document.getElementById('project-detail-view').style.display = 'none';
}

function showProjectDetail(project, allProjects) {
  const grid = document.querySelector('.project-grid');
  const detail = document.getElementById('project-detail-view');
  grid.style.display = 'none';
  detail.style.display = 'flex';

  // Media (video or images)
  let mediaHtml = '';
  if (project.video) {
    mediaHtml = `
      <div class="project-detail-media">
        <video controls>
          <source src="${project.video}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
    `;
  }
  if (project.image) {
    const images = project.image.split('|');
    mediaHtml += images.map(url => `
      <div class="project-detail-image">
        <img src="${url}" alt="Project Image" />
      </div>
    `).join('');
  }

  // Details
  const detailsHtml = `
    <div class="project-detail-content">
      <h2>${project.title}</h2>
      ${mediaHtml}
      <p>${project.description}</p>
      ${project.link ? `<a class="learn-more-btn" href="${project.link}" target="_blank">Learn More</a>` : ''}
    </div>
  `;

  detail.innerHTML = detailsHtml;
}