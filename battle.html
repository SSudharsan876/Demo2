<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prompt Forge | AI Design Workspace</title>
  <link rel="stylesheet" href="style.css">
</head>

<body>

<div class="container">

  <!-- 20 MINUTE TIMER -->
  <div id="timerBox" style="
    text-align:center;
    margin-bottom:20px;
    padding:15px;
    border-radius:12px;
    background:#111827;
    color:white;
  ">
    <div style="font-size:14px;">Time Remaining</div>

    <div id="timer" style="
      font-size:32px;
      font-weight:bold;
      margin-top:5px;
    ">20:00</div>
  </div>


  <div class="workspace-header">

    <div>

      <span class="badge">AI Design Workspace</span>

      <h1>Prompt Forge</h1>

      <p>Create your design using Canva AI and submit your final artwork.</p>

    </div>


    <div class="participant-chip">

      <span>Participant</span>

      <strong id="user">Guest</strong>

    </div>

  </div>


  <div class="workspace-grid">


    <div class="workspace-panel">

      <h2>Design Prompt</h2>

      <textarea
        id="prompt"
        placeholder="Describe your poster, logo, banner, or creative concept...

Example:
Design a premium A3 vertical college symposium poster for Prompt Forge with futuristic AI visuals, blue and purple neon lighting, bold typography, holographic interface elements, and a professional tech event aesthetic."
      ></textarea>


      <button
        id="generateBtn"
        class="btn btn-primary"
      >
        Launch Canva AI
      </button>


      <p
        id="loading"
        class="helper-text"
      ></p>

    </div>



    <div class="workspace-panel">

      <h2>Upload Final Design</h2>


      <div class="upload-box">

        <input
          type="file"
          id="imageUpload"
          accept="image/*"
        >


        <img
          id="preview"
          class="preview-image"
          style="display:none;"
          alt="Design preview"
        >

      </div>


      <button
        id="submitBtn"
        class="btn btn-primary"
      >
        Submit Design
      </button>


      <p class="helper-text">
        Only your final Canva-generated design should be submitted.
      </p>

    </div>

  </div>

</div>


<script type="module">

import { db } from './firebase.js';

import {
  collection,
  addDoc
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';


// =====================================================
// DISPLAY CURRENT USER
// =====================================================

document.getElementById('user').innerText =
  localStorage.getItem('currentUser') || 'Guest';


// =====================================================
// IMAGE PREVIEW
// =====================================================

const imageInput = document.getElementById('imageUpload');

const preview = document.getElementById('preview');


// =====================================================
// CANVA AI BUTTON
// =====================================================

document.getElementById('generateBtn').addEventListener('click', () => {

  const prompt =
    document.getElementById('prompt').value.trim();


  if (!prompt) {

    alert('Enter your design prompt');

    return;

  }


  const canvaLink =
    `https://www.canva.com/ai-image-generator/?prompt=${encodeURIComponent(prompt)}`;


  window.open(canvaLink, '_blank');


  document.getElementById('loading').innerText =
    'Canva AI opened in a new tab. Generate your design, download it, and upload it below.';

});


// =====================================================
// IMAGE UPLOAD PREVIEW
// =====================================================

imageInput.addEventListener('change', (e) => {

  const file = e.target.files[0];


  if (!file) return;


  const reader = new FileReader();


  reader.onload = (event) => {

    preview.src = event.target.result;

    preview.style.display = 'block';

  };


  reader.readAsDataURL(file);

});


// =====================================================
// SUBMIT DESIGN
// =====================================================

document.getElementById('submitBtn').addEventListener('click', async () => {

  const file = imageInput.files[0];


  if (!file) {

    alert('Please upload the generated image first.');

    return;

  }


  const submitBtn =
    document.getElementById('submitBtn');


  submitBtn.disabled = true;

  submitBtn.innerText = 'Submitting...';


  try {

    // -----------------------------------------------
    // CLOUDINARY UPLOAD
    // -----------------------------------------------

    const formData = new FormData();


    formData.append('file', file);

    formData.append('upload_preset', 'ml_default');


    const uploadResponse = await fetch(
      'https://api.cloudinary.com/v1_1/pydcirpp/image/upload',
      {
        method: 'POST',
        body: formData
      }
    );


    const uploadData =
      await uploadResponse.json();


    if (
      !uploadResponse.ok ||
      !uploadData.secure_url
    ) {

      throw new Error(
        uploadData.error?.message ||
        'Cloudinary upload failed'
      );

    }


    // -----------------------------------------------
    // SAVE SUBMISSION TO FIRESTORE
    // -----------------------------------------------

    await addDoc(
      collection(db, 'submissions'),
      {

        participant:
          localStorage.getItem('currentUser') || 'Guest',

        email:
          localStorage.getItem('currentEmail') || '',

        prompt:
          document.getElementById('prompt').value.trim(),

        image:
          uploadData.secure_url,

        submittedAt:
          new Date().toLocaleString()

      }
    );


    // -----------------------------------------------
    // SUCCESS
    // -----------------------------------------------

    alert('🎉 Design submitted successfully!');


    document.getElementById('prompt').value = '';

    imageInput.value = '';

    preview.style.display = 'none';

  }


  catch (error) {

    console.error(error);

    alert(
      'Submission failed: ' +
      error.message
    );

  }


  finally {

    submitBtn.disabled = false;

    submitBtn.innerText = 'Submit Design';

  }

});


// =====================================================
// 20 MINUTE AUTO SIGN-OUT TIMER
// =====================================================

const TIMER_DURATION =
  20 * 60 * 1000; // 20 minutes


const timerElement =
  document.getElementById('timer');


// -----------------------------------------------------
// START TIMER
// -----------------------------------------------------

// If there is no existing timer,
// create one now.

if (!localStorage.getItem('timerStart')) {

  localStorage.setItem(
    'timerStart',
    Date.now()
  );

}


// -----------------------------------------------------
// UPDATE TIMER
// -----------------------------------------------------

function updateTimer() {

  const startTime =
    parseInt(
      localStorage.getItem('timerStart'),
      10
    );


  const elapsed =
    Date.now() - startTime;


  const remaining =
    TIMER_DURATION - elapsed;


  // -----------------------------------------------
  // TIMER EXPIRED
  // -----------------------------------------------

  if (remaining <= 0) {

    timerElement.innerText = '00:00';


    // Stop the interval
    clearInterval(timerInterval);


    // Remove session information
    localStorage.removeItem('currentUser');

    localStorage.removeItem('currentEmail');

    localStorage.removeItem('timerStart');


    alert(
      '⏰ Your 20-minute session has expired. You have been signed out.'
    );


    // Redirect to login page
    window.location.href = 'login.html';


    return;

  }


  // -----------------------------------------------
  // CALCULATE MINUTES & SECONDS
  // -----------------------------------------------

  const minutes =
    Math.floor(
      remaining / 60000
    );


  const seconds =
    Math.floor(
      (remaining % 60000) / 1000
    );


  // -----------------------------------------------
  // DISPLAY TIMER
  // -----------------------------------------------

  timerElement.innerText =
    String(minutes).padStart(2, '0') +
    ':' +
    String(seconds).padStart(2, '0');

}


// -----------------------------------------------------
// START TIMER IMMEDIATELY
// -----------------------------------------------------

updateTimer();


// -----------------------------------------------------
// UPDATE EVERY SECOND
// -----------------------------------------------------

const timerInterval =
  setInterval(
    updateTimer,
    1000
  );

</script>

</body>
</html>
