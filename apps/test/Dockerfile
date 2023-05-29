# Development
FROM node:alpine AS development

RUN ls -la

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm 


RUN  pnpm install 

COPY . .

RUN npm run build

# Production
FROM node:alpine AS production

ARG NODE_ENV=production 
# ARG its variable just on the build time
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm 

RUN  pnpm install --prod
    
EXPOSE 4000

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/auth/main"]