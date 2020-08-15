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
                details += `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`;
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

function exitStudentDetails() {
    adminPortal(localStorage.getItem("user"), localStorage.getItem("pass"));
}
