// The variables are configured to reference HTML elements, facilitating manipulation of their properties within the JavaScript code
var titleBox = document.querySelector(".Title");
var questionBox = document.querySelector(".Question-box");
var scoreBox = document.querySelector(".Score-box");
var highScoreBox = document.querySelector(".High-Score-box");
var startButton = document.querySelector(".start-button")
var timerElement = document.querySelector("#timer-count")
var questionasked = document.getElementById("question-asked")
var questionanswerchoices = document.getElementById("question-answer-choices");
var scores = document.getElementById("scores");
var userInitialsInput = document.querySelector ("#user-initials-input")
var highScoresButton = document.getElementById("high-scores-button");
var highScoresList = document.getElementById("high-scores-list");
var submitButton = document.querySelector("#submit-button");
var playAgainButton = document.querySelector("#play-again-button");
// the button conditions are set to be manipulated later on
submitButton.disabled = true;
playAgainButton.disabled = false;
highScoresButton.disabled = false;
//the index and score variables are created and set to 0 so that they have a baseline value that can be increased later. Index will be used in reference to question order and score in reference to player score.
var index = 0;
var score = 0;
//the timer and timer count variables are set up to later be referenced in the funtions for setting the countdown time and ending the quiz
var timer;
var timerCount;
//the variable questions holds arrays of questions, answer choices and correct answers for the quiz game
var questions = [
    {
        question: "Commonly used data types do not include which of the following:",
        choices: ["strings", "booleans", "alerts", "numbers"],
        answer: "alerts"
    },
    {
        question: "Arrays in Javascript can be used to store which of the following:",
        choices: ["numbers and strings", "other arrays", "booleans", "all of the above"],
        answer: "all of the above"
    },
    {
        question: "The condition in an if/else statement is enclosed within which of the following:",
        choices: ["quotes", "curly brackets", "parenthesis", "square brackets"],
        answer: "parenthesis"
    },
    {
        question: "String values must be enclosed within _____ when being assiged to variables.",
        choices: ["commas", "curly brackets", "quotes", "parenthesis"],
        answer: "quotes"
    },
    {
        question: "A very useful tool used during development and debugging for printing content to the debugger is:",
        choices: ["Javascript", "terminal/bash", "for loops", "console log"],
        answer: "console log"
    }
];

//function for starting game which starts timer and generates questions
function startGame(){
    index = 0;
    score = 0;
    timerCount = 60;
    //disables buttons after game begins
    startButton.disabled = true;
    submitButton.disabled = true;
    playAgainButton.disabled = true;
    highScoresButton.disabled = true;
    startTimer();
    showQuestions();
    //hides everything but question box when quiz begins
    titleBox.classList.add("hidden");
    questionBox.classList.remove("hidden");
    scoreBox.classList.add("hidden");
    highScoreBox.classList.add("hidden");
}

//function for setting timer and begining its countdown to 0
function startTimer() {
    timer = setInterval(function (){
        timerCount--;
        timerElement.textContent = "Time: " + timerCount + "s";
        if (timerCount === 0 || timerCount < 0) {
            clearInterval(timer);
            endQuiz();
        }
    }, 1000)
}

//function for showing questions from question array
function showQuestions() {
    //create variables for current question to create text content for questions and answer choices
    var currentQuestion = questions[index];
    questionasked.textContent = currentQuestion.question;
    questionanswerchoices.textContent = ""
    //generates buttons for each answer choice to each question
    for (var i = 0; i < currentQuestion.choices.length; i++) {
        var li = document.createElement("li");
        var button = document.createElement("button");
        button.textContent = currentQuestion.choices[i];
        //stores users answer based off button clicked
        button.setAttribute("user-answer", currentQuestion.choices[i]);
        //checks users answer when a button is clicked
        button.addEventListener("click", function() {
            var userAnswer = this.getAttribute("user-answer");
            //Sets condition for correct answer and increases score if that is chosen. Reduces time by 10 seconds if incorrect answer is checked
            if (userAnswer === currentQuestion.answer) {
                score ++;
            } else {
                timerCount -= 10;
            }
            //increases index by 1 so next question can be asked and if the questions have been exhausted the quiz ends
            index++;
            //sets condition for quiz to end
            if (index >= questions.length) {
                //calls the endquiz function
                endQuiz();
            } else {
                showQuestions();
            }
        });
        //creates buttons for each list item to be added
        li.appendChild(button);
        //ties each answer choice to a list item button
        questionanswerchoices.appendChild(li);
    }

}

