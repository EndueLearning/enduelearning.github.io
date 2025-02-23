// Auto-update date and time
document.addEventListener("DOMContentLoaded", function () {
    function updateTime() {
        const now = new Date();
        document.getElementById("date-time").innerText = now.toLocaleString();
    }
    setInterval(updateTime, 1000);
    updateTime();

    // Fetch news
    fetchNews();
    fetchWordOfTheDay();
    fetchThoughtOfTheDay();
    loadPuzzle();
});

// Fetch news from API
function fetchNews() {
    fetch('https://newsapi.org/v2/top-headlines?category=science,education,technology&apiKey=11e1cc79175f4629be573aad5c48762d')
        .then(response => response.json())
        .then(data => {
            const newsList = document.getElementById("news-list");
            newsList.innerHTML = "";
            data.articles.forEach(article => {
                let li = document.createElement("li");
                let a = document.createElement("a");
                a.href = article.url;
                a.textContent = article.title;
                a.target = "_blank";
                li.appendChild(a);
                newsList.appendChild(li);
            });
        });
}

// Fetch Word of the Day
function fetchWordOfTheDay() {
    document.getElementById("word-of-day").innerText = "Innovate";
}

// Fetch Thought of the Day
function fetchThoughtOfTheDay() {
    document.getElementById("thought-of-day").innerText = "Education is the most powerful weapon to change the world.";
}

// Load Puzzle of the Day
function loadPuzzle() {
    document.getElementById("puzzle-content").innerText = "What has to be broken before you can use it?";
}

// Check Puzzle Answer
function checkPuzzleAnswer() {
    const answer = document.getElementById("puzzle-answer").value.toLowerCase();
    const result = document.getElementById("puzzle-result");
    if (answer === "egg") {
        result.innerText = "Correct!";
        result.style.color = "green";
    } else {
        result.innerText = "Try again!";
        result.style.color = "red";
    }
}

// Memory Game (Basic Implementation)
function startMemoryGame() {
    alert("Memory Game will be implemented soon!");
}
