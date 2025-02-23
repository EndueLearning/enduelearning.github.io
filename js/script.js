document.addEventListener("DOMContentLoaded", function () {
    updateDateTime();
    fetchNews();
    fetchThoughtForTheDay();
    fetchPuzzleOfTheDay();
    fetchYouTubeVideo();
    setInterval(updateDateTime, 60000); // Update time every minute
});

function updateDateTime() {
    const dateTimeElement = document.getElementById("date-time");
    if (dateTimeElement) {
        const now = new Date();
        dateTimeElement.innerHTML = now.toLocaleString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
}

function fetchNews() {
    const apiKey = "YOUR_NEWS_API_KEY";
    const url = `https://newsapi.org/v2/top-headlines?category=science,education,technology&apiKey=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const headlinesElement = document.getElementById("news-headlines");
            if (headlinesElement && data.articles) {
                headlinesElement.innerHTML = data.articles.map(article => `<p><a href="${article.url}" target="_blank">${article.title}</a></p>`).join("");
            }
        })
        .catch(error => console.error("Error fetching news:", error));
}

function fetchThoughtForTheDay() {
    const thoughtElement = document.getElementById("thought-for-the-day");
    if (thoughtElement) {
        thoughtElement.innerHTML = "The only way to do great work is to love what you do. - Steve Jobs";
    }
}

function fetchPuzzleOfTheDay() {
    const puzzleElement = document.getElementById("puzzle-of-the-day");
    if (puzzleElement) {
        puzzleElement.innerHTML = "What has to be broken before you can use it? (Answer: An egg)";
    }
}

function fetchYouTubeVideo() {
    const apiKey = "AIzaSyCgTGUgdJXtf3Nh471kd0FUZvtPDnQuDhU";
    const playlistId = "PLAi0MNHSgl9KVZ8Ao6r2r2-7wylEsIUbT";
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=1&key=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                const videoId = data.items[0].snippet.resourceId.videoId;
                document.getElementById("youtube-video").src = `https://www.youtube.com/embed/${videoId}`;
            }
        })
        .catch(error => console.error("Error fetching YouTube video:", error));
}
