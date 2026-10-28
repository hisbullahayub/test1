/**
 * FriendSMP - Standalone JavaScript for GitHub Pages
 * Features:
 * - Real-Time Server Player Count using Backend API (uae-1.royalnode.cloud:6684)
 * - Real-Time Discord Online Members (discord.gg/RsJBu8jEyg)
 * - Passwordless Minecraft Username (IGN) Authentication
 * - Real-time Mojang/mc-heads Skin Avatar Rendering
 * - Multi-Tab Navigation (Home, Rules, Vote, Staff, Apply)
 * - Server IP Copy with Feedback & Confetti (play.friendsmp.ink)
 */

// ================= GLOBAL STATE =================
const STORAGE_KEY = 'friendsmp_gh_user_v2';

let currentUser = null;

// Presets for instant test accounts (Server Owners & Manager)
const DEMO_PRESETS = {
  mystelwyn: { rank: 'OWNER', hearts: 20, kills: 910, deaths: 45, coins: 65000, tokens: 4200 },
  habib: { rank: 'OWNER', hearts: 20, kills: 885, deaths: 52, coins: 59000, tokens: 3800 },
  evilthunder: { rank: 'MANAGER', hearts: 18, kills: 620, deaths: 78, coins: 34000, tokens: 1950 }
};

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  loadSavedUser();
  setupSidebarEvents();
  fetchLiveServerStats();
  fetchLiveDiscordStats();

  // Refresh stats every 30 seconds
  setInterval(() => {
    fetchLiveServerStats();
    fetchLiveDiscordStats();
  }, 30000);
});

// ================= REAL SERVER & DISCORD STATS =================
function fetchLiveServerStats() {
  const countEl = document.getElementById('livePlayersCount');
  const dotEl = document.getElementById('serverPingDot');

  // Query real server status without exposing it on UI
  fetch('https://api.mcsrvstat.us/3/uae-1.royalnode.cloud:6684')
    .then((res) => res.json())
    .then((data) => {
      if (data && data.online !== undefined) {
        const onlineCount = data.players?.online ?? 0;
        const maxCount = data.players?.max ?? 20;

        if (countEl) {
          countEl.textContent = `${onlineCount} / ${maxCount} PLAYERS ONLINE`;
        }
        if (dotEl) {
          dotEl.style.background = data.online ? '#10b981' : '#ef4444';
          dotEl.style.boxShadow = data.online ? '0 0 8px #10b981' : '0 0 8px #ef4444';
        }
      }
    })
    .catch((err) => {
      console.warn('Real server ping error:', err);
      if (countEl) countEl.textContent = 'ONLINE (play.friendsmp.ink)';
    });
}

function fetchLiveDiscordStats() {
  const discordEl = document.getElementById('liveDiscordCount');

  // Query real Discord invite counts
  fetch('https://discord.com/api/v9/invites/RsJBu8jEyg?with_counts=true')
    .then((res) => res.json())
    .then((data) => {
      if (data && data.approximate_presence_count !== undefined) {
        const presence = data.approximate_presence_count;
        const total = data.approximate_member_count || 22;
        if (discordEl) {
          discordEl.textContent = `${presence} ONLINE (${total} MEMBERS)`;
        }
      }
    })
    .catch((err) => {
      console.warn('Discord ping error:', err);
      if (discordEl) discordEl.textContent = 'DISCORD ONLINE';
    });
}

// ================= AUTHENTICATION (Passwordless Minecraft IGN) =================
function loadSavedUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      currentUser = JSON.parse(saved);
      updateAuthUI();
    }
  } catch (e) {
    console.error('Storage error', e);
  }
}

function handleUsernameLogin(e) {
  e.preventDefault();
  const input = document.getElementById('loginUsernameInput');
  const clean = input.value.trim().replace(/^[@.]/, '');

  if (!clean || clean.length < 3) {
    alert('Please enter a valid Minecraft username (at least 3 characters).');
    return;
  }

  const lower = clean.toLowerCase();
  const preset = DEMO_PRESETS[lower] || {
    rank: 'PLAYER',
    hearts: 10,
    kills: Math.floor(Math.random() * 30) + 5,
    deaths: Math.floor(Math.random() * 15) + 2,
    coins: 2500,
    tokens: 150
  };

  currentUser = {
    username: clean,
    rank: preset.rank,
    hearts: preset.hearts,
    kills: preset.kills,
    deaths: preset.deaths,
    coins: preset.coins,
    tokens: preset.tokens,
    votes: 0
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
  } catch (err) {}

  updateAuthUI();
  closeLoginModal();
  triggerConfetti();
}

function selectDemoUser(name) {
  const input = document.getElementById('loginUsernameInput');
  input.value = name;
  updateSkinPreview(name);
}

function updateSkinPreview(val) {
  const clean = val.trim() || 'Steve';
  document.getElementById('loginSkinPreview').src = `https://mc-heads.net/avatar/${clean}/100`;
  document.getElementById('loginPreviewName').textContent = clean;
}

function logoutUser() {
  currentUser = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {}
  updateAuthUI();
  closeProfileModal();
}

