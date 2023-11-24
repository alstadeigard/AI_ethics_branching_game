let questions, currentQuestionIndex, score = 0;

document.addEventListener('DOMContentLoaded', function() {
    loadGameData('scenarios/caseStudiesGame.json');
});

function loadGameData(filePath) {
    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            questions = data.questions;
            currentQuestionIndex = 0;
            score = 0;
            displayQuestion();
        })
        .catch(error => console.error('Error loading game data:', error));
}

function displayQuestion() {
    const resultText = document.getElementById('resultText');
    resultText.innerHTML = '';  // Clear previous results or instructions

    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        document.getElementById('questionText').textContent = question.text;
        const choicesContainer = document.getElementById('choicesContainer');
        choicesContainer.innerHTML = '';

        question.choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice.text;
            button.onclick = () => handleChoice(choice.isCorrect, choice.reading);
            choicesContainer.appendChild(button);
        });
    } else {
        displayFinalScore();
    }
}

function handleChoice(isCorrect, readingLink) {
    const resultText = document.getElementById('resultText');
    const choicesContainer = document.getElementById('choicesContainer');
    const buttons = choicesContainer.getElementsByTagName('button');

    for (let button of buttons) {
        button.disabled = true;
    }

    if (isCorrect) {
        score++;
        resultText.innerHTML = "Well done! Your decision did not mirror a real-world mistake. Learn more: <br><a href='" + readingLink + "' target='_blank'>Read more about this case</a><br>";
    } else {
        resultText.innerHTML = "This choice mirrors a real-world mistake. Understanding these scenarios helps improve future AI development. Learn more: <br><a href='" + readingLink + "' target='_blank'>Read more about this case</a><br>";
    }

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next Question';
    nextButton.onclick = () => {
        currentQuestionIndex++;
        displayQuestion();
    };
    resultText.appendChild(nextButton);
}

function displayFinalScore() {
    const resultText = document.getElementById('resultText');
    resultText.innerHTML = "Your final score is: " + score + " out of " + questions.length;
}

