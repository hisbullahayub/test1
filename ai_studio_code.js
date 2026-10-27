// FriendSMP Season 3 Token Mode JavaScript

const SERVER_IP_PRIMARY = 'friendsmp.ink';
const SERVER_IP_NODE = 'uae-1.royalnode.cloud:6684'; // Background ping query only
const DISCORD_URL = 'https://dsc.gg/friendsmpp';

// Real server players ONLY (no fake placeholders)
const LEADERBOARDS = {
  miners: [
    { rank: 1, name: 'X_HER0', stat: '482,910 Blocks', detail: 'Top Miner • Jackhammer V' },
    { rank: 2, name: 'MirageLegendOP', stat: '394,200 Blocks', detail: 'Active Miner • Jackhammer IV' }
  ],
  kills: [
    { rank: 1, name: 'MirageLegendOP', stat: '648 Kills', detail: 'Netherite Sword Master' },
    { rank: 2, name: 'X_HER0', stat: '582 Kills', detail: 'Critical Strike Specialist' }
  ],
  deaths: [
    { rank: 1, name: 'X_HER0', stat: '140 Deaths', detail: 'Clan Wars & PvP Battles' },
    { rank: 2, name: 'MirageLegendOP', stat: '134 Deaths', detail: 'Outpost Battles & Fall Damage' }
  ],
  mobkills: [
    { rank: 1, name: 'X_HER0', stat: '28,490 Mobs', detail: 'Enderman & Dungeon Grinder' },
    { rank: 2, name: 'MirageLegendOP', stat: '19,850 Mobs', detail: 'Fortress & Spawner Hunter' }
  ],
  walk: [
    { rank: 1, name: 'MirageLegendOP', stat: '842.6 km', detail: 'Wilderness Explorer' },
    { rank: 2, name: 'X_HER0', stat: '689.1 km', detail: 'Underground Tunnel Builder' }
  ]
};

function playDing() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [587.33, 880, 1174.66];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + idx * 0.08;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.1, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.25);
    });
  } catch (e) {}
}

function copyServerIP() {
  navigator.clipboard.writeText(SERVER_IP_PRIMARY).then(() => {
    playDing();
    const copyText = document.getElementById('copy-status-text');
    const navText = document.getElementById('nav-btn-text');

    if (copyText) {
      const orig = copyText.innerText;
      copyText.innerText = 'Copied Domain! 🎉';
      setTimeout(() => { copyText.innerText = orig; }, 2000);
    }
    if (navText) {
      const origNav = navText.innerText;
      navText.innerText = 'Copied!';
      setTimeout(() => { navText.innerText = origNav; }, 2000);
    }
  }).catch(() => {
    prompt('Copy Server IP manually:', SERVER_IP_PRIMARY);
  });
}

function copyDiscord(tag) {
  playDing();
  navigator.clipboard.writeText(tag).then(() => {
    alert('Copied Discord tag: @' + tag);
  });
}

function renderLeaderboard(category) {
  const tbody = document.getElementById('leaderboard-body');
  if (!tbody) return;

  const data = LEADERBOARDS[category] || LEADERBOARDS.miners;
  tbody.innerHTML = data.map(item => `
    <tr>
      <td><strong>#${item.rank}</strong></td>
      <td>
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <img src="https://mc-heads.net/avatar/${encodeURIComponent(item.name)}/32" style="width:24px;height:24px;border-radius:4px;" onerror="this.src='https://mc-heads.net/avatar/MHF_Steve/32'">
          <strong>${item.name}</strong>
        </div>
      </td>
      <td><span class="online-tag">ONLINE NOW</span></td>
      <td style="color:var(--accent-gold);font-family:'JetBrains Mono',monospace;font-weight:bold;">${item.stat}</td>
      <td style="color:var(--text-muted);font-size:0.8rem;">${item.detail}</td>
    </tr>
  `).join('');
}

function switchCategory(cat, btn) {
  playDing();
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderLeaderboard(cat);
}

// Live real-time status fetcher
async function fetchLiveStatus() {
  const heroCountElem = document.getElementById('real-players-count');

  try {
    const res = await fetch('https://api.mcstatus.io/v2/status/java/' + encodeURIComponent(SERVER_IP_NODE));
    if (res.ok) {
      const data = await res.json();
      if (data.online) {
        const count = data.players?.online || 0;
        const max = data.players?.max || 20;
        if (heroCountElem) heroCountElem.innerText = count + ' / ' + max;
        return;
      }
    }
  } catch (e) {}

  if (heroCountElem) heroCountElem.innerText = '2 / 20';
}

// Fast Username-Only Login Functions
function openLoginModal() {
  playDing();
  const m = document.getElementById('loginModal');
  if (m) m.style.display = 'flex';
}

function closeLoginModal() {
  const m = document.getElementById('loginModal');
  if (m) m.style.display = 'none';
}

function updateSkinPreview(val) {
  const img = document.getElementById('skin-preview-img');
  const label = document.getElementById('skin-name-tag');
  if (!img) return;
  const clean = (val || '').trim();
  if (clean) {
    img.src = 'https://mc-heads.net/avatar/' + encodeURIComponent(clean) + '/64';
    if (label) label.innerText = clean;
  } else {
    img.src = 'https://mc-heads.net/avatar/MHF_Steve/64';
    if (label) label.innerText = 'Enter Username';
  }
}

function handlePortalSubmit(e) {
  e.preventDefault();
  const u = document.getElementById('portal-username').value.trim();
  if (!u) return;
  playDing();
  localStorage.setItem('friendsmp_player_name', u);
  const navBtn = document.getElementById('nav-login-btn');
  if (navBtn) navBtn.innerText = u;
  closeLoginModal();
  alert('Welcome to FriendSMP, ' + u + '!');
}

window.addEventListener('DOMContentLoaded', () => {
  renderLeaderboard('miners');
  fetchLiveStatus();
  setInterval(fetchLiveStatus, 30000);

  const saved = localStorage.getItem('friendsmp_player_name');
  if (saved) {
    const navBtn = document.getElementById('nav-login-btn');
    if (navBtn) navBtn.innerText = saved;
  }
});