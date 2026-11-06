/**
 * FriendSMP - Standalone JavaScript for GitHub Pages
 */

// ================= GLOBAL STATE =================
const STORAGE_KEY = 'friendsmp_gh_user_v3';
let currentUser = null;

const DEMO_PRESETS = {
  mystelwyn: { rank: 'OWNER', hearts: 20, kills: 910, deaths: 45, coins: 65000, tokens: 4200 },
  habib_01: { rank: 'OWNER', hearts: 20, kills: 885, deaths: 52, coins: 59000, tokens: 3800 },
  x_her0: { rank: 'MANAGER', hearts: 18, kills: 620, deaths: 78, coins: 34000, tokens: 1950 }
};

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  loadSavedUser();
  setupSidebarEvents();
  fetchLiveServerStats();
  fetchLiveDiscordStats();

  const hash = window.location.hash.replace('#', '');
  if (['home', 'rules', 'vote', 'staff', 'apply'].includes(hash)) {
    switchTab(hash);
  }

  setInterval(() => {
    fetchLiveServerStats();
    fetchLiveDiscordStats();
  }, 30000);
});

// ================= TAB NAVIGATION WITH FADE-IN =================
function switchTab(tabId) {
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.classList.toggle('active', item.dataset.tab === tabId);
  });
/* FriendSMP site script */
(() => {
  'use strict';

  const SERVER_IP = 'play.friendsmp.ink';
  const STATUS_HOST = 'uae-1.royalnode.cloud:6684';
  const DISCORD_INVITE = 'RsJBu8jEyg';
  const USER_KEY = 'friendsmp_user_v4';
  const VOTE_KEY = 'friendsmp_votes_v1';
  const IGN_RE = /^[A-Za-z0-9_]{3,16}$/;

  const STAFF = { mystelwyn: 'Owner', habib_01: 'Owner', x_her0: 'Manager' };

  const VOTE_SITES = [
    { name: 'Planet Minecraft', url: 'https://www.planetminecraft.com' },
    { name: 'Minecraft-MP', url: 'https://minecraft-mp.com' },
    { name: 'TopG', url: 'https://topg.org' },
    { name: 'Best Minecraft Servers', url: 'https://best-minecraft-servers.co' },
    { name: 'MinecraftServers.org', url: 'https://minecraftservers.org' },
    { name: 'Top Minecraft Servers', url: 'https://topminecraftservers.org' }
  ];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k, f) { try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch { return f; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
    del(k) { try { localStorage.removeItem(k); } catch {} }
  };

  document.querySelectorAll('.tab-pane').forEach((pane) => {
    pane.classList.remove('active');
    pane.style.opacity = '0';
  });
  let user = store.get(USER_KEY, null);

  const activePane = document.getElementById(`tab-${tabId}`);
  if (activePane) {
    activePane.classList.add('active');
    activePane.style.opacity = '0';
    requestAnimationFrame(() => {
      activePane.style.transition = 'opacity 0.35s ease-in-out';
      activePane.style.opacity = '1';
    });
  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(html) {
    const t = $('#toast');
    t.innerHTML = html;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) {
    mobileMenu.classList.add('hidden');
  function burst(y = 0.6) {
    if (typeof confetti === 'function') {
      confetti({ particleCount: 60, spread: 70, origin: { y }, colors: ['#e8475b', '#f4b63f', '#f2ede4'] });
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('hidden');
}

// ================= REAL SERVER & DISCORD STATS =================
function fetchLiveServerStats() {
  const countEl = document.getElementById('livePlayersCount');
  const dotEl = document.getElementById('serverPingDot');
  /* ---------- Copy IP ---------- */
  async function copyIp(btn) {
    try {
      await navigator.clipboard.writeText(SERVER_IP);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = SERVER_IP;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    const label = btn.querySelector('.ip-action-text');
    btn.classList.add('copied');
    if (label) label.textContent = 'Copied';
    setTimeout(() => {
      btn.classList.remove('copied');
      if (label) label.textContent = 'Copy';
    }, 1800);
    toast('<i class="fa-solid fa-check"></i> IP copied. See you in game.');
    burst();
  }

  fetch('https://api.mcsrvstat.us/3/uae-1.royalnode.cloud:6684')
    .then((res) => res.json())
    .then((data) => {
      if (data && data.online !== undefined) {
        const onlineCount = data.players?.online ?? 0;
        const maxCount = data.players?.max ?? 20;
  /* ---------- Live stats ---------- */
  function animateNumber(el, to) {
    const from = parseInt(el.dataset.v || '0', 10);
    el.dataset.v = to;
    el.classList.remove('skeleton');
    const start = performance.now();
    const dur = 700;
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

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
      if (countEl) countEl.textContent = 'ONLINE (play.friendsmp.ink)';
    });
}

function fetchLiveDiscordStats() {
  const discordEl = document.getElementById('liveDiscordCount');

  fetch('https://discord.com/api/v9/invites/RsJBu8jEyg?with_counts=true')
    .then((res) => res.json())
    .then((data) => {
      if (data && data.approximate_presence_count !== undefined) {
        const presence = data.approximate_presence_count;
        const total = data.approximate_member_count || 22;
        if (discordEl) {
          discordEl.textContent = `${presence} ONLINE (${total} MEMBERS)`;
        }
  async function fetchServer() {
    const dot = $('#heroDot');
    const status = $('#heroStatus');
    const players = $('#statPlayers');
    try {
      const res = await fetch(`https://api.mcsrvstat.us/3/${STATUS_HOST}`);
      const data = await res.json();
      if (data.online) {
        const online = data.players?.online ?? 0;
        const max = data.players?.max ?? 0;
        dot.className = 'live-dot on';
        status.textContent = `Online · ${online}${max ? ' / ' + max : ''} playing`;
        animateNumber(players, online);
        renderHeads(data.players?.list || []);
      } else {
        dot.className = 'live-dot off';
        status.textContent = 'Server offline · back soon';
        players.classList.remove('skeleton');
        players.textContent = '0';
      }
    })
    .catch((err) => {
      if (discordEl) discordEl.textContent = 'DISCORD ONLINE';
    });
}

// ================= AUTHENTICATION =================
function loadSavedUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      currentUser = JSON.parse(saved);
      updateAuthUI();
    } catch {
      dot.className = 'live-dot';
      status.textContent = SERVER_IP;
      players.classList.remove('skeleton');
      players.textContent = '—';
    }
  } catch (e) {}
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
  function renderHeads(list) {
    const strip = $('#onlineStrip');
    const wrap = $('#onlineHeads');
    if (!list.length) { strip.hidden = true; return; }
    wrap.innerHTML = '';
    list.slice(0, 16).forEach((p) => {
      const name = typeof p === 'string' ? p : p.name;
      if (!name) return;
      const img = document.createElement('img');
      img.src = `https://mc-heads.net/avatar/${encodeURIComponent(name)}/32`;
      img.alt = name;
      img.title = name;
      img.loading = 'lazy';
      wrap.appendChild(img);
    });
    if (list.length > 16) {
      const more = document.createElement('span');
      more.className = 'more';
      more.textContent = `+${list.length - 16}`;
      wrap.appendChild(more);
    }
    strip.hidden = false;
  }

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
  async function fetchDiscord() {
    const el = $('#statDiscord');
    try {
      const res = await fetch(`https://discord.com/api/v9/invites/${DISCORD_INVITE}?with_counts=true`);
      const data = await res.json();
      if (typeof data.approximate_presence_count === 'number') {
        animateNumber(el, data.approximate_presence_count);
        return;
      }
      throw new Error('no count');
    } catch {
      el.classList.remove('skeleton');
      el.textContent = 'Join';
    }
  }

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
  document.getElementById('loginSkinPreview').src = `https://mc-heads.net/avatar/${clean}/120`;
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
    navLoginBtn.classList.add('hidden');
    navUserChip.classList.remove('hidden');
    document.getElementById('navUserAvatar').src = `https://mc-heads.net/avatar/${currentUser.username}/32`;
    document.getElementById('navUsername').textContent = currentUser.username;
    document.getElementById('navUserRank').textContent = `[${currentUser.rank}]`;

    loggedOutSidebar.classList.add('hidden');
    loggedInSidebar.classList.remove('hidden');
    document.getElementById('sidebarAvatar').src = `https://mc-heads.net/avatar/${currentUser.username}/36`;
    document.getElementById('sidebarTooltip').textContent = `${currentUser.username} [${currentUser.rank}]`;

    if (voteAvatar) voteAvatar.src = `https://mc-heads.net/avatar/${currentUser.username}/36`;
    if (voteTargetName) voteTargetName.textContent = currentUser.username;

    document.getElementById('profileAvatar').src = `https://mc-heads.net/avatar/${currentUser.username}/100`;
    document.getElementById('profileUsername').textContent = currentUser.username;
    document.getElementById('profileRankBadge').textContent = currentUser.rank;
    document.getElementById('statHearts').textContent = `${currentUser.hearts} / 20`;
    document.getElementById('statKills').textContent = currentUser.kills;
    document.getElementById('statCoins').textContent = currentUser.coins.toLocaleString();
    document.getElementById('statTokens').textContent = (currentUser.tokens || 0).toLocaleString();
  } else {
    navLoginBtn.classList.remove('hidden');
    navUserChip.classList.add('hidden');
    loggedOutSidebar.classList.remove('hidden');
    loggedInSidebar.classList.add('hidden');

    if (voteAvatar) voteAvatar.src = 'https://mc-heads.net/avatar/Steve/36';
    if (voteTargetName) voteTargetName.textContent = 'Guest Player';
  /* ---------- Votes ---------- */
  const today = () => new Date().toLocaleDateString('en-CA');
  function voteState() {
    const s = store.get(VOTE_KEY, { day: today(), done: [], total: 0 });
    if (s.day !== today()) { s.day = today(); s.done = []; }
    return s;
  }
}

// ================= MODALS =================
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

  function renderVotes() {
    const s = voteState();
    const grid = $('#voteGrid');
    grid.innerHTML = '';
    VOTE_SITES.forEach((site, i) => {
      const done = s.done.includes(i);
      const a = document.createElement('a');
      a.href = site.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'vote-card' + (done ? ' done' : '');
      a.innerHTML = `
        <span class="vote-n">#${i + 1}</span>
        <span class="vote-name">${site.name}</span>
        <span class="vote-key"><i class="fa-solid ${done ? 'fa-check' : 'fa-key'}"></i> ${done ? 'Visited today' : '1 vote key'}</span>
        <span class="vote-go"><i class="fa-solid fa-arrow-up-right-from-square"></i></span>`;
      a.addEventListener('click', () => {
        const st = voteState();
        if (!st.done.includes(i)) {
          st.done.push(i);
          st.total = (st.total || 0) + 1;
          store.set(VOTE_KEY, st);
          if (st.done.length === VOTE_SITES.length) {
            toast('<i class="fa-solid fa-trophy"></i> All 6 sites done. Open your keys in game.');
            burst(0.4);
          } else {
            toast(`<i class="fa-solid fa-key"></i> Vote #${i + 1} opened. Use IGN <strong>${user ? escapeHtml(user.username) : 'your username'}</strong>.`);
          }
          setTimeout(renderVotes, 150);
        }
      });
      grid.appendChild(a);
    });
    $('#voteCount').textContent = s.done.length;
    $('#voteFill').style.transform = `scaleX(${s.done.length / VOTE_SITES.length})`;
    $('#profileVotesToday').textContent = `${s.done.length}/6`;
    $('#profileVotesTotal').textContent = (s.total || 0).toLocaleString();
  }
  document.getElementById('profileModal').classList.remove('hidden');
}

function closeProfileModal() {
  document.getElementById('profileModal').classList.add('hidden');
}
  /* ---------- User / IGN ---------- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

function closeModals(e) {
  if (e.target.classList.contains('modal-overlay')) {
    closeLoginModal();
    closeProfileModal();
  function renderUser() {
    const name = user?.username;
    $('#navLoginBtn').classList.toggle('hidden', !!user);
    $('#navUserChip').classList.toggle('hidden', !user);
    const head = (n, s) => `https://mc-heads.net/avatar/${encodeURIComponent(n || 'Steve')}/${s}`;
    const body = (n, s) => `https://mc-heads.net/body/${encodeURIComponent(n || 'Steve')}/${s}`;
    $('#navUserAvatar').src = head(name, 32);
    $('#navUsername').textContent = name || 'Player';
    $('#voteAvatar').src = head(name, 48);
    $('#voteTargetName').textContent = name || 'Guest';
    $('#profileSkin').src = body(name, 180);
    $('#profileUsername').textContent = name || 'Player';
    const rank = name ? STAFF[name.toLowerCase()] || 'Player' : 'Player';
    const badge = $('#profileRank');
    badge.textContent = rank;
    badge.dataset.rank = rank.toLowerCase();
    const ign = $('#applyIgn');
    if (name && ign && !ign.value) ign.value = name;
  }
}

function setupSidebarEvents() {
  document.getElementById('sidebarLoginBtn').onclick = openLoginModal;
  document.getElementById('sidebarProfileBtn').onclick = openProfileModal;
}

// ================= COPY IP & VOTE =================
function copyServerIp() {
  navigator.clipboard.writeText('play.friendsmp.ink');
  const hint = document.getElementById('heroCopyHint');
  if (hint) {
    hint.textContent = '✅ Copied to clipboard!';
    setTimeout(() => (hint.textContent = 'Click to copy Server IP'), 2000);

  /* ---------- Modals ---------- */
  let lastFocus;
  function openModal(id) {
    if (id === 'profile' && !user) id = 'login';
    const m = $(`#${id}Modal`);
    lastFocus = document.activeElement;
    m.classList.remove('hidden');
    requestAnimationFrame(() => m.classList.add('open'));
    document.body.classList.add('no-scroll');
    const f = m.querySelector('input, button:not(.modal-x)');
    if (f) setTimeout(() => f.focus(), 60);
  }
  triggerConfetti();
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
  function closeModals() {
    $$('.modal.open').forEach((m) => {
      m.classList.remove('open');
      setTimeout(() => m.classList.add('hidden'), 200);
    });
    document.body.classList.remove('no-scroll');
    if (lastFocus) lastFocus.focus?.();
  }
}

function filterRules() {
  const query = document.getElementById('ruleSearch').value.toLowerCase();
  const cards = document.querySelectorAll('.rule-card');
  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(query) ? 'block' : 'none';
  });
}

function recordVote(voteNum, url) {
  const ign = currentUser ? currentUser.username : 'Guest Player';
  function setupModals() {
    $$('[data-open]').forEach((b) => b.addEventListener('click', () => openModal(b.dataset.open)));
    $$('.modal').forEach((m) => m.addEventListener('click', (e) => {
      if (e.target === m || e.target.closest('[data-close]')) closeModals();
    }));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModals(); });

    const input = $('#loginUsernameInput');
    let t;
    input.addEventListener('input', () => {
      $('#loginErr').classList.remove('show');
      clearTimeout(t);
      t = setTimeout(() => {
        const v = input.value.trim();
        $('#loginSkinPreview').src = `https://mc-heads.net/body/${encodeURIComponent(IGN_RE.test(v) ? v : 'Steve')}/180`;
      }, 300);
    });

  if (currentUser) {
    currentUser.votes = (currentUser.votes || 0) + 1;
    currentUser.coins = (currentUser.coins || 0) + 500;
    currentUser.tokens = (currentUser.tokens || 0) + 50;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } catch (e) {}
    updateAuthUI();
    $('#loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const v = input.value.trim();
      if (!IGN_RE.test(v)) { $('#loginErr').classList.add('show'); input.focus(); return; }
      user = { username: v };
      store.set(USER_KEY, user);
      renderUser();
      closeModals();
      toast(`<i class="fa-solid fa-user-check"></i> Welcome, <strong>${escapeHtml(v)}</strong>`);
      burst();
    });

    $('#logoutBtn').addEventListener('click', () => {
      user = null;
      store.del(USER_KEY);
      renderUser();
      closeModals();
      setTimeout(() => openModal('login'), 250);
    });
  }

  const alertBox = document.getElementById('voteAlert');
  if (alertBox) {
    alertBox.classList.remove('hidden');
    alertBox.innerHTML = `🎉 <strong>Vote #${voteNum} registered for ${ign}!</strong> You received <strong>1 Vote Key + 500 Coins + 50 Tokens</strong>!`;
    setTimeout(() => {
      alertBox.classList.add('hidden');
    }, 4500);
  /* ---------- Rules search ---------- */
  function setupRules() {
    const input = $('#ruleSearch');
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      let shown = 0;
      $$('.rule').forEach((r) => {
        const hit = !q || r.textContent.toLowerCase().includes(q);
        r.classList.toggle('hidden', !hit);
        if (hit) shown++;
        if (q && hit) r.open = true;
      });
      $('#rulesEmpty').classList.toggle('hidden', shown > 0);
    });
  }

  triggerConfetti();
  /* ---------- Application form (Netlify Forms) ---------- */
  function setupApply() {
    const form = $('#applyForm');
    const msg = $('#applyMsg');
    const btn = $('#applySubmit');

    $$('input, textarea, select', form).forEach((el) =>
      el.addEventListener('input', () => el.closest('.field')?.classList.remove('invalid'))
    );

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let ok = true;
      $$('input[required], textarea[required]', form).forEach((el) => {
        const bad = !el.checkValidity();
        el.closest('.field')?.classList.toggle('invalid', bad);
        if (bad && ok) { el.focus(); ok = false; }
      });
      if (!ok) return;

      btn.disabled = true;
      btn.classList.add('loading');
      msg.className = 'form-msg hidden';
      try {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form)).toString()
        });
        if (!res.ok) throw new Error(res.status);
        const ign = form.ign.value;
        form.reset();
        msg.className = 'form-msg success';
        msg.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thanks <strong>${escapeHtml(ign)}</strong>, your application was sent. Watch your Discord DMs.`;
        burst(0.7);
      } catch {
        msg.className = 'form-msg error';
        msg.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> That did not go through. Try again, or open a ticket on Discord.';
      } finally {
        btn.disabled = false;
        btn.classList.remove('loading');
      }
    });
  }

  if (url) {
    try {
      window.open(url, '_blank');
    } catch (e) {}
  /* ---------- Nav / scroll ---------- */
  function setupNav() {
    const nav = $('#nav');
    const burger = $('#burger');
    const menu = $('#mobileMenu');
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
    });
    $$('a', menu).forEach((a) => a.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }));

    const links = $$('.nav-link');
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === `#${en.target.id}`));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('section[id]').forEach((s) => spy.observe(s));

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    $$('.section-head, .tile, .step, .vote-progress, .rule, .staff-card, .apply-form, .role-list li, .rules-side, .join-copy, .apply-copy').forEach((el, i) => {
      el.classList.add('rise');
      el.style.setProperty('--i', i % 6);
      io.observe(el);
    });
  }
}

