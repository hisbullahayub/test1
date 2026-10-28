/**
 * FriendSMP - Standalone JavaScript for GitHub Pages
 * Features:
 * - Passwordless Minecraft Username (IGN) Authentication
 * - Real-time Mojang/mc-heads Skin Avatar Rendering
 * - Multi-Tab Navigation (Home, Rules, Vote, Map, Store, Staff, Apply)
 * - Server IP Copy with Feedback & Confetti
 * - Live Comments System on Announcements
 * - Interactive Shopping Cart
 */

// ================= GLOBAL STATE =================
const STORAGE_KEY = 'friendsmp_gh_user';

let currentUser = null;
let cart = [];
let comments = [
  {
    author: 'CyberKnight',
    rank: 'VIP+',
    text: 'Gg boys! Ready for the dragon fight this weekend. Purple clan is taking the egg!',
    time: '3 hours ago'
  },
  {
    author: 'Aethelred',
    rank: 'MVP+',
    text: 'The blue & purple theme looks incredible! Best SMP network in 2026 🔥',
    time: '6 hours ago'
  },
  {
    author: 'Noxillio',
    rank: 'OWNER',
    text: 'Bedrock players can join using port 19132! See everyone at the End opening.',
    time: '1 day ago'
  }
];

// Presets for instant test accounts
const DEMO_PRESETS = {
  noxillio: { rank: 'OWNER', hearts: 20, kills: 842, deaths: 61, coins: 48500 },
  aethelred: { rank: 'MVP+', hearts: 18, kills: 512, deaths: 98, coins: 24300 },
  cyberknight: { rank: 'VIP+', hearts: 14, kills: 219, deaths: 114, coins: 12400 }
};

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  loadSavedUser();
  renderComments();
  setupSidebarEvents();
});

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
    coins: 2500
  };

  currentUser = {
    username: clean,
    rank: preset.rank,
    hearts: preset.hearts,
    kills: preset.kills,
    deaths: preset.deaths,
    coins: preset.coins,
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
  const voteIgnInput = document.getElementById('voteIgnInput');
  const userVoteCount = document.getElementById('userVoteCount');

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
    if (voteAvatar) voteAvatar.src = `https://mc-heads.net/avatar/${currentUser.username}/64`;
    if (voteIgnInput) voteIgnInput.value = currentUser.username;
    if (userVoteCount) userVoteCount.textContent = `${currentUser.votes} Votes`;

    // Profile Modal
    document.getElementById('profileAvatar').src = `https://mc-heads.net/avatar/${currentUser.username}/100`;
    document.getElementById('profileUsername').textContent = currentUser.username;
    document.getElementById('profileRankBadge').textContent = currentUser.rank;
    document.getElementById('statHearts').textContent = `${currentUser.hearts} / 20`;
    document.getElementById('statKills').textContent = currentUser.kills;
    document.getElementById('statDeaths').textContent = currentUser.deaths;
    document.getElementById('statCoins').textContent = currentUser.coins.toLocaleString();
  } else {
    // Logged out
    navLoginBtn.classList.remove('hidden');
    navUserChip.classList.add('hidden');
    loggedOutSidebar.classList.remove('hidden');
    loggedInSidebar.classList.add('hidden');

    if (voteAvatar) voteAvatar.src = 'https://mc-heads.net/avatar/Steve/64';
    if (voteIgnInput) voteIgnInput.value = '';
    if (userVoteCount) userVoteCount.textContent = '0 Votes';
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
    closeCart();
  }
}

// ================= TAB NAVIGATION =================
function switchTab(tabId) {
  // Update nav link styles
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.classList.toggle('active', item.dataset.tab === tabId);
  });

  // Switch pane
  document.querySelectorAll('.tab-pane').forEach((pane) => {
    pane.classList.remove('active');
  });

  const activePane = document.getElementById(`tab-${tabId}`);
  if (activePane) {
    activePane.classList.add('active');
  }

  // Close mobile menu if open
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

// ================= COPY IP / BEDROCK =================
function copyServerIp() {
  navigator.clipboard.writeText('play.friendsmp.net');
  const hint = document.getElementById('heroCopyHint');
  if (hint) {
    hint.textContent = '✅ Copied to clipboard!';
    setTimeout(() => (hint.textContent = 'Click to copy Server IP'), 2000);
  }
  triggerConfetti();
}

