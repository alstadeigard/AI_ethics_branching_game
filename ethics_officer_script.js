let scenarios, answers = [];
let currentScenarioId = '';

document.addEventListener('DOMContentLoaded', function() {
    loadGameData('scenarios/ethicsOfficerGame.json');
});

function loadGameData(filePath) {
    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            scenarios = data.scenarios;
            displayScenario('q1'); // Start with the first question
        })
        .catch(error => console.error('Error loading game data:', error));
}

function displayScenario(scenarioId) {
    currentScenarioId = scenarioId;
    const scenario = scenarios.find(sc => sc.id === scenarioId);
    if (!scenario) return;

    const formattedText = scenario.text.replace(/\n/g, '<br>');

    document.getElementById('questionText').innerHTML = formattedText;
    const choicesContainer = document.getElementById('choicesContainer');
    choicesContainer.innerHTML = '';

    scenario.choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice.text;
        button.onclick = () => {
            handleChoice(choice, scenario.next);
        };
        choicesContainer.appendChild(button);
    });

}

function handleChoice(choice) {
    answers.push({
        question: currentScenarioId,
        outcome: choice.outcome,
        reading: scenarios.find(sc => sc.id === currentScenarioId).reading
    });

    const nextScenarioId = choice.next;

    // Define promotion checkpoints
    const promotionCheckpoints = ['q4', 'q8', 'q12'];

    if (promotionCheckpoints.includes(currentScenarioId)) {
        processResults(nextScenarioId, currentScenarioId === 'q12');
    } else {
        displayScenario(nextScenarioId);
    }
}


function processResults(nextScenarioId, isFinal) {
    const wrongAnswers = answers.filter(answer => answer.outcome === "Incorrect");
    const resultText = document.getElementById('resultText');
    const choicesContainer = document.getElementById('choicesContainer');

    // Clear the buttons for the result display
    choicesContainer.innerHTML = '';

    if (isFinal) {
        if (wrongAnswers.length === 0) {
            resultText.textContent = "Congratulations! You have successfully completed the entire game!";
        } else {
            resultText.innerHTML = "Unfortunately you made some mistakes during your previous audit. Review the following links to learn where you went wrong:<br>"
                + wrongAnswers.map(answer => `<a href="${answer.reading}" target="_blank">${answer.reading}</a>`).join("<br>")
                + ". <br>Then, try again.";
            createRestartButton();
        }
    } else {
        if (wrongAnswers.length === 0) {
            resultText.textContent = "Congratulations on your promotion! Moving on to the next set of questions...";
            displayScenario(nextScenarioId);
        } else {
            resultText.innerHTML = "Unfortunately you made some mistakes during your previous audit. Review the following links to learn where you went wrong:<br>"
                + wrongAnswers.map(answer => `<a href="${answer.reading}" target="_blank">${answer.reading}</a>`).join("<br>")
                + "<br>Then, try again.";
            createRestartButton();
        }
    }
}

function createRestartButton() {
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart';
    restartButton.onclick = () => location.reload();
    document.getElementById('gameArea').appendChild(restartButton);
}