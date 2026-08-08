// =============================================
// ColorSense AI Classroom
// Version 4.0 Professional (Clean)
// Part 1
// =============================================

console.log("ColorSense AI V4.0 Clean");

// =============================================
// DOM
// =============================================

// ---------- Camera ----------

const video =
document.getElementById("video");

const canvas =
document.getElementById("canvas");

const ctx =
canvas.getContext("2d",{
    willReadFrequently:true
});

// ---------- Preview ----------

const previewColor =
document.getElementById("previewColor");

const rValue =
document.getElementById("rValue");

const gValue =
document.getElementById("gValue");

const bValue =
document.getElementById("bValue");

// ---------- Reference ----------

const referenceBox =
document.getElementById("referenceColor");

const referenceText =
document.getElementById("referenceRGB");

const saveBtn =
document.getElementById("saveReference");

// ---------- Attempt ----------

const recordBtn =
document.getElementById("recordAttempt");

const attemptNo =
document.getElementById("attemptNo");

const attemptStatus =
document.getElementById("attemptStatus");

// ---------- Result ----------

const similarityValue =
document.getElementById("similarityValue");

const resultText =
document.getElementById("resultText");

// ---------- Submit ----------

const submitBtn =
document.getElementById("submitScore");

// ==========================================
// Google Apps Script URL
// ==========================================

const API_URL =
"https://script.google.com/macros/s/AKfycbzElmsd4rp9XGlBlAb1Fw3QxprvHzuP34dmObKe5Dz_8TjjWO2w3RoSRQgzmVILDpb2/exec";

// =============================================
// Runtime Variables
// =============================================

let stream = null;

let scanInterval = null;

let scanStopped = false;

// RGB ปัจจุบัน

let currentR = 0;
let currentG = 0;
let currentB = 0;

// สีต้นแบบ

let referenceColor = null;

// Attempt

let attempt = 0;

// คะแนน

let score1 = null;
let score2 = null;
let score3 = null;

let bestScore = 0;

let bestRGB = null;
// ==========================================
// RGB ของแต่ละรอบ
// ==========================================

let rgbAttempt1 = null;
let rgbAttempt2 = null;
let rgbAttempt3 = null;

// ส่งคะแนนแล้ว

let submitted = false;
// =============================================
// Camera Module
// =============================================

async function startCamera(){

    try{

        stream = await navigator.mediaDevices.getUserMedia({

            video:{
                facingMode:"environment"
            },

            audio:false

        });

        video.srcObject = stream;

        video.onloadedmetadata = ()=>{

            console.log("✅ Camera Ready");

            submitBtn.disabled = true;
            recordBtn.disabled = true;

            scanStopped = false;

            startColorReader();

            updateAttemptUI();

        };

    }

    catch(error){

        console.error(error);

        alert("❌ ไม่สามารถเปิดกล้องได้");

    }

}

// =============================================

function stopCamera(){

    if(scanInterval){

        clearInterval(scanInterval);

        scanInterval = null;

    }

    if(stream){

        stream.getTracks().forEach(track=>{

            track.stop();

        });

        stream = null;

    }

}

// =============================================

function startColorReader(){

    scanInterval = setInterval(()=>{

        if(scanStopped){

            return;

        }

        readCenterPixel();

    },100);

}
// =============================================
// Temporary Functions
// (จะเขียนจริงใน Part ถัดไป)
// =============================================

function updateAttemptUI(){

    attemptNo.textContent = attempt;

    attemptStatus.textContent =
    `เหลืออีก ${3-attempt} ครั้ง`;

}
// =============================================
// RGB Engine
// =============================================

function readCenterPixel(){

    if(scanStopped) return;

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

    currentR = Math.round(totalR / count);
    currentG = Math.round(totalG / count);
    currentB = Math.round(totalB / count);
        rValue.textContent = currentR;
    gValue.textContent = currentG;
    bValue.textContent = currentB;

    previewColor.style.background =

        `rgb(${currentR},${currentG},${currentB})`;
        calculateSimilarity();

}
// =============================================
// Reference Color
// =============================================

saveBtn.addEventListener("click",()=>{

    referenceColor={

        r:currentR,
        g:currentG,
        b:currentB

    };

    referenceBox.style.background=

        `rgb(${currentR},${currentG},${currentB})`;

    referenceText.innerHTML=

        `R : ${currentR}<br>
         G : ${currentG}<br>
         B : ${currentB}`;

    recordBtn.disabled=false;

    console.log("🎯 Reference Saved",referenceColor);

});
// =============================================
// Similarity Engine
// =============================================

