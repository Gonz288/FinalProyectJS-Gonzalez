const btnSwitch = document.getElementById("switch");

let darkmode = JSON.parse(localStorage.getItem("darkmode"));

if(darkmode == true){
    document.body.classList.toggle('dark');
    btnSwitch.classList.toggle('active');
}

btnSwitch.addEventListener('click',()=>{
    document.body.classList.toggle('dark');
    btnSwitch.classList.toggle('active');
    localStorage.setItem("darkmode", JSON.stringify(true));
    if(btnSwitch.classList.contains('active') == false){
        localStorage.setItem("darkmode", JSON.stringify(false));
    }
});
