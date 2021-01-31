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

(() => {
  $('#navbar').html(`
    <a href="index.html" class="active">ITalented</a>
    <a href="pages/login.html" class="login">Login</a>
    <a href="#">Contact</a>
    <a href="classes.html">Classes</a>
    <a href="about.html">About</a>
    <a href="javascript:void(0);" class="icon" onclick="react()">
      <i class="fa fa-bars"></i>
    </a>
  `);
  $('#footer').html(`
    <div class="footer-content">
      <div class="footer-section pages">
        <div style="color:white; font-size: 32px; font-family: Montserrat, Arial; font-weight:600; text-align:center; width:100%; margin-bottom: 20px;">Pages:</div>
        <div class="footer-pages">
            <div class="footer-section-pages side1" style="align-items: flex-end;">
                <div style="max-width: 120px; padding-right: 40px;">
                    <p href="index.html" class="footer-page-link" onclick="location.href='index.html'">Home</p>
                    <p href="index.html" class="footer-page-link" onclick="location.href='index.html'">About</p>
                    <p href="index.html" class="footer-page-link" onclick="location.href='index.html'">Classes</p>
                </div>
            </div>
            <div class="footer-section-pages side2">
                <div style="padding-left: 40px;">
                    <p href="index.html" class="footer-page-link" onclick="location.href='index.html'">Contact</p>
                    <p href="index.html" class="footer-page-link" onclick="location.href='index.html'">Login</p>
                </div>
            </div>
        </div>
    </div>
    <div class="footer-section contacts">
        <div class="contact-container">
            <div style="color:white; font-size: 32px; font-family: Montserrat, Arial; font-weight: 600; text-align:center; width:100%; margin-bottom: 20px;">Contact Us At:</div>
            <div class="footer-contacts">
                <div>
                    <p class="footer-page-link" style="text-align: center;">Email: info@italented.org</p>
                    <p class="footer-page-link" style="text-align: center;">Phone: (408) 899-9395</p>
                </div>                            
            </div>
        </div>
    </div>
  </div>
  <div class="footer-bottom">
    Institute for Talented LLC. All rights reserved.
  </div>
  `)
})();
