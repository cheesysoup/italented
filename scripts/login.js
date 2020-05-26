function check(form){
    const user = form.userid.value;
    const pswrd = form.pswrd.value;

    if (user == '') {
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
            if (o.correct) {
                openDashboard(user);
            } else {
                alert("Inncorect username or password");
            }
        }
    });
}

function openDashboard(user) {
    location.href = 'dashboard.html?user=' + user;
}
