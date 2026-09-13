/* ================================================= */
/* HEALTRACK - COMPLETE JAVASCRIPT */
/* ================================================= */


/* ================================================= */
/* LOGIN SYSTEM */
/* ================================================= */

const LOGIN_KEY = "healtrack_logged_in";
const USER_KEY = "healtrack_user";
const RECORD_KEY = "healtrack_records";


document.addEventListener("DOMContentLoaded", () => {

    checkLogin();
    setupLogin();
    setupImageUpload();
    setupRecordForm();

    updateTodayDate();

});


/* ตรวจสอบว่าล็อกอินอยู่หรือไม่ */

function checkLogin() {

    const loggedIn = localStorage.getItem(LOGIN_KEY);

    if (loggedIn === "true") {

        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");

        loadUser();

        renderDashboard();
        renderHistory();

    }

}


/* Login */

function setupLogin() {

    const form = document.getElementById("loginForm");

    if (!form) return;

    form.addEventListener("submit", function(e) {

        e.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value.trim();

        if (!email || !password) {

            showToast("กรุณากรอกข้อมูลให้ครบ");

            return;
        }


        loginSuccess(email);

    });

}


/* Login สำเร็จ */

function loginSuccess(email) {

    localStorage.setItem(LOGIN_KEY, "true");

    localStorage.setItem(
        USER_KEY,
        JSON.stringify({
            email: email,
            name: "ผู้ใช้งาน"
        })
    );


    document.getElementById("loginPage")
        .classList.add("hidden");

    document.getElementById("app")
        .classList.remove("hidden");


    loadUser();

    renderDashboard();
    renderHistory();

    showToast("เข้าสู่ระบบสำเร็จ 💗");

}


/* Demo Login */

function demoLogin() {

    localStorage.setItem(LOGIN_KEY, "true");

    localStorage.setItem(
        USER_KEY,
        JSON.stringify({
            email: "demo@healtrack.com",
            name: "Demo User"
        })
    );


    document.getElementById("loginPage")
        .classList.add("hidden");

    document.getElementById("app")
        .classList.remove("hidden");


    loadUser();

    createDemoData();

    renderDashboard();
    renderHistory();

    showToast("เข้าสู่ Demo สำเร็จ ✨");

}


/* โหลดชื่อผู้ใช้ */

function loadUser() {

    const user =
        JSON.parse(localStorage.getItem(USER_KEY));

    if (!user) return;

    const nameElement =
        document.getElementById("userName");

    if (nameElement) {

        nameElement.textContent =
            user.name || "ผู้ใช้งาน";

    }

}


/* Logout */

function logout() {

    localStorage.removeItem(LOGIN_KEY);

    document.getElementById("app")
        .classList.add("hidden");

    document.getElementById("loginPage")
        .classList.remove("hidden");

    showToast("ออกจากระบบแล้ว");

}


/* Password */

function togglePassword() {

    const input =
        document.getElementById("password");

    if (input.type === "password") {

        input.type = "text";

    } else {

        input.type = "password";

    }

}


/* Forgot Password */

function forgotPassword() {

    showToast("ระบบต้นแบบ: กรุณาติดต่อผู้ดูแลระบบ");

}


/* Register */

function registerDemo() {

    showToast("ระบบต้นแบบ: หน้าสมัครสมาชิกกำลังพัฒนา");

}


/* ================================================= */
/* PAGE NAVIGATION */
/* ================================================= */

function showPage(page) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(p => {
        p.classList.remove("active-page");
    });


    const target =
        document.getElementById(page + "Page");

    if (target) {

        target.classList.add("active-page");

    }


    const menus =
        document.querySelectorAll(".menu-item");

    menus.forEach(menu => {

        menu.classList.remove("active");

        if (menu.dataset.page === page) {

            menu.classList.add("active");

        }

    });


    const title =
        document.getElementById("pageTitle");


    if (page === "analysis") {

        title.textContent = "Wound Analysis";

        renderDashboard();

    }


    if (page === "history") {

        title.textContent = "Wound History";

        renderHistory();

    }


    if (page === "record") {

        title.textContent = "New Record";

    }

}


/* ================================================= */
/* DATE */
/* ================================================= */

function updateTodayDate() {

    const date = new Date();

    const options = {
        day: "numeric",
        month: "short",
        year: "numeric"
    };

    const text =
        date.toLocaleDateString("th-TH", options);

    const element =
        document.getElementById("todayDate");

    if (element) {

        element.textContent = text;

    }

}


