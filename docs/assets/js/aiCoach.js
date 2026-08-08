// ==========================================
// ColorSense AI Teacher
// Version 5.0
// ==========================================

const aiCoachMessage =
document.getElementById("aiCoachMessage");


// ==========================================
// AI Coach Engine
// ==========================================

function updateAICoach(
    rgb,
    reference,
    similarity,
    attempt
){

    // --------------------------------------
    // ตรวจสอบข้อมูล
    // --------------------------------------

    if(!rgb || !reference){

        aiCoachMessage.textContent =
        "รอการทดลองครั้งที่ 1...";

        return;

    }


    // ======================================
    // เริ่มสร้างข้อความ
    // ======================================

    let message =
    "🤖 AI ครูสอนผสมสี\n\n";


    message +=
    `ผลการทดลองครั้งที่ ${attempt}\n\n`;


    message +=
    `🏆 คะแนน : ${similarity.toFixed(2)}%\n\n`;


    // ======================================
    // RGB ต้นแบบ
    // ======================================

    message +=
    "🎯 RGB ต้นแบบ\n";

    message +=
    `${reference.r} | ${reference.g} | ${reference.b}\n\n`;


    // ======================================
    // RGB นักเรียน
    // ======================================

    message +=
    "🎨 RGB ของนักเรียน\n";

    message +=
    `${rgb.r} | ${rgb.g} | ${rgb.b}\n\n`;


    // ======================================
    // คำนวณความแตกต่าง RGB
    // ======================================

    const dR =
    rgb.r - reference.r;

    const dG =
    rgb.g - reference.g;

    const dB =
    rgb.b - reference.b;


    const absR =
    Math.abs(dR);

    const absG =
    Math.abs(dG);

    const absB =
    Math.abs(dB);


    const averageDifference =
    (absR + absG + absB) / 3;


    // ======================================
    // วิเคราะห์ความสว่าง
    // ======================================

    const studentBrightness =
    (rgb.r + rgb.g + rgb.b) / 3;


    const referenceBrightness =
    (reference.r +
     reference.g +
     reference.b) / 3;


    const brightnessDifference =
    studentBrightness -
    referenceBrightness;


    // ======================================
    // วิเคราะห์สี
    // ======================================

    let hasAdvice = false;


    // --------------------------------------
    // สีใกล้เคียงมาก
    // --------------------------------------

    if(
        averageDifference <= 3 &&
        similarity >= 95
    ){

        message +=
        "🎉 สีใกล้เคียงต้นแบบมาก\n\n";

        message +=
        "✅ ยังไม่จำเป็นต้องเติมสีเพิ่มเติม\n";

        message +=
        "⭐ สามารถนำสีไปใช้งานได้\n";

    }

    else{

        message +=
        "🔎 วิเคราะห์สี\n\n";


        // ==================================
        // สีเข้มเกินไป
        // ==================================

        if(brightnessDifference < -5){

            let whitePercent =
            Math.round(
                Math.abs(brightnessDifference) * 0.8
            );


            // จำกัดคำแนะนำ
            if(whitePercent < 5){

                whitePercent = 5;

            }


            if(whitePercent > 15){

                whitePercent = 15;

            }


            message +=
            "🌑 สีเข้มเกินไป\n";


            message +=
            `➕ แนะนำเติมสีขาวประมาณ ${whitePercent}%\n\n`;


            hasAdvice = true;

        }


        // ==================================
        // สีสว่างเกินไป
        // ==================================

        else if(brightnessDifference > 5){

            message +=
            "☀️ สีสว่างเกินไป\n";


            message +=
            "➕ แนะนำเติมสีเข้มของสีต้นแบบเล็กน้อย\n\n";


            hasAdvice = true;

        }


        // ==================================
        // สีแดง
        // ==================================

        if(dR > 5){

            message +=
            "🔴 สีแดงมากเกินไป\n";


            message +=
            "➖ ลดปริมาณสีแดงลงเล็กน้อย\n\n";


            hasAdvice = true;

        }

        else if(dR < -5){

            message +=
            "🔴 สีแดงน้อยเกินไป\n";


            const percent =
            Math.min(
                10,
                Math.max(
                    2,
                    Math.round(absR / 2)
                )
            );


            message +=
            `➕ แนะนำเติมสีแดงประมาณ ${percent}%\n\n`;


            hasAdvice = true;

        }


        // ==================================
        // สีเขียว
        // ==================================

        if(dG > 5){

            message +=
            "🟢 สีเขียวมากเกินไป\n";


            message +=
            "➖ ลดปริมาณสีเขียวลงเล็กน้อย\n\n";


            hasAdvice = true;

        }

        else if(dG < -5){

            message +=
            "🟢 สีเขียวน้อยเกินไป\n";


            const percent =
            Math.min(
                10,
                Math.max(
                    2,
                    Math.round(absG / 2)
                )
            );


            message +=
            `➕ แนะนำเติมสีเขียวประมาณ ${percent}%\n\n`;


            hasAdvice = true;

        }


        // ==================================
        // สีน้ำเงิน
        // ==================================

        if(dB > 5){

            message +=
            "🔵 สีน้ำเงินมากเกินไป\n";


            message +=
            "➖ ลดปริมาณสีน้ำเงินลงเล็กน้อย\n\n";


            hasAdvice = true;

        }

        else if(dB < -5){

            message +=
            "🔵 สีน้ำเงินน้อยเกินไป\n";


            const percent =
            Math.min(
                10,
                Math.max(
                    2,
                    Math.round(absB / 2)
                )
            );


            message +=
            `➕ แนะนำเติมสีน้ำเงินประมาณ ${percent}%\n\n`;


            hasAdvice = true;

        }


        // ==================================
        // ถ้ายังไม่มีคำแนะนำ
        // ==================================

        if(!hasAdvice){

            message +=
            "🎨 สีใกล้เคียงต้นแบบแล้ว\n";


            message +=
            "💡 ปรับสีเพียงเล็กน้อยแล้วทดลองใหม่\n\n";

        }


        // ==================================
        // คำแนะนำตามคะแนน
        // ==================================

        message +=
        "🧪 คำแนะนำในการทดลอง\n";


        if(similarity < 70){

            message +=
            "🔄 สีแตกต่างจากต้นแบบค่อนข้างมาก\n";


            message +=
            "ทดลองปรับสีทีละน้อย แล้วสแกนใหม่\n";

        }

        else if(similarity < 85){

            message +=
            "🔄 สีเริ่มใกล้เคียงแล้ว\n";


            message +=
            "ค่อย ๆ ปรับสีทีละเล็กน้อย\n";

        }

        else if(similarity < 95){

            message +=
            "🔄 ใกล้เคียงมากแล้ว\n";


            message +=
            "ปรับสีเพียงเล็กน้อย แล้วทดลองใหม่\n";

        }

        else{

            message +=
            "⭐ สีใกล้เคียงต้นแบบมาก\n";


            message +=
            "พยายามรักษาสัดส่วนของสีไว้\n";

        }

    }


    // ======================================
    // แสดงผล AI Coach
    // ======================================

    aiCoachMessage.textContent =
    message;

}