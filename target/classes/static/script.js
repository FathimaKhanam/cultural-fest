/* script.js - Single-page app with dashboards + validation + judge/admin/student flows
  - Normalized events (1..18) to same schema
  - Admin + 5 Judges + sample Student inserted
  - Password minimum length: 8 (1 uppercase, 1 digit, 1 special)
  - Role-enforced login
  - Safe DOM guards (if modal markup missing script still works)
*/

/* -------------------------
  EVENTS - normalized format
   ------------------------- */
let events = [
  { id:1, name:"Classical Dance Competition", description:"Classical dance forms.", category:"DANCE", type:"SOLO", maxParticipants:1, maxRegistrations:30, currentRegistrations:18, registrationFee:200, eventDate:"2025-12-15", eventStartTime:"10:00", venue:"Main Auditorium", image:"./public/images/classical.jpg", participants:[{pid:101,name:"Alice",score:null},{pid:102,name:"Bob",score:null},{pid:103,name:"Rachel",score:null}], winner:null, isNew:true, status:"OPEN" },
  { id:2, name:"Band Competition", description:"Bands battle.", category:"MUSIC", type:"GROUP", maxParticipants:5, maxRegistrations:15, currentRegistrations:8, registrationFee:500, eventDate:"2025-12-18", eventStartTime:"14:00", venue:"Open Air Theatre", image:"./public/images/band.avif", participants:[{pid:201,name:"The Echoes",score:null},{pid:202,name:"Rising Star",score:null}], winner:null, isNew:false, status:"OPEN" },
  { id:3, name:"Street Play Competition", description:"Street plays with message.", category:"DRAMA", type:"TEAM", maxParticipants:10, maxRegistrations:10, currentRegistrations:6, registrationFee:0, eventDate:"2025-12-20", eventStartTime:"16:00", venue:"College Campus", image:"./public/images/street.jpg", participants:[{pid:301,name:"Street Players",score:null},{pid:302,name:"Drama Crew",score:null}], winner:null, isNew:false, status:"OPEN" },
  { id:4, name:"Solo Singing Competition", description:"A platform for solo singers to showcase melody and rhythm.", category:"MUSIC", type:"SOLO", maxParticipants:1, maxRegistrations:40, currentRegistrations:0, registrationFee:0, eventDate:"2025-12-10", eventStartTime:"11:00", venue:"Auditorium Hall B", image:"./public/images/solo_singing.webp", participants:[], winner:null, isNew:false, status:"OPEN" },
  { id:5, name:"Photography Contest", description:"Capture powerful visuals that tell a story.", category:"FINE ARTS", type:"SOLO", maxParticipants:1, maxRegistrations:50, currentRegistrations:0, registrationFee:0, eventDate:"2025-12-12", eventStartTime:"14:00", venue:"Photography Studio Block", image:"./public/images/photography.jpg", participants:[], winner:null, isNew:false, status:"OPEN" },
  { id:6, name:"Short Film Making", description:"Create short films within the given theme.", category:"DRAMA", type:"TEAM", maxParticipants:6, maxRegistrations:20, currentRegistrations:0, registrationFee:0, eventDate:"2025-12-14", eventStartTime:"09:00", venue:"Media Lab 3", image:"./public/images/shortfilm.jpg", participants:[], winner:null, isNew:false, status:"OPEN" },
  { id:7, name:"Debate Championship", description:"Present arguments, rebuttals & counterpoints.", category:"LITERARY", type:"TEAM", maxParticipants:3, maxRegistrations:30, currentRegistrations:0, registrationFee:0, eventDate:"2025-12-11", eventStartTime:"15:30", venue:"Seminar Hall 1", image:"./public/images/debate.jpg", participants:[], winner:null, isNew:false, status:"OPEN" },
  { id:8, name:"Poetry Slam", description:"Express your emotions and narratives through poems.", category:"LITERARY", type:"SOLO", maxParticipants:1, maxRegistrations:35, currentRegistrations:0, registrationFee:0, eventDate:"2025-12-19", eventStartTime:"10:30", venue:"Open Stage", image:"./public/images/poetry.jpg", participants:[], winner:null, isNew:false, status:"OPEN" },
  { id:9, name:"Painting & Sketching", description:"Showcase artistic creativity using colors & strokes.", category:"FINE ARTS", type:"SOLO", maxParticipants:1, maxRegistrations:45, currentRegistrations:0, registrationFee:0, eventDate:"2025-12-21", eventStartTime:"13:00", venue:"Art Studio", image:"./public/images/painting.jpeg", participants:[], winner:null, isNew:false, status:"OPEN" },
  { id:10, name:"Group Dance Battle", description:"High-energy group dance battle across genres.", category:"DANCE", type:"GROUP", maxParticipants:8, maxRegistrations:25, currentRegistrations:0, registrationFee:0, eventDate:"2025-12-22", eventStartTime:"16:00", venue:"Main Arena", image:"./public/images/groupdance.jpg", participants:[], winner:null, isNew:false, status:"OPEN" },
  { id:11, name:"Fashion Show", description:"Walk the ramp with style, elegance and creativity.", category:"FASHION", type:"GROUP", maxParticipants:6, maxRegistrations:20, currentRegistrations:0, registrationFee:0, eventDate:"2025-12-23", eventStartTime:"19:00", venue:"Stage Hall C", image:"./public/images/fashionshow.jpg", participants:[], winner:null, isNew:false, status:"OPEN" },
  { id:12, name:"Stand-up Comedy", description:"Show your comedic timing and delivery.", category:"ENTERTAINMENT", type:"SOLO", maxParticipants:1, maxRegistrations:30, currentRegistrations:0, registrationFee:0, eventDate:"2025-12-09", eventStartTime:"17:00", venue:"Comedy Lounge", image:"./public/images/standupcomedy.jpg", participants:[], winner:null, isNew:false, status:"OPEN" },
  { id:13, name:"Treasure Hunt", description:"Solve clues and race to victory.", category:"FUN", type:"TEAM", maxParticipants:5, maxRegistrations:100, currentRegistrations:0, registrationFee:0, eventDate:"2025-12-24", eventStartTime:"14:00", venue:"Campus Ground", image:"./public/images/treasurehunt.jpg", participants:[], winner:null, isNew:false, status:"OPEN" },
  { id:14, name:"Quiz Contest", description:"Compete on knowledge, logic, puzzles & GK.", category:"LITERARY", type:"TEAM", maxParticipants:4, maxRegistrations:60, currentRegistrations:0, registrationFee:0, eventDate:"2025-12-13", eventStartTime:"10:00", venue:"Hall 204", image:"./public/images/quiz.webp", participants:[], winner:null, isNew:false, status:"OPEN" },
  { id:15, name:"Instrumental Solo", description:"Play your favorite instrument and mesmerize the crowd.", category:"MUSIC", type:"SOLO", maxParticipants:1, maxRegistrations:30, currentRegistrations:0, registrationFee:0, eventDate:"2025-12-25", eventStartTime:"12:00", venue:"Music Lab", image:"./public/images/instrumental.webp", participants:[], winner:null, isNew:false, status:"OPEN" },
  { id:16, name:"Mime Performance", description:"Convey emotion & story without words.", category:"DRAMA", type:"SOLO", maxParticipants:1, maxRegistrations:20, currentRegistrations:0, registrationFee:0, eventDate:"2025-12-16", eventStartTime:"14:30", venue:"Mini Auditorium", image:"./public/images/mime.jpg", participants:[], winner:null, isNew:false, status:"OPEN" },
  { id:17, name:"Digital Art Contest", description:"Create digital artworks using modern tools.", category:"FINE ARTS", type:"SOLO", maxParticipants:1, maxRegistrations:40, currentRegistrations:0, registrationFee:0, eventDate:"2025-12-17", eventStartTime:"11:30", venue:"Computer Lab 5", image:"./public/images/digitalart.jpg", participants:[], winner:null, isNew:false, status:"OPEN" },
  { id:18, name:"Creative Writing Contest", description:"Write stories, essays, or narratives on themed topics.", category:"LITERARY", type:"SOLO", maxParticipants:1, maxRegistrations:50, currentRegistrations:0, registrationFee:0, eventDate:"2025-12-26", eventStartTime:"09:30", venue:"Library Conference Room", image:"./public/images/creativewriting.jpg", participants:[], winner:null, isNew:false, status:"OPEN" }
];

/* -------------------------
  Registered user
--------------------------
let registeredUsers = [
  { name: "Admin", email: "admin@klu.com", password: "Admin@1234", role: "ADMIN" },
  { name: "Judge One",   email: "judge1@klu.com", password: "Judge@1234", role: "JUDGE" },
  { name: "Judge Two",   email: "judge2@klu.com", password: "Judge@1234", role: "JUDGE" },
  { name: "Judge Three", email: "judge3@klu.com", password: "Judge@1234", role: "JUDGE" },
  { name: "Judge Four",  email: "judge4@klu.com", password: "Judge@1234", role: "JUDGE" },
  { name: "Judge Five",  email: "judge5@klu.com", password: "Judge@1234", role: "JUDGE" },
  { name: "Fathima",   email: "fathima@klu.com", password: "Fathima@08", role: "STUDENT" },
  { name: "Ghouse",   email: "ghouse@klu.com", password: "Ghouse@039", role: "STUDENT" },
  { name: "Rachel",   email: "rachel@klu.com", password: "Rachel@100", role: "STUDENT" },
  { name: "Vidhya",   email: "vidhya@klu.com", password: "Vidhya@189", role: "STUDENT" },
  { name: "Sruja",   email: "sruja@klu.com", password: "Sruja@023", role: "STUDENT" },
]; */

//let events = []; // Initialize empty events array
let userRegistrations = []; // { userEmail, eventId, status, score }
let notifyList = [];        // { eventId, email, mobile, time }
let currentUser = null;

/* -------------------------
  Validation patterns
  - email: simple domain tld check (com,in,net,org)
  - password: 1 uppercase, 1 digit, 1 special, length 8-40
--------------------------*/
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.(com|in|net|org)$/;
const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,40}$/;

