/* script.js - Backend Integration */

/* -------------------------
   Global State
--------------------------*/
let events = [];
let currentUser = null;

/* -------------------------
   Validation patterns
--------------------------*/
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.(com|in|net|org)$/;
const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,40}$/;

/* -------------------------
   DOM refs (guarded)
--------------------------*/
const eventsGrid = document.getElementById('eventsGrid');
const dashboardContainer = document.getElementById('dashboardContainer') || document.createElement('div');
const navAuthButtons = document.getElementById('navAuthButtons');
const profileMenu = document.getElementById('profileMenu');
const profileIcon = document.getElementById('profileIcon');
const profileDropdown = document.getElementById('profileDropdown');
const profileNameEl = document.getElementById('profileName');
const profileEmailEl = document.getElementById('profileEmail');

/* -------------------------
   Init - SINGLE ENTRY POINT
--------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  loadEvents();
  attachGlobalHandlers();
  startSlider();
});

/* -------------------------
   API: Load Events
--------------------------*/
async function loadEvents() {
  try {
    const response = await fetch('http://localhost:8080/api/events');
    if (!response.ok) throw new Error('Failed to fetch events');
    events = await response.json();
    console.log('Loaded events:', events);
    renderEvents();
    populateWinnersSection();
  } catch (error) {
    console.error('Error loading events:', error);
    alert('Failed to load events. Make sure backend is running on port 8080.');
    if (eventsGrid) eventsGrid.innerHTML = '<p style="text-align:center;padding:40px">Backend not available.</p>';
  }
}

/* -------------------------
   Helpers
--------------------------*/
function formatDate(d) {
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
    return d || '-';
  }
}

function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'flex';
  el.setAttribute('aria-hidden', 'false');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'none';
  el.setAttribute('aria-hidden', 'true');
}

function closeAllModals() {
  document.querySelectorAll('.modal').forEach(m => {
    m.style.display = 'none';
    m.setAttribute('aria-hidden', 'true');
  });
}

