document.addEventListener("DOMContentLoaded", function () {
    updateDateTime();
    fetchNews();
    fetchWordOfDay();
    fetchThoughtForTheDay();
    fetchPuzzleOfTheDay();
    fetchYouTubeVideo();
});

function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById("dateTime").innerHTML = now.toLocaleDateString("en-US", options);
    setTimeout(updateDateTime, 60000);
}

function fetchNews() {
    const apiKey = "11e1cc79175f4629be573aad5c48762d";
    const url = `https://newsapi.org/v2/top-headlines?category=science&apiKey=${apiKey}`;

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

function fetchWordOfDay() {
    const words = ["Curiosity", "Imagination", "Innovation", "Perseverance"];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    document.getElementById("wordOfDay").innerText = randomWord;
}

function fetchThoughtForTheDay() {
    const thoughts = [
        { quote: "Believe in yourself and all that you are.", author: "Christian D. Larson" },
        { quote: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" }
    ];

    const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
    document.getElementById("thoughtText").innerText = `"${randomThought.quote}"`;
    document.getElementById("thoughtSource").innerText = `- ${randomThought.author}`;
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

function fetchYouTubeVideo() {
    const videos = [
        "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "https://www.youtube.com/embed/l482T0yNkeo"
    ];

    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    document.getElementById("youtubeVideo").src = randomVideo;
}
