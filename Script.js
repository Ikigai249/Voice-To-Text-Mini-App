// --- 1. Check for Browser Support ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Fatal Error: Your browser does not support the Web Speech API. Please use Chrome or Edge.");
    document.querySelector('.app-container').innerHTML = "<h1>Browser Not Supported</h1>";
} else {

    // --- 2. Setup Recognition Object ---
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening until stopped manually
    recognition.interimResults = true; // Show results *while* speaking
    recognition.lang = 'en-US'; // Set your language

    // --- 3. Grab UI Elements ---
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const clearBtn = document.getElementById('clear-btn');
    const notePaper = document.getElementById('note-paper');

    // State variable to handle interim results
    let finalTranscript = '';

    // --- 4. Define Event Listeners ---

    startBtn.addEventListener('click', () => {
        // Start the API
        recognition.start();

        // Remove placeholder on first use
        const placeholder = notePaper.querySelector('.placeholder');
        if (placeholder) { notePaper.innerHTML = ''; }
    });

    stopBtn.addEventListener('click', () => {
        // Stop the API
        recognition.stop();
    });

    clearBtn.addEventListener('click', () => {
        // Simple Confirmation before wiping data
        if (confirm("Are you sure you want to clear your notes?")) {
            finalTranscript = '';
            notePaper.innerHTML = '<p class="placeholder">Notes cleared. Tap Start.</p>';
        }
    });

    // --- 5. Speech Recognition Logic ---

    // A. Visual Feedback: App Starts Listening
    recognition.onstart = () => {
        // Toggle active button UI
        startBtn.classList.add('listening');
        startBtn.textContent = 'Listening...';
        startBtn.disabled = true; // Prevent multiple starts

        stopBtn.disabled = false; // Enable stop button
    };

    // B. Main Logic: Receiving Results
    recognition.onresult = (event) => {
        let interimTranscript = '';

        // Restart finalTranscript loop on new results
        interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + ' ';
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        // --- 6. The UI Output ---
        // We display final text clearly, and show interim text in light grey
        notePaper.innerHTML = `
            ${finalTranscript}
            <span style="color: #999; font-style: italic;">${interimTranscript}</span>
        `;
        
        // Auto-scroll paper to bottom as text adds up
        notePaper.scrollTop = notePaper.scrollHeight;
    };

    // C. Visual Feedback: App Stops Listening (or errors)
    recognition.onend = () => {
        // Reset button UI
        startBtn.classList.remove('listening');
        startBtn.textContent = 'Resume Listening';
        startBtn.disabled = false;

        stopBtn.disabled = true; // Disable stop button again
    };

    // D. Error Handling (Optional but polite)
    recognition.onerror = (event) => {
        console.error("Speech Recognition Error", event.error);
        if(event.error === 'not-allowed'){
            alert("Please allow microphone access to use this app.");
        }
    };
}
