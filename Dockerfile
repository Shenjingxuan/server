FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 创建 public 目录
RUN mkdir -p public

EXPOSE 3000
CMD ["node", "app.js"]