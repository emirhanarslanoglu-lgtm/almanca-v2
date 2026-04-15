import defaultDeck from './data.js';

let activeDeck = [];
let currentCategory = 'tümü';
let filteredCards = [];
let currentIndex = 0;

// State Management
let favorites = JSON.parse(localStorage.getItem('b2_german_favorites')) || [];
let learned = JSON.parse(localStorage.getItem('b2_german_learned')) || [];
let review = JSON.parse(localStorage.getItem('b2_german_review')) || [];
let customFolders = JSON.parse(localStorage.getItem('b2_german_folders')) || {};
let stats = JSON.parse(localStorage.getItem('b2_german_stats')) || { flipped: 0, timeSpentSec: 0, xp: 0, level: 1 };
if (!stats.xp) stats.xp = 0;
if (!stats.level) stats.level = 1;
let quizWrongs = JSON.parse(localStorage.getItem('b2_quiz_wrongs')) || {};
let srsData = JSON.parse(localStorage.getItem('b2_german_srs')) || {}; // { wordId: { interval: N, nextReview: 'YYYY-MM-DD' } }

// DOM Elements
const cardContainer = document.getElementById('card-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentIndexEl = document.getElementById('current-index');
const totalCountEl = document.getElementById('total-count');
const categoryBtns = document.querySelectorAll('.category-btn');
const themeBtns = document.querySelectorAll('.theme-btn');

// Sidebar Elements
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
const closeSidebarBtn = document.getElementById('close-sidebar');
const sidebarNavBtns = document.querySelectorAll('.sidebar-nav .menu-btn');

// Stat Elements
const statFlipped = document.getElementById('stat-flipped');
const statFavorites = document.getElementById('stat-favorites');
const statLearned = document.getElementById('stat-learned');
const statReview = document.getElementById('stat-review');
const statTime = document.getElementById('stat-time');

// Modal Elements
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const exportBtn = document.getElementById('export-btn');
const importFile = document.getElementById('import-file');
const resetBtn = document.getElementById('reset-btn');
const deckSizeEl = document.getElementById('deck-size');

// Guide Modal Elements
const guideBtn = document.getElementById('guide-btn');
const guideModal = document.getElementById('guide-modal');
const closeGuideBtn = document.getElementById('close-guide-btn');
const guideOkBtn = document.getElementById('guide-ok-btn');

// Quiz Elements
const quizModal = document.getElementById('quiz-modal');
const closeQuizBtn = document.getElementById('close-quiz-btn');
const quizMenu = document.getElementById('quiz-menu');
const quizPlayArea = document.getElementById('quiz-play-area');
const quizResultsArea = document.getElementById('quiz-results-area');
const quizCardWrapper = document.getElementById('quiz-card-wrapper');
const quizNextBtn = document.getElementById('quiz-next-action-btn');
const quizFinishEarlyBtn = document.getElementById('quiz-finish-early-btn');
const quizStartBtns = document.querySelectorAll('.quiz-start-btn');
const quizIdxEl = document.getElementById('quiz-idx');
const quizTotalEl = document.getElementById('quiz-total-count');

// Quiz State
let isQuizActive = false;
let quizMode = 0; 
let quizCards = [];
let currentQuizIdx = 0;
let quizResults = [];
let mcqAnswered = false; 

// ==========================================
// STREAK SYSTEM
// ==========================================
function getStreak() {
    const activityLog = JSON.parse(localStorage.getItem('b2_activity_log')) || {};
    const allDates = Object.keys(activityLog).sort().reverse();
    if (allDates.length === 0) return 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // If not active today or yesterday, streak is broken
    if (!activityLog[today] && !activityLog[yesterday]) return 0;

    let streak = 0;
    let checkDate = activityLog[today] ? new Date() : new Date(Date.now() - 86400000);

    for (let i = 0; i < 365; i++) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (activityLog[dateStr] && activityLog[dateStr] > 0) {
            streak++;
            checkDate = new Date(checkDate.getTime() - 86400000);
        } else {
            break;
        }
    }
    return streak;
}

