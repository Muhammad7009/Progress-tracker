FROM node:20-slim

WORKDIR /app

RUN npm config set fetch-retry-maxtimeout 600000 && \
    npm config set fetch-retry-mintimeout 100000 && \
    npm config set fetch-retries 10

COPY package*.json /app/
RUN npm install --network-timeout=1000000 --no-audit

COPY . /app

EXPOSE 5173

# 💡 Fixed: Vite projects use 'npm run dev' to spin up the local server
CMD ["npm", "run", "dev"]
# ... rest of your Dockerfile steps ...


