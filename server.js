const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json({ limit: "10mb" }));

app.use(express.static(path.join(__dirname, "public")));


// ==========================================
// FILE PATHS
// ==========================================

const USERS_FILE = path.join(__dirname, "users.json");
const SUBMISSIONS_FILE = path.join(__dirname, "submissions.json");


// ==========================================
// SESSION SETTINGS
// ==========================================

// 20 minutes
const SESSION_DURATION = 20 * 60 * 1000;


// ==========================================
// CREATE JSON FILES IF THEY DON'T EXIST
// ==========================================

if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]");
}

if (!fs.existsSync(SUBMISSIONS_FILE)) {
    fs.writeFileSync(SUBMISSIONS_FILE, "[]");
}


// ==========================================
// HELPER FUNCTIONS
// ==========================================

function readUsers() {

    try {

        return JSON.parse(
            fs.readFileSync(USERS_FILE, "utf8")
        );

    } catch (error) {

        console.error(
            "Error reading users.json:",
            error
        );

        return [];

    }

}


function writeUsers(data) {

    fs.writeFileSync(
        USERS_FILE,
        JSON.stringify(data, null, 2)
    );

}


function readSubmissions() {

    try {

        return JSON.parse(
            fs.readFileSync(SUBMISSIONS_FILE, "utf8")
        );

    } catch (error) {

        console.error(
            "Error reading submissions.json:",
            error
        );

        return [];

    }

}


function writeSubmissions(data) {

    fs.writeFileSync(
        SUBMISSIONS_FILE,
        JSON.stringify(data, null, 2)
    );

}


// ==========================================
// PARTICIPANT REGISTRATION
// ==========================================

app.post("/register", (req, res) => {

    const {
        fullName,
        college,
        department,
        email,
        phone
    } = req.body;


    if (!fullName || !email) {

        return res.json({

            success: false,

            message:
                "Name and email are required"

        });

    }


    let users = readUsers();


    const cleanEmail =
        email.trim().toLowerCase();


    const existing = users.find(
        u =>
            u.email &&
            u.email.toLowerCase() === cleanEmail
    );


    if (existing) {

        return res.json({

            success: false,

            message:
                "Email already registered"

        });

    }


    users.push({

        fullName:
            fullName.trim(),

        college:
            college || "",

        department:
            department || "",

        phone:
            phone || "",

        email:
            cleanEmail,

        emailApproved:
            false

    });


    writeUsers(users);


    res.json({

        success: true,

        message:
            "Registration successful. Wait for admin approval."

    });

});


// ==========================================
// PARTICIPANT LOGIN
// ==========================================

app.post("/login", (req, res) => {

    const { email } = req.body;


    if (!email) {

        return res.json({

            success: false,

            message:
                "Email is required"

        });

    }


    const users = readUsers();


    const cleanEmail =
        email.trim().toLowerCase();


    const user = users.find(

        u =>
            u.email &&
            u.email.toLowerCase() === cleanEmail

    );


    // ======================================
    // EMAIL NOT REGISTERED
    // ======================================

    if (!user) {

        return res.json({

            success: false,

            message:
                "Email not registered"

        });

    }


    // ======================================
    // WAITING FOR APPROVAL
    // ======================================

    if (!user.emailApproved) {

        return res.json({

            success: false,

            message:
                "Waiting for admin approval"

        });

    }


    // ======================================
    // START 20 MINUTE SESSION
    // ======================================

    const sessionStartedAt =
        Date.now();


    const sessionExpiresAt =
        sessionStartedAt + SESSION_DURATION;


    // ======================================
    // LOGIN SUCCESSFUL
    // ======================================

    res.json({

        success: true,

        message:
            "Login successful",

        user,

        sessionStartedAt,

        sessionExpiresAt,

        sessionDuration:
            SESSION_DURATION

    });

});


// ==========================================
// SESSION STATUS
// ==========================================

app.post("/session-status", (req, res) => {

    const {
        email,
        sessionExpiresAt
    } = req.body;


    if (!email || !sessionExpiresAt) {

        return res.json({

            success: false,

            active: false,

            message:
                "Session information is missing"

        });

    }


    const users = readUsers();


    const cleanEmail =
        email.trim().toLowerCase();


    const user = users.find(

        u =>
            u.email &&
            u.email.toLowerCase() === cleanEmail

    );


    // ======================================
    // USER DOES NOT EXIST
    // ======================================

    if (!user) {

        return res.json({

            success: false,

            active: false,

            message:
                "User not found"

        });

    }


    // ======================================
    // CHECK APPROVAL
    // ======================================

    if (!user.emailApproved) {

        return res.json({

            success: false,

            active: false,

            message:
                "User is not approved"

        });

    }


    // ======================================
    // CHECK EXPIRATION
    // ======================================

    const now =
        Date.now();


    const expiresAt =
        Number(sessionExpiresAt);


    if (
        !Number.isFinite(expiresAt) ||
        now >= expiresAt
    ) {

        return res.json({

            success: false,

            active: false,

            expired: true,

            message:
                "Your 20-minute session has expired."

        });

    }


    // ======================================
    // SESSION STILL ACTIVE
    // ======================================

    res.json({

        success: true,

        active: true,

        expired: false,

        remaining:
            expiresAt - now,

        sessionExpiresAt:
            expiresAt

    });

});


