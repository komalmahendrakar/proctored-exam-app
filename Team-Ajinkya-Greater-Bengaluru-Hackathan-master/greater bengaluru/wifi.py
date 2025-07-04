import os
import re
from flask import Flask, render_template

app = Flask(__name__)

def get_connected_devices():
    arp_result = os.popen("arp -a").read()
    ip_addresses = re.findall(r"\d+\.\d+\.\d+\.\d+", arp_result)

    devices = []
    
    for ip in ip_addresses:
        netbios_result = os.popen(f"nbtstat -A {ip}").read()
        match = re.search(r"(\S+)\s+<00>\s+UNIQUE", netbios_result)
        device_name = match.group(1) if match else "Unknown"
        devices.append((ip, device_name))

    return devices

@app.route("/")
def index():
    devices = get_connected_devices()
    return render_template("wifi.html", devices=devices)

if __name__ == "__main__":
    app.run(debug=True)
