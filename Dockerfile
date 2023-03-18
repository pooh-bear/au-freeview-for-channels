FROM node:16

RUN apt-get update && apt-get install -y yarn
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY package.json yarn.lock ./

# Install the dependencies in the container
RUN yarn install --frozen-lockfile --production

# Copy the rest of the application code to the container
COPY . .

# Build the TypeScript code in the container
RUN yarn build

ENV NODE_ENV production
EXPOSE 3000

CMD ["yarn", "start"]