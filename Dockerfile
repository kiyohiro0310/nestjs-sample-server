FROM node AS web_build

WORKDIR /usr/app/nestjs-server
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build

FROM node
WORKDIR /usr/app/nestjs-server
COPY --from=web_build /usr/app/nestjs-server ./dist
COPY --from=web_build /usr/app/nestjs-server/node_modules ./node_modules
COPY --from=web_build /usr/app/nestjs-server/package*.json ./

EXPOSE 3001
CMD [ "node", "dist/src/main" ]