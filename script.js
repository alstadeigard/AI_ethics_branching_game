document.addEventListener('DOMContentLoaded', function() {
    loadGameData();
});

function loadGameData(filePath) {
    fetch(filePath)
        .then(response => response.json())
        .then(data => startGame(data.scenarios))
        .catch(error => console.error('Error loading game data:', error));
}

function startGame(scenarios) {
    displayQuestion(scenarios, scenarios[0].id);
}

function displayQuestion(scenarios, questionId) {
    const question = scenarios.find(scenario => scenario.id === questionId);
    if (!question) return;

    document.getElementById('questionText').textContent = question.text;
    const choicesContainer = document.getElementById('choicesContainer');
    choicesContainer.innerHTML = '';

    question.choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice.text;
        button.onclick = () => handleChoice(scenarios, choice, question);
        choicesContainer.appendChild(button);
    });

    // Remove any existing next question button
    const nextButton = document.getElementById('nextButton');
    if (nextButton) {
        nextButton.remove();
    }
}

function handleChoice(scenarios, choice, currentQuestion) {
    document.getElementById('resultText').textContent = choice.outcome;

    // Disable all choice buttons
    const buttons = document.querySelectorAll('#choicesContainer button');
    buttons.forEach(button => button.disabled = true);

    // Create and display 'Next Question' button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next Question';
    nextButton.id = 'nextButton';
    nextButton.onclick = () => displayNextQuestion(scenarios, choice.next);
    document.getElementById('gameArea').appendChild(nextButton);
}

function displayNextQuestion(scenarios, nextQuestionId) {
    if (nextQuestionId) {
        displayQuestion(scenarios, nextQuestionId);
    } else {
        // End of game or next steps
        document.getElementById('resultText').textContent = 'End of the game.';
    }
}
