function check(form){
    $("#loadLogin").show();
    const user = form.userid.value;
    const pswrd = form.pswrd.value;

    if (user == '') {
        $("#loadLogin").hide();
        alert("Please enter a username");
        return;
    }

    const userUrl = 'https://script.google.com/macros/s/AKfycbwqvNVeFbXM7mRUniqGfoO-KDfCNn0dpWZH1COiiLh5SPvs9Ig/exec';
    let data = {};
    data['user'] = user;
    data['pswrd'] = pswrd;
    $.ajax({
        url: userUrl,
        method: "GET",
        dataType: "json",
        data: data,
        success: function (o) {
            $("#loadLogin").hide();
            if (o.correct) {
                openDashboard(user, pswrd);
            } else {
                alert("Incorrect username or password");
            }
        }
    });
}

function openDashboard(user, pswrd) {
    location.href = `dashboard.html`;
    localStorage.setItem("username", user);
    localStorage.setItem("password", pswrd);
}

function exit() {
    location.href = '../index.html';
}
