#UI 

The UI is part of the main core of the streamer PI, it contains the main site made in React and the backend made in Python.
If you are cloning the repo on your PI, it will be better to create the files on your machine or download the release package.

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
