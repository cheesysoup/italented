function exit() {
    localStorage.setItem("quiz", "");
    location.href = `dashboard.html`;
}

(function() {
    // checks that user has logged in
    if (!localStorage.getItem("username")) {
        localStorage.setItem("quiz", "");
        location.href = `../index.html`;
    }

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

    function buildQuiz() {
        let quiz = ``;
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
        }
        $('#quiz').html(quiz);
    }

    function showResults() {
        var formData = new FormData();
        formData.append(`User`, localStorage.getItem("username"));
        formData.append(`Quiz`, localStorage.getItem("quiz"));
        
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
        let numWrong = questions.length - numCorrect - numBlank;
        let totalPoints = questions.length * correctPoints;
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

    buildQuiz();
    $('#submit').click(showResults);
})();
