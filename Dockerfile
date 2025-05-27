# 1단계: 빌드 스테이지
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# ✅ .env 포함
COPY .env .
COPY . .

RUN npm run build

# 2단계: 런타임 이미지
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
