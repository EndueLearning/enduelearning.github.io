// ========== DAILY ROTATION LOGIC FOR FUN FACT, WORD, THOUGHT ==========

async function loadJSON(path) {
    const res = await fetch(path);
    return res.json();
}

// Pick an item based on today's date number
function pickDailyItem(list, key) {
    const today = new Date().toDateString();   // e.g. "Mon Feb 10 2025"
    const storeKey = `daily_${key}`;

    // If already stored today, return that
    const saved = JSON.parse(localStorage.getItem(storeKey) || "null");
    if (saved && saved.date === today) {
        return saved.value;
    }

    // Otherwise pick new item
    const index = Math.floor(Math.random() * list.length);
    const value = list[index];

    // Save to storage
    localStorage.setItem(storeKey, JSON.stringify({
        date: today,
        value
    }));

    return value;
}

document.addEventListener("DOMContentLoaded", async () => {
    // ==== 1. FUN FACT ====
    const facts = await loadJSON("/assets/data/dailyfacts.json");
    const fact = pickDailyItem(facts, "funfact");
    const factBox = document.getElementById("home-fun-fact");
    if (factBox) factBox.textContent = fact;

    // ==== 2. WORD OF THE DAY ====
    const words = await loadJSON("/assets/data/words.json");
    const wordObj = pickDailyItem(words, "word");

    const wordBox = document.getElementById("word-of-day");
    if (wordBox) {
        wordBox.innerHTML = `
            <h4>${wordObj.word}</h4>
            <p><strong>Meaning:</strong> ${wordObj.meaning}</p>
            <p><em>Example:</em> ${wordObj.example}</p>
        `;
    }

    // ==== 3. THOUGHT OF THE DAY ====
    const thoughts = await loadJSON("/assets/data/thoughts.json");
    const thoughtValue = pickDailyItem(thoughts, "thought");

    const thoughtBox = document.getElementById("thought-of-day");
    if (thoughtBox) {
        thoughtBox.innerHTML = `
            <p>💡 ${thoughtValue}</p>
        `;
    }
});
