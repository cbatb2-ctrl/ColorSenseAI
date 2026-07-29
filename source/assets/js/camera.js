// ==========================================
// ColorSense AI Classroom
// camera.js
// FINAL VERSION
// Part 1
// ==========================================

// ---------- Video ----------
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", {
    willReadFrequently: true
});

// ---------- Preview ----------
const previewColor = document.getElementById("previewColor");

const rValue = document.getElementById("rValue");
const gValue = document.getElementById("gValue");
const bValue = document.getElementById("bValue");

// ---------- Reference ----------
const referenceBox =
document.getElementById("referenceColor");

const referenceText =
document.getElementById("referenceRGB");

const saveBtn =
document.getElementById("saveReference");
const recordBtn =
document.getElementById("recordAttempt");

// ---------- Result ----------
const similarityValue =
document.getElementById("similarityValue");

const resultText =
document.getElementById("resultText");
const attemptNo =
document.getElementById("attemptNo");

const attemptStatus =
document.getElementById("attemptStatus");

// ---------- Send ----------
const submitBtn =
document.getElementById("submitScore");

// ---------- Google Apps Script ----------
const API_URL =
"https://script.google.com/macros/s/AKfycbzElmsd4rp9XGlBlAb1Fw3QxprvHzuP34dmObKe5Dz_8TjjWO2w3RoSRQgzmVILDpb2/exec";

// ---------- Variables ----------
let stream = null;
let scanInterval = null;

let currentR = 0;
let currentG = 0;
let currentB = 0;

let referenceColor = null;

// ==========================================
// Sprint 6 : Best Score System
// ==========================================

// ทดลองครั้งที่เท่าไร
let attempt = 1;

// คะแนนแต่ละครั้ง
let score1 = null;
let score2 = null;
let score3 = null;

// คะแนนดีที่สุด
let bestScore = 0;

// RGB ของคะแนนที่ดีที่สุด
let bestRGB = null;

// ส่งคะแนนแล้วหรือยัง
let submitted = false;
// ==========================================
// อัปเดตสถานะการทดลอง
// ==========================================

function updateAttemptUI(){

    attemptNo.textContent = attempt;

    const remain = 3 - attempt;

    if(remain > 0){

        attemptStatus.textContent =
        `เหลืออีก ${remain} ครั้ง`;

    }

    else{

        attemptStatus.textContent =
        "ทดลองครบแล้ว";

    }

}

// ==========================================
// เปิดกล้อง
// ==========================================

async function startCamera(){

    try{

        stream =
        await navigator.mediaDevices.getUserMedia({

            video:{
                facingMode:"environment"
            }

        });

        video.srcObject = stream;

        video.onloadedmetadata = ()=>{

            video.play();

            canvas.width =
            video.videoWidth;

            canvas.height =
            video.videoHeight;

            console.log("✅ Camera Ready");

            startColorReader();
            updateAttemptUI();
            submitBtn.disabled = true;
            recordBtn.disabled = true;

        };

    }

    catch(error){

        console.error(error);

        alert("❌ ไม่สามารถเปิดกล้องได้");

    }

}


// ==========================================
// ปิดกล้อง
// ==========================================

function stopCamera(){

    if(scanInterval){

        clearInterval(scanInterval);

    }

    if(stream){

        stream.getTracks().forEach(track=>{

            track.stop();

        });

    }

}


// ==========================================
// เริ่มอ่านสี
// ==========================================

function startColorReader(){

    scanInterval = setInterval(()=>{

        readCenterPixel();

    },100);

}// ==========================================
// อ่าน Pixel ตรงกลาง
// ==========================================

function readCenterPixel(){

    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    const centerX = Math.floor(canvas.width / 2);
    const centerY = Math.floor(canvas.height / 2);

    const sampleSize = 41;
    const half = Math.floor(sampleSize / 2);

    let totalR = 0;
    let totalG = 0;
    let totalB = 0;
    let count = 0;

    for(let y=centerY-half; y<=centerY+half; y++){

        for(let x=centerX-half; x<=centerX+half; x++){

            const pixel =
            ctx.getImageData(x,y,1,1).data;

            totalR += pixel[0];
            totalG += pixel[1];
            totalB += pixel[2];

            count++;

        }

    }

    currentR = Math.round(totalR/count);
    currentG = Math.round(totalG/count);
    currentB = Math.round(totalB/count);

    rValue.textContent = currentR;
    gValue.textContent = currentG;
    bValue.textContent = currentB;

    previewColor.style.background =
    `rgb(${currentR},${currentG},${currentB})`;

    calculateSimilarity();

}



// ==========================================
// ตั้งสีต้นแบบ
// ==========================================

saveBtn.addEventListener("click",()=>{

    referenceColor={

        r:currentR,
        g:currentG,
        b:currentB

    };

    referenceBox.style.background=
    `rgb(${currentR},${currentG},${currentB})`;

    referenceText.innerHTML=`

        R : ${currentR}<br>
        G : ${currentG}<br>
        B : ${currentB}

    `;

    console.log("✅ ตั้งสีต้นแบบแล้ว", referenceColor);
    recordBtn.disabled = false;

});
// ==========================================
// คำนวณเปอร์เซ็นต์ความเหมือน
// ==========================================

