function logout() {
    location.href = `../index.html`;
}

function loadQuiz(q) {
    let urlParser = new URLSearchParams(window.location.search);
    let user = urlParser.get('user');
    let pswrd = urlParser.get('pswrd');
    location.href = `test.html?quiz=${q}&user=${user}&pswrd=${pswrd}`;
}

(function() {
    let user = new URLSearchParams(window.location.search).get('user');
    let pswrd = new URLSearchParams(window.location.search).get('pswrd');

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
            const quizzes = o.quizzes;
            let quizButtons = '';
            for (let i = 0; i < quizzes.length; i++) {
                if (quizzes[i] != '') {
                    quizButtons += `<button id="quiz${i + 1}" class="btn" onclick="loadQuiz(${i + 1});">Quiz ${i + 1}</button>`
                }
            }
            $('#quizButtons').html(quizButtons);
        }
    });
})();
