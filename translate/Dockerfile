FROM node:alpine

WORKDIR /usr/app 

COPY package*.json ./

# RUN npm install -g nodemon
RUN npm install

COPY . /usr/app

EXPOSE 8080 

CMD ["npm" , "start"]
# CMD ["nodemon"]