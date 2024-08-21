# Dockerfile for TeamMate React Frontend
FROM node:14-alpine
WORKDIR /app
COPY package.json /app/
COPY package-lock.json /app/
RUN npm install
COPY . /app/
RUN npm run build
# Command when running in DinD container
# CMD ["npx", "serve", "-s", "build", "-l", "0.0.0.0"]
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]