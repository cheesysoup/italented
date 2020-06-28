(function(){

    // set score factors
    const correctPoints = 6;
    const blankPoints = 1.5;
    const wrongPoints = 0;

    // multiple choice questions array
    const questions = [
        {
            question: "\\(\\frac{x^2}{\\sqrt{2}}\\)?",
            answers: {
                a: "\\(2\\)",
                b: "Wrong",
                c: "Right"
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
        }
    ];

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
                    `<label>
                        <input type="radio" name="question${i}" value="${answer}">
                        ${answer}: ${question.answers[answer]}
                    </label>`;
            }
            quiz +=
                `<div class="question"> ${i + 1}. ${question.question} </div>
                 <div class="answers"> ${answers} </div>`;

            numOfMult = i+1;
        }
        
        $('#quiz').html(quiz);

        buildAllShortAnswers(numOfMult);
    }

    // build short one short answer question
    function buildShortAnswersOneByOne(questionNumber,numOfMult) {
        let shortAnswersQuiz = '';
        let shortAnswersInput = '';
        
        shortAnswersInput += 
            `<label>
                <input type="text" class="shortAnswersBoxes" name="shortAnswers${questionNumber}">
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

       let allShortAnswersBoxes = $('#shortAnswersQuiz').find('.shortAnswersBoxes');

       let allShortAnswers = [];
       for (let i = 0; i < shortAnswerQuestions.length; i++) {
            allShortAnswers.push(document.getElementsByName(`shortAnswers${i}`)[0].value);
       }
       for (let i = 0; i < allShortAnswers.length; i++) {
           let answer = allShortAnswers[i];
           let answerBoxId = "answerBox${questionNumber}";

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
            } else if (userAnswer === null) {
                numBlank++;
                container.style.color = 'yellow';
            } else {
                container.style.color = 'red';
            }
        }

        getShortAnswerResults();

        let shortAnswerResults = getShortAnswerResults();
        let numWrong = questions.length - numCorrect - numBlank + shortAnswerResults[2];
        numCorrect += shortAnswerResults[0];
        numBlank += shortAnswerResults[1];
        let totalPoints = (questions.length+shortAnswerQuestions.length) * correctPoints;
        let score = numCorrect * correctPoints + numBlank * blankPoints + numWrong * wrongPoints;
        $('#results').html(`${numCorrect} correct, ${numBlank} blank, and ${numWrong} wrong<br>Your final score is ${score} out of ${totalPoints} possible points`);
    }

    // populate components
    buildQuiz();
    $('#submit').click(showResults);

})();    


