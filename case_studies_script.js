let questions, selectedQuestions, currentQuestionIndex, score = 0;

document.addEventListener('DOMContentLoaded', function() {
    loadGameData('scenarios/caseStudiesGame.json');
});

function loadGameData(filePath) {
    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            questions = data.questions;
            selectedQuestions = selectRandomQuestions(2);
            currentQuestionIndex = 0;
            displayQuestion();
        })
        .catch(error => console.error('Error loading game data:', error));
}

function selectRandomQuestions(count) {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function displayQuestion() {
    if (currentQuestionIndex < selectedQuestions.length) {
        const question = selectedQuestions[currentQuestionIndex];
        document.getElementById('questionText').textContent = question.text;
        const choicesContainer = document.getElementById('choicesContainer');
        choicesContainer.innerHTML = '';

        question.choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice.text;
            button.onclick = () => handleChoice(choice.isCorrect);
            choicesContainer.appendChild(button);
        });
    } else {
        displayScore();
    }
}

function handleChoice(isCorrect) {
    if (isCorrect) {
        score++;
    }
    currentQuestionIndex++;
    displayQuestion();
}

function displayScore() {
    const resultText = document.getElementById('resultText');
    resultText.textContent = "Your score: " + score + " out of " + selectedQuestions.length;
    // Optionally, add any additional actions after displaying the score
}
