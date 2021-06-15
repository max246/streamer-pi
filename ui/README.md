# UI 

The UI is part of the main core of the streamer PI, it contains the main site made in React and the backend made in Python.
If you are cloning the repo on your PI, it will be better to create the files on your machine or download the release package.


The current software has been fully tested on:
- Raspberry PI 4.0 with Raspbian
- Eachine ROTG02

You can use other devices to capture the feed but you will need to configure the paramters under settings. If you are deciding to use something else than a Raspberry PI, you will need to double check about some hardcoded NETWORK interface during the setup.
## Usage

Once the UI is running, you can access via http://192.168.4.5 if you are connected with the hotspot or you have to replace the IP with your local machine network.

* User: admin
* Pass: test

Password can be changed in the configuration once logged in.

You will need to configure Twitch, Youtube or Instagram, it depends which service you want to use.

### Youtube and Twitch

Twitch and Youtube are straight forward to configure, just need to retrive a KEY to be able to stream.

### Instagram

Instagram configuration is a bit more complicated, you would need to go into Provider, click on the Instagram button and proceed with a Login, be sure none of the information are saved or sent anywhere other than Instagram servers!

Once you have successfully logged in, you would need to start a broadcast and a stream, there will be buttons to be pressed on the screen. 

You would then copy the server part which should look like this `live-upload.instagram.com:443` and paste in the STUNNEL field under settings. This URL might change depending what Instagram decide so double check before going live.

You would also need to save the KEY and update it in the Instagram provider but dont touch the URL field as it is configured to use STUNNEL to stream over RTMPS.

### Start streaming

Once you have activated the right provider and selected the video and audio device in the settings, you are ready to stream.

Go to the home page and press START STREAM, there will be a real time output from FFMPEG to inform you about the current streaming status and any potentially issues.



## Structure

* src

It contains all the source code from React which you need to compile and then move the folder BUILD to the machine that you want to run the software

* public

This is part of React which is used when compiling

* lib

It contains files for the backend

* install

It contains data and script to run when you need to install the project

## Install

With a fresh install on your Raspberry Pi, run the script 
`install/setup.sh`
which will install:
* python3
* ffmpeg
* stunnel4: needed to enable rtmps as ffmpeg is not compiled by default
* supervisor: needed to run the scripts
* hostapd and dnsmasq: needed to setup hotspot


## Stunnel4

This is an imporant part if you want to stream to Instagram due to ffmpeg not being compiled with rtmps.

When installing you will need to change this manually: 

`sudo nano /etc/sysctl.conf`

uncomment 

`net.ipv4.ip_forward=1`


## Compile source

The website need to be compiled if any changes or you are not using the release package and it will create a build folder which the backend will fetch for the hosting.

We suggest to run `npm run build` on a PC due to the Raspberry Pi taking too long to comile the source.


## Configuration

You would need to pre-configure the `default.cfg` with some of the setting such as  `wifidev`  and `password`.
These are important due to be the main information when login in the web interface and be able to connect to a wifi network.

# Run UI

To run the UI is very simple, supervisor is taking care to run the script and restart if there is any issue. 

The current paths are configured for a Raspberry pi, if you want to run it on another machine or different path, make sure you change them before running it.
