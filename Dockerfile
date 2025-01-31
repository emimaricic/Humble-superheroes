FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_API_URL
ARG SECRET_COOKIE_PASSWORD
ARG NODE_ENV
RUN npm i --legacy-peer-deps
COPY . .
RUN npm run build
RUN npm prune --production --legacy-peer-deps
ENTRYPOINT ["npm", "run", "start"]
