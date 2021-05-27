sudo apt-get install python3 ffmpeg pip3 stunnel4 supervisor hostapd dnsmasq
sudo DEBIAN_FRONTEND=noninteractive apt install -y netfilter-persistent iptables-persistent

cd ..
sudo pip3 install -r r.txt

sudo touch /etc/stunnel/stunnel.conf

sudo cat >  /etc/stunnel/stunnel.conf <<EOF
setuid = stunnel4
setgid = stunnel4
pid=/tmp/stunnel.pid
output = /var/log/stunnel4/stunnel.log
include = /etc/stunnel/conf.d
EOF

sudo cat >> /etc/default/stunnel4 <<EOF
ENABLE=1

EOF

sudo cat > /etc/stunnel/conf.d/instagram.conf  <<EOF
[fb-live]
client = yes
accept = 127.0.0.1:19350
connect = live-api-s.facebook.com:443
verifyChain = no
EOF

sudo systemctl restart stunnel4
sudo systemctl status stunnel4


sudo cat > /etc/hostapd/hostapd.conf <<EOF
country_code=GB
interface=wlan0
ssid=NameOfNetwork
hw_mode=g
channel=7
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=AardvarkBadgerHedgehog
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
EOF

sudo systemctl unmask hostapd
sudo systemctl enable hostapd

systemctl stop hostapd
systemctl stop dnsmasq