function updateAuthUI() {
  const loggedOutSidebar = document.getElementById('sidebarLoggedOut');
  const loggedInSidebar = document.getElementById('sidebarLoggedIn');
  const navLoginBtn = document.getElementById('navLoginBtn');
  const navUserChip = document.getElementById('navUserChip');
  const voteAvatar = document.getElementById('voteAvatar');
  const voteTargetName = document.getElementById('voteTargetName');

  if (currentUser) {
    // Top Nav
    navLoginBtn.classList.add('hidden');
    navUserChip.classList.remove('hidden');
    document.getElementById('navUserAvatar').src = `https://mc-heads.net/avatar/${currentUser.username}/32`;
    document.getElementById('navUsername').textContent = currentUser.username;
    document.getElementById('navUserRank').textContent = `[${currentUser.rank}]`;

    // Sidebar
    loggedOutSidebar.classList.add('hidden');
    loggedInSidebar.classList.remove('hidden');
    document.getElementById('sidebarAvatar').src = `https://mc-heads.net/avatar/${currentUser.username}/36`;
    document.getElementById('sidebarTooltip').textContent = `${currentUser.username} [${currentUser.rank}]`;

    // Vote tab sync
    if (voteAvatar) voteAvatar.src = `https://mc-heads.net/avatar/${currentUser.username}/36`;
    if (voteTargetName) voteTargetName.textContent = currentUser.username;

    // Profile Modal
    document.getElementById('profileAvatar').src = `https://mc-heads.net/avatar/${currentUser.username}/100`;
    document.getElementById('profileUsername').textContent = currentUser.username;
    document.getElementById('profileRankBadge').textContent = currentUser.rank;
    document.getElementById('statHearts').textContent = `${currentUser.hearts} / 20`;
    document.getElementById('statKills').textContent = currentUser.kills;
    document.getElementById('statCoins').textContent = currentUser.coins.toLocaleString();
    document.getElementById('statTokens').textContent = (currentUser.tokens || 0).toLocaleString();
  } else {
    // Logged out
    navLoginBtn.classList.remove('hidden');
    navUserChip.classList.add('hidden');
    loggedOutSidebar.classList.remove('hidden');
    loggedInSidebar.classList.add('hidden');

    if (voteAvatar) voteAvatar.src = 'https://mc-heads.net/avatar/Steve/36';
    if (voteTargetName) voteTargetName.textContent = 'Guest Player';
  }
}

// ================= MODAL CONTROLS =================
function openLoginModal() {
  document.getElementById('loginModal').classList.remove('hidden');
  document.getElementById('loginUsernameInput').focus();
}

function closeLoginModal() {
  document.getElementById('loginModal').classList.add('hidden');
}

function openProfileModal() {
  if (!currentUser) {
    openLoginModal();
    return;
  }
  document.getElementById('profileModal').classList.remove('hidden');
}

function closeProfileModal() {
  document.getElementById('profileModal').classList.add('hidden');
}

function closeModals(e) {
  if (e.target.classList.contains('modal-overlay')) {
    closeLoginModal();
    closeProfileModal();
  }
}

// ================= TAB NAVIGATION =================
function switchTab(tabId) {
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.classList.toggle('active', item.dataset.tab === tabId);
  });

  document.querySelectorAll('.tab-pane').forEach((pane) => {
    pane.classList.remove('active');
  });

  const activePane = document.getElementById(`tab-${tabId}`);
  if (activePane) {
    activePane.classList.add('active');
  }

  document.getElementById('mobileMenu').classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('hidden');
}

function setupSidebarEvents() {
  document.getElementById('sidebarLoginBtn').onclick = openLoginModal;
  document.getElementById('sidebarRegisterBtn').onclick = openLoginModal;
  document.getElementById('sidebarProfileBtn').onclick = openProfileModal;
  document.getElementById('sidebarCopyIpBtn').onclick = copyServerIp;
}

// ================= COPY IP =================
function copyServerIp() {
  navigator.clipboard.writeText('play.friendsmp.ink');
  const hint = document.getElementById('heroCopyHint');
  if (hint) {
    hint.textContent = '✅ Copied to clipboard!';
    setTimeout(() => (hint.textContent = 'Click to copy Server IP'), 2000);
  }
  triggerConfetti();
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  }
}

// ================= RULES SEARCH FILTER =================
function filterRules() {
  const query = document.getElementById('ruleSearch').value.toLowerCase();
  const cards = document.querySelectorAll('.rule-card');

  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(query) ? 'block' : 'none';
  });
}

// ================= VOTE REWARDS (Matches image_d125f41d.png) =================
function recordVote(voteNum, url) {
  const ign = currentUser ? currentUser.username : 'Guest Player';

  if (currentUser) {
    currentUser.votes = (currentUser.votes || 0) + 1;
    currentUser.coins = (currentUser.coins || 0) + 500;
    currentUser.tokens = (currentUser.tokens || 0) + 50;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } catch (e) {}
    updateAuthUI();
  }

  const alertBox = document.getElementById('voteAlert');
  if (alertBox) {
    alertBox.classList.remove('hidden');
    alertBox.innerHTML = `🎉 <strong>Vote #${voteNum} registered for ${ign}!</strong> You received <strong>1 Vote Key + 500 Coins + 50 Tokens</strong>!`;
    setTimeout(() => {
      alertBox.classList.add('hidden');
    }, 4500);
  }

  triggerConfetti();

  if (url) {
    try {
      window.open(url, '_blank');
    } catch (e) {
      console.log('Navigated vote', url);
    }
  }
}

// ================= APPLICATIONS =================
function submitApplication(e) {
  e.preventDefault();
  const ign = document.getElementById('applyIgn').value;
  const role = document.getElementById('applyRole').value;

  alert(`✅ Thank you ${ign}! Your application for ${role} has been submitted. Our staff team will contact you on Discord.`);
  e.target.reset();
  triggerConfetti();
}
