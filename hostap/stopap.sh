ip link set dev wlan0 down
systemctl stop hostapd
systemctl stop dnsmasq
iptables -D FORWARD -i eth0 -o wlan0 -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -D FORWARD -i wlan0 -o eth0 -j ACCEPT
echo 0 > /proc/sys/net/ipv4/ip_forward
ip addr flush dev wlan0
ip link set dev wlan0 up
dhcpcd  -n wlan0 >/dev/null 2>&1
wpa_supplicant -B -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf
