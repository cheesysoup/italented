function check(form){
    $("#loadLogin").show();
    const user = form.userid.value;
    const pswrd = form.pswrd.value;

    if (user == '') {
        $("#loadLogin").hide();
        alert("Please enter a username");
        return;
    }

    const url = 'https://script.google.com/macros/s/AKfycbyac8xl_AXEjl4OIgFwNGvToDNRf7kWwsl3HO0YNBSvwsjMeSY/exec';
    let data = {};
    data['user'] = user;
    data['pswrd'] = pswrd;
    $.ajax({
        url: url,
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
