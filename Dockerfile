FROM hypriot/rpi-node:latest

RUN apt-get update && apt-get install -y build-essential python libreadline-dev libusb-dev libical-dev libglib2.0-dev libdbus-1-dev bluetooth bluez libbluetooth-dev libudev-dev libcap2-bin

ADD src/ /src
WORKDIR /src

RUN sudo npm install

EXPOSE 80

CMD ["node", "server.js"]
