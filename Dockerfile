FROM hypriot/rpi-node:latest

ADD src/ /src
WORKDIR /src

RUN npm install

EXPOSE 80

CMD ["node", "server.js"]
