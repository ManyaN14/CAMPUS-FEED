const DEMO_OTP = "123456";

let currentFilter = "trending";

const defaultIssues = [
  {
    id: 1,
    title: "Broken Water Cooler – Block C",
    category: "Safety Hazard",
    location: "Block C",
    supporters: 248,
    status: "active",
    icon: "🚰",
    severity: "safety"
  },
  {
    id: 2,
    title: "Wi-Fi not working in Library",
    category: "Inconvenience",
    location: "Library",
    supporters: 173,
    status: "active",
    icon: "📶",
    severity: "inconvenience"
  },
  {
    id: 3,
    title: "Washroom Hygiene – AC Block",
    category: "Inconvenience",
    location: "AC Block",
    supporters: 128,
    status: "active",
    icon: "🚻",
    severity: "inconvenience"
  },
  {
    id: 4,
    title: "Lighting Problem – Parking Area",
    category: "Safety Hazard",
    location: "Parking Area",
    supporters: 97,
    status: "active",
    icon: "💡",
    severity: "safety"
  },
  {
    id: 5,
    title: "Mess Food Quality",
    category: "Inconvenience",
    location: "Mess",
    supporters: 86,
    status: "active",
    icon: "🍱",
    severity: "inconvenience"
  },
  {
    id: 6,
    title: "Broken Bench near Main Gate",
    category: "Infrastructure",
    location: "Main Gate",
    supporters: 54,
    status: "resolved",
    icon: "🪑",
    severity: "inconvenience"
  }
];

function getIssues() {
  const saved = localStorage.getItem("campusFeedIssues");
  if (!saved) {
    localStorage.setItem("campusFeedIssues", JSON.stringify(defaultIssues));
    return [...defaultIssues];
  }
  return JSON.parse(saved);
}

function saveIssues(issues) {
  localStorage.setItem("campusFeedIssues", JSON.stringify(issues));
}

function getUser() {
  return JSON.parse(localStorage.getItem("campusFeedUser") || "null");
}

function saveUser(user) {
  localStorage.setItem("campusFeedUser", JSON.stringify(user));
}

function showScreen(id) {
  document.querySelectorAll(".screen, .app-screen").forEach(el => {
    el.classList.remove("active");
  });

  const target = document.getElementById(id);
  if (target) target.classList.add("active");

  if (id === "homeScreen") {
    renderIssues();
    const user = getUser();
    if (user) document.getElementById("homeUsername").textContent = user.username;
  }

  if (id === "profileScreen") {
    renderProfile();
  }
}

function sendOTP() {
  const email = document.getElementById("emailInput").value.trim();
  const error = document.getElementById("emailError");

  if (!email) {
    error.textContent = "Please enter your college email.";
    return;
  }

  if (!email.toLowerCase().endsWith("@igdtuw.ac.in")) {
    error.textContent = "Please use your @igdtuw.ac.in college email.";
    return;
  }

  error.textContent = "";
  localStorage.setItem("pendingEmail", email);
  document.getElementById("emailPreview").textContent = email;
  showScreen("otpScreen");
}

function verifyOTP() {
  const values = [...document.querySelectorAll(".otp")].map(input => input.value).join("");
  const error = document.getElementById("otpError");

  if (values !== DEMO_OTP) {
    error.textContent = "Incorrect OTP. For this prototype use 123456.";
    return;
  }

  const email = localStorage.getItem("pendingEmail");
  saveUser({
    email,
    username: "",
    supported: [],
    reported: [],
    comments: []
  });

  error.textContent = "";
  showScreen("joinedScreen");
}

function createProfile() {
  const username = document.getElementById("usernameInput").value.trim();
  const error = document.getElementById("usernameError");

  if (username.length < 3) {
    error.textContent = "Username must contain at least 3 characters.";
    return;
  }

  const user = getUser();
  user.username = username;
  saveUser(user);

  showScreen("homeScreen");
}

function setFilter(filter, button) {
  currentFilter = filter;

  document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
  if (button) button.classList.add("active");

  const names = {
    trending: "Trending Issues",
    active: "Active Issues",
    resolved: "Resolved Issues",
    suggestions: "Suggestions",
    all: "All Issues"
  };

  document.getElementById("issueHeading").textContent = names[filter];
  renderIssues();
}

function renderIssues() {
  const list = document.getElementById("issueList");
  if (!list) return;

  const search = document.getElementById("searchInput").value.toLowerCase();
  let issues = getIssues();

  if (currentFilter === "trending") {
    issues = issues.filter(i => i.status === "active").sort((a,b) => b.supporters - a.supporters);
  } else if (currentFilter === "active") {
    issues = issues.filter(i => i.status === "active");
  } else if (currentFilter === "resolved") {
    issues = issues.filter(i => i.status === "resolved");
  } else if (currentFilter === "suggestions") {
    issues = issues.filter(i => i.category.toLowerCase().includes("suggest"));
  }

  if (search) {
    issues = issues.filter(i =>
      `${i.title} ${i.location} ${i.category}`.toLowerCase().includes(search)
    );
  }

  if (!issues.length) {
    list.innerHTML = `<div class="issue-card"><p class="muted">No issues found.</p></div>`;
    return;
  }

  const user = getUser();
  const supported = user?.supported || [];

  list.innerHTML = issues.map(issue => `
    <article class="issue-card">
      <div class="issue-top">
        <div class="issue-image">${issue.icon}</div>
        <div class="issue-info">
          <span class="badge ${issue.severity}">${issue.category}</span>
          ${issue.status === "resolved" ? '<span class="badge resolved">Resolved</span>' : ''}
          <h3>${escapeHTML(issue.title)}</h3>
          <div class="issue-meta">📍 ${escapeHTML(issue.location)}</div>
          <div class="issue-meta">👥 ${issue.supporters} supporters</div>
        </div>
      </div>
      <button
        class="support-btn ${supported.includes(issue.id) ? 'supported' : ''}"
        onclick="supportIssue(${issue.id})">
        ${supported.includes(issue.id) ? '✓ Supported' : 'Support'}
      </button>
    </article>
  `).join("");
}

function supportIssue(id) {
  const user = getUser();
  if (!user) return;

  if (!user.supported) user.supported = [];

  const issues = getIssues();
  const issue = issues.find(i => i.id === id);

  if (!issue) return;

  if (user.supported.includes(id)) {
    user.supported = user.supported.filter(x => x !== id);
    issue.supporters = Math.max(0, issue.supporters - 1);
  } else {
    user.supported.push(id);
    issue.supporters += 1;
  }

  saveUser(user);
  saveIssues(issues);
  renderIssues();
  renderProfile();
}

function renderProfile() {
  const user = getUser();
  if (!user) return;

  document.getElementById("profileUsername").textContent = user.username || "CampusExplorer";
  document.getElementById("reportedCount").textContent = (user.reported || []).length;
  document.getElementById("supportedCount").textContent = (user.supported || []).length;
  document.getElementById("commentCount").textContent = (user.comments || []).length;
}

function showReportsPlaceholder() {
  alert("Reports/analytics will be connected by Person 3.");
}

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* Automatically move between OTP boxes */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".otp").forEach((input, index, all) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "");
      if (input.value && all[index + 1]) all[index + 1].focus();
    });

    input.addEventListener("keydown", e => {
      if (e.key === "Backspace" && !input.value && all[index - 1]) {
        all[index - 1].focus();
      }
    });
  });

  const existingUser = getUser();

  if (existingUser?.username) {
    showScreen("homeScreen");
  } else {
    showScreen("welcomeScreen");
  }
});
