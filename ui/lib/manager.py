import os
import configparser
import time
import datetime
import shutil
import subprocess


from lib.instagram import *

class Manager:

    def __init__(self,config,config_file):
        self._providers = []
        self._config = config
        self._config_file = config_file

    def get_providers(self):
        self._providers = []
        print(self._config.sections())
        for section in self._config.sections():
            if section.find("http") == -1:
                self._providers.append(section)
        return self._providers

    def get_active_provider(self):
        return self._config.get("http","active")

    def get_provider(self, provider):
        params = []
        try:
            for option in self._config.options(provider):
                params.append([option, self._config.get(provider,option)])
        except:
             print("error pulling provider")
        return params

    def update(self, data):
        provider = data['provider']
        params = data['params']
        try:
            for (key, value) in params:
                self._config.set(provider,key,value)
            self.save()
            return True
        except:
             print("error")
             return False

    def set_active_provider(self, provider):
        try:
            self._config.set("http", "active", provider)
            self.save()
            return True
        except:
            print("Error saving")
            return False

    def save(self):
        with open(self._config_file, 'w') as configfile:
            self._config.write(configfile)

    def start_streaming(self, provider):
        os.system("sudo supervisorctl restart stream")
        return True

    def stop_streaming(self):
        os.system("sudo supervisorctl stop stream")
        return True

    def list_devices(self):
        found = []
        for line in os.listdir("/dev/"):
            if line.find("video") >= 0:
                found.append("/dev/{}".format(line))
        return found

    def list_audio(self):
        found = []
        process = subprocess.Popen(['arecord', '-L'],
                                 stdout=subprocess.PIPE, stderr=subprocess.STDOUT,universal_newlines=True)
        for line in iter(process.stdout.readline,''):
            output = line.rstrip()
            #if len(output.replace("    ", "")[0:4])>= 0:
            cut_front = output[0:4]
            remove_space = cut_front.replace("    ", "")
            if len(remove_space) > 0:
                found.append(output)
        return found


    def get_settings(self):
        settings = {"device":"", "pass":""}
        settings["device"] = self._config.get("http","device")
        settings["audio"] = self._config.get("http","audio")
        settings["pass"] =self._config.get("http","password")
        settings["stunnel"] =self._config.get("http","stunnel")
        return settings

    def set_settings(self, settings):
        self._config.set("http","device", settings['device'])
        self._config.set("http","audio", settings['audio'])
        self._config.set("http","password", settings['pass'])
        self._config.set("http","stunnel", settings['stunnel'])
        self.save()
        os.system("sudo sed -i -e '/connect =/ s/= .*/= "+settings['stunnel']+"/' /etc/stunnel/conf.d/instagram.conf")
        os.system("sudo systemctl restart stunnel4")

    def login_instagram(self, user, password):
        print("insta", user, password)
        self._instagram  = Instagram(username=user, password=password)
        if self._instagram.login():
            return True
        else:
            return False

    def require_two_fact(self):
        return self._instagram.is_two_factor()

    def two_factor(self, code):

        if self._instagram.two_factor(code):
            return True
        else:
            return False

    def create_broadcast(self):
        return self._instagram.create_broadcast()

    def start_broadcast(self):
        return self._instagram.start_broadcast()

    def get_instagram_stream(self):
        return [self._instagram.stream_server, self._instagram.stream_key]

    def end_broadcast(self):
        return self._instagram.end_broadcast()

    def get_status_stream(self):
        return self._instagram.get_status_stream()

    def get_status_login(self):
        return self._instagram.is_loggedin()

    def scan_wifi(self):
        #sudo iw dev wlan0 scan ap-force |  egrep "^BSS|SSID:"