function calculateSimilarity(){

    // ยังไม่ได้ตั้งสีต้นแบบ
    if(referenceColor==null){

        similarityValue.textContent="0.00%";
        resultText.textContent="ยังไม่ได้ตั้งสีต้นแบบ";

        return;

    }

    // คำนวณระยะห่างของ RGB

    const distance = Math.sqrt(

        Math.pow(currentR-referenceColor.r,2)+
        Math.pow(currentG-referenceColor.g,2)+
        Math.pow(currentB-referenceColor.b,2)

    );

    const maxDistance = Math.sqrt(

        255*255+
        255*255+
        255*255

    );

    let similarity =
    100-((distance/maxDistance)*100);

    if(similarity<0){

        similarity=0;

    }

    similarityValue.textContent=
    similarity.toFixed(2)+"%";

    // ---------- ผลการประเมิน ----------

    if(similarity>=95){

        resultText.textContent="🟢 ดีมาก";

    }

    else if(similarity>=85){

        resultText.textContent="🟡 ดี";

    }

    else if(similarity>=70){

        resultText.textContent="🟠 พอใช้";

    }

    else{

        resultText.textContent="🔴 ควรปรับปรุง";

    }

}
// ==========================================
// บันทึกคะแนนการทดลอง
// ==========================================

function saveAttempt(){

    const score =
    parseFloat(similarityValue.textContent);

    if(attempt === 1){

        score1 = score;

    }

    else if(attempt === 2){

        score2 = score;

    }

    else if(attempt === 3){

        score3 = score;

    }

    // อัปเดตคะแนนดีที่สุด

    if(score > bestScore){

        bestScore = score;

        bestRGB = {

            r: currentR,
            g: currentG,
            b: currentB

        };

    }

    console.log("Attempt :", attempt);

    console.log("Best :", bestScore);

}
// ==========================================
// บันทึกผลการทดลอง
// ==========================================

recordBtn.addEventListener("click",()=>{

    // บันทึกคะแนนรอบปัจจุบัน
saveAttempt();

if (attempt < 3) {

    attempt++;

    updateAttemptUI();

    // แจ้งสถานะบนหน้าเว็บ (เดี๋ยวเราจะเปลี่ยนเป็น Status Box)
    alert(
        `✅ บันทึกผลการทดลองครั้งที่ ${attempt - 1} แล้ว\n\n` +
        `คะแนนดีที่สุดปัจจุบัน : ${bestScore.toFixed(2)}%`
    );

}
else {

    updateAttemptUI();

    recordBtn.disabled = true;

    submitBtn.disabled = false;

    alert(
        `🏆 ทดลองครบ 3 ครั้งแล้ว\n\n` +
        `Best Score : ${bestScore.toFixed(2)}%\n\n` +
        `สามารถกดส่งคะแนนได้`
    );

}

});
// ==========================================
// ส่งคะแนนเข้า Google Sheets
// ==========================================

submitBtn.addEventListener("click", async () => {
    if(attempt < 3){

    alert("กรุณาทดลองให้ครบ 3 ครั้งก่อน");

    return;

}

    if(referenceColor == null){

        alert("กรุณาตั้งสีต้นแบบก่อน");
        return;

    }

    const formData = new URLSearchParams();

    formData.append("name",
        document.getElementById("studentName").value);

    formData.append("number",
        document.getElementById("studentNo").value);

    formData.append("classroom",
        document.getElementById("studentRoom").value);

    formData.append("r", currentR);
    formData.append("g", currentG);
    formData.append("b", currentB);

    formData.append("similarity",
        similarityValue.textContent);

    formData.append("result",
        resultText.textContent);

    formData.append("referenceR",
        referenceColor.r);

    formData.append("referenceG",
        referenceColor.g);

    formData.append("referenceB",
        referenceColor.b);

    try {

    await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData
    });

    // แสดงข้อความหลังส่งสำเร็จ
    alert(
`🎉 ส่งคะแนนเรียบร้อย

👤 ชื่อ : ${document.getElementById("studentName").value}

🏫 ห้อง : ${document.getElementById("studentRoom").value}
🔢 เลขที่ : ${document.getElementById("studentNo").value}

🎨 ความเหมือนของสี : ${similarityValue.textContent}

${resultText.textContent}

📅 บันทึกลง Google Sheets แล้ว`
    );

    // ป้องกันการกดส่งซ้ำ
    submitBtn.disabled = true;
    submitBtn.textContent = "✔ ส่งแล้ว";
    submitBtn.style.backgroundColor = "#28a745";
    submitBtn.style.cursor = "not-allowed";

}
catch(error){

    console.error(error);

    alert("❌ ไม่สามารถเชื่อมต่อ Google Sheets ได้");

}
});