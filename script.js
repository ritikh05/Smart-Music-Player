// Enhanced script.js for Smart Mood Music Player

const video = document.getElementById('video');
const moodElement = document.getElementById('mood');

let currentMood = "";
let isModelLoaded = false;
let detectionInterval;
let scanButton = document.getElementById("scan-btn");
let hasDetectedOnce = false;

// Enhanced mood configurations with smooth transitions
const moodConfig = {
  happy: {
    color: '#fff700',
    gradient: 'linear-gradient(45deg, rgba(255, 193, 7, 0.3), rgba(255, 235, 59, 0.3))',
    emoji: '😊',
    description: 'Joyful & Energetic'
  },
  sad: {
    color: '#64b5f6',
    gradient: 'linear-gradient(45deg, rgba(33, 150, 243, 0.3), rgba(63, 81, 181, 0.3))',
    emoji: '😢',
    description: 'Melancholic & Reflective'
  },
  angry: {
    color: '#ff5722',
    gradient: 'linear-gradient(45deg, rgba(244, 67, 54, 0.3), rgba(255, 87, 34, 0.3))',
    emoji: '😠',
    description: 'Intense & Powerful'
  },
  neutral: {
    color: '#e0e0e0',
    gradient: 'linear-gradient(45deg, rgba(158, 158, 158, 0.3), rgba(189, 189, 189, 0.3))',
    emoji: '😐',
    description: 'Calm & Balanced'
  },
  disgusted: {
    color: '#8bc34a',
    gradient: 'linear-gradient(45deg, rgba(76, 175, 80, 0.3), rgba(139, 195, 74, 0.3))',
    emoji: '🤢',
    description: 'Uncomfortable & Uneasy'
  },
  surprised: {
    color: '#ff9800',
    gradient: 'linear-gradient(45deg, rgba(255, 152, 0, 0.3), rgba(255, 193, 7, 0.3))',
    emoji: '😲',
    description: 'Amazed & Astonished'
  },
  fearful: {
    color: '#9c27b0',
    gradient: 'linear-gradient(45deg, rgba(156, 39, 176, 0.3), rgba(142, 36, 170, 0.3))',
    emoji: '😨',
    description: 'Anxious & Worried'
  }
};

// Enhanced model loading with better error handling
async function loadModels() {
  try {
    console.log('🔄 Loading AI models...');
    updateMoodDisplay('Loading AI...', 'loading');
    
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models')
    ]);
    
    console.log('✅ AI models loaded successfully');
    isModelLoaded = true;
    startVideo();
  } catch (error) {
    console.error('❌ Error loading models:', error);
    updateMoodDisplay('AI Loading Failed', 'error');
    // Fallback: try to load from CDN
    setTimeout(() => {
      console.log('🔄 Retrying model load...');
      loadModelsFromCDN();
    }, 2000);
  }
}

// Fallback model loading from CDN
async function loadModelsFromCDN() {
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'),
      faceapi.nets.faceExpressionNet.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights')
    ]);
    
    console.log('✅ Models loaded from CDN');
    isModelLoaded = true;
    startVideo();
  } catch (error) {
    console.error('❌ CDN loading also failed:', error);
    updateMoodDisplay('Camera Required', 'error');
  }
}

// Enhanced video initialization
async function startVideo() {
  try {
    console.log('🎥 Initializing camera...');
    
    const constraints = {
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      }
    };
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    
    video.addEventListener('loadedmetadata', handleVideoLoaded);
    video.addEventListener('playing', startDetection);
    
    console.log('📹 Camera initialized successfully');
    updateMoodDisplay('Camera Ready', 'ready');
    
  } catch (error) {
    console.error('❌ Camera error:', error);
    handleCameraError(error);
  }
}

// Handle camera errors with user-friendly messages
function handleCameraError(error) {
  let errorMessage = 'Camera Access Denied';
  
  if (error.name === 'NotAllowedError') {
    errorMessage = 'Camera Permission Denied';
  } else if (error.name === 'NotFoundError') {
    errorMessage = 'No Camera Found';
  } else if (error.name === 'NotReadableError') {
    errorMessage = 'Camera In Use';
  }
  
  updateMoodDisplay(errorMessage, 'error');
}

// Enhanced video loaded handler
function handleVideoLoaded() {
  const displaySize = { 
    width: video.videoWidth, 
    height: video.videoHeight 
  };
  
  // Create and position canvas for face detection overlay
  const canvas = faceapi.createCanvasFromMedia(video);
  canvas.style.position = 'absolute';
  canvas.style.top = '1rem';
  canvas.style.left = '1rem';
  canvas.style.transform = 'scaleX(-1)';
  canvas.style.zIndex = '10';
  canvas.style.borderRadius = '15px';
  canvas.style.pointerEvents = 'none';

  const videoWrapper = document.querySelector('.video-wrapper');
  videoWrapper.appendChild(canvas);
  
  faceapi.matchDimensions(canvas, displaySize);
}

// Enhanced detection with smooth transitions
function startDetection() {
  if (!isModelLoaded) {
    console.warn('⚠️ Models not loaded yet');
    return;
  }
  
  console.log('🔍 Starting face detection...');
  updateMoodDisplay('Detecting...', 'detecting');
  
  detectionInterval = setInterval(async () => {
  if (!hasDetectedOnce) {
    await performDetection();
  }
}, 1500);
 // Slightly faster detection for better UX
}

