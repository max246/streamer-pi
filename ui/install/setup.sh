sudo apt-get install python3 ffmpeg pip3 stunnel4 supervisor
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