/* ================================================= */
/* RECORD STORAGE */
/* ================================================= */

function getRecords() {

    return JSON.parse(
        localStorage.getItem(RECORD_KEY)
    ) || [];

}


function saveRecords(records) {

    localStorage.setItem(
        RECORD_KEY,
        JSON.stringify(records)
    );

}


/* ================================================= */
/* DEMO DATA */
/* ================================================= */

function createDemoData() {

    const existing = getRecords();

    if (existing.length > 0) return;


    const demo = [

        {
            id: Date.now() - 300000,
            date: getDateOffset(-2),
            time: "09:30",
            temperature: 37.2,
            ph: 6.5,
            score: 75,
            status: "Monitoring",
            note: "เริ่มติดตามข้อมูล",
            image: ""
        },


        {
            id: Date.now() - 200000,
            date: getDateOffset(-1),
            time: "10:00",
            temperature: 37.0,
            ph: 6.3,
            score: 79,
            status: "Good",
            note: "ข้อมูลค่อนข้างคงที่",
            image: ""
        },


        {
            id: Date.now(),
            date: getDateOffset(0),
            time: "18:30",
            temperature: 36.8,
            ph: 6.2,
            score: 82,
            status: "Good",
            note: "แนวโน้มคงที่",
            image: ""
        }

    ];


    saveRecords(demo);

}


function getDateOffset(offset) {

    const date = new Date();

    date.setDate(date.getDate() + offset);

    return date.toISOString().split("T")[0];

}


/* ================================================= */
/* CALCULATE RECOVERY SCORE */
/* ================================================= */

function calculateScore(temp, ph, records) {

    let tempScore = 80;
    let phScore = 80;
    let consistencyScore = 75;


    /*
       ตัวเลขด้านล่างเป็นเกณฑ์ตัวอย่าง
       สำหรับ Prototype เท่านั้น
    */


    if (temp >= 36 && temp <= 37.5) {

        tempScore = 90;

    } else if (temp > 37.5) {

        tempScore = 65;

    } else {

        tempScore = 75;

    }


    if (ph >= 5.5 && ph <= 7.0) {

        phScore = 85;

    } else {

        phScore = 65;

    }


    if (records.length >= 2) {

        consistencyScore = 82;

    }


    const score =
        Math.round(
            tempScore * 0.4 +
            phScore * 0.3 +
            consistencyScore * 0.3
        );


    return {

        score,
        tempScore,
        phScore,
        consistencyScore

    };

}


/* ================================================= */
/* RENDER DASHBOARD */
/* ================================================= */

function renderDashboard() {

    let records = getRecords();


    if (records.length === 0) {

        createDemoData();

        records = getRecords();

    }


    if (records.length === 0) return;


    records.sort(
        (a,b) =>
            new Date(b.date + " " + b.time) -
            new Date(a.date + " " + a.time)
    );


    const latest = records[0];

    const previous =
        records.length > 1
            ? records[1]
            : latest;


    /* SCORE */

    setText(
        "heroScore",
        latest.score
    );

    setText(
        "quickScore",
        latest.score + " / 100"
    );

    setText(
        "largeScore",
        latest.score
    );


    /* TEMP */

    setText(
        "tempValue",
        latest.temperature + "°C"
    );

    setText(
        "detailTemp",
        latest.temperature
    );

    setText(
        "currentTemp",
        latest.temperature + "°C"
    );

    setText(
        "previousTemp",
        previous.temperature + "°C"
    );

    setText(
        "tempDescription",
        latest.temperature + "°C"
    );


    /* PH */

    setText(
        "phValue",
        latest.ph
    );

    setText(
        "detailPH",
        latest.ph
    );


    /* DATE */

    setText(
        "latestDate",
        formatThaiDate(latest.date)
    );

    setText(
        "latestTime",
        latest.time
    );


    /* SCORE COMPONENTS */

    const scoreData =
        calculateScore(
            latest.temperature,
            latest.ph,
            records
        );


    setText(
        "tempScore",
        scoreData.tempScore + "%"
    );

    setText(
        "phScore",
        scoreData.phScore + "%"
    );

    setText(
        "consistencyScore",
        scoreData.consistencyScore + "%"
    );


    setWidth(
        "tempProgress",
        scoreData.tempScore
    );

    setWidth(
        "phProgress",
        scoreData.phScore
    );

    setWidth(
        "consistencyProgress",
        scoreData.consistencyScore
    );


    /* IMAGE */

    const image =
        document.getElementById("heroImage");

    const placeholder =
        document.getElementById("imagePlaceholder");


    if (latest.image) {

        image.src = latest.image;

        image.style.display = "block";

        placeholder.style.display = "none";

    } else {

        image.style.display = "none";

        placeholder.style.display = "flex";

    }


    /* AI */

    generateAIInsight(
        latest,
        previous,
        records
    );


    /* PH MARKER */

    updatePHMarker(latest.ph);


    /* SUMMARY */

    generateSummary(latest, records);

}


