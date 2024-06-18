# Step 1: Use a Node.js base image
FROM node:18

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy the package.json and package-lock.json files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of your application files
COPY . .

# Step 6: Install TypeScript globally
RUN npm install -g typescript

# Step 7: Build the TypeScript files
RUN npm run build

# Step 8: Set the environment variable for production
ENV NODE_ENV=production

# Step 9: Expose the port your app runs on
EXPOSE 8080

# Step 10: Define the command to run your application
CMD ["node", "build/index.js"]
