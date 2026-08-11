FROM node:24-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npx prisma generate && npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/app.js"]