/* ================================================= */
/* AI ANALYSIS */
/* ================================================= */

function generateAIInsight(
    latest,
    previous,
    records
) {

    let message = "";


    const tempDifference =
        latest.temperature -
        previous.temperature;


    const phDifference =
        latest.ph -
        previous.ph;


    if (
        Math.abs(tempDifference) < 0.5 &&
        Math.abs(phDifference) < 0.5
    ) {

        message =
            "จากข้อมูลที่บันทึกล่าสุด ระบบพบว่าอุณหภูมิและค่า pH มีการเปลี่ยนแปลงไม่มากเมื่อเทียบกับข้อมูลก่อนหน้า จึงแสดงสถานะ Monitoring และแนะนำให้ติดตามข้อมูลอย่างต่อเนื่อง";

    }

    else if (tempDifference > 0.5) {

        message =
            "ระบบพบว่าอุณหภูมิมีการเปลี่ยนแปลงเพิ่มขึ้นจากข้อมูลก่อนหน้า ควรติดตามการเปลี่ยนแปลงในครั้งถัดไปและตรวจสอบข้อมูลร่วมกับปัจจัยอื่น";

    }

    else if (phDifference > 0.5) {

        message =
            "ระบบพบว่าค่า pH มีการเปลี่ยนแปลงจากข้อมูลก่อนหน้า จึงควรติดตามแนวโน้มต่อเนื่องเพื่อดูว่าการเปลี่ยนแปลงเกิดขึ้นชั่วคราวหรือมีแนวโน้มต่อเนื่อง";

    }

    else {

        message =
            "ข้อมูลล่าสุดมีการเปลี่ยนแปลงจากข้อมูลก่อนหน้า ระบบจึงแนะนำให้ติดตามข้อมูลครั้งถัดไปเพิ่มเติม";

    }


    setText(
        "aiInsight",
        message
    );

}


/* ================================================= */
/* SUMMARY */
/* ================================================= */

function generateSummary(latest, records) {

    let text = "";


    if (latest.score >= 80) {

        text =
            `วันนี้มีการบันทึกข้อมูลการติดตามแผล โดยมี Recovery Score ${latest.score}/100 ภาพรวมของข้อมูลอยู่ในระดับที่สามารถติดตามต่อเนื่องได้ และมีข้อมูลย้อนหลังจำนวน ${records.length} รายการสำหรับใช้เปรียบเทียบแนวโน้ม`;

    }

    else {

        text =
            `วันนี้มีการบันทึกข้อมูลการติดตามแผล โดยมี Recovery Score ${latest.score}/100 ระบบแนะนำให้ติดตามข้อมูลอย่างต่อเนื่องและเปรียบเทียบกับข้อมูลย้อนหลัง`;

    }


    setText(
        "summaryText",
        text
    );

}


/* ================================================= */
/* PH MARKER */
/* ================================================= */

function updatePHMarker(ph) {

    const marker =
        document.getElementById("phMarker");

    if (!marker) return;


    /*
       Scale 4 - 9
    */

    let position =
        ((ph - 4) / 5) * 100;


    position =
        Math.max(
            0,
            Math.min(100, position)
        );


    marker.style.left =
        `calc(${position}% - 8px)`;

}


/* ================================================= */
/* HISTORY */
/* ================================================= */

