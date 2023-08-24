FROM node:lts-alpine

# Copy the packages files into the container at /app
WORKDIR /app
COPY nestjs-app/package-lock.json .
COPY nestjs-app/package.json .

# update npm environment
RUN npm install -g npm@8.19.2
# package.json update
RUN npm install -g npm-check-updates
RUN ncu -u

# Install any needed packages specified in requirements.txt
RUN npm install

# Copy the rest of the code into the container at /app
COPY nestjs-app/src ./src
COPY nestjs-app/.eslintrc.js .
COPY nestjs-app/.prettierrc .
COPY nestjs-app/nest-cli.json .
COPY nestjs-app/tsconfig.build.json .
COPY nestjs-app/tsconfig.json .

# RUN npm run build
ENTRYPOINT npm run start