// Enhanced detection logic
async function performDetection() {
  try {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    const displaySize = { 
      width: video.videoWidth, 
      height: video.videoHeight 
    };
    
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({
        inputSize: 416,
        scoreThreshold: 0.5
      }))
      .withFaceExpressions();

    // Clear previous drawings
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    
    // Draw detection boxes and expressions with enhanced styling
    if (detections.length > 0) {
      // Draw face detection box
      faceapi.draw.drawDetections(canvas, resizedDetections);
      
      // Process expressions
      const expressions = detections[0].expressions;
      const sortedExpressions = Object.entries(expressions)
        .sort((a, b) => b[1] - a[1]);
      
      const topExpression = sortedExpressions[0][0];
      const confidence = sortedExpressions[0][1];
      
      // Only update if confidence is high enough
      if (confidence > 0.3 && topExpression !== currentMood) {
        handleMoodChange(topExpression, confidence);
      }
      
      // Draw expression info on canvas
      drawExpressionInfo(ctx, sortedExpressions, resizedDetections[0]);
      
    } else {
      // No face detected
      if (currentMood !== 'no-face') {
        updateMoodDisplay('No Face Detected', 'no-face');
        hideAllFrames();
      }
    }
    
  } catch (error) {
    console.error('❌ Detection error:', error);
  }
}

// Enhanced mood change handling
function handleMoodChange(newMood, confidence) {
  console.log(`🎭 Mood changed: ${newMood} (${(confidence * 100).toFixed(1)}%)`);

  currentMood = newMood;
  updateMoodDisplay(newMood, newMood, confidence);
  showIframeForMood(newMood);
  addMoodChangeEffect(newMood);

  // 🛑 Stop after one successful detection
  hasDetectedOnce = true;
}


// Enhanced mood display update
function updateMoodDisplay(mood, type, confidence = 0) {
  const moodElement = document.getElementById('mood');
  
  // Remove all existing mood classes
  moodElement.className = 'mood-value';
  
  if (type && moodConfig[type]) {
    const config = moodConfig[type];
    moodElement.textContent = `${config.emoji} ${mood.charAt(0).toUpperCase() + mood.slice(1)}`;
    moodElement.classList.add(type);
  } else {
    moodElement.textContent = mood;
    if (type) moodElement.classList.add(type);
  }
  
  // Add confidence indicator for detected moods
  if (confidence > 0) {
    const confidenceBar = document.createElement('div');
    confidenceBar.style.cssText = `
      width: ${confidence * 100}%;
      height: 3px;
      background: linear-gradient(90deg, #4caf50, #8bc34a);
      margin-top: 8px;
      border-radius: 2px;
      transition: width 0.3s ease;
    `;
    moodElement.appendChild(confidenceBar);
  }
}

// Enhanced iframe display with smooth transitions
function showIframeForMood(mood) {
  const allFrames = document.querySelectorAll('.yt-frame');
  
  // Hide all frames
  allFrames.forEach(frame => {
    frame.style.display = 'none';
    frame.classList.remove('active');
  });
  
  const targetFrame = document.getElementById(`iframe-${mood}`);
  if (targetFrame) {
    targetFrame.style.display = 'block';
    
    // Add smooth transition
    setTimeout(() => {
      targetFrame.classList.add('active');
    }, 50);
    
    console.log(`🎵 Now playing: ${mood} music`);
  } else {
    console.warn(`⚠️ No music found for mood: ${mood}`);
  }
}

// Hide all frames
function hideAllFrames() {
  const allFrames = document.querySelectorAll('.yt-frame');
  allFrames.forEach(frame => {
    frame.style.display = 'none';
    frame.classList.remove('active');
  });
}

// Add visual effect for mood changes
function addMoodChangeEffect(mood) {
  const videoWrapper = document.querySelector('.video-wrapper');
  
  // Create ripple effect
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${moodConfig[mood]?.color || '#fff'};
    transform: translate(-50%, -50%);
    animation: ripple 1s ease-out;
    pointer-events: none;
    z-index: 15;
  `;
  
  videoWrapper.appendChild(ripple);
  
  // Remove ripple after animation
  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple);
    }
  }, 1000);
}

// Draw expression information on canvas
function drawExpressionInfo(ctx, expressions, detection) {
  const box = detection.detection.box;
  const drawBox = {
    x: box.x,
    y: box.y - 60,
    width: box.width,
    height: 50
  };
  
  // Draw semi-transparent background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(drawBox.x, drawBox.y, drawBox.width, drawBox.height);
  
  // Draw top 3 expressions
  ctx.fillStyle = '#ffffff';
  ctx.font = '12px Inter, sans-serif';
  
  expressions.slice(0, 3).forEach((expr, index) => {
    const [emotion, score] = expr;
    const text = `${emotion}: ${(score * 100).toFixed(0)}%`;
    ctx.fillText(text, drawBox.x + 5, drawBox.y + 15 + (index * 12));
  });
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    0% {
      width: 20px;
      height: 20px;
      opacity: 1;
    }
    100% {
      width: 200px;
      height: 200px;
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Enhanced cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (detectionInterval) {
    clearInterval(detectionInterval);
  }
  
  if (video.srcObject) {
    const tracks = video.srcObject.getTracks();
    tracks.forEach(track => track.stop());
  }
});
scanButton.addEventListener("click", () => {
  hasDetectedOnce = false;
  updateMoodDisplay("Detecting...", "detecting");
});


// Initialize the application
console.log('🚀 Smart Mood Music Player initializing...');
loadModels();