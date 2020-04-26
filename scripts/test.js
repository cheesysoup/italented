(function(){
    const correctPoints = 6;
    const blankPoints = 1.5;
    const wrongPoints = 0;

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
        },
    ];

    function buildQuiz() {
        let quiz = ``;
        questions.forEach((question, i) => {
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
        });
        $('#quiz').html(quiz);
    }

    function showResults() {
        let answerContainers = $('#quiz').find('.answers');
        let numCorrect = 0;
        let numBlank = 0;
        questions.forEach((question, i) => {
            let container = answerContainers[i];
            const selector = `input[name=question${i}]:checked`;
            const userAnswer = ($(container).find(selector)[0] || {}).value;
            if (userAnswer === question.correctAnswer) {
                numCorrect++;
                container.style.color = 'lightgreen';
            } else if (userAnswer === undefined) { 
                numBlank++;
                container.style.color = 'yellow';
            } else {
                container.style.color = 'red';
            }
        });
        let numWrong = questions.length-numCorrect-numBlank;
        let totalPoints = questions.length * correctPoints;
        let score = numCorrect * correctPoints + numBlank * blankPoints + numWrong * wrongPoints;
        $('#results').html(`${numCorrect} correct, ${numBlank} blank, and ${numWrong} wrong<br>Your final score is ${score} out of ${totalPoints} possible points`);
    }

    buildQuiz();

    $('#submit').click(showResults);
})();    
