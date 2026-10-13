// ==========================================
// ColorSense AI Classroom
// Dashboard Development
// D3.3.1 — Mock Student Data
// ==========================================

const dashboardStudents = [

    {
        name: "ด.ช.ก้อง",
        number: 1,
        room: "ม.3/1",
        targetColor: "เขียว",

        attempts: [
            72,
            84,
            94
        ]
    },

    {
        name: "ด.ญ.ฟ้า",
        number: 2,
        room: "ม.3/1",
        targetColor: "ม่วง",

        attempts: [
            76,
            82,
            88
        ]
    },

    {
        name: "ด.ช.นนท์",
        number: 3,
        room: "ม.3/1",
        targetColor: "ส้ม",

        attempts: [
            61,
            74,
            82
        ]
    },

    {
        name: "ด.ญ.มายด์",
        number: 4,
        room: "ม.3/1",
        targetColor: "เขียวเหลือง",

        attempts: [
            68,
            71,
            76
        ]
    },

    {
        name: "ด.ช.ภูมิ",
        number: 5,
        room: "ม.3/1",
        targetColor: "เหลือง",

        attempts: [
            81,
            86,
            92
        ]
    },

    {
        name: "ด.ญ.น้ำ",
        number: 6,
        room: "ม.3/1",
        targetColor: "ม่วงแดง",

        attempts: [
            64,
            78,
            89
        ]
    },

    {
        name: "ด.ช.ต้น",
        number: 7,
        room: "ม.3/1",
        targetColor: "น้ำเงิน",

        attempts: [
            70,
            75,
            83
        ]
    },

    {
        name: "ด.ญ.พลอย",
        number: 8,
        room: "ม.3/1",
        targetColor: "ส้มเหลือง",

        attempts: [
            77,
            85,
            91
        ]
    },

    {
        name: "ด.ช.บอส",
        number: 9,
        room: "ม.3/1",
        targetColor: "แดง",

        attempts: [
            88,
            91,
            96
        ]
    },

    {
        name: "ด.ญ.แพรว",
        number: 10,
        room: "ม.3/1",
        targetColor: "ม่วงน้ำเงิน",

        attempts: [
            59,
            72,
            81
        ]
    },

    {
        name: "ด.ช.เจมส์",
        number: 11,
        room: "ม.3/1",
        targetColor: "เขียวน้ำเงิน",

        attempts: [
            67,
            79,
            86
        ]
    },

    {
        name: "ด.ญ.น้ำหวาน",
        number: 12,
        room: "ม.3/1",
        targetColor: "ส้มแดง",

        attempts: [
            73,
            80,
            90
        ]
    }

];


// ==========================================
// Calculate Best Score
// ==========================================

function getBestScore(student) {

    return Math.max(
        ...student.attempts
    );

}


// ==========================================
// Calculate Development
// Last Attempt - First Attempt
// ==========================================

function getDevelopment(student) {

    if (student.attempts.length < 2) {
        return 0;
    }

    return (
        student.attempts[
            student.attempts.length - 1
        ]
        -
        student.attempts[0]
    );

}


// ==========================================
// Get Latest Score
// ==========================================

function getLatestScore(student) {

    if (student.attempts.length === 0) {
        return 0;
    }

    return student.attempts[
        student.attempts.length - 1
    ];

}


// ==========================================
// Calculate Class Average
// ==========================================

function getClassAverage() {

    if (dashboardStudents.length === 0) {
        return 0;
    }

    const total =
        dashboardStudents.reduce(
            (sum, student) => {

                return (
                    sum +
                    getLatestScore(student)
                );

            },
            0
        );

    return (
        total /
        dashboardStudents.length
    );

}


// ==========================================
// Calculate Average Development
// ==========================================

function getAverageDevelopment() {

    if (dashboardStudents.length === 0) {
        return 0;
    }

    const total =
        dashboardStudents.reduce(
            (sum, student) => {

                return (
                    sum +
                    getDevelopment(student)
                );

            },
            0
        );

    return (
        total /
        dashboardStudents.length
    );

}

