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
let stats = JSON.parse(localStorage.getItem('b2_german_stats')) || { flipped: 0, timeSpentSec: 0 };
let quizWrongs = JSON.parse(localStorage.getItem('b2_quiz_wrongs')) || {}; 

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
        // Çıkarıldığında da küçük bir bildirim ver
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