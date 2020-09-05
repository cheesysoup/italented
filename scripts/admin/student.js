function studentDetails(student) {
    $('#admin-portal').hide();
    let details = `
        <span id="exit" onclick="exitStudentDetails();">&leftarrow;</span>
        <div class="header">${student}</div>
        <table>
            <tr><th>Quiz</th><th>Score</th></tr>
    `;
    let data = {};
    data['studentDetails'] = student;
    data['user'] = localStorage.getItem("user");
    data['pswrd'] = localStorage.getItem("pass");
    getUserData(data, o => {
        if (o.correct) {
            for (const row of o.details.slice(1)) {
                details += `<tr onclick="studentQuizDetails('${student}', '${row}');"><td>${row[0]}</td><td>${row[1]}</td></tr>`;
            }
            details += `</table>`;
            $('#student-details').html(details);
            $('#student-details').show();
            localStorage.setItem('student', student);
        } else {
            reset();
        }
    });
}

function studentQuizDetails(student, quiz) {
    quiz = quiz.split(",");
    $('#student-details').hide();
    let details = `
        <span id="exit" onclick="exitStudentQuizDetails();">&leftarrow;</span>
        <div class="header">${student}</div>
        <div id="name">${quiz[0]}</div>
    `;
    $.ajax({
        url: 'https://script.google.com/macros/s/AKfycbwoTxPRGLrIFBhwZCHVl4sqE9mVwDdB6znxXbmDztzD6-bmU8Ct/exec',
        method: "GET",
        dataType: "json",
        data: { "quiz": quiz[0] }
    })
    .done(function(o) {
        const correctPoints = 6;
        const blankPoints = 1.5;
        const wrongPoints = 0;
        let numCorrect = 0;
        let numBlank = 0;
        let numWrong = 0;
        let answers = `
            <div id="student-answers">
        `;
        for (let i = 0; i < o.questions.length; i++) {
            if (quiz[i+3] === o.questions[i].answer) {
                numCorrect++;
            } else if (quiz[i+3] === 'blank') {
                numBlank++;
            } else {
                numWrong++;
            }
            answers += `<div>${i+1}. ${quiz[i+3]}</div>`;
        }
        answers += `</div>`;
        let totalPoints = o.questions.length * correctPoints;
        let score = numCorrect * correctPoints + numBlank * blankPoints + numWrong * wrongPoints;
        details += `<div id="details">${score}/${totalPoints} points<br>${numCorrect} correct, ${numWrong} wrong, ${numBlank} blank</div>`;
        details += answers;
        $('#student-quiz-details').html(details);
        $('#student-quiz-details').show();
    });
}

function exitStudentDetails() {
    adminPortal(localStorage.getItem("user"), localStorage.getItem("pass"));
}

function exitStudentQuizDetails() {
    $('#student-quiz-details').html('');
    $('#student-details').show();
}
