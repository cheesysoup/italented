(function(){
    const correctPoints = 6;
    const blankPoints = 1.5;
    const wrongPoints = 0;
    var score = 0;

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
        }
        $('#quiz').html(quiz);
    }

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
            } else if (userAnswer === null) {
                numBlank++;
                container.style.color = 'yellow';
            } else {
                container.style.color = 'red';
            }

            formData.append(`Question ${i+1}`,userAnswer);
        }
        let numWrong = questions.length - numCorrect - numBlank;
        let totalPoints = questions.length * correctPoints;
        score = numCorrect * correctPoints + numBlank * blankPoints + numWrong * wrongPoints;
        $('#results').html(`${numCorrect} correct, ${numBlank} blank, and ${numWrong} wrong<br>Your final score is ${score} out of ${totalPoints} possible points`);
        

        //Send score to google sheets database https://docs.google.com/spreadsheets/d/123WAd9MmeU7N4dmlNxLXF25SUMYqTYaBgJSWeXQ9ylw/edit?usp=sharing
        const scriptURL = 'https://script.google.com/macros/s/AKfycbz03OJQN7BVIagsDUFGjRyOR3BF6eUYSOU0ModJygKGVRC_FwNL/exec'
        const form = document.forms['submit-to-google-sheet']
        formData.append(`Score`,score);
        fetch(scriptURL, { method: 'POST', body: formData})
        .then(response => console.log('Success!', response))
        .catch(error => console.error('Error!', error.message))
    }

    buildQuiz();

    $('#submit').click(showResults);
})();    
