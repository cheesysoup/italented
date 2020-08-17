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
            let question = questions[i];
            let answers = ``;
            let j = 0;
            for (answer in question.answers) {
                answers += 
                    `<label id="question${i}answer${j}" style="margin-top:8px;" class="radioButtons">
                        <input type="radio" name="question${i}" value="${answer}">
                        ${answer}: ${question.answers[answer]}
                    </label>`;
                j++;
            }
            quiz +=
                `<div class="question" id="question${i}"> ${i + 1}. ${question.question} </div>
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
            `<div id="shortAnswerLabel${questionNumber}">
                <input type="text" class="shortAnswersBoxes" name="shortAnswers${questionNumber}">
            </div>`;

        shortAnswersQuiz += 
            `<div class="shortAnswerQuestions id="shortAnswerQuestion${questionNumber}" name="answerBox${questionNumber}"> ${questionNumber+numOfMult+1}. ${shortAnswerQuestions[questionNumber].question} </div>
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
            // lock short answer boxes
            document.getElementsByName(`shortAnswers${i}`)[0].disabled = true;

           let answer = allShortAnswers[i];

           const rect = document.getElementById(`shortAnswerLabel${i}`);
           const questionText = document.getElementsByName(`answerBox${i}`)[0];
           
            //change colors of short answer boxes and question text
           for (let j = 0; j < shortAnswerQuestions[i].correctAnswer.length; j++) {
               rect.style.width = "330px";
               rect.style.height = "50px";
           
               if (answer === shortAnswerQuestions[i].correctAnswer[j]) {
                   numCorrect ++;
                   rect.style.backgroundColor = 'rgb(121, 203, 69, .5)';
                   
                   break;
               } else if (answer === '') {
                   numBlank++;
                   rect.style.backgroundColor = 'rgb(255, 210, 49, .5)';
                   questionText.style.color = "red";
                   break;
               } else {
                   if (j === shortAnswerQuestions[i].correctAnswer.length-1) {
                        alreadyWrong = true;
                        numWrong++;
                        rect.style.backgroundColor = 'rgb(217, 60, 33, 0.5)';
                        questionText.style.color = "red";
                   }
               }
           }
       }

       let results = [numCorrect,numBlank,numWrong];
       return results;
   } 
   
    // show results
    function showResults() {
        let numCorrect = 0;
        let numBlank = 0;
        let answerContainers = $('#quiz').find('.answers');

        const submitButton = document.getElementById("submit");
        submitButton.style.display = "none";

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            let container = answerContainers[i];
            let userAnswer = null;
            const selected = $(container).find(`input[name=question${i}]:checked`);
            const questionText = document.getElementById(`question${i}`);

            //find num of selected answer choice
            let selectedNum = null;
            if (selected.length > 0) {
                selectedNum = selected[0].value.charCodeAt(0)-97;
            }       

            //get and style correctAnswerBox (cab)
            const correctAnswerNum = questions[i].correctAnswer.charCodeAt(0)-97;
            const cab = document.getElementById(`question${i}answer${correctAnswerNum}`);
            cab.style.display = "inline-block";
            cab.style.paddingRight = "20px"; 
            cab.style.paddingTop = "5px";
            cab.style.paddingBottom = "5px";         

            // lock radio buttons
            for (let j = 0; j < Object.keys(question.answers).length; j++) {
                document.getElementsByName(`question${i}`)[j].disabled = true;
            }

            // color the correct/selected answers
            if (selected.length > 0) {
                userAnswer = selected[0].value;
            }
            if (userAnswer === question.correctAnswer) {
                numCorrect++;
                cab.style.backgroundColor = "rgb(121, 203, 69, .5)";
            
            } else if (userAnswer === null) {
                numBlank++;
                cab.style.boxShadow = "inset 0px 0px 0px 4px rgb(121, 203, 69, .5";
                cab.boxSizing = "border-box";    
                
                questionText.style.color = 'red';
            } else {
                //style selectedBox
                const sb = document.getElementById(`question${i}answer${selectedNum}`);
                sb.style.paddingRight = "20px"; 
                sb.style.paddingTop = "5px";
                sb.style.paddingBottom = "5px";    
                sb.style.backgroundColor = "rgb(217, 60, 33, 0.5)"

                cab.style.boxShadow = "inset 0px 0px 0px 4px rgb(121, 203, 69, .5";
                cab.boxSizing = "border-box";  

                questionText.style.color = 'red';
            }
        }

        getShortAnswerResults();

        // calculate score
        let shortAnswerResults = getShortAnswerResults();
        let numWrong = questions.length - numCorrect - numBlank + shortAnswerResults[2];
        numCorrect += shortAnswerResults[0];
        numBlank += shortAnswerResults[1];
        let totalPoints = (questions.length+shortAnswerQuestions.length) * correctPoints;
        let score = numCorrect * correctPoints + numBlank * blankPoints + numWrong * wrongPoints;
        $('#results').html(`${numCorrect} correct, ${numBlank} blank, and ${numWrong} wrong<br>Your final score is ${score} out of ${totalPoints} possible points`);

        let percentage = Math.round(score*100/totalPoints);

        makePopupBox(numCorrect,numBlank,numWrong,percentage, score, totalPoints);
    }

    // draws a slice of the wheel
    function drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
    }
 
    var Wheel = function(options) {
        this.options = options;
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.colors = options.colors;

        // make consts
        const c = this.ctx;
        const width = c.canvas.width;
        const height = c.canvas.height;
        const degree = Math.PI/180;
        const checkCircleRadius = 15;
        const checkCircleY = height/2-7.5;
        const checkX = width/2;
        const checkY = checkCircleY+6;
        const margin = 20;
        const percent = this.options.percentage;

        var grd = c.createLinearGradient(0,0,width,0)
        grd.addColorStop(0,"red");
        grd.addColorStop(.5,"yellow");
        grd.addColorStop(1,"green");
 
        this.draw = function() {
            //draw outside arc
            c.beginPath();
            c.arc(width/2,height/2,width/2,180*degree,360*degree);
            c.fillStyle = grd;
            c.fill();

            var total_value = 0;
            var color_index = 0;
            for (var categ in this.options.data) {
                var val = this.options.data[categ];
                total_value += val;
            }
 
            var start_angle = Math.PI;
            for (categ in this.options.data) {
                val = this.options.data[categ];
                var slice_angle = Math.PI * val/total_value;
 
                drawPieSlice(
                    this.ctx,
                    this.canvas.width/2,
                    this.canvas.height/2,
                    Math.min(this.canvas.width/2-margin, this.canvas.height/2-margin),
                    start_angle,
                    start_angle+slice_angle,
                    this.colors[color_index%this.colors.length]
                );
 
                start_angle += slice_angle,
                color_index++;
            }
 
            //draw gray circle over wheel
            if (this.options.smallHoleSize) {
                drawPieSlice(
                    this.ctx,
                    this.canvas.width/2,
                    this.canvas.height/2,
                    this.options.smallHoleSize * Math.min(this.canvas.width/2-margin, this.canvas.height/2-margin),
                    0,
                    2*Math.PI,
                    "rgb(202, 202, 202)"
                );
            }
            
            //write out scores
            const scoreBreakdown = document.getElementById("scoreBreakdown");
            scoreBreakdown.style.marginLeft = (width/2-90)+"px";
            scoreBreakdown.style.marginTop = (height/2-20)+"px";

            const fractionScore = document.getElementById("fractionScore");
            fractionScore.style.marginLeft = (width/2)+"px";
            fractionScore.style.marginTop = (-15)+"px";
 
            //draw triangle for pointer
            c.translate(checkX, checkY);
            c.rotate(degree*percent*.01*180-90*degree);
            c.translate(-checkX, -checkY);
            c.beginPath();
            c.moveTo(checkX-7,checkCircleY+3);
            c.lineTo(checkX+7,checkCircleY+3);
            c.lineTo(checkX, 0);
            c.closePath();

            c.fillStyle = "#000000";
            c.fill();

            c.translate(checkX, checkY);
            c.rotate(360*degree-degree*percent*180*0.01+90*degree);
            c.translate(-checkX, -checkY);

            //draw green check circle
            drawPieSlice(
             c,
             width/2,
             checkCircleY,
             checkCircleRadius,
             0,
             2*Math.PI,
             "#79cb45"
             );
 
             // draw white check
             c.translate(checkX, checkY);
             c.rotate(degree*135);
             c.translate(-checkX, -checkY);
             c.fillStyle = "rgb(255,255,255)";
             c.beginPath();
             c.fillRect(checkX, checkY,3,10);
             c.fillRect(checkX-15, checkY, 15, 3);
             c.stroke();

             c.translate(checkX, checkY);
             c.rotate(degree*225);
             c.translate(-checkX, -checkY);    
        }
    }
 
    // creates the popup score box
    function makePopupBox(numCorrect, numBlank, numWrong, percentage, score, totalPoints) {
        // writes out text
        const bigBox = document.getElementById('popupBox');
        bigBox.style.display = "block";

        const bgBox = document.getElementById('bgBox');
        bgBox.style.display = "block";

        const scoreBreakdown = document.getElementById("scoreBreakdown");
        scoreBreakdown.innerHTML = numCorrect + " correct, " + numBlank + " blank, " + numWrong + " wrong";

        const fractionScore = document.getElementById("fractionScore");
        fractionScore.innerHTML = score + "/" + totalPoints;

        const bigScore = document.getElementById("bigScore");
        bigScore.innerHTML = Math.round(score/totalPoints*100) + "%";

        const viewQuizResults = document.getElementById("viewQuizResults");
        viewQuizResults.style.display = "block";

        // create canvas
        var myCanvas = document.getElementById("myCanvas");
        myCanvas.width = 450;
        myCanvas.height = 450;
        myCanvas.style.left = "40px";
        myCanvas.style.top = "40px";
        myCanvas.style.position = "absolute";

        // set data needed for wheel
        var answerInfo = {
            "right": numCorrect,
            "blank": numBlank,
            "wrong": numWrong
        }

        // draw wheel
        var wheel = new Wheel (
            {
                canvas: myCanvas,
                data: answerInfo,
                colors: ["#79cb45", "#FBEB59", "#d93c21"],
                smallHoleSize: 0.35,
                percentage: percentage
            }
        )
        wheel.draw();
    }

    // gets rid of popup box
    function hidePopupBox() {
        const bgBox = document.getElementById('bgBox');
        bgBox.style.display = "none";
    }
    
    // shows popup box
    function showPopupBox() {
        const bgBox = document.getElementById('bgBox');
        bgBox.style.display = "block";
    }

    //make buttons on popup box clickable
    $('#reviewQuiz').click(hidePopupBox);
    $('#popupX').click(hidePopupBox);
    $('#viewQuizResults').click(showPopupBox);

    // populate components
    buildQuiz();
    $('#submit').click(showResults);

})();    


