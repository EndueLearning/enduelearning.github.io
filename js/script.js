const newsApiKey = "11e1cc79175f4629be573aad5c48762d";
const youtubeApiKey = "AIzaSyCgTGUgdJXtf3Nh471kd0FUZvtPDnQuDhU";
const youtubePlaylistId = "PLAi0MNHSgl9KVZ8Ao6r2r2-7wylEsIUbT";

// Function to update Date, Time, and Day
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("date-time").innerText = now.toLocaleDateString('en-US', options) + " " + now.toLocaleTimeString();
}

// Function to fetch News
async function fetchNews() {
    try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?category=science,technology,education&apiKey=${newsApiKey}`);
        const data = await response.json();

        let headlinesHtml = "";
        data.articles.slice(0, 5).forEach(article => {
            headlinesHtml += `<p><a href="${article.url}" target="_blank">${article.title}</a></p>`;
        });

        document.getElementById("news-headlines").innerHTML = headlinesHtml;
    } catch (error) {
        console.error("Error fetching news:", error);
        document.getElementById("news-headlines").innerText = "Failed to load news.";
    }
}

// Function to fetch Thought for the Day
async function fetchThoughtForTheDay() {
    try {
        const response = await fetch("https://api.quotable.io/random");
        const data = await response.json();
        document.getElementById("thought-for-the-day").innerText = `"${data.content}" - ${data.author}`;
    } catch (error) {
        console.error("Error fetching thought:", error);
        document.getElementById("thought-for-the-day").innerText = "Failed to load thought.";
    }
}

// Function to fetch Puzzle for the Day
async function fetchPuzzleOfTheDay() {
    try {
        const response = await fetch("https://api.api-ninjas.com/v1/riddles", {
            headers: { 'X-Api-Key': 'YOUR_API_NINJAS_KEY' }
        });
        const data = await response.json();
        document.getElementById("puzzle-of-the-day").innerText = data[0].question;
    } catch (error) {
        console.error("Error fetching puzzle:", error);
        document.getElementById("puzzle-of-the-day").innerText = "Failed to load puzzle.";
    }
}

// Function to fetch YouTube Video
async function fetchYouTubeVideo() {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${youtubePlaylistId}&key=${youtubeApiKey}`);
        const data = await response.json();
        
        if (data.items.length > 0) {
            const videoId = data.items[0].snippet.resourceId.videoId;
            document.getElementById("youtube-video").src = `https://www.youtube.com/embed/${videoId}`;
        } else {
            document.getElementById("youtube-video").innerText = "No video found.";
        }
    } catch (error) {
        console.error("Error fetching YouTube video:", error);
        document.getElementById("youtube-video").innerText = "Failed to load video.";
    }
}

// Initialize all functions
document.addEventListener("DOMContentLoaded", function () {
    updateDateTime();
    fetchNews();
    fetchThoughtForTheDay();
    fetchPuzzleOfTheDay();
    fetchYouTubeVideo();
    setInterval(updateDateTime, 60000);
});
