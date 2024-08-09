const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-button');

let currentQuestionIndex = 0;
let questions = [];

async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple');
        const data = await response.json();
        questions = data.results.map((question) => {
            const formattedQuestion = {
                question: question.question,
                answers: [...question.incorrect_answers, question.correct_answer],
                correct: question.correct_answer
            };
            shuffleArray(formattedQuestion.answers);
            return formattedQuestion;
        });
        startGame();
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

function startGame() {
    currentQuestionIndex = 0;
    nextButton.classList.add('hidden');
    showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionElement.innerHTML = question.question;
    answerButtonsElement.innerHTML = '';
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(button, question.correct));
        answerButtonsElement.appendChild(button);
    });
}

function selectAnswer(button, correctAnswer) {
    if (button.innerText === correctAnswer) {
        button.classList.add('correct');
    } else {
        button.classList.add('wrong');
    }
    Array.from(answerButtonsElement.children).forEach(btn => {
        btn.disabled = true;
        if (btn.innerText === correctAnswer) {
            btn.classList.add('correct');
        }
    });
    nextButton.classList.remove('hidden');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
        nextButton.classList.add('hidden');
    } else {
        alert('You have completed the quiz!');
        startGame();
    }
});

fetchQuestions();
