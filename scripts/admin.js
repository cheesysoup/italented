const url = 'https://script.google.com/macros/s/AKfycbwqvNVeFbXM7mRUniqGfoO-KDfCNn0dpWZH1COiiLh5SPvs9Ig/exec';

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
        url: url,
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
    $('#admin-login-container').hide();
    $('#admin-portal').show();
    localStorage.setItem("user", user);
    localStorage.setItem("pass", pass);

    let data = {};
    data['user'] = user;
    data['pswrd'] = pass;
    data['studentList'] = true;
    $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
        data: data,
        success: function (o) {
            if (o.correct) {
                let list = '';
                for (const student of o.students) {
                    list += `<div>${student[0]} ${student[1]}</div>`;
                }
                $('#student-list').html(list);
            } else {
                reset();
            }
        }
    });
}

function addStudentModal() {
    $('#new-student').show();

    $('#new-student .close').click(() => {
        $('#new-student').hide();
        return;
    })
}

function addStudent() {
    let first = $('#new-student #first').val();
    let last = $('#new-student #last').val();
    let data = {};
    data['First Name'] = first;
    data['Last Name'] = last;
    $.ajax({
        url: url,
        method: "POST",
        dataType: "json",
        data: data,
        success: function (o) {
            $('#new-student').hide();
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
            url: url,
            method: "GET",
            dataType: "json",
            data: data,
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
    $('#admin-login-container').show();
    localStorage.setItem("user", "");
    localStorage.setItem("pass", "");
}
