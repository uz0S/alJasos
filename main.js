const GEMINI_API_KEY = 'AIzaSyAvo2K-ECMnYfbaemIu2oh8kzg1rfMhMUc';

let players = [];
let spyIndex = -1;
let currentWord = '';
let currentPlayerIndex = 0;

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function addPlayer() {
    const input = document.getElementById('player-name');
    const name = input.value.trim();
    if (name) {
        players.push(name);
        input.value = '';
        const list = document.getElementById('players-list');
        const li = document.createElement('li');
        li.innerHTML = `<span>${name}</span> <span style="cursor:pointer" onclick="this.parentElement.remove()">❌</span>`;
        list.appendChild(li);
        if (players.length >= 3) document.getElementById('game-settings').style.display = 'block';
    }
}

async function startGame() {
    const loader = document.getElementById('ai-loading');
    const btn = document.getElementById('start-btn');
    loader.style.display = 'block';
    btn.style.display = 'none';

    spyIndex = Math.floor(Math.random() * players.length);
    const category = document.getElementById('category').value;
    
    // جلب الكلمة من Gemini
    try {
        const prompt = `أعطني اسم شيء واحد فقط ينتمي لفئة ${category} باللغة العربية، بدون شرح، كلمة واحدة فقط.`;
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await res.json();
        currentWord = data.candidates[0].content.parts[0].text.trim();
    } catch {
        currentWord = "حديقة"; 
    }

    loader.style.display = 'none';
    btn.style.display = 'block';
    currentPlayerIndex = 0;
    startPassing();
}

function startPassing() {
    if (currentPlayerIndex < players.length) {
        document.getElementById('turn-text').innerText = `مرر الجهاز لـ : ${players[currentPlayerIndex]}`;
        showScreen('pass-screen');
    } else {
        showScreen('timer-screen');
    }
}

function showRole() {
    if (window.navigator.vibrate) window.navigator.vibrate(50); // اهتزاز بسيط
    const display = document.getElementById('role-display');
    if (currentPlayerIndex === spyIndex) {
        display.innerText = "أنت الجاسوس 🕵️‍♂️";
        display.style.color = "#ff7675";
    } else {
        display.innerText = currentWord;
        display.style.color = "#55efc4";
    }
    showScreen('role-screen');
}

function nextPlayer() {
    currentPlayerIndex++;
    startPassing();
}

function restartGame() {
    players = [];
    document.getElementById('players-list').innerHTML = '';
    document.getElementById('game-settings').style.display = 'none';
    showScreen('setup-screen');
}