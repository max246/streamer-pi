import subprocess
import configparser
import time
import os

config = configparser.ConfigParser()
config.read('../ui/default.cfg')

STATUS_HS = 1
STATUS_CONNECTING = 2
STATUS_CONNECTED = 3

def check_wifi():
    wifidev = config.get("http","wifidev")
    cmds = ["sudo", "wpa_cli", "-i", wifidev, "status"]
    p =  subprocess.Popen(cmds, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,universal_newlines=True)
    stdout = p.stdout
    while True:
        line = stdout.readline()
        if not line:
            break
        if line.find("Failed to connect") >= 0:
            return STATUS_HS
        if line.find("SCANNING") >= 0:
            return STATUS_CONNECTING
        if line.find("ip_address=") >= 0:
            return STATUS_CONNECTED

    return STATUS_CONNECTING



while True:
    status = check_wifi()

    print("Status", status)
    if status == STATUS_CONNECTING: #No much happening so lets force to AP
        os.system("sudo sh /home/pi/streamer-pi/hostap/startap.sh")

    time.sleep(60)

