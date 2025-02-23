document.addEventListener("DOMContentLoaded", function () {
    updateDateTime();
    fetchNews();
    fetchYouTubeVideo();
    fetchWordAndThought();
    fetchPuzzleOfTheDay();
});

function updateDateTime() {
    const now = new Date();
    const dateTimeString = now.toLocaleDateString() + " " + now.toLocaleTimeString();
    document.getElementById("date-time").textContent = dateTimeString;
    setTimeout(updateDateTime, 1000);
}

function fetchNews() {
    const apiKey = "11e1cc79175f4629be573aad5c48762d";
    const url = `https://newsapi.org/v2/top-headlines?category=science,education,technology&apiKey=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const newsList = document.getElementById("news-list");
            newsList.innerHTML = "";
            data.articles.forEach(article => {
                const li = document.createElement("li");
                li.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
                newsList.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching news:", error));
}

function fetchYouTubeVideo() {
    const apiKey = "AIzaSyCgTGUgdJXtf3Nh471kd0FUZvtPDnQuDhU";
    const playlistId = "PLAi0MNHSgl9KVZ8Ao6r2r2-7wylEsIUbT";
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.items.length > 0) {
                const randomIndex = Math.floor(Math.random() * data.items.length);
                const videoId = data.items[randomIndex].snippet.resourceId.videoId;
                document.getElementById("youtube-video").innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
            }
        })
        .catch(error => console.error("Error fetching YouTube video:", error));
}

function fetchWordAndThought() {
    const words = [
        { word: "Serendipity", meaning: "The occurrence of events by chance in a happy way", usage: "Finding the perfect book by accident was pure serendipity." },
        { word: "Ephemeral", meaning: "Lasting for a very short time", usage: "The beauty of a sunset is ephemeral but breathtaking." }
    ];
    const thoughts = [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Success is not the key to happiness. Happiness is the key to success. - Albert Schweitzer"
    ];
    
    const dayIndex = new Date().getDate() % words.length;
    document.getElementById("word-of-day").textContent = words[dayIndex].word;
    document.getElementById("word-meaning").textContent = words[dayIndex].meaning;
    document.getElementById("word-usage").textContent = words[dayIndex].usage;
    document.getElementById("thought-of-day").textContent = thoughts[dayIndex % thoughts.length];
}

function fetchPuzzleOfTheDay() {
    const puzzles = [
        { question: "What has keys but can’t open locks?", answer: "A piano" },
        { question: "What comes once in a minute, twice in a moment, but never in a thousand years?", answer: "The letter M" }
    ];
    
    const dayIndex = new Date().getDate() % puzzles.length;
    document.getElementById("puzzle-content").textContent = puzzles[dayIndex].question;
    
    document.getElementById("puzzle-result").textContent = "";
}

function checkPuzzleAnswer() {
    const answer = document.getElementById("puzzle-answer").value.trim().toLowerCase();
    const dayIndex = new Date().getDate() % 2;
    const correctAnswer = ["a piano", "the letter m"][dayIndex];
    
    if (answer === correctAnswer) {
        document.getElementById("puzzle-result").textContent = "Correct! Well done.";
    } else {
        document.getElementById("puzzle-result").textContent = "Try again!";
    }
}
