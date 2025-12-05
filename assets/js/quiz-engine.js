document.addEventListener("DOMContentLoaded", () => {
    const quizBox = document.getElementById("quiz-box");
    const questionBox = document.getElementById("question");
    const optionsBox = document.getElementById("options");
    const nextBtn = document.getElementById("next-btn");
    const progressText = document.getElementById("progress");
    const explanation = document.getElementById("explanation");

    let quizData = [];
    let index = 0;
    let selected = false;

    async function loadQuiz() {
        try {
            // Detect the quiz HTML page name
            const pageFile = window.location.pathname.split("/").pop();
            const pageName = pageFile.replace(".html", "");

            // Build the JSON path EXACTLY matching your folder structure
            const jsonPath =
                `/assets/data/quiz/science/physics/${pageName}.json`;

            console.log("Loading quiz JSON:", jsonPath);

            const res = await fetch(jsonPath);

            if (!res.ok) {
                questionBox.innerHTML = `❌ Quiz file not found:<br>${jsonPath}`;
                return;
            }

            quizData = await res.json();
            showQuestion();
        } catch (error) {
            questionBox.innerHTML = "⚠ Error loading quiz.";
            console.error(error);
        }
    }

    function showQuestion() {
        selected = false;

        const q = quizData[index];

        questionBox.innerHTML = q.question;
        optionsBox.innerHTML = "";
        explanation.style.display = "none";
        explanation.innerHTML = `<strong>Explanation:</strong> ${q.explanation}`;

        progressText.innerHTML = `Question ${index + 1} of ${quizData.length}`;

        q.options.forEach((opt, i) => {
            const btn = document.createElement("button");
            btn.className = "option-btn";
            btn.innerText = opt;

            btn.addEventListener("click", () => selectOption(btn, i, q.answer));

            optionsBox.appendChild(btn);
        });

        nextBtn.style.display = "none";
    }

    function selectOption(btn, userIndex, correctIndex) {
        if (selected) return;
        selected = true;

        const optionButtons = document.querySelectorAll(".option-btn");

        optionButtons.forEach((b, i) => {
            if (i === correctIndex) b.classList.add("option-correct");
            if (i === userIndex && userIndex !== correctIndex)
                b.classList.add("option-wrong");

            b.style.pointerEvents = "none";
        });

        explanation.style.display = "block";
        nextBtn.style.display = "block";
    }

    nextBtn.addEventListener("click", () => {
        index++;
        if (index < quizData.length) {
            showQuestion();
        } else {
            quizBox.innerHTML = `
                <h2>🎉 Quiz Completed!</h2>
                <p>Great job! You finished this quiz.</p>
            `;
        }
    });

    loadQuiz();
});
