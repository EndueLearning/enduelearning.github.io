document.addEventListener("DOMContentLoaded", function () {
    updateDateTime();
    fetchNews();
    fetchThoughtOfDay();
    fetchPuzzleOfDay();
    fetchYouTubeVideo();
    setInterval(updateDateTime, 60000); 
});

function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    document.getElementById("date-time").textContent = now.toLocaleDateString("en-US", options);
}

function fetchNews() {
    const apiKey = "11e1cc79175f4629be573aad5c48762d";
    const url = `https://newsapi.org/v2/top-headlines?category=science,education,technology&language=en&apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const newsList = document.getElementById("news-list");
            newsList.innerHTML = "";
            data.articles.slice(0, 5).forEach(article => {
                const listItem = document.createElement("li");
                const link = document.createElement("a");
                link.href = article.url;
                link.target = "_blank";
                link.textContent = article.title;
                listItem.appendChild(link);
                newsList.appendChild(listItem);
            });
        })
        .catch(error => console.error("Error fetching news:", error));
}

function fetchThoughtOfDay() {
    const thoughts = [
        "Believe in yourself and all that you are.",
        "Success is not final, failure is not fatal: It is the courage to continue that counts.",
        "You are capable of amazing things."
    ];
    const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
    document.getElementById("thought-of-day").textContent = randomThought;
}

function fetchPuzzleOfDay() {
    const puzzles = [
        { question: "What has to be broken before you can use it?", answer: "Egg" },
        { question: "I speak without a mouth and hear without ears. What am I?", answer: "Echo" }
    ];
    const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    document.getElementById("puzzle-content").textContent = randomPuzzle.question;
    document.getElementById("puzzle-answer").dataset.correctAnswer = randomPuzzle.answer;
}

function checkPuzzleAnswer() {
    const userAnswer = document.getElementById("puzzle-answer").value.trim().toLowerCase();
    const correctAnswer = document.getElementById("puzzle-answer").dataset.correctAnswer.toLowerCase();
    document.getElementById("puzzle-result").textContent = userAnswer === correctAnswer ? "Correct!" : "Try again!";
}

function fetchYouTubeVideo() {
    const apiKey = "AIzaSyCgTGUgdJXtf3Nh471kd0FUZvtPDnQuDhU";
    const playlistId = "PLAi0MNHSgl9KVZ8Ao6r2r2-7wylEsIUbT";
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${playlistId}&key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                const randomIndex = Math.floor(Math.random() * data.items.length);
                const video = data.items[randomIndex].snippet;
                const videoId = video.resourceId.videoId;
                const videoTitle = video.title;
                
                document.getElementById("word-of-day").innerHTML = `
                    <h3>${videoTitle}</h3>
                    <iframe width="300" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                `;
            } else {
                document.getElementById("word-of-day").textContent = "No videos found.";
            }
        })
        .catch(error => console.error("Error fetching YouTube video:", error));
}

function startMemoryGame() {
    alert("Memory game coming soon!");
}
