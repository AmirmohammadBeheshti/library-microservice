# Development
FROM node:alpine AS development

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm 
RUN  pnpm install 
COPY . .
RUN npm run build

# Production
FROM node:alpine AS production

ARG NODE_ENV=production 
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm 
RUN  pnpm install --prod    
COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/books/main"]