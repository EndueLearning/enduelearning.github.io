document.addEventListener("DOMContentLoaded", function () {
    updateDateTime();
    fetchNews();
    fetchThoughtForTheDay();
    fetchPuzzleOfTheDay();
    fetchYouTubeVideo();
    setInterval(updateDateTime, 60000); // Update time every minute
});

// Update Date and Time
function updateDateTime() {
    const now = new Date();
    const dateString = now.toLocaleDateString();
    const timeString = now.toLocaleTimeString();
    const dayString = now.toLocaleDateString(undefined, { weekday: 'long' });
    const dateTimeElement = document.getElementById("date-time");
    if (dateTimeElement) {
        dateTimeElement.textContent = `${dayString}, ${dateString} ${timeString}`;
    }
}

// Fetch News Headlines
function fetchNews() {
    const apiKey = "11e1cc79175f4629be573aad5c48762d";
    const url = `https://newsapi.org/v2/top-headlines?category=science&apiKey=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("News API Response:", data); // Debugging Log
            const newsContainer = document.getElementById("news-headlines");
            if (newsContainer) {
                newsContainer.innerHTML = ""; // Clear previous content
                
                if (data.articles && data.articles.length > 0) {
                    data.articles.slice(0, 5).forEach(article => {
                        let newsItem = document.createElement("p");
                        newsItem.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
                        newsContainer.appendChild(newsItem);
                    });
                } else {
                    newsContainer.innerHTML = "No news available.";
                }
            }
        })
        .catch(error => console.error("Error fetching news:", error));
}

// Fetch Thought for the Day
function fetchThoughtForTheDay() {
    const thoughtContainer = document.getElementById("thought-for-the-day");
    if (!thoughtContainer) return;
    
    const thoughts = [
        { text: "The only way to do great work is to love what you do.", source: "Steve Jobs" },
        { text: "Education is the most powerful weapon which you can use to change the world.", source: "Nelson Mandela" },
        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", source: "Winston Churchill" }
    ];
    
    const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
    thoughtContainer.innerHTML = `<p>"${randomThought.text}"</p><p><em>- ${randomThought.source}</em></p>`;
}

// Fetch Puzzle for the Day
function fetchPuzzleOfTheDay() {
    const puzzleContainer = document.getElementById("puzzle-of-the-day");
    if (!puzzleContainer) return;
    
    const puzzles = [
        { question: "What comes once in a minute, twice in a moment, but never in a thousand years?", answer: "m" },
        { question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", answer: "echo" }
    ];
    
    const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    puzzleContainer.innerHTML = `<p>${randomPuzzle.question}</p><input type='text' id='puzzle-answer'><button onclick='checkPuzzleAnswer("${randomPuzzle.answer}")'>Check Answer</button>`;
}

// Check Puzzle Answer
function checkPuzzleAnswer(correctAnswer) {
    const userAnswer = document.getElementById("puzzle-answer").value.trim().toLowerCase();
    if (userAnswer === correctAnswer.toLowerCase()) {
        alert("Correct Answer!");
    } else {
        alert("Try again!");
    }
}

// Fetch YouTube Video (Linguistic Highlights)
function fetchYouTubeVideo() {
    const playlistId = "PLAi0MNHSgl9KVZ8Ao6r2r2-7wylEsIUbT";
    const apiKey = "AIzaSyCgTGUgdJXtf3Nh471kd0FUZvtPDnQuDhU";
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${playlistId}&key=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("YouTube API Response:", data); // Debugging Log
            const videoContainer = document.getElementById("linguistic-highlight");
            if (videoContainer && data.items && data.items.length > 0) {
                const videoId = data.items[0].snippet.resourceId.videoId;
                videoContainer.innerHTML = `<iframe width="300" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            } else {
                videoContainer.innerHTML = "No video available today.";
            }
        })
        .catch(error => console.error("Error fetching YouTube video:", error));
}
