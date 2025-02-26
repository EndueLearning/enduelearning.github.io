// Function to update date, day, and time dynamically
function updateDateTime() {
    const now = new Date();
    const dateTimeString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) + " | " + now.toLocaleTimeString();
    
    document.getElementById("date-time").innerHTML = dateTimeString;
}

// Call updateDateTime every second
setInterval(updateDateTime, 1000);
updateDateTime();

// Function to fetch Thought for the Day from JSON
async function fetchThoughtForTheDay() {
    try {
        const response = await fetch('thoughts.json');
        const data = await response.json();
        const todayIndex = new Date().getDate() % data.thoughts.length;
        document.getElementById("thought-content").innerHTML = `"${data.thoughts[todayIndex]}"`;
    } catch (error) {
        console.error("Error fetching Thought for the Day:", error);
        document.getElementById("thought-content").innerHTML = "Stay Positive and Keep Learning!";
    }
}

// Function to fetch Puzzle of the Day from JSON
async function fetchPuzzleOfTheDay() {
    try {
        const response = await fetch('puzzles.json');
        const data = await response.json();
        const todayIndex = new Date().getDate() % data.puzzles.length;
        document.getElementById("puzzle-content").innerHTML = `Puzzle: ${data.puzzles[todayIndex].question}`;
    } catch (error) {
        console.error("Error fetching Puzzle of the Day:", error);
        document.getElementById("puzzle-content").innerHTML = "Solve this: What comes after 10?";
    }
}

// Function to fetch News from News API
async function fetchNews() {
    const apiKey = 'YOUR_NEWSAPI_KEY';
    const newsContainer = document.getElementById("news-content");

    try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?category=science&apiKey=${apiKey}`);
        const data = await response.json();

        if (data.articles.length > 0) {
            newsContainer.innerHTML = data.articles
                .slice(0, 5)
                .map(article => `<p><a href="${article.url}" target="_blank">${article.title}</a></p>`)
                .join('');
        } else {
            newsContainer.innerHTML = "<p>No news available.</p>";
        }
    } catch (error) {
        console.error("Error fetching news:", error);
        newsContainer.innerHTML = "<p>Unable to fetch news at the moment.</p>";
    }
}

// Function to load YouTube video dynamically
function loadYouTubeVideo() {
    const videoFrame = document.getElementById("youtube-video");
    const playlistId = "YOUR_YOUTUBE_PLAYLIST_ID";
    videoFrame.src = `https://www.youtube.com/embed?listType=playlist&list=${playlistId}`;
}

// Initialize all functions
document.addEventListener("DOMContentLoaded", function () {
    fetchThoughtForTheDay();
    fetchPuzzleOfTheDay();
    fetchNews();
    loadYouTubeVideo();
});