function renderStudentProgress() {
    const container = document.getElementById("studentProgressList");

    if (!container) {
        console.error("ไม่พบ studentProgressList");
        return;
    }

    container.innerHTML = dashboardStudents.map(student => {
        const attempts = student.attempts;
        const best = getBestScore(student);
        const development = getDevelopment(student);

        const attemptHTML = attempts.map((score, index) => `
            <span class="attempt">
                ครั้งที่ ${index + 1}: ${score}%
            </span>
        `).join("");

        return `
            <div class="student">
                <div class="student-header">
                    <span class="student-name">
                        ${student.name}
                    </span>

                    <span class="student-best">
                        Best ${best}%
                    </span>
                </div>

                <div class="progress">
                    <div
                        class="progress-bar"
                        style="width:${best}%"
                    ></div>
                </div>

                <div class="attempts">
                    ${attemptHTML}

                    <span class="improvement">
                       ${development >= 0 ? "+" : ""}${development} จุด
                    </span>
                </div>
            </div>
        `;
    }).join("");
}

document.addEventListener("DOMContentLoaded", renderStudentProgress);
function renderAttemptAverageChart() {
    const container = document.getElementById("attemptAverageChart");

    if (!container) {
        console.error("ไม่พบ attemptAverageChart");
        return;
    }

    if (!dashboardStudents.length) {
        container.textContent = "ยังไม่มีข้อมูลคะแนน";
        return;
    }

    const attemptCount = Math.max(
        ...dashboardStudents.map(student => student.attempts.length)
    );

    const averages = Array.from({ length: attemptCount }, (_, index) => {
        const scores = dashboardStudents
            .map(student => student.attempts[index])
            .filter(score => Number.isFinite(score));

        return {
            label: `ครั้งที่ ${index + 1}`,
            average: scores.length
                ? scores.reduce((sum, score) => sum + score, 0) / scores.length
                : 0
        };
    });

    const width = 680;
    const height = 300;
    const padding = { top: 25, right: 25, bottom: 55, left: 55 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const maxScore = 100;
    const slotWidth = plotWidth / averages.length;
    const barWidth = Math.min(100, slotWidth * 0.5);

    const gridLines = [0, 20, 40, 60, 80, 100].map(score => {
        const y = padding.top + plotHeight * (1 - score / maxScore);

        return `
            <line
                x1="${padding.left}"
                y1="${y}"
                x2="${width - padding.right}"
                y2="${y}"
                stroke="#e3eaf2"
                stroke-width="1"
            />
            <text
                x="${padding.left - 10}"
                y="${y + 4}"
                text-anchor="end"
                font-size="12"
                fill="#607d8b"
            >${score}</text>
        `;
    }).join("");

    const bars = averages.map((item, index) => {
        const barHeight = plotHeight * item.average / maxScore;
        const x = padding.left + slotWidth * index + (slotWidth - barWidth) / 2;
        const y = padding.top + plotHeight - barHeight;

        return `
            <rect
                x="${x}"
                y="${y}"
                width="${barWidth}"
                height="${barHeight}"
                rx="7"
                fill="#42a5f5"
            />
            <text
                x="${x + barWidth / 2}"
                y="${y - 9}"
                text-anchor="middle"
                font-size="14"
                font-weight="600"
                fill="#263238"
            >${item.average.toFixed(2)}%</text>
            <text
                x="${x + barWidth / 2}"
                y="${height - 22}"
                text-anchor="middle"
                font-size="13"
                fill="#455a64"
            >${item.label}</text>
        `;
    }).join("");

    const first = averages[0].average;
    const last = averages[averages.length - 1].average;
    const difference = last - first;
    const sign = difference > 0 ? "+" : "";

    container.innerHTML = `
        <svg
            viewBox="0 0 ${width} ${height}"
            role="img"
            aria-label="กราฟคะแนนเฉลี่ยการทดลองผสมสี"
        >
            ${gridLines}
            ${bars}
        </svg>

        <div class="chart-summary">
            คะแนนเฉลี่ยเปลี่ยนแปลงจากครั้งแรกถึงครั้งล่าสุด
            <strong>${sign}${difference.toFixed(2)} จุด</strong>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", renderAttemptAverageChart);