function login() {
  location.href = `pages/login.html`;
}

function react() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
    $('#login2').show;
  } else {
    x.className = "topnav";
  }
}
