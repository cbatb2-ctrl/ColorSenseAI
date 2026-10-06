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