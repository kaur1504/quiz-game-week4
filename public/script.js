document.addEventListener("DOMContentLoaded", () => {
  let currentQuestion = 0;
  let score = 0;
  let userName = "";

  const nameSection = document.getElementById("name-section");
  const nameInput = document.getElementById("name-input");
  const startQuizButton = document.getElementById("start-quiz");

  const quizSection = document.getElementById("quiz-section");
  const quizContainer = document.getElementById("quiz");
  const scoreDisplay = document.getElementById("score");
  const nextButton = document.getElementById("next");

  startQuizButton.addEventListener("click", () => {
    userName = nameInput.value.trim();
    if (userName === "") {
      alert("Please enter your name before starting the quiz.");
      return;
    }

    nameSection.style.display = "none";
    quizSection.style.display = "block";
    scoreDisplay.textContent = `Score: ${score} | Player: ${userName}`;

    fetch("/questions")
      .then((response) => response.json())
      .then((data) => {
        if (!data.questions || !Array.isArray(data.questions)) {
          quizContainer.innerHTML = `<p class="error">Error loading questions. Please try again later.</p>`;
          return;
        }

        displayQuestion(data.questions[currentQuestion]);

        nextButton.addEventListener("click", () => {
          const selectedOption = document.querySelector(
            'input[name="option"]:checked'
          );
          if (selectedOption) {
            if (
              selectedOption.value === data.questions[currentQuestion].answer
            ) {
              score++;
            }

            currentQuestion++;

            if (currentQuestion < data.questions.length) {
              displayQuestion(data.questions[currentQuestion]);
            } else {
              quizContainer.innerHTML = `<h2 class="result">${userName}, Your Score: ${score} / ${data.questions.length}</h2>`;
              nextButton.style.display = "none";
            }

            scoreDisplay.textContent = `Score: ${score} | Player: ${userName}`;
            nextButton.disabled = true;
          }
        });
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        quizContainer.innerHTML = `<p class="error">Failed to load questions. Check the console for details.</p>`;
      });
  });

  function displayQuestion(question) {
    quizContainer.innerHTML = `
            <h3>${question.question}</h3>
            ${question.options
              .map(
                (option) => `
                <label class="option">
                    <input type="radio" name="option" value="${option}" onclick="enableNext()"> ${option}
                </label>
            `
              )
              .join("")}
        `;
    nextButton.disabled = true;
  }
});

function enableNext() {
  document.getElementById("next").disabled = false;
}