function calculateSimilarity(){

    if(referenceColor==null){

        similarityValue.textContent="0.00%";

        resultText.textContent=
        "ยังไม่ได้ตั้งสีต้นแบบ";

        return;

    }

    const distance=Math.sqrt(

        Math.pow(currentR-referenceColor.r,2)+
        Math.pow(currentG-referenceColor.g,2)+
        Math.pow(currentB-referenceColor.b,2)

    );

    const maxDistance=Math.sqrt(

        255*255+
        255*255+
        255*255

    );

    let similarity=

    100-((distance/maxDistance)*100);

    if(similarity<0){

        similarity=0;

    }

    similarityValue.textContent=

        similarity.toFixed(2)+"%";
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
// =============================================
// Attempt Engine
// Part 5 STEP 1
// =============================================

function saveAttempt(){

    const score = parseFloat(
        similarityValue.textContent
    );

    switch(attempt){

    case 0:

        score1 = score;

        rgbAttempt1 = {

            r: currentR,
            g: currentG,
            b: currentB

        };

        break;

    case 1:

        score2 = score;

        rgbAttempt2 = {

            r: currentR,
            g: currentG,
            b: currentB

        };

        break;

    case 2:

        score3 = score;

        rgbAttempt3 = {

            r: currentR,
            g: currentG,
            b: currentB

        };

        break;

}

    if(score > bestScore){

        bestScore = score;

        bestRGB = {

            r: currentR,
            g: currentG,
            b: currentB

        };

    }

    console.log("Best Score :",bestScore);

}
// =============================================

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
// =============================================
// Record Attempt
// Part 5 STEP 2
// =============================================

recordBtn.addEventListener("click",()=>{

    // ป้องกันการกดเกิน
    if(attempt >= 3){

        return;

    }

    // บันทึกคะแนนรอบปัจจุบัน
    saveAttempt();
    // ==========================================
// AI Coach
// ==========================================

if(attempt === 0){

    updateAICoach(
        rgbAttempt1,
        referenceColor,
        score1,
        1
    );

}
else if(attempt === 1){

    updateAICoach(
        rgbAttempt2,
        referenceColor,
        score2,
        2
    );

}
else if(attempt === 2){

    updateAICoach(
        rgbAttempt3,
        referenceColor,
        score3,
        3
    );

}
else if(attempt === 2){

    updateAICoach(
        rgbAttempt3,
        referenceColor,
        score3,
        3
    );

}
    // เพิ่มจำนวนครั้ง
    attempt++;

    // อัปเดตหน้าจอ
    updateAttemptUI();

    // แสดงคะแนนที่ดีที่สุดปัจจุบัน
    alert(

        `✅ บันทึกผลการทดลองครั้งที่ ${attempt}\n\n` +

        `คะแนนดีที่สุด : ${bestScore.toFixed(2)}%`

    );

    // ถ้าครบ 3 ครั้ง
    if(attempt >= 3){

        scanStopped = true;

        stopCamera();

        recordBtn.disabled = true;

        submitBtn.disabled = false;

        similarityValue.classList.add("locked");

        resultText.textContent =

        "🏁 สิ้นสุดการทดลอง";

        alert(

            `🎉 ทดลองครบ 3 ครั้งแล้ว\n\n` +

            `Best Score : ${bestScore.toFixed(2)}%\n\n` +

            `สามารถกดส่งคะแนนได้`

        );

    }

});
// =============================================
// Submit Engine
// Part 6 STEP 1
// =============================================

submitBtn.addEventListener("click", async ()=>{

    // ต้องทดลองครบก่อน
    if(attempt < 3){

        alert("กรุณาทดลองให้ครบ 3 ครั้งก่อน");

        return;

    }

    // ต้องตั้งสีต้นแบบก่อน
    if(referenceColor == null){

        alert("กรุณาตั้งสีต้นแบบก่อน");

        return;

    }

    alert("✅ Submit Engine ทำงานแล้ว");
    // ===============================
// เตรียมข้อมูลสำหรับส่ง
// ===============================

const formData = new URLSearchParams();

formData.append(
    "name",
    document.getElementById("studentName").value
);

formData.append(
    "number",
    document.getElementById("studentNo").value
);

formData.append(
    "classroom",
    document.getElementById("studentRoom").value
);

formData.append("r", currentR);
formData.append("g", currentG);
formData.append("b", currentB);

formData.append(
    "similarity",
    bestScore.toFixed(2)
);

formData.append(
    "result",
    resultText.textContent
);

formData.append(
    "referenceR",
    referenceColor.r
);

formData.append(
    "referenceG",
    referenceColor.g
);

formData.append(
    "referenceB",
    referenceColor.b
);

try{

    await fetch(API_URL,{

        method:"POST",
        mode:"no-cors",
        body:formData

    });

    alert(

`🎉 ส่งคะแนนเรียบร้อย

👤 ${document.getElementById("studentName").value}

🎯 Best Score : ${bestScore.toFixed(2)}%

📊 Attempt

1 : ${score1}
2 : ${score2}
3 : ${score3}

บันทึกลง Google Sheets แล้ว`

    );

    submitBtn.disabled = true;
    submitBtn.textContent = "✔ ส่งแล้ว";
    submitBtn.style.background = "#28a745";

}
catch(error){

    console.error(error);

    alert(error);

}

});
