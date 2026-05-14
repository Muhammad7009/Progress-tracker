FROM node:20-slim

WORKDIR /app

# 1. Increase the timeout limit and retries
RUN npm config set fetch-retry-maxtimeout 600000
RUN npm config set fetch-retry-mintimeout 100000
RUN npm config set fetch-retries 10

# 2. Use a faster, lighter install
COPY package*.json ./
RUN npm install --network-timeout=1000000 --no-audit

COPY . .
CMD ["npm", "run", "dev", "--", "--host"]
