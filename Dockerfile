FROM oven/bun:1 as base
WORKDIR /app

# https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

## INSTALL STAGE
FROM base AS install
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

## PRERELEASE STAGE
# tests, build, etc
FROM base AS prerelease
COPY --from=install /app/node_modules node_modules
COPY . .
RUN bun test
RUN bun run build

## PRODUCTION STAGE
FROM base AS release
ENV NODE_ENV=production
RUN adduser --system --uid 1001 nextjs
RUN mkdir .next
RUN chown nextjs:bun .next

COPY --from=prerelease /app/.next/standalone ./
COPY --from=prerelease /app/public ./public
COPY --from=prerelease /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000/tcp
ENTRYPOINT ["bun", "server.js"]


# References
# https://bun.sh/guides/ecosystem/docker
# https://github.com/vercel/next.js/tree/canary/examples/with-docker