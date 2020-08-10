function exit() {
    localStorage.setItem("quiz", "");
    location.href = `dashboard.html`;
}

(function() {

    // set score factors
    const correctPoints = 6;
    const blankPoints = 1.5;
    const wrongPoints = 0;

    //Time in seconds for countdown timer
    var totalTime = 3600;

    var time = totalTime;
    var finished = false;
    
    let quiz = localStorage.getItem("quiz");

    //Multiple choice questions per page
    let pageSize = 5;

    let currentPage = 0;
    let totalPages = 0;
    let totalQuestions = 0;

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


    function setup(questions) {
        function buildQuiz() {
            //Building timer/counter
            var count = setInterval(function(){
                if (finished == false && time == 0){
                    finished = true;
                    showResults();
                    location.href = `dashboard.html`;
                    alert("Test Finished: Answers have been submitted");
                }
                if (finished == false)
                --time;
                document.getElementById("timer").innerHTML = "Time Left: " + new Date(time * 1000).toISOString().substr(11,8);
            }, 1000)

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
                    `<div class="question" id="question${i+1}"> ${i + 1}. ${question.question} </div>
                    <div id="image${i+1}"><img id="x" src="../images/${i + 1}.jpg">  </div>
                    <div class="answers${i+1}" id="answers${i+1}"> ${answers} </div>`;
                numOfMult = i+1;
            }
            $('#quiz').html(quiz);
            for (let q = pageSize+1; q <= questions.length; q++){
                $(`#question${q}`).hide();
                $(`#image${q}`).hide();
                $(`#answers${q}`).hide();
            }
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
                `<div class="shortAnswerQuestions name="answerBox${questionNumber}" id="question${questionNumber+numOfMult+1}"> ${questionNumber+numOfMult+1}. ${shortAnswerQuestions[questionNumber].question} </div>
                <div class="shortAnswersInput" id="answers${questionNumber+numOfMult+1}"> ${shortAnswersInput} </div>`

            return shortAnswersQuiz;
        }

        // build all short answer questions
        function buildAllShortAnswers(numOfMult) {
            let allShortAnswers='';
            for (let i=0; i < shortAnswerQuestions.length; i++) {
                allShortAnswers += buildShortAnswersOneByOne(i,numOfMult);

            }
            $('#shortAnswersQuiz').html(allShortAnswers);
            
            totalQuestions = numOfMult + shortAnswerQuestions.length;
            totalPages = Math.trunc(totalQuestions/5);
            for (let q = pageSize+1; q <= numOfMult + shortAnswerQuestions.length; q++){
                $(`#question${q}`).hide();
                $(`#image${q}`).hide();
                $(`#answers${q}`).hide();
            }
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

            //Time taken for the test
            finished = true;
            formData.append(`Time`, new Date((totalTime - time) * 1000).toISOString().substr(11,8));

            for (let i = 0; i < questions.length; i++) {
                const question = questions[i];
                let quest =  $('#quiz').find(`.answers${i+1}`);
                quest[0].style.color = 'red';
                let container = quest[0];
                let userAnswer = null;
                const selected = $(container).find(`input[name=question${i}]:checked`);
                if (selected.length > 0) {
                    userAnswer = selected[0].value;
                }
                console.log(question.answer);
                if (userAnswer === question.answer) {
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
        MathJax.typeset()
        $('#next').click(nextPage);
        $('#previous').click(previousPage);
    }
    function nextPage(){
        if (currentPage < totalPages){
            for (let q = 1; q < pageSize+1; q++){
                $(`#question${currentPage*5+q}`).hide();
                $(`#image${currentPage*5+q}`).hide();
                $(`#answers${currentPage*5+q}`).hide();
            }
            currentPage++;
            for (let q = 1; q < pageSize+1; q++){
                $(`#question${currentPage*5+q}`).show();
                $(`#image${currentPage*5+q}`).show();
                $(`#answers${currentPage*5+q}`).show();
            }
        }
    }
    function previousPage(){
        if (currentPage > 0){
            for (let q = 1; q < pageSize+1; q++){
                $(`#question${currentPage*5+q}`).hide();
                $(`#image${currentPage*5+q}`).hide();
                $(`#answers${currentPage*5+q}`).hide();
            }
            currentPage--;
            for (let q = 1; q < pageSize+1; q++){
                $(`#question${currentPage*5+q}`).show();
                $(`#image${currentPage*5+q}`).show();
                $(`#answers${currentPage*5+q}`).show();
            }
        }
    }

    function getQuestions(callback) {
        const url = 'https://script.google.com/macros/s/AKfycbwoTxPRGLrIFBhwZCHVl4sqE9mVwDdB6znxXbmDztzD6-bmU8Ct/exec';
        $.ajax({
            url: url,
            method: "GET",
            dataType: "json"
        })
        .done(function(data) {
            callback(data.questions);
        });
    }
    
    getQuestions(setup);

})();
