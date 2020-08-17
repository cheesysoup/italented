function logout() {
    localStorage.setItem("username","");
    localStorage.setItem("password","");
    location.href = `../index.html`;
}

function loadQuiz(q) {
    localStorage.setItem("quiz", q);
    location.href = `test.html`;
}

(function() {
    $("#loadButtons").show();
    let user = localStorage.getItem("username");
    let pswrd = localStorage.getItem("password");

    if (user == "" || pswrd == ""){
        location.href = `../index.html`;
    }

    let data = {};
    data['user'] = user;
    data['pswrd'] = pswrd;
    $.ajax({
        url: 'https://script.google.com/macros/s/AKfycbwqvNVeFbXM7mRUniqGfoO-KDfCNn0dpWZH1COiiLh5SPvs9Ig/exec',
        method: "GET",
        dataType: "json",
        data: data,
        success: function (o) {
            let details = o.details;
            let dashboard = '';
            for (let i = 1; i < details.length; i++) {
                if (details[i] != '') {
                    dashboard += `<button id="quiz${i + 1}" class="btn" onclick="loadQuiz('${details[i][0]}');">${details[i][0]}</button>`;
                }
            }
            $('#quizButtons').html(dashboard);
            $("#loadButtons").hide();
            localStorage.setItem('name', o.student)
        }
    });
})();