function renderHistory() {

    const container =
        document.getElementById("historyList");

    if (!container) return;


    const records = getRecords();


    if (records.length === 0) {

        container.innerHTML = `
            <div class="history-item">
                <div>
                    <strong>ยังไม่มีข้อมูล</strong>
                    <small>กด New Record เพื่อเริ่มบันทึก</small>
                </div>
            </div>
        `;

        return;

    }


    records.sort(
        (a,b) =>
            new Date(b.date + " " + b.time) -
            new Date(a.date + " " + a.time)
    );


    container.innerHTML = records.map(record => {

        const imageHTML =
            record.image
                ? `<img src="${record.image}" alt="Wound">`
                : `<span>🩹</span>`;


        return `

            <div class="history-item">

                <div class="history-image">
                    ${imageHTML}
                </div>


                <div class="history-info">

                    <strong>
                        ${formatThaiDate(record.date)}
                    </strong>

                    <small>
                        เวลา ${record.time}
                    </small>

                    <small>
                        ${record.note || "ไม่มีบันทึกเพิ่มเติม"}
                    </small>

                </div>


                <div class="history-metrics">

                    <div class="history-metric">
                        <span>Temperature</span>
                        <strong>${record.temperature}°C</strong>
                    </div>

                    <div class="history-metric">
                        <span>pH</span>
                        <strong>${record.ph}</strong>
                    </div>

                </div>


                <div class="history-score">

                    <strong>${record.score}</strong>

                    <span>Recovery</span>

                </div>

            </div>

        `;

    }).join("");

}


/* ================================================= */
/* IMAGE UPLOAD */
/* ================================================= */

let uploadedImage = "";


function setupImageUpload() {

    const input =
        document.getElementById("woundImage");

    if (!input) return;


    input.addEventListener(
        "change",
        function() {

            const file =
                this.files[0];

            if (!file) return;


            const reader =
                new FileReader();


            reader.onload = function(e) {

                uploadedImage =
                    e.target.result;


                const preview =
                    document.getElementById("previewImage");

                const uploadPreview =
                    document.getElementById("uploadPreview");


                preview.src =
                    uploadedImage;

                preview.classList.remove("hidden");

                uploadPreview.classList.add("hidden");

            };


            reader.readAsDataURL(file);

        }
    );

}


/* ================================================= */
/* RECORD FORM */
/* ================================================= */

function setupRecordForm() {

    const form =
        document.getElementById("recordForm");

    if (!form) return;


    form.addEventListener(
        "submit",
        function(e) {

            e.preventDefault();


            const temperature =
                parseFloat(
                    document.getElementById(
                        "temperature"
                    ).value
                );


            const ph =
                parseFloat(
                    document.getElementById(
                        "ph"
                    ).value
                );


            const note =
                document.getElementById(
                    "note"
                ).value.trim();


            if (
                isNaN(temperature) ||
                isNaN(ph)
            ) {

                showToast(
                    "กรุณากรอกข้อมูลให้ครบ"
                );

                return;

            }


            const records =
                getRecords();


            const scoreData =
                calculateScore(
                    temperature,
                    ph,
                    records
                );


            const now =
                new Date();


            const record = {

                id: Date.now(),

                date:
                    now.toISOString()
                        .split("T")[0],

                time:
                    now.toLocaleTimeString(
                        "th-TH",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    ),

                temperature:
                    temperature,

                ph:
                    ph,

                score:
                    scoreData.score,

                status:
                    scoreData.score >= 80
                        ? "Good"
                        : "Monitoring",

                note:
                    note,

                image:
                    uploadedImage

            };


            /*
               สำคัญ:
               ใช้ push() เพื่อให้สามารถ
               บันทึกหลายรายการในวันเดียวได้
            */

            records.push(record);


            saveRecords(records);


            /* reset */

            form.reset();

            uploadedImage = "";


            document
                .getElementById("previewImage")
                .classList.add("hidden");


            document
                .getElementById("uploadPreview")
                .classList.remove("hidden");


            renderDashboard();

            renderHistory();


            showToast(
                "บันทึกข้อมูลสำเร็จ 💗"
            );


            setTimeout(() => {

                showPage("analysis");

            }, 600);

        }
    );

}


/* ================================================= */
/* UTILITY */
/* ================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent = value;

    }

}


function setWidth(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.style.width =
            value + "%";

    }

}


function formatThaiDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "th-TH",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* ================================================= */
/* TOAST */
/* ================================================= */

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById("toast");

    const text =
        document.getElementById(
            "toastMessage"
        );


    if (!toast || !text) return;


    text.textContent =
        message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);

}