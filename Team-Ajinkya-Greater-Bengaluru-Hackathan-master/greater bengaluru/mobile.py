import numpy as np
import sounddevice as sd

# Generate an ultrasonic wave (e.g., 21 kHz)
sample_rate = 44100  # Standard audio rate
frequency = 21000    # Ultrasonic frequency (above 20 kHz)
duration = 2.0       # 2 seconds

# Create a sine wave
t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
wave = 0.5 * np.sin(2 * np.pi * frequency * t)

# Play the sound
sd.play(wave, sample_rate)
sd.wait()
