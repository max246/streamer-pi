#sudo DEBIAN_FRONTEND=noninteractive apt install -y netfilter-persistent iptables-persistent
sudo cp ui.conf /etc/supervisor/conf.d/ui.conf

cd ..
sudo pip3 install -r requirements.txt

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

sudo mkdir /etc/stunnel/conf.d

sudo cat > /etc/stunnel/conf.d/instagram.conf  <<EOF
[insta-live]
client = yes
accept = 127.0.0.1:19350
connect = live-api-s.facebook.com:443
verifyChain = no
EOF

sudo systemctl restart stunnel4



sudo supervisorctl reload

