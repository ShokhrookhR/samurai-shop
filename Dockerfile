FROM node:alpine

RUN npm install -g pnpm@12.4.2

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
CMD ["sh", "-c", "pnpm run build && pnpm run dev"]
