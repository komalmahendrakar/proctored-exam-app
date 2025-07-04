import eventlet
eventlet.monkey_patch()

import pyaudio
import numpy as np
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import gevent

# Initialize Flask app and WebSocket
app = Flask(__name__)
socketio = SocketIO(app)

# Audio settings for SDR data capture
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 48000  # Assuming 48kHz sample rate
CHUNK = 512  # Reduce the buffer size for faster processing
SLEEP_INTERVAL = 0.05  # Reduce the rate at which we send data

# Initialize PyAudio
p = pyaudio.PyAudio()

# Open the audio stream (replace with your audio device input for HDSDR)
stream = p.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)

# Route for rendering the web page
@app.route('/')
def index():
    return render_template('arp.html')  # Make sure to create arp.html in templates folder

# Function to capture and process the audio data
def process_audio_data():
    while True:
        # Capture audio data
        data = stream.read(CHUNK)
        audio_samples = np.frombuffer(data, dtype=np.int16)

        # Perform FFT to get the frequency spectrum
        spectrum = np.fft.fft(audio_samples)
        spectrum = np.abs(spectrum[:CHUNK // 2])  # Get magnitude of the FFT

        # Normalize and convert to dB scale
        spectrum_db = 20 * np.log10(spectrum + 1e-6)

        # Emit data to the frontend via WebSocket
        socketio.emit('audio_data', {'spectrum': spectrum_db.tolist()})

        # Sleep to control the rate of data emission
        socketio.sleep(SLEEP_INTERVAL)  # Control the rate at which data is sent

# Start processing audio in a separate greenlet (asynchronous task)
@socketio.on('connect')
def handle_connect():
    print("Client connected")
    # Start a background task to process and emit audio data
    socketio.start_background_task(target=process_audio_data)

if __name__ == '__main__':
    # Run the Flask app and the WebSocket server using Gevent
    socketio.run(app, host='127.0.0.1', port=5000, use_reloader=False)
