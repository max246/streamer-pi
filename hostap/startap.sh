wpa_cli terminate wlan0 >/dev/null 2>&1
ip link set dev wlan0 down
ip a add 192.168.4.5/24 brd + dev wlan0
ip link set dev wlan0 up
dhcpcd -k wlan0 >/dev/null 2>&1
iptables -t nat -A POSTROUTING -o  eth0 -j MASQUERADE
iptables -A FORWARD -i eth0 -o wlan0 -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A FORWARD -i wlan0 -o eth0 -j ACCEPT
systemctl start dnsmasq
systemctl start hostapd
echo 1 > /proc/sys/net/ipv4/ip_forward