//function to end quiz
function endQuiz(){
    //start button remains disabled so user cannot start quiz until they have submitted score
    startButton.disabled = true;
    clearInterval(timer);
    //displays score to user
    scores.textContent = "Your final score is " + score + "/5";
    scores.style.marginBottom = "20px";
    scores.style.fontSize = "20px";
    //Resets high scores upon the conclusion of the game
    clearHighScoreList();
    //Enables the functionality of the submit button
    submitButton.disabled = false;
    //Conceals the questions from the user's view
    var questionanswerchoices =document.getElementById("question-answer-choices")
    questionanswerchoices.innerHTML = ""
    var questionasked =document.getElementById("question-asked")
    questionasked.innerHTML = ""
    //Conceals all elements except for the score box upon completion of the quiz
    titleBox.classList.add("hidden");
    questionBox.classList.add("hidden");
    scoreBox.classList.remove("hidden");
    highScoreBox.classList.add("hidden");
}


//  save user scores
function saveUserScore() {
    var userInitials = userInitialsInput.value;
    if (userInitials === "") {
        alert("Please type in your initials")
        return;
    }
    //Retrieves the array of high scores stored in local memory; if no data is found, presents an empty array
    var highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    if (!Array.isArray(highScores)) {
        highScores = [];
    }
    //sets up variable for new score to be saved
    var newScore = {
        userInitials: userInitials,
        score: score
    }
    //Appends the new score to the high scores array for storage in local memory
    highScores.push(newScore)
    localStorage.setItem("highScores", JSON.stringify(highScores));
    //disables submit button after it is used
    submitButton.disabled = true;

    startButton.disabled = false;
    playAgainButton.disabled = false;
    highScoresButton.disabled = false;
    // high score box and hides others
    titleBox.classList.add("hidden");
    questionBox.classList.add("hidden");
    scoreBox.classList.add("hidden");
    highScoreBox.classList.remove("hidden");
}

//Function to display high scores retrieved from local storage
function viewHighScores () {
    var highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    highScoresList.innerHTML = "";

    if (highScores.length === 0) {
        alert("No high scores found")
    } else {
        /// Arranges scores in descending order of value
        highScores.sort(function(a,b) {
            return b.score - a.score;
        });
        //// Restricts high scores to the top 10 entries
        var numToShow = Math.min (highScores.length,10);
        //// Generates a list displaying user initials alongside their respective scores, creating individual list elements for each entry
        for (var i = 0; i < numToShow; i++) {
            var li2 = document.createElement("li");
            li2.textContent =(i+1) + ". " + highScores[i].userInitials + ": " + highScores[i].score;
            li2.style.fontSize = "20px";
            highScoresList.appendChild(li2)
        }
    }
}

// Clears high scores in different scenarios
function clearHighScoreList() {
    highScoresList.innerHTML = "";
}

// Attaches an event listener to the start button to initiate the game and clear specific fields
startButton.addEventListener("click", function(){
    startGame();
    clearHighScoreList();
    userInitialsInput.value = "";
    scores.textContent = "";
});

// Attaches an event listener to the submit button
submitButton.addEventListener("click", function() {
    saveUserScore();
    viewHighScores();
}); 

// Attaches an event listener to the "View High Scores" button
highScoresButton.addEventListener("click", function() {
    viewHighScores();
    // Conceals all elements except for the high score box
    titleBox.classList.add("hidden");
    questionBox.classList.add("hidden");
    scoreBox.classList.add("hidden");
    highScoreBox.classList.remove("hidden");
})

playAgainButton.addEventListener("click", function() {
// Conceals all elements except the title box
    titleBox.classList.remove("hidden");
    questionBox.classList.add("hidden");
    scoreBox.classList.add("hidden");
    highScoreBox.classList.add("hidden");
})

