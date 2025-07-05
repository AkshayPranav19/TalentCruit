
FROM node:18-slim
RUN apt-get update && apt-get install -y python3 python3-pip
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
ENV PORT=${PORT}
CMD ["npm","start"]
