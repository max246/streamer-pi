
#Check if connected
#wpa_cli -i wlan0 status | grep "ip_address"
'''
if good you get
ip_address=192.168.50.14
otherwise
Failed to connect to non-global ctrl_ifname: wlan0  error: No such file or directory
'''

#terminat
#wpa_cli terminate wlan0

#start hostspot
'''
    ip link set dev wlan0 down
    ip a add 192.168.50.5/24 brd + dev wlan0
    ip link set dev wlan0 up
    dhcpcd -k wlan0 >/dev/null 2>&1
    iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
    iptables -A FORWARD -i eth0 -o wlan0 -m state --state RELATED,ESTABLISHED -j ACCEPT
    iptables -A FORWARD -i  wlan0 -o eth0 -j ACCEPT
    systemctl start dnsmasq
    systemctl start hostapd
    echo 1 > /proc/sys/net/ipv4/ip_forward
'''

#kill hostpot

'''
ip link set dev wlan0 down
    systemctl stop hostapd
    systemctl stop dnsmasq
    iptables -D FORWARD -i eth0 -o wlan0 -m state --state RELATED,ESTABLISHED -j ACCEPT
    iptables -D FORWARD -i wlan0 -o "$ethdev" -j ACCEPT
    echo 0 > /proc/sys/net/ipv4/ip_forward
    ip addr flush dev wlan0
    ip link set dev wlan0 up
    dhcpcd  -n wlan0 >/dev/null 2>&1
    '''

#activate wifi
#wpa_supplicant -B -i "$wifidev" -c /etc/wpa_supplicant/wpa_supplicant.conf