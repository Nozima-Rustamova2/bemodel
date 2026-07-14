FROM node:20-slim AS base

WORKDIR /app
COPY package.json ./
RUN npm install

COPY . .

# Passed at build time so Next.js can bake in the API URL for the browser bundle
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
