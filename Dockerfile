FROM ghcr.io/puppeteer/puppeteer:20.7.3

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/user/bin/google-bin-stable

WORKDIR /user/src/app

COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node","index.js"]
