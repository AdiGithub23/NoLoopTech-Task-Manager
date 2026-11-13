FROM node:24-bookworm
WORKDIR /app
ENV DATABASE_URL="file:/data/dev.db"
COPY . .
RUN npm ci
RUN npm run build
EXPOSE 3001
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]