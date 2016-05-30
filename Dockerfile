FROM hypriot/rpi-node:slim

ADD src/ /src
WORKDIR /src

RUN npm install

EXPOSE 80

CMD ["node", "server.js"]
