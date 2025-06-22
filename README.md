
# 🎵 Smart Mood Music Player 🎭

An AI-powered facial expression-based music player that detects your current mood through webcam analysis and plays YouTube music videos that match your emotions — happy, sad, angry, and more. Built using `face-api.js` and pure HTML, CSS, and JavaScript.

---

## 🌟 Features

- 🎥 Real-time face detection using webcam
- 🧠 Emotion recognition with `face-api.js`
- 🎶 Plays embedded YouTube music based on mood
- ✨ Beautiful, animated glassmorphism UI
- 🎭 Manual "Scan Mood" button — detect once, play once
- 💾 Works offline with locally hosted AI models

---

## 📸 How It Works

1. Click **Scan Mood**.
2. The camera captures your face and detects expressions like happy, sad, angry, etc.
3. Based on the dominant emotion, a corresponding **mood-based YouTube music video** is shown.

---

## 🧠 Technologies Used

- **HTML, CSS, JS**
- **face-api.js** (facial expression detection)
- **YouTube Embed API** (for music playback)
- **Webcam API** (`getUserMedia`)
- **Offline Model Hosting** for `face-api.js` (loaded from `/models` folder)

---

## 📁 Project Structure

```
📦 Smart Mood Music Player
├── index.html            # Main HTML page
├── styles.css            # Glassmorphism UI styles
├── script.js             # Detection and mood logic
├── /models               # face-api.js pre-trained models (hosted locally)
│   ├── face_expression_model-shard1
│   ├── face_expression_model-weights_manifest.json
│   ├── ...
```

---

## 🔧 Setup Instructions

### 1. Clone the repo / Download the files

```bash
git clone https://github.com/your-username/smart-mood-music-player.git
```

Or just download the ZIP.

---

### 2. Download face-api.js models

Download the required models from:

👉 https://github.com/justadudewhohacks/face-api.js-models

Place them inside a folder named `/models` in the project root. You should have files like:

- `face_expression_model-weights_manifest.json`
- `face_expression_model-shard1`
- `tiny_face_detector_model-shard1`
- etc.

📁 It should look like: `./models/face_expression_model-...`

---

### 3. Run Locally

Just open `index.html` in your browser. No build process needed.

📸 **Allow camera access** when prompted.

---

## 📷 Supported Emotions

| Emoji | Mood        |
|-------|-------------|
| 😊    | Happy       |
| 😢    | Sad         |
| 😠    | Angry       |
| 😐    | Neutral     |
| 🤢    | Disgusted   |

Each mood triggers a different embedded YouTube video.

---

## 💡 Credits

- [face-api.js](https://github.com/justadudewhohacks/face-api.js)
- YouTube for music streaming
- Google Fonts: Orbitron, Inter

---

## 📜 License

MIT License

---

## 🚀 Future Ideas

- Add voice commands (e.g., “play sad song”)
- Auto-skip when mood changes
- Save mood history / stats
- Dark mode / light mode toggle

---

🎧 Made with ❤️ to make music more personal.