async function loadUserRegistrations() {
  if (!currentUser || !currentUser.id) return;
  
  try {
    const response = await fetch(`http://localhost:8080/api/registrations/user/${currentUser.id}`);
    if (response.ok) {
      const registrations = await response.json();
      // Convert backend format to local format
      userRegistrations = registrations.map(r => ({
        userEmail: currentUser.email,
        eventId: r.event.id,
        status: r.status,
        score: r.score,
        registrationId: r.id
      }));
      console.log('Loaded registrations:', userRegistrations.length);
    }
  } catch (error) {
    console.error('Error loading registrations:', error);
  }
}

async function loadEventsFromBackend() {
  try {
    const response = await fetch("http://localhost:8080/api/events");
    if (response.ok) {
      events = await response.json();
      renderEvents();
    } else {
      console.error('Failed to load events from backend');
      // Keep using hard-coded events as fallback
    }
  } catch (error) {
    console.error('Error loading events:', error);
    // Keep using hard-coded events as fallback
  }
}

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
  Init
--------------------------
document.addEventListener('DOMContentLoaded', ()=>{
  renderEvents();
  attachGlobalHandlers();
  startSlider();
  populateWinnersSection();
}); */
document.addEventListener('DOMContentLoaded', ()=>{
  loadEventsFromBackend(); // Add this line
  renderEvents(); // Remove this line since loadEventsFromBackend calls it
  attachGlobalHandlers();
  startSlider();
  populateWinnersSection();
});
/* -------------------------
  Helpers
--------------------------*/
function formatDate(d){
  try{
    const dt = new Date(d);
    return dt.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});
  }catch(e){ return d || '-'; }
}
function openModal(id){
  const el = document.getElementById(id);
  if(!el) return;
  el.style.display = 'flex';
  el.setAttribute('aria-hidden','false');
}
function closeModal(id){
  const el = document.getElementById(id);
  if(!el) return;
  el.style.display = 'none';
  el.setAttribute('aria-hidden','true');
}
function closeAllModals(){
  document.querySelectorAll('.modal').forEach(m => { m.style.display = 'none'; m.setAttribute('aria-hidden','true'); });
}
function openLogin(){
  closeAllModals();
  openModal('loginModal');
}

function openRegister(){
  closeAllModals();
  openModal('registerModal');
}

function bindToggleRegisterButtons(){
  document.querySelectorAll(".toggle-register-btn").forEach(btn=>{
    btn.onclick = () => {
      const eventId = parseInt(btn.dataset.id);
      const ev = events.find(e => e.id === eventId);
      if(!ev) return;

      // Not logged in â†’ force login
      if(!currentUser){
        document.querySelectorAll('.role-tab').forEach(t=>t.classList.remove('active'));
        document.querySelector('.role-tab[data-role="STUDENT"]').classList.add('active');
        openLogin();
        return;
      }

      // Only student can register
      if(currentUser.role !== "STUDENT"){
        alert("Only students can register.");
        return;
      }

      const index = userRegistrations.findIndex(r =>
        r.userEmail === currentUser.email && r.eventId === eventId
      );

      if(index !== -1){
        userRegistrations.splice(index, 1);
        ev.currentRegistrations = Math.max(0, ev.currentRegistrations - 1);
        alert("Unregistered successfully");
      } else {
        userRegistrations.push({
          userEmail: currentUser.email,
          eventId,
          status: "REGISTERED",
          score: null
        });
        ev.currentRegistrations++;
        alert("Registered successfully");
      }

      renderEvents();
      if(currentUser) renderDashboardFor("student");
    };
  });
}


