import subprocess
import os
import configparser
import threading
import time


class Stream:

    def __init__(self):
        print("hello")
        self._process = None
        self._is_streaming = False
        self._clients = None
        self._insta_live = None
        self._thread = StreamThread(self)
        self._thread.daemon = True
        self._thread.start()

        self._input = ""
        self._params = {"youtube": {"url": "", "key": "", "fps": "0", "quality": "", "vbr": ""},
                        "twitch": {"url": "", "key": "", "fps": "0", "quality": "", "vbr": ""},
                        "instagram": {"user": "", "pass": "", "fps": "0", "quality": "", "vbr": ""}}

        self.parse_config()

    def parse_config(self):
        config = configparser.ConfigParser()
        config.read('../ui/default.cfg')
        for (item, value) in config.items("youtube"):
            self._params["youtube"][item] = value

        for (item, value) in config.items("twitch"):
            self._params["twitch"][item] = value

        for (item, value) in config.items("instagram"):
            self._params["instagram"][item] = value

        self.set_input(config.get("http", "device"))

    def set_clients(self, clients):
        self._clients = clients

    def set_input(self, input):
        self._input = input

    def is_streaming(self):
        return self._is_streaming


    def start_stream(self):
        cmds = self.get_cmd("instagram")
        print(cmds)
        self._process = subprocess.Popen(cmds, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,universal_newlines=True)
        self._is_streaming = True
 
    def get_stdout(self):
        try:
            if self._process is not None:
                return self._process.stdout
        except:
            print("Error getting the stdout")
        return None

    def get_cmd(self, provider):
        if provider == 'youtube':
            quality = self._params['youtube']['quality']
            fps = self._params['youtube']['fps']
            vbr = self._params['youtube']['vbr']
            url = self._params['youtube']['url']
            key = self._params['youtube']['key']
            return ["/usr/bin/ffmpeg", "-ac", "1", "-f" , "alsa", "-i", "default", "-acodec", "aac",
                    "-i", str(self._input), "-vcodec", "libx264", "-pix_fmt","yuv420p",
                    "-preset", quality, "-framerate", fps , "-b:v", vbr, "-f" ,"flv", "{}/{}".format(url, key)]
        elif provider == 'twitch':
            quality = self._params['twitch']['quality']
            fps = self._params['twitch']['fps']
            vbr = self._params['twitch']['vbr']
            url = self._params['twitch']['url']
            key = self._params['twitch']['key']
            return ["/usr/bin/ffmpeg", "-ac", "1", "-f", "alsa", "-i", "default", "-acodec", "aac",
                    "-i", str(self._input), "-vcodec", "libx264", "-pix_fmt", "yuv420p",
                    "-preset", quality, "-framerate", fps, "-b:v", vbr, "-f", "flv", "{}{}".format(url, key)]
        elif provider == 'instagram':
            quality = self._params['instagram']['quality']
            fps = self._params['instagram']['fps']
            vbr = self._params['instagram']['vbr']
            url = self._params['twitch']['url']
            key = self._params['twitch']['key']
            return ["/usr/bin/ffmpeg", "-ac", "1", "-f", "alsa", "-i", "default", "-acodec", "aac",
                    "-i", str(self._input), "-vcodec", "libx264", "-pix_fmt", "yuv420p", "-s","720x1280",
                    "-preset", quality, "-framerate", fps, "-b:v", vbr, "-f", "flv", "{}/{}".format(url, key)]
            return None

    def list_videos(self):
        found = []
        for line in os.listdir("/dev/"):
            if line.find("video") >= 0:
                found.append("/dev/{}".format(line))
        return found


    def send_client(self, output):
        for client in self._clients:
            client.send_message(output)


class StreamThread(threading.Thread):

    def __init__(self, stream):
        threading.Thread.__init__(self)
        self._stream = stream
        self._stdout = None

    def run(self):
        while True:
            if self._stream.is_streaming():
                if self._stdout is None:
                    print("stdout is none, trying to get one")
                    self._stdout = self._stream.get_stdout()
                else:
                    try:
                        line = self._stdout.readline()
                        if line:
                            print(line)
                            self._stream.send_client(line)
                    except:
                        pass
                        #print("error reading line")
            time.sleep(.1)   

