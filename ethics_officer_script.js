let scenarios, answers = [];

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
    if (!scenario) {
        return;
    }

    document.getElementById('questionText').textContent = scenario.text;
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
    answers.push({ question: currentScenarioId, outcome: choice.outcome });
    const nextScenarioId = scenarios.find(sc => sc.id === currentScenarioId).choices.find(ch => ch.text === choice.text).next;

    // Define promotion checkpoints
    const promotionCheckpoints = ['q4', 'q8', 'q12', 'q16'];

    if (promotionCheckpoints.includes(currentScenarioId)) {
        processResults(nextScenarioId, currentScenarioId === 'q16');
    } else {
        displayScenario(nextScenarioId);
    }
}



function processResults(nextScenarioId, isFinal) {
    const wrongAnswers = answers.filter(answer => answer.outcome === "Incorrect");
    const resultText = document.getElementById('resultText');
    const choicesContainer = document.getElementById('choicesContainer');

    if (isFinal) {
        // Clear the buttons for the final result display
        choicesContainer.innerHTML = '';

        if (wrongAnswers.length === 0) {
            resultText.textContent = "Congratulations! You have successfully completed the entire game!";
            // The game is complete. No further actions needed.
        } else {
            resultText.textContent = "Unfortunately your boss deemed your performance wasn't adequate for a promotion. He sends you the following list of links for information related the cases you got wrong:\n" + wrongAnswers.map(answer => answer.question).join("\n");
            const restartButton = document.createElement('button');
            restartButton.textContent = 'Restart';
            restartButton.onclick = () => location.reload();
            document.getElementById('gameArea').appendChild(restartButton);
        }
    } else {
        // Handle non-final scenarios as before
        if (wrongAnswers.length === 0) {
            resultText.textContent = "Congratulations on your promotion! Keep conducting audits to climb further up the career ladder.";
            displayScenario(nextScenarioId);
        } else {
            resultText.textContent = "Unfortunately your boss deemed your performance wasn't adequate for a promotion. He sends you the following list of links for information related the cases you got wrong:\n" + wrongAnswers.map(answer => answer.question).join("\n");
            const restartButton = document.createElement('button');
            restartButton.textContent = 'Restart';
            restartButton.onclick = () => location.reload();
            document.getElementById('gameArea').appendChild(restartButton);
        }
    }
}
