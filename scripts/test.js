(function(){
    const quizContainer = document.getElementById('quiz');
    const resultsContainer = document.getElementById('results');
    const submitButton = document.getElementById('submit');
    const correctPoints = 6;
    const blankPoints = 1.5;
    const wrongPoints = 0;

    const myQuestions = [
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
        },
    ];

    function buildQuiz(){
        // we'll need a place to store the HTML output
        const output = [];
    
        // for each question...
        myQuestions.forEach(
        (currentQuestion, questionNumber) => {
    
            // we'll want to store the list of answer choices
            const answers = [];
    
            // and for each available answer...
            for(letter in currentQuestion.answers){
    
                // ...add an HTML radio button
                answers.push(
                    `<label>
                        <input type="radio" name="question${questionNumber}" value="${letter}">
                        ${letter} :
                        ${currentQuestion.answers[letter]}
                    </label>`
                );
            }
    
            // add this question and its answers to the output
            output.push(
                `<div class="question"> ${currentQuestion.question} </div>
                <div class="answers"> ${answers.join('')} </div>`
            );
        }
        );
    
        // finally combine our output list into one string of HTML and put it on the page
        quizContainer.innerHTML = output.join('');
    }

    function showResults(){
        // gather answer containers from our quiz
        const answerContainers = quizContainer.querySelectorAll('.answers');

        // keep track of user's answers
        let numCorrect = 0;
        let numBlank = 0;
        

        // for each question...
        myQuestions.forEach( (currentQuestion, questionNumber) => {
            // find selected answer
            const answerContainer = answerContainers[questionNumber];
            const selector = 'input[name=question'+questionNumber+']:checked';
            const userAnswer = (answerContainer.querySelector(selector) || {}).value;
            // if answer is correct
            if(userAnswer === currentQuestion.correctAnswer){
                // add to the number of correct answers
                numCorrect++;

                // color the answers green
                answerContainers[questionNumber].style.color = 'lightgreen';
            }
            // if answer is wrong or blank
            else if(userAnswer === undefined){ 
                //add to the number of blank answers
                numBlank++;

                // color the answers yellow
                answerContainers[questionNumber].style.color = 'yellow';
            }else{
                // color the answers red
                answerContainers[questionNumber].style.color = 'red';
            }
        });
        // show number of correct answers out of total
        resultsContainer.innerHTML = numCorrect + ' correct, ' + numBlank + ' blank, and ' + (myQuestions.length-numCorrect-numBlank) + ' wrong' + '<br>Your final score is ' + (numCorrect*correctPoints + numBlank*blankPoints + (myQuestions.length-numCorrect-numBlank)*wrongPoints) + ' out of ' + (myQuestions.length*correctPoints) + ' possible points';

    }

    // display quiz right away
    buildQuiz();

    // on submit, show results
    submitButton.addEventListener('click', showResults);
})();    
