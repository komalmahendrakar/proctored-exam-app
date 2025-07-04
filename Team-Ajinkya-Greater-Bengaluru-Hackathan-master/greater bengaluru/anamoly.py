from ctypes import cdll

# Load ExtIO plugin
extio = cdll.LoadLibrary("ExtIO_YourPlugin.dll")

# Initialize and stream data
extio.InitHW()
extio.StartHW(2400000)  # Set sample rate
