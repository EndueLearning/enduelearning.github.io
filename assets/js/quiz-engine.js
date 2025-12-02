// QUIZ ENGINE (universal for all topics)
// Reads JSON file automatically based on page URL

document.addEventListener("DOMContentLoaded", loadQuiz);

async function loadQuiz() {
    const quizBox = document.getElementById("quiz-box");
    if (!quizBox) return;

    const path = window.location.pathname.replace(".html", ".json").replace("/games/quizsets/", "/assets/data/quiz/");
    
    try {
        const res = await fetch(path);
        const questions = await res.json();
        runQuiz(quizBox, questions);
    } catch (e) {
        quizBox.innerHTML = "<p>Error loading quiz.</p>";
    }
}

function runQuiz(container, questions) {
    let index = 0;
    let score = 0;

    showQuestion();

    function showQuestion() {
        const q = questions[index];

        container.innerHTML = `
            <h3>Question ${index + 1} of ${questions.length}</h3>
            <p>${q.q}</p>

            ${q.options.map(opt =>
                `<button class="quiz-option">${opt}</button>`
            ).join("")}
        `;

        document.querySelectorAll(".quiz-option").forEach(btn => {
            btn.onclick = () => {
                if (btn.textContent === q.answer) score++;

                index++;

                if (index < questions.length) showQuestion();
                else showResults();
            };
        });
    }

    function showResults() {
        container.innerHTML = `
            <h3>Your Score: ${score} / ${questions.length}</h3>
            <p>${score === 10 ? "Excellent! ⭐" :
               score >= 7 ? "Great Job! 🎉" :
               score >= 5 ? "Good Try!" : "Keep Practicing!"}</p>

            <button id="retryQuiz" class="btn">Try Again</button>
        `;

        document.getElementById("retryQuiz").onclick = () => {
            index = 0;
            score = 0;
            showQuestion();
        };
    }
}