/* -------------------------
   RENDER EVENTS GRID
--------------------------*/
function renderEvents() {
  if (!eventsGrid) return;
  eventsGrid.innerHTML = '';
  
  if (!events || events.length === 0) {
    eventsGrid.innerHTML = '<p style="text-align:center;padding:40px">No events available</p>';
    return;
  }

  events.forEach(ev => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <div class="event-image" style="background-image:url('${ev.image || './public/images/default.jpg'}')"></div>
      <div class="event-content">
        ${ev.isNew ? `<div style="position:absolute;right:16px;top:16px;background:var(--kl-yellow);padding:6px 10px;border-radius:8px;font-weight:700">NEW</div>` : ''}
        <div class="event-category">${ev.category}</div>
        <h3 class="event-name">${ev.name}</h3>
        <div class="event-details">
          <div><i class="far fa-calendar-alt"></i> ${formatDate(ev.eventDate)}</div>
          <div><i class="far fa-clock"></i> ${ev.eventStartTime}</div>
          <div><i class="fas fa-map-marker-alt"></i> ${ev.venue}</div>
          <div><i class="fas fa-users"></i> ${ev.currentRegistrations || 0}/${ev.maxRegistrations} Registered</div>
        </div>
        <div class="event-actions">
          <button class="btn btn-outline details-btn" data-id="${ev.id}"><i class="fas fa-info-circle"></i> Details</button>
        </div>
      </div>
    `;
    eventsGrid.appendChild(card);
  });

  eventsGrid.querySelectorAll('.details-btn').forEach(b => b.addEventListener('click', () => {
    const id = parseInt(b.dataset.id, 10);
    openDetailsModal(id);
  }));
}

/* -------------------------
   SLIDER
--------------------------*/
let slideIndex = 0, slideTimer = null;
function startSlider() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.indicator');
  if (!slides || !slides.length) return;
  
  function show(i) {
    slides.forEach(s => s.classList.remove('active'));
    if (dots) dots.forEach(d => d.classList.remove('active'));
    const idx = (i + slides.length) % slides.length;
    slides[idx].classList.add('active');
    if (dots && dots[idx]) dots[idx].classList.add('active');
    slideIndex = idx;
  }
  
  show(0);
  if (slideTimer) clearInterval(slideTimer);
  slideTimer = setInterval(() => show(slideIndex + 1), 4500);
  if (dots) dots.forEach((dot, idx) => dot.addEventListener('click', () => {
    clearInterval(slideTimer);
    show(idx);
    startSlider();
  }));
}

/* -------------------------
   Global Handlers
--------------------------*/
function attachGlobalHandlers() {
  const openLogin = document.getElementById('openLogin');
  if (openLogin) openLogin.addEventListener('click', () => openModal('loginModal'));

  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', (ev) => {
      if (ev.target === m) closeModal(m.id);
    });
  });

  if (profileIcon) {
    profileIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      const d = document.getElementById('profileDropdown');
      if (!d) return;
      d.style.display = (d.style.display === 'block') ? 'none' : 'block';
    });
  }
  
  document.addEventListener('click', (e) => {
    const d = document.getElementById('profileDropdown');
    if (d && profileMenu && !profileMenu.contains(e.target)) d.style.display = 'none';
  });

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', () => handleLogout());

  document.querySelectorAll('.role-tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.role-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
    });
  });

  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  const registerForm = document.getElementById('registerForm');
  if (registerForm) registerForm.addEventListener('submit', handleRegister);
}

/* -------------------------
   LOGIN
--------------------------*/
async function handleLogin(e) {
  e && e.preventDefault && e.preventDefault();
  
  const emailEl = document.getElementById('loginEmail');
  const pwdEl = document.getElementById('loginPassword');
  if (!emailEl || !pwdEl) return;
  
  const email = emailEl.value.trim();
  const password = pwdEl.value.trim();
  
  const activeTab = document.querySelector('.role-tab.active');
  const selectedRole = (activeTab && activeTab.dataset.role) ? activeTab.dataset.role.toUpperCase() : 'STUDENT';

  if (!emailPattern.test(email)) {
    alert('Invalid email format');
    return;
  }
  if (!passwordPattern.test(password)) {
    alert('Invalid password format');
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role: selectedRole })
    });

    if (!response.ok) {
      if (response.status === 401) {
        alert('Invalid credentials or role mismatch');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }
      return;
    }

    const userData = await response.json();
    currentUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role
    };

    console.log('Login successful:', currentUser);
    afterLogin();
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed: ' + error.message);
  }
}

/* -------------------------
   REGISTER
--------------------------*/
async function handleRegister(e) {
  e && e.preventDefault && e.preventDefault();
  const fm = e.target;
  if (!fm) return;
  const fd = new FormData(fm);
  
  const userData = {
    name: (fd.get('name') || '').trim(),
    email: (fd.get('email') || '').trim(),
    password: (fd.get('password') || '').trim(),
    mobile: (fd.get('mobile') || '').trim(),
    collegeId: (fd.get('college') || '').trim(),
    role: 'STUDENT'
  };

  const confirm = (fd.get('confirm') || '').trim();

  if (!userData.name) { alert('Enter name'); return; }
  if (!emailPattern.test(userData.email)) { alert('Invalid email format'); return; }
  if (userData.password !== confirm) { alert('Passwords do not match'); return; }
  if (!passwordPattern.test(userData.password)) {
    alert('Password must be 8-40 chars, 1 uppercase, 1 number, 1 special char');
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    alert('Registered successfully! Please login.');
    closeModal('registerModal');
    openModal('loginModal');
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed: ' + error.message);
  }
}

/* -------------------------
   AFTER LOGIN
--------------------------*/
function afterLogin() {
  if (navAuthButtons) navAuthButtons.style.display = 'none';
  if (profileMenu) profileMenu.style.display = 'flex';
  if (profileNameEl) profileNameEl.textContent = currentUser.name || currentUser.email;
  if (profileEmailEl) profileEmailEl.textContent = currentUser.email;
  
  const hero = document.querySelector('.hero');
  if (hero) hero.style.display = 'none';
  const coming = document.getElementById('coming-soon');
  if (coming) coming.style.display = 'none';
  const eventsSec = document.querySelector('.events-section');
  if (eventsSec) eventsSec.style.display = 'none';
  const winners = document.getElementById('winners');
  if (winners) winners.style.display = 'none';
  const contact = document.getElementById('contact');
  if (contact) contact.style.display = 'none';
  
  if (!document.getElementById('dashboardContainer')) {
    const container = document.createElement('div');
    container.id = 'dashboardContainer';
    document.body.appendChild(container);
  }
  document.getElementById('dashboardContainer').style.display = 'block';
  
  closeModal('loginModal');
  renderDashboardFor(currentUser.role.toLowerCase());
}

/* -------------------------
   LOGOUT
--------------------------*/
function handleLogout() {
  currentUser = null;
  if (profileMenu) profileMenu.style.display = 'none';
  if (navAuthButtons) navAuthButtons.style.display = 'flex';
  
  const hero = document.querySelector('.hero');
  if (hero) hero.style.display = '';
  const coming = document.getElementById('coming-soon');
  if (coming) coming.style.display = '';
  const eventsSec = document.querySelector('.events-section');
  if (eventsSec) eventsSec.style.display = '';
  const winners = document.getElementById('winners');
  if (winners) winners.style.display = '';
  const contact = document.getElementById('contact');
  if (contact) contact.style.display = '';
  
  const dash = document.getElementById('dashboardContainer');
  if (dash) {
    dash.style.display = 'none';
    dash.innerHTML = '';
  }
  
  renderEvents();
}

/* -------------------------
   EVENT DETAILS MODAL
--------------------------*/
function openDetailsModal(id) {
  const ev = events.find(e => e.id === id);
  if (!ev) return alert('Event not found');
  
  let modal = document.getElementById('eventDetailsModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'eventDetailsModal';
    modal.innerHTML = `
      <div class="modal-content modal-medium">
        <span class="close-modal" onclick="closeModal('eventDetailsModal')">&times;</span>
        <h3 id="eventDetailsTitle"></h3>
        <img id="eventDetailsImage" alt="event" style="width:100%;border-radius:8px;margin:10px 0;">
        <p><strong>Category:</strong> <span id="eventDetailsCategory"></span></p>
        <p><strong>Date:</strong> <span id="eventDetailsDate"></span></p>
        <p><strong>Time:</strong> <span id="eventDetailsTime"></span></p>
        <p><strong>Venue:</strong> <span id="eventDetailsVenue"></span></p>
        <p id="eventDetailsDesc"></p>
        <div style="text-align:right">
          <button class="btn btn-success" id="modalRegisterBtn" style="display:none">Register</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('modalRegisterBtn').addEventListener('click', () => {
      const eventId = parseInt(document.getElementById('modalRegisterBtn').dataset.eventId, 10);
      queueRegistration(eventId);
      closeModal('eventDetailsModal');
    });
  }
  
  document.getElementById('eventDetailsTitle').textContent = ev.name;
  document.getElementById('eventDetailsImage').src = ev.image || './public/images/default.jpg';
  document.getElementById('eventDetailsCategory').textContent = ev.category;
  document.getElementById('eventDetailsDate').textContent = formatDate(ev.eventDate);
  document.getElementById('eventDetailsTime').textContent = ev.eventStartTime;
  document.getElementById('eventDetailsVenue').textContent = ev.venue;
  document.getElementById('eventDetailsDesc').textContent = ev.description;
  
  const regBtn = document.getElementById('modalRegisterBtn');
  if (regBtn) {
    if (currentUser && currentUser.role === 'STUDENT') {
      regBtn.style.display = 'inline-flex';
      regBtn.dataset.eventId = ev.id;
    } else {
      regBtn.style.display = 'none';
    }
  }
  
  openModal('eventDetailsModal');
}

