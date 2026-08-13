FROM node:24-alpine

WORKDIR /repo
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN pnpm install --filter @muscupro/api... --frozen-lockfile

COPY apps/api apps/api
COPY packages/shared packages/shared
RUN pnpm --filter @muscupro/api build

ENV NODE_ENV=production
WORKDIR /repo/apps/api

EXPOSE 4000
CMD ["sh", "-c", "pnpm prisma:deploy && pnpm start"]
