const startBtn=document.getElementById("startBtn");
const backBtn=document.getElementById("backBtn");

const home=document.getElementById("startPage");
const cameraPage=document.getElementById("cameraPage");

startBtn.onclick=()=>{

    home.style.display="none";

    cameraPage.style.display="block";

    startCamera();

}

backBtn.onclick=()=>{

    stopCamera();

    cameraPage.style.display="none";

    home.style.display="block";

}