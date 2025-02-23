document.addEventListener("DOMContentLoaded", function () {
    updateDateTime();
    fetchNews();
    fetchYouTubeVideo();
    fetchThoughtForTheDay();
    fetchPuzzleOfTheDay();
});

function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById("dateTime").innerHTML = now.toLocaleDateString("en-US", options);
    setTimeout(updateDateTime, 60000);
}

function fetchNews() {
    const apiKey = "11e1cc79175f4629be573aad5c48762d";
    const url = `https://newsapi.org/v2/top-headlines?category=science&category=technology&category=education&apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const newsList = document.getElementById("newsList");
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
                const randomVideo = data.items[Math.floor(Math.random() * data.items.length)];
                const videoId = randomVideo.snippet.resourceId.videoId;
                document.getElementById("youtubeVideo").src = `https://www.youtube.com/embed/${videoId}`;
            }
        })
        .catch(error => console.error("Error fetching YouTube video:", error));
}

function fetchThoughtForTheDay() {
    const url = "https://api.api-ninjas.com/v1/quotes?category=inspirational";
    const apiKey = "YOUR_API_NINJAS_KEY";

    fetch(url, { headers: { 'X-Api-Key': apiKey } })
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                document.getElementById("thoughtText").innerText = `"${data[0].quote}"`;
                document.getElementById("thoughtSource").innerText = `- ${data[0].author}`;
            }
        })
        .catch(error => console.error("Error fetching thought:", error));
}

function fetchPuzzleOfTheDay() {
    const puzzles = [
        { question: "What has to be broken before you can use it?", answer: "egg" },
        { question: "I’m tall when I’m young, and I’m short when I’m old. What am I?", answer: "candle" }
    ];

    const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    document.getElementById("puzzleText").innerText = randomPuzzle.question;
    document.getElementById("puzzleAnswer").dataset.answer = randomPuzzle.answer;
}

function checkPuzzleAnswer() {
    const userAnswer = document.getElementById("puzzleAnswer").value.toLowerCase();
    const correctAnswer = document.getElementById("puzzleAnswer").dataset.answer;

    if (userAnswer === correctAnswer) {
        alert("Correct!");
    } else {
        alert("Try again!");
    }
}
