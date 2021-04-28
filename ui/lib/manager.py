import os
import configparser
import time
import datetime
import shutil

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
        os.system("sudo supervisorctl restart streamer")
        return True

    def stop_streaming(self):
        os.system("sudo supervisorctl stop streamer")
        return True