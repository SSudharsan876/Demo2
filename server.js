const express = require('express');
const path = require('path');

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ----------------------------
// In-memory storage
// ----------------------------
let users = [];
let submissions = [];

// ----------------------------
// Register user
// ----------------------------
app.post('/register', (req, res) => {
const { fullName, email } = req.body;

if (!fullName || !email) {
return res.json({
success: false,
message: 'Name and email are required'
});
}

const existing = users.find(u => u.email === email);

if (existing) {
return res.json({
success: false,
message: 'Email already registered'
});
}

users.push({
fullName,
email,
emailApproved: false
});

res.json({
success: true,
message: 'Registration successful. Wait for admin approval.'
});
});

// ----------------------------
// Participant login
// ----------------------------
app.post('/login', (req, res) => {
const { email } = req.body;

const user = users.find(u => u.email === email);

if (!user) {
return res.json({
success: false,
message: 'Email not registered'
});
}

if (!user.emailApproved) {
return res.json({
success: false,
message: 'Waiting for admin approval'
});
}

res.json({
success: true,
message: 'Login successful'
});
});

// ----------------------------
// Return all registered users
// ----------------------------
app.get('/users', (req, res) => {
res.json(users);
});

// ----------------------------
// Approve user
// ----------------------------
app.post('/approve-user', (req, res) => {
const { email } = req.body;

const user = users.find(u => u.email === email);

if (!user) {
return res.json({
success: false,
message: 'User not found'
});
}

user.emailApproved = true;

res.json({
success: true,
message: 'User approved successfully'
});
});

// ----------------------------
// Submit design
// ----------------------------
app.post('/submit-design', (req, res) => {
const { email, participant, prompt, image } = req.body;

submissions.push({
email,
participant,
prompt,
image,
submittedAt: new Date().toLocaleString()
});

res.json({
success: true,
message: 'Design submitted successfully'
});
});

// ----------------------------
// Get submissions
// ----------------------------
app.get('/submissions', (req, res) => {
const result = submissions.map(s => {
const user = users.find(u => u.email === s.email);

```
return {
  ...s,
  emailApproved: user ? user.emailApproved : false
};
```

});

res.json(result);
});

// ----------------------------
// Start server
// ----------------------------
app.listen(3000, () => {
console.log('Server running at http://localhost:3000');
});
