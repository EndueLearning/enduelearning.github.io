document.addEventListener("DOMContentLoaded", () => {

    const questionBox = document.getElementById("question");
    const optionsBox = document.getElementById("options");
    const progressText = document.getElementById("progress");
    const explanation = document.getElementById("explanation");
    const nextBtn = document.getElementById("next-btn");

    let quiz = [];
    let index = 0;
    let locked = false;

    async function loadQuiz() {
        try {
            const page = window.location.pathname.split("/").pop().replace(".html", "");
            const jsonPath = `/assets/data/quiz/science/physics/${page}.json`;

            console.log("Loading:", jsonPath);

            const res = await fetch(jsonPath);

            if (!res.ok) {
                progressText.innerHTML = "❌ Quiz file not found.";
                return;
            }

            quiz = await res.json();
            showQuestion();

        } catch (err) {
            progressText.innerHTML = "⚠ Error loading quiz.";
            console.error(err);
        }
    }

    function showQuestion() {
        locked = false;
        const q = quiz[index];

        progressText.innerText = `Question ${index + 1} of ${quiz.length}`;
        questionBox.innerHTML = q.question;
        optionsBox.innerHTML = "";
        explanation.style.display = "none";
        explanation.innerHTML = `<b>Explanation:</b> ${q.explanation}`;

        q.options.forEach((opt, i) => {
            const btn = document.createElement("button");
            btn.className = "option-btn";
            btn.innerText = opt;

            btn.onclick = () => checkAnswer(i, q.answer, btn);
            optionsBox.appendChild(btn);
        });

        nextBtn.style.display = "none";
    }

    function checkAnswer(selectedIndex, correctIndex, btn) {
        if (locked) return;
        locked = true;

        const optionButtons = document.querySelectorAll(".option-btn");

        optionButtons.forEach((b, i) => {
            b.disabled = true;
            if (i === correctIndex) b.classList.add("correct");
            if (i === selectedIndex && selectedIndex !== correctIndex) {
                b.classList.add("wrong");
            }
        });

        explanation.style.display = "block";
        nextBtn.style.display = "block";
    }

    nextBtn.onclick = () => {
        index++;
        if (index < quiz.length) showQuestion();
        else {
            document.getElementById("quiz-box").innerHTML = `
                <h2>🎉 Quiz Completed!</h2>
                <p>Check out more quizzes in the Quiz Sets section.</p>
            `;
        }
    };

    loadQuiz();
});
