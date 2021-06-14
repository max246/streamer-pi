sudo apt-get update
sudo apt-get upgrade -y 

sudo apt-get purge -y  dns-root-data
sudo apt-get install -y  hostapd dnsmasq   python3 ffmpeg python3-pip supervisor stunnel4

mkdir /home/pi/log
sudo mkdir /etc/supervisor/conf.d/

cd ./hostap/install/
sh setup.sh
cd ../../streamer/install
sh setup.sh
cd ../../ui/install
sh setup.sh
echo "Done"
echo " ----------- "
echo "Please reboot to make sure everything is setup properly"
