function studentDetails(student) {
    $('#admin-portal').hide();
    let details = `
        <button class="btn" onclick="exitStudentDetails();">Exit</button>
        <div>${student}</div>`;
    let data = {};
    data['studentDetails'] = student;
    data['user'] = localStorage.getItem("user");
    data['pswrd'] = localStorage.getItem("pass");
    getUserData(data, o => {
        if (o.correct) {
            for (const row of o.details.slice(1)) {
                details += `<div>${row[0]}</div>`
            }
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
