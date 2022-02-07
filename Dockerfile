FROM ubuntu:20.04
USER root
RUN apt update
RUN apt install -y curl
RUN cd ~
RUN curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt install nodejs
RUN node --version
RUN npm --version
RUN npm install --global yarn
WORKDIR /app
COPY ./package.json ./
RUN yarn install
COPY . .
CMD ["yarn", "run", "start"]