// ==========================================
// ADMIN LOGIN
// ==========================================

app.post("/admin-login", (req, res) => {

    const {
        username,
        password
    } = req.body;


    // Admin credentials

    const ADMIN_USERNAME =
        "admin";

    const ADMIN_PASSWORD =
        "promptforge2026";


    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {

        return res.json({

            success: true,

            message:
                "Admin login successful"

        });

    }


    res.json({

        success: false,

        message:
            "Invalid admin credentials"

    });

});


// ==========================================
// GET ALL USERS
// ==========================================

app.get("/users", (req, res) => {

    const users =
        readUsers();

    res.json(users);

});


// ==========================================
// APPROVE PARTICIPANT
// ==========================================

app.post("/approve-user", (req, res) => {

    const { email } = req.body;


    if (!email) {

        return res.json({

            success: false,

            message:
                "Email is required"

        });

    }


    let users =
        readUsers();


    const cleanEmail =
        email.trim().toLowerCase();


    const user =
        users.find(

            u =>
                u.email &&
                u.email.toLowerCase() === cleanEmail

        );


    if (!user) {

        return res.json({

            success: false,

            message:
                "User not found"

        });

    }


    user.emailApproved =
        true;


    writeUsers(users);


    res.json({

        success: true,

        message:
            "User approved successfully"

    });

});


// ==========================================
// SUBMIT DESIGN
// ==========================================

app.post("/submit-design", (req, res) => {

    const {
        email,
        participant,
        prompt,
        image,
        sessionExpiresAt
    } = req.body;


    // ======================================
    // BASIC VALIDATION
    // ======================================

    if (
        !email ||
        !participant ||
        !image
    ) {

        return res.json({

            success: false,

            message:
                "Email, participant name and image are required"

        });

    }


    // ======================================
    // CHECK 20 MINUTE SESSION
    // ======================================

    if (!sessionExpiresAt) {

        return res.json({

            success: false,

            sessionExpired: true,

            message:
                "Session information is missing. Please log in again."

        });

    }


    const expiresAt =
        Number(sessionExpiresAt);


    if (
        !Number.isFinite(expiresAt) ||
        Date.now() >= expiresAt
    ) {

        return res.json({

            success: false,

            sessionExpired: true,

            message:
                "Your 20-minute session has expired. Please log in again."

        });

    }


    // ======================================
    // CHECK USER
    // ======================================

    const users =
        readUsers();


    const cleanEmail =
        email.trim().toLowerCase();


    const user =
        users.find(

            u =>
                u.email &&
                u.email.toLowerCase() === cleanEmail

        );


    if (!user) {

        return res.json({

            success: false,

            message:
                "User not found"

        });

    }


    // ======================================
    // CHECK APPROVAL
    // ======================================

    if (!user.emailApproved) {

        return res.json({

            success: false,

            message:
                "Participant is not approved"

        });

    }


    // ======================================
    // SAVE SUBMISSION
    // ======================================

    let submissions =
        readSubmissions();


    submissions.push({

        email:
            cleanEmail,

        participant,

        prompt:
            prompt || "",

        image,

        submittedAt:
            new Date().toLocaleString()

    });


    writeSubmissions(
        submissions
    );


    // ======================================
    // SUCCESS
    // ======================================

    res.json({

        success: true,

        message:
            "Design submitted successfully"

    });

});


// ==========================================
// GET ALL SUBMITTED DESIGNS
// ==========================================

app.get("/submissions", (req, res) => {

    const users =
        readUsers();


    const submissions =
        readSubmissions();


    const result =
        submissions.map(s => {

            const user =
                users.find(

                    u =>
                        u.email &&
                        s.email &&
                        u.email.toLowerCase() ===
                        s.email.toLowerCase()

                );


            return {

                ...s,

                emailApproved:
                    user
                        ? user.emailApproved
                        : false

            };

        });


    res.json(result);

});


// ==========================================
// HOME PAGE
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(

        path.join(
            __dirname,
            "public",
            "index.html"
        )

    );

});


// ==========================================
// START SERVER
// ==========================================

const PORT = 3000;


app.listen(PORT, () => {

    console.log(
        `Prompt Forge server running at http://localhost:${PORT}`
    );

});
