const FIREBASE_SDK_VERSION = '10.12.5';
const PLAYER_NAME = `Player-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

const cosmeticCatalog = {
  HAIR_01: { slot: 'hair', label: 'Cyber Blue Hair', color: '#38bdf8', premium: false },
  HAIR_02: { slot: 'hair', label: 'Bubblegum Pop Hair', color: '#ff4fd8', premium: true },
  HAIR_03: { slot: 'hair', label: 'Solar Flare Hair', color: '#fb923c', premium: true },
  HAIR_04: { slot: 'hair', label: 'Emerald Runner Hair', color: '#34d399', premium: false },
  HAIR_05: { slot: 'hair', label: 'Galaxy VIP Hair', color: '#a855f7', premium: true },
  STARTER_SHIRT: { slot: 'shirt', label: 'Starter Red Tee', color: '#ef4444', premium: false },
  NEON_HOODIE: { slot: 'shirt', label: 'Neon Hoodie', color: '#22c55e', premium: true },
  GOLD_SHIRT: { slot: 'shirt', label: 'Gold Champion Shirt', color: '#facc15', premium: true },
  ICE_JACKET: { slot: 'shirt', label: 'Ice Circuit Jacket', color: '#67e8f9', premium: false },
  FACE_SPARKLE: { slot: 'face', label: 'Sparkle Face', color: '#fde68a', premium: false },
  FACE_SHADES: { slot: 'face', label: 'VIP Shades', color: '#111827', premium: true },
  FACE_STARS: { slot: 'face', label: 'Star Eyes', color: '#f0abfc', premium: true }
};

const GAME_LIBRARY = [
  { Title: 'Star Defender', Thumbnail_URL: thumbnail('Star Defender', '#60a5fa', 'Action'), Game_URL: '/games/index.html?game=star-defender', Category: 'Action' },
  { Title: 'Ninja Dash', Thumbnail_URL: thumbnail('Ninja Dash', '#f87171', 'Action'), Game_URL: '/games/index.html?game=ninja-dash', Category: 'Action' },
  { Title: 'Slime Arena', Thumbnail_URL: thumbnail('Slime Arena', '#4ade80', 'Action'), Game_URL: '/games/index.html?game=slime-arena', Category: 'Action' },
  { Title: 'Mech Blaster', Thumbnail_URL: thumbnail('Mech Blaster', '#818cf8', 'Action'), Game_URL: '/games/index.html?game=mech-blaster', Category: 'Action' },
  { Title: 'Pirate Cannon', Thumbnail_URL: thumbnail('Pirate Cannon', '#fb7185', 'Action'), Game_URL: '/games/index.html?game=pirate-cannon', Category: 'Action' },
  { Title: 'Kart Sprint', Thumbnail_URL: thumbnail('Kart Sprint', '#facc15', 'Racing'), Game_URL: '/games/index.html?game=kart-sprint', Category: 'Racing' },
  { Title: 'Hover Rush', Thumbnail_URL: thumbnail('Hover Rush', '#22d3ee', 'Racing'), Game_URL: '/games/index.html?game=hover-rush', Category: 'Racing' },
  { Title: 'Turbo Tunnel', Thumbnail_URL: thumbnail('Turbo Tunnel', '#fb7185', 'Racing'), Game_URL: '/games/index.html?game=turbo-tunnel', Category: 'Racing' },
  { Title: 'Rocket Rally', Thumbnail_URL: thumbnail('Rocket Rally', '#f97316', 'Racing'), Game_URL: '/games/index.html?game=rocket-rally', Category: 'Racing' },
  { Title: 'Drift City', Thumbnail_URL: thumbnail('Drift City', '#2dd4bf', 'Racing'), Game_URL: '/games/index.html?game=drift-city', Category: 'Racing' },
  { Title: 'Gem Match', Thumbnail_URL: thumbnail('Gem Match', '#a78bfa', 'Puzzle'), Game_URL: '/games/index.html?game=gem-match', Category: 'Puzzle' },
  { Title: 'Number Pop', Thumbnail_URL: thumbnail('Number Pop', '#34d399', 'Puzzle'), Game_URL: '/games/index.html?game=number-pop', Category: 'Puzzle' },
  { Title: 'Maze Lite', Thumbnail_URL: thumbnail('Maze Lite', '#fbbf24', 'Puzzle'), Game_URL: '/games/index.html?game=maze-lite', Category: 'Puzzle' },
  { Title: 'Color Switcher', Thumbnail_URL: thumbnail('Color Switcher', '#f472b6', 'Puzzle'), Game_URL: '/games/index.html?game=color-switcher', Category: 'Puzzle' },
  { Title: 'Block Stack', Thumbnail_URL: thumbnail('Block Stack', '#93c5fd', 'Puzzle'), Game_URL: '/games/index.html?game=block-stack', Category: 'Puzzle' },
  { Title: 'Cloud Hop Obby', Thumbnail_URL: thumbnail('Cloud Hop', '#93c5fd', 'Obby'), Game_URL: '/games/index.html?game=obby-cloud-hop', Category: 'Obby' },
  { Title: 'Lava Steps', Thumbnail_URL: thumbnail('Lava Steps', '#f97316', 'Obby'), Game_URL: '/games/index.html?game=lava-steps', Category: 'Obby' },
  { Title: 'Sky Bridge', Thumbnail_URL: thumbnail('Sky Bridge', '#c084fc', 'Obby'), Game_URL: '/games/index.html?game=sky-bridge', Category: 'Obby' },
  { Title: 'Crystal Climb', Thumbnail_URL: thumbnail('Crystal Climb', '#67e8f9', 'Obby'), Game_URL: '/games/index.html?game=crystal-climb', Category: 'Obby' },
  { Title: 'Moon Bounce', Thumbnail_URL: thumbnail('Moon Bounce', '#e879f9', 'Obby'), Game_URL: '/games/index.html?game=moon-bounce', Category: 'Obby' }
];

const defaultAvatar = () => ({ hair: 'HAIR_01', shirt: 'STARTER_SHIRT', face: 'FACE_SPARKLE' });
const localProfile = JSON.parse(localStorage.getItem('pixelvibe.production.profile') || 'null');
const state = {
  userId: `guest-${Math.random().toString(36).slice(2, 10)}`,
  profile: localProfile || { coins: 0, unlockedPremiumIds: [], avatar: defaultAvatar() },
  currentView: 'lobby',
  selectedCategory: 'All',
  players: [],
  messages: [{ id: 'system', name: 'System', text: 'Welcome to the global lobby. Keep chat friendly!' }],
  me: { id: 'local', name: PLAYER_NAME, x: 52, y: 48, avatar: localProfile?.avatar || defaultAvatar() },
  firebase: null,
  activeGame: null
};
state.me.id = state.userId;

const root = document.getElementById('root');
const firebaseConfig = () => window.PIXELVIBE_FIREBASE_CONFIG || window.KBA_FIREBASE_CONFIG;
const channel = 'BroadcastChannel' in window ? new BroadcastChannel('pixelvibe.production.lobby') : null;
const movementKeys = new Set();

function thumbnail(title, color, category) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#050816"/><stop offset="1" stop-color="${color}"/></linearGradient></defs><rect width="640" height="360" rx="34" fill="url(#g)"/><circle cx="500" cy="80" r="95" fill="${color}" opacity=".28"/><circle cx="90" cy="285" r="120" fill="#fff" opacity=".08"/><text x="40" y="70" fill="#fff" font-size="30" font-family="Arial" font-weight="700">${category}</text><text x="40" y="214" fill="#fff" font-size="54" font-family="Arial" font-weight="900">${title}</text><text x="42" y="270" fill="#dbeafe" font-size="24" font-family="Arial">Instant HTML5 Mini-Game</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function html(strings, ...values) {
  return strings.map((part, index) => `${part}${values[index] ?? ''}`).join('');
}

function saveProfileToLocal() {
  localStorage.setItem('pixelvibe.production.profile', JSON.stringify(state.profile));
}

async function saveAvatarToFirestore() {
  saveProfileToLocal();
  if (!state.firebase) return;
  await state.firebase.setDoc(state.firebase.userRef, {
    avatar: state.profile.avatar,
    coins: state.profile.coins,
    unlockedPremiumIds: state.profile.unlockedPremiumIds,
    updatedAt: state.firebase.serverTimestamp()
  }, { merge: true });
}

async function initFirebase() {
  if (!firebaseConfig()) return setConnectionStatus('Local realtime mode · add window.PIXELVIBE_FIREBASE_CONFIG for Firestore');

  try {
    const [appSdk, authSdk, firestoreSdk] = await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-auth.js`),
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-firestore.js`)
    ]);

    const app = appSdk.initializeApp(firebaseConfig());
    const auth = authSdk.getAuth(app);
    const db = firestoreSdk.getFirestore(app);
    const credential = await authSdk.signInAnonymously(auth);
    state.userId = credential.user.uid;
    state.me.id = state.userId;

    const userRef = firestoreSdk.doc(db, 'users', state.userId);
    const snapshot = await firestoreSdk.getDoc(userRef);
    if (snapshot.exists()) {
      state.profile = { ...state.profile, ...snapshot.data() };
      state.me.avatar = state.profile.avatar || defaultAvatar();
    } else {
      await firestoreSdk.setDoc(userRef, {
        displayName: PLAYER_NAME,
        avatar: state.profile.avatar,
        coins: state.profile.coins,
        unlockedPremiumIds: state.profile.unlockedPremiumIds,
        createdAt: firestoreSdk.serverTimestamp()
      });
    }

    state.firebase = {
      db,
      userRef,
      addDoc: firestoreSdk.addDoc,
      collection: firestoreSdk.collection,
      doc: firestoreSdk.doc,
      limit: firestoreSdk.limit,
      onSnapshot: firestoreSdk.onSnapshot,
      orderBy: firestoreSdk.orderBy,
      query: firestoreSdk.query,
      serverTimestamp: firestoreSdk.serverTimestamp,
      setDoc: firestoreSdk.setDoc
    };

    firestoreSdk.onSnapshot(
      firestoreSdk.query(firestoreSdk.collection(db, 'globalChat'), firestoreSdk.orderBy('createdAt', 'desc'), firestoreSdk.limit(60)),
      snapshot => {
        state.messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse();
        renderChat();
      }
    );

    renderAll();
    setConnectionStatus('Firebase online · Firestore profile + global chat active');
  } catch (error) {
    console.warn('Firebase initialization failed, falling back to local mode.', error);
    setConnectionStatus('Local realtime mode · Firebase config failed');
  }
}

function setConnectionStatus(text) {
  const status = document.querySelector('[data-connection-status]');
  if (status) status.textContent = text;
}

function renderAll() {
  root.innerHTML = html`
    <main class="app-shell">
      <header class="topbar glass-panel">
        <div>
          <p class="eyebrow">Production MVP</p>
          <h1>PixelVibe</h1>
        </div>
        <nav class="view-tabs" aria-label="Main views">
          <button class="${state.currentView === 'lobby' ? 'active' : ''}" data-view="lobby">Game Lobby</button>
          <button class="${state.currentView === 'shop' ? 'active' : ''}" data-view="shop">Avatar Shop</button>
        </nav>
        <div class="wallet">
          <span>🪙 ${state.profile.coins}</span>
          <small data-connection-status>Connecting...</small>
        </div>
      </header>

      <section class="view-stack">
        <section class="view ${state.currentView === 'lobby' ? 'active' : ''}" id="lobbyView">
          <div class="lobby-layout">
            <section class="world glass-panel">
              <div class="world-hud">
                <span>Live Lobby</span>
                <small>WASD / Arrow Keys to move · players sync across tabs</small>
              </div>
              <div class="road road-x"></div>
              <div class="road road-y"></div>
              <div class="neon-plaza">PIXELVIBE PLAZA</div>
              <div class="portal-ring" id="portalRing"></div>
              <div id="playersLayer"></div>
            </section>

            <aside class="social-column">
              <section class="chat-card glass-panel">
                <div class="panel-title"><h2>Global Chat</h2><span>Firebase / Local</span></div>
                <div class="messages" id="messages"></div>
                <form id="chatForm" class="chat-form">
                  <input id="chatInput" maxlength="140" placeholder="Type a friendly message..." autocomplete="off" />
                  <button>Send</button>
                </form>
              </section>
            </aside>
          </div>

          <section class="games-section glass-panel">
            <div class="section-header">
              <div>
                <p class="eyebrow">Instant Play</p>
                <h2>20 HTML5 Mini-Games</h2>
              </div>
              <div class="filters" id="categoryFilters"></div>
            </div>
            <div class="game-grid" id="gameGrid"></div>
          </section>
        </section>

        <section class="view ${state.currentView === 'shop' ? 'active' : ''}" id="shopView">
          <div class="shop-layout">
            <section class="avatar-preview glass-panel">
              <p class="eyebrow">Avatar Preview</p>
              <div class="large-avatar" id="largeAvatar"></div>
              <div class="equipped-list" id="equippedList"></div>
            </section>

            <section class="avatar-shop glass-panel">
              <div class="section-header">
                <div>
                  <p class="eyebrow">Equip-by-ID</p>
                  <h2>Avatar Shop</h2>
                </div>
                <button class="reward-button" id="rewardButton">Watch Ad → Unlock Premium + 50 Coins</button>
              </div>
              <div class="equip-box">
                <input id="itemIdInput" placeholder="Enter Unique Item ID, e.g. HAIR_05 or GOLD_SHIRT" />
                <button id="equipButton">Equip Item ID</button>
              </div>
              <p class="shop-status" id="shopStatus">Enter a free item ID or unlock premium IDs with a rewarded video.</p>
              <div class="cosmetic-grid" id="cosmeticGrid"></div>
            </section>
          </div>
        </section>
      </section>

      <div id="gameOverlay"></div>
    </main>
  `;

  bindGlobalEvents();
  renderPortals();
  renderGameFilters();
  renderGameGrid();
  renderPlayers();
  renderChat();
  renderAvatarShop();
  renderAvatarPreview();
  setConnectionStatus(firebaseConfig() ? 'Connecting to Firebase...' : 'Local realtime mode · add window.PIXELVIBE_FIREBASE_CONFIG for Firestore');
}

function bindGlobalEvents() {
  document.querySelectorAll('[data-view]').forEach(button => {
    button.addEventListener('click', () => {
      state.currentView = button.dataset.view;
      renderAll();
    });
  });

  document.getElementById('chatForm')?.addEventListener('submit', sendChatMessage);
  document.getElementById('equipButton')?.addEventListener('click', equipItemById);
  document.getElementById('rewardButton')?.addEventListener('click', () => showRewardedVideo());
}

function renderPortals() {
  const mount = document.getElementById('portalRing');
  if (!mount) return;
  mount.innerHTML = GAME_LIBRARY.slice(0, 8).map((game, index) => {
    const angle = (index / 8) * Math.PI * 2;
    const x = 48 + Math.cos(angle) * 34;
    const y = 45 + Math.sin(angle) * 28;
    return `<button class="world-portal" data-game-url="${game.Game_URL}" style="left:${x}%;top:${y}%"><span>${game.Category}</span><strong>${game.Title}</strong></button>`;
  }).join('');

  mount.querySelectorAll('.world-portal').forEach(button => {
    button.addEventListener('click', () => openGame(GAME_LIBRARY.find(game => game.Game_URL === button.dataset.gameUrl)));
  });
}

function renderGameFilters() {
  const categories = ['All', ...new Set(GAME_LIBRARY.map(game => game.Category))];
  const mount = document.getElementById('categoryFilters');
  if (!mount) return;
  mount.innerHTML = categories.map(category => `<button class="${state.selectedCategory === category ? 'active' : ''}" data-category="${category}">${category}</button>`).join('');
  mount.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      state.selectedCategory = button.dataset.category;
      renderGameFilters();
      renderGameGrid();
    });
  });
}

function renderGameGrid() {
  const mount = document.getElementById('gameGrid');
  if (!mount) return;
  const games = state.selectedCategory === 'All' ? GAME_LIBRARY : GAME_LIBRARY.filter(game => game.Category === state.selectedCategory);
  mount.innerHTML = games.map(game => html`
    <article class="game-card" data-game-url="${game.Game_URL}">
      <img src="${game.Thumbnail_URL}" alt="${game.Title} thumbnail" loading="lazy" />
      <div class="game-card-body">
        <span>${game.Category}</span>
        <h3>${game.Title}</h3>
        <button>Play Instantly</button>
      </div>
    </article>
  `).join('');

  mount.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => openGame(GAME_LIBRARY.find(game => game.Game_URL === card.dataset.gameUrl)));
  });
}

function renderAvatarShop() {
  const mount = document.getElementById('cosmeticGrid');
  if (!mount) return;
  mount.innerHTML = Object.entries(cosmeticCatalog).map(([id, item]) => {
    const locked = item.premium && !state.profile.unlockedPremiumIds.includes(id);
    return html`
      <button class="cosmetic-card ${locked ? 'locked' : ''}" data-item-id="${id}">
        <span class="swatch" style="--item-color:${item.color}"></span>
        <strong>${item.label}</strong>
        <small>${id} · ${item.slot.toUpperCase()}</small>
        <em>${item.premium ? locked ? 'Premium Locked' : 'Premium Unlocked' : 'Free'}</em>
      </button>
    `;
  }).join('');

  mount.querySelectorAll('.cosmetic-card').forEach(card => {
    card.addEventListener('click', () => {
      document.getElementById('itemIdInput').value = card.dataset.itemId;
      equipItemById();
    });
  });
}

function renderAvatarPreview() {
  const preview = document.getElementById('largeAvatar');
  const equipped = document.getElementById('equippedList');
  if (!preview || !equipped) return;
  preview.innerHTML = avatarMarkup(state.me, 'preview-avatar');
  equipped.innerHTML = Object.entries(state.profile.avatar).map(([slot, id]) => `<span>${slot}: <strong>${id}</strong></span>`).join('');
}

function equipItemById() {
  const input = document.getElementById('itemIdInput');
  const status = document.getElementById('shopStatus');
  const id = input.value.trim().toUpperCase();
  const item = cosmeticCatalog[id];

  if (!item) {
    status.textContent = `Item ID "${id}" was not found. Try HAIR_05 or GOLD_SHIRT.`;
    status.className = 'shop-status error';
    return;
  }

  if (item.premium && !state.profile.unlockedPremiumIds.includes(id)) {
    status.textContent = `${id} is premium. Watch the rewarded video to unlock rare cosmetics first.`;
    status.className = 'shop-status warning';
    return;
  }

  state.profile.avatar = { ...state.profile.avatar, [item.slot]: id };
  state.me.avatar = state.profile.avatar;
  saveAvatarToFirestore();
  publishPresence();
  status.textContent = `${item.label} equipped and saved${state.firebase ? ' to Firestore' : ' locally'}.`;
  status.className = 'shop-status success';
  renderAvatarPreview();
  renderAvatarShop();
  renderPlayers();
}

async function showRewardedVideo() {
  const status = document.getElementById('shopStatus');
  const button = document.getElementById('rewardButton');
  if (button) button.disabled = true;
  if (status) {
    status.textContent = 'Rewarded video playing... stay until the end to claim your reward.';
    status.className = 'shop-status warning';
  }

  await new Promise(resolve => setTimeout(resolve, 1400));

  const premiumIds = Object.entries(cosmeticCatalog).filter(([, item]) => item.premium).map(([id]) => id);
  state.profile.unlockedPremiumIds = [...new Set([...state.profile.unlockedPremiumIds, ...premiumIds])];
  state.profile.coins += 50;
  await saveAvatarToFirestore();

  if (status) {
    status.textContent = 'Reward complete: +50 coins and all premium cosmetic IDs unlocked.';
    status.className = 'shop-status success';
  }
  if (button) button.disabled = false;
  renderAll();
}
window.showRewardedVideo = showRewardedVideo;

function renderPlayers() {
  const mount = document.getElementById('playersLayer');
  if (!mount) return;
  const visiblePlayers = [state.me, ...botPlayers(), ...state.players.filter(player => player.id !== state.me.id && !player.bot)].slice(0, 18);
  mount.innerHTML = visiblePlayers.map(player => avatarMarkup(player, 'map-avatar')).join('');
}

function avatarMarkup(player, className) {
  const avatar = player.avatar || defaultAvatar();
  const hair = cosmeticCatalog[avatar.hair] || cosmeticCatalog.HAIR_01;
  const shirt = cosmeticCatalog[avatar.shirt] || cosmeticCatalog.STARTER_SHIRT;
  const face = cosmeticCatalog[avatar.face] || cosmeticCatalog.FACE_SPARKLE;
  const style = `--x:${player.x || 50}%;--y:${player.y || 50}%;--hair:${hair.color};--shirt:${shirt.color};--face:${face.color}`;
  return html`
    <div class="avatar ${className}" style="${style}">
      <span class="avatar-name">${player.id === state.me.id ? 'You' : player.name}</span>
      <span class="avatar-body">
        <i class="avatar-hair"></i>
        <i class="avatar-head"><b></b></i>
        <i class="avatar-shirt"></i>
        <i class="avatar-legs"></i>
      </span>
    </div>
  `;
}

function botPlayers() {
  const avatars = [
    { hair: 'HAIR_02', shirt: 'NEON_HOODIE', face: 'FACE_SPARKLE' },
    { hair: 'HAIR_04', shirt: 'ICE_JACKET', face: 'FACE_STARS' },
    { hair: 'HAIR_03', shirt: 'GOLD_SHIRT', face: 'FACE_SHADES' }
  ];
  return ['Mia', 'Kai', 'Zed'].map((name, index) => ({
    id: `bot-${index}`,
    name,
    avatar: avatars[index],
    x: 20 + ((Date.now() / 80 + index * 25) % 62),
    y: 25 + Math.sin(Date.now() / 900 + index) * 18 + index * 14,
    bot: true
  }));
}

async function sendChatMessage(event) {
  event.preventDefault();
  const input = document.getElementById('chatInput');
  const text = input.value.trim().slice(0, 140);
  if (!text) return;

  const message = { id: crypto.randomUUID(), userId: state.userId, name: PLAYER_NAME, text, createdAt: Date.now() };
  state.messages.push(message);
  channel?.postMessage({ type: 'chat', message });

  if (state.firebase) {
    await state.firebase.addDoc(state.firebase.collection(state.firebase.db, 'globalChat'), {
      userId: state.userId,
      name: PLAYER_NAME,
      text,
      createdAt: state.firebase.serverTimestamp()
    });
  }

  input.value = '';
  renderChat();
}

function renderChat() {
  const mount = document.getElementById('messages');
  if (!mount) return;
  mount.innerHTML = state.messages.slice(-60).map(message => `<p><strong>${message.name || 'Player'}:</strong> ${message.text}</p>`).join('');
  mount.scrollTop = mount.scrollHeight;
}

function openGame(game) {
  if (!game) return;
  state.activeGame = game;
  document.getElementById('gameOverlay').innerHTML = html`
    <section class="game-overlay">
      <div class="game-window glass-panel">
        <div class="game-window-bar">
          <div>
            <span>${game.Category}</span>
            <strong>${game.Title}</strong>
          </div>
          <button id="closeGame">Exit to Lobby</button>
        </div>
        <iframe title="${game.Title}" src="${game.Game_URL}" allow="autoplay; fullscreen"></iframe>
      </div>
    </section>
  `;
  document.getElementById('closeGame').addEventListener('click', () => {
    state.activeGame = null;
    document.getElementById('gameOverlay').innerHTML = '';
  });
}

function publishPresence() {
  channel?.postMessage({ type: 'presence', player: state.me });
}

channel?.addEventListener('message', event => {
  if (event.data?.type === 'presence') {
    state.players = [event.data.player, ...state.players.filter(player => player.id !== event.data.player.id)].slice(0, 24);
    renderPlayers();
  }
  if (event.data?.type === 'chat') {
    state.messages.push(event.data.message);
    renderChat();
  }
});

window.addEventListener('message', event => {
  if (!event.data?.event) return;
  if (event.data.event === 'score_submitted') {
    console.info('Mini-game bridge score event:', event.data);
  }
});

window.addEventListener('keydown', event => movementKeys.add(event.key.toLowerCase()));
window.addEventListener('keyup', event => movementKeys.delete(event.key.toLowerCase()));

setInterval(() => {
  const dx = (movementKeys.has('d') || movementKeys.has('arrowright') ? 1 : 0) - (movementKeys.has('a') || movementKeys.has('arrowleft') ? 1 : 0);
  const dy = (movementKeys.has('s') || movementKeys.has('arrowdown') ? 1 : 0) - (movementKeys.has('w') || movementKeys.has('arrowup') ? 1 : 0);
  if (!dx && !dy) return;
  state.me.x = Math.max(7, Math.min(92, state.me.x + dx * 1.1));
  state.me.y = Math.max(12, Math.min(84, state.me.y + dy * 1.1));
  publishPresence();
  renderPlayers();
}, 32);

setInterval(() => {
  publishPresence();
  renderPlayers();
}, 850);

renderAll();
initFirebase();
