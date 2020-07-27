const userUrl = 'https://script.google.com/macros/s/AKfycbwqvNVeFbXM7mRUniqGfoO-KDfCNn0dpWZH1COiiLh5SPvs9Ig/exec';
const quizUrl = 'https://script.google.com/macros/s/AKfycbz7cE2k_h8VMNbfXTiREI5mc-P9xz6hKo59WVHYfk5y7df4GTP8/exec';

function adminLogin(form){
    const user = form.user.value;
    const pswrd = form.pass.value;
    if (user != 'admin') {
        alert("Incorrect username or password");
        return;
    }
    let data = {};
    data['user'] = user;
    data['pswrd'] = pswrd;
    $.ajax({
        url: userUrl,
        method: "GET",
        dataType: "json",
        data: data,
        success: function (o) {
            if (o.correct) {
                adminPortal(user, pswrd);
            } else {
                alert("Incorrect username or password");
            }
        }
    });
}

function adminPortal(user, pass) {
    $('#quiz-details').html('');
    $('#admin-login-container').hide();
    $('#admin-portal').show();
    localStorage.setItem("user", user);
    localStorage.setItem("pass", pass);

    let data = {};
    data['user'] = user;
    data['pswrd'] = pass;
    data['studentList'] = true;
    data['quizList'] = true;
    $.ajax({
        url: userUrl, method: "GET", dataType: "json", data: data,
        success: function (o) {
            // console.log(o);
            if (o.correct) {
                let students = '';
                for (const student of o.students) {
                    students += `<div>${student[0]} ${student[1]}</div>`;
                }
                $('#student-list').html(students);
            } else {
                reset();
            }
        }
    });
    $.ajax({
        url: quizUrl, method: "GET", dataType: 'json', data: data,
        success: function(o) {
            // console.log(o);
            if (o.correct) {
                let quizzes = '';
                for (const quiz of o.quizzes) {
                    quizzes += `<div onclick="quizDetails('${quiz[0]}');">${quiz[0]}</div>`
                }
                $('#quiz-list').html(quizzes);
            } else {
                reset();
            }
        }
    });
}

function quizDetails(quiz) {
    $('#admin-portal').hide();
    let details = `
        <button class="btn" onclick="exitQuizDetails();">Exit</button>
        <div>${quiz}</div>
        <button class="btn" onclick="addModal('assign-quiz', assignQuizOptions);">Assign To</button>`;
    let data = {};
    data['quizDetails'] = quiz;
    data['user'] = localStorage.getItem("user");
    data['pswrd'] = localStorage.getItem("pass");
    $.ajax({
        url: quizUrl, method: "GET", dataType: 'json', data: data,
        success: function(o) {
            if (o.correct) {
                for (const row of o.details.slice(1)) {
                    details += `<div>${row[0]}</div>`
                }
                $('#quiz-details').html(details);
                $('#quiz-details').show();
                localStorage.setItem('quiz', quiz);
            } else {
                reset();
            }
        }
    });
}

function assignQuizOptions() {
    let data = {};
    data['user'] = localStorage.getItem("user");
    data['pswrd'] = localStorage.getItem("pass");
    data['quizDetails'] = localStorage.getItem('quiz');
    data['studentList'] = true;
    $.ajax({
        url: userUrl, method: "GET", dataType: "json", data: data,
        success: function (o) {
            // console.log(o);
            if (o.correct) {
                let students = o.students;
                $.ajax({
                    url: quizUrl, method: "GET", dataType: 'json', data: data,
                    success: function(o) {
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
                    }
                });
            } else {
                reset();
            }
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
    $.ajax({
        url: quizUrl, method: "POST", dataType: "json", data: data,
        success: function (o) {
            $('#assign-quiz').hide();
        }
    });
}

function exitQuizDetails() {
    adminPortal(localStorage.getItem("user"), localStorage.getItem("pass"));
}

function addModal(id, callback) {
    $(`#${id}`).show();
    $(`#${id} .close`).click(() => {
        $(`#${id}`).hide();
    })
    if (callback) {
        callback();
    }
}

function addStudent() {
    let first = $('#new-student #first').val();
    let last = $('#new-student #last').val();
    let data = {};
    data['user'] = localStorage.getItem("user");
    data['pswrd'] = localStorage.getItem("pass");
    data['First Name'] = first;
    data['Last Name'] = last;
    data['newStudent'] = true;
    $.ajax({
        url: userUrl, method: "POST", dataType: "json", data: data,
        success: function (o) {
            $.ajax({
                url: quizUrl, method: "POST", dataType: "json", data: data,
                success: function (o) {
                    $('#new-student').hide();
                }
            });
        }
    });
}

function addQuiz() {
    let first = $('#new-quiz #quiz-name').val();
    let last = $('#new-quiz #time-limit').val();
    let data = {};
    data['user'] = localStorage.getItem("user");
    data['pswrd'] = localStorage.getItem("pass");
    data['newQuiz'] = true;
    data['Quiz'] = first;
    data['Time Limit'] = last;
    $.ajax({
        url: quizUrl, method: "POST", dataType: "json", data: data,
        success: function (o) {
            $('#new-quiz').hide();
        }
    });
}

(() => {
    $('#new-student').hide();
    $('#admin-login-container').hide();
    $('#admin-portal').hide();

    const user = localStorage.getItem("user");
    const pswrd = localStorage.getItem("pass");
    if (user && pswrd) {
        let data = {};
        data['user'] = user;
        data['pswrd'] = pswrd;
        $.ajax({
            url: userUrl, method: "GET", dataType: "json", data: data,
            success: function (o) {
                if (o.correct) {
                    adminPortal(user, pswrd);
                } else {
                    $('#admin-login-container').show();
                }
            }
        });
    } else {
        $('#admin-login-container').show();
    }
})();

function reset() {
    $('#admin-portal').hide();
    $('#quiz-details').hide();
    $('#admin-login-container').show();
    localStorage.setItem("user", "");
    localStorage.setItem("pass", "");
}
