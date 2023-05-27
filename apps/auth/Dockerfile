# Development
FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && \
    pnpm install

COPY . .
# The . in COPY . . means that all the files and directories in the build context will be copied into the root of the container. 

RUN pnpm run build

# Production
FROM node:alpine AS production

ARG NODE_ENV=production 
# ARG its variable just on the build time
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && \
    pnpm install --prod
    
# -- prod flag just for install  dependency and not dev dependency for example dont install the type on DevDependency

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/auth/main"]