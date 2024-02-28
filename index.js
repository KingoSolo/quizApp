
const questionLabel = document.getElementById("labelQuestion")
const questionCountInput = document.getElementById("question-count");
const questionText = document.getElementById("question-text");
const optionContainer = document.querySelector(".choices");
const points = document.getElementById("score");
const startQuizButton = document.getElementById("start-quiz");
const start = document.querySelector(".start");

let questions = [];
let currentQuestion = 0;
let correctAnswer = 0;

startQuizButton.addEventListener("click", () => {
    const questionCount = parseInt(questionCountInput.value);
 
    if (!isNaN(questionCount) && questionCount > 0) {
        startQuizButton.style.display = "none";
        fetchQuestions(questionCount);
    } else {
        alert("Please enter a valid number of questions.");
    }
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function fetchQuestions(amount) {
    fetch(`https://opentdb.com/api.php?amount=${amount}`)
        .then(res => res.json())
        .then(loadedQuestions => {
            questions = loadedQuestions.results.map(loadedQuestion => {
                const options = [...loadedQuestion.incorrect_answers, loadedQuestion.correct_answer];
                shuffle(options)
                const correctIndex = options.indexOf(loadedQuestion.correct_answer);

                const formattedQuestion = {
                    questionText: loadedQuestion.question,
                    options: options,
                    correct: correctIndex
                };
               
                return formattedQuestion;
            });
            showQuestion();
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            alert('An error occurred while fetching questions. Please try again later.');
        });
}

function showQuestion() {
    questionLabel.textContent = ""
    questionCountInput.style.display = "none";
    startQuizButton.style.display = "none";
    questionText.innerHTML = questions[currentQuestion].questionText;
    optionContainer.innerHTML = '';
    
    questions[currentQuestion].options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('option');
        button.innerHTML = option;
        optionContainer.appendChild(button);

        button.addEventListener('click', () => {
            checkAnswer(questions[currentQuestion].options.indexOf(option));
        });
    });

    points.textContent = '';

    console.log(questions)
}

function checkAnswer(picked) {
    const currentOption = questions[currentQuestion].correct;

    if (picked === currentOption) {
        correctAnswer++;
        points.textContent = "Correct! You just scored 10 points";
    } else {
        points.textContent = "Incorrect!";
    }
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 1000);
    
}

function showResult() {
    const pageContent = document.querySelector(".quizContent");
    pageContent.textContent = `You answered ${correctAnswer} questions out of ${questions.length} right`;
    points.textContent = `Your final score is: ${correctAnswer * 10}`;
    pageContent.appendChild(points)

    // const restartButton = document.createElement("button");
    // restartButton.setAttribute("id", "restart-button");
    // restartButton.innerHTML = "Restart Quiz";
    // pageContent.appendChild(restartButton);

    // restartButton.addEventListener("click", () => {
    //     currentQuestion = 0;
    //     correctAnswer = 0;
    //     questionCountInput.style.display = "block";
    //     startQuizButton.style.display = "block";
    //     fetchQuestions(parseInt(questionCountInput.value));
   // });
}
