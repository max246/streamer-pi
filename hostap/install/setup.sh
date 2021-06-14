sudo rfkill unblock 0
sudo ifconfig wlan0 up


sudo systemctl unmask hostapd

sudo systemctl disable hostapd
sudo systemctl disable dnsmasq

cat > /etc/hostapd/hostapd.conf <<EOF
#2.4GHz setup wifi 80211 b,g,n
interface=wlan0
driver=nl80211
ssid=StreamerPi
hw_mode=g
channel=8
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=1234567890
wpa_key_mgmt=WPA-PSK
wpa_pairwise=CCMP TKIP
rsn_pairwise=CCMP

#80211n - Change GB to your WiFi country code
country_code=GB
ieee80211n=1
ieee80211d=1
EOF


sudo cat >> /etc/default/hostapd  <<EOF
DAEMON_CONF="/etc/hostapd/hostapd.conf"
EOF

cat >> /etc/dnsmasq.conf <<EOF
#AutoHotspot config
interface=wlan0
bind-dynamic 
server=8.8.8.8
domain-needed
bogus-priv
dhcp-range=192.168.4.150,192.168.4.200,12h
EOF


## Change sudo nano /etc/sysctl.conf  to net.ipv4.ip_forward=1

if grep -q "#net.ipv4.ip_forward" "/etc/sysctl.conf"; then
sed -i 's/#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/' /etc/sysctl.conf
fi

cat >>  /etc/dhcpcd.conf <<EOF
nohook wpa_supplicant
EOF


## Add this to /etc/wpa_supplicant/wpa_supplicant.conf 
#country=GB
#network={
#        ssid="wifi"
#        psk="pass"
#}

if ! grep -q "network=" "/etc/wpa_supplicant/wpa_supplicant.conf"; then
sudo cat >> /etc/wpa_supplicant/wpa_supplicant.conf  <<EOF
country=GB
network={
        ssid="wifi"
        psk="pass"
}
EOF
fi

sudo cp checkap.conf /etc/supervisor/conf.d/checkap.conf

sudo supervisorctl  reload
sudo ifconfig wlan0 up
sh ../startap.sh
