function check(form){
    if(form.userid.value == "italented" && form.pswrd.value == "italented"){
        window.open('test.html')
    }else{
        alert("Inncorect username or password")
    }
}