function submitApplication(e) {
  e.preventDefault();
  const ign = document.getElementById('applyIgn').value;
  const role = document.getElementById('applyRole').value;
  /* ---------- Floating hearts ---------- */
  function spawnHearts() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = $('#hearts');
    const icons = ['fa-heart', 'fa-heart', 'fa-coins', 'fa-cube'];
    for (let i = 0; i < 18; i++) {
      const el = document.createElement('i');
      el.className = `fa-solid ${icons[i % icons.length]}`;
      el.style.left = `${Math.random() * 100}%`;
      el.style.fontSize = `${10 + Math.random() * 16}px`;
      el.style.animationDuration = `${14 + Math.random() * 16}s`;
      el.style.animationDelay = `${-Math.random() * 30}s`;
      el.style.setProperty('--drift', `${(Math.random() - 0.5) * 120}px`);
      box.appendChild(el);
    }
  }

  alert(`✅ Thank you ${ign}! Your application for ${role} has been submitted. Our staff team will contact you on Discord.`);
  e.target.reset();
  triggerConfetti();
}
  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    $$('[data-copy-ip]').forEach((b) => b.addEventListener('click', () => copyIp(b)));
    setupNav();
    setupModals();
    setupRules();
    setupApply();
    renderUser();
    renderVotes();
    spawnHearts();
    fetchServer();
    fetchDiscord();
    setInterval(() => { fetchServer(); fetchDiscord(); }, 45000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) renderVotes(); });
  });
})();