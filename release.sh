mkdir release
mkdir release/streamer-pi
mkdir release/streamer-pi/ui
mkdir release/streamer-pi/streamer
mkdir release/streamer-pi/hostap
cd ui
npm run build
cd ..
cp -r hostap/* release/streamer-pi/hostap/
cp -r streamer/install release/streamer-pi/streamer/
cp -r streamer/utils   release/streamer-pi/streamer/
cp -r streamer/app.py release/streamer-pi/streamer/
cp -r streamer/requirements.txt release/streamer-pi/streamer/
cp -r ui/build release/streamer-pi/ui/
cp -r ui/install release/streamer-pi/ui/
cp -r ui/lib release/streamer-pi/ui/
cp -r ui/app.py release/streamer-pi/ui/
cp -r ui/default.cfg.bck  release/streamer-pi/ui/default.cfg
cp -r ui/requirements.txt release/streamer-pi/ui/
cp -r ui/README.md release/streamer-pi/ui/
cp -r README.md release/streamer-pi/
cp -r install.sh release/streamer-pi/
cd release
tar cvfz ../release.tar streamer-pi/