/* -------------------------
   EVENT REGISTRATION - SINGLE VERSION
--------------------------*/
async function queueRegistration(eventId) {
  if (!currentUser) {
    alert('Please login as student to register');
    openModal('loginModal');
    return;
  }
  if (currentUser.role !== 'STUDENT') {
    alert('Only students can register');
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.id,
        eventId: eventId
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    alert('Registered successfully!');
    await loadEvents();
    renderDashboardFor('student');
  } catch (error) {
    console.error('Registration error:', error);
    alert(error.message);
  }
}

/* -------------------------
   DASHBOARDS
--------------------------*/
function renderDashboardFor(role) {
  const r = (role || '').toLowerCase();
  if (r === 'student') renderStudentDashboard();
  else if (r === 'admin') renderAdminDashboard();
  else if (r === 'judge') renderJudgeDashboard();
}

/* Student Dashboard */
async function renderStudentDashboard() {
  const root = document.getElementById('dashboardContainer');
  if (!root) return;

  try {
    const response = await fetch(`http://localhost:8080/api/registrations/user/${currentUser.id}`);
    if (!response.ok) throw new Error('Failed to fetch registrations');
    
    const myRegs = await response.json();
    console.log('My registrations:', myRegs);

    root.innerHTML = `
      <div class="dashboard-wrapper container">
        <div class="dashboard-header">
          <h2>Student Dashboard</h2>
          <div><button class="btn btn-outline" onclick="handleLogout()">Logout</button></div>
        </div>

        <div class="dashboard-cards">
          <div class="dashboard-card">
            <div class="card-icon"><i class="far fa-calendar-check"></i></div>
            <div class="card-value">${myRegs.length}</div>
            <div class="card-label">My Registrations</div>
          </div>
          <div class="dashboard-card">
            <div class="card-icon"><i class="fas fa-user"></i></div>
            <div class="card-value">${currentUser.name}</div>
            <div class="card-label">Profile</div>
          </div>
        </div>

        <div class="table-container" style="margin-bottom:22px">
          <div class="table-header"><h3>My Registrations</h3></div>
          <table>
            <thead><tr><th>Event</th><th>Status</th><th>Score</th></tr></thead>
            <tbody>
              ${myRegs.length === 0 ? '<tr><td colspan="3" style="text-align:center">No registrations yet</td></tr>' : myRegs.map(r => {
                const ev = r.event || {};
                return `<tr>
                  <td>${ev.name || '-'}</td>
                  <td>${r.status || 'REGISTERED'}</td>
                  <td>${r.score !== null ? r.score + '%' : 'Not graded'}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>

        <h3 style="color:var(--kl-blue);margin-bottom:12px">Available Events</h3>
        <div class="events-grid">
          ${events.map(ev => `
            <div class="event-card">
              <div class="event-image" style="background-image:url('${ev.image || './public/images/default.jpg'}')"></div>
              <div class="event-content">
                <div class="event-category">${ev.category}</div>
                <h3 class="event-name">${ev.name}</h3>
                <div class="event-actions">
                  <button class="btn btn-primary" onclick="queueRegistration(${ev.id})">Register</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Dashboard error:', error);
    root.innerHTML = '<p style="padding:40px;text-align:center">Error loading dashboard</p>';
  }
}

/* Admin Dashboard */
function renderAdminDashboard() {
  const root = document.getElementById('dashboardContainer');
  if (!root) return;

  root.innerHTML = `
    <div class="dashboard-wrapper container">
      <div class="dashboard-header">
        <h2>Admin Dashboard</h2>
        <div><button class="btn btn-outline" onclick="handleLogout()">Logout</button></div>
      </div>

      <div class="dashboard-cards">
        <div class="dashboard-card">
          <div class="card-icon"><i class="far fa-calendar-alt"></i></div>
          <div class="card-value">${events.length}</div>
          <div class="card-label">Total Events</div>
        </div>
      </div>

      <div class="table-container">
        <div class="table-header"><h3>All Events</h3></div>
        <table>
          <thead><tr><th>Event Name</th><th>Category</th><th>Date</th><th>Registrations</th><th>Status</th></tr></thead>
          <tbody>
            ${events.map(ev => `
            <tr>
              <td>${ev.name}</td>
              <td>${ev.category}</td>
              <td>${formatDate(ev.eventDate)}</td>
              <td>${ev.currentRegistrations || 0}/${ev.maxRegistrations}</td>
              <td>${ev.status}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* Judge Dashboard */
function renderJudgeDashboard() {
  const root = document.getElementById('dashboardContainer');
  if (!root) return;

  root.innerHTML = `
    <div class="dashboard-wrapper container">
      <div class="dashboard-header">
        <h2>Judge Dashboard</h2>
        <div><button class="btn btn-outline" onclick="handleLogout()">Logout</button></div>
      </div>

      <div class="dashboard-cards">
        <div class="dashboard-card">
          <div class="card-icon"><i class="fas fa-gavel"></i></div>
          <div class="card-value">${events.length}</div>
          <div class="card-label">Total Events</div>
        </div>
      </div>

      <div class="table-container">
        <div class="table-header"><h3>Events to Judge</h3></div>
        <table>
          <thead><tr><th>Event</th><th>Category</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            ${events.map(ev => `
              <tr>
                <td>${ev.name}</td>
                <td>${ev.category}</td>
                <td>${formatDate(ev.eventDate)}</td>
                <td>${ev.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* -------------------------
   Winners Section
--------------------------*/
function populateWinnersSection() {
  const section = document.getElementById('winners');
  if (!section) return;
  const winnerGrid = section.querySelector('.winner-grid');
  if (!winnerGrid) return;
  
  winnerGrid.innerHTML = `
    <div class="winner-card">
      <i class="fas fa-trophy trophy-gold"></i>
      <h4>1st Place</h4>
      <h3>Classical Dance</h3>
      <p><strong>Priya Sharma</strong></p>
    </div>
    <div class="winner-card">
      <i class="fas fa-trophy trophy-silver"></i>
      <h4>2nd Place</h4>
      <h3>Battle of Bands</h3>
      <p><strong>Thunderbolts</strong></p>
    </div>
    <div class="winner-card">
      <i class="fas fa-trophy trophy-bronze"></i>
      <h4>3rd Place</h4>
      <h3>Street Play</h3>
      <p><strong>Abhivyakti Team</strong></p>
    </div>
  `;
}

/* -------------------------
   Window Exports
--------------------------*/
window.openModal = openModal;
window.closeModal = closeModal;
window.openDetailsModal = openDetailsModal;
window.queueRegistration = queueRegistration;
window.handleLogout = handleLogout;