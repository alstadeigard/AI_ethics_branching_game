function chooseOption(option) {
    var resultText = document.getElementById('resultText');
    if (option === 1) {
        resultText.innerHTML = "You chose Option 1. [Outcome of Option 1]";
    } else {
        resultText.innerHTML = "You chose Option 2. [Outcome of Option 2]";
    }
}
