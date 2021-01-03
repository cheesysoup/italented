function quizDetails(quiz) {
    $('#admin-portal').hide();
    let details = `
        <span id="exit" onclick="exitQuizDetails();">&leftarrow;</span>
        <div class="header">${quiz}<button class="btn" onclick="addModal('assign-quiz', assignQuizOptions);">Assign To</button></div>
        <table>
            <tr><th>Name</th><th>Score</th><th>Time Limit</th></tr>
    `;
    let data = {};
    data['quizDetails'] = quiz;
    data['user'] = localStorage.getItem("user");
    data['pswrd'] = localStorage.getItem("pass");
    getQuizData(data, o => {
        if (o.correct) {
            for (const row of o.details.slice(1)) {
                details += `<tr><td>${row[0]}</td><td>${row[3]}</td><td>${row[1]}</td></tr>`;
            }
            details += `</table>`;
            $('#quiz-details').html(details);
            $('#quiz-details').show();
            localStorage.setItem('quiz', quiz);
        } else {
            reset();
        }
    });
}

function assignQuizOptions() {
    let data = {};
    data['user'] = localStorage.getItem("user");
    data['pswrd'] = localStorage.getItem("pass");
    data['quizDetails'] = localStorage.getItem('quiz');
    data['studentList'] = true;
    getUserData(data, o => {
        if (o.correct) {
            let students = o.students;
            getQuizData(data, o => {
                if (o.correct) {
                    for (const row of o.details.slice(1)) {
                        for (let i = 0; i < students.length; i++) {
                            if (students[i][0] + " " + students[i][1] == row[0]) {
                                students.splice(i, 1);
                            }
                        }
                    }
                    let options = ``;
                    for (const student of students) {
                        options += `
                            <input type="checkbox" name="student" value="${student[0]} ${student[1]}">
                            <label>${student[0]} ${student[1]}</label><br>`;
                    }
                    $('#assign-quiz-students').html(options);
                } else {
                    reset();
                }
            });
        } else {
            reset();
        }
    });
}

function assignQuiz() {
    let checked = $('#assign-quiz-students').find(`input[name=student]:checked`);
    let data = {};
    data['user'] = localStorage.getItem("user");
    data['pswrd'] = localStorage.getItem("pass");
    data['quizAssign'] = localStorage.getItem('quiz');
    data['students'] = [];
    for (const c of checked) {
        let student = {};
        student['Name'] = c.value;
        data['students'].push(student);
    }
    data['time'] = $('#time-limit').val();
    postQuizData(data, o => postUserData(data, o => $('#assign-quiz').hide()));
}

function exitQuizDetails() {
    adminPortal(localStorage.getItem("user"), localStorage.getItem("pass"));
}
