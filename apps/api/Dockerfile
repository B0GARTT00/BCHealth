FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages packages
COPY prisma prisma
RUN npm install
COPY apps/api apps/api
EXPOSE 3000
CMD ["npm", "run", "dev", "--workspace", "@bchealth/api"]