function renderStreakUI() {
    const streakEl = document.getElementById('streak-display');
    if (!streakEl) return;

    const today = new Date().toISOString().split('T')[0];
    const activityLog = JSON.parse(localStorage.getItem('b2_activity_log')) || {};
    const todayActive = activityLog[today] > 0;
    const streak = getStreak();

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const yesterdayActive = activityLog[yesterday] > 0;
    
    // Streak broken if neither today nor yesterday has activity
    const isBroken = !todayActive && !yesterdayActive;

    let emoji, color, label, statusText, animClass;
    
    if (isBroken || streak === 0) {
        emoji = '🧊';
        color = '#63b3ed';
        label = 'Seri Bozuldu';
        statusText = 'Tekrar canlandırmak için bugün çalış!';
        animClass = 'ice';
    } else {
        color = streak >= 7 ? '#f56565' : (streak >= 3 ? '#ed8936' : '#f6ad55');
        emoji = streak >= 7 ? '🔥🔥🔥' : (streak >= 3 ? '🔥🔥' : '🔥');
        label = `${streak} Günlük Seri!`;
        statusText = todayActive ? 'Harika! Bugünlük kotanı doldurdun.' : 'Seriyi devam ettirmek için çalış!';
        animClass = 'fire';
    }

    streakEl.innerHTML = `
        <div class="streak-box">
            <span class="streak-emoji ${animClass}">${emoji}</span>
            <div>
                <div style="font-weight:700; font-size:1.1rem; color:${color};">${label}</div>
                <div style="font-size:0.78rem; color:#718096; opacity: 0.8;">
                    ${statusText}
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// WEAK POINT ANALYSIS
// ==========================================
function renderWeakPointsUI() {
    const el = document.getElementById('weak-points-panel');
    if (!el) return;

    const wrongEntries = Object.entries(quizWrongs)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    if (wrongEntries.length === 0) {
        el.innerHTML = `<div style="text-align:center; color:#a0aec0; font-size:0.85rem; padding:15px; background:rgba(0,0,0,0.02); border-radius:12px;">
            Yeterli veri yok.<br>Quiz yaparak analizi başlat! 🎯
        </div>`;
        return;
    }

    let html = '';
    wrongEntries.forEach(([id, cnt]) => {
        const card = activeDeck.find(c => c.id == id);
        if (!card) return;
        const barW = Math.min(100, cnt * 20);
        html += `
            <div class="weak-point-item">
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:4px;">
                    <span style="font-weight:700; color:var(--text-color);">${card.germanWord}</span>
                    <span style="color:#f56565; font-weight:600;">${cnt} hata</span>
                </div>
                <div class="weak-point-bar-container">
                    <div class="weak-point-bar-fill" style="width:${barW}%"></div>
                </div>
            </div>
        `;
    });

    // Category Breakdown
    const catWrongs = {};
    Object.entries(quizWrongs).forEach(([id, cnt]) => {
        const card = activeDeck.find(c => c.id == id);
        if (card) {
            catWrongs[card.category] = (catWrongs[card.category] || 0) + cnt;
        }
    });

    const catEntries = Object.entries(catWrongs).sort((a,b) => b[1]-a[1]).slice(0, 3);
    if (catEntries.length > 0) {
        html += `<div style="font-size:0.8rem; color:#718096; margin-top:15px; padding-left:5px; border-left:3px solid #ed8936;">
            <strong>En çok zorlandığın kategoriler:</strong><br>
            ${catEntries.map(([cat, cnt]) => `${capitalize(cat)} (${cnt} hata)`).join(', ')}
        </div>`;
    }

    el.innerHTML = html;
}

// Initialize
function init() {
    initTheme();
    loadActiveDeck();
    setupCategoryListeners();
    setupControls();
    setupSwipe();
    setupModalListeners();
    setupSidebar();
    setupQuizListeners();
    filterCards('tümü');
    updateStatsUI();
    
    // Time tracking
    setInterval(() => {
        stats.timeSpentSec += 1;
        if (stats.timeSpentSec % 10 === 0) saveStats();
        updateTimeUI();
    }, 1000);

    renderHeatmap();
    renderStreakUI();
    renderWeakPointsUI();
    loadFolders();
    
    const addFolderBtn = document.getElementById('add-folder-btn');
    if(addFolderBtn) {
        addFolderBtn.addEventListener('click', () => {
            const fName = prompt("Yeni klasörünüzün adını girin:");
            if(fName && fName.trim().length > 0) {
                if(!customFolders[fName]) {
                    customFolders[fName] = [];
                    localStorage.setItem('b2_german_folders', JSON.stringify(customFolders));
                    loadFolders();
                } else alert("Bu klasör zaten var.");
            }
        });
    }

    // Special Header Listeners
    const specialBackBtn = document.getElementById('special-back-btn');
    const specialHomeBtn = document.getElementById('special-home-btn');
    if (specialBackBtn) specialBackBtn.addEventListener('click', () => filterCards('tümü'));
    if (specialHomeBtn) specialHomeBtn.addEventListener('click', () => filterCards('tümü'));
    
    document.querySelectorAll('.special-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterCards(btn.getAttribute('data-target'));
        });
    });

    // Mindmap listeners
    const closeMindmapBtn = document.getElementById('close-mindmap-btn');
    const mindmapRefreshBtn = document.getElementById('mindmap-refresh-btn');
    if (closeMindmapBtn) closeMindmapBtn.addEventListener('click', closeMindmap);
    if (mindmapRefreshBtn) mindmapRefreshBtn.addEventListener('click', renderMindmap);

    updateXpUI();
}

// ==========================================
// XP & LEVEL SYSTEM
// ==========================================
const LEVEL_TITLES = [
    'Anfänger', 'Lernender', 'Schüler', 'Geselle', 'Kämpfer',
    'Meister', 'Experte', 'Champion', 'Legende', 'Wortgott'
];
const XP_PER_LEVEL = 100;

function addXP(amount) {
    const prevLevel = stats.level;
    stats.xp = (stats.xp || 0) + amount;
    stats.level = Math.floor(stats.xp / XP_PER_LEVEL) + 1;
    if (stats.level > 10) stats.level = 10;
    saveStats();
    updateXpUI();
    if (stats.level > prevLevel) {
        showToast(`🎉 Seviye atladın! Seviye ${stats.level} — ${LEVEL_TITLES[stats.level - 1]}`, 'success');
    }
}

function updateXpUI() {
    const levelEl = document.getElementById('user-level');
    const titleEl = document.getElementById('user-title');
    const xpEl = document.getElementById('user-xp');
    const barEl = document.getElementById('xp-bar-fill');
    if (!levelEl) return;
    const lvl = Math.min(stats.level || 1, 10);
    const xpInLevel = (stats.xp || 0) % XP_PER_LEVEL;
    const pct = (xpInLevel / XP_PER_LEVEL) * 100;
    levelEl.textContent = lvl;
    if (titleEl) titleEl.textContent = LEVEL_TITLES[lvl - 1];
    if (xpEl) xpEl.textContent = stats.xp || 0;
    if (barEl) barEl.style.width = pct + '%';
}

// ==========================================
// TTS - SESLI OKUMA
// ==========================================
function speakWord(word) {
    if (!window.speechSynthesis) { showToast('Tarayıcınız sesi desteklemiyor.', 'info'); return; }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(word);
    utt.lang = 'de-DE';
    utt.rate = 0.9;
    utt.pitch = 1;
    window.speechSynthesis.speak(utt);
}

// ==========================================
// SRS - ARALIKAL TEKRAR
// ==========================================
function updateSRS(id, correct) {
    const today = new Date().toISOString().split('T')[0];
    const entry = srsData[id] || { interval: 1 };
    if (correct) {
        entry.interval = Math.min((entry.interval || 1) * 2, 30);
    } else {
        entry.interval = 1;
    }
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + entry.interval);
    entry.nextReview = nextDate.toISOString().split('T')[0];
    srsData[id] = entry;
    localStorage.setItem('b2_german_srs', JSON.stringify(srsData));
}

function isDueSRS(id) {
    if (!srsData[id]) return true;
    const today = new Date().toISOString().split('T')[0];
    return srsData[id].nextReview <= today;
}

// ==========================================
// MINDMAP
// ==========================================
function openMindmap() {
    const modal = document.getElementById('mindmap-modal');
    if (!modal) return;
    modal.classList.add('active');
    const select = document.getElementById('mindmap-category-select');
    if (select) {
        const cats = [...new Set(activeDeck.map(c => c.category))].filter(Boolean);
        select.innerHTML = [
            '<option value="tümü">Tümü (Max 60)</option>',
            ...cats.map(c => `<option value="${c}">${capitalize(c)}</option>`)
        ].join('');
    }
    renderMindmap();
}

function closeMindmap() {
    const modal = document.getElementById('mindmap-modal');
    if (modal) modal.classList.remove('active');
}

function renderMindmap() {
    const canvas = document.getElementById('mindmap-canvas');
    if (!canvas) return;
    canvas.innerHTML = '';

    const select = document.getElementById('mindmap-category-select');
    const cat = select ? select.value : 'tümü';
    let pool = cat === 'tümü' ? activeDeck : activeDeck.filter(c => c.category === cat);
    if (pool.length > 60) pool = pool.slice(0, 60); // performans limiti

    const centerX = 1000, centerY = 1000;
    const radius = Math.min(600, 100 + pool.length * 12);

    // Center node
    const centerNode = document.createElement('div');
    centerNode.className = 'mindmap-center';
    centerNode.textContent = cat === 'tümü' ? '🇩🇪 Almanca' : capitalize(cat);
    centerNode.style.cssText = `position:absolute; left:${centerX}px; top:${centerY}px; transform:translate(-50%,-50%); background:var(--primary-color); color:white; padding:15px 25px; border-radius:50px; font-weight:800; font-size:1.1rem; box-shadow:0 8px 25px rgba(0,0,0,0.2); z-index:10; white-space:nowrap;`;
    canvas.appendChild(centerNode);

    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; overflow:visible;';
    canvas.appendChild(svg);

    const colorMap = { isimler:'#3b82f6', fiiller:'#10b981', sıfatlar:'#f59e0b', bağlaçlar:'#8b5cf6' };

    pool.forEach((card, i) => {
        const angle = (2 * Math.PI * i) / pool.length - Math.PI / 2;
        const r = radius + (i % 3) * 30; // slight variance
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);

        // Line
        const line = document.createElementNS('http://www.w3.org/2000/svg','line');
        line.setAttribute('x1', centerX); line.setAttribute('y1', centerY);
        line.setAttribute('x2', x); line.setAttribute('y2', y);
        line.setAttribute('stroke', colorMap[card.category] || '#cbd5e0');
        line.setAttribute('stroke-width', '1.5');
        line.setAttribute('stroke-opacity', '0.5');
        svg.appendChild(line);

        // Word node
        const node = document.createElement('div');
        const isLearned = learned.includes(card.id);
        const isReview = review.includes(card.id);
        const nodeColor = isLearned ? '#22c55e' : isReview ? '#ef4444' : (colorMap[card.category] || '#64748b');
        node.style.cssText = `position:absolute; left:${x}px; top:${y}px; transform:translate(-50%,-50%); background:white; border:2px solid ${nodeColor}; color:${nodeColor}; padding:5px 10px; border-radius:20px; font-weight:700; font-size:0.78rem; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.08); white-space:nowrap; z-index:5; max-width:130px; overflow:hidden; text-overflow:ellipsis; transition: transform 0.2s;`;
        node.title = `${card.germanWord} = ${card.turkishWord}`;
        node.textContent = card.germanWord;
        node.addEventListener('mouseenter', () => { node.style.transform = 'translate(-50%,-50%) scale(1.15)'; node.title = `${card.germanWord} = ${card.turkishWord}`; });
        node.addEventListener('mouseleave', () => { node.style.transform = 'translate(-50%,-50%) scale(1)'; });
        node.addEventListener('click', () => { speakWord(card.germanWord); showToast(`${card.germanWord} = ${card.turkishWord}`, 'info'); });
        canvas.appendChild(node);
    });

    // Pan support
    let isDragging = false, startX2 = 0, startY2 = 0, scrollLeft = 0, scrollTop = 0;
    const container = document.getElementById('mindmap-canvas-container');
    if (container) {
        container.scrollLeft = centerX - container.clientWidth / 2;
        container.scrollTop = centerY - container.clientHeight / 2;
        container.onmousedown = (e) => { isDragging = true; startX2 = e.pageX - container.offsetLeft; startY2 = e.pageY - container.offsetTop; scrollLeft = container.scrollLeft; scrollTop = container.scrollTop; container.style.cursor = 'grabbing'; };
        container.onmouseup = () => { isDragging = false; container.style.cursor = 'grab'; };
        container.onmousemove = (e) => { if (!isDragging) return; e.preventDefault(); const x = e.pageX - container.offsetLeft; const y = e.pageY - container.offsetTop; container.scrollLeft = scrollLeft - (x - startX2); container.scrollTop = scrollTop - (y - startY2); };
    }
}

// ==========================================
// QUIZ MODE 5 - VOICE (KONUSMA)
// ==========================================
function startVoiceQuiz(pool) {
    quizCardWrapper.innerHTML = '';
    const card = quizCards[currentQuizIdx];
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        quizCardWrapper.innerHTML = `<div style="text-align:center; padding:30px;"><p style="color:#f56565; font-size:1.1rem;">👎 Tarayıcınız ses tanımayı desteklemiyor.</p><p style="color:#718096; margin-top:10px;">Lütfen Google Chrome kullanın.</p></div>`;
        quizNextBtn.disabled = false;
        quizNextBtn.textContent = 'Atla';
        return;
    }
    let recognized = false;
    quizCardWrapper.innerHTML = `
        <div style="text-align:center; width:100%;">
            <p style="color:#718096; font-size:0.9rem; margin-bottom:5px;">Türkce anlamını görüyorsunuz:</p>
            <div style="font-size:1.8rem; font-weight:800; color:var(--primary-color); margin-bottom:20px; padding:15px; background:rgba(0,0,0,0.03); border-radius:12px;">${card.turkishWord}</div>
            <p style="margin-bottom:15px; color:#718096;">Almancasını mikrofona söyleyin...</p>
            <button id="voice-listen-btn" class="action-btn primary" style="width:80px; height:80px; border-radius:50%; font-size:1.8rem; padding:0; display:inline-flex; align-items:center; justify-content:center;">
                <i class="fas fa-microphone"></i>
            </button>
            <div id="voice-result" style="margin-top:15px; font-size:1rem; color:#4a5568; min-height:40px;"></div>
        </div>`;
    quizNextBtn.disabled = true;
    quizNextBtn.textContent = 'İleri';

    document.getElementById('voice-listen-btn').addEventListener('click', () => {
        const recognition = new SpeechRecognition();
        recognition.lang = 'de-DE';
        recognition.interimResults = false;
        recognition.maxAlternatives = 3;
        const btn = document.getElementById('voice-listen-btn');
        if (btn) { btn.style.background = '#ef4444'; btn.innerHTML = '<i class="fas fa-circle" style="animation:pulse 0.8s infinite;"></i>'; }
        recognition.start();
        recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript.toLowerCase().trim();
            const target = card.germanWord.toLowerCase().replace(/der |die |das /, '').trim();
            const ok = transcript.includes(target) || target.includes(transcript.split(' ').pop());
            recognized = true;
            const resultEl = document.getElementById('voice-result');
            if (resultEl) resultEl.innerHTML = ok
                ? `<span style="color:#22c55e; font-weight:bold;">✅ Duydum: "${transcript}" — Doğru!</span>`
                : `<span style="color:#ef4444;">❌ Duydum: "${transcript}" — Yanlış. Doğrusu: <strong>${card.germanWord}</strong></span>`;
            quizResults.push({ card, ok, out: transcript });
            if (!ok) { quizWrongs[card.id] = (quizWrongs[card.id] || 0) + 1; localStorage.setItem('b2_quiz_wrongs', JSON.stringify(quizWrongs)); }
            if (ok) addXP(5);
            logActivity();
            updateSRS(card.id, ok);
            quizNextBtn.disabled = false;
            if (ok) setTimeout(() => { if (isQuizActive) { currentQuizIdx++; renderQuizCard(); } }, 1500);
        };
        recognition.onerror = () => {
            const resultEl = document.getElementById('voice-result');
            if (resultEl) resultEl.innerHTML = '<span style="color:#f59e0b;">Ses alınamadı, tekrar deneyin.</span>';
            if (btn) { btn.style.background = ''; btn.innerHTML = '<i class="fas fa-microphone"></i>'; }
            quizNextBtn.disabled = false;
        };
        recognition.onend = () => {
            if (btn) { btn.style.background = ''; btn.innerHTML = '<i class="fas fa-microphone"></i>'; }
            if (!recognized) { quizNextBtn.disabled = false; }
        };
    });
}

// ==========================================
// QUIZ MODE 6 - DRAG & DROP
// ==========================================
let matchGameData = [];
let matchedCount = 0;
let matchPairs = [];

function startMatchGame() {
    quizCardWrapper.innerHTML = '';
    quizNextBtn.style.display = 'none';
    quizFinishEarlyBtn.style.display = 'none';
    matchPairs = quizCards.slice(0, Math.min(5, quizCards.length));
    matchedCount = 0;
    const shuffledRight = [...matchPairs].sort(() => 0.5 - Math.random());

    let leftHTML = '', rightHTML = '';
    matchPairs.forEach(c => {
        leftHTML += `<div class="match-card draggable" draggable="true" data-id="${c.id}" id="drag-${c.id}">${c.germanWord}</div>`;
    });
    shuffledRight.forEach(c => {
        rightHTML += `<div class="match-card dropzone" data-id="${c.id}" id="drop-${c.id}">${c.turkishWord}</div>`;
    });
    quizCardWrapper.innerHTML = `
        <div style="width:100%;">
            <p style="text-align:center; color:#718096; margin-bottom:15px; font-size:0.9rem;">Almancayı Türkçesinin üstune sürükleyin</p>
            <div style="display:flex; gap:10px; justify-content:space-between;">
                <div id="match-left" style="flex:1; display:flex; flex-direction:column; gap:8px;">${leftHTML}</div>
                <div id="match-right" style="flex:1; display:flex; flex-direction:column; gap:8px;">${rightHTML}</div>
            </div>
            <div id="match-result" style="text-align:center; margin-top:15px; font-weight:bold; min-height:30px;"></div>
        </div>`;

    document.querySelectorAll('.draggable').forEach(el => {
        el.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', el.dataset.id); el.style.opacity = '0.5'; });
        el.addEventListener('dragend', (e) => { el.style.opacity = '1'; });
    });
    document.querySelectorAll('.dropzone').forEach(zone => {
        zone.addEventListener('dragover', e => e.preventDefault());
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedId = e.dataTransfer.getData('text/plain');
            const targetId = zone.dataset.id;
            const ok = draggedId === targetId;
            if (ok) {
                zone.style.background = '#dcfce7'; zone.style.borderColor = '#22c55e'; zone.style.color = '#15803d';
                const dragEl = document.getElementById(`drag-${draggedId}`);
                if (dragEl) { dragEl.style.background = '#dcfce7'; dragEl.style.borderColor = '#22c55e'; dragEl.draggable = false; dragEl.style.opacity = '0.6'; }
                zone.ondragover = null; zone.ondrop = null;
                matchedCount++;
                quizResults.push({ card: matchPairs.find(c => c.id == draggedId), ok: true });
                addXP(5); logActivity();
                if (matchedCount === matchPairs.length) {
                    document.getElementById('match-result').innerHTML = '<span style="color:#22c55e; font-size:1.3rem;">🎉 Tüm eşleştirmeler tamamlandı!</span>';
                    setTimeout(() => { currentQuizIdx += matchPairs.length; if (currentQuizIdx >= quizCards.length) finishQuiz(); else { quizNextBtn.style.display = ''; quizFinishEarlyBtn.style.display = ''; startMatchGame(); } }, 1500);
                }
            } else {
                zone.style.animation = 'shake 0.4s ease';
                setTimeout(() => { zone.style.animation = ''; }, 400);
                quizResults.push({ card: matchPairs.find(c => c.id == draggedId), ok: false, out: 'Yanlış eşleştirme' });
                quizWrongs[draggedId] = (quizWrongs[draggedId] || 0) + 1;
                localStorage.setItem('b2_quiz_wrongs', JSON.stringify(quizWrongs));
            }
        });
    });
}

function initTheme() {
    const savedTheme = localStorage.getItem('b2_german_theme') || 'pastel-blue';
    applyTheme(savedTheme);
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            applyTheme(btn.getAttribute('data-theme'));
        });
    });
}

function applyTheme(theme) {
    localStorage.setItem('b2_german_theme', theme);
    
    let effectiveTheme = theme;
    if (theme === 'system') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'white';
    }
    
    document.body.classList.forEach(cls => {
        if (cls.startsWith('theme-')) document.body.classList.remove(cls);
    });
    
    themeBtns.forEach(btn => {
        btn.getAttribute('data-theme') === theme ? btn.classList.add('active') : btn.classList.remove('active');
    });
    
    document.body.classList.add(`theme-${effectiveTheme}`);
}

function loadActiveDeck() {
    const savedDeck = localStorage.getItem('b2_german_custom_deck');
    if (savedDeck) {
        try { activeDeck = JSON.parse(savedDeck); }
        catch(e) { activeDeck = [...defaultDeck]; }
    } else {
        activeDeck = [...defaultDeck];
    }
    if(deckSizeEl) deckSizeEl.textContent = activeDeck.length;
}

// ----- STATS -----
function saveStats() {
    localStorage.setItem('b2_german_stats', JSON.stringify(stats));
}

function updateStatsUI() {
    if(!statFlipped) return;
    statFlipped.textContent = stats.flipped;
    statFavorites.textContent = favorites.length;
    statLearned.textContent = learned.length;
    statReview.textContent = review.length;
    updateTimeUI();
    renderStreakUI();
    renderWeakPointsUI();
}

function updateTimeUI() {
    if(!statTime) return;
    const h = Math.floor(stats.timeSpentSec / 3600);
    const m = Math.floor((stats.timeSpentSec % 3600) / 60);
    const s = stats.timeSpentSec % 60;
    
    if (h > 0) statTime.textContent = `${h}s ${m}d`;
    else if (m > 0) statTime.textContent = `${m}d ${s}sn`;
    else statTime.textContent = `${s}sn`;
}

// ----- SIDEBAR -----
function setupSidebar() {
    if(!sidebarToggleBtn) return;
    sidebarToggleBtn.addEventListener('click', () => setSidebar(true));
    closeSidebarBtn.addEventListener('click', () => setSidebar(false));
    sidebarOverlay.addEventListener('click', () => setSidebar(false));

    sidebarNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.getAttribute('data-view');
            categoryBtns.forEach(b => b.classList.remove('active'));
            sidebarNavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (view === 'learned') { filterCards('learned'); setSidebar(false); }
            else if (view === 'review') { filterCards('review'); setSidebar(false); }
            else if (view === 'quiz') { openQuizModal(); setSidebar(false); }
            else if (view === 'mindmap') { openMindmap(); setSidebar(false); }
            else if (view === 'zen') { startZenMode(); setSidebar(false); }
        });
    });
}

function setSidebar(show) {
    if (show) {
        updateStatsUI();
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
    } else {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    }
}

// ----- CARD RENDERING -----
function filterCards(category) {
    if (!category) return;
    currentCategory = category;
    
    const isSpecialView = ['learned', 'review', 'favoriler'].includes(category) || category.startsWith('folder:');
    const mainHeader = document.getElementById('main-header');
    const specialHeader = document.getElementById('special-header');
    
    if (isSpecialView) {
        if(mainHeader) mainHeader.style.display = 'none';
        if(specialHeader) {
            specialHeader.style.display = 'block';
            let title = '';
            let desc = '';
            if(category === 'learned') { title = 'Öğrendiğim Kelimeler'; desc = 'Tamamen öğrendiğin ve artık karşına daha az çıkacak kelimeler listesi.'; }
            else if(category === 'review') { title = 'Tekrar Edilecekler'; desc = 'Sık hata yaptığın ve daha çok odaklanman gereken kelimeler.'; }
            else if(category === 'favoriler') { title = 'Favorilerim'; desc = 'Özel olarak kaydettiğin favori kelimelerin.'; }
            else if(category.startsWith('folder:')) { title = category.split(':')[1]; desc = 'Kendi oluşturduğun özel klasör.'; }
            
            document.getElementById('special-title').textContent = title;
            document.getElementById('special-desc').textContent = desc;
            
            // Highlight special nav button
            document.querySelectorAll('.special-nav-btn').forEach(btn => {
                if(btn.getAttribute('data-target') === category) btn.classList.add('active');
                else btn.classList.remove('active');
            });
        }
    } else {
        if(mainHeader) mainHeader.style.display = 'block';
        if(specialHeader) specialHeader.style.display = 'none';
        
        // Highlight main nav button
        document.querySelectorAll('#categories-nav .category-btn').forEach(btn => {
            if(btn.getAttribute('data-category') === category) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }

    if (category === 'tümü') filteredCards = [...activeDeck];
    else if (category === 'favoriler') filteredCards = activeDeck.filter(card => favorites.includes(card.id));
    else if (category === 'learned') filteredCards = activeDeck.filter(card => learned.includes(card.id));
    else if (category === 'review') filteredCards = activeDeck.filter(card => review.includes(card.id));
    else if (category.startsWith('folder:')) {
        const folderName = category.split(':')[1];
        filteredCards = activeDeck.filter(card => customFolders[folderName] && customFolders[folderName].includes(card.id));
    } else filteredCards = activeDeck.filter(card => card.category === category);
    
    currentIndex = 0;
    filteredCards.length > 0 ? renderCard(filteredCards[currentIndex]) : renderCard(null);
}

function loadFolders() {
    const nav = document.getElementById('categories-nav');
    if(!nav) return;
    document.querySelectorAll('.custom-folder-btn').forEach(el => el.remove());
    
    Object.keys(customFolders).forEach(folderName => {
        const btn = document.createElement('button');
        btn.className = 'category-btn custom-folder-btn';
        btn.innerHTML = `<i class="fas fa-folder"></i> ${folderName}`;
        nav.insertBefore(btn, document.getElementById('add-folder-btn'));
        btn.onclick = () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterCards(`folder:${folderName}`);
        };
    });
}

function setupCategoryListeners() {
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.getAttribute('data-category');
            if (cat) {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterCards(cat);
            }
        });
    });
}

function renderCard(cardData, animationClass = '') {
    cardContainer.innerHTML = '';
    if (!cardData) {
        cardContainer.innerHTML = `<div class="empty-state"><i class="fas fa-box-open"></i><h2>Kelime bulunamadı.</h2></div>`;
        updateProgress(); updateControls(); return;
    }

    const isFavorite = favorites.includes(cardData.id);
    const isLearned = learned.includes(cardData.id);
    const isReview = review.includes(cardData.id);

    let articleClass = '';
    const wordLower = cardData.germanWord.toLowerCase();
    if (wordLower.startsWith('der ')) articleClass = 'article-der';
    else if (wordLower.startsWith('die ')) articleClass = 'article-die';
    else if (wordLower.startsWith('das ')) articleClass = 'article-das';

    const cardHTML = `
        <div class="flashcard ${animationClass}" data-cat="${cardData.category}" id="current-card">
            <div class="card-face front">
                <div class="category-label">${capitalize(cardData.category)}</div>
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${cardData.id}"><i class="fas fa-heart"></i></button>
                <button class="tts-btn bouncy-btn" data-word="${cardData.germanWord}" title="Seslendır"><i class="fas fa-volume-up"></i></button>
                <div class="pronunciation">${cardData.pronunciation || ''}</div>
                <div class="word word-main ${articleClass}">${cardData.germanWord}</div>
                <div class="sentence">${cardData.germanSentence || ''}</div>
                <div class="learning-status-controls">
                    <button class="status-btn bouncy-btn learned-btn ${isLearned ? 'active' : ''}" data-id="${cardData.id}"><i class="fas fa-check"></i></button>
                    <button class="status-btn bouncy-btn review-btn ${isReview ? 'active' : ''}" data-id="${cardData.id}"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="card-face back">
                <div class="translation-word">${cardData.turkishWord}</div>
                <div class="translation-sentence">${cardData.turkishSentence || ''}</div>
            </div>
        </div>
    `;

    cardContainer.insertAdjacentHTML('beforeend', cardHTML);
    const cardEl = document.getElementById('current-card');
    
    cardEl.onclick = (e) => {
        if (!e.target.closest('button')) {
            cardEl.classList.toggle('flipped');
            if (cardEl.classList.contains('flipped')) {
                stats.flipped++; saveStats(); updateStatsUI();
            }
        }
    };

    cardEl.querySelector('.favorite-btn').onclick = (e) => {
        e.stopPropagation(); toggleFavorite(cardData.id);
    };
    const ttsBtn = cardEl.querySelector('.tts-btn');
    if (ttsBtn) ttsBtn.onclick = (e) => { e.stopPropagation(); speakWord(cardData.germanWord); };
    cardEl.querySelector('.learned-btn').onclick = (e) => {
        e.stopPropagation(); toggleStatus(cardData.id, 'learned');
    };
    cardEl.querySelector('.review-btn').onclick = (e) => {
        e.stopPropagation(); toggleStatus(cardData.id, 'review');
    };

    updateProgress(); updateControls();
}

function toggleFavorite(id) {
    if (favorites.includes(id)) favorites = favorites.filter(favId => favId !== id);
    else favorites.push(id);
    localStorage.setItem('b2_german_favorites', JSON.stringify(favorites));
    updateStatsUI();
    const btn = document.querySelector(`.favorite-btn[data-id="${id}"]`);
    if(btn) btn.classList.toggle('active', favorites.includes(id));
}

function toggleStatus(id, type) {
    let message = "";
    let toastType = "";

    if (type === 'learned') {
        if (learned.includes(id)) {
            learned = learned.filter(i => i !== id);
            message = "Öğrenilenlerden çıkarıldı";
            toastType = "info";
        } else { 
            learned.push(id); 
            review = review.filter(i => i !== id); 
            message = "Kelime kaydedildi! (Öğrenildi) ✨";
            toastType = "success";
        }
    } else {
        if (review.includes(id)) {
            review = review.filter(i => i !== id);
            message = "Tekrar listesinden çıkarıldı";
            toastType = "info";
        } else { 
            review.push(id); 
            learned = learned.filter(i => i !== id);
            message = "Kelime kaydedildi! (Tekrar edilecek) 🔄";
            toastType = "error";
        }
    }
    localStorage.setItem('b2_german_learned', JSON.stringify(learned));
    localStorage.setItem('b2_german_review', JSON.stringify(review));
    logActivity();
    updateStatsUI();

    // SRS + XP
    const isAdding = (type === 'learned' && learned.includes(id)) || (type === 'review' && review.includes(id));
    if (isAdding) { updateSRS(id, type === 'learned'); addXP(type === 'learned' ? 3 : 1); }

    // Dinamik UI Güncellemesi
    const learnedBtn = document.querySelector(`.learned-btn[data-id="${id}"]`);
    const reviewBtn = document.querySelector(`.review-btn[data-id="${id}"]`);
    if(learnedBtn) learnedBtn.classList.toggle('active', learned.includes(id));
    if(reviewBtn) reviewBtn.classList.toggle('active', review.includes(id));

    // Toast ve Glow Efekti (Sadece kayıt edildiğinde)
    if (message && toastType !== "info") {
        showToast(message, toastType);
        const targetBtn = type === 'learned' ? learnedBtn : reviewBtn;
        if(targetBtn) {
            targetBtn.classList.add('click-glow');
            setTimeout(() => targetBtn.classList.remove('click-glow'), 400);
        }
    } else if (message && toastType === "info") {
        showToast(message, "info");
    }
}

function showToast(message, type) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        document.body.appendChild(toast);
    }
    toast.innerHTML = message;
    toast.className = `toast-notification toast-${type}`;
    
    // Force reflow
    void toast.offsetWidth;
    
    toast.classList.add('show');
    
    if (toast.timeoutId) clearTimeout(toast.timeoutId);
    toast.timeoutId = setTimeout(() => {
        toast.classList.remove('show');
    }, 1500);
}

function logActivity() {
    const today = new Date().toISOString().split('T')[0];
    let activityLog = JSON.parse(localStorage.getItem('b2_activity_log')) || {};
    activityLog[today] = (activityLog[today] || 0) + 1;
    localStorage.setItem('b2_activity_log', JSON.stringify(activityLog));
    renderHeatmap();
    renderStreakUI();
}

// ----- QUIZ SYSTEM -----
function openQuizModal() {
    quizModal.classList.add('active');
    quizMenu.style.display = 'block';
    quizPlayArea.style.display = 'none';
    quizResultsArea.style.display = 'none';
}

function setupQuizListeners() {
    closeQuizBtn.onclick = () => {
        if (isQuizActive && !confirm("Çıkmak istiyor musunuz?")) return;
        quizModal.classList.remove('active');
        isQuizActive = false;
    };
    quizStartBtns.forEach(btn => {
        btn.onclick = () => startQuiz(parseInt(btn.dataset.mode));
    });
    quizNextBtn.onclick = handleQuizNext;
    quizFinishEarlyBtn.onclick = finishQuiz;
    document.getElementById('quiz-back-to-menu-btn').onclick = openQuizModal;
}

function startQuiz(mode) {
    quizMode = mode;
    let pool = mode === 2 ? activeDeck.filter(c => review.includes(c.id)) : [...activeDeck];
    if (pool.length === 0) return alert("Soru bulunamadı!");

    quizCards = pool.sort(() => 0.5 - Math.random());
    isQuizActive = true; currentQuizIdx = 0; quizResults = [];
    quizMenu.style.display = 'none';
    quizPlayArea.style.display = 'block';
    quizTotalEl.textContent = quizCards.length;
    renderQuizCard();
}

function renderQuizCard() {
    if (currentQuizIdx >= quizCards.length) return finishQuiz();
    quizIdxEl.textContent = currentQuizIdx + 1;
    const card = quizCards[currentQuizIdx];
    quizCardWrapper.innerHTML = ''; mcqAnswered = false;
    quizNextBtn.style.display = '';
    quizFinishEarlyBtn.style.display = '';

    if (quizMode === 5) { startVoiceQuiz(); return; }
    if (quizMode === 6) { startMatchGame(); return; }

    if (quizMode <= 2) {
        quizNextBtn.innerHTML = 'İleri'; quizNextBtn.disabled = false;
        quizCardWrapper.innerHTML = `<div class="flashcard" id="q-card" style="width:100%"><div class="card-face front"><div class="word">${card.germanWord}</div></div><div class="card-face back"><div class="word">${card.turkishWord}</div></div></div>`;
        document.getElementById('q-card').onclick = () => document.getElementById('q-card').classList.toggle('flipped');
    } else if (quizMode === 3) {
        quizNextBtn.innerHTML = 'Kontrol Et'; quizNextBtn.disabled = false;
        quizCardWrapper.innerHTML = `<div class="mcq-question" style="width:100%"><div class="mcq-german-word">${card.germanWord}</div><input type="text" id="q-input" style="width:100%; padding:12px; border-radius:10px; border:2px solid #ddd; margin-top:15px; font-size:1.1rem;" placeholder="Türkçesini yazın..."></div>`;
        const inp = document.getElementById('q-input'); inp.focus();
        inp.onkeydown = (e) => { if(e.key === 'Enter') handleQuizNext(); };
    } else {
        quizNextBtn.innerHTML = 'İleri'; quizNextBtn.disabled = true;
        let wr = activeDeck.filter(c => c.id !== card.id).sort(() => 0.5 - Math.random()).slice(0,3);
        let choices = [card, ...wr].sort(() => 0.5 - Math.random());
        let html = `<div class="mcq-wrapper"><div class="mcq-question"><div class="mcq-german-word">${card.germanWord}</div></div><div class="mcq-choices">`;
        choices.forEach((c, i) => html += `<button class="mcq-choice-btn" data-correct="${c.id === card.id}"><span class="mcq-letter">${String.fromCharCode(65+i)}</span>${c.turkishWord}</button>`);
        html += `</div><div id="mcq-feedback"></div></div>`;
        quizCardWrapper.innerHTML = html;
        document.querySelectorAll('.mcq-choice-btn').forEach(btn => {
            btn.onclick = () => {
                if(mcqAnswered) return; mcqAnswered = true;
                const ok = btn.dataset.correct === 'true';
                btn.classList.add(ok ? 'mcq-correct' : 'mcq-wrong');
                if(!ok) document.querySelector('.mcq-choice-btn[data-correct="true"]').classList.add('mcq-correct');
                
                const feedbackEl = document.getElementById('mcq-feedback');
                feedbackEl.innerHTML = ok ? '<span style="color:#48bb78">Doğru! 🔥</span>' : `<span style="color:#f56565">Yanlış! Doğrusu: ${card.turkishWord}</span>`;
                
                if(!ok) { 
                    quizWrongs[card.id] = (quizWrongs[card.id] || 0) + 1; 
                    localStorage.setItem('b2_quiz_wrongs', JSON.stringify(quizWrongs)); 
                }
                
                quizResults.push({card, ok}); 
                quizNextBtn.disabled = false; 
                logActivity();

                // Doğruysa 1.2 saniye sonra otomatik geç
                if (ok) {
                    setTimeout(() => {
                        if (isQuizActive && mcqAnswered) handleQuizNext();
                    }, 1200);
                }
            };
        });
    }
}

function handleQuizNext() {
    const card = quizCards[currentQuizIdx];
    if(quizMode === 3) {
        const val = document.getElementById('q-input').value.trim().toLowerCase();
        const ok = card.turkishWord.toLowerCase().includes(val) && val.length > 2;
        quizResults.push({card, ok, out: val});
        if(!ok) { quizWrongs[card.id] = (quizWrongs[card.id] || 0) + 1; localStorage.setItem('b2_quiz_wrongs', JSON.stringify(quizWrongs)); }
        logActivity();
    } else if(quizMode <= 2) {
        quizResults.push({card, ok: true});
    }
    currentQuizIdx++; renderQuizCard();
}

function finishQuiz() {
    isQuizActive = false; 
    quizPlayArea.style.display = 'none'; 
    quizResultsArea.style.display = 'block';
    
    let okCount = 0;
    let wrongCount = 0;
    const resList = document.getElementById('quiz-res-list');
    resList.innerHTML = '';

    if (quizResults.length === 0) {
        resList.innerHTML = '<div style="padding:20px; text-align:center; color:#718096; font-style:italic;">Hiç soru yanıtlamadınız.</div>';
    } else {
        let htmlContent = '';
        quizResults.forEach(r => {
            if (r.ok) okCount++; else wrongCount++;
            
            const bgColor = r.ok ? '#f0fdf4' : '#fef2f2';
            const borderColor = r.ok ? '#86efac' : '#fca5a5';
            const iconColor = r.ok ? '#22c55e' : '#ef4444';
            const iconHTML = r.ok ? '✅' : '❌';
            
            let userAnsHTML = '';
            // Yalnızca yanlış cevaplarda ve kullanıcı bir şey yazmışsa (yazılı quiz modunda) göster
            if (!r.ok && r.out !== undefined && r.out.trim() !== '') {
                userAnsHTML = `<div style="font-size:0.85rem; color:#ef4444; margin-top:4px;">
                                   Senin cevabın: <span style="text-decoration:line-through; font-weight:bold;">${r.out}</span>
                               </div>`;
            }

            htmlContent += `
            <div style="padding:15px; margin-bottom: 10px; border-radius:12px; background-color:${bgColor}; border: 1.5px solid ${borderColor}; display:flex; justify-content:space-between; align-items:center; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                 <div style="text-align:left; flex: 1;">
                    <div style="font-weight:800; color:#1e293b; font-size:1.1rem; letter-spacing: -0.3px;">${r.card.germanWord}</div>
                    ${userAnsHTML}
                    <div style="font-size:0.95rem; color:#475569; margin-top:6px; background: rgba(255,255,255,0.6); display:inline-block; padding:3px 8px; border-radius:6px; border: 1px solid rgba(0,0,0,0.05);">
                        <i class="fas fa-check-circle" style="color:${iconColor}; margin-right:4px;"></i> 
                        <strong>Doğrusu:</strong> ${r.card.turkishWord}
                    </div>
                 </div>
                 <div style="font-size:1.8rem; padding-left:15px;">${iconHTML}</div>
            </div>`;
        });
        resList.innerHTML = htmlContent;
    }

    document.getElementById('quiz-res-correct').textContent = okCount;
    document.getElementById('quiz-res-wrong').textContent = wrongCount;
    
    renderWeakPointsUI();
}

// ----- HEATMAP -----
function renderHeatmap() {
    const grid = document.getElementById('heatmap-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const activityLog = JSON.parse(localStorage.getItem('b2_activity_log')) || {};
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const d = new Date(today); d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const count = activityLog[dateStr] || 0;
        let level = count > 50 ? 4 : (count > 20 ? 3 : (count > 5 ? 2 : (count > 0 ? 1 : 0)));
        const sq = document.createElement('div');
        sq.className = 'heatmap-day';
        sq.dataset.level = level;
        sq.title = `${dateStr}: ${count} kelime`;
        grid.appendChild(sq);
    }
}

// ----- ZEN MODE -----
let zenInterval = null; let zenTime = 900;
function startZenMode() {
    document.body.classList.add('zen-active');
    zenTime = 900; updateZenUI();
    clearInterval(zenInterval);
    zenInterval = setInterval(() => {
        zenTime--; updateZenUI();
        if(zenTime <= 0) { stopZenMode(); alert("Zen seansı bitti! 🧘"); }
    }, 1000);
}
function stopZenMode() { document.body.classList.remove('zen-active'); clearInterval(zenInterval); }
function updateZenUI() { 
    const m = Math.floor(zenTime/60), s = zenTime%60;
    const el = document.getElementById('zen-timer-display');
    if(el) el.textContent = `${m}:${s.toString().padStart(2, '0')}`;
}
document.getElementById('exit-zen-btn').onclick = stopZenMode;

// ----- CONTROLS -----
function setupControls() {
    prevBtn.onclick = () => { if(currentIndex > 0) { currentIndex--; renderCard(filteredCards[currentIndex]); } };
    nextBtn.onclick = () => { if(currentIndex < filteredCards.length - 1) { currentIndex++; renderCard(filteredCards[currentIndex]); } };
}
function updateProgress() {
    currentIndexEl.textContent = filteredCards.length > 0 ? currentIndex + 1 : 0;
    totalCountEl.textContent = filteredCards.length;
}
function updateControls() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === filteredCards.length - 1;
}

function setupSwipe() {
    let startX = 0;
    cardContainer.ontouchstart = (e) => startX = e.touches[0].clientX;
    cardContainer.ontouchend = (e) => {
        let diff = e.changedTouches[0].clientX - startX;
        if(Math.abs(diff) > 50) diff > 0 ? prevBtn.click() : nextBtn.click();
    };
}

function setupModalListeners() {
    settingsBtn.onclick = () => settingsModal.classList.add('active');
    closeModalBtn.onclick = () => settingsModal.classList.remove('active');
    guideBtn.onclick = () => guideModal.classList.add('active');
    closeGuideBtn.onclick = guideOkBtn.onclick = () => guideModal.classList.remove('active');
    
    exportBtn.onclick = () => {
        const blob = new Blob([JSON.stringify(activeDeck)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'destem.json'; a.click();
    };
    resetBtn.onclick = () => { if(confirm("Sıfırlansın mı?")) { localStorage.clear(); location.reload(); } };
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

document.addEventListener('DOMContentLoaded', init);