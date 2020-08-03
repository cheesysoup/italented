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
            console.log(o);
            // const quizNames = o.quizzes[0];
            // const quizzes = o.quizzes[1];
            // let quizButtons = '';
            // for (let i = 0; i < quizzes.length; i++) {
            //     if (quizzes[i] != '') {
            //         quizButtons += `<button id="quiz${i + 1}" class="btn" onclick="loadQuiz(${i + 1});">${quizNames[i]}</button>`;
            //     }
            // }
            // $('#quizButtons').html(quizButtons);
            // $("#loadButtons").hide();
        }
    });
})();
