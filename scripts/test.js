function exit() {
    localStorage.setItem("quiz", "");
    location.href = `dashboard.html`;
}

(function() {

    // set score factors
    const correctPoints = 6;
    const blankPoints = 1.5;
    const wrongPoints = 0;

    let quiz = localStorage.getItem("quiz");

    let questions;
    switch (quiz) {
        case '1':
            questions = [
                {
                    question: "\\(\\frac{x^2}{\\sqrt{2}}\\)?",
                    answers: {
                        a: "\\(2\\)",
                        b: "Wrong",
                        c: "Right",
                    },
                    correctAnswer: "c"
                },
                {
                    question: "Question 2?",
                    answers: {
                        a: "Wrong",
                        b: "Wrong",
                        c: "Right"
                    },
                    correctAnswer: "c"
                },
                {
                    question: "Question 3?",
                    answers: {
                        a: "Wrong",
                        b: "Wrong",
                        c: "Wrong",
                        d: "Right"
                    },
                    correctAnswer: "d"
                },
            ];
            break;
        case '2':
            questions = [
                {
                    question: "\\(\\frac{x^2}{\\sqrt{2}}\\)?",
                    answers: {
                        a: "\\(2\\)",
                        b: "\\(4\\)",
                    },
                    correctAnswer: "a"
                },
                {
                    question: "\\(\\frac{x^4}{\\sqrt{2}}\\)?",
                    answers: {
                        a: "\\(3\\)",
                        b: "\\(5\\)",
                    },
                    correctAnswer: "b"
                },
            ];
            break;
        default:
            questions = [];
    }

    // short answer questions array
    const shortAnswerQuestions = [
        {
            question: "What is 1.25*2?",
            correctAnswer: ["5/2","2.5"],
            answer: ""
        },
        {
            question: "How many degrees does a circle have?",
            correctAnswer: ["360","360 degrees","360 degree"],
            answer: ""
        },
        {
            question: "What is 1+1?",
            correctAnswer: ["2"],
            answer: ""
        }
    ];

    // print quiz
    function buildQuiz() {
        let quiz = ``;
        let numOfMult = 0;
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            let answers = ``;
            for (answer in question.answers) {
                answers += 
                    `<label class="mc-container">
                        <input type="radio" name="question${i}" value="${answer}">
                        <span class="mc"></span>
                        ${answer}: ${question.answers[answer]}
                    </label>`;
            }
            answers += 
                    `<label class="mc-container">
                        <input type="radio" name="question${i}" value="blank" checked="checked">
                        <span class="mc"></span>
                        Leave blank
                    </label>`;
            quiz +=
                `<div class="question"> ${i + 1}. ${question.question} </div>
                <div><img id="x" src="../images/${i + 1}.jpg">  </div>
                 <div class="answers"> ${answers} </div>`;

            numOfMult = i+1;
        }
        
        $('#quiz').html(quiz);

        buildAllShortAnswers(numOfMult);
    }

    // build one short answer question
    function buildShortAnswersOneByOne(questionNumber,numOfMult) {
        let shortAnswersQuiz = '';
        let shortAnswersInput = '';
        
        shortAnswersInput += 
            `<label>
                <input type="text" class="short-answer shortAnswersBoxes" name="shortAnswers${questionNumber}">
            </label>`;

        shortAnswersQuiz += 
            `<div class="shortAnswerQuestions name="answerBox${questionNumber}"> ${questionNumber+numOfMult+1}. ${shortAnswerQuestions[questionNumber].question} </div>
            <div class="shortAnswersInput"> ${shortAnswersInput} </div>`

        return shortAnswersQuiz;
   }

    // build all short answer questions
    function buildAllShortAnswers(numOfMult) {
            let allShortAnswers='';
            for (let i=0; i < shortAnswerQuestions.length; i++) {
                
                allShortAnswers += buildShortAnswersOneByOne(i,numOfMult);
            }
            $('#shortAnswersQuiz').html(allShortAnswers);
    }

    // get short answer results
    function getShortAnswerResults() {
        let numCorrect = 0;
        let numBlank = 0;
        let numWrong = 0;

        let allShortAnswers = [];
        for (let i = 0; i < shortAnswerQuestions.length; i++) {
            allShortAnswers.push(document.getElementsByName(`shortAnswers${i}`)[0].value);
        }
        for (let i = 0; i < allShortAnswers.length; i++) {
            let answer = allShortAnswers[i];

            let alreadyWrong = false;
            for (let j = 0; j < shortAnswerQuestions[i].correctAnswer.length; j++) {
                if (answer === shortAnswerQuestions[i].correctAnswer[j]) {
                    numCorrect ++;
                    document.getElementsByName(`shortAnswers${i}`)[0].style.border = '2px solid lightgreen';
                    break;
                } else if (answer === '') {
                    numBlank++;
                    document.getElementsByName(`shortAnswers${i}`)[0].style.border = '2px solid yellow';
                    break;
                } else {
                    if (j === shortAnswerQuestions[i].correctAnswer.length-1) {
                        alreadyWrong = true;
                        numWrong++;
                        document.getElementsByName(`shortAnswers${i}`)[0].style.border = '2px solid red';
                    }
                }
            }
        }

        let results = [numCorrect,numBlank,numWrong];
        return results;
    }

    // show results
    function showResults() {
        var formData = new FormData();
        let answerContainers = $('#quiz').find('.answers');
        let numCorrect = 0;
        let numBlank = 0;
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            let container = answerContainers[i];
            let userAnswer = null;
            const selected = $(container).find(`input[name=question${i}]:checked`);
            if (selected.length > 0) {
                userAnswer = selected[0].value;
            }
            if (userAnswer === question.correctAnswer) {
                numCorrect++;
                container.style.color = 'lightgreen';
            } else if (userAnswer === 'blank') {
                numBlank++;
                container.style.color = 'yellow';
            } else {
                container.style.color = 'red';
            }

            formData.append(`Question ${i+1}`,userAnswer);
        }

        getShortAnswerResults();

        let shortAnswerResults = getShortAnswerResults();
        let numWrong = questions.length - numCorrect - numBlank + shortAnswerResults[2];
        numCorrect += shortAnswerResults[0];
        numBlank += shortAnswerResults[1];
        let totalPoints = (questions.length+shortAnswerQuestions.length) * correctPoints;
        let score = numCorrect * correctPoints + numBlank * blankPoints + numWrong * wrongPoints;
        $('#results').html(`${numCorrect} correct, ${numBlank} blank, and ${numWrong} wrong<br>Your final score is ${score} out of ${totalPoints} possible points`);
        
        $("#loadSubmission").show();
        const scriptURL = 'https://script.google.com/macros/s/AKfycbz03OJQN7BVIagsDUFGjRyOR3BF6eUYSOU0ModJygKGVRC_FwNL/exec'
        const form = document.forms['submit-to-google-sheet']
        formData.append(`Score`,score);
        fetch(scriptURL, { method: 'POST', body: formData})
        .then(response => finish(response))
        .catch(error => console.error('Error!', error.message))
    }

    function finish(response){
        console.log('Success!', response);
        $("#loadSubmission").hide();
    }

    // populate components
    buildQuiz();
    $('#submit').click(showResults);

})();
