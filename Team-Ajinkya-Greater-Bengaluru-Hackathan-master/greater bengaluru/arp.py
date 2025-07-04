from flask import Flask
from flask_socketio import SocketIO, emit
import numpy as np

app = Flask(__name__)
socketio = SocketIO(app)

# Emit SDR data
@app.route('/start')
def start():
    # Simulate frequency spectrum data (replace with actual SDR data)
    while True:
        spectrum = np.random.rand(1024) * 100  # Dummy data
        socketio.emit('audio_data', {'spectrum': spectrum.tolist()})
        socketio.sleep(0.1)  # Sleep for 100ms to simulate real-time updates

if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=5000)