function copyBedrockPort() {
  navigator.clipboard.writeText('19132');
  const txt = document.getElementById('bedrockPortTxt');
  if (txt) {
    txt.textContent = 'Copied!';
    setTimeout(() => (txt.textContent = '19132'), 2000);
  }
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

// ================= COMMENTS SYSTEM =================
function toggleComments() {
  const section = document.getElementById('expandedComments');
  const isHidden = section.classList.contains('hidden');
  section.classList.toggle('hidden');
  document.getElementById('readBtnTxt').textContent = isHidden ? 'Collapse Details' : 'Read full post';
}

function renderComments() {
  const list = document.getElementById('commentsList');
  if (!list) return;

  list.innerHTML = comments
    .map(
      (c) => `
    <div class="comment-card">
      <img src="https://mc-heads.net/avatar/${c.author}/32" alt="${c.author}" onerror="this.src='https://mc-heads.net/avatar/Steve/32'" />
      <div>
        <div class="c-head">
          <span style="font-family: monospace;">${c.author}</span>
          <span class="badge-tag">[${c.rank}]</span>
          <span style="font-size: 10px; color: #6b7280; margin-left: 6px;">${c.time}</span>
        </div>
        <p>${c.text}</p>
      </div>
    </div>
  `
    )
    .join('');

  document.getElementById('commentsCountTxt').textContent = comments.length;
  document.getElementById('commentsHeaderCount').textContent = comments.length;
}

function submitComment(e) {
  e.preventDefault();
  const input = document.getElementById('commentInput');
  const text = input.value.trim();
  if (!text) return;

  const author = currentUser ? currentUser.username : 'GuestPlayer';
  const rank = currentUser ? currentUser.rank : 'PLAYER';

  comments.unshift({
    author,
    rank,
    text,
    time: 'Just now'
  });

  input.value = '';
  renderComments();
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

// ================= VOTE REWARDS =================
function recordVote(siteName) {
  const ignInput = document.getElementById('voteIgnInput');
  const ign = (currentUser ? currentUser.username : ignInput.value).trim();

  if (!ign) {
    alert('Please enter your Minecraft In-Game Name (IGN) before voting!');
    return;
  }

  if (currentUser) {
    currentUser.votes += 1;
    currentUser.coins += 500;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } catch (e) {}
    updateAuthUI();
  }

  const alertBox = document.getElementById('voteAlert');
  alertBox.classList.remove('hidden');
  alertBox.innerHTML = `🎉 <strong>Vote registered for ${ign}!</strong> Rewarded <strong>+500 Coins</strong> on ${siteName}.`;
  triggerConfetti();

  setTimeout(() => {
    alertBox.classList.add('hidden');
  }, 4000);
}

// ================= INTERACTIVE MAP CONTROLS =================
let mapZoom = 1;
let mapNight = false;

function zoomMap(delta) {
  mapZoom = Math.min(Math.max(mapZoom + delta, 0.8), 1.6);
  document.getElementById('mapScreen').style.transform = `scale(${mapZoom})`;
}

function toggleMapNight() {
  mapNight = !mapNight;
  document.getElementById('mapScreen').style.filter = mapNight ? 'brightness(0.6) contrast(1.2)' : 'brightness(1)';
}

function focusPin(name, coords) {
  alert(`Focused landmark: ${name} (${coords})`);
}

// ================= STORE & CART =================
function addToCart(name, price) {
  cart.push({ name, price });
  updateCartUI();
  openCart();
}

function updateCartUI() {
  document.getElementById('cartCount').textContent = cart.length;
  const list = document.getElementById('cartItemsList');

  if (cart.length === 0) {
    list.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    document.getElementById('cartTotalText').textContent = '$0.00';
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  list.innerHTML = cart
    .map(
      (item, idx) => `
    <div class="cart-item-row">
      <span>${item.name}</span>
      <strong>$${item.price.toFixed(2)}</strong>
    </div>
  `
    )
    .join('');

  document.getElementById('cartTotalText').textContent = `$${total.toFixed(2)}`;
}

function openCart() {
  document.getElementById('cartModal').classList.remove('hidden');
}

function closeCart() {
  document.getElementById('cartModal').classList.add('hidden');
}

function checkoutCart() {
  if (cart.length === 0) return;

  const targetIgn = currentUser ? currentUser.username : prompt('Enter your Minecraft IGN for delivery:');
  if (!targetIgn) return;

  alert(`🎉 Purchase completed for ${targetIgn}! Items will be delivered to your FriendSMP inventory in-game.`);
  cart = [];
  updateCartUI();
  closeCart();
  triggerConfetti();
}

// ================= APPLICATIONS =================
function submitApplication(e) {
  e.preventDefault();
  const ign = document.getElementById('applyIgn').value;
  const role = document.getElementById('applyRole').value;

  alert(`✅ Thank you ${ign}! Your application for ${role} has been submitted. Our team will contact you on Discord.`);
  e.target.reset();
  triggerConfetti();
}
