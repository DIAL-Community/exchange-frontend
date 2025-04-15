FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat python3 git
WORKDIR /app
COPY .yarn         ./.yarn
COPY .yarnrc.yml   ./.yarnrc.yml
COPY package.json  ./package.json
COPY yarn.lock     ./yarn.lock
RUN yarn set version berry
RUN yarn install

FROM base AS build
LABEL stage=build
ENV NODE_ENV=production
# ENV NODE_OPTIONS=--max-old-space-size=2048
WORKDIR /app
COPY --from=base /app/.yarn         ./.yarn
COPY --from=base /app/.yarnrc.yml   ./.yarnrc.yml
COPY --from=base /app/node_modules  ./node_modules
COPY . .
RUN yarn build
RUN yarn sitemap

FROM node:22-alpine AS prod
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=build --chown=nextjs:nodejs /app/.next            ./.next
COPY --from=build --chown=nextjs:nodejs /app/.yarn            ./.yarn
COPY --from=build --chown=nextjs:nodejs /app/.yarnrc.yml      ./.yarnrc.yml
COPY --from=build --chown=nextjs:nodejs /app/.env.production  ./.env.production
COPY --from=build --chown=nextjs:nodejs /app/next.config.js   ./next.config.js
COPY --from=build --chown=nextjs:nodejs /app/public           ./public
COPY --from=build --chown=nextjs:nodejs /app/node_modules     ./node_modules
COPY --from=build --chown=nextjs:nodejs /app/package.json     ./package.json

USER nextjs

EXPOSE 3002

CMD yarn start
