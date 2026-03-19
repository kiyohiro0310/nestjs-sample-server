FROM node AS web_build

WORKDIR /usr/app/nestjs-server

COPY . .

RUN npm install && npm run build

CMD [ "node", "dist/src/main" ]

FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3001