const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

const USERS_FILE = path.join(__dirname, "users.json");
const SUBMISSIONS_FILE = path.join(__dirname, "submissions.json");

// Create JSON files if they do not exist
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]");
}

if (!fs.existsSync(SUBMISSIONS_FILE)) {
    fs.writeFileSync(SUBMISSIONS_FILE, "[]");
}

// ---------- Helper Functions ----------

function readUsers() {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

function writeUsers(data) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}

function readSubmissions() {
    return JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, "utf8"));
}

function writeSubmissions(data) {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(data, null, 2));
}

// ---------- Register Participant ----------

app.post("/register", (req, res) => {

    const { fullName, college, department, email, phone } = req.body;

    if (!fullName || !email) {
        return res.json({
            success: false,
            message: "Name and email are required"
        });
    }

    let users = readUsers();

    const existing = users.find(
        u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existing) {
        return res.json({
            success: false,
            message: "Email already registered"
        });
    }

    users.push({
        fullName,
        college: college || "",
        department: department || "",
        phone: phone || "",
        email,
        emailApproved: false
    });

    writeUsers(users);

    res.json({
        success: true,
        message: "Registration successful. Wait for admin approval."
    });

});

// ---------- Participant Login ----------

app.post("/login", (req, res) => {

    const { email } = req.body;

    let users = readUsers();

    const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
        return res.json({
            success: false,
            message: "Email not registered"
        });
    }

    if (!user.emailApproved) {
        return res.json({
            success: false,
            message: "Waiting for admin approval"
        });
    }

    res.json({
        success: true,
        message: "Login successful",
        user
    });

});

// ---------- Admin Login ----------

app.post("/admin-login", (req, res) => {

    const { username, password } = req.body;

    if (
        username === "admin" &&
        password === "promptforge2026"
    ) {
        return res.json({
            success: true,
            message: "Admin login successful"
        });
    }

    res.json({
        success: false,
        message: "Invalid admin credentials"
    });

});

// ---------- Get All Users ----------

app.get("/users", (req, res) => {

    res.json(readUsers());

});

// ---------- Approve Participant ----------

app.post("/approve-user", (req, res) => {

    const { email } = req.body;

    let users = readUsers();

    const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
        return res.json({
            success: false,
            message: "User not found"
        });
    }

    user.emailApproved = true;

    writeUsers(users);

    res.json({
        success: true,
        message: "User approved successfully"
    });

});

// ---------- Submit Design ----------

app.post("/submit-design", (req, res) => {

    const {
        email,
        participant,
        prompt,
        image
    } = req.body;

    let submissions = readSubmissions();

    submissions.push({
        email,
        participant,
        prompt,
        image,
        submittedAt: new Date().toLocaleString()
    });

    writeSubmissions(submissions);

    res.json({
        success: true,
        message: "Design submitted successfully"
    });

});

// ---------- Get All Submitted Designs ----------

app.get("/submissions", (req, res) => {

    const users = readUsers();
    const submissions = readSubmissions();

    const result = submissions.map(s => {

        const user = users.find(
            u => u.email.toLowerCase() === s.email.toLowerCase()
        );

        return {
            ...s,
            emailApproved: user ? user.emailApproved : false
        };

    });

    res.json(result);

});

// ---------- Home ----------

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );

});

// ---------- Start Server ----------

const PORT = 3000;

app.listen(PORT, () => {

    console.log(
        `Prompt Forge server running at http://localhost:${PORT}`
    );

});
