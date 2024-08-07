# Dockerfile for TeamMate React Frontend
FROM node:14-alpine

WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/

RUN npm install

COPY . /app/

RUN npm run build
ENV REACT_APP_API_URL=http://taskmanager-backend:8000/api/
CMD ["npx", "serve", "-s", "build"]