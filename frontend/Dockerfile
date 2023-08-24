FROM node:lts

# Copy the packages files into the container at /app
WORKDIR /app
COPY react-app/package-lock.json .
COPY react-app/package.json .

# update npm environment
RUN npm install -g npm@8.19.2
# package.json update
RUN npm install -g npm-check-updates
RUN ncu -u

# Install any needed packages specified in requirements.txt
RUN npm install

# Copy the rest of the code into the container at /app
COPY react-app/src ./src
COPY react-app/public ./public
COPY react-app/.eslintrc.cjs .
COPY react-app/index.html .
COPY react-app/tsconfig.json .
COPY react-app/tsconfig.node.json .
COPY react-app/vite.config.ts .

# RUN npm run build
ENTRYPOINT npm run build
