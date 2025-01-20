# FROM ubuntu
FROM node:20.17.0-alpine3.19

# RUN apt-get update
# RUN apt install -y curl

# RUN curl -sL  https://deb.nodesource.com/setup_22.x -o /tmp/nodesource_setup.sh
# RUN bash /tmp/nodesource_setup.sh
# RUN apt install -y nodejs
# Node js version 22 is installed

# COPY ./src/app/layout.tsx  /home/clumsyReader/src/app/layout.tsx
# Copying the layout.tsx file to the container at /home/clumsyReader/src/app/layout.tsx
# COPY ./src/app/page.tsx  /home/clumsyReader/src/app/page.tsx



COPY . ./home/clumsyReader/
COPY package.json /home/clumsyReader/package.json
COPY package-lock.json /home/clumsyReader/package-lock.json

WORKDIR /home/clumsyReader/

RUN npm install
# Will create a node_modules folder in the container

EXPOSE 3000 
# means this port can be exposed

CMD ["npm", "run","dev"]