# code_server/Dockerfile
FROM node:18-slim

# install python3
RUN apt-get update && apt-get install -y python3 python3-pip

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# copy your code
COPY . .

# listen on the PORT env var
ENV PORT=${PORT}
CMD ["npm","start"]