/* -------------------------
  RENDER EVENTS GRID
--------------------------*/
function renderEvents(){
  const grid = document.getElementById("eventsGrid");
  if(!grid) return;

  grid.innerHTML = "";

  events.forEach(ev => {

    const isRegistered = currentUser &&
      userRegistrations.some(r => r.userEmail === currentUser.email && r.eventId === ev.id);

    const btnText = isRegistered ? "Registered" : "Register";
    const btnClass = isRegistered ? "btn btn-success" : "btn btn-primary";

    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML = `
      <div class="event-image" style="background-image:url('${ev.image}')"></div>
      <div class="event-content">
        <div class="event-category">${ev.category}</div>
        <h3>${ev.name}</h3>
        <div class="event-details">
          <div>${ev.eventDate}</div>
          <div>${ev.venue}</div>
          <div>${ev.currentRegistrations}/${ev.maxRegistrations} Registered</div>
        </div>

        <button 
          class="${btnClass} toggle-register-btn" 
          data-id="${ev.id}">
          ${btnText}
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  bindToggleRegisterButtons();
}



/* -------------------------
SLIDER
--------------------------*/
let slideIndex = 0, slideTimer = null;
function startSlider(){
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.indicator');
  if(!slides || !slides.length) return;
  function show(i){
    slides.forEach(s=> s.classList.remove('active'));
    if(dots) dots.forEach(d=> d.classList.remove('active'));
    const idx = (i + slides.length) % slides.length;
    slides[idx].classList.add('active');
    if(dots && dots[idx]) dots[idx].classList.add('active');
    slideIndex = idx;
  }
  show(0);
  if(slideTimer) clearInterval(slideTimer);
  slideTimer = setInterval(()=> show(slideIndex+1), 4500);
  if(dots) dots.forEach((dot, idx)=> dot.addEventListener('click', ()=>{ clearInterval(slideTimer); show(idx); startSlider(); }));
}

/* -------------------------
  NOTIFY: dynamic modal builder (if missing)
--------------------------*/
function ensureNotifyModalExists(){
  if(document.getElementById('notifyModal')) return;
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'notifyModal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal" onclick="closeModal('notifyModal')">&times;</span>
      <h3>Notify Me</h3>
      <p id="notifyEventName"></p>
      <label>Email (optional)</label>
      <input id="notifyEmail" type="email" placeholder="you@domain.com" />
      <label>Mobile (optional)</label>
      <input id="notifyMobile" type="tel" placeholder="10-digit mobile" />
      <div style="text-align:right;margin-top:10px">
        <button class="btn btn-primary" id="confirmNotifyBtn">Confirm</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('confirmNotifyBtn').addEventListener('click', ()=>{
    const id = parseInt(document.getElementById('confirmNotifyBtn').dataset.eventId,10);
    const email = document.getElementById('notifyEmail').value.trim();
    const mobile = document.getElementById('notifyMobile').value.trim();
    if(!email && !mobile){ alert('Please enter at least email or mobile'); return; }
    notifyList.push({ eventId: id, email, mobile, time: new Date() });
    alert('We will notify you about updates!');
    document.getElementById('notifyEmail').value = '';
    document.getElementById('notifyMobile').value = '';
    closeModal('notifyModal');
  });
}
function openNotifyModal(eventId){
  ensureNotifyModalExists();
  const ev = events.find(e => e.id == eventId);
  if(ev) document.getElementById('notifyEventName').textContent = ev.name;
  document.getElementById('confirmNotifyBtn').dataset.eventId = eventId;
  openModal('notifyModal');
}

document.addEventListener("DOMContentLoaded", () => {
  const notifyButtons = document.querySelectorAll(".notify-btn");

  notifyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Force Student Tab Active
      document.querySelectorAll(".role-tab").forEach(tab => {
        tab.classList.remove("active");
      });

      document.querySelector('.role-tab[data-role="STUDENT"]').classList.add("active");

      // Open Login Modal
      openLogin();
    });
  });
});

document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", e => {
    if (btn.type !== "submit") e.preventDefault();
  });
});


/* -------------------------
  Global Handlers
--------------------------*/
function attachGlobalHandlers(){
  // Safe guards for missing elements
  const openLogin = document.getElementById('openLogin');
  const openRegisterBtn = document.getElementById('openRegister');
  if(openLogin) openLogin.addEventListener('click', ()=> openModal('loginModal'));
  if(openRegisterBtn) openRegisterBtn.addEventListener('click', ()=> openModal('registerModal'));

  // Close modals when clicking outside
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', (ev)=> {
      if(ev.target === m) closeModal(m.id);
    });
  });

  // Profile icon toggle
  if(profileIcon){
    profileIcon.addEventListener('click', (e)=>{
      e.stopPropagation();
      const d = document.getElementById('profileDropdown');
      if(!d) return;
      d.style.display = (d.style.display === 'block') ? 'none' : 'block';
    });
  }
  document.addEventListener('click', (e)=>{
    const d = document.getElementById('profileDropdown');
    if(d && profileMenu && !profileMenu.contains(e.target)) d.style.display = 'none';
  });

  // logout
  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn) logoutBtn.addEventListener('click', ()=> handleLogout());

  // role tabs toggling (login modal)
  document.querySelectorAll('.role-tab').forEach(t=>{
    t.addEventListener('click', ()=> {
      document.querySelectorAll('.role-tab').forEach(x=> x.classList.remove('active'));
      t.classList.add('active');
    });
  });

  // login form
  const loginForm = document.getElementById('loginForm');
  if(loginForm) loginForm.addEventListener('submit', handleLogin);

  // register form
  const registerForm = document.getElementById('registerForm');
  if(registerForm) registerForm.addEventListener('submit', handleRegister);


  // create event form (if exists)
  const createEventForm = document.getElementById('createEventForm');
  if(createEventForm) {
    createEventForm.addEventListener('submit', e=>{
      e.preventDefault();
      handleCreateEvent();
    });
  }

  // image upload preview for create event (if exists)
  const uploadEl = document.getElementById('eventImageUpload');
  if(uploadEl){
    uploadEl.addEventListener('change', function(){
      const file = this.files[0]; if(!file) return;
      const reader = new FileReader();
      reader.onload = ()=> {
        const img = document.getElementById('eventImagePreview');
        if(img){ img.src = reader.result; img.dataset.imageData = reader.result; }
      };
      reader.readAsDataURL(file);
    });
  }

  // Edit event form
  const editEventForm = document.getElementById('editEventForm');
  if(editEventForm) {
    editEventForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const id = parseInt(document.getElementById('editEventId').value,10);
      const ev = events.find(x=> x.id === id);
      if(!ev) return alert('Event not found');
      ev.name = document.getElementById('editName').value.trim();
      ev.description = document.getElementById('editDesc').value.trim();
      ev.category = document.getElementById('editCategory').value;
      ev.type = document.getElementById('editType').value;
      ev.maxParticipants = parseInt(document.getElementById('editMaxParticipants').value) || ev.maxParticipants;
      ev.maxRegistrations = parseInt(document.getElementById('editMaxRegistrations').value) || ev.maxRegistrations;
      ev.eventDate = document.getElementById('editEventDate').value;
      ev.eventStartTime = document.getElementById('editEventTime').value;
      ev.venue = document.getElementById('editVenue').value;
      closeModal('editEventModal');
      renderEvents();
      if(currentUser) renderDashboardFor(currentUser.role.toLowerCase());
      alert('Event updated');
    });
  }

  // Submit judge marks button (exists in login HTML earlier)
  const submitMarksBtn = document.getElementById('submitMarks');
  if(submitMarksBtn){
    submitMarksBtn.addEventListener('click', ()=>{
      const eventId = parseInt(submitMarksBtn.dataset.eventId,10);
      const participantId = parseInt(submitMarksBtn.dataset.participantId,10);
      const marks = parseFloat(document.getElementById('judgeMarksInput').value);
      if(isNaN(marks) || marks < 0 || marks > 100) return alert('Enter marks 0-100');
      const ev = events.find(e=> e.id === eventId);
      if(!ev) return alert('Event not found');
      const p = ev.participants.find(pp => pp.pid === participantId);
      if(!p) return alert('Participant not found');
      p.score = marks;
      closeModal('judgeModal');
      if(currentUser) renderDashboardFor(currentUser.role.toLowerCase()); else renderEvents();
      alert('Marks saved');
    });
  }

  // If admin wants to create judge via form in page (dynamic open)
  const createJudgeForm = document.getElementById('createJudgeForm');
  if(createJudgeForm){
    createJudgeForm.addEventListener('submit', (e)=> {
      e.preventDefault();
      const judgeName = document.getElementById('judgeName').value.trim();
      const judgeEmail = document.getElementById('judgeEmail').value.trim();
      const judgePassword = document.getElementById('judgePassword').value.trim();
      if(!emailPattern.test(judgeEmail)){ alert('Invalid email format'); return; }
      if(!passwordPattern.test(judgePassword)){ alert('Weak password. Must be 8-40 chars, 1 uppercase, 1 number and 1 special char.'); return; }
      //if(registeredUsers.some(u=> u.email === judgeEmail)){ alert('Judge already exists'); return; }
      // Only admin can create judge
      if(!currentUser || currentUser.role !== 'ADMIN'){ alert('Only Admin can create judges'); return; }
      registeredUsers.push({ name: judgeName, email: judgeEmail, password: judgePassword, role: "JUDGE" });
      alert('Judge created');
      // close modal if exists
      closeModal('createJudgeModal');
      if(currentUser) renderDashboardFor(currentUser.role.toLowerCase());
    });
  }
}

/* -------------------------
  LOGIN / REGISTER / AUTH
--------------------------*/
async function handleLogin(e){
  e && e.preventDefault && e.preventDefault();
  const emailEl = document.getElementById('loginEmail');
  const pwdEl = document.getElementById('loginPassword');
  if(!emailEl || !pwdEl) return;
  const email = emailEl.value.trim();
  const password = pwdEl.value.trim();
  
  const activeTab = document.querySelector('.role-tab.active');
  const selectedRole = (activeTab && activeTab.dataset.role) ? activeTab.dataset.role.toUpperCase() : 'STUDENT';

  if(!emailPattern.test(email)){ alert('Invalid email format. Example: username@domain.com'); return; }
  if(!passwordPattern.test(password)){ alert('Password must be 8â€“40 chars, include 1 uppercase, 1 number and 1 special char.'); return; }

  try {
    const response = await fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role: selectedRole })
    });

    if (!response.ok) {
      if (response.status === 401) {
        if(selectedRole === 'STUDENT'){
          ensureNotRegisteredModal();
          openModal('notRegisteredModal');
        } else {
          alert('Invalid credentials or role.');
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Login failed');
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
    afterLogin();
  } catch (error) {
    console.error('Login error:', error);
    alert('Failed to connect to server. Please try again.');
  }
}

/*
function handleRegister(e){
  e && e.preventDefault && e.preventDefault();
  const fm = e.target;
  if(!fm) return;
  const fd = new FormData(fm);
  const name = (fd.get('name')||'').trim();
  const email = (fd.get('email')||'').trim();
  const password = (fd.get('password')||'').trim();
  const confirm = (fd.get('confirm')||'').trim();
  // Only students can register on UI
  const role = 'STUDENT';

  if(!name){ alert('Enter name'); return; }
  if(!emailPattern.test(email)){ alert('Email must be like username@domain.com'); return; }
  if(password !== confirm){ alert('Passwords do not match'); return; }
  if(!passwordPattern.test(password)){ alert('Password must be 8â€“40 chars, include 1 uppercase, 1 number and 1 special char.'); return; }
  if(registeredUsers.some(u=> u.email.toLowerCase() === email.toLowerCase())){ alert('User already registered'); return; }

  //registeredUsers.push({ name, email, password, role });*/
async function handleRegister(e){
  e && e.preventDefault && e.preventDefault();
  const fm = e.target;
  if(!fm) return;
  const fd = new FormData(fm);
  const name = (fd.get('name')||'').trim();
  const email = (fd.get('email')||'').trim();
  const password = (fd.get('password')||'').trim();
  const confirm = (fd.get('confirm')||'').trim();
  const role = 'STUDENT';

  if(!name){ alert('Enter name'); return; }
  if(!emailPattern.test(email)){ alert('Email must be like username@domain.com'); return; }
  if(password !== confirm){ alert('Passwords do not match'); return; }
  if(!passwordPattern.test(password)){ 
    alert('Password must be 8â€“40 chars, include 1 uppercase, 1 number and 1 special char.'); 
    return; 
  }

  try {
    const response = await fetch("http://localhost:8080/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.error || 'Registration failed');
      return;
    }

    alert('Registered successfully. Please login.');
    closeModal('registerModal');
    openModal('loginModal');
  } catch (error) {
    console.error('Registration error:', error);
    alert('Failed to connect to server. Please try again.');
  }
}

/* Creates a small "not registered" modal if missing */
function ensureNotRegisteredModal(){
  if(document.getElementById('notRegisteredModal')) return;
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'notRegisteredModal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal" onclick="closeModal('notRegisteredModal')">&times;</span>
      <h3>Not Registered</h3>
      <p>This email is not registered. Would you like to register as a student?</p>
      <div style="text-align:right;margin-top:12px">
        <button class="btn btn-outline" onclick="closeModal('notRegisteredModal')">Cancel</button>
        <button class="btn btn-primary" onclick="openRegisterAndClose()">Register</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}
window.openRegisterAndClose = function(){ closeAllModals(); openModal('registerModal'); };

/* -------------------------
  AFTER LOGIN: UI switch
-------------------------

async function afterLogin(){
  if(navAuthButtons) navAuthButtons.style.display = 'none';
  if(profileMenu) profileMenu.style.display = 'flex';
  if(profileNameEl) profileNameEl.textContent = currentUser.name || currentUser.email;
  if(profileEmailEl) profileEmailEl.textContent = currentUser.email;
  
  // Hide main page sections
  const hero = document.querySelector('.hero'); if(hero) hero.style.display = 'none';
  const coming = document.getElementById('coming-soon'); if(coming) coming.style.display = 'none';
  const eventsSec = document.querySelector('.events-section'); if(eventsSec) eventsSec.style.display = 'none';
  const winners = document.getElementById('winners'); if(winners) winners.style.display = 'none';
  const contact = document.getElementById('contact'); if(contact) contact.style.display = 'none';
  
  // Show dashboard container
  if(!document.getElementById('dashboardContainer')) {
    const container = document.createElement('div'); 
    container.id = 'dashboardContainer'; 
    document.body.appendChild(container);
  }
  document.getElementById('dashboardContainer').style.display = 'block';
  // Close login modal
  closeModal('loginModal');
  
  // Load user data if student
  if (currentUser.role === 'STUDENT') {
    await loadUserRegistrations();
  }
  
  renderDashboardFor(currentUser.role.toLowerCase());
}
async function afterLogin(){
  if(navAuthButtons) navAuthButtons.style.display = 'none';
  if(profileMenu) profileMenu.style.display = 'flex';
  if(profileNameEl) profileNameEl.textContent = currentUser.name || currentUser.email;
  if(profileEmailEl) profileEmailEl.textContent = currentUser.email;
  
  // Hide main page sections
  const hero = document.querySelector('.hero'); if(hero) hero.style.display = 'none';
  const coming = document.getElementById('coming-soon'); if(coming) coming.style.display = 'none';
  const eventsSec = document.querySelector('.events-section'); if(eventsSec) eventsSec.style.display = 'none';
  const winners = document.getElementById('winners'); if(winners) winners.style.display = 'none';
  const contact = document.getElementById('contact'); if(contact) contact.style.display = 'none';
  
  // Show dashboard container
  if(!document.getElementById('dashboardContainer')) {
    const container = document.createElement('div'); 
    container.id = 'dashboardContainer'; 
    document.body.appendChild(container);
  }
  document.getElementById('dashboardContainer').style.display = 'block';
  closeModal('loginModal');
  
  // ✅ Load data based on role
  if (currentUser.role === 'STUDENT') {
    await loadUserRegistrations();
  } else if (currentUser.role === 'JUDGE') {
    // Judge data will be loaded in renderJudgeDashboard()
  }
  
  renderDashboardFor(currentUser.role.toLowerCase());
}*/
async function afterLogin(){
  if(navAuthButtons) navAuthButtons.style.display = 'none';
  if(profileMenu) profileMenu.style.display = 'flex';
  if(profileNameEl) profileNameEl.textContent = currentUser.name || currentUser.email;
  if(profileEmailEl) profileEmailEl.textContent = currentUser.email;
  
  // Hide main page sections
  const hero = document.querySelector('.hero'); if(hero) hero.style.display = 'none';
  const coming = document.getElementById('coming-soon'); if(coming) coming.style.display = 'none';
  const eventsSec = document.querySelector('.events-section'); if(eventsSec) eventsSec.style.display = 'none';
  const winners = document.getElementById('winners'); if(winners) winners.style.display = 'none';
  const contact = document.getElementById('contact'); if(contact) contact.style.display = 'none';
  
  // Show dashboard container
  if(!document.getElementById('dashboardContainer')) {
    const container = document.createElement('div'); 
    container.id = 'dashboardContainer'; 
    document.body.appendChild(container);
  }
  document.getElementById('dashboardContainer').style.display = 'block';
  closeModal('loginModal');
  
  // Load data based on role
  if (currentUser.role === 'STUDENT') {
    await loadUserRegistrations();
    renderDashboardFor('student');
  } else if (currentUser.role === 'JUDGE') {
    await renderJudgeDashboard(); // ✅ This will load and display judge data
  } else if (currentUser.role === 'ADMIN') {
    renderDashboardFor('admin');
  }
}
/* Logout */
function handleLogout(){
  currentUser = null;
  if(profileMenu) profileMenu.style.display = 'none';
  if(navAuthButtons) navAuthButtons.style.display = 'flex';
  // restore main sections
  const hero = document.querySelector('.hero'); if(hero) hero.style.display = '';
  const coming = document.getElementById('coming-soon'); if(coming) coming.style.display = '';
  const eventsSec = document.querySelector('.events-section'); if(eventsSec) eventsSec.style.display = '';
  const winners = document.getElementById('winners'); if(winners) winners.style.display = '';
  const contact = document.getElementById('contact'); if(contact) contact.style.display = '';
  const dash = document.getElementById('dashboardContainer'); if(dash) { dash.style.display = 'none'; dash.innerHTML = ''; }
  renderEvents();
}

/* -------------------------
  DETAILS / REGISTER FLOW
--------------------------*/
function openDetailsModal(id){
  const ev = events.find(e=> e.id === id);
  if(!ev) return alert('Event not found');
  // Ensure eventDetailsModal exists in DOM
  const modal = document.getElementById('eventDetailsModal');
  if(!modal) {
    // build quick details modal
    const m = document.createElement('div'); m.className='modal'; m.id='eventDetailsModal'; m.innerHTML = `
      <div class="modal-content modal-medium">
        <span class="close-modal" onclick="closeModal('eventDetailsModal')">&times;</span>
        <h3 id="eventDetailsTitle"></h3>
        <img id="eventDetailsImage" alt="event" style="width:100%;border-radius:8px;margin:10px 0;">
        <p><strong>Date:</strong> <span id="eventDetailsDate"></span></p>
        <p><strong>Time:</strong> <span id="eventDetailsTime"></span></p>
        <p><strong>Venue:</strong> <span id="eventDetailsVenue"></span></p>
        <p id="eventDetailsDesc"></p>
        <div style="text-align:right">
          <button class="btn btn-success" id="modalRegisterBtn" style="display:none">Register as Student</button>
        </div>
      </div>
    `;
    document.body.appendChild(m);
    // attach action
    document.getElementById('modalRegisterBtn').addEventListener('click', ()=> {
      const eventId = parseInt(document.getElementById('modalRegisterBtn').dataset.eventId,10);
      document.getElementById('registerEventName') && (document.getElementById('registerEventName').textContent = ev.name);
      document.getElementById('confirmRegistration') && (document.getElementById('confirmRegistration').dataset.eventId = eventId);
      openModal('registerConfirmModal');
    });
  }
  // populate
  document.getElementById('eventDetailsTitle').textContent = ev.name;
  document.getElementById('eventDetailsImage').src = ev.image;
  document.getElementById('eventDetailsDate').textContent = formatDate(ev.eventDate);
  document.getElementById('eventDetailsTime').textContent = ev.eventStartTime;
  document.getElementById('eventDetailsVenue').textContent = ev.venue;
  document.getElementById('eventDetailsDesc').textContent = ev.description;
  const regBtn = document.getElementById('modalRegisterBtn');
  if(regBtn){
    if(currentUser && currentUser.role === 'STUDENT'){ regBtn.style.display = 'inline-flex'; regBtn.dataset.eventId = ev.id; }
    else regBtn.style.display = 'none';
  }
  openModal('eventDetailsModal');
}

/* Registration confirm (button present in index.html earlier) */
const confirmRegBtn = document.getElementById('confirmRegistration');
if(confirmRegBtn){
  confirmRegBtn.addEventListener('click', ()=>{
    const id = parseInt(confirmRegBtn.dataset.eventId,10);
    if(!currentUser || currentUser.role !== 'STUDENT'){ alert('Please login as student to register'); closeModal('registerConfirmModal'); return; }
    if(userRegistrations.some(r=> r.userEmail === currentUser.email && r.eventId===id)){ alert('Already registered'); closeModal('registerConfirmModal'); return; }
    userRegistrations.push({ userEmail: currentUser.email, eventId: id, status: 'REGISTERED', score: null });
    const ev = events.find(e=> e.id === id); if(ev) ev.currentRegistrations++;
    closeModal('registerConfirmModal');
    if(currentUser) renderDashboardFor(currentUser.role.toLowerCase());
    renderEvents();
    alert('Registration successful');
  });
}

/* -------------------------
  QUEUE REGISTER (from student dashboard)
--------------------------*/
async function queueRegistration(eventId){
  if(!currentUser){ alert('Please login as student to register'); openModal('loginModal'); return; }
  if(currentUser.role !== 'STUDENT'){ alert('Only students can register'); return; }
  
  try {
    const response = await fetch("http://localhost:8080/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        userId: currentUser.id,
        eventId: eventId 
      })
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.error || 'Registration failed');
      return;
    }

    alert('Registered successfully');
    
    // ✅ CRITICAL: Reload registrations from backend
    await loadUserRegistrations();
    
    // ✅ Then refresh the UI
    await loadEventsFromBackend();
    renderDashboardFor('student');
  } catch (error) {
    console.error('Registration error:', error);
    alert('Failed to register. Please try again.');
  }
}
/* -------------------------
  JUDGE: participants modal & scoring
--------------------------*/


  // Submit judge marks button (exists in login HTML earlier)
  const submitMarksBtn = document.getElementById('submitMarks');
  if(submitMarksBtn){
    submitMarksBtn.addEventListener('click', ()=>{
      const eventId = parseInt(submitMarksBtn.dataset.eventId,10);
      const participantId = parseInt(submitMarksBtn.dataset.participantId,10);
      const marks = parseFloat(document.getElementById('judgeMarksInput').value);
      if(isNaN(marks) || marks < 0 || marks > 100) return alert('Enter marks 0-100');
      const ev = events.find(e=> e.id === eventId);
      if(!ev) return alert('Event not found');
      const p = ev.participants.find(pp => pp.pid === participantId);
      if(!p) return alert('Participant not found');
      p.score = marks;
      closeModal('judgeModal');
      if(currentUser) renderDashboardFor(currentUser.role.toLowerCase()); else renderEvents();
      alert('Marks saved');
    });
  }

  // If admin wants to create judge via form in page (dynamic open)
  const createJudgeForm = document.getElementById('createJudgeForm');
  if(createJudgeForm){
    createJudgeForm.addEventListener('submit', (e)=> {
      e.preventDefault();
      const judgeName = document.getElementById('judgeName').value.trim();
      const judgeEmail = document.getElementById('judgeEmail').value.trim();
      const judgePassword = document.getElementById('judgePassword').value.trim();
      if(!emailPattern.test(judgeEmail)){ alert('Invalid email format'); return; }
      if(!passwordPattern.test(judgePassword)){ alert('Weak password. Must be 8-40 chars, 1 uppercase, 1 number and 1 special char.'); return; }
      if(registeredUsers.some(u=> u.email === judgeEmail)){ alert('Judge already exists'); return; }
      // Only admin can create judge
      if(!currentUser || currentUser.role !== 'ADMIN'){ alert('Only Admin can create judges'); return; }
      registeredUsers.push({ name: judgeName, email: judgeEmail, password: judgePassword, role: "JUDGE" });
      alert('Judge created');
      // close modal if exists
      closeModal('createJudgeModal');
      if(currentUser) renderDashboardFor(currentUser.role.toLowerCase());
    });
  }


function handleJudgeClick(eventId){
  if(!currentUser){ openModal('loginModal'); return; }
  if(currentUser.role !== 'JUDGE'){ alert('Only judges allowed'); return; }
  const ev = events.find(e=> e.id===eventId);
  if(!ev || !ev.participants || !ev.participants.length) return alert('No participants');
  openParticipantsModalForJudge(ev);
}

function openParticipantsModalForJudge(ev){
  // build a temporary modal listing participants (so we don't rely on page markup)
  const modal = document.createElement('div'); modal.className='modal'; modal.style.display='flex';
  const box = document.createElement('div'); box.className='modal-content';
  const closeX = document.createElement('span'); closeX.className='close-modal'; closeX.textContent='Ã—'; closeX.style.cursor='pointer'; closeX.onclick = ()=> document.body.removeChild(modal);
  box.appendChild(closeX);
  const h = document.createElement('h3'); h.textContent = `${ev.name} â€” Participants`; box.appendChild(h);

  // sort participants by name
  ev.participants.sort((a,b) => a.name.localeCompare(b.name));

  ev.participants.forEach(p=>{
    const row = document.createElement('div'); row.style.display='flex'; row.style.justifyContent='space-between'; row.style.alignItems='center'; row.style.margin='10px 0';
    const left = document.createElement('div'); left.innerHTML = `<strong>${p.name}</strong> ${p.score!==null?` â€” ${p.score}%`:''}`;
    const right = document.createElement('div');
    const scoreBtn = document.createElement('button'); scoreBtn.className='btn btn-primary'; scoreBtn.textContent='Score';
    scoreBtn.onclick = ()=> { document.body.removeChild(modal); openJudgeScoring(ev.id, p.pid); };
    right.appendChild(scoreBtn);
    row.appendChild(left); row.appendChild(right);
    box.appendChild(row);
  });
  

  // option to sort by score desc if some have scores
  const sortBtn = document.createElement('button'); sortBtn.className='btn btn-outline'; sortBtn.textContent='Sort by Score';
  sortBtn.style.marginTop='10px';
  sortBtn.onclick = ()=>{
    ev.participants.sort((a,b)=> (b.score||0) - (a.score||0));
    document.body.removeChild(modal);
    openParticipantsModalForJudge(ev);
  };
  box.appendChild(sortBtn);

  // add declare winner button
  const winnerBtn = document.createElement('button'); winnerBtn.className='btn btn-success'; winnerBtn.textContent='Declare Winner';
  winnerBtn.style.marginLeft='10px';
  winnerBtn.onclick = ()=> { document.body.removeChild(modal); declareWinner(ev.id); };
  box.appendChild(winnerBtn);

  modal.appendChild(box);
  document.body.appendChild(modal);
}

function openJudgeScoring(eventId, participantId){
  // populate judge modal (should exist)
  const ev = events.find(e=> e.id===eventId);
  if(!ev) return alert('Event not found');
  const p = ev.participants.find(pp=> pp.pid === participantId);
  if(!p) return alert('Participant not found');
  // ensure judgeModal exists in DOM
  if(!document.getElementById('judgeModal')){
    // create small modal
    const m = document.createElement('div'); m.className='modal'; m.id='judgeModal';
    m.innerHTML = `<div class="modal-content"><span class="close-modal" onclick="closeModal('judgeModal')">&times;</span><h3 id="judgeEventName"></h3><input id="judgeMarksInput" type="number" placeholder="Enter marks (0â€“100)" min="0" max="100"/><div style="text-align:right;margin-top:10px"><button id="submitMarks" class="btn btn-warning">Submit</button></div></div>`;
    document.body.appendChild(m);
    document.getElementById('submitMarks').addEventListener('click', ()=>{
      const eventId2 = parseInt(document.getElementById('submitMarks').dataset.eventId,10);
      const participantId2 = parseInt(document.getElementById('submitMarks').dataset.participantId,10);
      const marks = parseFloat(document.getElementById('judgeMarksInput').value);
      if(isNaN(marks) || marks<0 || marks>100) return alert('Enter valid marks 0-100');
      const ev2 = events.find(e=> e.id === eventId2);
      const p2 = ev2.participants.find(pp=> pp.pid === participantId2);
      p2.score = marks;
      closeModal('judgeModal');
      if(currentUser) renderDashboardFor(currentUser.role.toLowerCase());
      else renderEvents();
      alert('Marks saved');
    });
  }
  document.getElementById('judgeEventName').textContent = `${ev.name} â€” ${p.name}`;
  const sb = document.getElementById('submitMarks');
  sb.dataset.eventId = eventId;
  sb.dataset.participantId = participantId;
  document.getElementById('judgeMarksInput').value = p.score !== null ? p.score : '';
  openModal('judgeModal');
}

/* declare winner */
function declareWinner(eventId){
  const ev = events.find(e=> e.id === eventId);
  if(!ev) return alert('Event not found');
  const scored = ev.participants.filter(p=> p.score !== null);
  if(scored.length === 0) return alert('No scored participants');
  scored.sort((a,b)=> b.score - a.score);
  ev.winner = scored[0];
  // add winner info to userRegistrations or separate winners store if needed
  alert(`Winner declared: ${ev.winner.name} â€” ${ev.winner.score}%`);
  // Refresh the appropriate UI only
  if(currentUser) renderDashboardFor(currentUser.role.toLowerCase()); else renderEvents();
  populateWinnersSection();
}

/* -------------------------
  ADMIN: edit/delete helpers
--------------------------*/
function openEditModalById(id){
  const ev = events.find(e=> e.id === id);
  if(!ev) return alert('Event not found');
  // If editEventModal present populate fields, else create quick one
  if(!document.getElementById('editEventModal')){
    const m = document.createElement('div'); m.className='modal'; m.id='editEventModal';
    m.innerHTML = `<div class="modal-content modal-large"><span class="close-modal" onclick="closeModal('editEventModal')">&times;</span><h3>Edit Event</h3>
      <form id="editEventForm">
        <input id="editEventId" type="hidden" />
        <label>Name</label><input id="editName" />
        <label>Description</label><textarea id="editDesc"></textarea>
        <label>Category</label><input id="editCategory" />
        <label>Type</label><input id="editType" />
        <label>Max Participants</label><input id="editMaxParticipants" type="number" />
        <label>Max Registrations</label><input id="editMaxRegistrations" type="number" />
        <label>Date</label><input id="editEventDate" type="date" />
        <label>Time</label><input id="editEventTime" type="time" />
        <label>Venue</label><input id="editVenue" />
        <div style="text-align:right;margin-top:10px"><button class="btn btn-primary" type="submit">Save</button></div>
      </form></div>`;
    document.body.appendChild(m);
    // attach submit already handled in attachGlobalHandlers
    attachGlobalHandlers(); // to wire editEventForm submit listener
  }
  document.getElementById('editEventId').value = ev.id;
  document.getElementById('editName').value = ev.name;
  document.getElementById('editDesc').value = ev.description;
  document.getElementById('editCategory').value = ev.category;
  document.getElementById('editType').value = ev.type;
  document.getElementById('editMaxParticipants').value = ev.maxParticipants;
  document.getElementById('editMaxRegistrations').value = ev.maxRegistrations;
  document.getElementById('editEventDate').value = ev.eventDate;
  document.getElementById('editEventTime').value = ev.eventStartTime;
  document.getElementById('editVenue').value = ev.venue;
  openModal('editEventModal');
}

function deleteEvent(id){
  if(!confirm('Delete this event?')) return;
  events = events.filter(e=> e.id !== id);
  renderEvents();
  if(currentUser) renderDashboardFor(currentUser.role.toLowerCase());
}

/* -------------------------
  DASHBOARD RENDER
--------------------------*/
function refreshRoleButtons(){
  document.querySelectorAll('.judge-btn').forEach(b=> b.style.display = (currentUser && currentUser.role === 'JUDGE') ? 'inline-block' : 'none');
  // no register button on event cards per request
}

function renderDashboardFor(role){
  const r = (role||'').toLowerCase();
  if(r === 'student') renderStudentDashboard();
  else if(r === 'admin') renderAdminDashboard();
  else if(r === 'judge') renderJudgeDashboard();
}

/* Student Dashboard */
function renderStudentDashboard(){
  const root = document.getElementById('dashboardContainer');
  if(!root) return;
  const myRegs = userRegistrations.filter(r=> currentUser && r.userEmail === currentUser.email);
  const wins = events.filter(e => e.winner && myRegs.find(r=> r.eventId===e.id)).length;
  const scoredRegs = myRegs.filter(r=> r.score !== null);
  const avgScore = scoredRegs.length ? Math.round(scoredRegs.reduce((s,a)=> s + (a.score||0),0) / scoredRegs.length) : 'N/A';

  root.innerHTML = `
    <div class="dashboard-wrapper container">
      <div class="dashboard-header">
        <h2>Student Dashboard</h2>
        <div><button class="btn btn-outline" onclick="handleLogout()">Logout</button></div>
      </div>

      <div class="dashboard-cards">
        <div class="dashboard-card"><div class="card-icon"><i class="far fa-calendar-check"></i></div><div class="card-value">${myRegs.length}</div><div class="card-label">My Registrations</div></div>
        <div class="dashboard-card"><div class="card-icon"><i class="fas fa-trophy"></i></div><div class="card-value">${wins}</div><div class="card-label">Wins</div></div>
        <div class="dashboard-card"><div class="card-icon"><i class="fas fa-star"></i></div><div class="card-value">${avgScore}</div><div class="card-label">Average Score</div></div>
        <div class="dashboard-card"><div class="card-icon"><i class="fas fa-user"></i></div><div class="card-value">${currentUser.name}</div><div class="card-label">Profile</div></div>
      </div>

      <div class="table-container" style="margin-bottom:22px">
        <div class="table-header"><h3>My Registrations</h3></div>
        <table>
          <thead><tr><th>Event</th><th>Category</th><th>Date</th><th>Status</th><th>Score</th><th>Actions</th></tr></thead>
          <tbody>
            ${myRegs.map(r=>{
              const ev = events.find(e=> e.id === r.eventId) || {};
              return `<tr>
                        <td>${ev.name||'-'}</td>
                        <td>${ev.category||'-'}</td>
                        <td>${ev.eventDate?formatDate(ev.eventDate):'-'}</td>
                        <td>${r.status}</td>
                        <td>${r.score!==null? r.score+'%':'N/A'}</td>
                        <td>
                          <button class="btn btn-outline" onclick="openDetailsModal(${r.eventId})">View</button>
                          <button class="btn btn-danger" onclick="cancelRegistration(${r.eventId})">Cancel</button>
                        </td>
                      </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>

      <h3 style="color:var(--kl-blue);margin-bottom:12px">Available Events</h3>
      <div class="events-grid">
        ${events.map(ev => `
          <div class="event-card">
            <div class="event-image" style="background-image:url('${ev.image}')"></div>
            <div class="event-content">
              <div class="event-category">${ev.category}</div>
              <h3 class="event-name">${ev.name}</h3>
              <div class="event-details">
                <div><i class="far fa-calendar-alt"></i> ${formatDate(ev.eventDate)}</div>
                <div><i class="far fa-clock"></i> ${ev.eventStartTime}</div>
                <div><i class="fas fa-map-marker-alt"></i> ${ev.venue}</div>
              </div>
              <div class="event-actions">
                <button class="btn btn-outline" onclick="openDetailsModal(${ev.id})">Details</button>
                <button class="btn btn-primary" onclick="queueRegistration(${ev.id})">Register</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* cancel registration 
function cancelRegistration(eventId){
  if(!confirm('Cancel registration?')) return;
  userRegistrations = userRegistrations.filter(r => !(r.userEmail === currentUser.email && r.eventId === eventId));
  const ev = events.find(e=> e.id === eventId); if(ev) ev.currentRegistrations = Math.max(0, ev.currentRegistrations-1);
  renderEvents();
  renderDashboardFor('student');
}*/

async function cancelRegistration(eventId){
  if(!confirm('Cancel registration?')) return;
  
  // Find the registration ID
  const reg = userRegistrations.find(r => r.eventId === eventId);
  if (!reg || !reg.registrationId) {
    alert('Registration not found');
    return;
  }
  
  try {
    const response = await fetch(`http://localhost:8080/api/registrations/${reg.registrationId}`, {
      method: "DELETE"
    });
    
    if (!response.ok) {
      const error = await response.json();
      alert(error.error || 'Failed to cancel registration');
      return;
    }
    
    // Remove from local array
    userRegistrations = userRegistrations.filter(r => r.eventId !== eventId);
    
    // Update event registration count
    const ev = events.find(e => e.id === eventId);
    if(ev) ev.currentRegistrations = Math.max(0, ev.currentRegistrations - 1);
    
    alert('Registration cancelled successfully');
    renderEvents();
    renderDashboardFor('student');
  } catch (error) {
    console.error('Cancel registration error:', error);
    alert('Failed to cancel registration. Please try again.');
  }
}


/* Judge Dashboard */

async function loadJudgeAssignments() {
  if (!currentUser || !currentUser.id || currentUser.role !== 'JUDGE') return;
  
  try {
    const response = await fetch(`http://localhost:8080/api/judges/user/${currentUser.id}`);
    if (response.ok) {
      const assignments = await response.json();
      return assignments; // Returns array of Judge objects with event data
    }
  } catch (error) {
    console.error('Error loading judge assignments:', error);
  }
  return [];
}

async function renderJudgeDashboard(){
  const root = document.getElementById('dashboardContainer');
  if(!root) return;
  
  // ✅ Load actual assignments from backend
  const assignments = await loadJudgeAssignments();
  const assigned = assignments.map(a => a.event); // Extract event objects
  
  const totalAssigned = assigned.length;
  
  // ✅ Load participants for each assigned event
  let participantsToJudge = 0;
  let judged = 0;
  
  for(const ev of assigned) {
    try {
      const response = await fetch(`http://localhost:8080/api/registrations/event/${ev.id}`);
      if (response.ok) {
        const registrations = await response.json();
        participantsToJudge += registrations.length;
        judged += registrations.filter(r => r.score !== null).length;
      }
    } catch(error) {
      console.error('Error loading participants:', error);
    }
  }

  root.innerHTML = `
    <div class="dashboard-wrapper container">
      <div class="dashboard-header">
        <h2>Judge Dashboard</h2>
        <div><button class="btn btn-outline" onclick="handleLogout()">Logout</button></div>
      </div>

      <div class="dashboard-cards">
        <div class="dashboard-card"><div class="card-icon"><i class="fas fa-gavel"></i></div><div class="card-value">${totalAssigned}</div><div class="card-label">Assigned Events</div></div>
        <div class="dashboard-card"><div class="card-icon"><i class="fas fa-user-friends"></i></div><div class="card-value">${participantsToJudge}</div><div class="card-label">Participants</div></div>
        <div class="dashboard-card"><div class="card-icon"><i class="fas fa-check-circle"></i></div><div class="card-value">${judged}</div><div class="card-label">Judged</div></div>
        <div class="dashboard-card"><div class="card-icon"><i class="fas fa-user"></i></div><div class="card-value">${currentUser.name}</div><div class="card-label">Profile</div></div>
      </div>

      <div class="table-container">
        <div class="table-header"><h3>Assigned Events</h3></div>
        <table>
          <thead><tr><th>Event</th><th>Category</th><th>Date</th><th>Participants</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${assigned.length === 0 ? 
              '<tr><td colspan="6" style="text-align:center;padding:20px;color:#666;">No events assigned yet. Contact admin to get assigned to events.</td></tr>' :
              assigned.map(ev => `
              <tr>
                <td>${ev.name}</td>
                <td>${ev.category}</td>
                <td>${formatDate(ev.eventDate)}</td>
                <td id="participants-${ev.id}">Loading...</td>
                <td>${ev.status}</td>
                <td>
                  <button class="btn btn-outline" onclick="viewEventParticipants(${ev.id})">View Participants</button>
                  <button class="btn btn-primary" onclick="openScoreEvent(${ev.id})">Score</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  // ✅ Update participant counts
  for(const ev of assigned) {
    const cell = document.getElementById(`participants-${ev.id}`);
    if(cell) {
      try {
        const response = await fetch(`http://localhost:8080/api/registrations/event/${ev.id}`);
        if (response.ok) {
          const registrations = await response.json();
          cell.textContent = registrations.length;
        } else {
          cell.textContent = '0';
        }
      } catch(error) {
        cell.textContent = 'Error';
      }
    }
  }
}

// ✅ View participants for an event
async function viewEventParticipants(eventId) {
  try {
    const response = await fetch(`http://localhost:8080/api/registrations/event/${eventId}`);
    if (!response.ok) {
      alert('Failed to load participants');
      return;
    }
    
    const registrations = await response.json();
    const ev = events.find(e => e.id === eventId);
    
    if(registrations.length === 0) {
      alert('No participants registered for this event yet.');
      return;
    }
    
    // Create modal to show participants
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal" onclick="this.closest('.modal').remove()">&times;</span>
        <h3>${ev ? ev.name : 'Event'} - Participants</h3>
        <table style="width:100%; margin-top:15px;">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Status</th><th>Score</th><th>Action</th></tr>
          </thead>
          <tbody>
            ${registrations.map(r => `
              <tr>
                <td>${r.user.name}</td>
                <td>${r.user.email}</td>
                <td>${r.status}</td>
                <td>${r.score !== null ? r.score : 'Not Scored'}</td>
                <td>
                  <button class="btn btn-sm btn-primary" onclick="scoreParticipant(${r.id}, ${eventId})">Score</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    document.body.appendChild(modal);
  } catch (error) {
    console.error('Error loading participants:', error);
    alert('Failed to load participants');
  }
}

// ✅ Score a participant
async function scoreParticipant(registrationId, eventId) {
  const score = prompt('Enter score (0-100):');
  if (score === null) return;
  
  const numScore = parseFloat(score);
  if (isNaN(numScore) || numScore < 0 || numScore > 100) {
    alert('Please enter a valid score between 0 and 100');
    return;
  }
  
  try {
    const response = await fetch(`http://localhost:8080/api/registrations/${registrationId}/score`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: numScore })
    });
    
    if (!response.ok) {
      alert('Failed to update score');
      return;
    }
    
    alert('Score updated successfully!');
    // Close modal and refresh dashboard
    document.querySelectorAll('.modal').forEach(m => m.remove());
    renderDashboardFor('judge');
  } catch (error) {
    console.error('Error updating score:', error);
    alert('Failed to update score');
  }
}

// ✅ Open scoring interface for an event
function openScoreEvent(eventId) {
  viewEventParticipants(eventId);
}
// ✅ Expose functions globally
window.viewEventParticipants = viewEventParticipants;
window.scoreParticipant = scoreParticipant;
window.openScoreEvent = openScoreEvent;

function openParticipantsList(eventId){ const ev = events.find(e=> e.id===eventId); if(!ev) return alert('No event'); openParticipantsModalForJudge(ev); }
function openScoreAll(eventId){ openParticipantsList(eventId); }

/* Admin Dashboard 
function renderAdminDashboard(){
  const root = document.getElementById('dashboardContainer');
  if(!root) return;
  const totalEvents = events.length;
  //const totalUsers = registeredUsers.length;
  const totalUsers = 0;
  const totalRegistrations = userRegistrations.length;
  //const totalJudges = registeredUsers.filter(u=> u.role === 'JUDGE').length;
  const totalJudges = 0;

  root.innerHTML = `
    <div class="dashboard-wrapper container">
      <div class="dashboard-header">
        <h2>Admin Dashboard</h2>
        <div>
          <button class="btn btn-primary" onclick="openModal('createEventModal')"><i class="fas fa-plus"></i> Create Event</button>
          <button class="btn btn-outline" onclick="openCreateJudgeModal()">Create Judge</button>
          <button class="btn btn-outline" onclick="handleLogout()">Logout</button>
        </div>
      </div>

      <div class="dashboard-cards">
        <div class="dashboard-card"><div class="card-icon"><i class="far fa-calendar-alt"></i></div><div class="card-value">${totalEvents}</div><div class="card-label">Total Events</div></div>
        <div class="dashboard-card"><div class="card-icon"><i class="fas fa-users"></i></div><div class="card-value">${totalUsers}</div><div class="card-label">Registered Users</div></div>
        <div class="dashboard-card"><div class="card-icon"><i class="fas fa-user-check"></i></div><div class="card-value">${totalRegistrations}</div><div class="card-label">Total Registrations</div></div>
        <div class="dashboard-card"><div class="card-icon"><i class="fas fa-gavel"></i></div><div class="card-value">${totalJudges}</div><div class="card-label">Judges</div></div>
      </div>

      <div class="table-container">
        <div class="table-header"><h3>All Events</h3></div>
        <table>
          <thead><tr><th>Event Name</th><th>Category</th><th>Date</th><th>Registrations</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            ${events.map(ev => `
            <tr>
              <td>${ev.name}</td>
              <td>${ev.category}</td>
              <td>${formatDate(ev.eventDate)}</td>
              <td>${ev.currentRegistrations}/${ev.maxRegistrations}</td>
              <td>${ev.status}</td>
              <td>
                <button class="btn btn-sm btn-primary" onclick="openEditModalById(${ev.id})">Edit</button>
                <button class="btn btn-sm btn-info" onclick="showParticipants(${ev.id})">Participants</button>
                <button class="btn btn-sm btn-danger" onclick="deleteEvent(${ev.id})">Delete</button>
              </td>
            </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
*/

async function renderAdminDashboard(){
  const root = document.getElementById('dashboardContainer');
  if(!root) return;
  
  // Fetch stats from backend
  let totalUsers = 0;
  let totalJudges = 0;
  
  try {
    const usersResponse = await fetch("http://localhost:8080/api/users");
    if (usersResponse.ok) {
      const users = await usersResponse.json();
      totalUsers = users.length;
      totalJudges = users.filter(u => u.role === 'JUDGE').length;
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
  
  const totalEvents = events.length;
  const totalRegistrations = userRegistrations.length;

  root.innerHTML = `
    <div class="dashboard-wrapper container">
      <div class="dashboard-header">
        <h2>Admin Dashboard</h2>
        <div>
          <button class="btn btn-primary" onclick="openModal('createEventModal')">
            <i class="fas fa-plus"></i> Create Event
          </button>
          <button class="btn btn-outline" onclick="openCreateJudgeModal()">Create Judge</button>
          <button class="btn btn-outline" onclick="handleLogout()">Logout</button>
        </div>
      </div>

      <div class="dashboard-cards">
        <div class="dashboard-card">
          <div class="card-icon"><i class="far fa-calendar-alt"></i></div>
          <div class="card-value">${totalEvents}</div>
          <div class="card-label">Total Events</div>
        </div>
        <div class="dashboard-card">
          <div class="card-icon"><i class="fas fa-users"></i></div>
          <div class="card-value">${totalUsers}</div>
          <div class="card-label">Registered Users</div>
        </div>
        <div class="dashboard-card">
          <div class="card-icon"><i class="fas fa-user-check"></i></div>
          <div class="card-value">${totalRegistrations}</div>
          <div class="card-label">Total Registrations</div>
        </div>
        <div class="dashboard-card">
          <div class="card-icon"><i class="fas fa-gavel"></i></div>
          <div class="card-value">${totalJudges}</div>
          <div class="card-label">Judges</div>
        </div>
      </div>

      <div class="table-container">
        <div class="table-header"><h3>All Events</h3></div>
        <table>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Category</th>
              <th>Date</th>
              <th>Registrations</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${events.map(ev => `
            <tr>
              <td>${ev.name}</td>
              <td>${ev.category}</td>
              <td>${formatDate(ev.eventDate)}</td>
              <td>${ev.currentRegistrations}/${ev.maxRegistrations}</td>
              <td>${ev.status}</td>
              <td>
                <button class="btn btn-sm btn-primary" onclick="openEditModalById(${ev.id})">Edit</button>
                <button class="btn btn-sm btn-info" onclick="showParticipants(${ev.id})">Participants</button>
                <button class="btn btn-sm btn-danger" onclick="deleteEvent(${ev.id})">Delete</button>
              </td>
            </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}


/* Admin helper showing participant names */
function showParticipants(id){
  const ev = events.find(e=> e.id === id);
  if(!ev) return alert('No event');
  alert('Participants: ' + (ev.participants.map(p=> p.name).join(', ') || 'None'));
}

/* -------------------------
  CREATE EVENT handler
--------------------------*/
function handleCreateEvent(){
  // gather values if createEventForm exists
  const nameEl = document.getElementById('eventName');
  if(!nameEl) return alert('Create Event form not available in DOM.');
  const name = nameEl.value.trim();
  const description = document.getElementById('eventDesc').value.trim();
  const category = document.getElementById('eventCategory').value;
  const type = document.getElementById('eventType').value;
  const maxParticipants = parseInt(document.getElementById('maxParticipants').value) || 1;
  const maxRegistrations = parseInt(document.getElementById('maxRegistrations').value) || 10;
  const fee = parseFloat(document.getElementById('eventFee').value) || 0;
  const date = document.getElementById('eventDate').value;
  const time = document.getElementById('eventTime').value;
  const venue = document.getElementById('eventVenue').value;
  const imageData = document.getElementById('eventImagePreview') && document.getElementById('eventImagePreview').dataset.imageData ? document.getElementById('eventImagePreview').dataset.imageData : './public/images/default.jpg';
  if(!name || !category || !date || !time || !venue){ alert('Please fill required fields'); return; }
  const id = events.length ? Math.max(...events.map(x=> x.id)) + 1 : 1;
  const newEv = {
    id,
    name,
    description,
    category,
    type,
    maxParticipants,
    maxRegistrations,
    currentRegistrations: 0,
    registrationFee: fee,
    eventDate: date,
    eventStartTime: time,
    venue,
    image: imageData,
    participants: [],
    winner: null,
    isNew: true,
    status: "OPEN"
  };
  events.unshift(newEv);
  renderEvents();
  if(currentUser) renderDashboardFor(currentUser.role.toLowerCase());
  closeModal('createEventModal');
  alert('Event created');
  // reset preview
  const preview = document.getElementById('eventImagePreview');
  if(preview){ preview.src = './public/images/default.jpg'; delete preview.dataset.imageData; }
}

/* -------------------------
  Create Judge Modal (dynamic) - admin only
--------------------------
function openCreateJudgeModal(){
  if(!currentUser || currentUser.role !== 'ADMIN'){ alert('Only Admin can create judges'); return; }
  // if createJudgeModal exists open it
  if(document.getElementById('createJudgeModal')){ openModal('createJudgeModal'); return; }
  // build dynamic modal
  const modal = document.createElement('div'); modal.className='modal'; modal.id='createJudgeModal';
  modal.innerHTML = `
    <div class="modal-content modal-medium">
      <span class="close-modal" onclick="closeModal('createJudgeModal')">&times;</span>
      <h3>Create Judge Account</h3>
      <form id="createJudgeForm">
        <label>Name</label><input id="judgeName" required />
        <label>Email</label><input id="judgeEmail" type="email" required />
        <label>Password</label><input id="judgePassword" type="password" required />
        <div style="text-align:right;margin-top:10px"><button class="btn btn-primary" type="submit">Create</button></div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('createJudgeForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('judgeName').value.trim();
    const email = document.getElementById('judgeEmail').value.trim();
    const password = document.getElementById('judgePassword').value.trim();
    if(!emailPattern.test(email)){ alert('Invalid email'); return; }
    if(!passwordPattern.test(password)){ alert('Weak password.'); return; }
    if(registeredUsers.some(u=> u.email.toLowerCase() === email.toLowerCase())){ alert('Already exists'); return; }
    registeredUsers.push({ name, email, password, role: 'JUDGE' });
    alert('Judge created');
    closeModal('createJudgeModal');
    renderDashboardFor(currentUser.role.toLowerCase());
  });
  openModal('createJudgeModal');
}
*/
async function openCreateJudgeModal(){
  if(!currentUser || currentUser.role !== 'ADMIN'){ 
    alert('Only Admin can create judges'); 
    return; 
  }
  
  if(document.getElementById('createJudgeModal')){ 
    openModal('createJudgeModal'); 
    return; 
  }
  
  const modal = document.createElement('div'); 
  modal.className='modal'; 
  modal.id='createJudgeModal';
  modal.innerHTML = `
    <div class="modal-content modal-medium">
      <span class="close-modal" onclick="closeModal('createJudgeModal')">&times;</span>
      <h3>Create Judge Account</h3>
      <form id="createJudgeForm">
        <label>Name</label><input id="judgeName" required />
        <label>Email</label><input id="judgeEmail" type="email" required />
        <label>Password</label><input id="judgePassword" type="password" required />
        <div style="text-align:right;margin-top:10px">
          <button class="btn btn-primary" type="submit">Create</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  
  document.getElementById('createJudgeForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const name = document.getElementById('judgeName').value.trim();
    const email = document.getElementById('judgeEmail').value.trim();
    const password = document.getElementById('judgePassword').value.trim();
    
    if(!emailPattern.test(email)){ alert('Invalid email'); return; }
    if(!passwordPattern.test(password)){ alert('Weak password.'); return; }
    
    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: 'JUDGE' })
      });
      
      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to create judge');
        return;
      }
      
      alert('Judge created successfully');
      closeModal('createJudgeModal');
      renderDashboardFor(currentUser.role.toLowerCase());
    } catch (error) {
      console.error('Create judge error:', error);
      alert('Failed to create judge. Please try again.');
    }
  });
  
  openModal('createJudgeModal');
}
/* -------------------------
  Winner gallery populate
--------------------------*/
function populateWinnersSection(){
  const section = document.getElementById('winners');
  if(!section) return;
  const winnerGrid = section.querySelector('.winner-grid');
  if(!winnerGrid) return;
  // if winners present, show top 3 by some metric: use events with winner set
  const winners = events.filter(e=> e.winner).slice(0,3);
  if(winners.length === 0){
    // show default sample (keeps layout)
    winnerGrid.innerHTML = `
      <div class="winner-card"><i class="fas fa-trophy trophy-gold"></i><h4>1st Place</h4><h3>â€”</h3><p><strong>â€”</strong></p></div>
      <div class="winner-card"><i class="fas fa-trophy trophy-silver"></i><h4>2nd Place</h4><h3>â€”</h3><p><strong>â€”</strong></p></div>
      <div class="winner-card"><i class="fas fa-trophy trophy-bronze"></i><h4>3rd Place</h4><h3>â€”</h3><p><strong>â€”</strong></p></div>
    `;
    return;
  }
  // build cards from winners
  const cards = [];
  for(let i=0;i<3;i++){
    if(!winners[i]){
      cards.push(`<div class="winner-card"><i class="fas fa-trophy"></i><h4>${i+1}th Place</h4><h3>â€”</h3><p><strong>â€”</strong></p></div>`);
    } else {
      const w = winners[i];
      cards.push(`<div class="winner-card">
        <i class="fas fa-trophy ${i===0? 'trophy-gold': i===1? 'trophy-silver':'trophy-bronze'}"></i>
        <h4>${i===0? '1st Place': i===1? '2nd Place':'3rd Place'}</h4>
        <h3>${w.name}</h3>
        <p><strong>${w.winner ? w.winner.name : 'â€”'}</strong></p>
        <span>${w.winner ? `${w.winner.score}%` : ''}</span>
      </div>`);
    }
  }
  winnerGrid.innerHTML = cards.join('');
}

/* -------------------------
  Utility exposures for console / HTML onclicks
--------------------------*/
window.openModal = openModal;
window.closeModal = closeModal;
window.openDetailsModal = openDetailsModal;
window.queueRegistration = queueRegistration;
window.handleLogout = handleLogout;
window.renderDashboardFor = renderDashboardFor;
window.openEditModalById = openEditModalById;
window.deleteEvent = deleteEvent;
window.openParticipantsList = openParticipantsList;
window.openScoreAll = openScoreAll;
window.declareWinner = declareWinner;
window.openCreateJudgeModal = openCreateJudgeModal;

/* -------------------------
  End of script.js
--------------------------*/

/* ======================================================
   Updated JS (Option C) - create event + create judge
   - handleCreateEvent (POST to Spring Boot + fallback)
   - openCreateJudgeModal (populate event list)
   - handleCreateJudge (create judge + assign events)
   - Safe DOMContentLoaded bindings (idempotent)
   ====================================================== */

(function () {
  // --- Utility: safe query ---
  function $id(id) { return document.getElementById(id); }

  /* -------------------------
     HANDLE CREATE EVENT
     - Reads fields from the modal form (IDs must match HTML)
     - Tries to POST to Spring Boot at http://localhost:8080/api/events
     - On success, uses returned saved event (including DB id).
     - On network failure, falls back to local `events.unshift(newEv)`.
  --------------------------*/
  async function handleCreateEvent(e) {
    e && e.preventDefault && e.preventDefault();

    // Guard: ensure form exists
    const nameEl = $id('eventName');
    if (!nameEl) return alert('Create Event form not available in DOM.');

    // Gather values (same IDs as your HTML)
    const name = nameEl.value.trim();
    const description = ($id('eventDesc') && $id('eventDesc').value.trim()) || '';
    const category = ($id('eventCategory') && $id('eventCategory').value) || '';
    const type = ($id('eventType') && $id('eventType').value) || 'SOLO';
    const maxParticipants = parseInt(($id('maxParticipants') && $id('maxParticipants').value), 10) || 1;
    const maxRegistrations = parseInt(($id('maxRegistrations') && $id('maxRegistrations').value), 10) || 10;
    const fee = parseFloat(($id('eventFee') && $id('eventFee').value)) || 0;
    const date = ($id('eventDate') && $id('eventDate').value) || '';
    const time = ($id('eventTime') && $id('eventTime').value) || '';
    const venue = ($id('eventVenue') && $id('eventVenue').value) || '';
    const previewEl = $id('eventImagePreview');
    const imageData = (previewEl && previewEl.dataset && previewEl.dataset.imageData) ? previewEl.dataset.imageData : (previewEl ? previewEl.src : './public/images/default.jpg');

    if (!name || !category || !date || !time || !venue) {
      alert('Please fill required fields');
      return;
    }

    // Create a payload that matches your Spring Boot Event model
    const newEvPayload = {
      name,
      description,
      category,
      type,
      maxParticipants,
      maxRegistrations,
      currentRegistrations: 0,
      registrationFee: fee,
      eventDate: date,
      eventStartTime: time,
      venue,
      image: imageData
    };

    // Try to POST to Spring Boot
    try {
      const res = await fetch('http://localhost:8080/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvPayload)
      });

      const saved = await res.json();

      if (res.ok) {
        // Add the saved event to local events[] for immediate UI update
        if (typeof events !== 'undefined' && Array.isArray(events)) {
          // prefer ID from backend if present
          const toPush = Object.assign({}, saved);
          // ensure participants/assignedJudges fields exist
          toPush.participants = toPush.participants || [];
          toPush.assignedJudges = toPush.assignedJudges || [];
          events.unshift(toPush);
        }

        alert('Event created & stored in backend successfully!');
      } else {
        // Backend returned error — fallback to local storage
        console.warn('Backend returned error creating event:', saved);
        fallbackLocalEvent(newEvPayload);
        alert('Event created locally (backend error).');
      }
    } catch (err) {
      // Network failed — fallback to local event array
      console.warn('Could not connect to backend, saving locally.', err);
      fallbackLocalEvent(newEvPayload);
      alert('Backend unreachable — event saved locally only.');
    }

    // UI updates & cleanup
    if (typeof renderEvents === 'function') renderEvents();
    if (typeof currentUser !== 'undefined' && currentUser) {
      if (typeof renderDashboardFor === 'function') renderDashboardFor(currentUser.role.toLowerCase());
    }
    if ($id('createEventModal')) closeModal('createEventModal');

    // Reset preview if present
    if (previewEl) {
      previewEl.src = './public/images/default.jpg';
      delete previewEl.dataset.imageData;
    }

    // helper to push locally
    function fallbackLocalEvent(payload) {
      try {
        const id = (typeof events !== 'undefined' && events.length) ? Math.max(...events.map(x => x.id)) + 1 : 1;
        const localEv = Object.assign({ id }, payload, { participants: [], winner: null, isNew: true, status: 'OPEN', assignedJudges: [] });
        if (typeof events !== 'undefined' && Array.isArray(events)) events.unshift(localEv);
      } catch (ex) {
        console.error('fallbackLocalEvent failed', ex);
      }
    }
  }

  /* -------------------------
     IMAGE UPLOAD PREVIEW (for create event)
     - data stored in #eventImagePreview.dataset.imageData
  -------------------------*/
  function wireEventImageUpload() {
    const uploadEl = $id('eventImageUpload');
    if (!uploadEl) return;

    // idempotent: don't attach twice
    if (uploadEl.dataset.bound === 'true') return;
    uploadEl.dataset.bound = 'true';

    uploadEl.addEventListener('change', function () {
      const file = this.files && this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function () {
        const img = $id('eventImagePreview');
        if (img) {
          img.src = reader.result;
          img.dataset.imageData = reader.result;
        }
      };
      reader.readAsDataURL(file);
    });
  }

  /* -------------------------
     OPEN CREATE JUDGE MODAL
     - populates #judgeEventList with current events
     - each item uses class 'event-check-item'
  -------------------------*/
  function openCreateJudgeModal() {
    // guard
    if (!currentUser || currentUser.role !== 'ADMIN') {
      alert('Only Admin can create judges');
      return;
    }

    const listContainer = $id('judgeEventList');
    if (!listContainer) {
      console.warn('judgeEventList container not found');
      openModal('createJudgeModal'); // still open modal if markup exists
      return;
    }

    // build event items (clear first)
    listContainer.innerHTML = '';

    // if no events available
    if (!Array.isArray(events) || events.length === 0) {
      const msg = document.createElement('div');
      msg.style.padding = '12px';
      msg.style.color = '#666';
      msg.textContent = 'No events available';
      listContainer.appendChild(msg);
      openModal('createJudgeModal');
      return;
    }

    events.forEach(ev => {
      const item = document.createElement('div');
      item.className = 'event-check-item';

      // checkbox + label
      // Using checkbox id for accessibility
      const cbId = `judge-event-${ev.id}`;

      item.innerHTML = `
        <input type="checkbox" id="${cbId}" value="${ev.id}">
        <label for="${cbId}">${escapeHtml(ev.name)} (${escapeHtml(ev.category || '')})</label>
      `;

      listContainer.appendChild(item);
    });

    openModal('createJudgeModal');
  }

  /* -------------------------
    HANDLE CREATE JUDGE
    - Validates email/password
    - Adds judge to registeredUsers[]
    - Assigns judge email to selected events -> event.assignedJudges
    - Optionally: you can call backend to persist judge and assignments (commented)
  -------------------------*/
  function handleCreateJudge(e) {
    e && e.preventDefault && e.preventDefault();

    // guards for required fields
    const nameEl = $id('judgeName');
    const emailEl = $id('judgeEmail');
    const passEl = $id('judgePassword');
    if (!nameEl || !emailEl || !passEl) return alert('Judge form inputs not found');

    const judgeName = nameEl.value.trim();
    const judgeEmail = emailEl.value.trim();
    const judgePassword = passEl.value.trim();

    // Basic front-end validation (re-using patterns that likely exist)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.(com|in|net|org)$/;
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,40}$/;

    if (!judgeName) return alert('Enter judge name');
    if (!emailPattern.test(judgeEmail)) return alert('Invalid email format (example: name@domain.com)');
    if (!passwordPattern.test(judgePassword)) return alert('Weak password. Must be 8–40 chars, include 1 uppercase, 1 number and 1 special char.');
    if (Array.isArray(registeredUsers) && registeredUsers.some(u => u.email.toLowerCase() === judgeEmail.toLowerCase())) {
      return alert('Judge already exists');
    }

    // Create judge locally
    const newJudge = {
      name: judgeName,
      email: judgeEmail,
      password: judgePassword,
      role: 'JUDGE'
    };

    if (!Array.isArray(registeredUsers)) window.registeredUsers = [];
    registeredUsers.push(newJudge);

    // Assign judge to selected events
    const listContainer = $id('judgeEventList');
    if (listContainer) {
      const checked = listContainer.querySelectorAll('input[type="checkbox"]:checked');
      checked.forEach(ch => {
        const eventId = parseInt(ch.value, 10);
        const ev = events.find(it => it.id === eventId);
        if (!ev) return;
        if (!Array.isArray(ev.assignedJudges)) ev.assignedJudges = [];
        // avoid duplicates
        if (!ev.assignedJudges.includes(judgeEmail)) ev.assignedJudges.push(judgeEmail);
      });
    }

    // Optional: send judge + assignments to backend (uncomment and adapt to your backend if you want)
    /*
    fetch('http://localhost:8080/api/judges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ judge: newJudge, assignedEventIds: Array.from(listContainer.querySelectorAll('input[type="checkbox"]:checked')).map(c => parseInt(c.value,10)) })
    })
    .then(r => r.json())
    .then(data => console.log('saved judge', data))
    .catch(err => console.warn('could not persist judge to backend', err));
    */

    // UI feedback + cleanup
    alert('Judge created & assigned successfully!');
    if (typeof renderDashboardFor === 'function' && currentUser) renderDashboardFor(currentUser.role.toLowerCase());
    if (typeof renderEvents === 'function') renderEvents();
    closeModal('createJudgeModal');

    // Reset form fields
    if (nameEl) nameEl.value = '';
    if (emailEl) emailEl.value = '';
    if (passEl) passEl.value = '';
    if (listContainer) {
      listContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    }
  }

  /* -------------------------
    DOMContentLoaded: attach handlers (idempotent)
  -------------------------*/
  document.addEventListener('DOMContentLoaded', () => {
    // wire createEventForm submit (if not bound elsewhere)
    const createEventForm = $id('createEventForm');
    if (createEventForm && createEventForm.dataset.bound !== 'true') {
      createEventForm.dataset.bound = 'true';
      createEventForm.addEventListener('submit', handleCreateEvent);
    }

    // wire image upload preview for create event
    wireEventImageUpload();

    // wire createJudge modal opener(s)
    // If admin triggers modal via inline onclick openCreateJudgeModal(), no need to bind.
    // But if you have a button with id 'openCreateJudge', attach it:
    const openCreateJudgeBtn = $id('openCreateJudge');
    if (openCreateJudgeBtn && openCreateJudgeBtn.dataset.bound !== 'true') {
      openCreateJudgeBtn.dataset.bound = 'true';
      openCreateJudgeBtn.addEventListener('click', openCreateJudgeModal);
    }

    // Attach submit handler for createJudgeForm
    const createJudgeForm = $id('createJudgeForm');
    if (createJudgeForm && createJudgeForm.dataset.bound !== 'true') {
      createJudgeForm.dataset.bound = 'true';
      createJudgeForm.addEventListener('submit', handleCreateJudge);
    }

    // If some other UI needs to open create judge modal programmatically, expose function
    window.openCreateJudgeModal = openCreateJudgeModal;
    window.handleCreateEvent = handleCreateEvent;
    window.handleCreateJudge = handleCreateJudge;
  });

  /* -------------------------
    Small helper: escape html for text injection
  -------------------------*/
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"'`=\/]/g, function (s) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '`': '&#96;',
        '=': '&#61;',
        '/': '&#47;'
      })[s];
    });
  }

  // expose for debugging if needed
  window._cj = {
    openCreateJudgeModal,
    handleCreateJudge,
    handleCreateEvent
  };
})();
