(function() {
    const correctPoints = 6;
    const blankPoints = 1.5;
    const wrongPoints = 0;

    function setup(questions) {
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
                    <div class="answers"> ${answers} </div>`;
            }
            $('#quiz').html(quiz);
        }

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
                } else if (userAnswer === 'blank') {
                    numBlank++;
                    container.style.color = 'yellow';
                } else {
                    container.style.color = 'red';
                }
            }
            let numWrong = questions.length - numCorrect - numBlank;
            let totalPoints = questions.length * correctPoints;
            let score = numCorrect * correctPoints + numBlank * blankPoints + numWrong * wrongPoints;
            $('#results').html(`${numCorrect} correct, ${numBlank} blank, and ${numWrong} wrong<br>Your final score is ${score} out of ${totalPoints} possible points`);
        }

        buildQuiz();

        $('#submit').click(showResults);
    }

    function getQuestions(callback) {
        let request = new XMLHttpRequest(); // only works on local server, not file
        request.overrideMimeType("application/json");
        request.open("GET", "../questions.json", true);
        request.onreadystatechange = function() {
            if(request.status === 200 && request.readyState === 4) {
                let questions = JSON.parse(request.responseText);
                callback(questions);
            }
        };
        request.send(null);
    }
    
    getQuestions(setup);
})();    
